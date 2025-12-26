'use client';

import { create } from 'zustand';

// Finite State Machine - 7 States (Master PRD Section 3)
export type SessionState =
    | 'IDLE'          // Page Load - Waiting for user intent
    | 'PERMISSIONS'   // Click "Start" - Requesting navigator.mediaDevices
    | 'PROVISIONING'  // Mic Granted - API call to spin up Docker Container (3-5s)
    | 'HANDSHAKE'     // Token Received - Joining Azure ACS Room
    | 'LIVE'          // Stream Received - Main Demo active
    | 'RECONNECTING'  // Network Drop - "Restoring Uplink..." spinner
    | 'TERMINATED';   // End Call - Post-demo CTA

export type ErrorCode =
    | 'MIC_DENIED'
    | 'ICE_FAILURE'
    | 'AGENT_TIMEOUT'
    | 'SOCKET_CLOSE'
    | null;

interface SessionStore {
    // State Machine
    state: SessionState;
    previousState: SessionState | null;

    // Media Streams
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;

    // Agent Status
    agentSpeaking: boolean;
    userSpeaking: boolean;

    // Connection
    roomId: string | null;
    token: string | null;

    // Error Handling
    error: ErrorCode;
    errorMessage: string | null;

    // Smart Pan (Mobile)
    cursorPosition: { x: number; y: number } | null;

    // Actions
    actions: {
        // State Transitions
        setState: (state: SessionState) => void;

        // Media Management
        setLocalStream: (stream: MediaStream | null) => void;
        setRemoteStream: (stream: MediaStream | null) => void;

        // Agent Status
        setAgentSpeaking: (speaking: boolean) => void;
        setUserSpeaking: (speaking: boolean) => void;

        // Connection
        setRoomId: (roomId: string) => void;
        setToken: (token: string) => void;

        // Error Handling
        setError: (code: ErrorCode, message?: string) => void;
        clearError: () => void;

        // Smart Pan
        updateCursorPosition: (x: number, y: number) => void;

        // Flow Control
        startSession: () => Promise<void>;
        endSession: () => void;
        reconnect: () => Promise<void>;
    };
}

export const useSessionStore = create<SessionStore>((set, get) => ({
    // Initial State
    state: 'IDLE',
    previousState: null,
    localStream: null,
    remoteStream: null,
    agentSpeaking: false,
    userSpeaking: false,
    roomId: null,
    token: null,
    error: null,
    errorMessage: null,
    cursorPosition: null,

    actions: {
        setState: (state) => {
            const currentState = get().state;
            set({ state, previousState: currentState });
            console.log(`[State Machine] ${currentState} → ${state}`);
        },

        setLocalStream: (stream) => set({ localStream: stream }),
        setRemoteStream: (stream) => set({ remoteStream: stream }),

        setAgentSpeaking: (speaking) => set({ agentSpeaking: speaking }),
        setUserSpeaking: (speaking) => set({ userSpeaking: speaking }),

        setRoomId: (roomId) => set({ roomId }),
        setToken: (token) => set({ token }),

        setError: (code, message) => {
            set({ error: code, errorMessage: message || null });
            console.error(`[Error] ${code}: ${message}`);
        },

        clearError: () => set({ error: null, errorMessage: null }),

        updateCursorPosition: (x, y) => set({ cursorPosition: { x, y } }),

        // Flow Control
        startSession: async () => {
            const { actions } = get();

            try {
                // IDLE → PERMISSIONS
                actions.setState('PERMISSIONS');

                // Request microphone access
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                actions.setLocalStream(stream);

                // PERMISSIONS → PROVISIONING
                actions.setState('PROVISIONING');

                // TODO: API call to provision Docker container
                // Simulated delay for now
                await new Promise(resolve => setTimeout(resolve, 3000));

                // PROVISIONING → HANDSHAKE
                actions.setState('HANDSHAKE');

                // TODO: Join Azure ACS room
                await new Promise(resolve => setTimeout(resolve, 1000));

                // HANDSHAKE → LIVE
                actions.setState('LIVE');

            } catch (error) {
                if (error instanceof DOMException && error.name === 'NotAllowedError') {
                    actions.setError('MIC_DENIED', 'Microphone access denied');
                } else {
                    actions.setError('AGENT_TIMEOUT', 'Failed to start session');
                }
                actions.setState('IDLE');
            }
        },

        endSession: () => {
            const { localStream, remoteStream, actions } = get();

            // Stop all tracks
            localStream?.getTracks().forEach(track => track.stop());
            remoteStream?.getTracks().forEach(track => track.stop());

            // Clear streams
            actions.setLocalStream(null);
            actions.setRemoteStream(null);

            // LIVE → TERMINATED
            actions.setState('TERMINATED');
        },

        reconnect: async () => {
            const { actions } = get();

            // LIVE → RECONNECTING
            actions.setState('RECONNECTING');

            try {
                // TODO: Implement reconnection logic
                await new Promise(resolve => setTimeout(resolve, 2000));

                // RECONNECTING → LIVE
                actions.setState('LIVE');
            } catch (error) {
                actions.setError('SOCKET_CLOSE', 'Reconnection failed');
                actions.setState('TERMINATED');
            }
        },
    },
}));
