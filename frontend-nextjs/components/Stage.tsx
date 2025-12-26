'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgentStore } from '@/hooks/useAzureSonik';
import { Mic, MicOff, PhoneOff, Loader2 } from 'lucide-react';

// Global Spring Configuration (PRD Section 2.1)
const springConfig = {
    type: "spring" as const,
    stiffness: 300,
    damping: 25,
    mass: 1
};

export default function Stage() {
    const { status, agentSpeaking, videoStream, actions } = useAgentStore();
    const [isMicMuted, setIsMicMuted] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const blurredVideoRef = useRef<HTMLVideoElement>(null);

    // Auto-hide controls after 3 seconds of inactivity
    useEffect(() => {
        const timer = setTimeout(() => setShowControls(false), 3000);
        return () => clearTimeout(timer);
    }, [showControls]);

    // Set up video streams (PRD Section 3.2 - Layer 1 & 2)
    useEffect(() => {
        if (videoStream && videoRef.current) {
            videoRef.current.srcObject = videoStream;
        }
        if (videoStream && blurredVideoRef.current) {
            blurredVideoRef.current.srcObject = videoStream;
        }
    }, [videoStream]);

    const handleMouseMove = () => {
        setShowControls(true);
    };

    const handleEndCall = () => {
        actions.disconnect();
    };

    const toggleMic = () => {
        setIsMicMuted(!isMicMuted);
    };

    // Determine agent state for status orb
    const getAgentState = () => {
        if (agentSpeaking) return 'speaking';
        if (status === 'CONNECTED') return 'listening';
        return 'thinking';
    };

    const agentState = getAgentState();

    return (
        <div
            className="fixed inset-0 bg-void overflow-hidden"
            onMouseMove={handleMouseMove}
        >
            {/* Layer 1: Ambient Backlight (PRD Section 3.2) */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <video
                    ref={blurredVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-[120%] h-[120%] object-cover blur-[80px] opacity-40"
                />
            </div>

            {/* Layer 2: The Video Feed (PRD Section 3.2) */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="max-w-full max-h-full object-contain rounded-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
                />
            </div>

            {/* The Control Dock - Dynamic Island (PRD Section 3.3) */}
            <AnimatePresence>
                {showControls && (
                    <motion.div
                        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={springConfig}
                    >
                        <div
                            className="flex items-center gap-4 px-6 py-3 bg-zinc-900/70 backdrop-blur-2xl rounded-full border border-white/5 shadow-panel"
                            style={{
                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.4)'
                            }}
                        >
                            {/* Status Orb (PRD Section 3.3) */}
                            <div className="flex items-center gap-2">
                                {agentState === 'thinking' ? (
                                    <motion.div
                                        className="w-2.5 h-2.5 rounded-full border-2 border-signal-amber border-t-transparent"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                ) : agentState === 'speaking' ? (
                                    <motion.div
                                        className="w-2.5 h-2.5 rounded-full bg-signal-blue"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                ) : (
                                    <motion.div
                                        className="w-2.5 h-2.5 rounded-full bg-signal-emerald"
                                        animate={{ opacity: [1, 0.5, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                )}

                                {/* The Marquee (PRD Section 3.3) */}
                                <span className="text-[10px] uppercase font-mono text-zinc-400 tracking-wider">
                                    {agentState === 'thinking' && '> AGENT: PROCESSING...'}
                                    {agentState === 'speaking' && '> AGENT: SPEAKING...'}
                                    {agentState === 'listening' && '> AGENT: LISTENING...'}
                                </span>
                            </div>

                            {/* Divider */}
                            <div className="h-4 w-[1px] bg-white/10" />

                            {/* Action Buttons (PRD Section 3.3) */}
                            <div className="flex items-center gap-2">
                                {/* Mic Toggle */}
                                <motion.button
                                    onClick={toggleMic}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isMicMuted
                                            ? 'bg-signal-rose'
                                            : 'bg-white/10 hover:bg-white/20'
                                        }`}
                                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={springConfig}
                                >
                                    {isMicMuted ? (
                                        <MicOff className="w-5 h-5 text-white" strokeWidth={1.5} />
                                    ) : (
                                        <Mic className="w-5 h-5 text-white" strokeWidth={1.5} />
                                    )}
                                </motion.button>

                                {/* End Call */}
                                <motion.button
                                    onClick={handleEndCall}
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
                )}
            </AnimatePresence>

            {/* Keyboard Hint */}
            <AnimatePresence>
                {showControls && (
                    <motion.div
                        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                    >
                        <p className="text-[10px] text-zinc-600 tracking-wide uppercase font-mono">
                            Press M to mute • Move mouse to show controls
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Latency Mask (PRD Section 3.2 - Layer 3) */}
            {/* This would be triggered by navigation_start events from backend */}
            {status === 'PROVISIONING' && (
                <motion.div
                    className="absolute inset-0 bg-white/5 z-30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                />
            )}
        </div>
    );
}
