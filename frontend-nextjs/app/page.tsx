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
import DeveloperExperience from "@/components/landing/DeveloperExperience";

// --- COMPONENTS ---

// 1. The Floating Navbar
const Navbar = () => {
    const router = useRouter();

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl"
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="relative rounded-full border border-white/10 bg-black/50 backdrop-blur-xl px-6 py-3 flex items-center justify-between shadow-2xl"
            >
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex items-center gap-2"
                >
                    <LogoIcon variant="glow" className="w-8 h-8" />
                    <span className="text-sm font-semibold tracking-tight text-white">Slink</span>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="hidden md:flex gap-8 text-xs font-medium text-zinc-400"
                >
                    {['Product', 'Solutions', 'Pricing', 'Docs'].map((item, index) => (
                        <motion.a
                            key={item}
                            href="#"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                            className="hover:text-white transition-colors"
                        >
                            {item}
                        </motion.a>
                    ))}
                </motion.div>
                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/demo')}
                    className="text-xs font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors"
                >
                    Start Demo
                </motion.button>
            </motion.div>
        </motion.nav>
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
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            ref={containerRef}
            className="min-h-screen bg-void relative overflow-hidden selection:bg-purple-500/30"
        >

            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 container mx-auto px-6 text-center">

                {/* The "Living Aurora" Background Blob */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: 0.5,
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        opacity: { duration: 1.2, ease: "easeOut" },
                        scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"
                />
                <div className="absolute inset-0 bg-grid-white opacity-20 pointer-events-none" />

                {/* H1 Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-8"
                    style={{ letterSpacing: '-0.04em' }}
                >
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                    >
                        The end of <br />
                    </motion.span>
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
                        className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40"
                    >
                        "Book a Demo."
                    </motion.span>
                </motion.h1>

                {/* Subheader */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 mb-12 leading-relaxed"
                >
                    Deploy an autonomous AI Sales Engineer. Sub-500ms latency. Infinite scale.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    {/* Primary CTA with Shimmer */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push('/demo')}
                        className="group relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 shimmer-button"
                    >
                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-colors hover:bg-slate-900 gap-2">
                            <Play className="w-4 h-4 fill-current" />
                            Experience Live Demo
                        </span>
                    </motion.button>

                    {/* Secondary CTA */}
                    <motion.button
                        whileHover={{ scale: 1.05, x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-12 px-8 rounded-full text-sm font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-2"
                    >
                        View Documentation <ArrowRight className="w-4 h-4" />
                    </motion.button>
                </motion.div>
            </section>

            {/* Social Proof */}
            <SocialProof />

            {/* Problem Section */}
            <ProblemSection />

            {/* Interactive Bento Grid */}
            <InteractiveBento />

            {/* Developer Experience */}
            <DeveloperExperience />

            {/* Massive Footer */}
            <MassiveFooter />

            {/* Sticky Demo Widget */}
            <StickyDemoWidget />
        </motion.main>
    );
}
