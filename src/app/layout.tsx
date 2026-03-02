import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ClerkProviderWrapper } from '@/components/providers/ClerkProviderWrapper';

export const metadata: Metadata = {
  title: "TirionApp — AI Automation Platform",
  description: "The cinematic operating system for the AI-first agency. Deploy autonomous workflows in minutes.",
};

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const hasValidClerkKey = !!(clerkPubKey && clerkPubKey.startsWith('pk_') && !clerkPubKey.includes('placeholder'));

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const body = (
    <html lang="en" className="dark">
      <body className={`${GeistSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );

  if (ClerkProviderWrapper) {
    return (
      <ClerkProviderWrapper>
        {body}
      </ClerkProviderWrapper>
    );
  }

  return body;
}
