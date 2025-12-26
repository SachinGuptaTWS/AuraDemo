'use client';

import { motion } from 'framer-motion';

interface MagicTriggerProps {
    onClick: () => void;
}

export default function MagicTrigger({ onClick }: MagicTriggerProps) {
    return (
        <motion.button
            onClick={onClick}
            className="fixed bottom-8 right-8 z-50 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative">
                {/* Pulsing ring animation */}
                <div className="absolute inset-0 rounded-full bg-primary opacity-75 animate-ping" />

                {/* Main button */}
                <div className="relative flex items-center gap-3 bg-gradient-to-r from-primary to-secondary px-6 py-4 rounded-full shadow-2xl">
                    <span className="text-white font-bold text-lg">Start Interactive Demo</span>
                    <svg
                        className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                    </svg>
                </div>
            </div>
        </motion.button>
    );
}
