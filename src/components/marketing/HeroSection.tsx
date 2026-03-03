'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';
import SplitText from '@/components/ui/SplitText';
import { ArrowUp, Paperclip, Stethoscope, Wrench, Utensils, Home } from 'lucide-react';

const HeroCube = dynamic(() => import('./HeroCube').then(mod => mod.HeroCube), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-transparent" />
});

const QUICK_PROMPTS = [
    { text: 'Dental', icon: Stethoscope },
    { text: 'Plomería/HVAC', icon: Wrench },
    { text: 'Restaurant', icon: Utensils },
    { text: 'Real Estate', icon: Home },
];

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
    const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const [input, setInput] = useState("");

    const handleSend = (text?: string) => {
        const message = text || input.trim();
        if (!message) return;

        // Save the first prompt so the app subdomain can read it on load.
        // We use localStorage instead of sessionStorage so it persists across domains (if sharing same root) or via URL params.
        // The best way for cross-domain is standard URL parameters, let's append it to the redirect link:
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.tirionapp.com';
        window.location.href = `${appUrl}?prompt=${encodeURIComponent(message)}`;
    };

    return (
        <div ref={containerRef} className="relative h-screen overflow-hidden flex items-center justify-center px-4 md:px-10">
            {/* Background container */}
            <div className="absolute top-0 left-4 md:left-10 right-4 md:right-10 -bottom-[20%] rounded-[24px] z-[-2]" />
            <div className="absolute top-0 left-4 md:left-10 right-4 md:right-10 -bottom-[20%] rounded-[24px] z-[-1]" />

            {/* 3D Particle Cube */}
            <div className="absolute inset-0 z-0 opacity-60 mix-blend-multiply">
                <ErrorBoundary fallback={<div className="w-full h-full bg-transparent" />}>
                    <HeroCube />
                </ErrorBoundary>
            </div>

            <motion.div style={{ y: contentY }} className="text-center z-10 w-full max-w-[1000px] px-4 md:px-6 flex flex-col items-center gap-8 md:gap-10 mb-20 md:mb-[8vw]">
                <div className="max-w-[800px] mx-auto">
                    <SplitText
                        text="Your 24/7 autonomous agency. We don't sell software, we return your time. Recover lost leads and operate your business while you sleep."
                        className="text-[1.125rem] md:text-[1.25rem] text-agency-text-muted font-light leading-[1.65]"
                        delay={15}
                        duration={0.8}
                        ease="power3.out"
                        splitType="words"
                        from={{ opacity: 0, y: 20 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.1}
                        rootMargin="-50px"
                        textAlign="center"
                        tag="p"
                    />
                </div>

                {/* White minimal chatbox */}
                <div className="w-full max-w-[760px] mx-auto relative z-20">
                    <motion.div
                        layoutId="chat-container-wrapper"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <motion.div
                            layoutId="chat-container"
                            className="bg-[#f4f4f4] rounded-[24px] p-3 shadow-sm border border-black/[0.04] transition-all duration-300 focus-within:bg-white focus-within:shadow-[0_4px_30px_rgba(0,0,0,0.08)] flex flex-col min-h-[140px]"
                        >
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Cuéntame sobre tu negocio..."
                                className="flex-1 bg-transparent px-3 py-2 text-[16px] text-[#050505] placeholder:text-black/40 focus:outline-none resize-none"
                            />
                            <div className="flex items-center justify-between mt-auto px-1">
                                <button className="w-9 h-9 flex items-center justify-center text-black/50 hover:text-black transition-colors rounded-full hover:bg-black/5 shrink-0">
                                    <Paperclip className="w-[20px] h-[20px]" />
                                </button>
                                <button
                                    onClick={() => handleSend()}
                                    disabled={!input.trim()}
                                    className="w-9 h-9 rounded-full bg-[#050505] hover:bg-[#222] disabled:bg-[#e4e4e4] disabled:text-[#a3a3a3] text-white flex items-center justify-center transition-all duration-200 shrink-0"
                                >
                                    <ArrowUp className="w-[18px] h-[18px]" strokeWidth={2.5} />
                                </button>
                            </div>
                        </motion.div>

                        {/* Quick prompts */}
                        <div className="flex flex-wrap justify-center gap-3 mt-4">
                            {QUICK_PROMPTS.map((prompt) => {
                                const Icon = prompt.icon;
                                return (
                                    <button
                                        key={prompt.text}
                                        onClick={() => handleSend(prompt.text)}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5F5F5] text-[14px] font-medium text-black/60 hover:text-black hover:bg-[#EAEAEA] transition-all duration-200"
                                    >
                                        <Icon className="w-4 h-4" strokeWidth={1.5} />
                                        {prompt.text}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            <motion.div
                style={{ y: titleY, opacity: titleOpacity }}
                className="absolute bottom-0 md:-bottom-[1vw] left-0 w-full m-0 p-0 text-[18vw] md:text-[9.5vw] font-extrabold leading-none md:leading-[0.85] tracking-[-0.04em] whitespace-normal md:whitespace-nowrap text-center z-10 font-outfit text-[#050505]"
            >
                Automate<br className="block md:hidden" />
                <span className="md:inline hidden"> </span>Everything.
            </motion.div>
        </div>
    );
}
