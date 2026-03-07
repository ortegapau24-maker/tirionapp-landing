'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const getCategories = (t: (key: string) => string) => [
    {
        title: t('workflowLibrary.sales.title'),
        image: "/images/tirionapp/retro/2_resultado.webp",
        description: t('workflowLibrary.sales.description'),
    },
    {
        title: t('workflowLibrary.operations.title'),
        image: "/images/tirionapp/retro/3_resultado.webp",
        description: t('workflowLibrary.operations.description'),
    },
    {
        title: t('workflowLibrary.communication.title'),
        image: "/images/tirionapp/retro/4_resultado.webp",
        description: t('workflowLibrary.communication.description'),
    },
    {
        title: t('workflowLibrary.reputation.title'),
        image: "/images/tirionapp/retro/13_resultado.webp",
        description: t('workflowLibrary.reputation.description'),
    },
];

// Each card occupies a "segment" of the overall scroll progress
function useCardTransforms(scrollYProgress: MotionValue<number>, index: number, total: number) {
    const segmentSize = 1 / total;
    const start = index * segmentSize;
    // Stretch out the entrance, hold, and exit to make animations much slower over the scroll
    const mid = start + segmentSize * 0.45; // Slower entrance
    const hold = start + segmentSize * 0.75; // Slower exit
    const end = start + segmentSize;
    const isEven = index % 2 === 0;

    // Approach: scale up from small, come from behind
    const scale = useTransform(
        scrollYProgress,
        [start, mid, hold, end],
        [0.3, 1, 1, 1.5]
    );

    const z = useTransform(
        scrollYProgress,
        [start, mid, hold, end],
        [-500, 0, 0, 300]
    );

    const opacity = useTransform(
        scrollYProgress,
        [start, start + segmentSize * 0.15, mid, hold, end - segmentSize * 0.1, end],
        [0, 1, 1, 1, 1, 0]
    );

    // Image zooms from center
    const imageScale = useTransform(
        scrollYProgress,
        [start, mid, hold, end],
        [0.6, 1, 1, 1.2]
    );

    // Text fades in with upward slide
    const textY = useTransform(
        scrollYProgress,
        [start, mid],
        [50, 0]
    );

    const textOpacity = useTransform(
        scrollYProgress,
        [start, start + segmentSize * 0.3],
        [0, 1]
    );

    // Exit divergence: image always goes left, text always goes right (always split apart)
    const imageExitX = useTransform(
        scrollYProgress,
        [hold, end],
        [0, -250]
    );

    const textExitX = useTransform(
        scrollYProgress,
        [hold, end],
        [0, 250]
    );

    return { scale, z, opacity, imageScale, textY, textOpacity, imageExitX, textExitX };
}

function WorkflowCard({
    cat,
    index,
    scrollYProgress,
    total,
}: {
    cat: { title: string; image: string; description: string };
    index: number;
    scrollYProgress: MotionValue<number>;
    total: number;
}) {
    const { scale, z, opacity, imageScale, textY, textOpacity, imageExitX, textExitX } =
        useCardTransforms(scrollYProgress, index, total);

    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{
                scale,
                translateZ: z,
                opacity,
            }}
        >
            <div className="w-full max-w-[1100px] mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                {/* Image */}
                <motion.div
                    className="w-full md:w-[45%] shrink-0"
                    style={{
                        scale: imageScale,
                        x: imageExitX,
                    }}
                >
                    <div className="aspect-square max-w-[400px] mx-auto rounded-[24px] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={cat.image}
                            alt={cat.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </motion.div>

                {/* Text */}
                <motion.div
                    className="w-full md:w-[55%] flex flex-col justify-center"
                    style={{
                        y: textY,
                        opacity: textOpacity,
                        x: textExitX,
                    }}
                >
                    <div className="text-[#0032A0] font-outfit text-sm tracking-[0.2em] uppercase font-semibold mb-3">
                        0{index + 1}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-outfit font-semibold text-[#050505] mb-6 leading-[1.1]">
                        {cat.title}
                    </h3>
                    <p
                        className="text-gray-400 text-[1.05rem] md:text-[1.125rem] leading-[1.75] font-light [&>strong]:text-[#050505] [&>strong]:font-medium"
                        dangerouslySetInnerHTML={{ __html: cat.description }}
                    />
                </motion.div>
            </div>
        </motion.div>
    );
}

export function WorkflowLibrary() {
    const { t } = useLanguage();
    const categories = getCategories(t);
    const TOTAL = categories.length;

    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const bgY1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
    const bgY2 = useTransform(scrollYProgress, [0, 1], ["10%", "-50%"]);

    if (isMobile) {
        return (
            <section id="library" className="relative w-full bg-white text-agency-text-main py-24 px-4 overflow-hidden">
                {/* Mobile static background (or simple parallax) */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <img src="/images/parallax/19_resultado.webp" className="absolute top-0 left-0 w-full h-[120%] object-cover object-top opacity-80" alt="" />
                    <img src="/images/parallax/20_resultado.webp" className="absolute top-[20%] left-0 w-full h-[120%] object-cover object-top opacity-80" alt="" />
                </div>
                <div className="w-full max-w-[1100px] mx-auto flex flex-col gap-24 relative z-10">
                    {categories.map((cat, index) => (
                        <div key={index} className="flex flex-col gap-8 items-center bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                            {/* Image */}
                            <div className="w-full">
                                <div className="aspect-square max-w-[400px] mx-auto overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={cat.image}
                                        alt={cat.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Text */}
                            <div className="w-full flex flex-col items-center text-center">
                                <div className="text-[#0032A0] font-outfit text-sm tracking-[0.2em] uppercase font-semibold mb-3">
                                    0{index + 1}
                                </div>
                                <h3 className="text-[1.75rem] font-outfit font-semibold text-[#050505] mb-4 leading-[1.2]">
                                    {cat.title}
                                </h3>
                                <p
                                    className="text-gray-500 text-[1rem] leading-[1.6] font-light [&>strong]:text-[#050505] [&>strong]:font-medium"
                                    dangerouslySetInnerHTML={{ __html: cat.description }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section
            id="library"
            ref={containerRef}
            className="relative w-full bg-white text-agency-text-main"
            style={{ height: `${TOTAL * 250}vh` }}
        >
            {/* Sticky viewport — pinned to the screen */}
            <div
                className="sticky top-0 h-screen w-full overflow-hidden"
                style={{ perspective: '1200px' }}
            >
                {/* Parallax Background */}
                <motion.div
                    className="absolute inset-0 w-full h-[150%] pointer-events-none z-0"
                    style={{ y: bgY1 }}
                >
                    <img src="/images/parallax/19_resultado.webp" className="w-full h-full object-cover" alt="" />
                </motion.div>
                <motion.div
                    className="absolute inset-0 w-full h-[150%] pointer-events-none z-0"
                    style={{ y: bgY2 }}
                >
                    <img src="/images/parallax/20_resultado.webp" className="w-full h-full object-cover" alt="" />
                </motion.div>

                {categories.map((cat, index) => (
                    <WorkflowCard
                        key={index}
                        cat={cat}
                        index={index}
                        scrollYProgress={scrollYProgress}
                        total={TOTAL}
                    />
                ))}
            </div>
        </section>
    );
}
