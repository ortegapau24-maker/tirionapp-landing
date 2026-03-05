export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-[var(--color-agency-bg-surface)] py-20 px-4 md:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[24px] shadow-sm border border-black/[0.04]">
                <h1 className="text-3xl md:text-5xl font-bold font-outfit text-agency-text-main mb-8">Terms of Service</h1>

                <div className="prose prose-lg text-agency-text-muted">
                    <p className="mb-4">Last updated: March 2026</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p className="mb-4">By accessing or using TirionApp, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you do not have permission to access the Service.</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">2. Description of Service</h2>
                    <p className="mb-4">TirionApp provides AI-powered business orchestration and workflow generation tools. The Service allows users to build, deploy, and monitor automated operations connected to third-party APIs.</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">3. Subscriptions and Payments</h2>
                    <p className="mb-4">Some aspects of the Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis (such as monthly or annually), depending on the type of Subscription plan you select.</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">4. Acceptable Use Policy</h2>
                    <p className="mb-4">You agree not to use the Service in any way that violates any applicable national or international law or regulation. You must not use our AI endpoints to generate illegal content or orchestrate destructive actions on third-party platforms.</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">5. Disclaimer of Liability</h2>
                    <p className="mb-4">The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We shall not be held liable for any data loss, revenue loss, or downstream damages caused by automated workflows executed through our platform.</p>
                </div>
            </div>
        </div>
    );
}
