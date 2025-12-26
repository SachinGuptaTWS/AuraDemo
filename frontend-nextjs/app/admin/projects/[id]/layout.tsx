'use client';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Brain, Mic, Play, Rocket, ArrowLeft } from 'lucide-react';

export default function ProjectDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const pathname = usePathname();
    const projectId = params.id as string;

    const tabs = [
        { href: `/admin/projects/${projectId}/knowledge`, icon: Brain, label: 'Knowledge Base' },
        { href: `/admin/projects/${projectId}/persona`, icon: Mic, label: 'Persona Lab' },
        { href: `/admin/projects/${projectId}/playground`, icon: Play, label: 'Playground' },
        { href: `/admin/projects/${projectId}/deploy`, icon: Rocket, label: 'Deploy' },
    ];

    return (
        <div className="min-h-screen bg-void-900">
            {/* Header */}
            <div className="bg-void-800 border-b border-white/10">
                <div className="p-6">
                    <Link
                        href="/admin/projects"
                        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-4 transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Projects</span>
                    </Link>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold mb-1">Project Configuration</h1>
                            <p className="text-sm text-zinc-500">ID: {projectId}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-sm text-zinc-400">Ready</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-6">
                    <nav className="flex gap-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = pathname === tab.href;

                            return (
                                <Link
                                    key={tab.href}
                                    href={tab.href}
                                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${isActive
                                            ? 'border-blue-500 text-blue-500'
                                            : 'border-transparent text-zinc-400 hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="font-medium text-sm">{tab.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Content */}
            {children}
        </div>
    );
}
