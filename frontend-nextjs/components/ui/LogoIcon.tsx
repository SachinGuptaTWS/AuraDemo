"use client";

export default function LogoIcon({ variant = "monolith", className = "w-6 h-6" }: { variant?: "monolith" | "glow", className?: string }) {
    if (variant === "glow") {
        return (
            <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <title>AuraDemo Signal Glow Logo</title>
                <defs>
                    <linearGradient id="aura_glow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#3B82F6", stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: "#60A5FA", stopOpacity: 1 }} />
                    </linearGradient>
                    <filter id="blue-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </defs>
                <g filter="url(#blue-glow)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M85.6406 34.3594C93.357 42.0757 97.6909 52.5408 97.6909 63.4531C97.6909 74.3655 93.357 84.8306 85.6406 92.5469L76.2125 83.1188C81.4234 77.9079 84.3509 70.8408 84.3509 63.4531C84.3509 56.0655 81.4234 49.0045 76.2125 43.7936L85.6406 34.3594Z" fill="url(#aura_glow)" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M34.3594 85.6406C26.643 77.9243 22.3091 67.4592 22.3091 56.5469C22.3091 45.6345 26.643 35.1694 34.3594 27.4531L43.7875 36.8812C38.5766 42.0921 35.6491 49.1592 35.6491 56.5469C35.6491 63.9345 38.5766 70.9955 43.7875 76.2064L34.3594 85.6406Z" fill="url(#aura_glow)" />
                    <circle cx="60" cy="60" r="16" fill="#FFFFFF" />
                </g>
            </svg>
        );
    }

    return (
        <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <title>AuraDemo Monolith Logo</title>
            <path fillRule="evenodd" clipRule="evenodd" d="M60 120C93.1371 120 120 93.1371 120 60C120 26.8629 93.1371 0 60 0C26.8629 0 0 26.8629 0 60C0 93.1371 26.8629 120 60 120ZM60 106.667C85.7733 106.667 106.667 85.7733 106.667 60C106.667 34.2267 85.7733 13.3333 60 13.3333C34.2267 13.3333 13.3333 34.2267 13.3333 60C13.3333 85.7733 34.2267 106.667 60 106.667Z" fill="currentColor" />
            <path fillRule="evenodd" clipRule="evenodd" d="M85.6406 34.3594C93.357 42.0757 97.6909 52.5408 97.6909 63.4531C97.6909 74.3655 93.357 84.8306 85.6406 92.5469L76.2125 83.1188C81.4234 77.9079 84.3509 70.8408 84.3509 63.4531C84.3509 56.0655 81.4234 49.0045 76.2125 43.7936L85.6406 34.3594Z" fill="currentColor" />
            <path fillRule="evenodd" clipRule="evenodd" d="M34.3594 85.6406C26.643 77.9243 22.3091 67.4592 22.3091 56.5469C22.3091 45.6345 26.643 35.1694 34.3594 27.4531L43.7875 36.8812C38.5766 42.0921 35.6491 49.1592 35.6491 56.5469C35.6491 63.9345 38.5766 70.9955 43.7875 76.2064L34.3594 85.6406Z" fill="currentColor" />
        </svg>
    );
}
