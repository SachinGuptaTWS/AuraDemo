"use client";

import { useEffect, useRef } from "react";

export const LivingVoidBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Mouse spotlight effect
        const handleMouseMove = (e: MouseEvent) => {
            const x = e.clientX;
            const y = e.clientY;
            container.style.setProperty("--mouse-x", `${x}px`);
            container.style.setProperty("--mouse-y", `${y}px`);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[-1] overflow-hidden bg-[#020202] pointer-events-none"
            style={{
                "--mouse-x": "50%",
                "--mouse-y": "50%",
            } as React.CSSProperties}
        >
            {/* Layer 2: The Aurora Blobs */}
            <div
                className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] animate-aurora mix-blend-screen will-change-transform"
                style={{
                    background: "rgba(59, 130, 246, 0.15)",
                }}
            />
            <div
                className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[120px] animate-aurora-delayed mix-blend-screen will-change-transform"
                style={{
                    background: "rgba(168, 85, 247, 0.15)",
                }}
            />

            {/* Layer 3: The Grid with Vignette Mask */}
            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: "url('/grid.svg')",
                    backgroundSize: "50px 50px",
                    maskImage:
                        "radial-gradient(ellipse at center, black 40%, transparent 70%)",
                    WebkitMaskImage:
                        "radial-gradient(ellipse at center, black 40%, transparent 70%)",
                }}
            />

            {/* Layer 3.5: Mouse Spotlight (Interactive Grid Reveal) */}
            <div
                className="absolute inset-0 opacity-0 md:opacity-100 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)`,
                    backgroundSize: "50px 50px",
                }}
            />

            {/* Layer 4: The Flow (Meteor/Beam Effects) */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-[300px] h-[1px] animate-meteor will-change-transform"
                        style={{
                            top: `${20 + i * 30}%`,
                            left: "100%",
                            background:
                                "linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.8), transparent)",
                            animationDelay: `${i * 2}s`,
                        }}
                    />
                ))}
            </div>

            {/* Layer 5: The Grain Overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat",
                }}
            />

            {/* Reduced Motion Support */}
            <style jsx>{`
                @media (prefers-reduced-motion: reduce) {
                    .animate-aurora,
                    .animate-aurora-delayed,
                    .animate-meteor {
                        animation: none !important;
                    }
                }
            `}</style>
        </div>
    );
};
