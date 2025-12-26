'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, MoreVertical, Play } from 'lucide-react';

interface Project {
    id: string;
    name: string;
    url: string;
    status: 'training' | 'ready' | 'failed';
    createdAt: string;
}

export default function ProjectsPage() {
    const [projects] = useState<Project[]>([
        {
            id: 'proj_1',
            name: 'HubSpot CRM Demo',
            url: 'https://app.hubspot.com',
            status: 'ready',
            createdAt: '2024-12-20'
        },
        {
            id: 'proj_2',
            name: 'Salesforce Demo',
            url: 'https://salesforce.com',
            status: 'training',
            createdAt: '2024-12-22'
        }
    ]);

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-semibold mb-2">Projects</h1>
                    <p className="text-zinc-400">Manage your AI demo agents</p>
                </div>

                <Link
                    href="/admin/projects/new"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">New Project</span>
                </Link>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full pl-12 pr-4 py-3 bg-void-800 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50"
                    />
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <Link
                        key={project.id}
                        href={`/admin/projects/${project.id}`}
                        className="group bg-void-800 border border-white/10 rounded-lg p-6 hover:border-blue-500/50 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-500 transition-colors">
                                    {project.name}
                                </h3>
                                <p className="text-sm text-zinc-500">{project.url}</p>
                            </div>

                            <button className="p-2 hover:bg-white/5 rounded-lg">
                                <MoreVertical className="w-5 h-5 text-zinc-500" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${project.status === 'ready' ? 'bg-green-500' :
                                        project.status === 'training' ? 'bg-amber-500 animate-pulse' :
                                            'bg-red-500'
                                    }`} />
                                <span className="text-sm text-zinc-400 capitalize">{project.status}</span>
                            </div>

                            {project.status === 'ready' && (
                                <div className="flex items-center gap-1 text-xs text-blue-500">
                                    <Play className="w-3 h-3" />
                                    <span>Test</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/5">
                            <p className="text-xs text-zinc-600">Created {project.createdAt}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
