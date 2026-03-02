'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SplitText from '@/components/ui/SplitText';

export function BentoGrid() {
    const card1Ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress: scrollYProgress1 } = useScroll({
        target: card1Ref,
        offset: ["start end", "end start"]
    });
    const parallaxY1 = useTransform(scrollYProgress1, [0, 1], [60, -60]);

    const card3Ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: card3Ref,
        offset: ["start end", "end start"]
    });
    const parallaxY = useTransform(scrollYProgress, [0, 1], [60, -60]);

    return (
        <div className="py-20 md:py-[120px] px-4 md:px-10 bg-agency-bg-dark relative" id="features">
            <div className="text-center mb-16 md:mb-20">
                <div className="mb-4 md:mb-6">
                    <SplitText
                        text="We Don't Sell Software. We Return Your Hours."
                        className="text-[clamp(3rem,5vw,5rem)] font-outfit font-semibold leading-[1.1] text-agency-text-main"
                        delay={30}
                        duration={1}
                        ease="power3.out"
                        splitType="words"
                        from={{ opacity: 0, y: 40 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.1}
                        rootMargin="-100px"
                        textAlign="center"
                        tag="h2"
                    />
                </div>
                <div className="max-w-[600px] mx-auto">
                    <SplitText
                        text="Your 24/7 autonomous agency. Stop losing revenue to missed calls and forgotten follow-ups. We operate your business while you focus on growing it."
                        className="text-[1.25rem] text-agency-text-muted"
                        delay={10}
                        duration={0.8}
                        ease="power3.out"
                        splitType="words"
                        from={{ opacity: 0, y: 15 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.1}
                        rootMargin="-80px"
                        textAlign="center"
                        tag="p"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
                {/* Feature 1: Never Lose Another Lead (2/3 width) */}
                <div ref={card1Ref} className="md:col-span-2 bg-agency-bg-surface rounded-[24px] md:rounded-[32px] flex flex-col md:flex-row min-h-[350px] md:min-h-[420px] overflow-hidden md:overflow-visible relative">
                    <div className="flex-1 p-6 md:p-12 flex flex-col justify-center relative z-10 bg-agency-bg-surface md:bg-transparent">
                        <span className="text-[0.8rem] font-semibold tracking-[0.2em] uppercase text-agency-text-muted/60 mb-3 block">Lead Recovery</span>
                        <h3 className="text-[clamp(1.8rem,2.5vw,2.4rem)] font-semibold font-outfit mb-5 text-agency-text-main leading-[1.15]">Never Lose Another Lead</h3>
                        <p className="text-agency-text-muted text-[1.15rem] leading-[1.7]">
                            Every missed call is revenue handed to your competition. TirionApp instantly responds, qualifies, and books appointments while you&apos;re busy with work.
                        </p>
                    </div>
                    <motion.div
                        className="w-full md:w-[45%] h-[250px] md:h-auto shrink-0 relative z-0 overflow-visible"
                        style={{ y: parallaxY1 }}
                    >
                        <div className="w-[110%] h-[120%] -mt-[10%] rounded-[24px] bg-[url('/images/tirionapp/v2/1_resultado.webp')] bg-contain bg-no-repeat bg-center min-h-[250px] md:min-h-[420px]" />
                    </motion.div>
                </div>

                {/* Feature 2: Zero Configuration (1/3 width) */}
                <div className="bg-agency-bg-surface rounded-[24px] md:rounded-[32px] p-6 md:p-12 flex flex-col justify-between min-h-[350px] md:min-h-[420px] overflow-hidden">
                    <div>
                        <span className="text-[0.8rem] font-semibold tracking-[0.2em] uppercase text-agency-text-muted/60 mb-3 block">Setup</span>
                        <h3 className="text-[clamp(1.8rem,2.5vw,2.4rem)] font-semibold font-outfit mb-5 text-agency-text-main leading-[1.15]">Zero Configuration</h3>
                        <p className="text-agency-text-muted text-[1.15rem] leading-[1.7]">
                            Don&apos;t spend 40 hours building workflows. Tell the AI your problem in plain English, and it deploys the solution automatically.
                        </p>
                    </div>
                    <div className="mt-auto pt-10 flex items-center justify-center">
                        <div className="text-[3.5rem] font-outfit font-bold text-center leading-none text-agency-text-main">
                            30<span className="text-[1.5rem]">s</span> <span className="block text-[0.95rem] font-medium font-inter text-agency-text-muted mt-3">Average Response Time</span>
                        </div>
                    </div>
                </div>

                {/* Feature 3: Done-For-You Execution (full width) — parallax image */}
                <div ref={card3Ref} className="md:col-span-3 bg-agency-bg-surface rounded-[24px] md:rounded-[32px] flex flex-col md:flex-row min-h-[350px] md:min-h-[380px] overflow-hidden md:overflow-visible relative">
                    <div className="flex-1 p-6 md:p-12 flex flex-col justify-center max-w-full md:max-w-[50%] relative z-10 bg-agency-bg-surface md:bg-transparent">
                        <span className="text-[0.8rem] font-semibold tracking-[0.2em] uppercase text-agency-text-muted/60 mb-3 block">Results</span>
                        <h3 className="text-[clamp(1.8rem,2.5vw,2.4rem)] font-semibold font-outfit mb-5 text-agency-text-main leading-[1.15]">Done-For-You Execution</h3>
                        <p className="text-agency-text-muted text-[1.15rem] leading-[1.7]">
                            We don&apos;t give you another complex tool to learn. We give you results. Monitor daily appointments booked, messages sent, and leads captured in real-time.
                        </p>
                    </div>
                    <motion.div
                        className="flex-1 w-full h-[250px] md:h-auto relative z-0 overflow-visible"
                        style={{ y: parallaxY }}
                    >
                        <div className="w-[110%] h-[120%] -mt-[10%] md:-mt-[10%] rounded-[24px] bg-[url('/images/tirionapp/v2/2_resultado.webp')] bg-cover bg-center min-h-[250px] md:min-h-[420px]" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
