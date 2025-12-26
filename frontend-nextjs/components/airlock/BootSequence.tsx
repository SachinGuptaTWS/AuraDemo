'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { springConfig } from '@/utils/tokens';

interface BootSequenceProps {
    onComplete: () => void;
}

const bootMessages = [
    { text: '[SYSTEM] Allocating Neural Engine...', delay: 800 },
    { text: '[SYSTEM] Mounting Virtual Browser (1920x1080)...', delay: 1200 },
    { text: '[SYSTEM] Establishing Secure Handshake...', delay: 600 },
];

export default function BootSequence({ onComplete }: BootSequenceProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (currentStep >= bootMessages.length) {
            // All messages displayed, complete the sequence
            setTimeout(onComplete, 500);
            return;
        }

        const message = bootMessages[currentStep];
        setIsTyping(true);
        setDisplayedText('');

        // Typing animation
        let charIndex = 0;
        const typingInterval = setInterval(() => {
            if (charIndex < message.text.length) {
                setDisplayedText(message.text.substring(0, charIndex + 1));
                charIndex++;
            } else {
                clearInterval(typingInterval);
                setIsTyping(false);

                // Move to next message after delay
                setTimeout(() => {
                    setCurrentStep(prev => prev + 1);
                }, message.delay);
            }
        }, 30); // 30ms per character for typing effect

        return () => clearInterval(typingInterval);
    }, [currentStep, onComplete]);

    // Calculate progress percentage
    const progress = ((currentStep + 1) / bootMessages.length) * 100;

    return (
        <motion.div
            className="w-[440px] bg-glass-heavy backdrop-blur-xl rounded-3xl border border-glass-border shadow-panel"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={springConfig}
        >
            {/* Header */}
            <div className="p-8 text-center border-b border-glass-border">
                <h1 className="text-lg font-semibold tracking-tight text-white mb-2">
                    Initializing Agent
                </h1>
                <p className="text-sm text-zinc-400">
                    Provisioning secure environment...
                </p>
            </div>

            {/* Terminal Display */}
            <div className="p-8">
                <div className="bg-void rounded-xl p-6 font-mono text-xs min-h-[200px]">
                    <AnimatePresence mode="wait">
                        {bootMessages.slice(0, currentStep + 1).map((message, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mb-3"
                            >
                                <span className={`${index === currentStep
                                    ? 'text-signal-emerald'
                                    : 'text-zinc-500'
                                    }`}>
                                    {index === currentStep ? displayedText : message.text}
                                    {index === currentStep && isTyping && (
                                        <motion.span
                                            animate={{ opacity: [1, 0] }}
                                            transition={{ duration: 0.5, repeat: Infinity }}
                                            className="inline-block w-2 h-4 bg-signal-emerald ml-1"
                                        />
                                    )}
                                </span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wide font-mono">
                            Progress
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                            {Math.round(progress)}%
                        </span>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-signal-blue"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-8 pb-8">
                <p className="text-[10px] text-zinc-600 text-center tracking-wide uppercase font-mono">
                    Estimated Time: 3-5 seconds
                </p>
            </div>
        </motion.div>
    );
}
