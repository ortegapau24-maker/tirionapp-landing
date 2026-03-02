'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const navLinks = [
    { href: '/#features', label: 'Features' },
    { href: '/#library', label: 'Library' },
    { href: '/#agents', label: 'Agents' },
    { href: '/#pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
];

export function Navbar() {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 150 && !menuOpen) setHidden(true);
        else if (latest < previous) setHidden(false);
    });

    const pill = "pointer-events-auto rounded-full border border-black/5 bg-white/70 backdrop-blur-[24px] saturate-[150%] shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex items-center";

    return (
        <>
            <div className="fixed top-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-auto max-w-[1200px] z-[1000] flex justify-between md:justify-center items-center gap-3 pointer-events-none">
                {/* Mobile Brand (Left) */}
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className={`${pill} h-[56px] px-6 md:hidden`}
                >
                    <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="font-outfit font-semibold text-[1.4rem] tracking-tight text-[#050505] no-underline whitespace-nowrap cursor-pointer">
                        TirionApp
                    </a>
                </motion.div>

                {/* Desktop Brand + CTA */}
                <motion.nav
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className={`${pill} h-[56px] px-4 pl-6 gap-4 hidden md:flex`}
                >
                    <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="font-outfit font-semibold text-[1.4rem] tracking-tight text-[#050505] no-underline whitespace-nowrap cursor-pointer">TirionApp</a>
                    <Link href="/sign-up" className="bg-[#050505] text-white rounded-full font-medium text-sm px-6 py-2.5 transition-all duration-300 hover:bg-[#222] hover:scale-105 whitespace-nowrap text-center no-underline">
                        Start Building
                    </Link>
                </motion.nav>

                {/* Desktop Menu pill (hidden on mobile) */}
                <motion.nav
                    initial={{ y: -100, opacity: 0 }}
                    animate={{
                        y: hidden ? -100 : 0,
                        opacity: hidden ? 0 : 1,
                        width: menuOpen ? 400 : 56,
                    }}
                    transition={{
                        y: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                        width: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
                    }}
                    className={`${pill} h-[56px] overflow-hidden cursor-pointer relative hidden md:flex`}
                    onMouseEnter={() => setMenuOpen(true)}
                    onMouseLeave={() => setMenuOpen(false)}
                >
                    {/* Desktop Hamburger icon */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ opacity: menuOpen ? 0 : 1, scale: menuOpen ? 0.6 : 1 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        style={{ pointerEvents: menuOpen ? 'none' : 'auto' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#050505" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="7" x2="20" y2="7" />
                            <line x1="4" y1="12" x2="20" y2="12" />
                            <line x1="4" y1="17" x2="20" y2="17" />
                        </svg>
                    </motion.div>

                    {/* Nav links — fade in when expanded */}
                    <motion.div
                        className="flex items-center gap-0.5 px-3 w-full justify-center relative z-10"
                        animate={{ opacity: menuOpen ? 1 : 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut', delay: menuOpen ? 0.15 : 0 }}
                        style={{ pointerEvents: menuOpen ? 'auto' : 'none' }}
                    >
                        {navLinks.map((item, i) => (
                            <motion.a
                                key={item.label}
                                href={item.href}
                                animate={{
                                    opacity: menuOpen ? 1 : 0,
                                    y: menuOpen ? 0 : 6,
                                }}
                                transition={{
                                    duration: 0.35,
                                    ease: [0.16, 1, 0.3, 1],
                                    delay: menuOpen ? 0.12 + i * 0.04 : 0,
                                }}
                                className="px-3.5 py-2 text-[0.85rem] font-medium text-[#050505]/65 hover:text-[#050505] rounded-full hover:bg-black/[0.04] transition-colors duration-200 whitespace-nowrap font-inter no-underline relative z-10"
                                onClick={(e) => {
                                    if (item.href.startsWith('/#')) {
                                        e.preventDefault();
                                        const id = item.href.replace('/#', '');
                                        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                            >
                                {item.label}
                            </motion.a>
                        ))}
                    </motion.div>
                </motion.nav>

                {/* Mobile Menu Toggle Button (Right) */}
                <motion.button
                    layoutId="mobileMenuBackground"
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: hidden && !menuOpen ? -100 : 0, opacity: hidden && !menuOpen ? 0 : (menuOpen ? 0 : 1) }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => setMenuOpen(true)}
                    whileTap={{ scale: 0.9 }}
                    className={`${pill} h-[56px] w-[56px] justify-center md:hidden cursor-pointer relative z-[1001]`}
                    style={{ borderRadius: 28 }}
                >
                    <div className="flex items-center justify-center w-full h-full">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#050505" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="4" y1="7" x2="20" y2="7" />
                            <line x1="4" y1="12" x2="20" y2="12" />
                            <line x1="4" y1="17" x2="20" y2="17" />
                        </svg>
                    </div>
                </motion.button>
            </div>

            {/* Mobile Menu Fullscreen Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="fixed inset-0 z-[1050] md:hidden pointer-events-auto flex flex-col items-center justify-center pb-20"
                    >
                        {/* The morphing background that clips children */}
                        <motion.div
                            layoutId="mobileMenuBackground"
                            className="absolute inset-x-0 bottom-0 top-0 md:inset-0 bg-white/95 backdrop-blur-3xl flex flex-col items-center justify-center overflow-hidden"
                            style={{ borderRadius: 0, zIndex: 1051 }}
                            transition={{ type: "spring", bounce: 0.15, duration: 0.7 }}
                        >
                            {/* Close button that appears after expansion */}
                            <motion.button
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                                onClick={() => setMenuOpen(false)}
                                className="absolute top-8 right-4 w-[56px] h-[56px] rounded-full flex items-center justify-center bg-black/5 z-[1060]"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#050505" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </motion.button>

                            <div className="flex flex-col items-center gap-8 w-full px-6 relative z-[1060] mt-10">
                                {navLinks.map((item, i) => (
                                    <motion.a
                                        key={item.label}
                                        href={item.href}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.3, delay: 0.2 + i * 0.05, ease: "easeOut" }}
                                        className="text-[2.5rem] font-medium text-black no-underline font-outfit"
                                        onClick={(e) => {
                                            setMenuOpen(false);
                                            if (item.href.startsWith('/#')) {
                                                e.preventDefault();
                                                setTimeout(() => {
                                                    const id = item.href.replace('/#', '');
                                                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                                                }, 400);
                                            }
                                        }}
                                    >
                                        {item.label}
                                    </motion.a>
                                ))}

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.3, delay: 0.4, ease: "easeOut" }}
                                    className="mt-8 w-full max-w-[300px]"
                                >
                                    <Link href="/sign-up" className="flex justify-center w-full bg-[#050505] text-white rounded-full font-medium text-[1.1rem] px-8 py-4 transition-all duration-300 hover:scale-105 no-underline">
                                        Start Building
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
