"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const Grainient = dynamic(() => import('@/components/ui/Grainient'), { ssr: false });

const agents = [
    {
        title: "SDR Agent",
        subtitle: "Autonomously prospects, qualifies, and books meetings 24/7. Mines intent signals across LinkedIn, email, and CRM data with built-in GDPR/CCPA geographic shielding and strict negative-intent filtering protocols. Converts at 3× the industry average.",
        image: "/images/tirionapp/v2/3_resultado.webp",
        isComingSoon: true,
    },
    {
        title: "Marketing Agent",
        subtitle: "Orchestrates multi-channel content distribution with AEO-optimized copy. Protected by economic triage logic and strict anti-hallucination guardrails, requiring 1-click approval before major campaign spend. Scales pipeline growth without human bottlenecks.",
        image: "/images/tirionapp/v2/4_resultado.webp",
        isComingSoon: true,
    },
    {
        title: "CFO Agent",
        subtitle: "Delivers real-time financial intelligence across invoicing, cash flow forecasting, and burn-rate analysis. Actively monitors cash runway and triggers asynchronous SMS alerts for capital leaks, protected by strict cooldown policies. Auto-generates board-ready reports.",
        image: "/images/tirionapp/v2/5_resultado.webp",
        isComingSoon: true,
    },
    {
        title: "Call Center Agent",
        subtitle: "Deploys human-like Voice AI to handle thousands of inbound/outbound calls simultaneously with <500ms latency. Integrates directly with n8n to check inventory, book appointments in your calendar, and update CRM records in real-time during the conversation.",
        image: "/images/tirionapp/v2/2_resultado.webp",
        isComingSoon: true,
    },
];

function AgentImage({ agent, index, progress, exitProgress, isLast, isFirst, borderProgress, isMobile }: { agent: any; index: number; progress: MotionValue<number>; exitProgress: MotionValue<number>; isLast: boolean; isFirst: boolean; borderProgress: MotionValue<number>; isMobile: boolean }) {
    // strict staggered timeline based on progress distances:
    // index - 0.6 to index - 0.2 -> Enters and reaches center
    // index - 0.2 to index + 0.2 -> Dwells entirely still in center
    // index + 0.2 to index + 0.6 -> Exits center
    // This creates a gap! Card `i` exits [0.2, 0.6], while Card `i+1` enters [0.4, 0.8].
    // So Card `i` moves away BEFORE Card `i+1` touches it!
    const inputRanges = [index - 0.6, index - 0.2, index + 0.2, index + 0.6];

    const width = useTransform(
        progress,
        inputRanges,
        isFirst
            ? ["100vw", isMobile ? "90vw" : "32vw", isMobile ? "90vw" : "32vw", isMobile ? "90vw" : "32vw"]
            : ["90vw", isMobile ? "90vw" : "32vw", isMobile ? "90vw" : "32vw", isMobile ? "90vw" : "32vw"]
    );

    const height = useTransform(
        progress,
        inputRanges,
        isFirst
            ? ["100vh", isMobile ? "45vh" : "60vh", isMobile ? "45vh" : "60vh", isMobile ? "45vh" : "60vh"]
            : ["45vh", isMobile ? "45vh" : "60vh", isMobile ? "45vh" : "60vh", isMobile ? "45vh" : "60vh"]
    );

    const imageScale = useTransform(
        progress,
        inputRanges,
        isFirst
            ? [1, 1.5, 1.5, 0.4]
            : isLast
                ? [0.4, 1.5, 1.5, 1.5]
                : [0.4, 1.5, 1.5, 0.4]
    );

    // X axis: Entering from RIGHT (60vw), dwelling at CENTER (-5vw), exiting to LEFT (-60vw)
    // The exact symmetry of `[index, index+1]` means when card `i+1` travels from `60vw` to `-5vw`, 
    // card `i` is traveling from `-5vw` to `-60vw` precisely simultaneously.
    const x = useTransform(
        progress,
        inputRanges,
        isFirst
            ? ["0vw", isMobile ? "0vw" : "-5vw", isMobile ? "0vw" : "-5vw", isMobile ? "-100vw" : "-60vw"]
            : isLast
                ? [isMobile ? "100vw" : "60vw", isMobile ? "0vw" : "-5vw", isMobile ? "0vw" : "-5vw", isMobile ? "0vw" : "-5vw"]
                : [isMobile ? "100vw" : "60vw", isMobile ? "0vw" : "-5vw", isMobile ? "0vw" : "-5vw", isMobile ? "-100vw" : "-60vw"]
    );

    const y = useTransform(
        progress,
        inputRanges,
        isFirst
            ? ["0vh", isMobile ? "-20vh" : "3vh", isMobile ? "-20vh" : "3vh", "0vh"]
            : isLast
                ? ["0vh", isMobile ? "-20vh" : "3vh", isMobile ? "-20vh" : "3vh", isMobile ? "-20vh" : "3vh"]
                : ["0vh", isMobile ? "-20vh" : "3vh", isMobile ? "-20vh" : "3vh", "0vh"]
    );

    const opacity = useTransform(
        progress,
        [index - 0.8, index - 0.6, index + 0.6, index + 0.8],
        isFirst
            ? [1, 1, 1, 0]
            : isLast
                ? [0, 1, 1, 1]
                : [0, 1, 1, 0]
    );

    const imageBorderRadius = useTransform(
        [borderProgress, progress],
        ([bp, p]: number[]) => {
            if (!isFirst) return "2rem";

            // Shrinking phase: progress goes from -0.6 to -0.2
            if (p > -0.6) {
                const t = Math.min(Math.max((p - -0.6) / (-0.2 - -0.6), 0), 1);
                // Use CSS calc to seamlessly blend 6vw to 2rem
                return `calc(6vw * ${1 - t} + 2rem * ${t})`;
            }

            // Entering screen phase: borderProgress goes from 0 to 0.05
            const t = Math.min(Math.max(bp / 0.05, 0), 1);
            return `${6 * t}vw`;
        }
    );

    // Parallax effect specifically for the last card when the WHOLE section scrolls OUT of view
    const innerY = useTransform(
        exitProgress,
        [0, 1],
        ["0%", isLast ? "15%" : "0%"]
    );

    // Dynamic z-index
    const zIndex = useTransform(progress, (p) => {
        if (p >= index && p <= index + 1) return 30; // Active is highest
        if (p < index) return 20; // Incoming is middle
        return 10; // Outgoing is lowest
    });

    return (
        <motion.div
            style={{ x, y, width, height, zIndex, opacity, borderRadius: imageBorderRadius }}
            className="absolute overflow-hidden flex items-center justify-center bg-transparent pointer-events-auto"
        >
            <motion.div
                className="w-full h-full bg-contain bg-center bg-no-repeat shrink-0 origin-center relative z-10"
                style={{
                    backgroundImage: `url('${agent.image}')`,
                    scale: imageScale,
                    y: innerY
                }}
            />
        </motion.div>
    );
}

