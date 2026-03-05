"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import SplitText from '@/components/ui/SplitText';

const steps = [
    {
        num: "01",
        title: "Audit The Revenue Leaks",
        desc: "Every missed call is revenue handed to your competition. We connect to your existing tools and calculate exactly where you're losing hours and revenue — then deploy a system to recover it instantly.",
        image: "/images/tirionapp/retro/6_resultado.webp",
        bgColor: "#E8DDD3",
        highlights: ["No software to configure", "Works with your existing tools", "See ROI immediately"],

    },
    {
        num: "02",
        title: "Tell Us What You Need",
        desc: "No complicated drag-and-drop builders. Just describe what you need in plain English — our AI interviews you about your business, maps your bottlenecks, and builds the solution automatically.",
        image: "/images/tirionapp/retro/9_resultado.webp",
        bgColor: "#D3DEE8",
        highlights: ["Plain English setup", "AI builds it for you", "Ready in minutes"],

    },
    {
        num: "03",
        title: "We Test Everything First",
        desc: "Before anything goes live, your automations run through sandbox simulations. You review the results, approve with one click, and deploy with confidence — no surprises.",
        image: "/images/tirionapp/retro/8_resultado.webp",
        bgColor: "#D8E8D3",
        highlights: ["Safe sandbox testing", "One-click approval", "Full transparency"],

    },
    {
        num: "04",
        title: "Your Business Runs Itself",
        desc: "Your agents start working 24/7 — answering calls, qualifying leads, booking appointments, and sending you a daily summary. You focus on what matters while TirionApp handles the rest.",
        image: "/images/tirionapp/retro/7_resultado.webp",
        bgColor: "#E3D3E8",
        highlights: ["24/7 autonomous operation", "Daily executive summaries", "Always in control"],

    }
];

interface StepData {
    num: string;
    title: string;
    desc: string;
    image: string;
    bgColor: string;
    highlights: string[];

}

