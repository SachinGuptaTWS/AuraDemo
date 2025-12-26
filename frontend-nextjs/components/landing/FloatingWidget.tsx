"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StickyDemoWidget() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const [shouldBounce, setShouldBounce] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show widget after scrolling past 500px
            setIsVisible(window.scrollY > 500);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Gentle bounce every 10 seconds if user ignores it
    useEffect(() => {
        if (!isVisible) return;

        const bounceInterval = setInterval(() => {
            setShouldBounce(true);
            setTimeout(() => setShouldBounce(false), 500);
        }, 10000);

        return () => clearInterval(bounceInterval);
    }, [isVisible]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed bottom-8 right-8 z-50"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{
                        y: shouldBounce ? [-5, 0] : 0,
                        opacity: 1
                    }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                    <div className="flex items-center gap-3 px-6 py-4 bg-black/80 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
                        {/* Status Indicator */}
                        <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm text-zinc-300 font-medium">Agent is ready</span>
                        </div>

                        {/* CTA Button */}
                        <motion.button
                            onClick={() => router.push('/demo')}
                            className="px-4 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-zinc-200 transition-colors flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Play className="w-3 h-3 fill-current" />
                            Start Call
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
