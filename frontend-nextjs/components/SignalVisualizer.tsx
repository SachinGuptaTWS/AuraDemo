'use client';

import { useMicVisualizer } from '@/hooks/useAzureSonik';
import { motion } from 'framer-motion';

interface SignalVisualizerProps {
    stream: MediaStream | null;
    isActive?: boolean;
}

export default function SignalVisualizer({ stream, isActive = true }: SignalVisualizerProps) {
    const { audioLevels } = useMicVisualizer(stream);

    return (
        <div className="flex items-end gap-1 h-8">
            {audioLevels.map((level, i) => (
                <motion.div
                    key={i}
                    className={`w-1 rounded-full transition-colors ${isActive ? 'bg-emerald-500' : 'bg-zinc-700'
                        }`}
                    animate={{
                        height: `${Math.max(8, level * 100)}%`,
                    }}
                    transition={{
                        duration: 0.1,
                        ease: 'easeOut',
                    }}
                />
            ))}
        </div>
    );
}
