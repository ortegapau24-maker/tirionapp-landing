import dynamic from 'next/dynamic';
import { HeroSection } from "@/components/marketing/HeroSection";

// Defer below-the-fold sections
const BentoGrid = dynamic(() => import('@/components/marketing/BentoGrid').then(mod => mod.BentoGrid));
const WorkflowLibrary = dynamic(() => import('@/components/marketing/WorkflowLibrary').then(mod => mod.WorkflowLibrary));
const IntegrationSphere = dynamic(() => import('@/components/marketing/IntegrationSphereWrapper').then(mod => mod.IntegrationSphere));
const AgentGenerator = dynamic(() => import('@/components/marketing/AgentGenerator').then(mod => mod.AgentGenerator));
const ExecutiveTeam = dynamic(() => import('@/components/marketing/ExecutiveTeam').then(mod => mod.ExecutiveTeam));
const HowItWorks = dynamic(() => import('@/components/marketing/HowItWorks').then(mod => mod.HowItWorks));
const Pricing = dynamic(() => import('@/components/marketing/Pricing').then(mod => mod.Pricing));
const FAQs = dynamic(() => import('@/components/marketing/FAQs').then(mod => mod.FAQs));

export default function MarketingPage() {
    return (
        <div className="flex flex-col w-full bg-agency-bg-dark min-h-screen">
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
        </div>
    );
}
