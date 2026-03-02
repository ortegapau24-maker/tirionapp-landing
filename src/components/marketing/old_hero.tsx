'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HeroCube } from './HeroCube';
import SplitText from '@/components/ui/SplitText';

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
    const titleOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const [text, setText] = useState("");

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        // Auto-resize textarea
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    return (
        <div ref={containerRef} className="relative h-screen overflow-hidden flex items-center justify-center px-4 md:px-10">
            {/* Background container */}
            <div className="absolute top-0 left-4 md:left-10 right-4 md:right-10 -bottom-[20%] rounded-[24px] z-[-2]" />
            <div className="absolute top-0 left-4 md:left-10 right-4 md:right-10 -bottom-[20%] rounded-[24px] z-[-1]" />

            {/* 3D Particle Cube */}
            <div className="absolute inset-0 z-0 opacity-60 mix-blend-multiply">
                <HeroCube />
            </div>

            <motion.div style={{ y: contentY }} className="text-center z-10 max-w-[1000px] px-4 md:px-6 flex flex-col items-center gap-6 md:gap-8 mb-20 md:mb-[8vw]">
                <div className="max-w-[600px] mx-auto">
                    <SplitText
                        text="Your 24/7 autonomous agency. We don't sell software, we return your time. Recover lost leads and operate your business while you sleep."
                        className="text-[clamp(1rem,4vw,1.5rem)] md:text-[clamp(1.2rem,2vw,1.5rem)] text-agency-text-muted font-light"
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

                <div className="max-w-[680px] w-full mx-auto bg-white/3 border border-white/10 rounded-[20px] md:rounded-[32px] p-2 pl-4 md:p-3 md:pl-6 flex flex-col gap-2 md:gap-3 backdrop-blur-[20px] shadow-[0_16px_32px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.05)] transition-all duration-300 focus-within:bg-white/5 focus-within:border-white/20 focus-within:shadow-[0_24px_48px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.1),0_0_0_4px_rgba(255,255,255,0.05)] focus-within:-translate-y-0.5">
                    <textarea
                        value={text}
                        onChange={handleInput}
                        placeholder="Describe the automation you want to deploy..."
                        rows={1}
                        className="w-full bg-transparent border-none text-agency-text-main text-[1rem] md:text-[1.1rem] font-inter outline-none resize-none min-h-[28px] max-h-[150px] md:max-h-[200px] overflow-y-hidden leading-[1.5] placeholder:text-agency-text-muted/70"
                    />

                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1 md:gap-2 -ml-1 md:-ml-2">
                            <button
                                className="bg-transparent text-agency-text-muted border-none w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-agency-text-muted/10 hover:text-agency-text-main"
                                title="Voice Input"
                                onClick={() => alert('Feature requires sign-in: Please create an account to use audio inputs.')}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]">
                                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                    <line x1="12" y1="19" x2="12" y2="23"></line>
                                    <line x1="8" y1="23" x2="16" y2="23"></line>
                                </svg>
                            </button>
                            <button
                                className="bg-transparent text-agency-text-muted border-none w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-agency-text-muted/10 hover:text-agency-text-main"
                                title="Attach Files"
                                onClick={() => alert('Feature requires sign-in: Please create an account to upload workflow context.')}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]">
                                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                                </svg>
                            </button>
                            <button
                                className="bg-transparent text-agency-text-muted border-none w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-agency-text-muted/10 hover:text-agency-text-main"
                                title="View Plan"
                                onClick={() => alert('Feature requires sign-in: Please create an account to preview execution paths.')}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] md:w-[18px] md:h-[18px]">
                                    <line x1="8" y1="6" x2="21" y2="6"></line>
                                    <line x1="8" y1="12" x2="21" y2="12"></line>
                                    <line x1="8" y1="18" x2="21" y2="18"></line>
                                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <button className="bg-white text-black border-none w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_12px_rgba(255,255,255,0.2)]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-5 md:h-5">
                                <line x1="12" y1="19" x2="12" y2="5"></line>
                                <polyline points="5 12 12 5 19 12"></polyline>
                            </svg>
                        </button>
                    </div>
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
