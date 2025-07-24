'use client';

import * as Sentry from '@sentry/nextjs';
import NextError from 'next/error';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="max-w-md w-full space-y-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Something went wrong!
            </h2>
            <p className="text-gray-600">
              We apologize for the inconvenience. The error has been reported to our team.
            </p>
            {error.digest && (
              <p className="text-sm text-gray-500">
                Error ID: <code className="font-mono">{error.digest}</code>
              </p>
            )}
            <button
              onClick={reset}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try again
            </button>
          </div>
        </div>
        <NextError statusCode={undefined as any} />
      </body>
    </html>
  );
}