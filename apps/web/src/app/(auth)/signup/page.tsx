import { SignupForm } from '@/features/auth/components/SignupForm';

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Create your account</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Start planning your perfect trip today
        </p>
      </div>
      <SignupForm />
    </div>
  );
}
