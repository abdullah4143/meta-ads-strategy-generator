'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, PlayCircle, BarChart3, Users, Zap, Target, LayoutTemplate, MousePointerClick, Check } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LANDING_COPY } from '@/config/copy';
import { useFormStore } from '@/store/useFormStore';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function Home() {
  const router = useRouter();
  const resetForm = useFormStore((state) => state.resetForm);
  const supabase = createClient();

  const handleStart = async () => {
    resetForm();
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      router.push('/strategies');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-x-hidden">
      {/* Background Glow Effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] bg-blue-100/30 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 py-4 px-6 backdrop-blur-md bg-white/70 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="font-extrabold text-lg">M</span>
            </div>
            MetaGen
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleStart} className="hidden md:block text-sm font-medium text-gray-600 hover:text-primary transition">Sign In</button>
            <button onClick={handleStart} className="bg-primary text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-20 pb-32 px-4">

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {LANDING_COPY.pill}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
            Get Your Custom <br />
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Meta Ads Strategy</span>
            —Free
          </h1>

          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            {LANDING_COPY.hero.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStart}
              className="w-full sm:w-auto bg-primary text-white h-14 px-8 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-1 transition-all"
            >
              {LANDING_COPY.hero.cta}
              <ArrowRight size={20} />
            </button>
            <Link
              href="/samples"
              className="w-full sm:w-auto bg-white text-gray-700 h-14 px-8 rounded-xl font-bold text-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center"
            >
              {LANDING_COPY.hero.secondaryCta}
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span>Generated in 45 seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span>Full PDF Report</span>
            </div>
          </div>
        </div>

        {/* Social Proof Strip */}
        <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mb-32 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <h3 className="font-bold text-lg mb-1">Trusted by 200+ Businesses</h3>
            <p className="text-gray-500 text-sm">{LANDING_COPY.socialProof.text}</p>
          </div>
          <div className="flex items-center gap-12 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900">{LANDING_COPY.socialProof.strategies}</div>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">Strategies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{LANDING_COPY.socialProof.thisWeek}</div>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">This Week</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{LANDING_COPY.socialProof.businesses}</div>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">Clients</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-6xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-gray-500">Three simple steps to your new ad campaign.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {LANDING_COPY.process.steps.map((step, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                <div className="w-12 h-12 bg-primary rounded-xl text-white flex items-center justify-center font-bold text-xl mb-6 relative z-10">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold mb-3 relative z-10">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What you get</h2>
            <p className="text-gray-500">A complete strategy document ready for execution.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LANDING_COPY.features.map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 transition-colors group">
                <div className="w-10 h-10 bg-white rounded-lg border border-gray-100 flex items-center justify-center text-primary mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <Check size={20} strokeWidth={3} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white text-xs">M</div>
            MetaGen
          </div>
          <p className="text-sm text-gray-400">© 2024 MetaGen AI. Powered by Manus.</p>
        </div>
      </footer>
    </div>
  );
}
