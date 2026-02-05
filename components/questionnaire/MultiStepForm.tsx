'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles, Check, Loader2 } from 'lucide-react';
import { useFormStore } from '@/store/useFormStore';
import { QUESTIONNAIRE_DATA } from '@/config/questionnaire';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function MultiStepForm() {
    const router = useRouter();
    const supabase = createClient();
    const { step, setStep, formData, updateFormData, resetForm } = useFormStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const currentStepData = QUESTIONNAIRE_DATA.find((s) => s.step === step);

    const handleInputChange = (id: string, value: any) => {
        updateFormData({ [id]: value });
    };

    const validateStep = () => {
        if (!currentStepData) return false;
        for (const field of currentStepData.fields) {
            if (field.required) {
                // @ts-ignore
                const value = formData[field.id];
                if (!value || (typeof value === 'string' && value.trim() === '')) {
                    return false;
                }
            }
        }
        return true;
    };

    const handleNext = async () => {
        if (!validateStep()) {
            setError('Please fill in all required fields.');
            return;
        }
        setError(null);

        // Step 1 -> 2: Auth Check moved to Landing Page guard.
        // Double check session in case of deep link / direct access
        if (step === 1) {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
        }

        if (step < 5) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/generate-strategy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                resetForm();
                router.push(`/strategy/${result.leadId}?taskId=${result.taskId}`);
            } else {
                setError(result.error || 'Failed to generate strategy.');
                setIsLoading(false);
            }
        } catch (error) {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-50 text-center p-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Sparkles className="text-blue-600 animate-spin-slow" size={32} />
                </div>
                <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    AI is analyzing your website...
                </h2>
                <p className="text-gray-500 max-w-md">
                    Generating Step-by-Step Campaign Plan, Ad Copies, and Targeting Strategy. <br />This takes about 45 seconds.
                </p>
            </div>
        );
    }

    if (!currentStepData) return null;

    return (
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl w-full">
            {/* Sidebar - Desktop Only */}
            <div className="hidden lg:flex flex-col w-64 shrink-0 space-y-2 pt-12">
                {QUESTIONNAIRE_DATA.map((s) => (
                    <div
                        key={s.step}
                        className={cn(
                            "flex items-center gap-3 p-3 rounded-xl transition-all",
                            step === s.step ? "bg-white shadow-sm border border-gray-100" : "opacity-50"
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs",
                            step === s.step ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : 
                            step > s.step ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                        )}>
                            {step > s.step ? <Check size={14} strokeWidth={3} /> : s.step}
                        </div>
                        <div className="flex flex-col">
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest",
                                step === s.step ? "text-blue-600" : "text-gray-400"
                            )}>Step {s.step}</span>
                            <span className={cn(
                                "text-sm font-bold",
                                step === s.step ? "text-gray-900" : "text-gray-500"
                            )}>{s.title}</span>
                        </div>
                    </div>
                ))}

                <div className="mt-auto p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-2 italic">Pro Tip</p>
                    <p className="text-[11px] text-blue-800 leading-relaxed font-medium">
                        Provide a specific **Core Offer** to get 3x more accurate ad copy recommendations.
                    </p>
                </div>
            </div>

            {/* Main Form Card */}
            <div className="flex-1 bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col min-h-[600px]">
                {/* Progress Bar */}
                <div className="w-full h-1 bg-gray-50">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${currentStepData.progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                    />
                </div>

                <div className="p-8 md:p-12 lg:p-16 flex-1 flex flex-col text-gray-900">
                    {/* Header */}
                    <div className="mb-10 text-left">
                        <div className="flex items-center gap-2 mb-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                             <span className="text-[10px] font-black text-blue-600 tracking-[0.2em] uppercase">MetaGen Intelligence</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight">{currentStepData.header}</h1>
                        <p className="text-gray-500 font-medium leading-relaxed max-w-xl">{currentStepData.subtext}</p>
                    </div>

                    {/* Fields */}
                    <div className="flex-1 space-y-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                {currentStepData.fields.map((field) => (
                                    <div key={field.id} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm shadow-gray-200/30 hover:shadow-xl hover:shadow-blue-600/5 hover:border-blue-100 transition-all duration-500 group flex flex-col space-y-6">
                                        <div className="flex border-b border-gray-50 pb-5 items-end justify-between">
                                            <div className="flex flex-col space-y-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                                                    <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 group-focus-within:text-blue-600 transition-colors">
                                                        {field.label}
                                                    </label>
                                                </div>
                                                {field.description && (
                                                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed pl-4">
                                                        <span className="text-blue-600/60 font-black mr-1">TIPS:</span>
                                                        {field.description}
                                                    </p>
                                                )}
                                            </div>
                                            {field.required && (
                                                <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100 mb-1">
                                                    <div className="w-1 h-1 rounded-full bg-orange-400 animate-pulse" />
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Required</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="relative">
                                            {/* Render inputs based on type */}
                                            {field.type === 'text' || field.type === 'url' || field.type === 'email' || field.type === 'number' || field.type === 'date' ? (
                                                <input
                                                    type={field.type}
                                                    placeholder={field.placeholder}
                                                    // @ts-ignore
                                                    value={formData[field.id] || ''}
                                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal"
                                                />
                                            ) : field.type === 'textarea' ? (
                                                <textarea
                                                    placeholder={field.placeholder}
                                                    // @ts-ignore
                                                    value={formData[field.id] || ''}
                                                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                    rows={4}
                                                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal resize-none"
                                                />
                                            ) : field.type === 'select' ? (
                                                <div className="relative">
                                                    <select
                                                        // @ts-ignore
                                                        value={formData[field.id] || ''}
                                                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                        className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all font-semibold text-gray-900 appearance-none cursor-pointer"
                                                    >
                                                        <option value="" disabled>Select an option</option>
                                                        {field.options?.map(opt => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-blue-600 transition-colors">
                                                        <ChevronRight size={20} className="rotate-90 stroke-[3]" />
                                                    </div>
                                                </div>
                                            ) : field.type === 'radio-cards' ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {field.options?.map((opt: any) => (
                                                        <button
                                                            key={opt.value}
                                                            type="button"
                                                            onClick={() => handleInputChange(field.id, opt.value)}
                                                            className={cn(
                                                                "p-5 rounded-2xl border transition-all flex flex-col items-start gap-4 text-left group/card",
                                                                // @ts-ignore
                                                                formData[field.id] === opt.value
                                                                    ? "border-blue-600 bg-blue-50/30 ring-1 ring-blue-600 shadow-lg shadow-blue-600/5"
                                                                    : "border-gray-100 bg-gray-50/30 hover:border-blue-300 hover:bg-white"
                                                            )}
                                                        >
                                                            <div className="flex items-center justify-between w-full">
                                                                <div className={cn(
                                                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                                                    // @ts-ignore
                                                                    formData[field.id] === opt.value ? "border-blue-600 bg-blue-600" : "border-gray-200 bg-white"
                                                                )}>
                                                                    {/* @ts-ignore */}
                                                                    {formData[field.id] === opt.value && <Check size={12} className="text-white stroke-[4]" />}
                                                                </div>
                                                                {/* @ts-ignore */}
                                                                {formData[field.id] === opt.value && (
                                                                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-100 px-2 py-0.5 rounded-full">Selected</div>
                                                                )}
                                                            </div>
                                                            <div className="space-y-1">
                                                                <span className={cn(
                                                                    "text-sm font-black transition-colors",
                                                                    // @ts-ignore
                                                                    formData[field.id] === opt.value ? "text-blue-700" : "text-gray-900"
                                                                )}>{opt.label}</span>
                                                                <p className="text-[11px] font-medium text-gray-500 leading-snug">{opt.desc}</p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer Nav */}
                    <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between gap-4">
                        <button
                            onClick={handleBack}
                            disabled={step === 1}
                            className={cn(
                                "flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                                step === 1 ? "opacity-0 pointer-events-none" : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                            )}
                        >
                            <ChevronLeft size={16} strokeWidth={3} />
                            Back
                        </button>

                        <div className="flex items-center gap-4">
                             {error && <span className="text-xs font-bold text-red-500 bg-red-50 px-4 py-2 rounded-full animate-shake">{error}</span>}
                             
                             <button
                                onClick={handleNext}
                                className="flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 active:scale-95 transition-all shadow-lg shadow-blue-600/10"
                            >
                                {step === 5 ? (
                                    <>
                                        <Sparkles size={16} />
                                        Generate Strategy
                                    </>
                                ) : (
                                    <>
                                        Next Step
                                        <ChevronRight size={16} strokeWidth={3} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {currentStepData.footerNote && (
                        <p className="mt-6 text-[10px] text-gray-400 font-medium text-center italic leading-relaxed">
                            {currentStepData.footerNote}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function CheckCircle2(props: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
