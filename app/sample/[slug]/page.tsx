'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { ArrowLeft, CheckCircle2, Target, Users, Zap, Layout, MessageSquare, BarChart3, ArrowRight } from 'lucide-react';
import { SAMPLES_DATA } from '@/config/samples';
import { notFound } from 'next/navigation';

export default function SampleDetailPage() {
    const params = useParams();
    const router = useRouter();
    const supabase = createClient();
    const slug = params.slug as string;
    const strategy = SAMPLES_DATA[slug];

    const handleStart = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            router.push('/questionnaire');
        } else {
            router.push('/login');
        }
    };

    if (!strategy && slug) {
        // If slug exists but not key, try to match by partial or just return 404
        // For now, if exact match fails, 404
        // Ideally we would use `notFound()` but this is client component for simplicity here
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <h1 className="text-2xl font-bold mb-4">Strategy Not Found</h1>
                <Link href="/samples" className="text-blue-600 hover:underline">Back to Samples</Link>
            </div>
        );
    }

    if (!strategy) return null;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 py-4 px-6 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-lg">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm">M</div>
                        MetaGen
                    </div>
                    <Link href="/samples" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition">
                        <ArrowLeft size={16} /> All Samples
                    </Link>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 pt-10">

                {/* Header / Hero */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${strategy.color}`}>
                                {strategy.icon}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{strategy.name}</h1>
                                <div className="text-gray-500 font-medium">{strategy.businessType}</div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="px-4 py-2 bg-gray-100 rounded-lg text-center">
                                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Goal</div>
                                <div className="font-bold text-gray-900">{strategy.goal}</div>
                            </div>
                            <div className="px-4 py-2 bg-gray-100 rounded-lg text-center">
                                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Budget</div>
                                <div className="font-bold text-gray-900">{strategy.budget}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Executive Summary */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Zap className="text-amber-500" size={20} /> Executive Summary
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        {strategy.executiveSummary}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* Target Audience */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm h-full">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Users className="text-blue-500" size={20} /> Target Audience
                        </h2>

                        <div className="mb-6">
                            <div className="flex justify-between items-baseline mb-2">
                                <h3 className="font-bold text-gray-900">Primary Segment</h3>
                                <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{strategy.audiences.primary.segment}</span>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                    <span>Age Range</span>
                                    <span className="font-medium text-gray-900">{strategy.audiences.primary.demographics.age}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                    <span>Gender</span>
                                    <span className="font-medium text-gray-900">{strategy.audiences.primary.demographics.gender}</span>
                                </div>
                                <div className="flex justify-between py-1 border-b border-gray-100">
                                    <span>Location</span>
                                    <span className="font-medium text-gray-900">{strategy.audiences.primary.demographics.location}</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="text-xs font-semibold text-gray-400 uppercase mb-2">Interests</div>
                                <div className="flex flex-wrap gap-2">
                                    {strategy.audiences.primary.interests.map(i => (
                                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">{i}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Value Props */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm h-full">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Target className="text-red-500" size={20} /> Value Proposition
                        </h2>
                        <div className="space-y-4">
                            {strategy.valueProps.map((prop, i) => (
                                <div key={i} className="flex gap-3">
                                    <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={20} />
                                    <span className="text-gray-700 font-medium">{prop}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Campaign Structure */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm mb-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Layout className="text-purple-500" size={20} /> Campaign Strategy
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {strategy.campaigns.map((camp, i) => (
                            <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Campaign {i + 1}</div>
                                <h3 className="font-bold text-gray-900 mb-2">{camp.name}</h3>
                                <div className="text-sm text-purple-600 font-medium mb-3">{camp.objective}</div>
                                <p className="text-sm text-gray-500 mb-4">{camp.description}</p>
                                <div className="text-xs bg-white p-2 rounded border border-gray-200 text-gray-600">
                                    <strong>Creative:</strong> {camp.creative}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Targeting & Ad Copy */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <BarChart3 className="text-blue-500" size={20} /> Advanced Targeting
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Lookalike Audiences</h4>
                                <ul className="space-y-1">
                                    {strategy.targeting.lookalikes.map((lal, i) => (
                                        <li key={i} className="flex gap-2 text-sm text-gray-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5"></div>
                                            {lal}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Retargeting Layers</h4>
                                <ul className="space-y-1">
                                    {strategy.targeting.retargeting.map((rt, i) => (
                                        <li key={i} className="flex gap-2 text-sm text-gray-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5"></div>
                                            {rt}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <MessageSquare className="text-pink-500" size={20} /> Ad Creative Example
                        </h2>
                        {strategy.adCopy.map((ad, i) => (
                            <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                                <div className="text-xs text-gray-400 uppercase font-bold mb-3">Feed Ad Preview</div>
                                <div className="font-bold text-gray-900 mb-2">{ad.headline}</div>
                                <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{ad.primaryText}</p>
                                <div className="w-full bg-gray-200 py-2 rounded text-center text-sm font-semibold text-gray-600 uppercase">
                                    {ad.cta}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-gray-900 rounded-3xl p-10 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/30 rounded-full blur-3xl pointer-events-none"></div>
                    <h2 className="text-2xl font-bold mb-4 relative z-10">Get a strategy like this for your business</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto relative z-10">
                        Our AI will analyze your specific industry, goals, and audience to generate a completely custom roadmap in under 60 seconds.
                    </p>
                    <button
                        onClick={handleStart}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg relative z-10"
                    >
                        Generate My Strategy <ArrowRight size={18} />
                    </button>
                </div>

            </main>
        </div>
    );
}
