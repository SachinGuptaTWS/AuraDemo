"use client";
import { motion } from "framer-motion";

const integrations = [
    "Salesforce: Connected",
    "HubSpot: Synced",
    "SOC2: Type II",
    "GDPR: Compliant",
    "Azure: Powered",
    "OpenAI: GPT-4o",
    "WebRTC: Enabled",
    "Playwright: Integrated",
];

export default function SocialProof() {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="py-12 sm:py-16 border-t border-white/5 overflow-hidden"
        >
            <div className="mb-6 sm:mb-8 text-center px-4">
                <p className="text-xs sm:text-sm text-zinc-500">Trusted by technical teams at</p>
            </div>

            {/* Infinite Scrolling Marquee */}
            <div className="relative">
                <motion.div
                    className="flex gap-3 sm:gap-4"
                    animate={{
                        x: [0, -1400],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {[...integrations, ...integrations, ...integrations].map((item, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                        >
                            <span className="text-[10px] sm:text-xs font-mono text-zinc-300 whitespace-nowrap">
                                [ {item} ]
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
}
