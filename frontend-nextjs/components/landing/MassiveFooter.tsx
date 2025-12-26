"use client";

import { motion } from "framer-motion";

export default function MassiveFooter() {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative py-24 sm:py-28 md:py-32 border-t border-white/5 overflow-hidden"
        >
            {/* Gradient Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                {/* Massive CTA Text */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-center mb-16 sm:mb-20"
                >
                    <h2
                        className="text-5xl sm:text-7xl md:text-8xl lg:text-[120px] font-bold tracking-tighter leading-none mb-6"
                        style={{
                            background: 'linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.4) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            letterSpacing: '-0.04em'
                        }}
                    >
                        Ready to deploy?
                    </h2>
                </motion.div>

                {/* Links Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 max-w-4xl mx-auto mb-12 sm:mb-16"
                >
                    {/* Product */}
                    <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-white mb-3 sm:mb-4 uppercase tracking-wider">Product</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            <li><a href="#" className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors">Features</a></li>
                            <li><a href="#" className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors">Pricing</a></li>
                            <li><a href="#" className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors">Changelog</a></li>
                        </ul>
                    </div>

                    {/* Developers */}
                    <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-white mb-3 sm:mb-4 uppercase tracking-wider">Developers</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            <li><a href="#" className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors">API Docs</a></li>
                            <li><a href="#" className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors">Status</a></li>
                            <li><a href="#" className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors">GitHub</a></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-white mb-3 sm:mb-4 uppercase tracking-wider">Company</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            <li><a href="#" className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors">About</a></li>
                            <li>
                                <a href="#" className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors">
                                    Careers
                                </a>
                            </li>
                            <li><a href="#" className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors">Legal</a></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-white mb-3 sm:mb-4 uppercase tracking-wider">Resources</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            <li><a href="#" className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors">Community</a></li>
                            <li><a href="#" className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors">Support</a></li>
                        </ul>
                    </div>
                </motion.div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="pt-6 sm:pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4"
                >
                    <p className="text-xs sm:text-sm text-zinc-500 text-center md:text-left">&copy; 2025 Slink Inc. Built on Azure OpenAI.</p>
                    <div className="flex items-center gap-4 sm:gap-6">
                        <a href="#" className="text-xs sm:text-sm text-zinc-500 hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="text-xs sm:text-sm text-zinc-500 hover:text-white transition-colors">Terms</a>
                        <a href="#" className="text-xs sm:text-sm text-zinc-500 hover:text-white transition-colors">Security</a>
                    </div>
                </motion.div>
            </div>
        </motion.footer>
    );
}
