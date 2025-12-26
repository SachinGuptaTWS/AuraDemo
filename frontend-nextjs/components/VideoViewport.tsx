"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface VideoViewportProps {
    stream: MediaStream | null;
    className?: string;
}

export default function VideoViewport({ stream, className = '' }: VideoViewportProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isReady, setIsReady] = useState(false);
    const [opacity, setOpacity] = useState(1);

    // Double-Buffer Strategy: Prevent black flash on stream renegotiation
    useEffect(() => {
        if (!videoRef.current || !stream) return;

        const video = videoRef.current;

        // Fade out before changing stream
        setOpacity(0);

        setTimeout(() => {
            video.srcObject = stream;

            video.onloadeddata = () => {
                setIsReady(true);
                setOpacity(1); // Fade back in
            };
        }, 150);

    }, [stream]);

    // Blurred Background Effect (Spotify-style)
    useEffect(() => {
        if (!videoRef.current || !canvasRef.current || !isReady) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;

        const drawBlurredBackground = () => {
            if (video.readyState >= 2) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.filter = 'blur(80px)'; // Heavy blur
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }
            animationId = requestAnimationFrame(drawBlurredBackground);
        };

        drawBlurredBackground();

        return () => cancelAnimationFrame(animationId);
    }, [isReady]);

    return (
        <div className={`relative w-full h-full ${className}`}>
            {/* Blurred Background (Desktop only - fills ultra-wide gaps) */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover opacity-30 hidden md:block"
            />

            {/* Main Video with Double-Buffer Fade */}
            <motion.video
                ref={videoRef}
                autoPlay
                playsInline
                muted={false}
                animate={{ opacity }}
                transition={{ duration: 0.15 }}
                className="relative z-10 w-full h-full object-contain md:object-contain object-cover"
            />

            {/* Loading State */}
            {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#050505]">
                    <div className="text-center space-y-3">
                        <div className="w-12 h-12 border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto" />
                        <div className="text-sonik-text-muted text-sm font-light">Initializing stream...</div>
                    </div>
                </div>
            )}
        </div>
    );
}
