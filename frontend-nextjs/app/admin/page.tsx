"use client";

import { Panel } from "@/components/admin/Panel";
import { Plus, Bot } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-base text-gray-600 mt-2">
                        Manage your AI agents and view analytics
                    </p>
                </div>

                <Link
                    href="/admin/agents/new"
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-sm shadow-lg hover:shadow-xl"
                >
                    <Plus className="w-4 h-4" />
                    Create New Agent
                </Link>
            </div>

            {/* Empty State */}
            <Panel title="Get Started" className="mt-8">
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 shadow-sm">
                        <Bot className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                        No agents yet
                    </h3>
                    <p className="text-base text-gray-600 mb-8 text-center max-w-md">
                        Create your first AI agent to start automating customer conversations 24/7.
                    </p>
                    <Link
                        href="/admin/agents/new"
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                    >
                        <Plus className="w-5 h-5" />
                        Create Your First Agent
                    </Link>
                </div>
            </Panel>

            {/* Quick Stats - Empty State */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Panel title="Total Sessions">
                    <p className="text-4xl font-bold text-gray-900 mt-2">0</p>
                    <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
                </Panel>

                <Panel title="Conversion Rate">
                    <p className="text-4xl font-bold text-gray-400 mt-2">—</p>
                    <p className="text-sm text-gray-500 mt-2">No data yet</p>
                </Panel>

                <Panel title="Avg. Session Time">
                    <p className="text-4xl font-bold text-gray-400 mt-2">—</p>
                    <p className="text-sm text-gray-500 mt-2">No data yet</p>
                </Panel>
            </div>
        </div>
    );
}