function StepItem({ step, index, setActiveIndex }: { step: StepData; index: number; setActiveIndex: (idx: number) => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { margin: "-50% 0px -50% 0px" });

    useEffect(() => {
        if (isInView) {
            setActiveIndex(index);
        }
    }, [isInView, index, setActiveIndex]);

    return (
        <div ref={ref} className="py-[5vh] md:py-[10vh] min-h-[50vh] md:min-h-[60vh] flex flex-col justify-center relative">
            <motion.div
                animate={{ opacity: isInView ? 1 : 0.4, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-[1.8rem] md:text-[2.4rem] font-bold text-black tracking-[0.1em] font-outfit">{step.num}</span>
                    <div className="h-[2px] bg-black w-12 md:w-20 rounded-full" />
                </div>
                <div className="mb-6">
                    <SplitText
                        text={step.title}
                        className="text-[clamp(1.75rem,2.5vw,2.25rem)] font-medium text-agency-text-main leading-[1.1] font-outfit tracking-[-0.02em]"
                        delay={20}
                        duration={0.8}
                        ease="power3.out"
                        splitType="words"
                        from={{ opacity: 0, y: 30 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.1}
                        rootMargin="-100px"
                        textAlign="left"
                        tag="h3"
                    />
                </div>
                <div className="mb-8 max-w-[95%]">
                    <SplitText
                        text={step.desc}
                        className="text-[1.15rem] md:text-[1.3rem] text-agency-text-muted leading-[1.7] font-light"
                        delay={8}
                        duration={0.6}
                        ease="power3.out"
                        splitType="words"
                        from={{ opacity: 0, y: 15 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.1}
                        rootMargin="-80px"
                        textAlign="left"
                        tag="p"
                    />
                </div>
                <div className="flex flex-col gap-3">
                    {step.highlights.map((highlight: string, hIdx: number) => (
                        <div key={hIdx} className="flex items-center gap-3 text-agency-text-secondary text-[1.1rem]">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-agency-text-main flex-shrink-0">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <SplitText
                                text={highlight}
                                className="text-agency-text-secondary text-[1.1rem]"
                                delay={15}
                                duration={0.6}
                                ease="power3.out"
                                splitType="chars"
                                from={{ opacity: 0, y: 10 }}
                                to={{ opacity: 1, y: 0 }}
                                threshold={0.1}
                                rootMargin="-60px"
                                textAlign="left"
                                tag="span"
                            />
                        </div>
                    ))}
                </div>

                {/* Mobile Image (hidden on desktop) */}
                <div className="block lg:hidden mt-8 w-full aspect-[3/4] rounded-[32px] shadow-[0_16px_32px_rgba(0,0,0,0.1)] overflow-hidden relative border border-agency-border-light/50" style={{ backgroundColor: step.bgColor }}>
                    <div className="absolute inset-0 w-full h-full rounded-[32px] overflow-hidden">
                        <div className="absolute inset-0 bg-cover bg-center rounded-[32px] z-10" style={{ backgroundImage: `url(${step.image})`, transform: 'scale(1.15)' }} />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
export function HowItWorks() {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Animate border radius based on scroll position - highly rounded in middle, flat at edges
    const borderRadius = useTransform(
        scrollYProgress,
        [0, 0.1, 0.9, 1],
        ["0vw", "6vw", "6vw", "0vw"]
    );

    return (
        <motion.div
            ref={containerRef}
            className="w-full relative bg-agency-bg-surface py-20 md:py-[120px]"
            id="how-it-works"
            style={{ borderRadius }}
        >
            <div className="max-w-[1400px] mx-auto px-4 md:px-12">

                {/* Header Section */}
                <div className="mb-[8vh] border-b border-agency-border-light pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="text-[0.75rem] text-black/60 font-semibold tracking-[0.2em] mb-4 uppercase font-outfit">Implementation</div>
                        <h2 className="text-[clamp(3.5rem,6vw,5.5rem)] font-outfit text-agency-text-main font-medium leading-[1] tracking-[-0.02em] max-w-[800px]">
                            How We Give Your Time Back.
                        </h2>
                    </div>
                    <p className="text-[1.3rem] text-agency-text-muted max-w-[400px] font-light leading-[1.6]">
                        We don't give you software to figure out. We deploy a fully autonomous agency tailored to your business in under 48 hours.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 relative items-start">
                    {/* Left side: Scrollable List */}
                    <div className="pb-[10vh]">
                        {steps.map((step, index) => (
                            <StepItem key={index} step={step} index={index} setActiveIndex={setActiveIndex} />
                        ))}
                    </div>

                    {/* Right side: Sticky Image/Visual */}
                    <div className="hidden lg:block sticky top-[8vh] h-[84vh] w-full mb-[8vh]">
                        <div className="h-full w-full rounded-[48px] shadow-[0_32px_64px_rgba(0,0,0,0.1)] border border-agency-border-light/50 bg-agency-bg-surface relative z-0 overflow-hidden">
                            <div className="absolute inset-0 w-full h-full rounded-[48px] overflow-hidden mask-image-rounded">
                                {/* Solid color backgrounds */}
                                {steps.map((step, index) => (
                                    <div
                                        key={`bg-${index}`}
                                        className="absolute inset-0 rounded-[48px] transition-opacity duration-[1500ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                                        style={{
                                            opacity: activeIndex === index ? 1 : 0,
                                            backgroundColor: step.bgColor,
                                        }}
                                    />
                                ))}
                                {/* Inner images cross-fading */}
                                {steps.map((step, index) => (
                                    <div
                                        key={index}
                                        className="absolute inset-0 bg-cover bg-center transition-all duration-[1500ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] rounded-[48px] z-[5]"
                                        style={{
                                            backgroundImage: `url(${step.image})`,
                                            opacity: activeIndex === index ? 1 : 0,
                                            transform: activeIndex === index ? 'scale(1.15)' : 'scale(1.2)',
                                            filter: activeIndex === index ? 'blur(0px)' : 'blur(10px)',
                                        }}
                                    />
                                ))}
                                {/* Noise overlay on top of images */}
                                <div className="absolute inset-0 rounded-[48px] z-10 pointer-events-none opacity-40 mix-blend-overlay"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                                        backgroundSize: '128px 128px',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
