"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { PricingParticles } from "./PricingParticles";

export function Pricing() {
    const [hoveredTier, setHoveredTier] = useState<string | null>(null);
    const [isAnnual, setIsAnnual] = useState(false);

    // Default color is a very dark gray/almost black for the particles
    // When a tier is hovered, the particles shift to emphasize that tier
    let activeColor = "#0A0A0A"; // Default ambient color
    if (hoveredTier === "core") activeColor = "#333333";
    if (hoveredTier === "scale") activeColor = "#CCCCCC"; // Brightest for the recommended tier
    if (hoveredTier === "enterprise") activeColor = "#666666";

    return (
        <div className="py-24 md:py-[160px] px-4 md:px-10 bg-agency-bg-dark relative overflow-hidden" id="pricing">
            <PricingParticles activeColor={activeColor} />
            <div className="text-center mb-[60px] relative z-10 pointer-events-auto flex flex-col items-center">
                <h2 className="text-[clamp(3rem,5vw,5rem)] font-outfit font-semibold mb-6 text-agency-text-main pointer-events-none">Architect your scale.</h2>
                <p className="text-[1.25rem] text-agency-text-muted max-w-[600px] mb-8 pointer-events-none">
                    Flat-rate SaaS base with built-in AI limits. No hidden fees or metered surprises.
                </p>

                {/* Billing Toggle with Framer Motion Sliding Indicator */}
                <div className="relative inline-flex items-center bg-black/5 p-1.5 rounded-full border border-black/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                    <button
                        onClick={() => setIsAnnual(false)}
                        className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors z-10 ${!isAnnual ? 'text-black' : 'text-agency-text-muted hover:text-black'}`}
                    >
                        {!isAnnual && (
                            <motion.div
                                layoutId="pricing-tab"
                                className="absolute inset-0 bg-white rounded-full shadow-sm border border-black/5"
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        )}
                        <span className="relative z-20">Monthly</span>
                    </button>

                    <button
                        onClick={() => setIsAnnual(true)}
                        className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors z-10 flex items-center gap-2 ${isAnnual ? 'text-white' : 'text-agency-text-muted hover:text-black'}`}
                    >
                        {isAnnual && (
                            <motion.div
                                layoutId="pricing-tab"
                                className="absolute inset-0 bg-[#050505] rounded-full shadow-sm"
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        )}
                        <span className="relative z-20">Annually</span>
                        <span className={`relative z-20 text-[0.65rem] px-2 py-0.5 rounded-full font-bold transition-colors ${isAnnual ? 'bg-white/20 text-white' : 'bg-green-500/10 text-green-600'}`}>Save 10%</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1200px] mx-auto relative z-10">
                {/* Starter */}
                <div
                    className="pricing-card bg-transparent p-6 md:p-12 rounded-[24px] md:rounded-[32px] relative transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] group"
                    onMouseEnter={() => setHoveredTier("core")}
                    onMouseLeave={() => setHoveredTier(null)}
                >
                    <div className="relative z-10 pointer-events-none flex flex-col h-full">
                        <div className="text-[1.5rem] font-semibold mb-4 font-outfit text-agency-text-main">Starter</div>
                        <div className="flex items-baseline gap-1 mb-2">
                            <div className="text-[4rem] font-bold leading-none font-outfit tracking-[-0.04em] text-agency-text-main">
                                ${isAnnual ? Math.round(149 * 0.9) : 149}
                            </div>
                        </div>
                        <div className="text-agency-text-muted mb-8">per month {isAnnual && <span className="text-agency-accent-solid text-sm font-medium ml-1">(billed annually)</span>}</div>
                        <ul className="list-none mb-12 space-y-4 text-agency-text-main">
                            <li className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[20px] h-[20px] text-agency-accent-solid flex-shrink-0 mt-0.5">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg> 3 Active Automations
                            </li>
                            <li className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[20px] h-[20px] text-agency-accent-solid flex-shrink-0 mt-0.5">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg> 1,000 AI Executions / month
                            </li>
                            <li className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[20px] h-[20px] text-agency-accent-solid flex-shrink-0 mt-0.5">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg> Standard Support
                            </li>
                        </ul>
                        <a href="#" className="mt-auto block w-full text-center py-4 rounded-full font-semibold text-[1.1rem] transition-all duration-300 border border-agency-border-light text-agency-text-main hover:bg-[#050505] hover:text-white pointer-events-auto">
                            Begin Setup
                        </a>
                    </div>
                </div>

                {/* Growth */}
                <div
                    className="pricing-card bg-transparent p-6 md:p-12 rounded-[24px] md:rounded-[32px] relative transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] group"
                    onMouseEnter={() => setHoveredTier("scale")}
                    onMouseLeave={() => setHoveredTier(null)}
                >
                    <div className="relative z-10 pointer-events-none flex flex-col h-full">
                        <div className="text-[1.5rem] font-semibold mb-4 font-outfit text-agency-text-main">Growth</div>
                        <div className="flex items-baseline gap-1 mb-2">
                            <div className="text-[4rem] font-bold leading-none font-outfit tracking-[-0.04em] text-agency-text-main">
                                ${isAnnual ? Math.round(299 * 0.9) : 299}
                            </div>
                        </div>
                        <div className="text-agency-text-muted mb-8">per month {isAnnual && <span className="text-agency-accent-solid text-sm font-medium ml-1">(billed annually)</span>}</div>
                        <ul className="list-none mb-12 space-y-4 text-agency-text-main">
                            <li className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[20px] h-[20px] text-agency-accent-solid flex-shrink-0 mt-0.5">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg> 10 Active Automations
                            </li>
                            <li className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[20px] h-[20px] text-agency-accent-solid flex-shrink-0 mt-0.5">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg> 5,000 AI Executions / month
                            </li>
                            <li className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[20px] h-[20px] text-agency-accent-solid flex-shrink-0 mt-0.5">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg> Priority Support
                            </li>
                        </ul>
                        <a href="#" className="mt-auto block w-full text-center py-4 rounded-full font-semibold text-[1.1rem] transition-all duration-300 bg-[#050505] text-white hover:bg-[#222] pointer-events-auto">
                            Start 14-Day Trial
                        </a>
                    </div>
                </div>

                {/* Enterprise */}
                <div
                    className="pricing-card bg-transparent p-6 md:p-12 rounded-[24px] md:rounded-[32px] relative transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] group"
                    onMouseEnter={() => setHoveredTier("enterprise")}
                    onMouseLeave={() => setHoveredTier(null)}
                >
                    <div className="relative z-10 pointer-events-none flex flex-col h-full">
                        <div className="text-[1.5rem] font-semibold mb-4 font-outfit text-agency-text-main">Scale</div>
                        <div className="flex items-baseline gap-1 mb-2">
                            <div className="text-[4rem] font-bold leading-none font-outfit tracking-[-0.04em] text-agency-text-main">
                                ${isAnnual ? Math.round(599 * 0.9) : 599}
                            </div>
                        </div>
                        <div className="text-agency-text-muted mb-8">per month {isAnnual && <span className="text-agency-accent-solid text-sm font-medium ml-1">(billed annually)</span>}</div>
                        <ul className="list-none mb-12 space-y-4 text-agency-text-main">
                            <li className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[20px] h-[20px] text-agency-accent-solid flex-shrink-0 mt-0.5">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg> Unlimited Active Automations
                            </li>
                            <li className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[20px] h-[20px] text-agency-accent-solid flex-shrink-0 mt-0.5">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg> 20,000 AI Executions / month
                            </li>
                            <li className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[20px] h-[20px] text-agency-accent-solid flex-shrink-0 mt-0.5">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg> Dedicated Hardware Instance
                            </li>
                        </ul>
                        <a href="#" className="mt-auto block w-full text-center py-4 rounded-full font-semibold text-[1.1rem] transition-all duration-300 border border-agency-border-light text-agency-text-main hover:bg-[#050505] hover:text-white pointer-events-auto">
                            Contact Sales
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
