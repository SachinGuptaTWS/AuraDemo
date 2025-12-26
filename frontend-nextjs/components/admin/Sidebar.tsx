"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import LogoIcon from "@/components/ui/LogoIcon";
import {
    LayoutDashboard,
    Bot,
    Database,
    BarChart3,
    Settings,
    HelpCircle,
    User,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { useState } from "react";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Agents", href: "/admin/agents", icon: Bot },
    { name: "Knowledge Base", href: "/admin/knowledge", icon: Database },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

const secondaryNav = [
    { name: "Settings", href: "/admin/settings", icon: Settings },
    { name: "Help & Docs", href: "/admin/help", icon: HelpCircle },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside className={cn(
            "fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col shadow-xl transition-all duration-300",
            isCollapsed ? "w-20" : "w-64"
        )}>
            {/* Logo */}
            <div className="px-6 py-6 border-b border-gray-200 flex items-center justify-between">
                <div className={cn("flex items-center gap-3", isCollapsed && "justify-center w-full")}>
                    <LogoIcon variant="monolith" className="w-8 h-8 text-gray-900 flex-shrink-0" />
                    {!isCollapsed && (
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                            Slink
                        </h1>
                    )}
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-md"
            >
                {isCollapsed ? (
                    <ChevronRight className="w-3 h-3 text-gray-600" />
                ) : (
                    <ChevronLeft className="w-3 h-3 text-gray-600" />
                )}
            </button>

            {/* Primary Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all",
                                isActive
                                    ? "bg-blue-50 text-blue-600 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                                isCollapsed && "justify-center"
                            )}
                            title={isCollapsed ? item.name : undefined}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span>{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Secondary Navigation */}
            <div className="px-4 py-4 border-t border-gray-200 space-y-1">
                {secondaryNav.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all",
                                isActive
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                                isCollapsed && "justify-center"
                            )}
                            title={isCollapsed ? item.name : undefined}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span>{item.name}</span>}
                        </Link>
                    );
                })}
            </div>

            {/* User Profile */}
            <div className={cn(
                "px-6 py-5 border-t border-gray-200 bg-gray-50",
                isCollapsed && "px-4"
            )}>
                <div className={cn(
                    "flex items-center gap-3",
                    isCollapsed && "justify-center"
                )}>
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">Admin User</p>
                            <p className="text-xs text-gray-500 truncate">admin@slink.ai</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
