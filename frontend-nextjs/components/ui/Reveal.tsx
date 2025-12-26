'use client';

import { useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface RevealProps {
    children: ReactNode;
    delay?: number;
}

export function Reveal({ children, delay = 0 }: RevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <div
            ref={ref}
            style={{
                transform: isInView ? "none" : "translateY(20px)",
                opacity: isInView ? 1 : 0,
                transition: `all 0.6s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}s`
            }}
        >
            {children}
        </div>
    );
}
