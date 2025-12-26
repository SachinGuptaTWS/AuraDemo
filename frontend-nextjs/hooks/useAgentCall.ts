import { useState, useEffect, useCallback } from 'react';
import { CallClient, CallAgent, Call } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { useDemoStore } from '@/lib/store';

export const useAgentCall = () => {
    const [callAgent, setCallAgent] = useState<CallAgent | null>(null);
    const [activeCall, setActiveCall] = useState<Call | null>(null);

    const { setCallState, setAgentState, setError, addMessage } = useDemoStore();

    // Initialize Azure Communication Services
    const initCall = useCallback(async (token: string) => {
        try {
            setCallState('Connecting');

            const callClient = new CallClient();
            const tokenCredential = new AzureCommunicationTokenCredential(token);
            const agent = await callClient.createCallAgent(tokenCredential);

            setCallAgent(agent);
            setCallState('Idle');

            return agent;
        } catch (error) {
            console.error('Failed to initialize call:', error);
            setError('Failed to initialize call. Please try again.');
            setCallState('Error');
            throw error;
        }
    }, [setCallState, setError]);

    // Start demo call
    const startDemo = useCallback(async (agentId: string) => {
        if (!callAgent) {
            throw new Error('Call agent not initialized');
        }

        try {
            setCallState('Connecting');

            // Start call to the AI agent (backend container)
            const call = callAgent.startCall(
                [{ id: agentId }],
                {
                    videoOptions: {
                        localVideoStreams: [], // Audio only from user
                    },
                    audioOptions: {
                        muted: false,
                    },
                }
            );

            setActiveCall(call);

            // Subscribe to call state changes
            call.on('stateChanged', () => {
                console.log('Call state:', call.state);

                if (call.state === 'Connected') {
                    setCallState('Connected');
                    addMessage('agent', 'Hi! I\'m your AI guide. What would you like to see today?');
                } else if (call.state === 'Disconnected') {
                    setCallState('Ended');
                }
            });

            // Subscribe to remote participants (the AI agent's video stream)
            call.on('remoteParticipantsUpdated', (e) => {
                e.added.forEach((participant) => {
                    console.log('Remote participant added:', participant.identifier);

                    // Subscribe to video streams from the agent
                    participant.videoStreams.forEach((stream) => {
                        subscribeToRemoteVideo(stream);
                    });

                    participant.on('videoStreamsUpdated', (e) => {
                        e.added.forEach((stream) => {
                            subscribeToRemoteVideo(stream);
                        });
                    });
                });
            });

            return call;
        } catch (error) {
            console.error('Failed to start call:', error);
            setError('Failed to connect to agent. Please try again.');
            setCallState('Error');
            throw error;
        }
    }, [callAgent, setCallState, setError, addMessage]);

    // Subscribe to remote video stream
    const subscribeToRemoteVideo = (stream: any) => {
        console.log('Subscribing to remote video stream');
        // This will be handled by the VideoPlayer component
    };

    // End call
    const endCall = useCallback(async () => {
        if (activeCall) {
            await activeCall.hangUp();
            setActiveCall(null);
            setCallState('Ended');
        }
    }, [activeCall, setCallState]);

    // Mute/Unmute microphone
    const toggleMic = useCallback(async (muted: boolean) => {
        if (activeCall) {
            await activeCall.mute();
        }
    }, [activeCall]);

    return {
        initCall,
        startDemo,
        endCall,
        toggleMic,
        activeCall,
    };
};
