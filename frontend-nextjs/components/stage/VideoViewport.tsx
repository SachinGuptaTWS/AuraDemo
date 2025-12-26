'use client';

import { useEffect, useRef, useState } from 'react';
import { useSessionStore } from '@/store/useSessionStore';

interface VideoViewportProps {
    stream: MediaStream | null;
}

export default function VideoViewport({ stream }: VideoViewportProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const previousVideoRef = useRef<HTMLVideoElement>(null);
    const [isNewStreamReady, setIsNewStreamReady] = useState(false);
    const cursorPosition = useSessionStore(state => state.cursorPosition);

    // Double-buffering logic to prevent black flashes
    useEffect(() => {
        if (!stream || !videoRef.current) return;

        setIsNewStreamReady(false);

        const handlePlaying = () => {
            setIsNewStreamReady(true);
        };

        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener('playing', handlePlaying);

        return () => {
            videoRef.current?.removeEventListener('playing', handlePlaying);
        };
    }, [stream]);

    // Smart Pan for mobile (300% scale + translate)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const transform = isMobile && cursorPosition
        ? `scale(3) translate(${-cursorPosition.x}px, ${-cursorPosition.y}px)`
        : 'none';

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Previous video (hidden when new stream is ready) */}
            {!isNewStreamReady && previousVideoRef.current && (
                <video
                    ref={previousVideoRef}
                    autoPlay
                    playsInline
                    className="max-w-full max-h-full object-contain rounded-xl md:rounded-xl rounded-none"
                    style={{
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    }}
                />
            )}

            {/* Current video */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`max-w-full max-h-full object-contain rounded-xl md:rounded-xl rounded-none transition-transform duration-300 ease-out ${isNewStreamReady ? 'opacity-100' : 'opacity-0'
                    }`}
                style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    transform,
                }}
            />
        </div>
    );
}
