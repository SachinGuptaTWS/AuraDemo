'use client';

export default function Footer() {
    return (
        <footer className="py-20 border-t border-glass-border">
            <div className="max-w-7xl mx-auto px-6">
                {/* Big Text CTA */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4 tracking-tight" style={{ letterSpacing: '-0.03em' }}>
                        Ready to automate your pipeline?
                    </h2>
                </div>

                {/* Links */}
                <div className="flex flex-wrap justify-center gap-8 mb-12">
                    <a href="/docs" className="text-zinc-400 hover:text-white transition-colors">
                        Docs
                    </a>
                    <a href="/api-status" className="text-zinc-400 hover:text-white transition-colors">
                        API Status
                    </a>
                    <a href="/pricing" className="text-zinc-400 hover:text-white transition-colors">
                        Pricing
                    </a>
                    <a href="/login" className="text-zinc-400 hover:text-white transition-colors">
                        Login
                    </a>
                </div>

                {/* System Status Easter Egg */}
                <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
                    <div className="w-2 h-2 bg-signal-emerald rounded-full animate-pulse" />
                    <span className="font-mono">System Status: Operational</span>
                </div>

                {/* Copyright */}
                <div className="text-center mt-12 text-sm text-zinc-600">
                    © 2025 Slink. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
