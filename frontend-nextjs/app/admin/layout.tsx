'use client';

import { Sidebar } from "@/components/admin/Sidebar";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />

            {/* Main Content Area - responsive to sidebar */}
            <div className="ml-20 md:ml-64 transition-all duration-300">
                {/* Header */}
                <header className="sticky top-0 z-40 h-16 border-b border-gray-200 bg-white shadow-sm">
                    <div className="h-full px-8 flex items-center justify-between max-w-[1600px]">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500 font-medium">Admin</span>
                        </div>

                        {/* Global Actions */}
                        <div className="flex items-center gap-6">
                            <a
                                href="#"
                                className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
                            >
                                Documentation
                            </a>
                            <a
                                href="#"
                                className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
                            >
                                Support
                            </a>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8 max-w-[1600px]">
                    {children}
                </main>
            </div>
        </div>
    );
}
