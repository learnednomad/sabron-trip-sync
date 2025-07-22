import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Auth routes - redirect if already authenticated
  if (req.nextUrl.pathname.match(/^\/(login|signup|forgot-password)/)) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // Protected routes - redirect if not authenticated
  if (req.nextUrl.pathname.match(/^\/(dashboard|itineraries|activities|bookings|profile|settings)/)) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
