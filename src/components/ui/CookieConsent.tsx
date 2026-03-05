"use client";

import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";

interface ConsentPreferences {
    essential: boolean; // Always true
    analytics: boolean;
    marketing: boolean;
}

export function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [consent, setConsent] = useState<ConsentPreferences | null>(null);

    // Preference toggles
    const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
    const [marketingEnabled, setMarketingEnabled] = useState(false);

    useEffect(() => {
        // Check if consent exists in local storage
        const storedConsent = localStorage.getItem("tirionapp_cookie_consent");
        if (storedConsent) {
            try {
                const parsed = JSON.parse(storedConsent);
                setConsent(parsed);
                setAnalyticsEnabled(parsed.analytics);
                setMarketingEnabled(parsed.marketing);
            } catch (e) {
                setShowBanner(true);
            }
        } else {
            // Show banner if no consent is found
            setShowBanner(true);
        }
    }, []);

    const saveConsent = (preferences: ConsentPreferences) => {
        localStorage.setItem("tirionapp_cookie_consent", JSON.stringify(preferences));
        setConsent(preferences);
        setShowBanner(false);
        setShowPreferences(false);
    };

    const handleAcceptAll = () => {
        saveConsent({ essential: true, analytics: true, marketing: true });
    };

    const handleRejectNonEssential = () => {
        saveConsent({ essential: true, analytics: false, marketing: false });
    };

    const handleSavePreferences = () => {
        saveConsent({ essential: true, analytics: analyticsEnabled, marketing: marketingEnabled });
    };

    return (
        <>
            {/* Conditionally render Vercel Analytics based on consent */}
            {consent?.analytics && <Analytics />}

            {/* Main Banner */}
            {showBanner && !showPreferences && (
                <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-[#F1F3F5] rounded-t-[32px] border-t border-black/[0.05] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-full duration-500">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-agency-text-main font-outfit mb-1">We value your privacy</h3>
                            <p className="text-sm text-agency-text-muted">
                                We use cookies to enhance your browsing experience and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0 mt-4 md:mt-0">
                            <button
                                onClick={() => setShowPreferences(true)}
                                className="px-4 py-2.5 sm:py-2 text-sm font-medium text-agency-text-main hover:bg-black/[0.05] rounded-[100px] transition-colors cursor-pointer"
                            >
                                Manage Preferences
                            </button>
                            <button
                                onClick={handleRejectNonEssential}
                                className="px-4 py-2.5 sm:py-2 text-sm font-medium text-agency-text-main border border-black/[0.1] hover:bg-black/[0.05] rounded-[100px] transition-colors cursor-pointer"
                            >
                                Reject Non-Essential
                            </button>
                            <button
                                onClick={handleAcceptAll}
                                className="px-6 py-2.5 sm:py-2 text-sm font-medium text-white bg-[#0032A0] hover:bg-[#002880] rounded-[100px] shadow-sm transition-all cursor-pointer"
                            >
                                Accept All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preferences Modal */}
            {showPreferences && (
                <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#F1F3F5] rounded-[32px] shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                            <h2 className="text-2xl font-bold text-agency-text-main font-outfit mb-2">Cookie Preferences</h2>
                            <p className="text-agency-text-muted mb-8 text-sm">
                                Choose which cookies you allow us to use. You can change your preferences at any time by clearing your browser cookies.
                            </p>

                            <div className="space-y-6">
                                {/* Essential */}
                                <div className="flex items-start justify-between gap-4 pb-6 border-b border-black/[0.08]">
                                    <div>
                                        <h4 className="font-semibold text-agency-text-main">Essential (Required)</h4>
                                        <p className="text-sm text-agency-text-muted mt-1">Necessary for the website to function properly. Cannot be disabled.</p>
                                    </div>
                                    <div className="relative inline-flex items-center cursor-not-allowed">
                                        <div className="w-11 h-6 bg-[#0032A0] rounded-full opacity-50 relative">
                                            <div className="absolute top-[2px] left-[22px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform" />
                                        </div>
                                    </div>
                                </div>

                                {/* Analytics */}
                                <div className="flex items-start justify-between gap-4 pb-6 border-b border-black/[0.08]">
                                    <div>
                                        <h4 className="font-semibold text-agency-text-main">Analytics</h4>
                                        <p className="text-sm text-agency-text-muted mt-1">Help us improve our website by allowing us to track anonymized usage data.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={analyticsEnabled}
                                            onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0032A0]"></div>
                                    </label>
                                </div>

                                {/* Marketing */}
                                <div className="flex items-start justify-between gap-4 pb-2">
                                    <div>
                                        <h4 className="font-semibold text-agency-text-main">Marketing</h4>
                                        <p className="text-sm text-agency-text-muted mt-1">Enable conversion tracking and remarketing to help us show you relevant content across the web.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={marketingEnabled}
                                            onChange={(e) => setMarketingEnabled(e.target.checked)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0032A0]"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="p-6 md:px-8 md:py-6 border-t border-black/[0.08] bg-black/[0.02] rounded-b-[32px]">
                            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end items-center">
                                <button
                                    onClick={() => setShowPreferences(false)}
                                    className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-agency-text-main hover:bg-black/[0.05] rounded-[100px] transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSavePreferences}
                                    className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-[#0032A0] hover:bg-[#002880] rounded-[100px] shadow-sm transition-all cursor-pointer"
                                >
                                    Save Preferences
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
