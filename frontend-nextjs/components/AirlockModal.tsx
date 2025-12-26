'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoStore } from '@/lib/store';

interface AirlockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEnterDemo: () => void;
}

export default function AirlockModal({ isOpen, onClose, onEnterDemo }: AirlockModalProps) {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [audioLevel, setAudioLevel] = useState(0);
    const { setUserEmail, audioPermission, setAudioPermission } = useDemoStore();

    useEffect(() => {
        if (step === 2) {
            checkMicrophone();
        }
    }, [step]);

    const checkMicrophone = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setAudioPermission('Granted');

            // Visualize audio level
            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const updateLevel = () => {
                analyser.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                setAudioLevel(average / 255);
                requestAnimationFrame(updateLevel);
            };

            updateLevel();
        } catch (error) {
            console.error('Microphone access denied:', error);
            setAudioPermission('Denied');
        }
    };

    const handleContinue = () => {
        if (step === 1) {
            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setUserEmail(email);
                setStep(2);
            }
        } else if (step === 2) {
            if (audioPermission === 'Granted') {
                onEnterDemo();
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="relative w-full max-w-md mx-4 bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-2xl font-bold text-white">
                                {step === 1 ? 'Welcome to AzureSonik' : 'Microphone Check'}
                            </h2>
                            <p className="text-gray-400 mt-1">
                                {step === 1 ? 'Let\'s get you started' : 'We need to hear you'}
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {step === 1 ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Work Email
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@company.com"
                                            className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {audioPermission === 'Granted' ? (
                                        <>
                                            <p className="text-gray-300">
                                                Great! We can hear you. The AI agent is ready to listen.
                                            </p>

                                            {/* Audio visualizer */}
                                            <div className="flex items-center gap-1 h-16 justify-center">
                                                {[...Array(20)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="w-2 bg-green-500 rounded-full"
                                                        animate={{
                                                            height: `${Math.max(10, audioLevel * 100 * (0.5 + Math.random()))}%`,
                                                        }}
                                                        transition={{ duration: 0.1 }}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    ) : audioPermission === 'Denied' ? (
                                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                            <p className="text-red-400 font-medium">Microphone access denied</p>
                                            <p className="text-sm text-gray-400 mt-2">
                                                Please click the camera icon in your browser's address bar and allow microphone access.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center py-8">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/10 flex justify-between">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleContinue}
                                disabled={
                                    (step === 1 && !email) ||
                                    (step === 2 && audioPermission !== 'Granted')
                                }
                                className="px-6 py-2 bg-primary hover:bg-primary-dark disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                            >
                                {step === 1 ? 'Continue' : 'Enter Demo'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
