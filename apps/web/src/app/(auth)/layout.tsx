import Link from 'next/link';
import { Plane } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Plane className="h-10 w-10 text-blue-600" />
              <span className="text-2xl font-bold">Sabron Trip Sync</span>
            </Link>
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Not a member?{' '}
              <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-500">
                Start your free trial
              </Link>
            </p>
          </div>

          <div className="mt-10">
            {children}
          </div>
        </div>
      </div>

      {/* Right side - Image/Pattern */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400">
          <svg
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 1664 1664"
          >
            <defs>
              <pattern
                id="auth-pattern"
                x="0"
                y="0"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="40" cy="40" r="2" fill="white" fillOpacity="0.1" />
              </pattern>
            </defs>
            <rect width="1664" height="1664" fill="url(#auth-pattern)" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="max-w-md text-center">
              <h3 className="text-3xl font-bold text-white">Plan your perfect journey</h3>
              <p className="mt-4 text-lg text-white/90">
                Join thousands of travelers who trust Sabron Trip Sync to organize their adventures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
