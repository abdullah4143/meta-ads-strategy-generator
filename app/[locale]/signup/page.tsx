'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function SignupPage() {
    const t = useTranslations();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (password !== confirmPassword) {
            setError(t('auth.signup.passwordMismatch'));
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError(t('auth.signup.passwordTooShort'));
            setLoading(false);
            return;
        }

        // Call API to send OTP
        const response = await fetch('/api/auth/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
                firstName,
                lastName,
                type: 'signup'
            }),
        });

        const data = await response.json();
        setLoading(false);

        if (!response.ok) {
            // Handle specific error cases
            if (response.status === 409) {
                setError(t('auth.signup.emailExists'));
            } else {
                setError(data.error || t('auth.signup.sendOtpError'));
            }
        } else {
            // Redirect to OTP verification page
            router.push(`/verify-otp?email=${encodeURIComponent(email)}&type=signup`);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans text-[#1c1c1e]">
            {/* Dot pattern background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.4]"
                style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            <div className="w-full max-w-[480px] bg-white rounded-[24px] shadow-sm border border-gray-100 p-8 relative z-10">
                <div className="text-center mb-8">
                    <div className="flex justify-end mb-4">
                        <LanguageSwitcher />
                    </div>
                    <div className="w-10 h-10 bg-black rounded-[8px] flex items-center justify-center text-white mx-auto mb-6 shadow-sm">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">{t('auth.signup.title')}</h1>
                    <p className="text-gray-500 text-sm mt-2">{t('auth.signup.subtitle')}</p>
                </div>

                {message ? (
                    <div className="bg-green-50 border border-green-100 rounded-[12px] p-6 text-center animate-fade-in">
                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        </div>
                        <h3 className="font-bold text-green-800 mb-1">{t('auth.signup.verifyHeading')}</h3>
                        <p className="text-green-700 text-sm">{message}</p>
                        <p className="text-xs text-green-600 mt-4">{t('auth.signup.checkSpam')}</p>
                        <div className="mt-4">
                            <Link href="/login" className="text-xs font-semibold text-green-700 underline">{t('auth.signup.proceedToLogin')}</Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="sr-only">{t('auth.signup.firstName')}</label>
                                <input
                                    id="firstName"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder={t('auth.signup.firstName')}
                                    className="w-full h-[46px] px-4 rounded-[10px] bg-[#F2F4F7] border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400 text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="sr-only">{t('auth.signup.lastName')}</label>
                                <input
                                    id="lastName"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder={t('auth.signup.lastName')}
                                    className="w-full h-[46px] px-4 rounded-[10px] bg-[#F2F4F7] border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400 text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="sr-only">{t('auth.signup.email')}</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('auth.signup.emailPlaceholder')}
                                className="w-full h-[46px] px-4 rounded-[10px] bg-[#F2F4F7] border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400 text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="sr-only">{t('auth.signup.password')}</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('auth.signup.createPassword')}
                                    className="w-full h-[46px] px-4 rounded-[10px] bg-[#F2F4F7] border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400 text-sm"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">{t('auth.signup.confirmPassword')}</label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder={t('auth.signup.confirmPassword')}
                                    className="w-full h-[46px] px-4 rounded-[10px] bg-[#F2F4F7] border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400 text-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-[46px] bg-black text-white rounded-[10px] font-semibold text-sm hover:bg-gray-800 transition-all disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : t('auth.signup.createAccount')}
                        </button>
                    </form>
                )}

                <div className="my-6">
                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            {t('auth.signup.alreadyHaveAccount')} <Link href="/login" className="text-blue-600 font-semibold hover:underline">{t('auth.signup.signIn')}</Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <span>Powered by Manus</span>
                </div>
            </div>

            <div className="mt-8 flex gap-6 text-xs text-gray-500 font-medium">
                <Link href="#" className="hover:text-gray-900">Terms of service</Link>
                <Link href="#" className="hover:text-gray-900">Privacy policy</Link>
                <span>© 2024 MetaGen</span>
            </div>
        </div>
    );
}
