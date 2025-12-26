'use client';

import { useState } from 'react';
import { Play, Volume2 } from 'lucide-react';

interface Voice {
    id: string;
    name: string;
    accent: string;
    gender: string;
    preview: string;
}

const voices: Voice[] = [
    { id: '1', name: 'Sarah', accent: 'US Professional', gender: 'Female', preview: '/audio/sarah.mp3' },
    { id: '2', name: 'Tom', accent: 'UK Casual', gender: 'Male', preview: '/audio/tom.mp3' },
    { id: '3', name: 'Aarav', accent: 'Indian Friendly', gender: 'Male', preview: '/audio/aarav.mp3' },
    { id: '4', name: 'Emma', accent: 'Australian', gender: 'Female', preview: '/audio/emma.mp3' },
    { id: '5', name: 'Carlos', accent: 'Spanish', gender: 'Male', preview: '/audio/carlos.mp3' },
    { id: '6', name: 'Yuki', accent: 'Japanese', gender: 'Female', preview: '/audio/yuki.mp3' },
];

const languages = [
    'English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese',
    'Mandarin', 'Portuguese', 'Russian', 'Arabic'
];

export default function PersonaLabPage() {
    const [selectedVoice, setSelectedVoice] = useState('1');
    const [tone, setTone] = useState(50);
    const [selectedLanguages, setSelectedLanguages] = useState(['English', 'Hindi']);
    const [systemPrompt, setSystemPrompt] = useState(`You are Aura, a friendly AI sales engineer conducting a product demo.

**Behavior Guidelines:**
1. Start with a brief 2-minute overview of the product
2. If the user interrupts, stop immediately and answer their question
3. Use the available tools to navigate and demonstrate features
4. Always announce what you're about to do before doing it
5. Be professional but conversational

**Language Rules:**
- Detect the user's language from their first message
- If speaking Hindi, use professional Hinglish
- Maintain a warm, helpful tone throughout

**Demo Flow:**
- Follow the Golden Path when possible
- Adapt based on user questions and interests
- Highlight key features and benefits`);

    const toggleLanguage = (lang: string) => {
        setSelectedLanguages(prev =>
            prev.includes(lang)
                ? prev.filter(l => l !== lang)
                : [...prev, lang]
        );
    };

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold mb-2">Persona Lab</h1>
                    <p className="text-zinc-400">Configure your AI agent's personality and behavior</p>
                </div>

                <div className="space-y-8">
                    {/* Voice Selector */}
                    <div className="bg-void-800 border border-white/10 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Voice Selection</h2>
                        <p className="text-sm text-zinc-500 mb-6">
                            Choose the voice that best represents your brand
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {voices.map((voice) => (
                                <button
                                    key={voice.id}
                                    onClick={() => setSelectedVoice(voice.id)}
                                    className={`p-4 rounded-lg border-2 transition-all text-left ${selectedVoice === voice.id
                                            ? 'border-blue-500 bg-blue-500/10'
                                            : 'border-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="font-semibold mb-1">{voice.name}</p>
                                            <p className="text-xs text-zinc-500">{voice.accent}</p>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full ${selectedVoice === voice.id ? 'bg-blue-500' : 'bg-zinc-600'
                                            }`} />
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                                        <Volume2 className="w-3 h-3" />
                                        <span>{voice.gender}</span>
                                    </div>

                                    <button className="mt-3 w-full py-2 bg-void-900 border border-white/10 rounded text-xs hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                                        <Play className="w-3 h-3" />
                                        <span>Preview</span>
                                    </button>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tone Slider */}
                    <div className="bg-void-800 border border-white/10 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Tone & Style</h2>

                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-sm font-medium">Conversation Style</label>
                                    <span className="text-sm text-zinc-500">
                                        {tone < 33 ? 'Professional' : tone < 66 ? 'Balanced' : 'Enthusiastic'}
                                    </span>
                                </div>

                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={tone}
                                    onChange={(e) => setTone(Number(e.target.value))}
                                    className="w-full h-2 bg-void-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />

                                <div className="flex justify-between text-xs text-zinc-600 mt-2">
                                    <span>Professional</span>
                                    <span>Balanced</span>
                                    <span>Enthusiastic</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Language Multi-select */}
                    <div className="bg-void-800 border border-white/10 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Supported Languages</h2>
                        <p className="text-sm text-zinc-500 mb-6">
                            Select languages the AI can speak and understand
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {languages.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => toggleLanguage(lang)}
                                    className={`px-4 py-2 rounded-lg border transition-all ${selectedLanguages.includes(lang)
                                            ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                                            : 'border-white/10 hover:border-white/20'
                                        }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>

                        <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                            <p className="text-sm text-blue-400">
                                {selectedLanguages.length} language{selectedLanguages.length !== 1 ? 's' : ''} selected
                            </p>
                        </div>
                    </div>

                    {/* System Prompt Editor */}
                    <div className="bg-void-800 border border-white/10 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">System Prompt</h2>
                        <p className="text-sm text-zinc-500 mb-6">
                            Define the AI's behavior, personality, and instructions
                        </p>

                        <textarea
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                            rows={16}
                            className="w-full px-4 py-3 bg-black border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 resize-none font-mono text-sm"
                        />

                        <div className="mt-4 flex gap-3">
                            <button className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                                Save Configuration
                            </button>
                            <button className="px-6 py-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                                Reset to Default
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
