import { Button } from '@sabron/ui';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

const AuthCodeErrorPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-sm">
        <div className="text-center">
          <AlertCircle className="mx-auto size-12 text-destructive" />
          <h1 className="mt-4 text-2xl font-semibold text-foreground">
            Authentication Error
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            There was an error processing your authentication request. This could be due to an expired or invalid link.
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/login">
              Try signing in again
            </Link>
          </Button>

          <Button asChild variant="outline" className="w-full">
            <Link href="/signup">
              Create a new account
            </Link>
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          If you continue to have issues, please contact support.
        </p>
      </div>
    </div>
  );
};

export default AuthCodeErrorPage;