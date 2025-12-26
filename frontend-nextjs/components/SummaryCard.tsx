// Conversion summary card for end of demo

'use client';

import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Calendar, Mail, X } from 'lucide-react';
import { useState } from 'react';

interface SummaryCardProps {
    onClose: () => void;
    onBook: () => void;
    onEmail: (email: string) => void;
}

export default function SummaryCard({ onClose, onBook, onEmail }: SummaryCardProps) {
    const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
    const [email, setEmailInput] = useState('');

    const handleEmailSubmit = () => {
        if (email) {
            onEmail(email);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backdropFilter: 'blur(20px)', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
        >
            <motion.div
                initial={{ y: 100, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 100, opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', damping: 25 }}
                className="bg-void-800 border border-white/10 rounded-2xl p-8 max-w-md w-full relative"
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5 text-zinc-500" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Did you like what you saw?</h2>
                    <p className="text-sm text-zinc-400">Your feedback helps us improve</p>
                </div>

                {/* Thumbs Up/Down */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setFeedback('positive')}
                        className={`flex-1 p-6 border rounded-xl transition-all ${feedback === 'positive'
                                ? 'border-green-500 bg-green-500/10'
                                : 'border-white/10 hover:bg-white/5'
                            }`}
                    >
                        <ThumbsUp className={`w-8 h-8 mx-auto ${feedback === 'positive' ? 'text-green-500' : 'text-zinc-500'
                            }`} />
                    </button>

                    <button
                        onClick={() => setFeedback('negative')}
                        className={`flex-1 p-6 border rounded-xl transition-all ${feedback === 'negative'
                                ? 'border-red-500 bg-red-500/10'
                                : 'border-white/10 hover:bg-white/5'
                            }`}
                    >
                        <ThumbsDown className={`w-8 h-8 mx-auto ${feedback === 'negative' ? 'text-red-500' : 'text-zinc-500'
                            }`} />
                    </button>
                </div>

                {/* Primary CTA - Book Meeting */}
                <button
                    onClick={onBook}
                    className="w-full py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors mb-3 flex items-center justify-center gap-2"
                >
                    <Calendar className="w-5 h-5" />
                    <span>Book 30min with Human Expert</span>
                </button>

                {/* Secondary CTA - Email Recording */}
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="your@email.com"
                            className="flex-1 px-4 py-3 bg-void-900 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500/50"
                        />
                        <button
                            onClick={handleEmailSubmit}
                            className="px-6 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-2"
                        >
                            <Mail className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-xs text-zinc-500 text-center">
                        Send me the recording and transcript
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
