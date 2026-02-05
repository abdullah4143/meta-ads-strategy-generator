'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import ReactMarkdown from 'react-markdown';
import { Download, Calendar, ArrowLeft, Loader2, Share2, CheckCircle, Sparkles, Target, Award, Zap, BarChart3, TrendingUp, Info } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useManusPolling } from '@/hooks/useManusPolling';

interface Lead {
    id: string;
    business_name: string;
    strategy_markdown: string;
    ghl_synced: boolean;
    contact_email: string;
}

const STATUS_MESSAGES = [
    "Analyzing your website and brand voice...",
    "Researching your target audience demographics...",
    "Segmenting high-intent buyer personas...",
    "Drafting full-funnel marketing campaigns...",
    "Crafting direct-response ad copy variations...",
    "Optimizing budget for maximum ROI...",
    "Building your custom roadmap to scale..."
];

// Filter out conversational filler (intro preambles)
const cleanMarkdown = (text: string) => {
    if (!text) return '';

    // If the text starts with a header, it's likely clean
    if (text.trim().startsWith('#')) return text.trim();

    // Otherwise, try to find the first header
    const firstHeaderIndex = text.indexOf('#');
    if (firstHeaderIndex !== -1) {
        return text.substring(firstHeaderIndex).trim();
    }

    // Fallback: If no header found, just return original (or maybe try to strip first paragraph?)
    return text.trim();
};

const extractText = (node: any): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (!node) return '';
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (node.props && node.props.children) return extractText(node.props.children);
    return '';
};

