import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
    title: 'Slink - Live AI Product Demonstrations',
    description: 'Experience AI-powered product demonstrations in real-time',
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // Prevents mobile zoom
};

export default function DemoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
