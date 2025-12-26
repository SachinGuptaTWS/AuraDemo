import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700'],
    variable: '--font-inter',
    display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'Slink - Autonomous AI Sales Engineer | Sub-500ms Voice Latency',
    description: 'Deploy an AI Sales Engineer that qualifies leads, runs live demos, and closes deals 24/7. WebRTC-powered voice AI with real-time computer vision.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans text-white antialiased`} style={{ background: '#030014' }}>
                {children}
            </body>
        </html>
    )
}
