import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ClerkProviderWrapper } from '@/components/providers/ClerkProviderWrapper';

const TITLE = "TirionApp — AI Automation Platform";
const DESCRIPTION = "The cinematic operating system for the AI-first agency. Deploy autonomous workflows in minutes. Connect your CRM, scale execution, and recover lost time.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["AI automation", "autonomous agency", "workflow orchestration", "AI agents", "business automation"],
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
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Software Application & FAQ JSON-LD for Generative Engine Optimization (GEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "TirionApp",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "299.00",
          "priceCurrency": "USD"
        },
        "description": DESCRIPTION
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does TirionApp integrate with our existing stack?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "TirionApp acts as an intelligence layer above your current tools. Using event-driven durable orchestration, you can connect to your existing CRM, ERP, and communication platforms (like Salesforce, Zendesk, and Slack) via standard API integrations without migrating your data."
            }
          },
          {
            "@type": "Question",
            "name": "Is our proprietary data used to train your models?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. We enforce strict enterprise data boundaries. Your data is routed through isolated, zero-retention API endpoints. We do not use any customer data, logs, or fine-tuning artifacts to train our base foundation models."
            }
          }
        ]
      }
    ]
  };

  return (
    <ClerkProviderWrapper>
      <html lang="en">
        <body className={`${GeistSans.variable} antialiased`}>
          {children}
          {/* Inject JSON-LD Scripts for SEO/GEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </body>
      </html>
    </ClerkProviderWrapper>
  );
}
