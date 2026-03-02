import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="flex flex-col items-center gap-8">
                <SignUp
                    afterSignUpUrl="/signup/checkout"
                    signInUrl="/sign-in"
                />
            </div>
        </div>
    );
}
