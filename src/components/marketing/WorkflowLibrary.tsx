'use client';

import { motion } from 'framer-motion';

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

const rowVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
};

export function WorkflowLibrary() {
    return (
        <section
            id="library"
            className="relative w-full bg-white text-agency-text-main py-16 md:py-24"
        >
            <div className="max-w-[1100px] mx-auto px-4 md:px-10 flex flex-col gap-24 md:gap-32">
                {categories.map((cat, index) => {
                    const isEven = index % 2 === 0;

                    return (
                        <motion.div
                            key={index}
                            variants={rowVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            className={`flex flex-col gap-8 md:gap-16 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                                } items-center`}
                        >
                            {/* Image Card */}
                            <div className="w-full md:w-[45%] shrink-0">
                                <div className="aspect-square max-w-[400px] mx-auto rounded-[24px] overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={cat.image}
                                        alt={cat.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Text Card — no borders, no shadows */}
                            <div className="w-full md:w-[55%] flex flex-col justify-center">
                                <div className="text-[#0032A0] font-outfit text-sm tracking-[0.2em] uppercase font-semibold mb-3">
                                    0{index + 1}
                                </div>
                                <h3 className="text-3xl md:text-4xl font-outfit font-semibold text-[#050505] mb-6 leading-[1.1]">
                                    {cat.title}
                                </h3>
                                <p className="text-gray-400 text-[1.05rem] md:text-[1.125rem] leading-[1.75] font-light [&>strong]:text-[#050505] [&>strong]:font-medium">
                                    {cat.description}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
