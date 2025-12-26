"use client";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1]
        }
    }
};

export default function InteractiveBento() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const playAudioSample = () => {
        setIsPlaying(true);
        // Simulate audio playback
        setTimeout(() => setIsPlaying(false), 2000);
    };

    return (
        <section className="py-20 sm:py-24 md:py-32 container mx-auto px-4 sm:px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="mb-12 sm:mb-16"
            >
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3 sm:mb-4">
                    The technology stack.
                </h2>
                <p className="text-zinc-400 text-base sm:text-lg">Enterprise-grade infrastructure that scales infinitely.</p>
            </motion.div>

            {/* 3x2 Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto"
            >

                {/* Card 1: GPT-4o Realtime (Large - Spans 2 columns on desktop) */}
                <motion.div
                    variants={cardVariants}
                    className="lg:col-span-2 group relative rounded-2xl bg-surface border border-white/5 p-6 sm:p-8 overflow-hidden cursor-pointer"
                    onClick={playAudioSample}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="card-spotlight absolute inset-0 rounded-2xl z-20" />

                    <div className="relative z-10">
                        <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">GPT-4o Realtime</h3>
                        <p className="text-sm sm:text-base text-zinc-400 mb-6 sm:mb-8">Sub-500ms voice latency. Natural conversation flow.</p>

                        {/* Live Waveform Visualizer */}
                        <div className="flex items-center gap-1 h-20 sm:h-24">
                            {[...Array(40)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="flex-1 bg-blue-500 rounded-full"
                                    animate={isPlaying ? {
                                        height: [
                                            `${20 + Math.random() * 60}%`,
                                            `${20 + Math.random() * 60}%`,
                                            `${20 + Math.random() * 60}%`,
                                        ],
                                    } : { height: "20%" }}
                                    transition={{
                                        duration: 0.3,
                                        repeat: isPlaying ? Infinity : 0,
                                        delay: i * 0.02,
                                    }}
                                />
                            ))}
                        </div>

                        {isPlaying && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-3 sm:mt-4 text-xs sm:text-sm text-blue-400 font-mono"
                            >
                                "Hi, I'm Aura. How can I help you today?"
                            </motion.p>
                        )}
                    </div>
                </motion.div>

                {/* Card 2: Computer Vision (Small) */}
                <motion.div
                    variants={cardVariants}
                    className="group relative rounded-2xl bg-surface border border-white/5 p-6 sm:p-8 overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="card-spotlight absolute inset-0 rounded-2xl z-20" />

                    <div className="relative z-10">
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Computer Vision</h3>
                        <p className="text-xs sm:text-sm text-zinc-400 mb-4 sm:mb-6">DOM analysis every 2000ms.</p>

                        {/* Bounding Boxes Animation */}
                        <div className="relative w-full h-28 sm:h-32 bg-zinc-900 rounded border border-white/5">
                            <motion.div
                                className="absolute top-2 left-2 w-12 sm:w-16 h-6 sm:h-8 border-2 border-blue-500 rounded"
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <motion.div
                                className="absolute bottom-2 right-2 w-10 sm:w-12 h-5 sm:h-6 border-2 border-blue-500 rounded"
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Card 3: Global Infrastructure (Small) */}
                <motion.div
                    variants={cardVariants}
                    className="group relative rounded-2xl bg-surface border border-white/5 p-6 sm:p-8 overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="card-spotlight absolute inset-0 rounded-2xl z-20" />

                    <div className="relative z-10">
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Global Infrastructure</h3>
                        <p className="text-xs sm:text-sm text-zinc-400 mb-4 sm:mb-6">Multi-region deployment.</p>

                        {/* Spinning Globe Placeholder */}
                        <div className="relative w-full h-28 sm:h-32 flex items-center justify-center">
                            <motion.div
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-blue-500/30 relative"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="absolute inset-0 rounded-full border-2 border-blue-500/50 border-dashed" />
                                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-blue-500/30" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Card 4: Ephemeral Security (Large - Spans 2 columns) */}
                <motion.div
                    variants={cardVariants}
                    className="lg:col-span-2 group relative rounded-2xl bg-surface border border-white/5 p-6 sm:p-8 overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="card-spotlight absolute inset-0 rounded-2xl z-20" />

                    <div className="relative z-10">
                        <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">Ephemeral Security</h3>
                        <p className="text-sm sm:text-base text-zinc-400 mb-6 sm:mb-8">Sessions destroyed instantly. Zero data persistence.</p>

                        {/* Docker Container Disintegration */}
                        <div className="relative h-28 sm:h-32 flex items-center justify-center">
                            <motion.div
                                className="relative"
                                animate={{
                                    scale: [1, 1.2, 0],
                                    opacity: [1, 0.5, 0],
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center">
                                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20 12v6c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-6h16zm-2-6H6c-1.1 0-2 .9-2 2v2h16V8c0-1.1-.9-2-2-2z" />
                                    </svg>
                                </div>
                            </motion.div>
                        </div>

                        <p className="text-[10px] sm:text-xs text-zinc-500 font-mono text-center">Container lifecycle: 5 seconds</p>
                    </div>
                </motion.div>

            </motion.div>
        </section>
    );
}
