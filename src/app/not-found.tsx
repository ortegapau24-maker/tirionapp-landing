import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[var(--color-agency-bg-dark)] flex flex-col items-center justify-center p-4">
            <div className="max-w-md text-center">
                <h1 className="text-[6rem] font-outfit font-bold text-[#0032A0] leading-none mb-4">404</h1>
                <h2 className="text-[2rem] font-bold text-agency-text-main mb-4">Page Not Found</h2>
                <p className="text-agency-text-muted mb-8 text-lg">
                    The page you are looking for doesn't exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[#0032A0] px-8 text-sm font-medium text-white transition-all hover:bg-[#002880] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}
