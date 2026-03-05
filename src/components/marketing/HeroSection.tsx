'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SplitText from '@/components/ui/SplitText';
import { ArrowUp, Paperclip, Stethoscope, Wrench, Utensils, Home } from 'lucide-react';

const QUICK_PROMPTS = [
    { text: 'Dental', icon: Stethoscope },
    { text: 'Plumbing/HVAC', icon: Wrench },
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
    // Parallax layers — deeper = slower
    const bgLayer15Y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
    const bgLayer16Y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
    // Slide down instead of fade
    const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);

    const [input, setInput] = useState("");

    const handleSend = (text?: string) => {
        const message = text || input.trim();
        if (!message) return;

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.tirionapp.com';
        window.location.href = `${appUrl}?prompt=${encodeURIComponent(message)}`;
    };

    return (
        <div ref={containerRef} className="relative h-screen overflow-hidden flex items-center justify-center px-4 md:px-10">
            {/* Parallax background layer 1 — deepest, slowest (15_resultado) */}
            <motion.div
                style={{ y: bgLayer15Y }}
                className="absolute inset-0 z-[1] pointer-events-none will-change-transform"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/images/hero-bg-15.webp"
                    alt=""
                    className="w-full h-full object-cover select-none"
                />
            </motion.div>

            {/* Parallax background layer 2 — mid depth (16_resultado) */}
            <motion.div
                style={{ y: bgLayer16Y }}
                className="absolute inset-0 z-[2] pointer-events-none will-change-transform"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/images/hero-bg-16.webp"
                    alt=""
                    className="w-full h-full object-cover select-none"
                />
            </motion.div>

            {/* Background image — desktop: centered full height, mobile: bottom 1:1 square */}
            {/* Desktop image */}
            <div className="absolute inset-0 z-[5] hidden md:flex items-center justify-center pointer-events-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/images/hero-bg.webp"
                    alt=""
                    className="w-auto h-[100vh] object-contain select-none"
                />
            </div>
            {/* Mobile image — bottom, square */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[5] md:hidden pointer-events-none w-[90vw] aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/images/hero-bg.webp"
                    alt=""
                    className="w-full h-full object-contain select-none"
                />
            </div>

            {/* Left text — absolutely pinned to left margin */}
            <motion.div
                style={{ y: contentY }}
                className="hidden md:flex absolute left-0 bottom-[calc(50%-120px)] w-[clamp(200px,18vw,280px)] px-6 md:px-10 z-20 pointer-events-none"
            >
                <SplitText
                    text="Your 24/7 autonomous agency. We don't sell software, we return your time."
                    className="text-[1.05rem] text-[#0032A0] font-medium leading-[1.7]"
                    delay={15}
                    duration={0.8}
                    ease="power3.out"
                    splitType="words"
                    from={{ opacity: 0, y: 20 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-50px"
                    textAlign="left"
                    tag="p"
                />
            </motion.div>

            {/* Right text — absolutely pinned to right margin */}
            <motion.div
                style={{ y: contentY }}
                className="hidden md:flex absolute right-0 bottom-[calc(50%-120px)] w-[clamp(200px,18vw,280px)] px-6 md:px-10 z-20 pointer-events-none"
            >
                <SplitText
                    text="Recover lost leads and operate your business while you sleep."
                    className="text-[1.05rem] text-[#0032A0] font-medium leading-[1.7]"
                    delay={15}
                    duration={0.8}
                    ease="power3.out"
                    splitType="words"
                    from={{ opacity: 0, y: 20 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-50px"
                    textAlign="left"
                    tag="p"
                />
            </motion.div>

            {/* Main content: chatbox only */}
            <motion.div style={{ y: contentY }} className="z-10 w-full max-w-[760px] px-4 md:px-0 mb-20 md:mb-[8vw]">
                {/* Mobile text above chatbox */}
                <div className="block md:hidden mb-6 text-center">
                    <SplitText
                        text="Your 24/7 autonomous agency. We don't sell software, we return your time. Recover lost leads and operate your business while you sleep."
                        className="text-[1rem] text-[#0032A0] font-medium leading-[1.65]"
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
                            placeholder="Tell me about your business..."
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
            </motion.div>

            {/* Automate Everything — slides down on scroll, no fade */}
            <motion.div
                style={{ y: titleY }}
                className="absolute bottom-0 md:-bottom-[1vw] left-0 w-full m-0 p-0 text-[18vw] md:text-[9.5vw] font-extrabold leading-none md:leading-[0.85] tracking-[-0.04em] whitespace-normal md:whitespace-nowrap text-center z-10 font-outfit text-[#050505]"
            >
                Automate<br className="block md:hidden" />
                <span className="md:inline hidden"> </span>Everything.
            </motion.div>
        </div>
    );
}
