export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[var(--color-agency-bg-surface)] py-20 px-4 md:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[24px] shadow-sm border border-black/[0.04]">
                <h1 className="text-3xl md:text-5xl font-bold font-outfit text-agency-text-main mb-8">Privacy Policy</h1>

                <div className="prose prose-lg text-agency-text-muted">
                    <p className="mb-4">Last updated: March 2026</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">1. Identity of Controller</h2>
                    <p className="mb-4">TirionApp ("we", "us", or "our") acts as the Data Controller for the personal data collected when you use our services. For any privacy-related inquiries, you can contact our Data Protection Officer at <a href="mailto:privacy@tirionapp.com" className="text-[#0032A0] hover:underline">privacy@tirionapp.com</a>.</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">2. Information We Collect</h2>
                    <ul className="list-disc pl-6 mb-4">
                        <li><strong>Account Data:</strong> Full name, email address, password.</li>
                        <li><strong>Usage Data:</strong> Workflows created, features accessed, and general service usage metrics.</li>
                        <li><strong>Technical Data:</strong> IP addresses, browser types, and operating systems.</li>
                        <li><strong>Integration Data:</strong> Information retrieved from third-party APIs connected to your workflows (we only access data strictly necessary to execute your defined automations).</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">3. Legal Basis for Processing</h2>
                    <p className="mb-4">We process your personal data under the following legal bases:</p>
                    <ul className="list-disc pl-6 mb-4">
                        <li><strong>Contract:</strong> Processing is necessary to fulfill our Terms of Service (e.g., executing workflows).</li>
                        <li><strong>Legitimate Interest:</strong> Improving our platform security and preventing fraud.</li>
                        <li><strong>Consent:</strong> Sending promotional content and utilizing non-essential analytics cookies.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">4. How We Use Your Data</h2>
                    <p className="mb-4">Your information is used solely to provide, maintain, and improve the TirionApp platform. <strong>We do NOT use your proprietary business data, API payloads, or automated workflows to train our AI foundation models.</strong> All interactions with language models are sandboxed and ephemeral.</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">5. Data Sharing & Third Parties</h2>
                    <p className="mb-4">We do not sell your personal data. We may share necessary data with trusted Sub-processors (such as cloud hosting providers and payment processors like Stripe) who act on our behalf under strict Data Processing Agreements. We ensure these third parties maintain equivalent security standards.</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">6. Your Data Rights</h2>
                    <p className="mb-4">Under global privacy regulations (including GDPR and CCPA), you have the right to:</p>
                    <ul className="list-disc pl-6 mb-4">
                        <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                        <li><strong>Correction:</strong> Correct any inaccurate or incomplete information.</li>
                        <li><strong>Deletion ("Right to be Forgotten"):</strong> Request that we erase your personal data.</li>
                        <li><strong>Object/Restrict:</strong> Object to or request restriction of certain processing activities.</li>
                        <li><strong>Portability:</strong> Receive your data in a structured, commonly used, machine-readable format.</li>
                    </ul>
                    <p className="mb-4">To exercise these rights, please email <a href="mailto:privacy@tirionapp.com" className="text-[#0032A0] hover:underline">privacy@tirionapp.com</a>. We will respond within 30 days.</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">7. Data Retention</h2>
                    <p className="mb-4">Given the automated nature of our platform, we only keep data as long as necessary:</p>
                    <ul className="list-disc pl-6 mb-4">
                        <li><strong>Account Data:</strong> Retained until account deletion, plus a 30-day grace period for recovery.</li>
                        <li><strong>Workflow Execution Logs:</strong> Automatically purged after 90 days.</li>
                        <li><strong>Billing/Tax Records:</strong> Retained for 7 years to comply with legal obligations.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">8. Security & International Transfers</h2>
                    <p className="mb-4">We implement industry-standard security measures including encryption at rest and in transit. For users in the European Economic Area (EEA), any data transferred to our US-based servers is safeguarded by Standard Contractual Clauses (SCCs) approved by the European Commission.</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">9. Contact Us</h2>
                    <p className="mb-4">If you have any questions or concerns regarding this Privacy Policy, please contact our Data Protection Officer at <a href="mailto:privacy@tirionapp.com" className="text-[#0032A0] hover:underline">privacy@tirionapp.com</a>.</p>
                </div>
            </div>
        </div>
    );
}
