"use client";

import { motion, AnimatePresence } from "framer-motion";

interface LatencyMaskProps {
    isProcessing: boolean;
    actionLabel: string;
}

export default function LatencyMask({ isProcessing, actionLabel }: LatencyMaskProps) {
    return (
        <AnimatePresence>
            {isProcessing && (
                <>
                    {/* Subtle Blur Overlay (2px - barely noticeable) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 backdrop-blur-[2px] z-10 pointer-events-none"
                    />

                    {/* Shimmer Effect (Optional) */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0 z-10 pointer-events-none"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)'
                        }}
                    />

                    {/* Toast Message - Top Right */}
                    <motion.div
                        initial={{ opacity: 0, y: 10, x: 20 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: -10, x: 20 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25
                        }}
                        className="absolute top-20 right-6 z-20 glass-panel px-4 py-2 rounded-lg shadow-xl"
                    >
                        <div className="flex items-center gap-2">
                            <motion.div
                                className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <span className="text-xs text-sonik-text-mid font-light">
                                {actionLabel}
                            </span>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
