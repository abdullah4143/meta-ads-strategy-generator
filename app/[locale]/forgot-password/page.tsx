'use client';

import { useState } from 'react';
import { useRouter, Link } from '@/i18n/routing';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function ForgotPasswordPage() {
    const t = useTranslations();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const response = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    type: 'recovery'
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || t('auth.forgotPassword.sendError'));
            } else {
                setMessage(t('auth.forgotPassword.codeSent'));
                setTimeout(() => {
                    router.push(`/verify-otp?type=recovery&email=${encodeURIComponent(email)}`);
                }, 2000);
            }
        } catch {
            setError(t('auth.forgotPassword.sendError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans text-[#1c1c1e]">
            {/* Dot pattern background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.4]"
                style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-sm border border-gray-100 p-8 relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <Link href="/login" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                        <ArrowLeft size={16} />
                        {t('auth.forgotPassword.backToLogin')}
                    </Link>
                    <LanguageSwitcher />
                </div>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Mail className="text-blue-600" size={28} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('auth.forgotPassword.title')}</h1>
                    <p className="text-gray-500 text-sm">
                        {t('auth.forgotPassword.subtitle')}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            {t('auth.forgotPassword.emailLabel')}
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('auth.forgotPassword.emailPlaceholder')}
                            className="w-full h-11.5 px-4 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400 text-sm"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11.5 bg-black text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={16} />
                                {t('auth.forgotPassword.sending')}
                            </>
                        ) : (
                            t('auth.forgotPassword.sendCode')
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
