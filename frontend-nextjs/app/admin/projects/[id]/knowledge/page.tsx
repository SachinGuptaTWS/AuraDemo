'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Upload, FileText, Link as LinkIcon, Trash2 } from 'lucide-react';

interface Document {
    id: string;
    name: string;
    type: 'pdf' | 'link';
    size?: string;
    url?: string;
}

export default function KnowledgeBasePage() {
    const params = useParams();
    const [documents, setDocuments] = useState<Document[]>([
        { id: '1', name: 'Sales Deck.pdf', type: 'pdf', size: '2.4 MB' },
        { id: '2', name: 'API Documentation', type: 'link', url: 'https://docs.example.com' }
    ]);
    const [goldenPath, setGoldenPath] = useState('Start at Dashboard, show the ROI chart, then navigate to Settings to demonstrate Dark Mode toggle.');

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            const newDoc: Document = {
                id: Date.now().toString(),
                name: file.name,
                type: 'pdf',
                size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
            };
            setDocuments(prev => [...prev, newDoc]);
        });
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold mb-2">Brain Surgery</h1>
                    <p className="text-zinc-400">Knowledge Base & Demo Script</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Visual Map */}
                    <div className="bg-void-800 border border-white/10 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Site Map</h2>
                        <p className="text-sm text-zinc-500 mb-6">
                            Pages discovered by the crawler
                        </p>

                        {/* Simple node visualization */}
                        <div className="relative h-96 bg-void-900 rounded-lg p-6 overflow-auto">
                            <div className="space-y-4">
                                {/* Root node */}
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    <div className="flex-1 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                        <p className="text-sm font-medium">Dashboard</p>
                                        <p className="text-xs text-zinc-500">app.example.com/dashboard</p>
                                    </div>
                                </div>

                                {/* Child nodes */}
                                <div className="ml-8 space-y-3">
                                    {['Settings', 'Reports', 'Users', 'Billing'].map((page) => (
                                        <div key={page} className="flex items-center gap-3">
                                            <div className="w-px h-8 bg-white/10 -mt-8" />
                                            <div className="w-3 h-3 rounded-full bg-green-500" />
                                            <div className="flex-1 px-4 py-2 bg-void-800 border border-white/10 rounded-lg hover:border-green-500/50 transition-colors cursor-pointer">
                                                <p className="text-sm font-medium">{page}</p>
                                                <p className="text-xs text-zinc-500">/{page.toLowerCase()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                            <p className="text-sm text-blue-400">
                                ✓ Found 12 pages • 47 interactive elements
                            </p>
                        </div>
                    </div>

                    {/* Document Upload & Golden Path */}
                    <div className="space-y-6">
                        {/* Upload Zone */}
                        <div className="bg-void-800 border border-white/10 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Knowledge Documents</h2>

                            {/* Dropzone */}
                            <label className="block border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500/50 transition-colors">
                                <input
                                    type="file"
                                    multiple
                                    accept=".pdf,.pptx,.docx"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <Upload className="w-12 h-12 mx-auto mb-4 text-zinc-500" />
                                <p className="text-sm font-medium mb-1">Drop files here or click to upload</p>
                                <p className="text-xs text-zinc-500">PDF, PPTX, DOCX up to 10MB</p>
                            </label>

                            {/* Document List */}
                            <div className="mt-6 space-y-2">
                                {documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="flex items-center gap-3 p-3 bg-void-900 border border-white/10 rounded-lg group"
                                    >
                                        {doc.type === 'pdf' ? (
                                            <FileText className="w-5 h-5 text-blue-500" />
                                        ) : (
                                            <LinkIcon className="w-5 h-5 text-green-500" />
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{doc.name}</p>
                                            {doc.size && (
                                                <p className="text-xs text-zinc-500">{doc.size}</p>
                                            )}
                                            {doc.url && (
                                                <p className="text-xs text-zinc-500 truncate">{doc.url}</p>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => setDocuments(docs => docs.filter(d => d.id !== doc.id))}
                                            className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded transition-all"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Golden Path */}
                        <div className="bg-void-800 border border-white/10 rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Golden Path</h2>
                            <p className="text-sm text-zinc-500 mb-4">
                                Define the ideal demo flow for the AI to follow
                            </p>

                            <textarea
                                value={goldenPath}
                                onChange={(e) => setGoldenPath(e.target.value)}
                                rows={6}
                                className="w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 resize-none font-mono text-sm"
                                placeholder="Example: Start at Dashboard, show the ROI chart, then go to Settings..."
                            />

                            <div className="mt-4 flex gap-3">
                                <button className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                    Save Changes
                                </button>
                                <button className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
