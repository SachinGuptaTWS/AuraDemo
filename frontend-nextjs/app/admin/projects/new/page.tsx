'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

type LogEntry = {
    type: 'info' | 'success' | 'error';
    message: string;
};

export default function NewProjectPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        requiresLogin: false,
        username: '',
        password: ''
    });
    const [isDeploying, setIsDeploying] = useState(false);
    const [logs, setLogs] = useState<LogEntry[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsDeploying(true);
        setLogs([]);

        // Simulate deployment process
        const deploymentSteps = [
            { delay: 500, type: 'info' as const, message: '> Spawning Crawler...' },
            { delay: 1000, type: 'info' as const, message: '> Headless Browser Launched...' },
            { delay: 1500, type: 'info' as const, message: '> Navigating to ' + formData.url },
            {
                delay: 2000, type: formData.requiresLogin ? 'info' as const : 'success' as const,
                message: formData.requiresLogin ? '> Attempting Login...' : '> Site Accessible'
            },
            ...(formData.requiresLogin ? [
                { delay: 2500, type: 'success' as const, message: '> Login Successful ✓' }
            ] : []),
            { delay: 3000, type: 'info' as const, message: '> Mapping Navigation Structure...' },
            { delay: 4000, type: 'success' as const, message: '> Found 12 Pages' },
            { delay: 4500, type: 'info' as const, message: '> Analyzing UI Elements...' },
            { delay: 5500, type: 'success' as const, message: '> Deployment Complete ✓' }
        ];

        for (const step of deploymentSteps) {
            await new Promise(resolve => setTimeout(resolve, step.delay - (logs.length > 0 ? deploymentSteps[logs.length - 1].delay : 0)));
            setLogs(prev => [...prev, { type: step.type, message: step.message }]);
        }

        // Create project via API
        try {
            const response = await fetch('http://localhost:8000/v1/training/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    url: formData.url,
                    credentials: {
                        username: formData.username,
                        password: formData.password
                    },
                    seller_id: 'seller_demo'
                })
            });

            if (response.ok) {
                const project = await response.json();
                setTimeout(() => {
                    router.push(`/admin/projects/${project.id}`);
                }, 1000);
            }
        } catch (error) {
            setLogs(prev => [...prev, {
                type: 'error',
                message: '> Error: Could not connect to backend'
            }]);
            setIsDeploying(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/projects"
                    className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Projects</span>
                </Link>

                <h1 className="text-3xl font-semibold mb-2">The Hangar</h1>
                <p className="text-zinc-400">Deploy a Scout to learn your product</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <div className="bg-void-800 border border-white/10 rounded-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Project Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Project Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="My Awesome Product Demo"
                                className="w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50"
                                required
                            />
                        </div>

                        {/* Product URL */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Product URL
                            </label>
                            <input
                                type="url"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                placeholder="https://app.yourproduct.com"
                                className="w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50"
                                required
                            />
                            <p className="text-xs text-zinc-500 mt-2">
                                The URL where your product is accessible
                            </p>
                        </div>

                        {/* Requires Login Toggle */}
                        <div className="flex items-center gap-3 p-4 bg-void-900 rounded-lg">
                            <input
                                type="checkbox"
                                id="requiresLogin"
                                checked={formData.requiresLogin}
                                onChange={(e) => setFormData({ ...formData, requiresLogin: e.target.checked })}
                                className="w-4 h-4 rounded border-white/10 bg-void-800 text-blue-500 focus:ring-blue-500/50"
                            />
                            <label htmlFor="requiresLogin" className="text-sm font-medium cursor-pointer">
                                Requires Login?
                            </label>
                        </div>

                        {/* Credentials (conditional) */}
                        {formData.requiresLogin && (
                            <div className="space-y-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                                <p className="text-xs text-amber-500 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    Credentials are encrypted and stored securely
                                </p>

                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="Username or Email"
                                    className="w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50"
                                    required={formData.requiresLogin}
                                />

                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Password"
                                    className="w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50"
                                    required={formData.requiresLogin}
                                />
                            </div>
                        )}

                        {/* Deploy Button */}
                        <button
                            type="submit"
                            disabled={isDeploying}
                            className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isDeploying ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Deploying Scout...</span>
                                </>
                            ) : (
                                <span>Deploy Scout</span>
                            )}
                        </button>
                    </form>
                </div>

                {/* Terminal Log */}
                <div className="bg-black/50 border border-white/10 rounded-lg p-6 font-mono text-sm h-fit sticky top-8">
                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                        <span className="text-xs text-zinc-500 ml-2">Deployment Log</span>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {logs.length === 0 ? (
                            <p className="text-zinc-600">Waiting for deployment...</p>
                        ) : (
                            logs.map((log, index) => (
                                <div
                                    key={index}
                                    className={`flex items-start gap-2 ${log.type === 'success' ? 'text-green-500' :
                                            log.type === 'error' ? 'text-red-500' :
                                                'text-blue-400'
                                        }`}
                                >
                                    {log.type === 'success' && <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                                    {log.type === 'error' && <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                                    {log.type === 'info' && <Loader2 className="w-4 h-4 mt-0.5 flex-shrink-0 animate-spin" />}
                                    <span>{log.message}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
