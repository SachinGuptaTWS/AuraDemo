'use client';

import { useEffect, useRef } from 'react';

interface AmbientBackdropProps {
    stream: MediaStream | null;
}

export default function AmbientBackdrop({ stream }: AmbientBackdropProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-110 blur-3xl opacity-40"
                style={{
                    transform: 'scale(1.1)',
                    filter: 'blur(80px)',
                }}
            />
        </div>
    );
}
