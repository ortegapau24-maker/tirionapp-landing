"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const GTM_ID = "GTM-56J5J3P7";

export function GtmScript() {
    const [marketingConsent, setMarketingConsent] = useState(false);

    useEffect(() => {
        const storedConsent = localStorage.getItem("tirionapp_cookie_consent");
        if (storedConsent) {
            try {
                const parsed = JSON.parse(storedConsent);
                setMarketingConsent(parsed.marketing === true);
            } catch {
                // No valid consent found
            }
        }

        // Listen for consent changes (e.g. user updates preferences)
        const handleStorage = (e: StorageEvent) => {
            if (e.key === "tirionapp_cookie_consent" && e.newValue) {
                try {
                    const parsed = JSON.parse(e.newValue);
                    setMarketingConsent(parsed.marketing === true);
                } catch {
                    // ignore
                }
            }
        };
        window.addEventListener("storage", handleStorage);

        // Also poll for same-tab changes (localStorage events don't fire in the same tab)
        const interval = setInterval(() => {
            const current = localStorage.getItem("tirionapp_cookie_consent");
            if (current) {
                try {
                    const parsed = JSON.parse(current);
                    setMarketingConsent(parsed.marketing === true);
                } catch {
                    // ignore
                }
            }
        }, 1000);

        return () => {
            window.removeEventListener("storage", handleStorage);
            clearInterval(interval);
        };
    }, []);

    if (!marketingConsent) return null;

    return (
        <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
            }}
        />
    );
}
