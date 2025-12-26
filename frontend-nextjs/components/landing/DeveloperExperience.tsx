'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

const codeSnippet = `<script src="https://cdn.aurademo.com/agent.js"
  data-id="agent_123"
  data-theme="dark">
</script>`;

export default function DeveloperExperience() {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(codeSnippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="py-32 border-t border-glass-border">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Copy */}
                    <div>
                        <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 tracking-tight" style={{ letterSpacing: '-0.03em' }}>
                            One Line of Code
                        </h2>
                        <p className="text-xl text-zinc-400 mb-8">
                            No complex integrations. No SDK downloads. Just paste this snippet before your closing <code className="text-indigo-400 font-mono">&lt;/body&gt;</code> tag.
                        </p>
                        <ul className="space-y-4 text-zinc-400">
                            <li className="flex items-start gap-3">
                                <span className="text-signal-emerald mt-1">✓</span>
                                <span>Zero configuration required</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-signal-emerald mt-1">✓</span>
                                <span>Works with any tech stack</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-signal-emerald mt-1">✓</span>
                                <span>Auto-updates with new features</span>
                            </li>
                        </ul>
                    </div>

                    {/* Right Side - Code Block */}
                    <div className="relative">
                        <div className="bg-void rounded-xl border border-glass-border overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-glass-border">
                                <span className="text-xs font-mono text-zinc-500">index.html</span>
                                <motion.button
                                    onClick={handleCopy}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-glass-panel rounded-lg text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4 text-signal-emerald" />
                                            <span className="text-signal-emerald">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            <span>Copy</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>

                            {/* Code */}
                            <pre className="p-6 overflow-x-auto">
                                <code className="text-sm font-mono text-zinc-300">
                                    <span className="text-indigo-400">&lt;script</span>{' '}
                                    <span className="text-blue-400">src</span>=
                                    <span className="text-green-400">"https://cdn.aurademo.com/agent.js"</span>
                                    {'\n  '}
                                    <span className="text-blue-400">data-id</span>=
                                    <span className="text-green-400">"agent_123"</span>
                                    {'\n  '}
                                    <span className="text-blue-400">data-theme</span>=
                                    <span className="text-green-400">"dark"</span>
                                    <span className="text-indigo-400">&gt;</span>
                                    {'\n'}
                                    <span className="text-indigo-400">&lt;/script&gt;</span>
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
