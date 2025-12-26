"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Bot, Sparkles, Headphones, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Agent {
    id: string;
    name: string;
    role: string;
    type: string;
    description: string;
    createdAt: string;
    status: string;
}

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await fetch("/api/agents");
                if (response.ok) {
                    const data = await response.json();
                    setAgents(data);
                }
            } catch (error) {
                console.error("Failed to fetch agents", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAgents();
    }, []);

    const filteredAgents = agents.filter(agent =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-24 h-full">
            {/* Heavy Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Link href="/admin" className="hover:text-blue-600 transition-colors">Admin</Link>
                        <span className="text-gray-300">/</span>
                        <span className="font-medium text-gray-900">Agents</span>
                    </nav>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">AI Workforce</h1>
                    <p className="text-base text-gray-600 mt-1">Manage and monitor your deployed AI agents.</p>
                </div>
                <Link href="/admin/agents/new">
                    <Button className="h-11 px-6 shadow-lg shadow-blue-600/20 gap-2 font-semibold">
                        <Plus className="w-4 h-4" />
                        New Agent
                    </Button>
                </Link>
            </div>

            {/* Filters with Heavy Design */}
            <div className="flex items-center gap-4 p-1.5 bg-white rounded-xl border border-gray-200 shadow-sm max-w-md ring-1 ring-gray-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search agents..."
                        className="w-full h-10 pl-10 pr-4 text-sm font-medium text-gray-900 bg-transparent border-none focus:ring-0 placeholder:text-gray-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-56 bg-white border border-gray-200 rounded-xl shadow-sm animate-pulse" />
                    ))}
                </div>
            ) : filteredAgents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                        <Bot className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">No agents found</h3>
                    <p className="text-gray-500 mb-6 max-w-xs text-center">
                        {searchQuery ? "Try adjusting your search terms." : "Get started by creating your first AI agent."}
                    </p>
                    {!searchQuery && (
                        <Link href="/admin/agents/new">
                            <Button variant="outline">Create Agent</Button>
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAgents.map((agent) => {
                        const Icon = agent.type === 'sales' ? Sparkles : agent.type === 'support' ? Headphones : Bot;

                        return (
                            <div key={agent.id} className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 flex flex-col">

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        {/* Dots removed as requested */}
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                        {agent.name}
                                    </h3>
                                    <p className="text-sm font-medium text-gray-500 mb-6">{agent.role}</p>

                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                            Active
                                        </span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                                            v1.0
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-auto px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-400">
                                        {new Date(agent.createdAt).toLocaleDateString()}
                                    </span>
                                    <Link
                                        href={`/admin/agents/${agent.id}`}
                                        className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                                    >
                                        View Details <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
