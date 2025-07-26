import { Button } from '@sabron/ui';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

const VerifyEmailPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Check your email</h2>
          <p className="text-base text-muted-foreground">
            We&apos;ve sent you a verification link to confirm your email address.
          </p>
        </div>

        <div className="space-y-4 rounded-lg bg-muted/50 p-6">
          <p className="text-sm text-muted-foreground">
            Please check your inbox and click the verification link to activate your account.
          </p>
          <p className="text-sm text-muted-foreground">
            If you don&apos;t see the email, check your spam folder.
          </p>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/login">Go to Login</Link>
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the email?{' '}
            <button className="font-medium text-primary hover:text-primary/80">
              Resend verification email
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;