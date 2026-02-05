'use client';

import { ArrowRight, Check, Star, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Use same data or subset, but ensure slugs match config/samples.ts
const SAMPLES = [
    {
        slug: "restaurant",
        company: "Bella Vita Ristorante",
        category: "Restaurant & Hospitality",
        icon: "🍝",
        color: "bg-orange-100 text-orange-600",
        metrics: { objective: "Leads (Reservations)", budget: "€600-900/month" },
        highlights: [
            "Authentic Italian certification branding",
            "Premium audience targeting (Expats & Foodies)",
            "Experience-focused messaging vs Food-only"
        ]
    },
    {
        slug: "ecommerce",
        company: "EcoThreads",
        category: "Sustainable Fashion",
        icon: "🌿",
        color: "bg-green-100 text-green-600",
        metrics: { objective: "Conversions (Sales)", budget: "$5,000/month" },
        highlights: [
            "Eco-conscious audience segmentation",
            "Visual storytelling (Production process)",
            "User-generated content (reviews) focus"
        ]
    },
    {
        slug: "saas",
        company: "TaskFlow",
        category: "SaaS Project Mgmt",
        icon: "⚡",
        color: "bg-blue-100 text-blue-600",
        metrics: { objective: "Free Trial Signups", budget: "$8,000/month" },
        highlights: [
            "Pain-point focused messaging (Chaos vs Order)",
            "Product demo video hooks",
            "Trial user retargeting funnel"
        ]
    },
    {
        slug: "local-services",
        company: "Sparkle Home Cleaning",
        category: "Local Services",
        icon: "✨",
        color: "bg-purple-100 text-purple-600",
        metrics: { objective: "Booking Requests", budget: "$3,000/month" },
        highlights: [
            "Before/After visual strategy",
            "Trust-building messaging (Vetted staff)",
            "First-time discount offer (Lead Magnet)"
        ]
    },
    {
        slug: "b2b",
        company: "ProMach Industrial",
        category: "B2B Equipment",
        icon: "🏗️",
        color: "bg-slate-100 text-slate-600",
        metrics: { objective: "Quote Requests", budget: "$6,000/month" },
        highlights: [
            "ROI-focused case studies",
            "Downtime cost calculator hook",
            "B2B decision-maker targeting (LinkedIn Sync)"
        ]
    }
];

import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function SamplesPage() {
    const router = useRouter();
    const supabase = createClient();

    const handleStart = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            router.push('/questionnaire');
        } else {
            router.push('/login');
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 py-4 px-6 backdrop-blur-md bg-white/70 border-b border-gray-100">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <span className="font-extrabold text-lg">M</span>
                        </div>
                        MetaGen
                    </div>
                    <Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                </div>
            </nav>

            <main className="py-20 px-4">
                {/* Header */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                        Sample Strategies
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
                        See What You'll Get
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Real examples of AI-generated strategies tailored to different industries, goals, and budgets.
                    </p>
                </div>

                {/* Grid */}
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {SAMPLES.map((sample, i) => (
                        <Link href={`/sample/${sample.slug}`} key={i} className="block group">
                            <div
                                className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all h-full"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${sample.color}`}>
                                        {sample.icon}
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <ArrowRight size={16} />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-bold text-xl text-gray-900 mb-1">{sample.company}</h3>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{sample.category}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-100">
                                    <div>
                                        <div className="text-xs text-gray-400 mb-1">Objective</div>
                                        <div className="text-sm font-semibold text-gray-700">{sample.metrics.objective}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 mb-1">Budget</div>
                                        <div className="text-sm font-semibold text-gray-700">{sample.metrics.budget}</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {sample.highlights.map((point, j) => (
                                        <div key={j} className="flex items-start gap-2 text-sm text-gray-600">
                                            <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                                            <span>{point}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="max-w-4xl mx-auto mt-24 text-center bg-gray-900 rounded-3xl p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <h2 className="text-3xl font-bold mb-6 relative z-10">Ready to Get Your Custom Strategy?</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto relative z-10">
                        Join 200+ businesses using AI to optimize their Meta Ads. It takes less than 60 seconds.
                    </p>
                    <button
                        onClick={handleStart}
                        className="relative z-10 inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition shadow-lg shadow-blue-900/20"
                    >
                        Generate My Strategy <ArrowRight size={20} />
                    </button>
                </div>
            </main>

            <footer className="text-center py-8 text-sm text-gray-400">
                © 2024 MetaGen AI. Powered by Manus.
            </footer>
        </div>
    );
}
