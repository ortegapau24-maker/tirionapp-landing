"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import dynamic from 'next/dynamic';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const PricingParticles = dynamic(() => import('./PricingParticles'), { ssr: false });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.tirionapp.com';

const Check = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[20px] h-[20px] text-agency-accent-solid flex-shrink-0 mt-0.5">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export function Pricing() {
    const { t } = useLanguage();
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
                <h2 className="text-[clamp(3rem,5vw,5rem)] font-outfit font-medium tracking-[-0.02em] mb-6 text-agency-text-main pointer-events-none">{t('pricing.title')}</h2>
                <p className="text-[1.125rem] text-agency-text-muted max-w-[640px] mb-8 pointer-events-none leading-[1.65]">
                    {t('pricing.subtitle')}
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
                        <span className="relative z-20">{t('pricing.monthly')}</span>
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
                        <span className="relative z-20">{t('pricing.annually')}</span>
                        <span className={`relative z-20 text-[0.65rem] px-2 py-0.5 rounded-full font-bold transition-colors ${isAnnual ? 'bg-white/20 text-white' : 'bg-green-500/10 text-green-600'}`}>{t('pricing.save10')}</span>
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
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-[1.5rem] font-semibold font-outfit text-agency-text-main">{t('pricing.freeTrial.name')}</div>
                            <span className="text-[0.65rem] px-2 py-0.5 rounded-full font-bold bg-white/10 text-agency-text-muted uppercase tracking-wider">{t('pricing.days14')}</span>
                        </div>
                        <p className="text-agency-text-muted text-[0.85rem] mb-4 leading-snug">{t('pricing.freeTrial.desc')}</p>
                        <div className="flex items-baseline gap-1 mb-2">
                            <div className="text-[4rem] font-bold leading-none font-outfit tracking-[-0.04em] text-agency-text-main">
                                $0
                            </div>
                        </div>
                        <div className="text-agency-text-muted mb-8">{t('pricing.for14Days')}</div>
                        <ul className="list-none mb-12 space-y-4 text-agency-text-main">
                            {(t('pricing.freeTrial.features') as unknown as string[]).map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                    <Check /> <span dangerouslySetInnerHTML={{ __html: feature }} />
                                </li>
                            ))}
                        </ul>
                        <a href={APP_URL} className="mt-auto block w-full text-center py-4 rounded-full font-semibold text-[1.1rem] transition-all duration-300 border border-agency-border-light text-agency-text-muted hover:text-agency-text-main pointer-events-auto">
                            {t('pricing.freeTrial.button')}
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
                        <div className="text-[1.5rem] font-semibold mb-2 font-outfit text-agency-text-main">{t('pricing.starter.name')}</div>
                        <p className="text-agency-text-muted text-[0.85rem] mb-4 leading-snug">{t('pricing.starter.desc')}</p>
                        <div className="flex items-baseline gap-1 mb-2">
                            <div className="text-[4rem] font-bold leading-none font-outfit tracking-[-0.04em] text-agency-text-main">
                                ${isAnnual ? Math.round(149 * 0.9) : 149}
                            </div>
                        </div>
                        <div className="text-agency-text-muted mb-8">{t('pricing.perMonth')} {isAnnual && <span className="text-agency-accent-solid text-sm font-medium ml-1">{t('pricing.billedAnnually')}</span>}</div>
                        <ul className="list-none mb-12 space-y-4 text-agency-text-main">
                            {(t('pricing.starter.features') as unknown as string[]).map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                    <Check /> <span dangerouslySetInnerHTML={{ __html: feature }} />
                                </li>
                            ))}
                        </ul>
                        <a href={APP_URL} className="mt-auto block w-full text-center py-4 rounded-full font-semibold text-[1.1rem] transition-all duration-300 bg-[#0032A0] text-white hover:bg-[#002880] pointer-events-auto">
                            {t('pricing.starter.button')}
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
                        <div className="text-[1.5rem] font-semibold mb-2 font-outfit text-agency-text-main">{t('pricing.growth.name')}</div>
                        <p className="text-agency-text-muted text-[0.85rem] mb-4 leading-snug">{t('pricing.growth.desc')}</p>
                        <div className="flex items-baseline gap-1 mb-2">
                            <div className="text-[4rem] font-bold leading-none font-outfit tracking-[-0.04em] text-agency-text-main">
                                ${isAnnual ? Math.round(299 * 0.9) : 299}
                            </div>
                        </div>
                        <div className="text-agency-text-muted mb-8">{t('pricing.perMonth')} {isAnnual && <span className="text-agency-accent-solid text-sm font-medium ml-1">{t('pricing.billedAnnually')}</span>}</div>
                        <ul className="list-none mb-12 space-y-4 text-agency-text-main">
                            {(t('pricing.growth.features') as unknown as string[]).map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                    <Check /> <span dangerouslySetInnerHTML={{ __html: feature }} />
                                </li>
                            ))}
                        </ul>
                        <a href={APP_URL} className="mt-auto block w-full text-center py-4 rounded-full font-semibold text-[1.1rem] transition-all duration-300 border border-agency-border-light text-agency-text-muted hover:text-agency-text-main pointer-events-auto">
                            {t('pricing.growth.button')}
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
                        <div className="text-[1.5rem] font-semibold mb-2 font-outfit text-agency-text-main">{t('pricing.scale.name')}</div>
                        <p className="text-agency-text-muted text-[0.85rem] mb-4 leading-snug">{t('pricing.scale.desc')}</p>
                        <div className="flex items-baseline gap-1 mb-2">
                            <div className="text-[4rem] font-bold leading-none font-outfit tracking-[-0.04em] text-agency-text-main">
                                ${isAnnual ? Math.round(599 * 0.9) : 599}
                            </div>
                        </div>
                        <div className="text-agency-text-muted mb-8">{t('pricing.perMonth')} {isAnnual && <span className="text-agency-accent-solid text-sm font-medium ml-1">{t('pricing.billedAnnually')}</span>}</div>
                        <ul className="list-none mb-12 space-y-4 text-agency-text-main">
                            {(t('pricing.scale.features') as unknown as string[]).map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-3 mb-4 text-[0.95rem]">
                                    <Check /> <span dangerouslySetInnerHTML={{ __html: feature }} />
                                </li>
                            ))}
                        </ul>
                        <a href={APP_URL} className="mt-auto block w-full text-center py-4 rounded-full font-semibold text-[1.1rem] transition-all duration-300 border border-agency-border-light text-agency-text-main hover:bg-[#050505] hover:text-white pointer-events-auto">
                            {t('pricing.scale.button')}
                        </a>
                    </div>
                </div>
            </div>


        </div>
    );
}
