import { HeroSection } from "@/components/marketing/HeroSection";
import { BentoGrid } from '@/components/marketing/BentoGrid'
import { WorkflowLibrary } from '@/components/marketing/WorkflowLibrary'
import { AgentGenerator } from '@/components/marketing/AgentGenerator'
import { IntegrationSphere } from '@/components/marketing/IntegrationSphere'
import { ExecutiveTeam } from "@/components/marketing/ExecutiveTeam";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Pricing } from "@/components/marketing/Pricing";
import { FAQs } from "@/components/marketing/FAQs";

export default function MarketingPage() {
    return (
        <main className="flex flex-col w-full bg-agency-bg-dark min-h-screen">
            {/* --- Hero Section (with embedded cube) --- */}
            <HeroSection />

            {/* --- Bento Feature Grid --- */}
            <BentoGrid />

            {/* --- Workflow Automation Library --- */}
            <WorkflowLibrary />

            {/* --- Native Integrations Morphing Sphere (below library) --- */}
            <IntegrationSphere />

            {/* --- Agent Generator / Workflow Simulation --- */}
            <AgentGenerator />

            {/* --- The Autonomous Executive Team --- */}
            <ExecutiveTeam />

            {/* --- How It Works (Vertical Scrolly Telling) --- */}
            <HowItWorks />

            {/* --- Pricing --- */}
            <Pricing />

            {/* --- FAQs (below Pricing) --- */}
            <FAQs />
        </main>
    );
}
