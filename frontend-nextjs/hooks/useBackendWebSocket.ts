'use client';

import { useEffect, useRef } from 'react';
import { useAgentStore } from './useAzureSonik';

export function useBackendWebSocket() {
    const wsRef = useRef<WebSocket | null>(null);
    const { status, actions } = useAgentStore();
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        // Create hidden canvas for rendering frames
        if (!canvasRef.current) {
            canvasRef.current = document.createElement('canvas');
            canvasRef.current.width = 1920;
            canvasRef.current.height = 1080;
        }

        // Only connect when status is CONNECTED
        if (status !== 'CONNECTED') return;

        const connectWebSocket = () => {
            try {
                const ws = new WebSocket('ws://localhost:8080');
                wsRef.current = ws;

                ws.onopen = () => {
                    console.log('✅ Connected to backend WebSocket');
                };

                ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);

                        if (data.type === 'video_frame') {
                            // Decode base64 and render to canvas
                            const base64Data = data.data;
                            const img = new Image();

                            img.onload = () => {
                                const canvas = canvasRef.current;
                                if (!canvas) return;

                                const ctx = canvas.getContext('2d');
                                if (!ctx) return;

                                // Draw image to canvas
                                canvas.width = img.width;
                                canvas.height = img.height;
                                ctx.drawImage(img, 0, 0);

                                // Create MediaStream from canvas if not exists
                                if (!streamRef.current) {
                                    const stream = canvas.captureStream(30); // 30 FPS
                                    streamRef.current = stream;
                                    actions.setVideoStream(stream);
                                    console.log('🎥 Video stream created and set!');
                                }
                            };

                            img.src = 'data:image/jpeg;base64,' + base64Data;
                        }
                    } catch (error) {
                        console.error('Error parsing WebSocket message:', error);
                    }
                };

                ws.onerror = (error) => {
                    console.error('❌ WebSocket error:', error);
                };

                ws.onclose = () => {
                    console.log('🔌 WebSocket disconnected');
                    // Clear video stream
                    streamRef.current = null;
                    actions.setVideoStream(null);

                    // Attempt to reconnect after 3 seconds
                    reconnectTimeoutRef.current = setTimeout(() => {
                        if (status === 'CONNECTED') {
                            console.log('🔄 Attempting to reconnect...');
                            connectWebSocket();
                        }
                    }, 3000);
                };
            } catch (error) {
                console.error('Failed to create WebSocket connection:', error);
            }
        };

        connectWebSocket();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [status, actions]);

    return wsRef;
}
