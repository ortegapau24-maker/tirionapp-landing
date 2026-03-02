'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

/**
 * ClerkProviderWrapper — only renders ClerkProvider when valid Clerk keys are present.
 * This prevents Clerk SDK from crashing in development without real API keys.
 */
export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider
            appearance={{
                variables: {
                    colorPrimary: '#000000', // Buttons are black
                    colorBackground: '#ffffff', // Card is white
                    colorText: '#111111', // Text is very dark gray/black
                    colorInputBackground: '#f4f4f5', // Inputs are light gray
                    colorInputText: '#111111', // Input text is black
                    borderRadius: '1rem', // Rounder corners for elements
                },
                elements: {
                    card: "bg-white border-none shadow-2xl rounded-3xl", // Pure white, no border, very rounded
                    headerTitle: "text-black font-semibold font-sans tracking-tight",
                    headerSubtitle: "text-zinc-500 font-sans",
                    socialButtonsBlockButton: "bg-white border border-zinc-200 hover:bg-zinc-50 text-black transition-all",
                    socialButtonsBlockButtonText: "text-black font-medium",
                    dividerLine: "bg-zinc-200",
                    dividerText: "text-zinc-400",
                    formFieldLabel: "text-zinc-700 font-medium",
                    formFieldInput: "bg-zinc-50 border-zinc-200 text-black focus:border-black focus:ring-black/5 transition-all",
                    formButtonPrimary: "bg-black hover:bg-zinc-800 text-white font-semibold shadow-sm transition-all",
                    footerActionText: "text-zinc-500",
                    footerActionLink: "text-black hover:text-zinc-700 font-medium transition-colors",
                    identityPreviewText: "text-zinc-700",
                    identityPreviewEditButtonIcon: "text-black",
                    watermark: "hidden"
                }
            }}
        >
            {children}
        </ClerkProvider>
    );
}
