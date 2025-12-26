"use client";

import { motion, AnimatePresence } from "framer-motion";

interface StatusPillProps {
    state: 'listening' | 'thinking' | 'speaking';
}

// Global Spring Configuration (PRD Section 2.1)
const springConfig = {
    type: "spring" as const,
    stiffness: 300,
    damping: 25,
    mass: 1
};

export default function StatusPill({ state }: StatusPillProps) {
    const getStatusConfig = () => {
        if (state === 'speaking') {
            return {
                text: "Speaking",
                icon: "waveform",
                dotClass: "bg-signal-blue",
                textColor: "text-white"
            };
        }

        if (state === 'listening') {
            return {
                text: "Listening",
                icon: "pulse",
                dotClass: "bg-signal-emerald",
                textColor: "text-white"
            };
        }

        return {
            text: "Thinking",
            icon: "spinner",
            dotClass: "bg-signal-amber",
            textColor: "text-white"
        };
    };

    const config = getStatusConfig();

    return (
        <motion.div
            layout
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={springConfig}
            className="px-6 py-3 bg-zinc-900/70 backdrop-blur-2xl rounded-full border border-white/5 flex items-center gap-3 shadow-panel"
            style={{
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.4)'
            }}
        >
            {/* Status Indicator (Morphing Orb) */}
            <div className="relative flex h-2.5 w-2.5">
                {config.icon === "pulse" && (
                    <>
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.dotClass} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${config.dotClass}`}></span>
                    </>
                )}
                {config.icon === "spinner" && (
                    <motion.div
                        className={`absolute inset-0 border-2 border-signal-amber border-t-transparent rounded-full`}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                )}
                {config.icon === "waveform" && (
                    <div className="flex gap-0.5 items-center h-full">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className={`w-0.5 ${config.dotClass} rounded-full`}
                                animate={{
                                    height: ["40%", "100%", "40%"],
                                }}
                                transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Status Text with Morphing Animation (PRD Section 2.2) */}
            <AnimatePresence mode="wait">
                <motion.span
                    key={config.text}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={springConfig}
                    className={`text-xs font-medium ${config.textColor} tracking-wide uppercase`}
                    style={{ letterSpacing: '0.05em' }}
                >
                    {config.text}
                </motion.span>
            </AnimatePresence>
        </motion.div>
    );
}
