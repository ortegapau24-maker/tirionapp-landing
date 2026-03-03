'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function Footer() {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["50%", "0%"]);
    const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

    // Animate top border radius from round to flat as it scrolls into full view
    const borderTopRadius = useTransform(scrollYProgress, [0, 1], ["6vw", "0vw"]);

    return (
        <motion.footer
            ref={containerRef}
            className="pt-[80px] pb-0 bg-agency-bg-surface relative transition-all duration-300 ease-out z-10 overflow-hidden"
            style={{
                borderTopLeftRadius: borderTopRadius,
                borderTopRightRadius: borderTopRadius
            }}
        >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-16 max-w-[1200px] mx-auto px-10 mb-20">
                <div className="md:col-span-2">
                    <div className="flex items-center gap-3 font-semibold text-[1.4rem] tracking-tight mb-6">
                        <span className="font-outfit">TirionApp</span>
                    </div>
                    <p className="text-agency-text-muted text-base max-w-sm">
                        AI-native operating system for modern performance agencies.
                    </p>
                </div>

                <div className="flex flex-col">
                    <h4 className="font-outfit font-semibold text-[1.1rem] mb-6 text-agency-text-main">Platform</h4>
                    <ul className="space-y-4">
                        <li><a href="#features" className="text-agency-text-muted hover:text-agency-accent-solid transition-colors">Features</a></li>
                        <li><a href="#agents" className="text-agency-text-muted hover:text-agency-accent-solid transition-colors">Agents</a></li>
                        <li><a href="#library" className="text-agency-text-muted hover:text-agency-accent-solid transition-colors">Workflows</a></li>
                        <li><a href="#pricing" className="text-agency-text-muted hover:text-agency-accent-solid transition-colors">Pricing</a></li>
                    </ul>
                </div>

                <div className="flex flex-col">
                    <h4 className="font-outfit font-semibold text-[1.1rem] mb-6 text-agency-text-main">Company</h4>
                    <ul className="space-y-4">
                        <li><a href="/about" className="text-agency-text-muted hover:text-agency-accent-solid transition-colors">About</a></li>
                        <li><a href="/customers" className="text-agency-text-muted hover:text-agency-accent-solid transition-colors">Customers</a></li>
                        <li><a href="/careers" className="text-agency-text-muted hover:text-agency-accent-solid transition-colors">Careers</a></li>
                        <li><a href="/changelog" className="text-agency-text-muted hover:text-agency-accent-solid transition-colors">Changelog</a></li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-agency-border-light max-w-[1200px] mx-auto px-10 pt-8 pb-10 flex flex-col md:flex-row justify-between text-agency-text-muted text-sm gap-4">
                <div>© 2026 TirionApp. All rights reserved.</div>
                <div className="flex gap-6">
                    <a href="/privacy" className="hover:text-agency-accent-solid transition-colors">Privacy</a>
                    <a href="/terms" className="hover:text-agency-accent-solid transition-colors">Terms</a>
                </div>
            </div>

            <div className="w-full flex justify-center mt-12 relative flex-col items-center pointer-events-none">
                <motion.h1
                    style={{ y, opacity }}
                    className="w-full m-0 p-0 pb-6 md:p-0 text-[18vw] md:text-[10vw] font-extrabold leading-none md:leading-[0.85] tracking-[-0.04em] whitespace-normal md:whitespace-nowrap text-center z-10 font-outfit text-transparent bg-clip-text bg-gradient-to-b from-[#050505] via-[#050505]/90 to-[#050505]/60 mb-0 md:-mb-[1vw]"
                >
                    Automate<br className="block md:hidden" />
                    <span className="md:inline hidden"> </span>Everything.
                </motion.h1>
            </div>
        </motion.footer>
    );
}
