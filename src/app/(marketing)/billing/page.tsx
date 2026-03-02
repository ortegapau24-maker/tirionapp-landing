import Link from 'next/link';

export const metadata = { title: 'Billing — TirionApp' };

export default function BillingPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-32 bg-agency-bg-dark">
            <p className="text-sm uppercase tracking-[0.2em] text-agency-text-muted/60 font-semibold mb-6 font-inter">Platform</p>
            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-outfit font-semibold text-agency-text-main leading-[1.1] tracking-tight text-center mb-6">Simple, Flat Pricing</h1>
            <p className="text-[1.15rem] text-agency-text-muted max-w-[520px] text-center leading-[1.7] font-light mb-10">
                Pay a flat monthly subscription per tier. Each plan includes a set number of automations and AI executions. No usage-based surprises.
            </p>
            <Link href="/" className="text-agency-text-muted hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/50">← Back to home</Link>
        </div>
    );
}
