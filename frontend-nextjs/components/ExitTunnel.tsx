'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExitTunnelProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ExitTunnel({ isOpen, onClose }: ExitTunnelProps) {
    const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
    const [email, setEmail] = useState('');

    const handleBookMeeting = () => {
        // Integration with calendar service (Calendly, etc.)
        window.open('https://calendly.com/your-team/demo', '_blank');
    };

    const handleSendRecording = () => {
        // Send recording to email
        console.log('Sending recording to:', email);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="w-full max-w-lg mx-4 bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                    >
                        <div className="p-8 text-center">
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Thanks for watching!
                            </h2>

                            {/* Feedback */}
                            <div className="mb-8">
                                <p className="text-gray-300 mb-4">Did you like what you saw?</p>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={() => setFeedback('up')}
                                        className={`p-4 rounded-full transition-all ${feedback === 'up'
                                                ? 'bg-green-500 scale-110'
                                                : 'bg-white/10 hover:bg-white/20'
                                            }`}
                                    >
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setFeedback('down')}
                                        className={`p-4 rounded-full transition-all ${feedback === 'down'
                                                ? 'bg-red-500 scale-110'
                                                : 'bg-white/10 hover:bg-white/20'
                                            }`}
                                    >
                                        <svg className="w-8 h-8 text-white transform rotate-180" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Primary CTA */}
                            <button
                                onClick={handleBookMeeting}
                                className="w-full mb-4 px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-purple-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg"
                            >
                                📅 Book 30min with Human Expert
                            </button>

                            {/* Secondary CTA */}
                            <div className="space-y-3">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button
                                    onClick={handleSendRecording}
                                    disabled={!email}
                                    className="w-full px-8 py-3 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                                >
                                    📧 Send me this recording
                                </button>
                            </div>

                            {/* Close */}
                            <button
                                onClick={onClose}
                                className="mt-6 text-gray-400 hover:text-white transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
