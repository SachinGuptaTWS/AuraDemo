"use client";
import { motion } from "framer-motion";
import { Zap, Eye, Globe, MousePointer2 } from "lucide-react";

const features = [
    {
        title: "GPT-4o Realtime",
        desc: "Sub-500ms voice latency. It feels instant.",
        icon: Zap,
        colSpan: "col-span-12 md:col-span-8",
        bg: "bg-gradient-to-br from-blue-500/10 to-transparent"
    },
    {
        title: "Computer Vision",
        desc: "The agent sees your screen every 2s.",
        icon: Eye,
        colSpan: "col-span-12 md:col-span-4",
        bg: "bg-surface"
    },
    {
        title: "Multilingual",
        desc: "Fluent in 50+ languages.",
        icon: Globe,
        colSpan: "col-span-12 md:col-span-4",
        bg: "bg-surface"
    },
    {
        title: "Browser Control",
        desc: "Autonomous Playwright navigation.",
        icon: MousePointer2,
        colSpan: "col-span-12 md:col-span-8",
        bg: "bg-gradient-to-br from-indigo-500/10 to-transparent"
    }
];

export default function BentoGrid() {
    return (
        <section className="py-24 relative">
            <div className="container mx-auto px-4">

                <div className="text-center mb-16">
                    <h2 className="text-3xl font-semibold mb-4">Under the Hood</h2>
                    <p className="text-zinc-400">Powered by the Azure OpenAI Ecosystem.</p>
                </div>

                <div className="grid grid-cols-12 gap-4 max-w-5xl mx-auto">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`${f.colSpan} relative group overflow-hidden rounded-3xl border border-white/5 bg-surface p-8 hover:border-white/10 transition-colors`}
                        >
                            <div className={`absolute inset-0 ${f.bg} opacity-20`} />

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="p-3 bg-white/5 w-fit rounded-xl mb-4 border border-white/10">
                                    <f.icon className="w-6 h-6 text-zinc-100" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-medium mb-2 text-zinc-100">{f.title}</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
