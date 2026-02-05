'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Plus, ArrowRight, Calendar, Globe, Target, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Lead {
    id: string;
    business_name: string;
    industry: string;
    created_at: string;
    website_url: string;
    primary_goal: string;
    strategy_markdown: string;
}

export default function StrategiesHistoryPage() {
    const supabase = createClient();
    const router = useRouter();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const checkUserAndFetchLeads = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
            setUser(session.user);

            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                setLeads(data);
            }
            setLoading(false);
        };

        checkUserAndFetchLeads();
    }, [supabase, router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const firstName = 
        user?.user_metadata?.first_name || 
        user?.user_metadata?.full_name?.split(' ')[0] || 
        user?.email?.split('@')[0] || 
        'Member';

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] font-sans text-[#1c1c1e]">
            {/* Nav */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="font-bold text-lg tracking-tight">MetaGen</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                             <User size={16} />
                             <span>{user?.email}</span>
                        </div>
                        <button 
                            onClick={handleSignOut}
                            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Welcome back, {firstName}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Strategies</h1>
                        <p className="text-gray-500 mt-2 text-sm">View and manage your AI-generated Meta Ads strategies history.</p>
                    </div>
                    <Link 
                        href="/questionnaire"
                        className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95"
                    >
                        <Plus size={18} />
                        New Strategy
                    </Link>
                </div>

                {leads.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                            <Globe size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No strategies found</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">You haven't generated any Meta Ads strategies yet. Start your first questionnaire now.</p>
                        <Link 
                            href="/questionnaire"
                            className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline"
                        >
                            Get Started <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {leads.map((lead) => (
                            <Link 
                                key={lead.id}
                                href={`/strategy/${lead.id}`}
                                className="group bg-[#fcfcfd] rounded-2xl border border-gray-200 p-6 hover:border-blue-600 hover:bg-white hover:shadow-xl hover:shadow-blue-600/5 transition-all flex flex-col relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl -translate-y-12 translate-x-12 group-hover:bg-blue-600/10 transition-colors" />
                                
                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-white text-blue-600 p-2 rounded-lg border border-gray-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm">
                                            <Globe size={18} />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">{lead.industry || 'Business'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                                        <Calendar size={12} />
                                        {new Date(lead.created_at).toLocaleDateString()}
                                    </div>
                                </div>

                                <h3 className="text-lg font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1 relative z-10">
                                    {lead.business_name}
                                </h3>

                                <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-500 relative z-10">
                                    <Target size={14} className="shrink-0 text-blue-500" />
                                    <span className="line-clamp-1">{lead.primary_goal || 'Custom Strategy'}</span>
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-[10px] font-black text-gray-400 group-hover:text-blue-600 transition-colors uppercase tracking-[0.2em] relative z-10">
                                    View full strategy
                                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
