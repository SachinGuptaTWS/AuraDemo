// Floating trigger button for buyer journey

'use client';

import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface TriggerButtonProps {
    onClick: () => void;
}

export default function TriggerButton({ onClick }: TriggerButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            className="fixed bottom-6 right-6 z-50 group"
            whileHover={{ scale: 1.05 }}
            animate={{
                rotate: [0, 3, -3, 0],
            }}
            transition={{
                rotate: {
                    repeat: Infinity,
                    duration: 5,
                    ease: "easeInOut"
                }
            }}
        >
            <div className="flex items-center gap-3 px-6 py-4 bg-white text-black rounded-full shadow-2xl hover:shadow-3xl transition-shadow">
                <Play className="w-5 h-5 fill-current" />
                <span className="font-semibold text-sm">Start Live Demo</span>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-white/20 blur-xl group-hover:bg-white/30 transition-all -z-10" />
        </motion.button>
    );
}
