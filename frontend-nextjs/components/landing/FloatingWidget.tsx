"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";

export default function StickyDemoWidget() {
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
                    <div className="flex items-center px-5 py-3 bg-black/90 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
                        {/* CTA Button */}
                        <motion.a
                            href="#contact"
                            className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-zinc-100 transition-all flex items-center gap-2 shadow-lg"
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(255,255,255,0.2)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Talk to Agent
                        </motion.a>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
