import Link from 'next/link';

export const metadata = { title: 'Customers — TirionApp' };

export default function CustomersPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-32 bg-agency-bg-dark">
            <p className="text-sm uppercase tracking-[0.2em] text-agency-text-muted/60 font-semibold mb-6 font-inter">Company</p>
            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-outfit font-semibold text-agency-text-main leading-[1.1] tracking-tight text-center mb-6">Customers</h1>
            <p className="text-[1.15rem] text-agency-text-muted max-w-[520px] text-center leading-[1.7] font-light mb-10">
                From boutique consultancies to enterprise performance agencies — TirionApp powers autonomous operations for teams that refuse to scale by hiring. Case studies coming soon.
            </p>
            <Link href="/" className="text-agency-text-muted hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/50">← Back to home</Link>
        </div>
    );
}
