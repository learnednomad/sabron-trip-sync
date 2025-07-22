import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

import { supabase } from '../supabase';
import { createSelectors } from '../utils';

interface AuthState {
  session: Session | null;
  user: User | null;
  status: 'idle' | 'loading' | 'signIn' | 'signOut';
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
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
  (set: any, get: any) => async (email: string, password: string) => {
    set({ status: 'loading', error: null });
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      set({ error: error.message, status: 'signOut' });
      throw error;
    } else {
      get().setSession(data.session);
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
export const signUp = (email: string, password: string) =>
  _useAuth.getState().signUp(email, password);
export const hydrateAuth = () => _useAuth.getState().hydrate();
