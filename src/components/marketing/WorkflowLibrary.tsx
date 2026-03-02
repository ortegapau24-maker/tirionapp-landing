'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ParticleSphere } from './ParticleSphere';
import { ParticleCard } from './ParticleCard';
import SplitText from '@/components/ui/SplitText';

const categories = [
    {
        title: "Sales",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
        ),
        items: ["Lead Qualification", "Follow-Up", "Proposals", "Contracts"]
    },
    {
        title: "Operations",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
        ),
        items: ["Meetings", "Reports", "Support", "Onboarding"]
    },
    {
        title: "Communication",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
        ),
        items: ["AI Phone Calls", "WhatsApp", "Emails", "Web Chat"]
    },
    {
        title: "Reputation",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
        ),
        items: ["Reviews", "Responses", "Monitoring"]
    },
    {
        title: "Payments",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
        ),
        items: ["Automated Billing", "Invoicing", "Reminders", "Recovery"]
    },
    {
        title: "Content",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
        ),
        items: ["Social Media", "Repurposing", "Scheduling"]
    },
    {
        title: "Retention",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
        ),
        items: ["Churn Risk", "Referrals", "Loyalty"]
    }
];

export function WorkflowLibrary() {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    // Track scrolling progress in the sticky container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
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

    // Scroll-triggered zoom: scale up when entering, shrink when exiting
    const sectionScale = useTransform(
        borderProgress,
        [0, 0.15, 0.85, 1],
        [0.75, 1, 1, 0.75]
    );

    const sectionOpacity = useTransform(
        borderProgress,
        [0, 0.1, 0.9, 1],
        [0, 1, 1, 0]
    );

    // Sphere construction/deconstruction: builds during early scroll, deconstructs during late scroll
    const sphereConstruction = useTransform(
        scrollYProgress,
        [0, 0.15, 0.85, 1],
        [0, 1, 1, 0]
    );

    // Map the scroll progress from 0% to 100% to a rotation of 0 to -360 degrees
    const rotationY = useTransform(scrollYProgress, [0, 1], ["0deg", "-360deg"]);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const blocks = Array.from(track.children) as HTMLElement[];
        const totalBlocks = blocks.length;
        const radius = window.innerWidth < 640 ? 240 : window.innerWidth < 1024 ? 300 : 450;
        const angleStep = 360 / totalBlocks;

        // Position blocks in 3D circle statically
        blocks.forEach((block, index) => {
            const angle = index * angleStep;
            block.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        });
    }, []);

    return (
        <motion.div ref={containerRef} className="w-full h-[500vh] relative bg-agency-bg-surface" style={{ borderRadius }} id="library">
            <motion.div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden will-change-transform" style={{ scale: sectionScale, opacity: sectionOpacity }}>
                <div className="text-center mb-16 px-4">
                    <h2 className="text-[clamp(3rem,5vw,5rem)] font-outfit font-semibold mb-6 leading-[1.1] text-agency-text-main">
                        The Automation Library.
                    </h2>
                    <div className="max-w-[600px] mx-auto">
                        <SplitText
                            text="Deploy 1-click autonomous agents natively tailored for every department in your business. Scroll to explore."
                            className="text-[1.25rem] text-agency-text-muted"
                            delay={12}
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

                {/* 3D Carousel extracted from original HTML */}
                <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[700px] flex items-center justify-center overflow-hidden" style={{ perspective: '1200px', WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>

                    {/* The 3D Scroll-reactive background sphere */}
                    <ParticleSphere scrollYProgress={scrollYProgress} constructionProgress={sphereConstruction} />

                    <motion.div
                        ref={trackRef}
                        style={{ rotateY: rotationY, transformStyle: 'preserve-3d' }}
                        className="absolute w-0 h-0"
                    >
                        {categories.map((cat, i) => (
                            <div
                                key={i}
                                className="absolute top-1/2 left-1/2 -mt-[140px] -ml-[120px] sm:-mt-[160px] sm:-ml-[140px] lg:-mt-[180px] lg:-ml-[160px] w-[240px] h-[280px] sm:w-[280px] sm:h-[320px] lg:w-[320px] lg:h-[360px] select-none pointer-events-none"
                                style={{ transformStyle: 'preserve-3d', WebkitUserDrag: 'none' } as React.CSSProperties}
                            >
                                {/* Front Face (Content) */}
                                <div className="absolute inset-0 rounded-[32px] sm:rounded-[48px] p-4 sm:p-6 lg:p-8 overflow-hidden bg-transparent"
                                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'translateZ(15px)' }}
                                >
                                    <div className="relative z-10 w-full h-full flex flex-col justify-center">
                                        <div className="text-[1.5rem] sm:text-[2rem] font-bold text-agency-text-main mb-4 sm:mb-8 text-center font-outfit">
                                            {cat.title}
                                        </div>
                                        <div className="flex flex-col gap-2 sm:gap-4">
                                            {cat.items.map((item, j) => (
                                                <span key={j} className="px-3 sm:px-5 py-2 sm:py-4 bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-xl sm:rounded-2xl text-agency-text-main text-[0.9rem] sm:text-[1.1rem] font-medium flex items-center justify-center transition-all duration-300 font-inter hover:bg-white/60 hover:scale-[1.02]">
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Back Face (Empty for pure 3D rotation) */}
                                <div className="absolute inset-0 rounded-[32px] sm:rounded-[48px] overflow-hidden bg-transparent"
                                    style={{
                                        backfaceVisibility: 'hidden',
                                        WebkitBackfaceVisibility: 'hidden',
                                        transform: 'rotateY(180deg) translateZ(15px)'
                                    }}
                                >
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}
