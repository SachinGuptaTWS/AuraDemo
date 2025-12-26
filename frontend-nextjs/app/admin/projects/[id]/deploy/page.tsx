'use client';

import { useState } from 'react';
import { Copy, Check, Code, Palette } from 'lucide-react';

export default function DeploymentPage() {
    const [copied, setCopied] = useState(false);
    const [buttonColor, setButtonColor] = useState('#3B82F6');
    const [buttonText, setButtonText] = useState('Start Live Demo');

    const scriptTag = `<!-- Slink Widget -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.aurademo.ai/widget.js';
    script.setAttribute('data-project-id', 'proj_12345');
    script.setAttribute('data-button-color', '${buttonColor}');
    script.setAttribute('data-button-text', '${buttonText}');
    document.body.appendChild(script);
  })();
</script>`;

    const handleCopy = () => {
        navigator.clipboard.writeText(scriptTag);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold mb-2">Deployment</h1>
                    <p className="text-zinc-400">Install the AI demo widget on your website</p>
                </div>

                <div className="space-y-8">
                    {/* Button Customization */}
                    <div className="bg-void-800 border border-white/10 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Palette className="w-5 h-5 text-blue-500" />
                            <h2 className="text-xl font-semibold">Button Customization</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Button Text */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Button Text</label>
                                <input
                                    type="text"
                                    value={buttonText}
                                    onChange={(e) => setButtonText(e.target.value)}
                                    className="w-full px-4 py-3 bg-void-900 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50"
                                />
                            </div>

                            {/* Button Color */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Button Color</label>
                                <div className="flex gap-3">
                                    <input
                                        type="color"
                                        value={buttonColor}
                                        onChange={(e) => setButtonColor(e.target.value)}
                                        className="w-16 h-12 bg-void-900 border border-white/10 rounded-lg cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={buttonColor}
                                        onChange={(e) => setButtonColor(e.target.value)}
                                        className="flex-1 px-4 py-3 bg-void-900 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 font-mono text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="mt-6 p-8 bg-void-900 rounded-lg border border-white/10">
                            <p className="text-sm text-zinc-500 mb-4">Preview:</p>
                            <button
                                style={{ backgroundColor: buttonColor }}
                                className="px-6 py-3 text-white rounded-full font-semibold shadow-lg hover:opacity-90 transition-opacity"
                            >
                                {buttonText}
                            </button>
                        </div>
                    </div>

                    {/* Installation Code */}
                    <div className="bg-void-800 border border-white/10 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Code className="w-5 h-5 text-blue-500" />
                            <h2 className="text-xl font-semibold">Installation Code</h2>
                        </div>

                        <p className="text-sm text-zinc-400 mb-4">
                            Copy and paste this code snippet before the closing <code className="px-2 py-1 bg-void-900 rounded text-blue-400">&lt;/body&gt;</code> tag of your website.
                        </p>

                        <div className="relative">
                            <pre className="bg-black p-6 rounded-lg overflow-x-auto text-sm font-mono border border-white/10">
                                <code className="text-green-400">{scriptTag}</code>
                            </pre>

                            <button
                                onClick={handleCopy}
                                className="absolute top-4 right-4 p-2 bg-void-800 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                            >
                                {copied ? (
                                    <Check className="w-5 h-5 text-green-500" />
                                ) : (
                                    <Copy className="w-5 h-5 text-zinc-400" />
                                )}
                            </button>
                        </div>

                        {copied && (
                            <p className="mt-3 text-sm text-green-500 flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                Copied to clipboard!
                            </p>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="bg-void-800 border border-white/10 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Installation Instructions</h2>

                        <ol className="space-y-4 text-sm">
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold">1</span>
                                <div>
                                    <p className="font-medium mb-1">Copy the script tag</p>
                                    <p className="text-zinc-400">Click the copy button above to copy the installation code to your clipboard.</p>
                                </div>
                            </li>

                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold">2</span>
                                <div>
                                    <p className="font-medium mb-1">Paste before &lt;/body&gt;</p>
                                    <p className="text-zinc-400">Open your website's HTML file and paste the code just before the closing <code className="px-1 py-0.5 bg-void-900 rounded text-blue-400">&lt;/body&gt;</code> tag.</p>
                                </div>
                            </li>

                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-semibold">3</span>
                                <div>
                                    <p className="font-medium mb-1">Test the widget</p>
                                    <p className="text-zinc-400">Refresh your website and look for the floating demo button in the bottom-right corner.</p>
                                </div>
                            </li>

                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-semibold">✓</span>
                                <div>
                                    <p className="font-medium mb-1">You're all set!</p>
                                    <p className="text-zinc-400">Your AI demo agent is now live and ready to engage with visitors.</p>
                                </div>
                            </li>
                        </ol>
                    </div>

                    {/* Platform-Specific Guides */}
                    <div className="bg-void-800 border border-white/10 rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Platform-Specific Guides</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['WordPress', 'Shopify', 'Webflow'].map((platform) => (
                                <a
                                    key={platform}
                                    href="#"
                                    className="p-4 bg-void-900 border border-white/10 rounded-lg hover:border-blue-500/50 transition-colors group"
                                >
                                    <p className="font-medium mb-1 group-hover:text-blue-500 transition-colors">{platform}</p>
                                    <p className="text-xs text-zinc-500">Step-by-step guide →</p>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
