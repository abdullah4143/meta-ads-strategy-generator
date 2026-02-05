'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleAuthCallback = async () => {
            const code = searchParams.get('code');
            const errorParam = searchParams.get('error');
            const errorDesc = searchParams.get('error_description');

            if (code) {
                setLoading(true);
                const { error } = await supabase.auth.exchangeCodeForSession(code);
                if (!error) {
                    setSuccessMessage('Account verified successfully! Please sign in.');
                    // Optional: Clear URL params without reloading
                    window.history.replaceState({}, '', '/login');
                } else {
                    setError('Verification failed. The link may be invalid or expired.');
                }
                setLoading(false);
            } else if (errorParam) {
                setError(errorDesc || 'Authentication failed');
            }
        };

        handleAuthCallback();
    }, [searchParams, supabase.auth]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/strategies');
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans text-[#1c1c1e]">
            {/* Dot pattern background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.4]"
                style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            <div className="w-full max-w-[420px] bg-white rounded-[24px] shadow-sm border border-gray-100 p-8 relative z-10">
                <div className="text-center mb-8">
                    <div className="w-10 h-10 bg-black rounded-[8px] flex items-center justify-center text-white mx-auto mb-6 shadow-sm">
                        {/* Simple Logo Placeholder based on reference */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Sign in</h1>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="sr-only">Email address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            className="w-full h-[46px] px-4 rounded-[10px] bg-[#F2F4F7] border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400 text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Your password"
                                className="w-full h-[46px] px-4 rounded-[10px] bg-[#F2F4F7] border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-gray-400 text-sm"
                                required
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

                    <div className="flex justify-end">
                        <Link href="#" className="text-xs text-gray-500 hover:text-gray-900">Forgot password?</Link>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="p-3 bg-green-50 text-green-600 text-xs rounded-lg text-center">
                            {successMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-[46px] bg-black text-white rounded-[10px] font-semibold text-sm hover:bg-gray-800 transition-all disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign In'}
                    </button>
                </form>

                <div className="my-8 flex items-center gap-3">
                    <div className="h-[1px] flex-1 bg-gray-100"></div>
                    <span className="text-xs text-gray-400 font-medium bg-white px-1">OR</span>
                    <div className="h-[1px] flex-1 bg-gray-100"></div>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        Don&apos;t have an account? <Link href="/signup" className="text-blue-600 font-semibold hover:underline">Sign up</Link>
                    </p>
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
