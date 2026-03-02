import Link from 'next/link';

export const metadata = { title: 'Careers — TirionApp' };

export default function CareersPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-32 bg-agency-bg-dark">
            <p className="text-sm uppercase tracking-[0.2em] text-agency-text-muted/60 font-semibold mb-6 font-inter">Company</p>
            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-outfit font-semibold text-agency-text-main leading-[1.1] tracking-tight text-center mb-6">Careers</h1>
            <p className="text-[1.15rem] text-agency-text-muted max-w-[520px] text-center leading-[1.7] font-light mb-10">
                We are building the infrastructure layer for autonomous agencies. If you think in systems, ship fast, and care about craft — we want to hear from you.
            </p>
            <p className="text-agency-text-muted/40 text-sm mb-10">No open positions at this time. Check back soon.</p>
            <Link href="/" className="text-agency-text-muted hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/50">← Back to home</Link>
        </div>
    );
}
