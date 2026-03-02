'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const SvgItems = () => (
    <>
        <div className="flex items-center gap-3 text-[1.5rem] font-semibold text-agency-text-main/40 hover:text-agency-text-main transition-opacity duration-300 font-outfit">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 focus:outline-none">
                <path d="M10.006 5.415a4.2 4.2 0 0 1 3.045-1.306c1.56 0 2.954.9 3.69 2.205c.63-.3 1.35-.45 2.1-.45c2.85 0 5.159 2.34 5.159 5.22s-2.31 5.22-5.176 5.22c-.345 0-.69-.044-1.02-.104a3.75 3.75 0 0 1-3.3 1.95c-.6 0-1.155-.15-1.65-.375A4.31 4.31 0 0 1 8.88 20.4a4.3 4.3 0 0 1-4.05-2.82c-.27.062-.54.076-.825.076c-2.204 0-4.005-1.8-4.005-4.05c0-1.5.811-2.805 2.01-3.51c-.255-.57-.39-1.2-.39-1.846c0-2.58 2.1-4.65 4.65-4.65c1.53 0 2.85.705 3.72 1.8" />
            </svg>
            Salesforce
        </div>
        <div className="flex items-center gap-3 text-[1.5rem] font-semibold text-agency-text-main/40 hover:text-agency-text-main transition-opacity duration-300 font-outfit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <circle cx="12" cy="12" r="3"></circle>
                <line x1="12" y1="9" x2="12" y2="4"></line>
                <line x1="12" y1="20" x2="12" y2="15"></line>
                <line x1="9" y1="12" x2="4" y2="12"></line>
                <line x1="20" y1="12" x2="15" y2="12"></line>
                <line x1="10.82" y1="8.82" x2="6.5" y2="4.5"></line>
                <line x1="17.5" y1="19.5" x2="13.18" y2="15.18"></line>
                <line x1="10.82" y1="15.18" x2="6.5" y2="19.5"></line>
                <line x1="17.5" y1="4.5" x2="13.18" y2="8.82"></line>
            </svg>
            HubSpot
        </div>
        <div className="flex items-center gap-3 text-[1.5rem] font-semibold text-agency-text-main/40 hover:text-agency-text-main transition-opacity duration-300 font-outfit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            GoHighLevel
        </div>
        <div className="flex items-center gap-3 text-[1.5rem] font-semibold text-agency-text-main/40 hover:text-agency-text-main transition-opacity duration-300 font-outfit">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 focus:outline-none">
                <path d="M12.001 8c-2.3 0-3.9 1.4-3.9 3.4 0 2.2 2.1 2.8 4 3 1.5.2 2.3.8 2.3 1.6 0 1.1-1.2 1.9-2.8 1.9-1.5 0-2.8-.8-3.3-1.8l-3.3.6C5.9 19.3 8.8 21 11.9 21c3.1 0 5.4-1.6 5.4-4 0-2.5-2.2-3.1-4-3.2-1.4-.2-2.3-.6-2.3-1.5 0-.9 1-1.6 2.3-1.6 1.3 0 2.4.6 2.9 1.4l3.1-.9C18.6 9 15.6 8 12.001 8z" />
            </svg>
            Stripe
        </div>
        <div className="flex items-center gap-3 text-[1.5rem] font-semibold text-agency-text-main/40 hover:text-agency-text-main transition-opacity duration-300 font-outfit">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 focus:outline-none">
                <path d="M12 0C5.381-.008.008 5.352 0 11.971V12c0 6.64 5.359 12 12 12c6.64 0 12-5.36 12-12c0-6.641-5.36-12-12-12m0 20.801c-4.846.015-8.786-3.904-8.801-8.75V12a8.777 8.777 0 0 1 8.75-8.801H12a8.776 8.776 0 0 1 8.801 8.75V12c.015 4.847-3.904 8.786-8.75 8.801zm5.44-11.76a2.49 2.49 0 0 1-2.481 2.479a2.49 2.49 0 0 1-2.479-2.479a2.49 2.49 0 0 1 2.479-2.481a2.493 2.493 0 0 1 2.481 2.481m0 5.919c0 1.36-1.12 2.48-2.481 2.48a2.49 2.49 0 0 1-2.479-2.48a2.49 2.49 0 0 1 2.479-2.479a2.49 2.49 0 0 1 2.481 2.479m-5.919 0c0 1.36-1.12 2.48-2.479 2.48a2.49 2.49 0 0 1-2.481-2.48a2.49 2.49 0 0 1 2.481-2.479a2.49 2.49 0 0 1 2.479 2.479m0-5.919a2.49 2.49 0 0 1-2.479 2.479a2.49 2.49 0 0 1-2.481-2.479A2.493 2.493 0 0 1 9.042 6.56a2.493 2.493 0 0 1 2.479 2.481" />
            </svg>
            Twilio
        </div>
        <div className="flex items-center gap-3 text-[1.5rem] font-semibold text-agency-text-main/40 hover:text-agency-text-main transition-opacity duration-300 font-outfit">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 focus:outline-none">
                <path d="M10.19 13.91l4.4-4.8c-1.42 1.64-5.32 6.13-5.32 6.13l.92.83zm3.74-.75h.01c-.01.01-1.87-2.16-1.87-2.16l2.36-2.58a17.25 17.25 0 00-3.38-2.61L8.53 8.35v1.23l1.83.6c.06.01.12.08.13.14-.14 1.32-.27 2.64-.42 3.96l.89.8z" />
            </svg>
            Zendesk
        </div>
        <div className="flex items-center gap-3 text-[1.5rem] font-semibold text-agency-text-main/40 hover:text-agency-text-main transition-opacity duration-300 font-outfit">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 focus:outline-none">
                <rect x="5.17" y="5.17" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -4.9706 12)" width="13.66" height="13.66" rx="2.5" />
                <rect x="8.59" y="8.59" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -4.9706 12)" width="6.83" height="6.83" rx="1" />
            </svg>
            Intercom
        </div>
    </>
);

export function IntegrationsMarquee() {
    const sectionRef = useRef<HTMLDivElement>(null);

    // Track when the section enters and leaves the viewport
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Zoom in as it enters (0 → 0.3), hold at 1 in the middle, shrink as it exits (0.7 → 1)
    const scale = useTransform(
        scrollYProgress,
        [0, 0.25, 0.75, 1],
        [0.7, 1, 1, 0.7]
    );

    const opacity = useTransform(
        scrollYProgress,
        [0, 0.15, 0.85, 1],
        [0, 1, 1, 0]
    );

    return (
        <motion.div
            ref={sectionRef}
            style={{ scale, opacity }}
            className="py-16 bg-white flex flex-col items-center rounded-[64px] m-4 md:m-10 border border-agency-border-light shadow-[0_16px_48px_rgba(0,0,0,0.04)] relative z-10 will-change-transform"
        >
            <div className="text-[0.9rem] uppercase tracking-[0.15em] text-agency-text-muted mb-10 font-semibold text-center font-inter">
                Native Integrations
            </div>
            <div className="w-full overflow-hidden whitespace-nowrap relative" style={{ WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
                <div className="inline-flex gap-20 pl-20 items-center animate-[scrollMarquee_40s_linear_infinite] hover:[animation-play-state:paused]">
                    <SvgItems />
                    <SvgItems />
                </div>
            </div>
        </motion.div>
    );
}
