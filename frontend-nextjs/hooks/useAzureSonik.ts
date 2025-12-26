'use client';

import { useEffect, useRef, useState } from 'react';
import { CallClient, CallAgent, Call } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { create } from 'zustand';

// 1. The State Store (Finite State Machine)
type AgentStatus = 'IDLE' | 'HARDWARE_CHECK' | 'PROVISIONING' | 'HANDSHAKE' | 'CONNECTED' | 'RECONNECTING' | 'TERMINATED' | 'ERROR_VIEW';

interface AgentState {
    status: AgentStatus;
    agentSpeaking: boolean; // VAD (Voice Activity Detection) status
    latencyMs: number;
    error: string | null;
    videoStream: MediaStream | null; // The agent's screen share stream
    actions: {
        connect: (token: string) => Promise<void>;
        disconnect: () => void;
        setStatus: (status: AgentStatus) => void;
        setAgentSpeaking: (speaking: boolean) => void;
        setVideoStream: (stream: MediaStream | null) => void;
    }
}

export const useAgentStore = create<AgentState>((set, get) => ({
    status: 'IDLE',
    agentSpeaking: false,
    latencyMs: 0,
    error: null,
    videoStream: null,
    actions: {
        connect: async (token: string) => {
            if (typeof window === 'undefined') return;

            try {
                set({ status: 'PROVISIONING', error: null });

                // Simulate connection delay
                await new Promise(resolve => setTimeout(resolve, 500));

                set({ status: 'HANDSHAKE' });

                await new Promise(resolve => setTimeout(resolve, 500));

                // For demo purposes, immediately set to CONNECTED
                // In production, this would initialize Azure Communication Services
                set({ status: 'CONNECTED' });
            } catch (error) {
                console.error('Connection failed:', error);
                set({ status: 'ERROR_VIEW', error: String(error) });
            }
        },
        disconnect: () => {
            set({ status: 'TERMINATED', agentSpeaking: false, videoStream: null });
        },
        setStatus: (status) => set({ status }),
        setAgentSpeaking: (speaking) => set({ agentSpeaking: speaking }),
        setVideoStream: (stream) => set({ videoStream: stream }),
    }
}));

// 2. The Audio Analyzer Hook (Real Physics)
export function useMicVisualizer(stream: MediaStream | null) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [audioLevels, setAudioLevels] = useState<number[]>([0, 0, 0, 0, 0]);

    useEffect(() => {
        if (typeof window === 'undefined' || !stream || !canvasRef.current) return;

        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyzer = audioCtx.createAnalyser();
        analyzer.fftSize = 32;
        source.connect(analyzer);

        const bufferLength = analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        let animationId: number;

        const draw = () => {
            animationId = requestAnimationFrame(draw);
            analyzer.getByteFrequencyData(dataArray);

            // Map frequency data to 5 bars
            const bars = 5;
            const levels = [];
            for (let i = 0; i < bars; i++) {
                const start = Math.floor((i * bufferLength) / bars);
                const end = Math.floor(((i + 1) * bufferLength) / bars);
                const slice = dataArray.slice(start, end);
                const average = slice.reduce((a, b) => a + b, 0) / slice.length;
                levels.push(average / 255); // Normalize to 0-1
            }

            setAudioLevels(levels);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationId);
            audioCtx.close();
        };
    }, [stream]);

    return { canvasRef, audioLevels };
}

// 3. Video Keep-Alive Hook (Zero-Flicker Strategy)
export function useVideoKeepAlive(stream: MediaStream | null) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || !videoRef.current || !stream) return;
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            setIsReady(true);
        }
    }, [stream]);

}

// 4. Latency Mask Hook (The Illusionist)
export function useLatencyMask() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [actionLabel, setActionLabel] = useState('');

    const showMask = (label: string, durationMs: number = 600) => {
        setActionLabel(label);
        setIsProcessing(true);

        setTimeout(() => {
            setIsProcessing(false);
        }, durationMs);
    };

    return { isProcessing, actionLabel, showMask };
}
