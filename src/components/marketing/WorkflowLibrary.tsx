'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

const categories = [
    {
        title: "Sales & Payments",
        image: "/images/tirionapp/retro/2_resultado.webp",
        description: (
            <>
                Every interaction is a chance to close — and get paid. TirionApp handles <strong>lead qualification</strong> the moment a prospect reaches out, sends personalized <strong>follow-up sequences</strong> that feel human, and manages <strong>contracts</strong> from draft to signature. Once the deal closes, <strong>automated billing</strong> triggers instantly, professional <strong>invoices</strong> go out after every job, and intelligent <strong>recovery</strong> workflows recapture revenue you would have otherwise lost.
            </>
        ),
    },
    {
        title: "Operations",
        image: "/images/tirionapp/retro/3_resultado.webp",
        description: (
            <>
                The invisible backbone of your business, running on autopilot. Your <strong>meetings</strong> schedule themselves around everyone&apos;s availability, <strong>reports</strong> compile overnight and land in your inbox by morning, <strong>support tickets</strong> are triaged and resolved before they pile up, and new client <strong>onboarding</strong> flows happen without a single manual step.
            </>
        ),
    },
    {
        title: "Communication & Content",
        image: "/images/tirionapp/retro/4_resultado.webp",
        description: (
            <>
                Be everywhere your customers are, without being tied to a screen. <strong>AI phone calls</strong> answer and qualify leads 24/7, <strong>WhatsApp</strong> converts inquiries into bookings, <strong>emails</strong> nurture relationships at scale, and <strong>web chat</strong> captures visitors instantly. Meanwhile, your best moments become <strong>social media</strong> posts that feel authentic, long-form content gets <strong>repurposed</strong> into shorts and stories, and a smart <strong>scheduling</strong> engine posts when your audience is most active.
            </>
        ),
    },
    {
        title: "Reputation & Retention",
        image: "/images/tirionapp/retro/13_resultado.webp",
        description: (
            <>
                Your online presence, protected and growing on its own. Satisfied clients receive gentle nudges to leave <strong>reviews</strong> right after service, every review gets a thoughtful <strong>response</strong>, and continuous <strong>monitoring</strong> alerts you when your brand is mentioned. Predictive models flag <strong>churn risk</strong> before a customer thinks about leaving, personalized <strong>referral</strong> programs turn happy clients into your best salespeople, and <strong>loyalty</strong> rewards make staying with you the obvious choice.
            </>
        ),
    },
];

const TOTAL = categories.length;

// Each card occupies a "segment" of the overall scroll progress
function useCardTransforms(scrollYProgress: MotionValue<number>, index: number) {
    const segmentSize = 1 / TOTAL;
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
}: {
    cat: typeof categories[0];
    index: number;
    scrollYProgress: MotionValue<number>;
}) {
    const { scale, z, opacity, imageScale, textY, textOpacity, imageExitX, textExitX } =
        useCardTransforms(scrollYProgress, index);

    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center"
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
                    <p className="text-gray-400 text-[1.05rem] md:text-[1.125rem] leading-[1.75] font-light [&>strong]:text-[#050505] [&>strong]:font-medium">
                        {cat.description}
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
}

export function WorkflowLibrary() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

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
                {categories.map((cat, index) => (
                    <WorkflowCard
                        key={index}
                        cat={cat}
                        index={index}
                        scrollYProgress={scrollYProgress}
                    />
                ))}
            </div>
        </section>
    );
}
