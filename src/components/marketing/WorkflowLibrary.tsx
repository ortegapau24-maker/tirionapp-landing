'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const Grainient = dynamic(() => import('@/components/ui/Grainient'), { ssr: false });

const categories = [
    {
        title: "Sales",
        items: ["Lead Qualification", "Follow-Up", "Proposals", "Contracts"],
        image: "/images/tirionapp/v2/1_resultado.webp",
        color: "from-blue-500/10 to-[#1E40AF]/20"
    },
    {
        title: "Operations",
        items: ["Meetings", "Reports", "Support", "Onboarding"],
        image: "/images/tirionapp/v2/5_resultado.webp",
        color: "from-purple-500/10 to-[#1E40AF]/20"
    },
    {
        title: "Communication",
        items: ["AI Phone Calls", "WhatsApp", "Emails", "Web Chat"],
        image: "/images/tirionapp/v2/2_resultado.webp",
        color: "from-emerald-500/10 to-[#1E40AF]/20"
    },
    {
        title: "Reputation",
        items: ["Reviews", "Responses", "Monitoring"],
        image: "/images/tirionapp/v2/6_resultado.webp",
        color: "from-amber-500/10 to-[#1E40AF]/20"
    },
    {
        title: "Payments",
        items: ["Automated Billing", "Invoicing", "Reminders", "Recovery"],
        image: "/images/tirionapp/v2/3_resultado.webp",
        color: "from-rose-500/10 to-[#1E40AF]/20"
    },
    {
        title: "Content",
        items: ["Social Media", "Repurposing", "Scheduling"],
        image: "/images/tirionapp/v2/8_resultado.webp",
        color: "from-cyan-500/10 to-[#1E40AF]/20"
    },
    {
        title: "Retention",
        items: ["Churn Risk", "Referrals", "Loyalty"],
        image: "/images/tirionapp/v2/4_resultado.webp",
        color: "from-indigo-500/10 to-[#1E40AF]/20"
    }
];

export function WorkflowLibrary() {
    const targetRef = useRef<HTMLDivElement>(null);
    const scrollTrackRef = useRef<HTMLDivElement>(null);
    const [maxTranslate, setMaxTranslate] = useState(0);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"],
    });

    useEffect(() => {
        const updateSize = () => {
            if (scrollTrackRef.current) {
                const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
                setMaxTranslate(scrollTrackRef.current.scrollWidth - viewportWidth);
            }
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    const x = useTransform(scrollYProgress, [0, 1], [0, -maxTranslate]);

    return (
        <section
            id="library"
            ref={targetRef}
            className="relative w-full bg-white text-agency-text-main"
            style={{ height: `${categories.length * 100}vh` }}
        >
            <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">
                {/* Background ambient color */}
                <div className="absolute inset-0 bg-white pointer-events-none z-0" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.03)_0,transparent_70%)] pointer-events-none z-0" />

                {/* Fixed Header */}
                <div className="absolute top-6 sm:top-10 w-full px-4 md:px-10 z-20 pointer-events-none">
                    <h2 className="text-[clamp(2.5rem,4vw,4rem)] font-outfit font-semibold leading-[1.1] text-agency-text-main">
                        The Automation Library.
                    </h2>
                </div>

                {/* Horizontal Scroll Track */}
                <motion.div
                    ref={scrollTrackRef}
                    style={{ x }}
                    className="flex w-max h-full items-center relative z-10 gap-8 sm:gap-16 lg:gap-24 pt-24 pb-12"
                >
                    {/* Start Spacer */}
                    <div className="w-4 md:w-10 shrink-0" />
                    {categories.map((cat, index) => {
                        return (
                            <div
                                key={index}
                                className="w-[85vw] max-w-[1200px] h-full max-h-[600px] sm:max-h-[700px] flex-shrink-0 flex flex-col md:flex-row gap-4 sm:gap-6 rounded-[32px] sm:rounded-[48px]"
                            >
                                {/* Left Text Content */}
                                <div className="relative z-10 w-full md:w-[45%] lg:w-[45%] bg-white rounded-[32px] sm:rounded-[48px] shadow-[0_24px_48px_rgba(0,0,0,0.06)] p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                                    <div className="text-slate-400 font-outfit text-sm sm:text-lg mb-2 sm:mb-4 tracking-widest uppercase font-semibold">
                                        0{index + 1} // System Module
                                    </div>
                                    <h3 className="text-3xl sm:text-5xl lg:text-5xl font-outfit font-bold text-slate-900 mb-8 sm:mb-12">
                                        {cat.title}
                                    </h3>

                                    <div className="flex flex-col gap-3 sm:gap-4">
                                        {cat.items.map((item, j) => (
                                            <div key={j} className="flex items-center gap-4 group">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center transition-colors group-hover:bg-[#2563EB]/10">
                                                    <svg className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <span className="text-slate-600 text-lg sm:text-xl font-medium transition-colors group-hover:text-slate-900">
                                                    {item}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Image Content */}
                                <div className="relative z-0 w-full md:w-[55%] lg:w-[55%] flex-1 min-h-[300px] md:min-h-0 bg-white rounded-[32px] sm:rounded-[48px] shadow-[0_24px_48px_rgba(0,0,0,0.06)] overflow-hidden">
                                    {/* Grainient Background */}
                                    <div className="absolute inset-0 z-0">
                                        <Grainient
                                            key={`grainient-${index}`}
                                            color1="#F8FAFC"
                                            color2="#2563EB"
                                            color3="#1E40AF"
                                        />
                                    </div>

                                    {/* 3D Image Overlay */}
                                    <Image
                                        src={cat.image}
                                        alt={cat.title}
                                        fill
                                        className="object-cover object-center relative z-10 mix-blend-multiply opacity-90"
                                    />
                                    {/* Light gradient overlay to ensure the image blends perfectly if it has white edges */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent pointer-events-none relative z-20" />
                                </div>

                            </div>
                        );
                    })}

                    {/* End Spacer */}
                    <div className="w-[30px] shrink-0" />
                </motion.div>

                {/* Removed Scroll Progress Indicator entirely */}

            </div>
        </section>
    );
}
