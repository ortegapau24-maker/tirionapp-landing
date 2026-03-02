import Link from 'next/link';

export const metadata = { title: 'Terms of Service — TirionApp' };

export default function TermsPage() {
    return (
        <div className="min-h-screen flex flex-col items-center px-6 py-32 bg-agency-bg-dark">
            <div className="max-w-[640px] w-full">
                <p className="text-sm uppercase tracking-[0.2em] text-agency-text-muted/60 font-semibold mb-6 font-inter">Legal</p>
                <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-outfit font-semibold text-agency-text-main leading-[1.1] tracking-tight mb-10">Terms of Service</h1>

                <div className="space-y-8 text-agency-text-muted text-[1.05rem] leading-[1.8] font-light">
                    <section>
                        <h2 className="text-agency-text-main font-outfit font-semibold text-[1.2rem] mb-3">1. Platform Access</h2>
                        <p>TirionApp provides access to AI automation infrastructure through a flat monthly SaaS subscription. Each tier includes a set number of automations and AI executions per month. No prepaid credits or usage-based billing applies.</p>
                    </section>

                    <section>
                        <h2 className="text-agency-text-main font-outfit font-semibold text-[1.2rem] mb-3">2. Subscription &amp; Cancellation</h2>
                        <p>Subscriptions are billed monthly. Upon cancellation, the organization retains access until the end of the current billing period. After that, the plan downgrades to the free tier and all active automations are paused.</p>
                    </section>

                    <section>
                        <h2 className="text-agency-text-main font-outfit font-semibold text-[1.2rem] mb-3">3. Data Ownership</h2>
                        <p>All data uploaded, generated, or processed through TirionApp remains the intellectual property of the user and their organization. TirionApp does not claim ownership over customer data.</p>
                    </section>

                    <section>
                        <h2 className="text-agency-text-main font-outfit font-semibold text-[1.2rem] mb-3">4. Service Availability</h2>
                        <p>TirionApp targets 99.9% uptime for all core services. Scheduled maintenance windows are communicated in advance. The platform uses durable orchestration to retry failed operations automatically.</p>
                    </section>

                    <section>
                        <h2 className="text-agency-text-main font-outfit font-semibold text-[1.2rem] mb-3">5. Limitation of Liability</h2>
                        <p>TirionApp provides AI-powered automation tools as-is. While agents operate with Human-in-the-Loop failover mechanisms, TirionApp is not liable for autonomous decisions made by deployed agents outside of configured confidence thresholds.</p>
                    </section>

                    <section>
                        <h2 className="text-agency-text-main font-outfit font-semibold text-[1.2rem] mb-3">6. Contact</h2>
                        <p>For legal inquiries, contact legal@tirionapp.com.</p>
                    </section>
                </div>

                <div className="mt-16">
                    <Link href="/" className="text-agency-text-muted hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/50">← Back to home</Link>
                </div>
            </div>
        </div>
    );
}
