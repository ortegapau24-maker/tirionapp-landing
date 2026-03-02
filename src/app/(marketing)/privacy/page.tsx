import Link from 'next/link';

export const metadata = { title: 'Privacy Policy — TirionApp' };

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col items-center px-6 py-32 bg-agency-bg-dark">
            <div className="max-w-[640px] w-full">
                <p className="text-sm uppercase tracking-[0.2em] text-agency-text-muted/60 font-semibold mb-6 font-inter">Legal</p>
                <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-outfit font-semibold text-agency-text-main leading-[1.1] tracking-tight mb-10">Privacy Policy</h1>

                <div className="space-y-8 text-agency-text-muted text-[1.05rem] leading-[1.8] font-light">
                    <section>
                        <h2 className="text-agency-text-main font-outfit font-semibold text-[1.2rem] mb-3">1. Data Collection</h2>
                        <p>TirionApp collects only the data necessary to operate the platform: account credentials, organization metadata, and usage telemetry. We do not sell or share personal data with third parties.</p>
                    </section>

                    <section>
                        <h2 className="text-agency-text-main font-outfit font-semibold text-[1.2rem] mb-3">2. Data Processing</h2>
                        <p>Your data is routed through isolated, zero-retention API endpoints. We do not use any customer data, logs, or fine-tuning artifacts to train our foundation models.</p>
                    </section>

                    <section>
                        <h2 className="text-agency-text-main font-outfit font-semibold text-[1.2rem] mb-3">3. GDPR Compliance</h2>
                        <p>TirionApp implements a strict &quot;Right to be Forgotten.&quot; Users can request permanent deletion of all Personally Identifiable Information (PII) at any time. We do not use soft deletes for PII — data is permanently scrubbed upon request.</p>
                    </section>

                    <section>
                        <h2 className="text-agency-text-main font-outfit font-semibold text-[1.2rem] mb-3">4. Security</h2>
                        <p>TirionApp is SOC 2 Type II certified. We use end-to-end encryption at rest and in transit, SSO via SAML 2.0, role-based access control, and maintain full audit logs for every agent action.</p>
                    </section>

                    <section>
                        <h2 className="text-agency-text-main font-outfit font-semibold text-[1.2rem] mb-3">5. Contact</h2>
                        <p>For privacy-related inquiries, contact privacy@tirionapp.com.</p>
                    </section>
                </div>

                <div className="mt-16">
                    <Link href="/" className="text-agency-text-muted hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/50">← Back to home</Link>
                </div>
            </div>
        </div>
    );
}
