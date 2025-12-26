'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { springConfig } from '@/utils/tokens';

// Custom Microphone Icons
const MicIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
);

const MicOffIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="2" x2="22" y1="2" y2="22" />
        <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" />
        <path d="M5 10v2a7 7 0 0 0 12 5" />
        <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" />
        <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
        <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
);

interface PermissionCardProps {
    onPermissionGranted: (stream: MediaStream) => void;
    onPermissionDenied: () => void;
}

export default function PermissionCard({ onPermissionGranted, onPermissionDenied }: PermissionCardProps) {
    const [audioLevel, setAudioLevel] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [permissionState, setPermissionState] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');

    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const requestMicrophoneAccess = async () => {
        setPermissionState('requesting');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // Set up AudioContext for visualization
            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);

            analyser.fftSize = 256;
            microphone.connect(analyser);

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;

            setPermissionState('granted');
            setIsListening(true);

            // Start visualization
            visualizeAudio();

            // Notify parent after 1 second of visualization
            setTimeout(() => {
                onPermissionGranted(stream);
            }, 1000);

        } catch (error) {
            console.error('Microphone access denied:', error);
            setPermissionState('denied');
            onPermissionDenied();
        }
    };

    const visualizeAudio = () => {
        if (!analyserRef.current) return;

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

        const updateLevel = () => {
            if (!analyserRef.current) return;

            analyserRef.current.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            const normalized = average / 255;

            setAudioLevel(normalized);
            animationFrameRef.current = requestAnimationFrame(updateLevel);
        };

        updateLevel();
    };

    useEffect(() => {
        return () => {
            // Cleanup
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Calculate glow intensity based on audio level
    const glowIntensity = Math.min(audioLevel * 40, 20);
    const boxShadow = isListening
        ? `0 0 ${glowIntensity}px rgba(34, 197, 94, ${audioLevel * 0.8})`
        : 'none';

    return (
        <motion.div
            className="w-full max-w-md bg-surface/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={springConfig}
        >
            {/* Header */}
            <div className="p-8 text-center border-b border-white/5">
                <h1 className="text-xl font-bold tracking-tight text-white mb-2">
                    Audio Uplink Required
                </h1>
                <p className="text-sm text-zinc-400">
                    {permissionState === 'denied'
                        ? 'Microphone access denied'
                        : 'Grant microphone access to continue'}
                </p>
            </div>

            {/* Mic Visualizer */}
            <div className="flex flex-col items-center py-12 px-8">
                <motion.div
                    className="relative flex items-center justify-center mb-8"
                    animate={{
                        scale: isListening ? [1, 1.02, 1] : 1,
                    }}
                    transition={{
                        duration: 2,
                        repeat: isListening ? Infinity : 0,
                        ease: "easeInOut"
                    }}
                >
                    {/* The Mic Circle with Dynamic Glow */}
                    <div
                        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 ${isListening
                            ? 'border-2 border-green-500 bg-green-500/10'
                            : 'border-2 border-white/10 bg-white/5'
                            }`}
                        style={{ boxShadow }}
                    >
                        {isListening ? (
                            <MicIcon className="w-10 h-10 text-white" />
                        ) : (
                            <MicOffIcon className="w-10 h-10 text-zinc-500" />
                        )}
                    </div>

                    {/* Pulsing ring when listening */}
                    {isListening && (
                        <motion.div
                            className="absolute inset-0 rounded-full border-2 border-green-500"
                            initial={{ scale: 1, opacity: 0.5 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeOut"
                            }}
                        />
                    )}
                </motion.div>

                {/* Status Text */}
                <p className="text-sm text-zinc-400 mb-8 text-center font-medium">
                    {permissionState === 'granted' && '✓ Audio uplink verified'}
                    {permissionState === 'requesting' && 'Requesting access...'}
                    {permissionState === 'denied' && '✗ Please enable microphone in browser settings'}
                    {permissionState === 'idle' && 'Click below to enable microphone'}
                </p>

                {/* Action Button */}
                {permissionState !== 'granted' && (
                    <motion.button
                        onClick={requestMicrophoneAccess}
                        disabled={permissionState === 'requesting'}
                        className={`w-full py-3.5 px-6 rounded-xl font-semibold tracking-tight transition-all ${permissionState === 'requesting'
                            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                            : permissionState === 'denied'
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                        whileHover={permissionState === 'idle' ? {
                            scale: 1.02,
                        } : {}}
                        whileTap={permissionState === 'idle' ? { scale: 0.98 } : {}}
                        transition={springConfig}
                    >
                        {permissionState === 'requesting' && 'Requesting Access...'}
                        {permissionState === 'denied' && 'Retry'}
                        {permissionState === 'idle' && 'Grant Access'}
                    </motion.button>
                )}
            </div>

            {/* Footer */}
            <div className="px-8 pb-8">
                <p className="text-[10px] text-zinc-600 text-center tracking-widest uppercase font-mono">
                    Secure • Encrypted • Private
                </p>
            </div>
        </motion.div>
    );
}
