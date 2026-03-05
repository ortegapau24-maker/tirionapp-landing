export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-[var(--color-agency-bg-surface)] py-20 px-4 md:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-[24px] shadow-sm border border-black/[0.04]">
                <h1 className="text-3xl md:text-5xl font-bold font-outfit text-agency-text-main mb-8">Terms of Service</h1>

                <div className="prose prose-lg text-agency-text-muted">
                    <p className="mb-4">Last updated: March 2026</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p className="mb-4">By creating an account, accessing, or using TirionApp ("the Service"), you agree to be bound by these Terms of Service. If you are entering into these Terms on behalf of a company or other legal entity, you represent that you have the authority to bind such entity to these Terms.</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">2. Description of Service</h2>
                    <p className="mb-4">TirionApp provides AI-powered business orchestration and workflow generation tools. The Service allows users to build, deploy, and monitor automated operations connected to third-party APIs. We provide the infrastructure for automation, but you are solely responsible for the integrations configured within your account.</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">3. User Obligations and Security</h2>
                    <p className="mb-4">You are responsible for maintaining the confidentiality of your account credentials and any connected API keys. You agree not to share your account or use third-party tools to bypass our access controls. You must immediately notify us of any unauthorized use of your account.</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">4. Acceptable Use Policy</h2>
                    <p className="mb-4">You agree to use the Service only for lawful purposes. You explicitly agree <strong>not</strong> to use our automation infrastructure to:</p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>Generate, distribute, or orchestrate illegal, harmful, or abusive content.</li>
                        <li>Intentionally overload or perform Denial of Service (DoS) attacks on third-party APIs.</li>
                        <li>Violate the Terms of Service of any third-party platform you connect to TirionApp.</li>
                        <li>Engage in scraping data without authorization or distributing malware.</li>
                    </ul>
                    <p className="mb-4">We reserve the right to immediately suspend or terminate accounts found violating this policy, without refund.</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">5. Subscriptions, Credits, and Payments</h2>
                    <p className="mb-4">TirionApp operates on a subscription and credit-based model. Subscriptions are billed in advance on a recurring basis. All fees are exclusive of taxes. TirionApp reserves the right to adjust pricing models and credit consumption rates with a 30-day notice.</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">6. API Usage and Fair Use</h2>
                    <p className="mb-4">We implement rate limits to ensure platform stability. If your workflows repeatedly hit internal or external rate limits, or consume disproportionate infrastructure resources, we may throttle your executions or require you to upgrade to a dedicated infrastructure tier.</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">7. Disclaimer of Liability</h2>
                    <p className="mb-4">The Service is provided on an "AS IS" and "AS AVAILABLE" basis. <strong>TirionApp acts solely as an execution layer and aggregator. We shall not be held liable for any downstream damages, revenue loss, data corruption, or third-party penalties resulting from automated workflows executed through our platform.</strong> It is your responsibility to test all orchestrations in a sandbox environment before deploying to production.</p>

                    <h2 className="text-2xl font-bold text-agency-text-main mt-8 mb-4">8. Data Processing Addendum (DPA)</h2>
                    <p className="mb-4">For B2B customers subject to the GDPR or CCPA, our standard Data Processing Addendum is incorporated into these Terms by reference. By using our service, you agree to the terms outlined in our Privacy Policy and DPA.</p>
                </div>
            </div>
        </div>
    );
}
