'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { springConfig } from '@/utils/tokens';

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
        ? `0 0 ${glowIntensity}px rgba(16, 185, 129, ${audioLevel * 0.8})`
        : 'none';

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
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${isListening
                            ? 'border-2 border-signal-emerald'
                            : 'border-2 border-glass-border'
                            }`}
                        style={{ boxShadow }}
                    >
                        {isListening ? (
                            <Mic className="w-8 h-8 text-white" strokeWidth={1.5} />
                        ) : (
                            <MicOff className="w-8 h-8 text-zinc-500" strokeWidth={1.5} />
                        )}
                    </div>

                    {/* Pulsing ring when listening */}
                    {isListening && (
                        <motion.div
                            className="absolute inset-0 rounded-full border-2 border-signal-emerald"
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
                <p className="text-sm text-zinc-400 mb-8 text-center">
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
                        className={`w-full py-3 px-6 rounded-xl font-medium tracking-tight transition-all ${permissionState === 'requesting'
                            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                            : permissionState === 'denied'
                                ? 'bg-signal-rose text-white hover:brightness-110'
                                : 'bg-signal-blue text-white hover:brightness-110'
                            }`}
                        whileHover={permissionState === 'idle' ? {
                            scale: 1.03,
                            filter: 'brightness(1.1)'
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
                <p className="text-[10px] text-zinc-600 text-center tracking-wide uppercase font-mono">
                    Secure • Encrypted • Private
                </p>
            </div>
        </motion.div>
    );
}
