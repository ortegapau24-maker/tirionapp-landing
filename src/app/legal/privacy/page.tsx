export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[var(--color-agency-bg-surface)] py-20 px-4 md:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[24px] shadow-sm border border-black/[0.04]">
                <h1 className="text-3xl md:text-5xl font-bold font-outfit text-agency-text-main mb-8">Privacy Policy</h1>

                <div className="prose prose-lg text-agency-text-muted">
                    <p className="mb-4">Last updated: March 2026</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">1. Information We Collect</h2>
                    <p className="mb-4">We collect information you provide directly to us when you use our services, create an account, or contact us for support.</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">2. How We Use Your Data</h2>
                    <p className="mb-4">We use the information we collect to provide, maintain, and improve our services. We do NOT use your proprietary business data or automation workflows to train our AI foundation models.</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">3. Data Security</h2>
                    <p className="mb-4">We implement appropriate technical and organizational security measures to protect your information against unauthorized access, alteration, disclosure, or destruction.</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">4. Third-Party Services</h2>
                    <p className="mb-4">Our application integrates with third-party tools (like CRM systems) via API. We only access the data necessary to execute your defined workflows.</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">5. Contact Us</h2>
                    <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at <a href="mailto:hello@tirionapp.com" className="text-[#0032A0] hover:underline">hello@tirionapp.com</a>.</p>
                </div>
            </div>
        </div>
    );
}
