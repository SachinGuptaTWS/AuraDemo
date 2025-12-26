import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils' // We will need to create this, but for now let's just use string templates or clsx if available, or just classnames. Actually, I probably haven't created @/lib/utils yet. 

// Let's stick to standard nextjs font loading first.

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
    title: 'AzureSonik - AI-Powered Product Demos',
    description: 'Instant product demonstrations powered by Azure OpenAI. Zero waiting, live navigation.',
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
