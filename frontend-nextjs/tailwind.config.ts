import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // THE CANVAS
                void: {
                    DEFAULT: '#030014',    // Deep Space Blue/Black (Supersonik style)
                    surface: '#0F1117',    // Slightly lighter for cards
                    border: 'rgba(255, 255, 255, 0.08)',
                    highlight: 'rgba(255, 255, 255, 0.12)',
                    // Legacy naming for compatibility
                    900: '#030014',
                    800: '#0F1117',
                    700: '#18181B',
                },
                surface: '#0F1117',  // Card background

                // THE SIGNALS (Neon Accents) - Deep Carbon Spec
                'signal-emerald': '#10B981',  // User Speaking / Success
                'signal-blue': '#3B82F6',     // Agent Speaking / Active
                'signal-amber': '#F59E0B',    // Agent Thinking / Latency
                'signal-rose': '#F43F5E',     // Error / Disconnect

                signal: {
                    emerald: '#10B981',  // Listening (User Voice)
                    amber: '#F59E0B',  // Thinking (Latency Mask)
                    blue: '#3B82F6',  // Speaking (Agent Voice)
                    rose: '#F43F5E',  // Error / Hangup
                    // Legacy naming for compatibility
                    success: '#10B981',
                    active: '#3B82F6',
                    warn: '#F59E0B',
                    error: '#EF4444',
                },

                // THE GLASS (Frosted Layers) - Deep Carbon Spec
                'glass-light': 'rgba(255, 255, 255, 0.05)',
                'glass-heavy': 'rgba(9, 9, 11, 0.75)',
                'glass-border': 'rgba(255, 255, 255, 0.08)',

                glass: {
                    light: 'rgba(255, 255, 255, 0.05)',
                    heavy: 'rgba(9, 9, 11, 0.75)',
                    panel: 'rgba(9, 9, 11, 0.65)',   // 65% Opacity
                    surface: 'rgba(9, 9, 11, 0.7)',   // Legacy
                    border: 'rgba(255, 255, 255, 0.08)',
                    highlight: 'rgba(255, 255, 255, 0.03)',
                },

                // ADMIN DASHBOARD (Professional White Theme)
                admin: {
                    bg: '#F9FAFB',       // Gray 50 - Light background
                    panel: '#FFFFFF',    // White - Sidebar/panels
                    surface: '#FFFFFF',  // White - Cards
                    border: '#E5E7EB',   // Gray 200 - Borders
                    hover: '#F3F4F6',    // Gray 100 - Hover states
                    text: '#111827',     // Gray 900 - Primary text
                    textSecondary: '#6B7280', // Gray 500 - Secondary text
                },

                // FUNCTIONAL STATUS COLORS
                status: {
                    success: '#10B981', // Emerald 500 (Live/Success)
                    warning: '#F59E0B', // Amber 500 (Training/Warning)
                    error: '#EF4444',   // Red 500 (Failed/Error)
                    info: '#3B82F6',    // Blue 500 (Processing/Info)
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'], // Crucial for "Tech" feel
            },
            fontSize: {
                'h1': ['24px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
                'body': ['15px', { lineHeight: '1.5', fontWeight: '400' }],
                'label': ['11px', { lineHeight: '1.4', letterSpacing: '0.05em', fontWeight: '500' }],
            },
            // EXACT SHADOWS - Deep Carbon Spec
            boxShadow: {
                'glow-sm': '0 0 10px rgba(59, 130, 246, 0.3)',
                'glow-lg': '0 0 40px rgba(59, 130, 246, 0.25)',
                'glow-blue': '0 0 20px rgba(59, 130, 246, 0.4)',
                'glow-green': '0 0 20px rgba(16, 185, 129, 0.4)',
                'panel': '0 8px 32px rgba(0, 0, 0, 0.4)',
            },
            backgroundImage: {
                'aurora': 'radial-gradient(circle at 50% -20%, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 50%)',
            },
            backdropBlur: {
                'xs': '2px',
                'sm': '4px',
                'md': '8px',
                'lg': '12px',
                'xl': '24px',
                '2xl': '40px',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'breathe': 'breathe 3s ease-in-out infinite',
                'aurora': 'aurora 15s ease-in-out infinite',
                'aurora-delayed': 'aurora 15s ease-in-out 7.5s infinite',
                'meteor': 'meteor 5s linear infinite',
            },
            keyframes: {
                breathe: {
                    '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
                    '50%': { transform: 'scale(1.02)', opacity: '1' },
                },
                aurora: {
                    '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                    '33%': { transform: 'translate(30px, -30px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                },
                meteor: {
                    '0%': { transform: 'rotate(215deg) translateX(0)', opacity: '1' },
                    '70%': { opacity: '1' },
                    '100%': { transform: 'rotate(215deg) translateX(-500px)', opacity: '0' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
