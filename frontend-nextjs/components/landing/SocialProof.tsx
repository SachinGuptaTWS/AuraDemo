"use client";
import { motion } from "framer-motion";

// Custom SVG Logo Components
const SalesforceLogo = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path d="M10.5 3.5C9.5 3.5 8.7 4.1 8.4 5C7.9 4.7 7.3 4.5 6.7 4.5C5.2 4.5 4 5.7 4 7.2C4 7.4 4 7.6 4.1 7.8C2.9 8.3 2 9.5 2 11C2 12.9 3.6 14.5 5.5 14.5H17.5C19.4 14.5 21 12.9 21 11C21 9.5 20.1 8.3 18.9 7.8C19 7.6 19 7.4 19 7.2C19 5.7 17.8 4.5 16.3 4.5C15.7 4.5 15.1 4.7 14.6 5C14.3 4.1 13.5 3.5 12.5 3.5H10.5Z" fill="currentColor" />
    </svg>
);

const HubSpotLogo = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path d="M18.5 11.5V8.5C18.5 8.2 18.3 8 18 8H17V6C17 5.4 16.6 5 16 5H15V3.5C15 3.2 14.8 3 14.5 3C14.2 3 14 3.2 14 3.5V5H10V3.5C10 3.2 9.8 3 9.5 3C9.2 3 9 3.2 9 3.5V5H8C7.4 5 7 5.4 7 6V8H6C5.7 8 5.5 8.2 5.5 8.5V11.5C5.5 11.8 5.7 12 6 12H7V16C7 16.6 7.4 17 8 17H9V18.5C9 18.8 9.2 19 9.5 19C9.8 19 10 18.8 10 18.5V17H14V18.5C14 18.8 14.2 19 14.5 19C14.8 19 15 18.8 15 18.5V17H16C16.6 17 17 16.6 17 16V12H18C18.3 12 18.5 11.8 18.5 11.5Z" fill="currentColor" />
    </svg>
);

const SOC2Logo = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L4 6V11C4 16 7.5 20.5 12 22C16.5 20.5 20 16 20 11V6L12 2ZM12 11.99H18C17.5 15.5 15 18.5 12 19.93C9 18.5 6.5 15.5 6 11.99H12V6.3L17 9V11H12V11.99Z" fill="currentColor" />
    </svg>
);

const GDPRLogo = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" fill="currentColor" />
        <path d="M12 2C10.9 2 10 2.9 10 4V6.17C8.83 6.58 8 7.69 8 9V14C8 15.66 9.34 17 11 17H13C14.66 17 16 15.66 16 14V9C16 7.69 15.17 6.58 14 6.17V4C14 2.9 13.1 2 12 2ZM12 4C12.55 4 13 4.45 13 5V6H11V5C11 4.45 11.45 4 12 4ZM19 16V22H5V16H3V22C3 23.1 3.9 24 5 24H19C20.1 24 21 23.1 21 22V16H19Z" fill="currentColor" />
    </svg>
);

const AzureLogo = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path d="M6.5 20L12 4L17.5 20H6.5ZM8.5 18H15.5L12 8L8.5 18Z" fill="currentColor" />
        <path d="M3 22L9 10L12 16L6 22H3Z" fill="currentColor" />
        <path d="M15 22L12 16L15 10L21 22H15Z" fill="currentColor" />
    </svg>
);

const OpenAILogo = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C10.34 2 9 3.34 9 5C9 5.34 9.05 5.67 9.14 5.98C7.89 6.43 7 7.63 7 9C7 9.34 7.05 9.67 7.14 9.98C5.89 10.43 5 11.63 5 13C5 14.66 6.34 16 8 16H16C17.66 16 19 14.66 19 13C19 11.63 18.11 10.43 16.86 9.98C16.95 9.67 17 9.34 17 9C17 7.63 16.11 6.43 14.86 5.98C14.95 5.67 15 5.34 15 5C15 3.34 13.66 2 12 2Z" fill="currentColor" />
    </svg>
);

const WebRTCLogo = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <circle cx="6" cy="12" r="2" fill="currentColor" />
        <circle cx="18" cy="12" r="2" fill="currentColor" />
        <path d="M8 12H16M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
);

const PlaywrightLogo = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="7" height="7" rx="1" fill="currentColor" />
        <rect x="13" y="4" width="7" height="7" rx="1" fill="currentColor" />
        <rect x="4" y="13" width="7" height="7" rx="1" fill="currentColor" />
        <rect x="13" y="13" width="7" height="7" rx="1" fill="currentColor" />
    </svg>
);

const integrations = [
    { name: "Salesforce", status: "Connected", Logo: SalesforceLogo },
    { name: "HubSpot", status: "Synced", Logo: HubSpotLogo },
    { name: "SOC2", status: "Type II", Logo: SOC2Logo },
    { name: "GDPR", status: "Compliant", Logo: GDPRLogo },
    { name: "Azure", status: "Powered", Logo: AzureLogo },
    { name: "OpenAI", status: "GPT-4o", Logo: OpenAILogo },
    { name: "WebRTC", status: "Enabled", Logo: WebRTCLogo },
    { name: "Playwright", status: "Integrated", Logo: PlaywrightLogo },
];

export default function SocialProof() {
    return (
        <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="py-12 sm:py-16 border-t border-white/5 overflow-hidden"
        >
            <div className="mb-6 sm:mb-8 text-center px-4">
                <p className="metadata-text">Trusted infrastructure</p>
            </div>

            {/* Infinite Scrolling Marquee */}
            <div className="relative">
                <motion.div
                    className="flex gap-3 sm:gap-4"
                    animate={{
                        x: [0, -1400],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {[...integrations, ...integrations, ...integrations].map((item, index) => {
                        const { Logo } = item;
                        return (
                            <div
                                key={index}
                                className="flex-shrink-0 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm opacity-40 hover:opacity-100 transition-all duration-300 cursor-default"
                            >
                                <div className="flex items-center gap-2">
                                    <Logo />
                                    <span className="text-[10px] sm:text-xs font-mono text-zinc-300 whitespace-nowrap">
                                        {item.name}: {item.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </motion.section>
    );
}
