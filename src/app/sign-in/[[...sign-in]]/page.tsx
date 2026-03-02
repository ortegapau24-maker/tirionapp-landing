import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="flex flex-col items-center gap-8">
                <SignIn
                    afterSignInUrl="/app/dashboard"
                    signUpUrl="/sign-up"
                />
            </div>
        </div>
    );
}
