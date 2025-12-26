'use client';

import { useEffect, useState } from 'react';
import { useSessionStore } from '@/store/useSessionStore';
import PermissionCard from '@/components/airlock/PermissionCard';
import BootSequence from '@/components/airlock/BootSequence';
import AmbientBackdrop from '@/components/stage/AmbientBackdrop';
import VideoViewport from '@/components/stage/VideoViewport';
import LatencyMask from '@/components/stage/LatencyMask';
import ControlBar from '@/components/dock/ControlBar';
import { motion, AnimatePresence } from 'framer-motion';

export default function DemoPage() {
    const { state, remoteStream, actions } = useSessionStore();
    const [showLatencyMask, setShowLatencyMask] = useState(false);

    // Listen for navigation_started WebSocket events
    useEffect(() => {
        // TODO: Connect to WebSocket and listen for navigation_started
        // For now, this is a placeholder
        const handleNavigationStart = () => {
            setShowLatencyMask(true);
            setTimeout(() => setShowLatencyMask(false), 200);
        };

        // Example: window.addEventListener('navigation_started', handleNavigationStart);
        return () => {
            // window.removeEventListener('navigation_started', handleNavigationStart);
        };
    }, []);

    const handlePermissionGranted = (stream: MediaStream) => {
        actions.setLocalStream(stream);
        actions.setState('PROVISIONING');
    };

    const handlePermissionDenied = () => {
        actions.setError('MIC_DENIED', 'Microphone access denied');
    };

    const handleBootComplete = () => {
        // Start the actual session flow
        actions.startSession();
    };

    return (
        <div className="fixed inset-0 bg-void overflow-hidden">
            <AnimatePresence mode="wait">
                {/* IDLE State - Landing */}
                {state === 'IDLE' && (
                    <motion.div
                        key="idle"
                        className="flex items-center justify-center h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.button
                            onClick={() => actions.setState('PERMISSIONS')}
                            className="px-12 py-4 bg-signal-blue text-white rounded-xl font-semibold text-lg hover:brightness-110 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Start Live Demo
                        </motion.button>
                    </motion.div>
                )}

                {/* PERMISSIONS State - Mic Check */}
                {state === 'PERMISSIONS' && (
                    <motion.div
                        key="permissions"
                        className="flex items-center justify-center h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <PermissionCard
                            onPermissionGranted={handlePermissionGranted}
                            onPermissionDenied={handlePermissionDenied}
                        />
                    </motion.div>
                )}

                {/* PROVISIONING State - Boot Sequence */}
                {state === 'PROVISIONING' && (
                    <motion.div
                        key="provisioning"
                        className="flex items-center justify-center h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <BootSequence onComplete={handleBootComplete} />
                    </motion.div>
                )}

                {/* HANDSHAKE State - Connecting */}
                {state === 'HANDSHAKE' && (
                    <motion.div
                        key="handshake"
                        className="flex items-center justify-center h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="text-center">
                            <motion.div
                                className="w-16 h-16 border-4 border-signal-blue border-t-transparent rounded-full mx-auto mb-4"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <p className="text-white font-medium">Establishing Connection...</p>
                        </div>
                    </motion.div>
                )}

                {/* LIVE State - Main Stage */}
                {state === 'LIVE' && (
                    <motion.div
                        key="live"
                        className="relative h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Layer 1: Ambient Backdrop */}
                        <AmbientBackdrop stream={remoteStream} />

                        {/* Layer 2: Video Viewport */}
                        <div className="relative z-10 h-full p-8">
                            <VideoViewport stream={remoteStream} />
                        </div>

                        {/* Layer 3: Latency Mask */}
                        <LatencyMask isVisible={showLatencyMask} />

                        {/* Control Dock */}
                        <ControlBar />
                    </motion.div>
                )}

                {/* RECONNECTING State - Overlay */}
                {state === 'RECONNECTING' && (
                    <motion.div
                        key="reconnecting"
                        className="absolute inset-0 bg-void/80 backdrop-blur-sm flex items-center justify-center z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="text-center">
                            <motion.div
                                className="w-16 h-16 border-4 border-signal-amber border-t-transparent rounded-full mx-auto mb-4"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <p className="text-white font-medium">Restoring Uplink...</p>
                        </div>
                    </motion.div>
                )}

                {/* TERMINATED State - Summary */}
                {state === 'TERMINATED' && (
                    <motion.div
                        key="terminated"
                        className="flex items-center justify-center h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="w-[440px] bg-glass-heavy backdrop-blur-xl rounded-3xl border border-glass-border shadow-panel p-8 text-center">
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                Demo Complete
                            </h2>
                            <p className="text-zinc-400 mb-8">
                                Thank you for experiencing Slink
                            </p>
                            <motion.button
                                onClick={() => actions.setState('IDLE')}
                                className="px-8 py-3 bg-signal-blue text-white rounded-xl font-medium hover:brightness-110 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Start New Demo
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
