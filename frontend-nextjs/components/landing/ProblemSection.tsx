"use client";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

export default function ProblemSection() {
    return (
        <section className="py-20 sm:py-24 md:py-32 container mx-auto px-4 sm:px-6">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid md:grid-cols-2 gap-12 md:gap-16 items-center"
            >

                {/* Left: Copy */}
                <motion.div variants={itemVariants}>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6">
                        Your pipeline is leaking.
                    </h2>
                    <div className="space-y-4 sm:space-y-6">
                        {[
                            {
                                title: "5-minute response time rule? Missed.",
                                desc: "By the time your rep wakes up, the lead has moved on."
                            },
                            {
                                title: "Demo scheduled for next Tuesday? They bought a competitor on Friday.",
                                desc: "Calendars kill deals. Speed wins."
                            },
                            {
                                title: "Sales Rep having a bad day? Deal lost.",
                                desc: "Human inconsistency is expensive."
                            }
                        ].map((problem, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="flex items-start gap-3 sm:gap-4"
                            >
                                <div className="mt-1 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                                    <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-medium text-white mb-1 sm:mb-2">{problem.title}</h3>
                                    <p className="text-zinc-400 text-sm">{problem.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right: Visual */}
                <motion.div variants={itemVariants} className="relative">
                    <div className="rounded-2xl border border-white/10 bg-surface p-6 sm:p-8 overflow-hidden">
                        {/* Calendar Grid */}
                        <div className="space-y-2">
                            <div className="text-[10px] sm:text-xs font-mono text-zinc-500 mb-3 sm:mb-4">SALES CALENDAR - MARCH 2025</div>
                            {[...Array(5)].map((_, weekIndex) => (
                                <div key={weekIndex} className="grid grid-cols-5 gap-1.5 sm:gap-2">
                                    {[...Array(5)].map((_, dayIndex) => (
                                        <div
                                            key={dayIndex}
                                            className="aspect-square rounded border border-white/5 bg-white/5 p-1 sm:p-2 relative"
                                        >
                                            <div className="text-[8px] sm:text-[10px] text-zinc-600">{weekIndex * 5 + dayIndex + 1}</div>
                                            {(weekIndex === 1 && dayIndex === 2) || (weekIndex === 2 && dayIndex === 4) || (weekIndex === 3 && dayIndex === 1) ? (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="text-[7px] sm:text-[8px] text-red-400 font-mono bg-red-500/10 px-1 py-0.5 rounded">
                                                        CANCELED
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Error Toast */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                        >
                            <div className="flex items-center gap-2">
                                <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                                <span className="text-xs sm:text-sm text-red-400 font-medium">Lead went cold</span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

            </motion.div>
        </section>
    );
}
