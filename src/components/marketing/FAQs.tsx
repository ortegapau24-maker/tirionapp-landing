'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SplitText from '@/components/ui/SplitText';

const faqs = [
    {
        question: "How does TirionApp work with the tools I already use?",
        answer: "TirionApp connects to your existing CRM, email, calendar, and communication platforms through standard integrations. You don't need to migrate anything — we work on top of what you already have."
    },
    {
        question: "Is my business data safe?",
        answer: "Yes. Your data is encrypted at every step and never shared with anyone. We don't use your data to train our AI models. Your business information stays yours."
    },
    {
        question: "What happens if an automation doesn't know how to handle something?",
        answer: "It stops immediately and sends you a notification with full context. You're always in control — no automation will ever make a decision it's not confident about."
    },
    {
        question: "How quickly can I get started?",
        answer: "Most businesses have their first automation running within 48 hours. Our AI interviews you about your needs and builds the solution — no technical setup required on your end."
    },
    {
        question: "What is a credit and how much do they cost?",
        answer: "1 credit = 1 AI workflow execution. For example: processing an email, qualifying a lead, or handling a phone call each uses 1 credit. A typical dental clinic uses about 800 credits/month, a plumbing company about 500, and a restaurant about 1,200."
    },
    {
        question: "Is there a free trial?",
        answer: "Yes! 14 days free with 200 credits and 1 active automation — no credit card required. That's enough to fully experience how TirionApp can transform your operations."
    },
    {
        question: "Am I locked into a specific AI provider?",
        answer: "No. TirionApp automatically uses the best AI model for each task — you don't need to choose or manage AI providers. We handle the technology so you can focus on your business."
    },
    {
        question: "Can I use TirionApp if I have a larger team or enterprise needs?",
        answer: "Absolutely. Our Scale plan includes dedicated infrastructure, unlimited automations, and priority support. Contact our sales team for custom solutions."
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
