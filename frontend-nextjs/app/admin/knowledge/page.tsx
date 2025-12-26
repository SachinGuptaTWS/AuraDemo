"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

// Professional SVGs
const Icons = {
    FileText: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
        </svg>
    ),
    Globe: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.356 5.86a6.002 6.002 0 018.666-1.503 6 6 0 00-4.69 4.69A6.002 6.002 0 015.357 5.86zm-1.01 2.376a6 6 0 005.138 8.441 6.002 6.002 0 01-5.138-8.441zM7 10a3 3 0 116 0 3 3 0 01-6 0zm7.644-4.14a6.002 6.002 0 01-1.288 8.442 6 6 0 00-4.69-4.691 6.002 6.002 0 015.978-3.75z" clipRule="evenodd" />
        </svg>
    ),
    Plus: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
        </svg>
    ),
    More: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
            <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
        </svg>
    ),
    Search: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
        </svg>
    )
};

interface KnowledgeDoc {
    id: string;
    title: string;
    type: 'text' | 'url';
    content: string;
    size: string;
    createdAt: string;
    status: string;
}

export default function KnowledgePage() {
    const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // New Doc Form
    const [newDoc, setNewDoc] = useState({ title: "", type: "text", content: "" });

    useEffect(() => {
        fetchDocs();
    }, []);

    const fetchDocs = async () => {
        try {
            const res = await fetch("/api/documents");
            if (res.ok) setDocs(await res.json());
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch("/api/documents", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDoc)
            });
            if (res.ok) {
                setNewDoc({ title: "", type: "text", content: "" });
                setIsAdding(false);
                fetchDocs();
            }
        } catch (e) {
            alert("Failed to create document");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 pb-24 h-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Link href="/admin" className="hover:text-blue-600 transition-colors">Admin</Link>
                        <span className="text-gray-300">/</span>
                        <span className="font-medium text-gray-900">Knowledge Base</span>
                    </nav>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Knowledge Sources</h1>
                    <p className="text-base text-gray-600 mt-1">Manage documents and reference materials for your agents.</p>
                </div>
                {!isAdding && (
                    <Button className="h-11 px-6 shadow-lg shadow-blue-600/20 gap-2 font-semibold" onClick={() => setIsAdding(true)}>
                        <Icons.Plus className="w-5 h-5" />
                        Add Source
                    </Button>
                )}
            </div>

            {/* Add Form Area */}
            {isAdding && (
                <div className="bg-white rounded-xl border border-blue-200 shadow-lg p-6 animate-in slide-in-from-top-4 duration-300 ring-1 ring-blue-50">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Add New Knowledge Source</h3>
                    <form onSubmit={handleCreate} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Title</label>
                                <Input
                                    value={newDoc.title}
                                    onChange={e => setNewDoc({ ...newDoc, title: e.target.value })}
                                    placeholder="e.g. Sales Playbook"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Type</label>
                                <select
                                    className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newDoc.type}
                                    onChange={e => setNewDoc({ ...newDoc, type: e.target.value })}
                                >
                                    <option value="text">Text Content</option>
                                    <option value="url">External URL</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                {newDoc.type === 'url' ? 'Source URL' : 'Content'}
                            </label>
                            {newDoc.type === 'url' ? (
                                <Input
                                    value={newDoc.content}
                                    onChange={e => setNewDoc({ ...newDoc, content: e.target.value })}
                                    placeholder="https://..."
                                    required
                                />
                            ) : (
                                <Textarea
                                    value={newDoc.content}
                                    onChange={e => setNewDoc({ ...newDoc, content: e.target.value })}
                                    className="h-32 font-mono text-sm"
                                    placeholder="Paste text content here..."
                                    required
                                />
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                            <Button type="submit" isLoading={isSaving}>Save Resource</Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Stats/Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="md:col-span-2 relative">
                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
                    />
                </div>
            </div>

            {/* Document List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading documents...</div>
                ) : docs.length === 0 ? (
                    <div className="p-16 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
                            <Icons.FileText className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No documents yet</h3>
                        <p className="text-gray-500 mb-6">Start by adding a text snippet or URL.</p>
                        <Button variant="outline" onClick={() => setIsAdding(true)}>Add your first doc</Button>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50/50 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                <th className="px-6 py-4">Document Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Size</th>
                                <th className="px-6 py-4">Added</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {docs.map(doc => (
                                <tr key={doc.id} className="group hover:bg-gray-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                                {doc.type === 'url' ? <Icons.Globe className="w-5 h-5" /> : <Icons.FileText className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{doc.title}</p>
                                                <p className="text-xs text-gray-500 truncate max-w-[200px]">{doc.type === 'url' ? doc.content : 'Text Content'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                                            {doc.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{doc.size}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(doc.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                            {doc.status || 'Ready'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600 p-2">
                                            <Icons.More className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
