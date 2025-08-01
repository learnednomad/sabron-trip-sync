import type { Session, User, Provider } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { create } from 'zustand';

import { supabase } from '../supabase';
import { createSelectors } from '../utils';

interface AuthState {
  session: Session | null;
  user: User | null;
  status: 'idle' | 'loading' | 'signIn' | 'signOut';
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signInWithProvider: (provider: Provider) => Promise<void>;
  signOut: () => Promise<void>;
  setSession: (session: Session | null) => void;
  hydrate: () => Promise<void>;
}

const createSignInMethod =
  (set: any, get: any) => async (email: string, password: string) => {
    set({ status: 'loading', error: null });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ error: error.message, status: 'signOut' });
      throw error;
    } else {
      get().setSession(data.session);
    }
  };

const createSignUpMethod =
  (set: any, get: any) => async (email: string, password: string, name?: string) => {
    set({ status: 'loading', error: null });
    
    // Create deep link for email verification
    const redirectTo = Linking.createURL('/auth-callback');
    
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { name },
        emailRedirectTo: redirectTo,
      }
    });

    if (error) {
      set({ error: error.message, status: 'signOut' });
      throw error;
    } else {
      // For email confirmation flow, don't set session immediately
      // User will need to verify email first
      if (!data.session && data.user && !data.user.email_confirmed_at) {
        set({ status: 'signOut', error: null });
        // Show success message that email verification is required
      } else {
        get().setSession(data.session);
      }
    }
  };

const createSignInWithProviderMethod = 
  (set: any, get: any) => async (provider: Provider) => {
    try {
      set({ status: 'loading', error: null });

      // Check if user is already signed in to offer account linking
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      // Use Supabase's OAuth with deep linking
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: Linking.createURL('/auth-callback'),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            // Pass current user ID for potential account linking
            ...(currentUser && { state: `link_account:${currentUser.id}` }),
          },
        },
      });

      if (error) {
        // Handle specific error cases for better UX
        let errorMessage = error.message;
        
        if (error.message?.includes('User already registered')) {
          errorMessage = 'An account with this email already exists. Please sign in with your password first, then link your social accounts from your profile settings.';
        } else if (error.message?.includes('account_exists')) {
          errorMessage = 'An account with this email already exists. Please sign in with your password to link your accounts.';
        }
        
        set({ error: errorMessage, status: 'signOut' });
        throw new Error(errorMessage);
      }

      // For mobile OAuth, Supabase should handle the session automatically
      // The auth state listener will pick up the session change
      console.log('OAuth flow initiated for provider:', provider);
    } catch (error: any) {
      const errorMessage = error.message || 'Social login failed';
      set({ error: errorMessage, status: 'signOut' });
      throw error;
    }
  };

const createSignOutMethod = (set: any, get: any) => async () => {
  set({ status: 'loading', error: null });
  const { error } = await supabase.auth.signOut();

  if (error) {
    set({ error: error.message, status: get().status });
    throw error;
  } else {
    get().setSession(null);
  }
};

const createHydrateMethod = (set: any, get: any) => async () => {
  set({ status: 'loading' });
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error('Error hydrating auth store:', error);
    set({ error: error.message, status: 'signOut' });
  } else {
    get().setSession(session);
  }
};

const _useAuth = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  status: 'idle',
  error: null,

  setSession: (session) => {
    set({
      session,
      user: session?.user || null,
      status: session ? 'signIn' : 'signOut',
      error: null,
    });
  },

  signIn: createSignInMethod(set, get),
  signUp: createSignUpMethod(set, get),
  signInWithProvider: createSignInWithProviderMethod(set, get),
  signOut: createSignOutMethod(set, get),
  hydrate: createHydrateMethod(set, get),
}));

// Listen for Supabase auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase Auth Event:', event);
  _useAuth.getState().setSession(session);
});

export const useAuth = createSelectors(_useAuth);

// Convenience functions
export const signOut = () => _useAuth.getState().signOut();
export const signIn = (email: string, password: string) =>
  _useAuth.getState().signIn(email, password);
export const signUp = (email: string, password: string, name?: string) =>
  _useAuth.getState().signUp(email, password, name);
export const signInWithProvider = (provider: Provider) =>
  _useAuth.getState().signInWithProvider(provider);
export const hydrateAuth = () => _useAuth.getState().hydrate();
