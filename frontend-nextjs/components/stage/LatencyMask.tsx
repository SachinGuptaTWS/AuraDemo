'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface LatencyMaskProps {
    isVisible: boolean;
}

export default function LatencyMask({ isVisible }: LatencyMaskProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="absolute inset-0 bg-white pointer-events-none z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.2,
                        times: [0, 0.5, 1],
                    }}
                />
            )}
        </AnimatePresence>
    );
}
