'use client';

import { motion } from 'framer-motion';
import { Mic, MicOff, Hand, PhoneOff } from 'lucide-react';
import { useSessionStore } from '@/store/useSessionStore';
import StatusOrb from './StatusOrb';
import { springConfig } from '@/lib/tokens';
import { useState } from 'react';

interface ControlBarProps {
    currentAction?: string;
}

export default function ControlBar({ currentAction }: ControlBarProps) {
    const [isMuted, setIsMuted] = useState(false);
    const { agentSpeaking, userSpeaking, actions } = useSessionStore();

    const getOrbState = () => {
        if (agentSpeaking) return 'speaking';
        if (userSpeaking) return 'listening';
        return 'thinking';
    };

    const handleMuteToggle = () => {
        setIsMuted(!isMuted);
        // TODO: Implement actual mute logic
    };

    const handleInterrupt = () => {
        // TODO: Send stop_audio signal
        console.log('Interrupt requested');
    };

    const handleHangup = () => {
        actions.endSession();
    };

    return (
        <motion.div
            className="fixed bottom-0 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={springConfig}
        >
            <div
                className="flex items-center gap-4 px-6 py-3 bg-glass-heavy backdrop-blur-2xl rounded-full border border-glass-border"
                style={{
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.4)'
                }}
            >
                {/* Status Orb */}
                <div className="flex items-center gap-2">
                    <StatusOrb state={getOrbState()} />

                    {/* Marquee Text */}
                    <div className="overflow-hidden max-w-[200px]">
                        <motion.span
                            className="text-[10px] uppercase font-mono text-zinc-400 tracking-wider whitespace-nowrap inline-block"
                            animate={currentAction ? { x: [0, -100] } : {}}
                            transition={currentAction ? {
                                duration: 5,
                                repeat: Infinity,
                                ease: "linear"
                            } : {}}
                        >
                            {currentAction || (
                                agentSpeaking ? '> AGENT: SPEAKING...' :
                                    userSpeaking ? '> USER: SPEAKING...' :
                                        '> AGENT: LISTENING...'
                            )}
                        </motion.span>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-4 w-[1px] bg-white/10" />

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    {/* Mute Button */}
                    <motion.button
                        onClick={handleMuteToggle}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isMuted ? 'bg-signal-rose' : 'bg-white/10 hover:bg-white/20'
                            }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={springConfig}
                    >
                        {isMuted ? (
                            <MicOff className="w-5 h-5 text-white" strokeWidth={1.5} />
                        ) : (
                            <Mic className="w-5 h-5 text-white" strokeWidth={1.5} />
                        )}
                    </motion.button>

                    {/* Interrupt Button */}
                    <motion.button
                        onClick={handleInterrupt}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={springConfig}
                    >
                        <Hand className="w-5 h-5 text-white" strokeWidth={1.5} />
                    </motion.button>

                    {/* Hangup Button */}
                    <motion.button
                        onClick={handleHangup}
                        className="w-10 h-10 rounded-full bg-signal-rose hover:brightness-110 flex items-center justify-center transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={springConfig}
                    >
                        <PhoneOff className="w-5 h-5 text-white" strokeWidth={1.5} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
