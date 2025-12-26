'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useDemoStore } from '@/lib/store';
import { useAgentCall } from '@/hooks/useAgentCall';

interface VideoRoomProps {
    onExit: () => void;
}

export default function VideoRoom({ onExit }: VideoRoomProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { callState, agentState, isMicMuted, isSpeakerMuted, toggleMic, toggleSpeaker, chatHistory } = useDemoStore();
    const { endCall } = useAgentCall();

    const handleEndCall = async () => {
        await endCall();
        onExit();
    };

    const getAgentStatusColor = () => {
        switch (agentState) {
            case 'Listening':
                return 'bg-green-500';
            case 'Processing':
                return 'bg-yellow-500';
            case 'Speaking':
                return 'bg-blue-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getAgentStatusText = () => {
        switch (agentState) {
            case 'Listening':
                return 'Listening...';
            case 'Processing':
                return 'Thinking...';
            case 'Speaking':
                return 'Speaking...';
            default:
                return 'Idle';
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black">
            {/* Video Container */}
            <div className="relative w-full h-full">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                />

                {/* Agent Status Pill - Top Center */}
                <motion.div
                    className="absolute top-8 left-1/2 transform -translate-x-1/2"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <div className="flex items-center gap-2 px-6 py-3 bg-black/80 backdrop-blur-lg rounded-full border border-white/20">
                        <div className={`w-3 h-3 rounded-full ${getAgentStatusColor()} ${agentState === 'Listening' ? 'animate-pulse' : ''}`} />
                        <span className="text-white font-medium">{getAgentStatusText()}</span>
                    </div>
                </motion.div>

                {/* Control Bar - Bottom Center */}
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <div className="flex items-center gap-4 px-6 py-4 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
                        {/* Mic Toggle */}
                        <button
                            onClick={toggleMic}
                            className={`p-4 rounded-xl transition-all ${isMicMuted
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-white/10 hover:bg-white/20'
                                }`}
                        >
                            {isMicMuted ? (
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            )}
                        </button>

                        {/* Interrupt Button */}
                        <button className="px-6 py-4 bg-yellow-500 hover:bg-yellow-600 rounded-xl font-semibold text-white transition-colors">
                            Stop & Listen
                        </button>

                        {/* Speaker Toggle */}
                        <button
                            onClick={toggleSpeaker}
                            className={`p-4 rounded-xl transition-all ${isSpeakerMuted
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-white/10 hover:bg-white/20'
                                }`}
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                        </button>

                        {/* End Call */}
                        <button
                            onClick={handleEndCall}
                            className="p-4 bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
                        >
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </motion.div>

                {/* Live Chat - Right Side */}
                <motion.div
                    className="absolute top-8 right-8 w-80 max-h-[60vh] bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <div className="p-4 border-b border-white/10">
                        <h3 className="text-white font-semibold">Conversation</h3>
                    </div>

                    <div className="p-4 space-y-3 overflow-y-auto max-h-96">
                        {chatHistory.map((msg, i) => (
                            <div
                                key={i}
                                className={`p-3 rounded-lg ${msg.speaker === 'user'
                                        ? 'bg-primary/20 ml-8'
                                        : 'bg-white/10 mr-8'
                                    }`}
                            >
                                <p className="text-sm text-white">{msg.message}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {msg.timestamp.toLocaleTimeString()}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Smart Suggestions */}
                    <div className="p-4 border-t border-white/10 space-y-2">
                        <p className="text-xs text-gray-400 mb-2">Quick questions:</p>
                        {['Ask about Pricing', 'Show Integrations', 'Security Features'].map((suggestion) => (
                            <button
                                key={suggestion}
                                className="w-full px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white text-left transition-colors"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
