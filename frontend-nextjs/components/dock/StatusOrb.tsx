'use client';

import { motion } from 'framer-motion';
import { useSessionStore } from '@/store/useSessionStore';

type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface StatusOrbProps {
    state: OrbState;
}

export default function StatusOrb({ state }: StatusOrbProps) {
    if (state === 'idle') {
        return (
            <div className="w-2.5 h-2.5 rounded-full border-2 border-zinc-500" />
        );
    }

    if (state === 'listening') {
        return (
            <div className="relative w-2.5 h-2.5">
                <motion.div
                    className="absolute inset-0 rounded-full bg-signal-emerald"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-signal-emerald"
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            </div>
        );
    }

    if (state === 'thinking') {
        return (
            <motion.div
                className="w-2.5 h-2.5 rounded-full border-2 border-signal-amber border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
        );
    }

    // Speaking - 3 bar waveform
    return (
        <div className="flex gap-0.5 items-center h-2.5">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="w-0.5 bg-signal-blue rounded-full"
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
    );
}
