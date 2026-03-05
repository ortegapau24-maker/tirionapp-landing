"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import dynamic from 'next/dynamic';

const PricingParticles = dynamic(() => import('./PricingParticles'), { ssr: false });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.tirionapp.com';

const Check = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[20px] h-[20px] text-agency-accent-solid flex-shrink-0 mt-0.5">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export function Pricing() {
    const [hoveredTier, setHoveredTier] = useState<string | null>(null);
    const [isAnnual, setIsAnnual] = useState(false);

    let activeColor = "#0A0A0A";
    if (hoveredTier === "core") activeColor = "#333333";
    if (hoveredTier === "scale") activeColor = "#CCCCCC";
    if (hoveredTier === "enterprise") activeColor = "#666666";

    return (
        <div className="py-24 md:py-[clamp(6rem,10vw,10rem)] px-4 md:px-10 bg-agency-bg-dark relative overflow-hidden" id="pricing">
            <PricingParticles activeColor={activeColor} />
            <div className="text-center mb-16 md:mb-[clamp(3.5rem,5vw,5rem)] relative z-10 pointer-events-auto flex flex-col items-center max-w-[1200px] mx-auto">
                <h2 className="text-[clamp(3rem,5vw,5rem)] font-outfit font-medium tracking-[-0.02em] mb-6 text-agency-text-main pointer-events-none">Architect your scale.</h2>
                <p className="text-[1.125rem] text-agency-text-muted max-w-[640px] mb-8 pointer-events-none leading-[1.65]">
                    Subscription + credits included. Buy extra when you need them. Always know what you&apos;ll pay.
                </p>

                {/* Billing Toggle */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1400px] mx-auto relative z-10">
                {/* Free Trial */}
                <div
                    className="pricing-card bg-transparent p-6 md:p-10 rounded-[24px] md:rounded-[32px] relative transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] group"
                    onMouseEnter={() => setHoveredTier("core")}
                    onMouseLeave={() => setHoveredTier(null)}
                >
                    <div className="relative z-10 pointer-events-none flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="text-[1.5rem] font-semibold font-outfit text-agency-text-main">Free Trial</div>
                            <span className="text-[0.65rem] px-2 py-0.5 rounded-full font-bold bg-white/10 text-agency-text-muted uppercase tracking-wider">14 Days</span>
                        </div>
                        <div className="flex items-baseline gap-1 mb-2">
                            <div className="text-[4rem] font-bold leading-none font-outfit tracking-[-0.04em] text-agency-text-main">
                                $0
                            </div>
                        </div>
                        <div className="text-agency-text-muted mb-8">for 14 days</div>
                        <ul className="list-none mb-12 space-y-4 text-agency-text-main">
                            <li className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                <Check /> 1 Active Automation
                            </li>
                            <li className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                <Check /> <span><strong>200 credits</strong> included</span>
                            </li>
                            <li className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                <Check /> Limited platform access
                            </li>
                        </ul>
                        <a href={APP_URL} className="mt-auto block w-full text-center py-4 rounded-full font-semibold text-[1.1rem] transition-all duration-300 border border-agency-border-light text-agency-text-muted hover:text-agency-text-main pointer-events-auto">
                            Start Free Trial
                        </a>
                    </div>
                </div>

                {/* Starter */}
                <div
                    className="pricing-card bg-transparent p-6 md:p-10 rounded-[24px] md:rounded-[32px] relative transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] group shadow-[0_16px_48px_rgba(0,50,160,0.15)]"
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
                                <Check /> 3 Active Automations
                            </li>
                            <li className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                <Check /> <span><strong>1,000 credits</strong> included / month</span>
                            </li>
                            <li className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                <Check /> Extra credits at $0.05 each
                            </li>
                            <li className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                <Check /> Standard Support
                            </li>
                        </ul>
                        <a href={APP_URL} className="mt-auto block w-full text-center py-4 rounded-full font-semibold text-[1.1rem] transition-all duration-300 bg-[#0032A0] text-white hover:bg-[#002880] pointer-events-auto">
                            Begin Setup
                        </a>
                    </div>
                </div>

                {/* Growth */}
                <div
                    className="pricing-card bg-transparent p-6 md:p-10 rounded-[24px] md:rounded-[32px] relative transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] group"
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
                                <Check /> 10 Active Automations
                            </li>
                            <li className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                <Check /> <span><strong>5,000 credits</strong> included / month</span>
                            </li>
                            <li className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                <Check /> Extra credits at $0.03 each
                            </li>
                            <li className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                <Check /> Priority Support
                            </li>
                        </ul>
                        <a href={APP_URL} className="mt-auto block w-full text-center py-4 rounded-full font-semibold text-[1.1rem] transition-all duration-300 border border-agency-border-light text-agency-text-muted hover:text-agency-text-main pointer-events-auto">
                            Get Started
                        </a>
                    </div>
                </div>

                {/* Scale */}
                <div
                    className="pricing-card bg-transparent p-6 md:p-10 rounded-[24px] md:rounded-[32px] relative transition-all duration-400 ease-[cubic-bezier(0.2,0.8,0.2,1)] group"
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
                                <Check /> Unlimited Active Automations
                            </li>
                            <li className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                <Check /> <span><strong>20,000 credits</strong> included / month</span>
                            </li>
                            <li className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                <Check /> Extra credits at $0.02 each
                            </li>
                            <li className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                <Check /> Dedicated Hardware Instance
                            </li>
                        </ul>
                        <a href={APP_URL} className="mt-auto block w-full text-center py-4 rounded-full font-semibold text-[1.1rem] transition-all duration-300 border border-agency-border-light text-agency-text-main hover:bg-[#050505] hover:text-white pointer-events-auto">
                            Contact Sales
                        </a>
                    </div>
                </div>
            </div>

            {/* Credit Explainer */}
            <div className="max-w-[800px] mx-auto mt-16 relative z-10">
                <div className="bg-agency-bg-surface/50 rounded-[24px] border border-agency-border-light p-8 md:p-10">
                    <h3 className="text-[1.25rem] font-outfit font-semibold text-agency-text-main mb-3">What is a credit?</h3>
                    <p className="text-agency-text-muted text-[0.95rem] leading-[1.65] mb-6">
                        1 credit = 1 AI workflow execution. Processing an email, qualifying a lead, or handling a phone call each uses 1 credit.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[0.875rem]">
                        <div className="bg-white/5 rounded-xl p-4 border border-agency-border-light">
                            <div className="font-semibold text-agency-text-main mb-1">🦷 Dental Clinic</div>
                            <div className="text-agency-text-muted">~800 credits/month</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-agency-border-light">
                            <div className="font-semibold text-agency-text-main mb-1">🔧 Plumbing Company</div>
                            <div className="text-agency-text-muted">~500 credits/month</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-agency-border-light">
                            <div className="font-semibold text-agency-text-main mb-1">🍽️ Restaurant</div>
                            <div className="text-agency-text-muted">~1,200 credits/month</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
