"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";

// Professional Custom SVGs (Heroicons Solid/Outline based)
const Icons = {
    Back: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
        </svg>
    ),
    Trash: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
        </svg>
    ),
    Shield: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M10.339 2.237a.531.531 0 00-.678 0 11.947 11.947 0 01-6.078 3.37c-.384.098-.558.514-.54.892.019.389.068.78.147 1.168.328 1.621 1.052 3.8.318 6.445A6.001 6.001 0 0110 18a6.001 6.001 0 013.791-3.888c.95-.369 1.77-1.127 2.318-2.445.079-.388.128-.779.147-1.168.018-.378-.156-.794-.54-.892a11.947 11.947 0 01-6.078-3.37zm-3.88 8.053a.75.75 0 010-1.06l2.5-2.5a.75.75 0 011.06 0l2.5 2.5a.75.75 0 11-1.06 1.06L10 8.811 8.52 10.29a.75.75 0 01-1.06 0z" clipRule="evenodd" />
        </svg>
    ),
    Activity: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M2.22 8.64a.75.75 0 01.88-.42l3.2.71 1.9-5.7a.75.75 0 011.33-.18l3 4.5 2.65-2.65a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-1.06 0L9.5 6.27l-2.43 3.65a.75.75 0 01-1.14.16L4.78 8.4l-1.98-.44a.75.75 0 01-.58-.88zM4.75 16a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5H4.75z" clipRule="evenodd" />
        </svg>
    ),
    Save: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
        </svg>
    )
    // Add more as needed
};

interface Agent {
    id: string;
    name: string;
    role: string;
    type: string;
    description: string;
    createdAt: string;
    status: string;
    stats?: {
        conversations?: number;
        satisfaction?: string;
        avgResponseTime?: string;
    };
}

export default function AgentDetailPage({ params }: { params: { id: string } }) {
    const [agent, setAgent] = useState<Agent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'configuration'>('overview');
    const [isSaving, setIsSaving] = useState(false);

    // Edit State
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        type: "",
        description: ""
    });

    const router = useRouter();

    useEffect(() => {
        const fetchAgent = async () => {
            try {
                const res = await fetch(`/api/agents/${params.id}`);
                if (!res.ok) {
                    if (res.status === 404) router.push('/admin/agents');
                    return;
                }
                const data = await res.json();
                setAgent(data);
                setFormData({
                    name: data.name,
                    role: data.role,
                    type: data.type,
                    description: data.description
                });
            } catch (err) {
                console.error("Failed to fetch agent", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAgent();
    }, [params.id, router]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this agent? This action cannot be undone.")) return;
        try {
            await fetch(`/api/agents/${params.id}`, { method: 'DELETE' });
            router.push('/admin/agents');
        } catch (err) {
            alert("Failed to delete agent");
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch(`/api/agents/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const updated = await res.json();
                setAgent(updated);
                alert("Configuration saved successfully.");
            }
        } catch (err) {
            alert("Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-8"><div className="w-full h-80 bg-gray-50 border border-gray-100 rounded-xl animate-pulse" /></div>;
    if (!agent) return <div className="p-8">Agent not found</div>;

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Heavy Header */}
            <div className="flex flex-col mb-8 gap-6">
                <Link href="/admin/agents" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors w-fit">
                    <Icons.Back className="w-4 h-4 mr-1.5" />
                    Back to Agents
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-0">
                    <div className="pb-6">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">{agent.name}</h1>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="font-semibold text-gray-700">{agent.role}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span>Deployed {new Date(agent.createdAt).toLocaleDateString()}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800 uppercase tracking-wide">
                                {agent.status}
                            </span>
                        </div>
                    </div>

                    {/* Heavy Tabs */}
                    <div className="flex gap-1">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={cn(
                                "px-6 py-3 text-sm font-bold border-b-2 transition-colors",
                                activeTab === 'overview'
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            )}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('configuration')}
                            className={cn(
                                "px-6 py-3 text-sm font-bold border-b-2 transition-colors",
                                activeTab === 'configuration'
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            )}
                        >
                            Configuration
                        </button>
                    </div>
                </div>
            </div>

            {activeTab === 'overview' ? (
                /* Overview Tab */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-1 bg-gray-100" />
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                                <Icons.Shield className="w-5 h-5 text-gray-400" />
                                System Identity
                            </h3>
                            <div className="prose prose-sm max-w-none text-gray-600 font-mono text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-100">
                                {agent.description}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 table-auto">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                                <Icons.Activity className="w-5 h-5 text-gray-400" />
                                Activity Log
                            </h3>
                            <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-gray-100 rounded-lg bg-gray-50/30">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                                    <Icons.Activity className="w-5 h-5 text-gray-300" />
                                </div>
                                <p className="text-sm font-semibold text-gray-900">No activity recorded</p>
                                <p className="text-xs text-gray-500 mt-1">Real-time logs will appear here.</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Danger Zone</h3>
                            <Button
                                variant="outline"
                                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 justify-start"
                                onClick={handleDelete}
                            >
                                <Icons.Trash className="w-4 h-4 mr-2" />
                                Delete Agent
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Configuration Tab */
                <div className="max-w-2xl bg-white rounded-xl border border-gray-200 shadow-sm p-8 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-gray-900">Edit Configuration</h3>
                        <span className="text-sm text-gray-500">Last updated: Just now</span>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Agent Name</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Role</label>
                                <Input
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Type</label>
                            <select
                                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="custom">Custom Assistant</option>
                                <option value="sales">Sales Representative</option>
                                <option value="support">Customer Support</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">System Instructions</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="h-48 font-mono text-sm leading-relaxed"
                            />
                        </div>

                        <div className="pt-4 flex items-center justify-end border-t border-gray-100">
                            <Button type="submit" isLoading={isSaving} className="px-8 font-semibold shadow-lg shadow-blue-600/10">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
