import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { EmailOtpType, User } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

async function syncOAuthProfile(supabase: SupabaseClient, user: User) {
  try {
    const provider = user.app_metadata.provider;
    const providerData = user.user_metadata;
    
    // Prepare profile data from OAuth provider
    const profileUpdates: any = {};
    
    // Extract profile data based on provider
    if (provider === 'google') {
      if (providerData.full_name && !user.user_metadata.name) {
        profileUpdates.name = providerData.full_name;
      }
      if (providerData.picture && !user.user_metadata.profile_picture_url) {
        profileUpdates.profile_picture_url = providerData.picture;
      }
    } else if (provider === 'apple') {
      if (providerData.full_name && !user.user_metadata.name) {
        profileUpdates.name = providerData.full_name;
      }
    }
    
    // Update user metadata if we have new data
    if (Object.keys(profileUpdates).length > 0) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: profileUpdates
      });
      
      if (updateError) {
        console.error('Failed to sync OAuth profile:', updateError);
      } else {
        console.log('OAuth profile synced successfully:', profileUpdates);
      }
    }
    
    // Update user profile in database if it exists
    const { error: dbUpdateError } = await supabase
      .from('users')
      .update({
        name: profileUpdates.name || user.user_metadata.name,
        profile_picture_url: profileUpdates.profile_picture_url || user.user_metadata.profile_picture_url,
        last_sign_in_provider: provider,
        updated_at: new Date().toISOString()
      })
      .eq('auth_user_id', user.id);
      
    if (dbUpdateError) {
      console.error('Failed to update user profile in database:', dbUpdateError);
    }
  } catch (error) {
    console.error('Error syncing OAuth profile:', error);
  }
}

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
    
    // Check for account linking state
    const state = requestUrl.searchParams.get('state');
    const isAccountLinking = state?.startsWith('link_account:');
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Auth error:', error);
      
      // Handle account linking scenarios
      if (error.message?.includes('User already registered')) {
        // Extract email from error context if available
        const searchParams = new URLSearchParams();
        searchParams.set('error', 'account_exists');
        searchParams.set('message', 'An account with this email already exists. Please sign in with your password to link your accounts.');
        searchParams.set('provider', requestUrl.searchParams.get('provider') || '');
        return NextResponse.redirect(new URL(`/auth/signin?${searchParams.toString()}`, requestUrl.origin));
      }
      
      return NextResponse.redirect(new URL('/auth/auth-code-error', requestUrl.origin));
    }

    // Handle successful OAuth authentication
    if (data.user) {
      // Sync profile data from OAuth provider
      if (data.user.app_metadata.provider !== 'email') {
        await syncOAuthProfile(supabase, data.user);
      }
      
      // Handle account linking success
      if (isAccountLinking) {
        const searchParams = new URLSearchParams();
        searchParams.set('linked', 'true');
        searchParams.set('provider', data.user.app_metadata.provider || '');
        return NextResponse.redirect(new URL(`/dashboard?${searchParams.toString()}`, requestUrl.origin));
      }
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

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
}