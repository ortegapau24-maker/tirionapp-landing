'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SplitText from '@/components/ui/SplitText';

const faqs = [
    {
        question: "How does TirionApp integrate with our existing stack?",
        answer: "TirionApp acts as an intelligence layer above your current tools. Using event-driven durable orchestration, you can connect to your existing CRM, ERP, and communication platforms (like Salesforce, Zendesk, and Slack) via standard API integrations without migrating your data."
    },
    {
        question: "Is our proprietary data used to train your models?",
        answer: "No. We enforce strict enterprise data boundaries. Your data is routed through isolated, zero-retention API endpoints. We do not use any customer data, logs, or fine-tuning artifacts to train our base foundation models."
    },
    {
        question: "What happens if an autonomous agent encounters an edge case?",
        answer: "TirionApp features a deterministic 'Human-in-the-Loop' failover mechanism. If an agent detects a scenario outside its confidence threshold (set by you), it immediately halts execution and routes the context to a designated human operator via the Universal Inbox for resolution."
    },
    {
        question: "How quickly can we deploy our first autonomous workflow?",
        answer: "Most enterprise clients deploy their first production-ready workflow within 48 hours. Our conversational interface generates the structural logic instantly, leaving only API credential mapping and confidence testing before you go live."
    },
    {
        question: "Are we locked into a specific LLM provider?",
        answer: "No. TirionApp is built with an LLM-agnostic routing architecture. You can dynamically switch between OpenAI, Anthropic, Google, or even your own self-hosted local models on a per-agent or per-workflow basis to optimize for cost, speed, or compliance."
    },
    {
        question: "What security certifications does TirionApp hold?",
        answer: "TirionApp is SOC 2 Type II certified with end-to-end encryption at rest and in transit. We support SSO via SAML 2.0, role-based access control, and maintain full audit logs for every agent action. Enterprise plans include dedicated infrastructure isolation."
    }
];

export function FAQs() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-24 md:py-[clamp(6rem,10vw,10rem)] px-4 md:px-10 bg-agency-bg-dark flex justify-center w-full relative overflow-hidden" id="faq">
            {/* Subtle background accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-white/[0.02] to-transparent rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-[900px] w-full flex flex-col gap-16 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="flex-1">
                        <div className="text-[0.75rem] uppercase tracking-[0.2em] text-agency-text-muted/60 font-semibold mb-5 font-inter">
                            FAQ
                        </div>
                        <SplitText
                            text="Common Questions"
                            className="text-[clamp(3rem,5vw,5rem)] font-outfit font-medium leading-[1.05] tracking-[-0.02em] text-white"
                            delay={25}
                            duration={1}
                            ease="power3.out"
                            splitType="words"
                            from={{ opacity: 0, y: 30 }}
                            to={{ opacity: 1, y: 0 }}
                            threshold={0.1}
                            rootMargin="-100px"
                            textAlign="left"
                            tag="h2"
                        />
                    </div>
                    <p className="text-[1.125rem] text-agency-text-muted max-w-[340px] font-light leading-[1.65]">
                        Quick answers to help you evaluate if TirionApp is the right fit for your operation.
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="flex flex-col w-full gap-3">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <motion.div
                                key={index}
                                className="overflow-hidden rounded-2xl border border-white/10"
                                style={{ backgroundColor: '#1c1c1e' }}
                                initial={false}
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full flex justify-between items-center px-4 md:px-6 py-4 md:py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-2xl transition-colors group"
                                >
                                    <div className="flex items-center gap-3 md:gap-5 pr-4 md:pr-8">
                                        <span className="text-[0.8rem] font-mono text-agency-text-muted/40 font-medium tabular-nums shrink-0">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span className="font-outfit text-[1.1rem] md:text-[1.2rem] font-medium text-white/90 group-hover:text-white transition-colors duration-300">
                                            {faq.question}
                                        </span>
                                    </div>
                                    <motion.div
                                        animate={{ rotate: isOpen ? 45 : 0 }}
                                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                        className="shrink-0 w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white/60 group-hover:border-white/20 group-hover:text-white/80 transition-all duration-300"
                                    >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                    </motion.div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            <div className="px-4 md:px-6 pb-4 md:pb-6 pl-10 md:pl-[4.5rem] pr-6 md:pr-10 text-[1rem] md:text-[1.05rem] text-agency-text-muted/75 leading-[1.75] font-inter font-light">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="flex items-center justify-center pt-4">
                    <p className="text-agency-text-muted/60 text-[0.95rem] font-light">
                        Still have questions?{' '}
                        <a href="#" className="text-white/80 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/50 transition-all duration-300">
                            Talk to our team
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
