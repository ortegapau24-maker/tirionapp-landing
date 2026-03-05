'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import PricingParticles from './PricingParticles';
import SplitText from '@/components/ui/SplitText';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';

const WorkflowDemo = dynamic(() => import('./WorkflowDemo').then(mod => mod.WorkflowDemo), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-transparent" />
});


export function AgentGenerator() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-20%" });

    const [step, setStep] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        const sequence = async () => {
            // Step 1: User Message 1
            await new Promise(r => setTimeout(r, 400));
            setStep(1);

            // Step 2: AI Analyzing
            await new Promise(r => setTimeout(r, 600));
            setStep(2);

            // Step 3: AI Response 1
            await new Promise(r => setTimeout(r, 1400));
            setStep(3);

            // Step 4: User Message 2
            await new Promise(r => setTimeout(r, 2000));
            setStep(4);

            // Step 5: AI Provisioning
            await new Promise(r => setTimeout(r, 600));
            setStep(5);

            // Step 6: AI Building Logic...
            await new Promise(r => setTimeout(r, 800));
            setStep(6);

            // Step 7: AI Testing Logic...
            await new Promise(r => setTimeout(r, 800));
            setStep(7);

            // Step 8: AI Deployment Card
            await new Promise(r => setTimeout(r, 800));
            setStep(8);

            // Step 9: AI Done Text
            await new Promise(r => setTimeout(r, 800));
            setStep(9);
        };

        sequence();
    }, [isInView]);

    return (
        <div className="relative overflow-hidden py-24 md:py-[clamp(6rem,10vw,10rem)] px-4 md:px-10 bg-agency-bg-dark flex justify-center w-full">
            {/* Background Particles Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <PricingParticles activeColor="#FFFFFF" targetSelector=".chat-card-container" blendMode="mix-blend-normal opacity-60" />
            </div>

            <div className="flex flex-col gap-[clamp(3.5rem,5vw,5rem)] max-w-[1200px] w-full items-center relative z-10 mt-10">

                {/* Top: Copy */}
                <div className="w-full text-center max-w-[800px] flex flex-col items-center">
                    <div className="mb-6">
                        <SplitText
                            text="Need something bespoke? Just ask in chat."
                            className="text-[clamp(3rem,5vw,5rem)] font-outfit font-medium leading-[1.1] tracking-[-0.02em] text-agency-text-main"
                            delay={25}
                            duration={1}
                            ease="power3.out"
                            splitType="words"
                            from={{ opacity: 0, y: 40 }}
                            to={{ opacity: 1, y: 0 }}
                            threshold={0.1}
                            rootMargin="-100px"
                            textAlign="center"
                            tag="h2"
                        />
                    </div>
                    <div className="max-w-[600px]">
                        <SplitText
                            text="Forget complex visual editors. TirionApp AI builds and deploys autonomous agents based solely on your description. Conversational. Instant. Scalable."
                            className="text-[1.2rem] text-agency-text-muted leading-[1.6]"
                            delay={10}
                            duration={0.8}
                            ease="power3.out"
                            splitType="words"
                            from={{ opacity: 0, y: 15 }}
                            to={{ opacity: 1, y: 0 }}
                            threshold={0.1}
                            rootMargin="-80px"
                            textAlign="center"
                            tag="p"
                        />
                    </div>
                </div>

                {/* Bottom: Unified IDE Interface */}
                <motion.div
                    className="w-full flex justify-center relative z-10"
                    style={{ perspective: '1800px' }}
                    initial={{ opacity: 0, y: 60, scale: 0.92 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="w-full max-w-[1920px] h-auto lg:h-[620px] relative bg-[#FAFAFA] overflow-hidden flex flex-col lg:flex-row rounded-[24px] md:rounded-[28px] border border-gray-200 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">

                        {/* Left Side: Chat Sidebar (Fixed Width) */}
                        <div
                            ref={containerRef}
                            className="w-full lg:w-[440px] h-[400px] lg:h-full flex flex-col items-center relative z-20 bg-white/40 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-white/30"
                        >
                            {/* Chat Header */}
                            <div className="w-full p-4 bg-white/50 backdrop-blur-sm flex items-center justify-between border-b border-white/20">
                                <div className="flex items-center gap-3">
                                    <span className="font-outfit font-semibold text-black text-[0.95rem]">TirionApp Copilot</span>
                                </div>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            </div>

                            {/* Chat Messages Container */}
                            <div className="flex-1 w-full p-4 flex flex-col gap-4 overflow-y-auto relative">
                                {/* Step 1: User Msg */}
                                <div className={cn("flex gap-3 justify-end transition-all duration-700 ease-out shrink-0", step >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}>
                                    <div className="max-w-[85%] bg-[#f0f0f0] text-black rounded-t-[20px] rounded-bl-[20px] rounded-br-sm p-4 text-[0.95rem] leading-[1.5] relative">
                                        &quot;Build a workflow that checks info@myagency.com for urgent tickets. If urgent, create a Zendesk ticket AND ping Slack. Otherwise, log it to Postgres.&quot;
                                    </div>
                                    <div className="w-[36px] h-[36px] rounded-full bg-red-500 text-white flex items-center justify-center font-bold flex-shrink-0 font-outfit text-sm">
                                        U
                                    </div>
                                </div>

                                {/* Step 2/3: AI Msg 1 */}
                                <div className={cn("flex gap-3 transition-all duration-700 ease-out shrink-0", step >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 hidden")}>
                                    <div className="w-[36px] h-[36px] mt-1 bg-[#0032A0] rounded-full flex items-center justify-center flex-shrink-0 relative">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
                                            <path d="M12 2a2 2 0 0 1 2 2v1h6a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6V4a2 2 0 0 1 2-2z"></path>
                                        </svg>
                                    </div>
                                    <div className="w-full max-w-[85%] bg-[#f0f0f0] rounded-t-[20px] rounded-br-[20px] rounded-bl-sm p-4 text-[0.95rem] text-black leading-[1.5] relative">
                                        {step === 2 && (
                                            <span className="text-black font-medium font-inter flex items-center gap-2 animate-pulse">
                                                Analyzing branching logic...
                                            </span>
                                        )}

                                        {step >= 3 && (
                                            <div className="animate-[floatUp_0.4s_ease-out_forwards]">
                                                Understood. I&apos;ll need access to <strong>Slack</strong>, <strong>Zendesk</strong>, and the <strong>PostgreSQL</strong> instance. Use existing credentials?
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Step 4: User Msg 2 */}
                                <div className={cn("flex gap-3 justify-end transition-all duration-700 ease-out shrink-0", step >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 hidden")}>
                                    <div className="max-w-[85%] bg-[#f0f0f0] text-black rounded-t-[20px] rounded-bl-[20px] rounded-br-sm p-4 text-[0.95rem] leading-[1.5] relative">
                                        &quot;Yes, proceed.&quot;
                                    </div>
                                    <div className="w-[36px] h-[36px] rounded-full bg-red-500 text-white flex items-center justify-center font-bold flex-shrink-0 font-outfit text-sm">
                                        U
                                    </div>
                                </div>

                                {/* Step 5-9: AI Msg 2 */}
                                <div className={cn("flex gap-3 transition-all duration-700 ease-out", step >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 hidden")}>
                                    <div className="w-[36px] h-[36px] mt-1 bg-[#0032A0] rounded-full flex items-center justify-center flex-shrink-0 relative">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
                                            <path d="M12 2a2 2 0 0 1 2 2v1h6a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6V4a2 2 0 0 1 2-2z"></path>
                                        </svg>
                                    </div>
                                    <div className="w-full max-w-[88%] bg-[#f0f0f0] rounded-t-[20px] rounded-br-[20px] rounded-bl-sm p-4 text-[0.95rem] text-black leading-[1.5] relative">
                                        {step >= 5 && step < 8 && (
                                            <span className="text-black font-medium font-inter flex items-center gap-2 animate-pulse">
                                                {step === 5 && "Scaffolding workflow nodes..."}
                                                {step === 6 && "Wiring parallel branches..."}
                                                {step === 7 && "Testing logic gates..."}
                                            </span>
                                        )}

                                        {step >= 8 && (
                                            <>
                                                <div className="bg-white border border-green-500 rounded-[12px] overflow-hidden mb-3 shadow-sm">
                                                    <div className="bg-green-50 px-4 py-2 border-b border-green-200 flex justify-between items-center text-[0.85rem]">
                                                        <strong className="font-outfit text-green-900">Branching Agent active</strong>
                                                        <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-[0.6rem] font-bold tracking-wide uppercase">Live</span>
                                                    </div>
                                                </div>
                                                {step >= 9 && (
                                                    <p className="m-0 text-black font-medium animate-[floatUp_0.4s_ease-out_forwards]">
                                                        Deployed! The visual logic map to the right shows your real-time data flow.
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Chat Input Placeholder */}
                            <div className="w-full p-4 bg-white/50 backdrop-blur-sm border-t border-white/20">
                                <div className="w-full h-[44px] rounded-full border border-gray-300 bg-gray-50 flex items-center px-4 text-sm text-gray-400 font-inter">
                                    Modify this workflow...
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Workflow Canvas (Dynamic Width) */}
                        <div className="w-full lg:flex-1 min-h-[350px] sm:min-h-[450px] relative overflow-hidden flex">
                            <ErrorBoundary fallback={<div className="w-full h-full bg-transparent flex items-center justify-center text-gray-400">Loading visualization...</div>}>
                                <WorkflowDemo step={step} />
                            </ErrorBoundary>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
