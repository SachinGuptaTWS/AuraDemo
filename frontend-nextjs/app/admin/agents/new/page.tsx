"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Bot, Sparkles, Headphones, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/utils/cn";

const AGENT_TYPES = [
    {
        id: "sales",
        title: "Sales Representative",
        description: "Optimized for capturing leads and handling objections.",
        icon: Sparkles,
    },
    {
        id: "support",
        title: "Customer Support",
        description: "Trained to answer questions and resolve issues 24/7.",
        icon: Headphones,
    },
    {
        id: "custom",
        title: "Custom Assistant",
        description: "Build a completely custom agent for specific needs.",
        icon: Bot,
    },
];

export default function CreateAgentPage() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState("sales");
    const [isLoading, setIsLoading] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        role: "",
        description: "",
    });

    const handleOptimization = async () => {
        if (!formData.description) return;
        setIsOptimizing(true);
        setError(null);
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: formData.description,
                    type: selectedType,
                    role: formData.role || "Assistant"
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                // Try to parse JSON error if possible
                try {
                    const jsonErr = JSON.parse(errText);
                    throw new Error(jsonErr.error || jsonErr.details || "Optimization failed");
                } catch (e) {
                    throw new Error(errText || "Optimization failed");
                }
            }

            const data = await response.json();
            if (data.optimizedPrompt) {
                setFormData(prev => ({ ...prev, description: data.optimizedPrompt }));
            }
        } catch (error: any) {
            console.error("Optimization failed", error);
            setError(error.message || "Failed to optimize prompt");
        } finally {
            setIsOptimizing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/agents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    type: selectedType,
                    status: "active",
                    stats: {
                        sessions: 0,
                        conversion: 0,
                        avgTime: 0
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to create agent: ${response.statusText}`);
            }

            router.push("/admin");
        } catch (error: any) {
            console.error("Failed to create agent", error);
            setError(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto pb-24">
            {/* Heavy Header with Breadcrumbs */}
            <div className="mb-8 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Link href="/admin" className="hover:text-blue-600 transition-colors">Admin</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/admin/agents" className="hover:text-blue-600 transition-colors">Agents</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="font-medium text-gray-900">New Agent</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Create New Agent
                </h1>
                <p className="text-base text-gray-500 mt-2 max-w-2xl">
                    Configure the personality, role, and capabilities of your new AI workforce member.
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium">
                    {error}
                </div>
            )}

            <form id="create-agent-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Main Setup */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Agent Type Selection */}
                    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900">Agent Persona</h2>
                            <p className="text-sm text-gray-500">Select the baseline personality model.</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {AGENT_TYPES.map((type) => {
                                    const Icon = type.icon;
                                    const isSelected = selectedType === type.id;
                                    return (
                                        <div
                                            key={type.id}
                                            onClick={() => setSelectedType(type.id)}
                                            className={cn(
                                                "relative cursor-pointer rounded-xl border-2 p-5 transition-all duration-200",
                                                isSelected
                                                    ? "border-blue-600 bg-blue-50/30 shadow-md ring-1 ring-blue-600/20"
                                                    : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50 shadow-sm hover:shadow-md"
                                            )}
                                        >
                                            {isSelected && (
                                                <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                            <div className={cn(
                                                "w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors",
                                                isSelected ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-gray-100 text-gray-500"
                                            )}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <h3 className={cn(
                                                "font-bold text-base mb-1.5",
                                                isSelected ? "text-blue-900" : "text-gray-900"
                                            )}>
                                                {type.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 leading-relaxed">
                                                {type.description}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Basic Details */}
                    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900">Core Identity</h2>
                            <p className="text-sm text-gray-500">Define how this agent appears to users.</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Agent Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Sarah from Sales"
                                        required
                                        className="h-11 shadow-sm"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role / Title</Label>
                                    <Input
                                        id="role"
                                        placeholder="e.g. Senior Account Executive"
                                        required
                                        className="h-11 shadow-sm"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Configuration & Instructions */}
                <div className="space-y-8">
                    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900">System Instructions</h2>
                            <p className="text-sm text-gray-500">The brain of your agent.</p>
                        </div>
                        <div className="p-6 h-full flex flex-col">
                            <div className="space-y-2 flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <Label htmlFor="description">Prompt Configuration</Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleOptimization}
                                        disabled={!formData.description || isOptimizing}
                                        className={cn("text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50", isOptimizing && "opacity-70")}
                                    >
                                        {isOptimizing ? (
                                            <>
                                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                                Optimizing...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-3 h-3 mr-1" />
                                                Optimize with AI
                                            </>
                                        )}
                                    </Button>
                                </div>
                                <Textarea
                                    id="description"
                                    placeholder="Describe how the agent should behave, what tone it should use, and its primary goals..."
                                    className="min-h-[300px] font-mono text-sm leading-relaxed p-4 shadow-inner bg-gray-50/50"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-500">
                                    Tip: Describe the agent's goal in plain English, then click <strong>Optimize with AI</strong> to generate professional system instructions.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </form>

            {/* Sticky Action Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        {/* Note removed to avoid clutter/mock feel */}
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button type="button" variant="outline" className="h-11 px-8 text-gray-600">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" form="create-agent-form" isLoading={isLoading} size="lg" className="h-11 px-8 shadow-lg shadow-blue-600/20">
                            Create Agent
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
