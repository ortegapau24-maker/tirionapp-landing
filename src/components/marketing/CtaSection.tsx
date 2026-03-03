export function CtaSection() {
    return (
        <div className="h-screen flex flex-col items-center justify-center text-center bg-agency-bg-dark relative border-t border-agency-border-light">
            {/* Ambient Background Glow */}
            <div className="absolute w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,107,0,0.1)_0%,rgba(255,255,255,0)_70%)] filter blur-[60px] pointer-events-none" />

            <div className="z-10 flex flex-col items-center">
                <h2 className="text-[clamp(3.5rem,6vw,5.5rem)] font-outfit font-medium mb-8 text-agency-text-main leading-tight tracking-[-0.02em]">
                    Start automating. <br /> Stop operating.
                </h2>

                <a
                    href={process.env.NEXT_PUBLIC_APP_URL || 'https://app.tirionapp.com'}
                    className="inline-block px-12 py-6 bg-[#050505] text-white font-outfit font-medium text-[1.25rem] rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-105 hover:shadow-[0_16px_48px_rgba(0,0,0,0.2)]"
                >
                    Deploy Your First Agent
                </a>
            </div>
        </div>
    );
}
