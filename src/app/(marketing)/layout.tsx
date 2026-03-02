'use client';

import { ReactLenis } from 'lenis/react';
import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ReactLenis root>
            <SmoothScrollProvider>
                <div className="flex flex-col min-h-screen bg-agency-bg-dark text-agency-text-main font-inter">
                    <Navbar />
                    <main className="flex-1">
                        {children}
                    </main>
                    <Footer />
                </div>
            </SmoothScrollProvider>
        </ReactLenis>
    );
}
