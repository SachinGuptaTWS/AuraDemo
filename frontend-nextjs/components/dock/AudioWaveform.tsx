'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface AudioWaveformProps {
    stream: MediaStream | null;
}

export default function AudioWaveform({ stream }: AudioWaveformProps) {
    const [levels, setLevels] = useState([0, 0, 0]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        if (!stream) {
            setLevels([0, 0, 0]);
            return;
        }

        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);

        analyser.fftSize = 32;
        source.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateLevels = () => {
            if (!analyserRef.current) return;

            analyserRef.current.getByteFrequencyData(dataArray);

            // Map to 3 bars
            const newLevels = [
                dataArray[0] / 255,
                dataArray[Math.floor(dataArray.length / 2)] / 255,
                dataArray[dataArray.length - 1] / 255,
            ];

            setLevels(newLevels);
            animationFrameRef.current = requestAnimationFrame(updateLevels);
        };

        updateLevels();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [stream]);

    return (
        <div className="flex gap-1 items-center h-6">
            {levels.map((level, i) => (
                <motion.div
                    key={i}
                    className="w-1 bg-signal-blue rounded-full"
                    animate={{
                        height: `${Math.max(20, level * 100)}%`,
                    }}
                    transition={{ duration: 0.1 }}
                />
            ))}
        </div>
    );
}
