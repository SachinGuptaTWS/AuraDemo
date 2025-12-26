"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, ArrowRight, Zap, Globe, Cpu } from "lucide-react";
import { useRouter } from "next/navigation";
import LogoIcon from "@/components/ui/LogoIcon";
import SocialProof from "@/components/landing/SocialProof";
import ProblemSection from "@/components/landing/ProblemSection";
import InteractiveBento from "@/components/landing/InteractiveBento";
import StickyDemoWidget from "@/components/landing/FloatingWidget";
import MassiveFooter from "@/components/landing/MassiveFooter";

// --- COMPONENTS ---

// 1. The Floating Navbar
const Navbar = () => {
    const router = useRouter();

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
            <div className="relative rounded-full border border-white/10 bg-black/50 backdrop-blur-xl px-6 py-3 flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    <span className="text-sm font-semibold tracking-tight text-white">AuraDemo</span>
                </div>
                <div className="hidden md:flex gap-8 text-xs font-medium text-zinc-400">
                    {['Product', 'Solutions', 'Pricing', 'Docs'].map((item) => (
                        <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
                    ))}
                </div>
                <button
                    onClick={() => router.push('/demo')}
                    className="text-xs font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors"
                >
                    Start Demo
                </button>
            </div>
        </nav>
    );
};

// --- MAIN PAGE ---

export default function LandingPage() {
    const router = useRouter();

    // Mouse Tracking Logic for Spotlights
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            container.style.setProperty("--mouse-x", `${x}px`);
            container.style.setProperty("--mouse-y", `${y}px`);
        };

        container.addEventListener("mousemove", handleMouseMove);
        return () => container.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <main ref={containerRef} className="min-h-screen bg-void relative overflow-hidden selection:bg-purple-500/30">

            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 container mx-auto px-6 text-center">

                {/* The "Aurora" Background Blob */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
                <div className="absolute inset-0 bg-grid-white opacity-20 pointer-events-none" />

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 mb-8 backdrop-blur-sm"
                >
                    <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-300">
                        v2.0 Public Beta
                    </span>
                </motion.div>

                {/* H1 Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-8"
                >
                    The end of <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
                        "Book a Demo."
                    </span>
                </motion.h1>

                {/* Subheader */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 mb-12 leading-relaxed"
                >
                    Deploy an autonomous AI Sales Engineer that qualifies leads,
                    runs live video demos, and closes deals 24/7.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    {/* Primary CTA with Shimmer */}
                    <button
                        onClick={() => router.push('/demo')}
                        className="group relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                    >
                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-colors hover:bg-slate-900 gap-2">
                            <Play className="w-4 h-4 fill-current" />
                            Experience Live Demo
                        </span>
                    </button>

                    {/* Secondary CTA */}
                    <button className="h-12 px-8 rounded-full text-sm font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-2">
                        Read Documentation <ArrowRight className="w-4 h-4" />
                    </button>
                </motion.div>
            </section>

            {/* Social Proof */}
            <SocialProof />

            {/* Problem Section */}
            <ProblemSection />

            {/* Interactive Bento Grid */}
            <InteractiveBento />

            {/* Massive Footer */}
            <MassiveFooter />

            {/* Sticky Demo Widget */}
            <StickyDemoWidget />
        </main>
    );
}
