"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface AudioReactorProps {
    stream: MediaStream | null;
}

export default function AudioReactor({ stream }: AudioReactorProps) {
    const [volume, setVolume] = useState(0);

    useEffect(() => {
        if (!stream) return;

        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 32;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        let animationId: number;

        const update = () => {
            analyser.getByteFrequencyData(dataArray);
            // Average volume of first 4 frequencies (Human Voice Range 85-255 Hz)
            const vol = dataArray.slice(0, 4).reduce((a, b) => a + b, 0) / 4;
            setVolume(vol);
            animationId = requestAnimationFrame(update);
        };

        update();

        return () => {
            cancelAnimationFrame(animationId);
            audioContext.close();
        };
    }, [stream]);

    // Map volume (0-255) to Scale (1.0 - 1.5)
    const scale = 1 + volume / 200;

    return (
        <motion.div
            animate={{ scale }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
        >
            {volume > 10 && <CheckCircle2 className="w-4 h-4 text-white" />}
        </motion.div>
    );
}
