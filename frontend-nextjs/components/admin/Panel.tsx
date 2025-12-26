import { cn } from "@/utils/cn";

interface PanelProps {
    title: string;
    action?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export function Panel({ title, action, children, className }: PanelProps) {
    return (
        <div className={cn("bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow", className)}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{title}</h3>
                {action && <div>{action}</div>}
            </div>

            {/* Body */}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}