export default function StrategyResult() {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params?.id as string;
    const taskIdFromUrl = searchParams.get('taskId');

    const supabase = createClient();

    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [taskId, setTaskId] = useState<string | null>(taskIdFromUrl);
    const [statusIndex, setStatusIndex] = useState(0);
    const [copied, setCopied] = useState(false);

    const polling = useManusPolling(
        lead?.strategy_markdown?.includes('Task initiated') ? taskId : null,
        id
    );

    // One-time Sync Lock
    const ghlSyncRef = useRef<boolean>(false);

    const syncToGHL = async (leadId: string) => {
        if (ghlSyncRef.current) return;
        ghlSyncRef.current = true;

        setSyncing(true);
        try {
            await fetch('/api/ghl-sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ leadId }),
            });
            setLead(prev => prev ? { ...prev, ghl_synced: true } : null);
        } catch (e) {
            console.error("Sync failed", e);
            ghlSyncRef.current = false; // Allow retry on failure
        } finally {
            setSyncing(false);
        }
    };

    useEffect(() => {
        if (!polling.output && lead?.strategy_markdown?.includes('Task initiated')) {
            const interval = setInterval(() => {
                setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
            }, 6000);
            return () => clearInterval(interval);
        }
    }, [polling.output, lead]);

    useEffect(() => {
        if (polling.status === 'completed' && polling.output) {
            setLead(prev => prev ? { ...prev, strategy_markdown: polling.output! } : null);
        }
    }, [polling.status, polling.output]);

    useEffect(() => {
        if (polling.status === 'completed' && lead && !lead.ghl_synced && !lead.strategy_markdown?.includes('Task initiated')) {
            syncToGHL(lead.id);
        }
    }, [polling.status, lead]);

    useEffect(() => {
        if (!id) return;

        const fetchLead = async () => {
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .eq('id', id)
                .single();

            if (data) {
                setLead(data);

                // If we don't have a taskId from URL, try to extract it from the initial strategy_markdown
                if (!taskId && data.strategy_markdown?.includes('ID: ')) {
                    const match = data.strategy_markdown.match(/ID: ([a-zA-Z0-9]+)/);
                    if (match && match[1]) {
                        setTaskId(match[1]);
                    }
                }

                // Only sync if strategy is ready and not already synced
                if (!data.strategy_markdown?.includes('Task initiated') && !data.ghl_synced) {
                    syncToGHL(data.id);
                }
            }
            setLoading(false);
        };

        fetchLead();
    }, [id, supabase, taskId]);

    const handlePrint = () => {
        window.print();
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCreateNew = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            window.location.href = '/questionnaire';
        } else {
            window.location.href = '/login';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    if (!lead) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Strategy Not Found</h2>
                <button onClick={handleCreateNew} className="text-blue-600 hover:underline">Create a new strategy</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFF] text-gray-900 font-sans selection:bg-blue-100">
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
                style={{ backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />

            <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <Link href="/strategies" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors self-start md:self-auto">
                        <ArrowLeft size={20} />
                        <span className="font-medium text-sm">Back to Strategies</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        {lead?.ghl_synced && (
                            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                                <CheckCircle size={10} /> CRM Synced
                            </span>
                        )}

                        <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-2 bg-white text-gray-600 px-4 py-2 rounded-xl font-semibold border border-gray-100 hover:bg-gray-50 transition shadow-sm active:scale-95 text-sm no-print"
                        >
                            {copied ? <CheckCircle size={16} className="text-green-600" /> : <Share2 size={16} />}
                            <span>{copied ? 'Copied' : 'Share'}</span>
                        </button>

                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/20 active:scale-95 text-sm no-print"
                        >
                            <Download size={16} />
                            <span>Export PDF</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Content (Markdown) */}
                    <div className="lg:col-span-2">
                        <div
                            id="strategy-content"
                            className="bg-white p-5 md:p-8 rounded-2xl shadow-xl border border-gray-100 min-h-150"
                        >
                            {/* Strategy Content Rendering */}
                            {(!polling.output && lead.strategy_markdown?.includes('Task initiated')) ? (
                                <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-100 min-h-120 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 animate-bounce shadow-inner">
                                        <Sparkles className="text-blue-600" size={32} />
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900 mb-2">Generating Your Strategy...</h2>
                                    <p className="text-gray-500 text-sm max-w-sm mb-8 leading-relaxed font-medium">
                                        Our AI is analyzing your audience and budget to build a custom high-converting plan. This typically takes 30-60 seconds.
                                    </p>

                                    <div className="w-full max-w-xs bg-gray-100 h-1.5 rounded-full overflow-hidden mb-6">
                                        <motion.div
                                            className="h-full bg-blue-600"
                                            animate={{
                                                width: ["0%", "30%", "45%", "60%", "75%", "90%"],
                                            }}
                                            transition={{
                                                duration: 45,
                                                ease: "linear"
                                            }}
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 bg-blue-50 px-5 py-2.5 rounded-full text-[11px] font-black tracking-[0.15em] text-blue-700 uppercase shadow-sm border border-blue-100">
                                        <Loader2 className="animate-spin" size={12} />
                                        <span>{STATUS_MESSAGES[statusIndex]}</span>
                                    </div>
                                </div>
                            ) : (polling.status === 'pending' && polling.output && polling.output.length < 500) ? (
                                <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-100 min-h-120 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner relative overflow-hidden">
                                        <div className="absolute inset-0 bg-blue-600/10 animate-[pulse_2s_infinite]" />
                                        <Sparkles className="text-blue-600 animate-bounce" size={32} />
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900 mb-2">Almost Ready...</h2>
                                    <p className="text-gray-500 text-sm max-w-sm mb-8 leading-relaxed font-medium">
                                        AI has started writing your strategy. We are now expanding the sections and finalizing the details.
                                    </p>

                                    <div className="flex items-center gap-3 bg-blue-50 px-5 py-2.5 rounded-full text-[11px] font-black tracking-[0.15em] text-blue-700 uppercase shadow-sm border border-blue-100">
                                        <Loader2 className="animate-spin" size={12} />
                                        <span>{polling.isResearching ? 'Engine: Deep Researching...' : 'Engine: Expanding Strategy...'}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <AnimatePresence>
                                        {(polling.status === 'pending' && polling.output && polling.output.length >= 500) && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-center justify-between gap-4 mb-6 shadow-sm"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                                        <Loader2 className="animate-spin" size={14} />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <p className="font-black text-blue-900 text-xs uppercase tracking-wider leading-none mb-1">
                                                            {polling.isResearching ? 'Engine: Deep Research' : 'Engine: Strategy Build'}
                                                        </p>
                                                        <p className="text-[10px] text-blue-600 font-medium">Fetching live data & composing chapters...</p>
                                                    </div>
                                                </div>
                                                <div className="items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest hidden md:flex bg-white px-3 py-1 rounded-full border border-blue-100">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                                                    LIVE STREAM
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <ReactMarkdown
                                        components={{
                                            h1: ({ children }) => (
                                                <div className="mb-10 border-b border-gray-100 pb-6 pt-2">
                                                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight leading-tight">{children}</h1>
                                                    <div className="flex items-center gap-3">
                                                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-200">
                                                            Master Strategy
                                                        </span>
                                                    </div>
                                                </div>
                                            ),
                                            h2: ({ children }) => {
                                                const text = extractText(children).toLowerCase();
                                                let Icon = Target;

                                                if (text.includes('business') || text.includes('analysis')) Icon = BarChart3;
                                                if (text.includes('audience') || text.includes('targeting')) Icon = Target;
                                                if (text.includes('creative') || text.includes('hook') || text.includes('copy')) Icon = Zap;
                                                if (text.includes('budget') || text.includes('roi') || text.includes('scale')) Icon = TrendingUp;
                                                if (text.includes('timeline') || text.includes('next steps') || text.includes('execut')) Icon = CheckCircle;
                                                if (text.includes('overview') || text.includes('summary')) Icon = Info;

                                                return (
                                                    <div className="mt-20 mb-10 first:mt-0 group/section">
                                                        <div className="bg-gray-50/50 p-8 rounded-4xl border border-gray-100 flex items-center justify-between mb-8 group-hover/section:bg-blue-50/50 transition-colors duration-500">
                                                            <div className="flex items-center gap-6">
                                                                <div className="w-14 h-14 bg-white text-blue-700 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm group-hover/section:bg-blue-600 group-hover/section:text-white group-hover/section:border-blue-600 transition-all duration-300">
                                                                    <Icon size={28} strokeWidth={2.5} />
                                                                </div>
                                                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 uppercase tracking-tight">{children}</h2>
                                                            </div>
                                                            <div className="hidden md:flex flex-col items-end">
                                                                <span className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em]">Strategy</span>
                                                                <div className="w-12 h-1 bg-blue-600 rounded-full mt-2" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            },
                                            h3: ({ children }) => (
                                                <h3 className="text-xl md:text-2xl font-black text-gray-900 mt-12 mb-6 flex items-center gap-4">
                                                    <span className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
                                                    {children}
                                                </h3>
                                            ),
                                            h4: ({ children }) => (
                                                <div className="bg-blue-50/40 border-l-4 border-blue-600 px-6 py-5 rounded-r-3xl my-8 group/h4 shadow-sm">
                                                    <h4 className="text-base md:text-lg font-black text-blue-900 uppercase tracking-wider flex items-center gap-3">
                                                        <Target size={18} className="text-blue-600" />
                                                        {children}
                                                    </h4>
                                                </div>
                                            ),
                                            p: ({ children }) => (
                                                <p className="text-gray-700 leading-relaxed mb-6 text-[15px] md:text-lg font-medium">{children}</p>
                                            ),
                                            ul: ({ children }) => (
                                                <ul className="flex flex-col gap-4 my-8">{children}</ul>
                                            ),
                                            li: ({ children }) => {
                                                const textContent = extractText(children);
                                                const isHeaderLike = textContent.includes('Persona ') || textContent.includes('Target Audience ');
                                                const isDescription = textContent.includes('Description:') || textContent.includes('Segment Description:');

                                                // Check for nested UL
                                                const hasNestedList = Array.isArray(children) && children.some(c =>
                                                    c && typeof c === 'object' && 'props' in c && c.props?.node?.tagName === 'ul'
                                                );

                                                if (isHeaderLike) {
                                                    return (
                                                        <li className="mb-6 mt-8 list-none w-full">
                                                            <div className="flex items-center gap-4">
                                                                <div className="flex items-center gap-2.5 bg-blue-50 px-5 py-2 rounded-full border border-blue-100 shadow-sm shrink-0">
                                                                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                                                                    <span className="text-[11px] font-black text-blue-700 uppercase tracking-widest">{children}</span>
                                                                </div>
                                                                <div className="h-px flex-1 bg-linear-to-l from-blue-600/30 to-transparent" />
                                                            </div>
                                                        </li>
                                                    );
                                                }

                                                if (hasNestedList) {
                                                    return (
                                                        <li className="list-none bg-white p-8 md:p-12 rounded-4xl border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-600/5 transition-all duration-500 w-full">
                                                            {children}
                                                        </li>
                                                    );
                                                }

                                                if (isDescription) {
                                                    return (
                                                        <li className="flex items-start gap-4 p-6 bg-blue-50/30 rounded-3xl border border-blue-100/50 hover:bg-blue-50/50 transition-all duration-300 list-none w-full">
                                                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                                                <Info size={14} strokeWidth={2.5} />
                                                            </div>
                                                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                                                                <div className="text-gray-800 font-medium text-[16px] leading-relaxed 
                                                                    [&_strong]:text-blue-800 [&_strong]:font-black [&_strong]:uppercase [&_strong]:text-[11px] [&_strong]:tracking-widest [&_strong]:block [&_strong]:mb-2">
                                                                    {children}
                                                                </div>
                                                            </div>
                                                        </li>
                                                    );
                                                }

                                                return (
                                                    <li className="flex items-start gap-4 p-5 bg-gray-50/50 rounded-3xl border border-gray-100/50 group/item hover:bg-white hover:border-blue-200 hover:shadow-md transition-all duration-300 list-none w-full">
                                                        <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-blue-600 shrink-0 mt-0.5 group-hover/item:bg-blue-600 group-hover/item:text-white group-hover/item:border-blue-600 transition-all duration-300 shadow-sm">
                                                            <CheckCircle size={12} strokeWidth={3} />
                                                        </div>
                                                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                                                            <div className="text-gray-700 font-semibold text-[15px] leading-relaxed 
                                                                [&_strong]:text-blue-700 [&_strong]:font-black [&_strong]:uppercase [&_strong]:text-[11px] [&_strong]:tracking-widest [&_strong]:block [&_strong]:mb-1 [&_strong]:opacity-90">
                                                                {children}
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            },
                                            strong: ({ children }) => (
                                                <strong className="font-black text-blue-700">{children}</strong>
                                            ),
                                            blockquote: ({ children }) => (
                                                <div className="relative bg-gray-900 p-6 rounded-2xl my-10 border-l-8 border-blue-600 shadow-xl">
                                                    <div className="text-white text-base font-bold italic leading-relaxed">
                                                        "{children}"
                                                    </div>
                                                    <div className="mt-3 text-blue-400 font-black uppercase tracking-[0.2em] text-[10px]">
                                                        Expert Implementation Insight
                                                    </div>
                                                </div>
                                            ),
                                        }}
                                    >
                                        {cleanMarkdown(polling.output || lead?.strategy_markdown || '')}
                                    </ReactMarkdown>
                                </div>
                            )}

                            {/* Branding Footer for PDF */}
                            <div className="mt-8 pt-4 border-t border-gray-100 text-center text-gray-400 text-[10px]">
                                Generated by Meta Ads Strategy Generator AI
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">

                        {/* CTA Card */}
                        <div className="bg-gray-900 p-6 md:p-8 rounded-4xl text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600 rounded-full blur-[80px] opacity-20 -translate-y-24 translate-x-24" />

                            <div className="relative z-10">
                                <h3 className="text-xl font-black mb-3 leading-tight italic uppercase tracking-tighter">Ready to Scale?</h3>
                                <p className="text-gray-400 mb-6 text-sm font-medium leading-relaxed">
                                    This plan is just the architecture. Our elite team can handle the <span className="text-blue-400">media buying</span>, <span className="text-blue-400">creative production</span>, and <span className="text-blue-400">CRO</span> to turn this into profit.
                                </p>

                                <a
                                    href={process.env.NEXT_PUBLIC_CALENDLY_URL || "#"}
                                    target="_blank"
                                    className="flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-xl text-[10px]"
                                >
                                    Book Scaling Call
                                    <Zap size={14} fill="currentColor" />
                                </a>
                            </div>
                        </div>

                        {/* Guidance & Actions Card */}
                        <div className="bg-white p-6 md:p-8 rounded-4xl border-2 border-gray-50 shadow-sm space-y-8">
                            <div>
                                <h4 className="text-gray-400 font-black uppercase tracking-widest text-[9px] mb-4">Pro Tips & Guidance</h4>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                                            <Download size={18} className="text-blue-600" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-black text-gray-900 uppercase tracking-tight">Save for Reference</p>
                                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                                                Click the <span className="text-blue-600 font-bold">Export PDF</span> button above to save this strategy locally before closing the window.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                                            <Info size={18} className="text-gray-400" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-tight">Stream Issues?</p>
                                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                                                If the content stops loading or isn't visible, try refreshing the page. The AI may still be finalizing the draft in the background.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                                            <CheckCircle size={18} className="text-green-600" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-black text-gray-900 uppercase tracking-tight">Execution Ready</p>
                                            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                                                This strategy uses the <span className="font-bold">AIDA framework</span> and is optimized for manual or Advantage+ Meta Ads campaigns.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
