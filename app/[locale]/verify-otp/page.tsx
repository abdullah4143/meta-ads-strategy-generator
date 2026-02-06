'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link, useRouter } from '@/i18n/routing';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

function VerifyOTPForm() {
    const t = useTranslations();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resending, setResending] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const type = searchParams.get('type') || 'signup'; // 'signup' or 'recovery'

    useEffect(() => {
        if (!email) {
            router.push('/signup');
        }
    }, [email, router]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join('');
        
        if (otpCode.length !== 6) {
            setError(t('auth.verifyOtp.incompleteCode'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    otp: otpCode,
                    type
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || t('auth.verifyOtp.verificationFailed'));
                setLoading(false);
            } else {
                if (type === 'recovery') {
                    // Pass email to reset password page
                    router.push(`/reset-password?email=${encodeURIComponent(email)}`);
                } else {
                    router.push('/login?verified=true');
                }
            }
        } catch {
            setError(t('auth.verifyOtp.verificationFailed'));
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    type
                }),
            });

            if (response.ok) {
                setResendTimer(60);
            } else {
                setError(t('auth.verifyOtp.resendFailed'));
            }
        } catch {
            setError(t('auth.verifyOtp.resendFailed'));
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans text-[#1c1c1e]">
            {/* Dot pattern background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.4]"
                style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-sm border border-gray-100 p-8 relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <Link href="/signup" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                        <ArrowLeft size={16} />
                        {t('common.back')}
                    </Link>
                    <LanguageSwitcher />
                </div>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('auth.verifyOtp.title')}</h1>
                    <p className="text-gray-500 text-sm">
                        {t('auth.verifyOtp.subtitle')}<br />
                        <span className="font-semibold text-gray-700">{email}</span>
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleVerify} className="space-y-6">
                    <div className="flex gap-3 justify-center">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 text-center text-xl font-bold bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                required
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otp.some(d => !d)}
                        className="w-full h-11.5 bg-black text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={16} />
                                {t('auth.verifyOtp.verifying')}
                            </>
                        ) : (
                            t('auth.verifyOtp.verify')
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500 mb-3">
                        {t('auth.verifyOtp.didntReceive')}
                    </p>
                    <button
                        onClick={handleResend}
                        disabled={resending || resendTimer > 0}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {resending ? t('auth.verifyOtp.sending') : resendTimer > 0 ? t('auth.verifyOtp.resendIn', { seconds: resendTimer }) : t('auth.verifyOtp.resendCode')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function VerifyOTPPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        }>
            <VerifyOTPForm />
        </Suspense>
    );
}
