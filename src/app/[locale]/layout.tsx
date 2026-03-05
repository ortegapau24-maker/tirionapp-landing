import { GeistSans } from "geist/font/sans";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import "@/app/globals.css";

const TITLE = "TirionApp — AI Automation for Service Businesses";
const DESCRIPTION = "Deploy autonomous AI agents that handle calls, recover leads, and run your business 24/7. Start free — no credit card required.";

export const metadata: Metadata = {
    metadataBase: new URL("https://www.tirionapp.com"),
    title: TITLE,
    description: DESCRIPTION,
    keywords: ["AI automation", "business automation", "AI agents", "call center AI", "lead recovery", "workflow automation", "service business"],
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: "https://www.tirionapp.com",
        siteName: "TirionApp",
        images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DESCRIPTION,
        images: ["/images/og-image.jpg"],
    },
    alternates: {
        canonical: "https://www.tirionapp.com",
        languages: {
            "en": "https://www.tirionapp.com/en",
            "es": "https://www.tirionapp.com/es"
        }
    }
};

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;

    // Validate locale
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages();

    // JSON-LD for SEO/GEO
    const DESCRIPTION = "Deploy autonomous AI agents that handle calls, recover leads, and run your business 24/7. Start free — no credit card required.";

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "SoftwareApplication",
                "name": "TirionApp",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "All",
                "offers": [
                    {
                        "@type": "Offer",
                        "name": "Free Trial",
                        "price": "0",
                        "priceCurrency": "USD",
                        "description": "14-day free trial with 200 credits and 1 active automation"
                    },
                    {
                        "@type": "Offer",
                        "name": "Starter",
                        "price": "149.00",
                        "priceCurrency": "USD"
                    },
                    {
                        "@type": "Offer",
                        "name": "Growth",
                        "price": "299.00",
                        "priceCurrency": "USD"
                    },
                    {
                        "@type": "Offer",
                        "name": "Scale",
                        "price": "599.00",
                        "priceCurrency": "USD"
                    }
                ],
                "description": DESCRIPTION
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "How does TirionApp work with the tools I already use?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "TirionApp connects to your existing CRM, email, calendar, and communication platforms through standard integrations. You don't need to migrate anything."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Is my business data safe?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes. Your data is encrypted at every step and never shared with anyone. We don't use your data to train our AI models."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What happens if an automation doesn't know how to handle something?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "It stops immediately and sends you a notification with full context. You're always in control."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How quickly can I get started?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Most businesses have their first automation running within 48 hours."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What is a credit and how much do they cost?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "1 credit = 1 AI workflow execution. Processing an email, qualifying a lead, or handling a phone call each uses 1 credit."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Is there a free trial?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes! 14 days free with 200 credits and 1 active automation — no credit card required."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Am I locked into a specific AI provider?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "No. TirionApp automatically uses the best AI model for each task."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Can I use TirionApp if I have a larger team or enterprise needs?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Absolutely. Our Scale plan includes dedicated infrastructure, unlimited automations, and priority support."
                        }
                    }
                ]
            },
            {
                "@type": "HowTo",
                "name": "How to automate your business with TirionApp",
                "step": [
                    { "@type": "HowToStep", "name": "Audit Revenue Leaks", "text": "We connect to your existing tools and calculate exactly where you're losing hours and revenue." },
                    { "@type": "HowToStep", "name": "Tell Us What You Need", "text": "Describe what you need in plain English. Our AI interviews you and builds the solution." },
                    { "@type": "HowToStep", "name": "Test Everything First", "text": "Your automations run through sandbox simulations. Review results and deploy with one click." },
                    { "@type": "HowToStep", "name": "Your Business Runs Itself", "text": "Automations handle calls, qualify leads, and send daily summaries while operating 24/7." }
                ]
            }
        ]
    };

    return (
        <html lang={locale}>
            <body className={`${GeistSans.variable} antialiased`}>
                <NextIntlClientProvider messages={messages}>
                    {children}
                </NextIntlClientProvider>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </body>
        </html>
    );
}
