"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function Hero() {
    const router = useRouter();
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

    return (
        <motion.section
            ref={ref}
            style={{ opacity, scale }}
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-4 sm:px-6"
        >

            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
            <div className="absolute inset-0 bg-grid-white opacity-20 pointer-events-none" />

            <div className="container mx-auto text-center relative z-10">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 mb-6 sm:mb-8 backdrop-blur-sm"
                >
                    <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-zinc-300">
                        v2.0 Public Beta
                    </span>
                </motion.div>

                {/* H1 Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tighter text-white mb-6 sm:mb-8 px-4"
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
                    className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-zinc-400 mb-8 sm:mb-12 leading-relaxed px-4"
                >
                    Deploy an autonomous AI Sales Engineer that qualifies leads,
                    runs live video demos, and closes deals 24/7.
                </motion.p>

                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
                >
                    {/* Primary CTA with Shimmer */}
                    <button
                        onClick={() => router.push('/demo')}
                        className="w-full sm:w-auto group relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                    >
                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 sm:px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl transition-colors hover:bg-slate-900 gap-2">
                            <Play className="w-4 h-4 fill-current" />
                            Experience Live Demo
                        </span>
                    </button>

                    {/* Secondary CTA */}
                    <button className="w-full sm:w-auto h-12 px-6 sm:px-8 rounded-full text-sm font-medium text-zinc-300 hover:text-white transition-colors flex items-center justify-center gap-2">
                        Read Documentation <ArrowRight className="w-4 h-4" />
                    </button>
                </motion.div>
            </div>
        </motion.section>
    );
}
