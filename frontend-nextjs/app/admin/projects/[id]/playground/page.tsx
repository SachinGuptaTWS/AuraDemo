'use client';

import { useState } from 'react';
import { Play, Square, Mic, MicOff } from 'lucide-react';
import Stage from '@/components/Stage';

interface DebugLog {
    type: 'thought' | 'search' | 'found' | 'action' | 'error';
    message: string;
    timestamp: string;
}

export default function PlaygroundPage() {
    const [isActive, setIsActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [logs, setLogs] = useState<DebugLog[]>([
        { type: 'thought', message: 'User asked about pricing', timestamp: '14:23:01' },
        { type: 'search', message: 'Searching knowledge base...', timestamp: '14:23:02' },
        { type: 'found', message: 'Found answer in Sales Deck.pdf (page 3)', timestamp: '14:23:03' },
        { type: 'action', message: 'Navigating to Pricing page', timestamp: '14:23:04' },
    ]);

    const getLogColor = (type: string) => {
        switch (type) {
            case 'thought': return 'text-blue-400';
            case 'search': return 'text-amber-400';
            case 'found': return 'text-green-400';
            case 'action': return 'text-purple-400';
            case 'error': return 'text-red-400';
            default: return 'text-zinc-400';
        }
    };

    const getLogIcon = (type: string) => {
        switch (type) {
            case 'thought': return '💭';
            case 'search': return '🔍';
            case 'found': return '✓';
            case 'action': return '→';
            case 'error': return '✗';
            default: return '•';
        }
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-white/10 bg-void-800">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold mb-1">The Simulacrum</h1>
                        <p className="text-sm text-zinc-400">Test your AI agent in a safe environment</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className={`p-3 rounded-lg border transition-colors ${isMuted
                                    ? 'border-red-500/50 bg-red-500/10 text-red-500'
                                    : 'border-white/10 hover:bg-white/5'
                                }`}
                        >
                            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>

                        <button
                            onClick={() => setIsActive(!isActive)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${isActive
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                }`}
                        >
                            {isActive ? (
                                <>
                                    <Square className="w-5 h-5" />
                                    <span>Stop Test</span>
                                </>
                            ) : (
                                <>
                                    <Play className="w-5 h-5" />
                                    <span>Start Test</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
                {/* Live Preview */}
                <div className="bg-void-900 border-r border-white/10 flex flex-col">
                    <div className="p-4 border-b border-white/10 bg-void-800">
                        <h3 className="font-semibold flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'}`} />
                            Live Preview
                        </h3>
                    </div>

                    <div className="flex-1 relative overflow-hidden">
                        {isActive ? (
                            <div className="absolute inset-0">
                                <Stage />
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-void-800 border border-white/10 flex items-center justify-center">
                                        <Play className="w-8 h-8 text-zinc-600" />
                                    </div>
                                    <p className="text-zinc-500">Click "Start Test" to begin</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Debug Console */}
                <div className="bg-void-800 flex flex-col">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <h3 className="font-semibold">Debug Console</h3>
                        <button
                            onClick={() => setLogs([])}
                            className="text-xs text-zinc-500 hover:text-white transition-colors"
                        >
                            Clear
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2">
                        {logs.length === 0 ? (
                            <p className="text-zinc-600">No logs yet. Start a test session to see AI thought process.</p>
                        ) : (
                            logs.map((log, index) => (
                                <div key={index} className="flex items-start gap-3 p-2 hover:bg-void-900 rounded">
                                    <span className="text-zinc-600 flex-shrink-0">{log.timestamp}</span>
                                    <span className="flex-shrink-0">{getLogIcon(log.type)}</span>
                                    <span className={`flex-1 ${getLogColor(log.type)}`}>
                                        [{log.type.toUpperCase()}] {log.message}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/10">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Type a test message..."
                                className="flex-1 px-4 py-2 bg-void-900 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 text-sm"
                                disabled={!isActive}
                            />
                            <button
                                disabled={!isActive}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
