import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null;
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';
  const code = requestUrl.searchParams.get('code');

  // Handle PKCE flow (OAuth providers)
  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Auth error:', error);
      return NextResponse.redirect(new URL('/auth/auth-code-error', requestUrl.origin));
    }
    
    return NextResponse.redirect(new URL(next, requestUrl.origin));
  }

  // Handle email verification and password reset
  if (token_hash && type) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      console.error('Email verification error:', error);
      return NextResponse.redirect(new URL('/auth/auth-code-error', requestUrl.origin));
    }

    // Redirect based on type
    if (type === 'signup') {
      return NextResponse.redirect(new URL('/dashboard?verified=true', requestUrl.origin));
    }
    
    if (type === 'recovery') {
      return NextResponse.redirect(new URL('/reset-password', requestUrl.origin));
    }
  }

  // Default redirect
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
}