function AgentText({ agent, index, progress, isLast, isFirst, isMobile }: { agent: any; index: number; progress: MotionValue<number>; isLast: boolean; isFirst: boolean; isMobile: boolean }) {
    // Text opacity bounds purely inside the image dwell phase [index - 0.2, index + 0.2]
    // index - 0.2 -> fades in right when image stops
    // index - 0.1 -> fully visible
    // index + 0.1 -> starts fading out
    // index + 0.2 -> fully hidden, ready for image to slide left
    const opacity = useTransform(
        progress,
        [index - 0.2, index - 0.1, index + 0.1, index + 0.2],
        isLast ? [0, 1, 1, 1] : [0, 1, 1, 0]
    );

    const x = useTransform(
        progress,
        [index - 0.2, index - 0.1, index + 0.1, index + 0.2],
        isLast ? [isMobile ? "0px" : "20px", "0px", "0px", "0px"] : [isMobile ? "0px" : "20px", "0px", "0px", isMobile ? "0px" : "20px"]
    );

    const y = useTransform(
        progress,
        [index - 0.2, index - 0.1, index + 0.1, index + 0.2],
        isLast ? [isMobile ? "20px" : "0px", "0px", "0px", "0px"] : [isMobile ? "20px" : "0px", "0px", "0px", isMobile ? "-20px" : "0px"]
    );

    const pointerEvents = useTransform(
        progress,
        (p) => (p > index - 0.1 && (isLast || p < index + 0.1)) ? "auto" : "none"
    );

    return (
        <motion.div
            style={{ opacity, x, y, pointerEvents }}
            className="absolute inset-x-0 inset-y-0 flex flex-col justify-center select-none w-full"
        >
            <div className="relative">
                {agent.isComingSoon && (
                    <div className="absolute top-[-36px] left-0">
                        <span className="relative overflow-hidden flex items-center justify-center text-[0.75rem] font-bold px-4 py-1 rounded-full text-agency-text-main/80 uppercase tracking-widest whitespace-nowrap border border-black/10 shadow-[0_4px_24px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)] bg-white/40 backdrop-blur-lg">
                            <span className="relative z-10">Coming Soon</span>
                            {/* Glass static highlight (top rim) */}
                            <div className="absolute top-0 left-0 w-full h-[50%] bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
                            {/* Animated shimmering light sweep */}
                            <motion.div
                                className="absolute top-0 bottom-0 z-0 w-[40px] bg-gradient-to-r from-transparent via-white/90 to-transparent skew-x-[-30deg] pointer-events-none"
                                animate={{ left: ["-100%", "200%"] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", repeatDelay: 1.5 }}
                            />
                        </span>
                    </div>
                )}
                <h3 className="text-[clamp(1.75rem,2.5vw,2.25rem)] font-outfit font-medium leading-[1.1] mb-2 md:mb-4 text-agency-text-main">
                    {agent.title}
                </h3>
            </div>
            <p className="text-[1.125rem] text-agency-text-secondary font-light max-w-full md:max-w-[90%] leading-[1.65]">
                {agent.subtitle}
            </p>
        </motion.div>
    );
}

export function ExecutiveTeam() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Internal scrollytelling progress
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Exit progress (triggered when the section hits the bottom of its sticky track and scrolls up)
    const { scrollYProgress: exitProgress } = useScroll({
        target: containerRef,
        offset: ["end end", "end start"],
    });

    // Border radius progress (tracks when section enters/leaves the viewport)
    const { scrollYProgress: borderProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const borderRadius = useTransform(
        borderProgress,
        [0, 0.05, 0.95, 1],
        ["0vw", "6vw", "6vw", "0vw"]
    );

    // Pacing logic:
    // Start at -0.6 (perfectly aligned with the start of the first image shrinking)
    // End at agents.length - 1 (perfectly locked on the final image dwelling)
    const continuousIndex = useTransform(scrollYProgress, [0, 1], [-0.6, agents.length - 1]);

    // Title fades in precisely as the first image finishes shrinking
    // Title starts behind image (visible but covered), slides up as image shrinks
    const sectionTitleY = useTransform(scrollYProgress, [0, 0.12], ["40vh", "0vh"]);

    // Grainient background: scale shrinks to center, opacity fades out
    const grainientScale = useTransform(scrollYProgress, [0, 0.06, 0.12], [1, 0.5, 0]);
    const grainientOpacity = useTransform(scrollYProgress, [0, 0.06, 0.12], [1, 0.6, 0]);

    return (
        // Generous container size ensuring smooth phases 
        <motion.div ref={containerRef} className="relative bg-agency-bg-surface w-full" style={{ height: `${(agents.length * 280)}vh`, borderRadius }} id="agents">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

                {/* Grainient full-screen background - behind everything, shrinks to center */}
                <motion.div
                    className="absolute inset-0 z-10 pointer-events-none origin-center rounded-[6vw] overflow-hidden"
                    style={{
                        scale: grainientScale,
                        opacity: grainientOpacity,
                    }}
                >
                    <Grainient
                        color1="#F8FAFC"
                        color2="#333333"
                        color3="#1a1a1a"
                        timeSpeed={0.5}
                        grainAmount={0.06}
                        grainScale={3.0}
                        grainAnimated={true}
                        warpStrength={1.0}
                        warpFrequency={3.0}
                        warpSpeed={3.5}
                        warpAmplitude={50.0}
                        contrast={1.6}
                        gamma={1.0}
                        saturation={0.75}
                        zoom={0.75}
                    />
                </motion.div>

                {/* Static Section Title - starts behind image, rises up */}
                <motion.div className="absolute top-[8vh] md:top-[4vh] left-0 right-0 flex justify-center z-20 pointer-events-none" style={{ y: sectionTitleY }}>
                    <h2 className="text-[clamp(3.5rem,6vw,5.5rem)] font-outfit font-medium text-agency-text-main tracking-[-0.02em] text-center whitespace-normal md:whitespace-nowrap max-w-[90vw] md:max-w-none leading-[1.1]">
                        The Autonomous Executive Team.
                    </h2>
                </motion.div>

                {/* Animated Images Container */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {agents.map((agent, i) => (
                        <AgentImage key={i} agent={agent} index={i} progress={continuousIndex} exitProgress={exitProgress} isLast={i === agents.length - 1} isFirst={i === 0} borderProgress={borderProgress} isMobile={isMobile} />
                    ))}
                </div>

                {/* Animated Text Block */}
                <div className="absolute inset-x-5 md:right-[5vw] md:left-auto top-[55vh] md:top-0 bottom-0 md:w-[26vw] flex flex-col justify-start md:justify-center pointer-events-none z-40 text-center md:text-left">
                    {agents.map((agent, i) => (
                        <AgentText key={i} agent={agent} index={i} progress={continuousIndex} isLast={i === agents.length - 1} isFirst={i === 0} isMobile={isMobile} />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
