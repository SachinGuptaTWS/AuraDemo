"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

// High-Fidelity Custom SVGs (Heavy SaaS Style)
const Icons = {
    FileText: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
    ),
    Globe: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    ),
    Plus: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    ),
    More: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
        </svg>
    ),
    Search: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    ),
    Upload: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
    ),
    Filter: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
    ),
    Trash: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
    )
};

interface KnowledgeDoc {
    id: string;
    title: string;
    type: 'text' | 'url' | 'file';
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

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this source?")) return;
        try {
            const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setDocs(docs.filter(d => d.id !== id));
            } else {
                alert("Failed to delete document");
            }
        } catch (e) {
            alert("Error deleting document");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("File must be smaller than 5MB");
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setNewDoc({
                        title: file.name,
                        type: 'file',
                        content: ev.target.result as string
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-8 pb-24 h-full font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-200 pb-8">
                <div>
                    <nav className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                        <Link href="/admin" className="hover:text-gray-700 transition-colors">Admin</Link>
                        <span>/</span>
                        <span className="text-gray-900">Knowledge Base</span>
                    </nav>
                    <div className="flex items-baseline gap-4">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Knowledge Base</h1>
                        <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">
                            {docs.length} Sources
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Manage and organize your agent's reference materials.</p>
                </div>
                {!isAdding && (
                    <Button className="h-10 px-5 shadow-sm border border-transparent font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setIsAdding(true)}>
                        <Icons.Plus className="w-4 h-4 mr-2" />
                        New Resource
                    </Button>
                )}
            </div>

            {/* Add Form Area */}
            {isAdding && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-xl p-8 animate-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Add Knowledge Source</h3>
                        <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                            <Icons.Plus className="w-5 h-5 rotate-45" />
                        </button>
                    </div>

                    <form onSubmit={handleCreate} className="space-y-6">
                        <div className="grid grid-cols-12 gap-6">
                            <div className="col-span-8 space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Title</label>
                                <Input
                                    value={newDoc.title}
                                    onChange={e => setNewDoc({ ...newDoc, title: e.target.value })}
                                    placeholder="e.g. Q3 Sales Playbook"
                                    className="font-medium"
                                    required
                                />
                            </div>
                            <div className="col-span-4 space-y-2">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Type</label>
                                <select
                                    className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newDoc.type}
                                    onChange={e => setNewDoc({ ...newDoc, type: e.target.value })}
                                >
                                    <option value="text">Text Snippet</option>
                                    <option value="url">External URL</option>
                                    <option value="file">Upload File</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                {newDoc.type === 'url' ? 'Source Destination' : newDoc.type === 'file' ? 'Document File' : 'Content Body'}
                            </label>

                            {newDoc.type === 'url' ? (
                                <div className="relative">
                                    <Icons.Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        value={newDoc.content}
                                        onChange={e => setNewDoc({ ...newDoc, content: e.target.value })}
                                        placeholder="https://example.com/resource"
                                        className="pl-9 font-mono text-sm"
                                        required
                                    />
                                </div>
                            ) : newDoc.type === 'file' ? (
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-10 hover:bg-gray-50/50 hover:border-blue-400 transition-all text-center cursor-pointer relative group bg-gray-50/30">
                                    <input
                                        type="file"
                                        accept=".pdf,.docx,.txt"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleFileChange}
                                    />
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="p-3 bg-white text-blue-600 rounded-lg shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                            <Icons.Upload className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">
                                                {newDoc.content ? "File Selected" : "Click to Upload"}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1 font-medium">
                                                {newDoc.content ? newDoc.title : "PDF, DOCX, TXT (Max 5MB)"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Textarea
                                    value={newDoc.content}
                                    onChange={e => setNewDoc({ ...newDoc, content: e.target.value })}
                                    className="min-h-[150px] font-mono text-sm leading-relaxed"
                                    placeholder="Paste text content here..."
                                    required
                                />
                            )}
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <Button type="submit" isLoading={isSaving} disabled={!newDoc.content} className="px-8 font-bold">
                                Save Resource
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filter Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Icons.Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by title..."
                        className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors shadow-sm placeholder:text-gray-400"
                    />
                </div>
                <Button variant="outline" className="h-10 px-4 text-gray-700 border-gray-200 hover:bg-gray-50 font-semibold gap-2">
                    <Icons.Filter className="w-4 h-4" />
                    Filters
                </Button>
            </div>

            {/* Heavy Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-sm font-medium text-gray-500">Loading sources...</div>
                ) : docs.length === 0 ? (
                    <div className="py-24 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-300 border border-gray-100">
                            <Icons.FileText className="w-8 h-8 opacity-50" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No documents found</h3>
                        <p className="text-sm text-gray-500 mb-6">Your knowledge base is currently empty.</p>
                        <Button variant="outline" size="sm" onClick={() => setIsAdding(true)} className="font-semibold">Add Resource</Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50/50">
                                    <th className="w-[40px] px-4 py-3 text-center">
                                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Size</th>
                                    <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Added</th>
                                    <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {docs.map(doc => (
                                    <tr key={doc.id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500 shadow-sm shrink-0">
                                                    {doc.type === 'url' ? <Icons.Globe className="w-4 h-4" /> : <Icons.FileText className="w-4 h-4" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 truncate max-w-[240px]">{doc.title}</p>
                                                    <p className="text-[11px] text-gray-500 truncate max-w-[240px] font-medium">
                                                        {doc.type === 'url' ? doc.content : doc.type === 'file' ? 'Uploaded Document' : 'Text Content'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold bg-gray-50 text-gray-700 uppercase tracking-wide border border-gray-100">
                                                {doc.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-[13px] text-gray-600 font-mono font-medium">{doc.size || '-'}</td>
                                        <td className="px-4 py-3 text-[13px] text-gray-600 font-medium">{new Date(doc.createdAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                                                {doc.status === 'ready' ? 'SYNCED' : doc.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => handleDelete(doc.id)}
                                                className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                                                title="Delete Source"
                                            >
                                                <Icons.Trash className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
