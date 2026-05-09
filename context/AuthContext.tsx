/*
  AuthContext — Global Authentication Provider

  IMPORTANT: For login to work without email verification, you MUST disable
  email confirmation in your Supabase project:
    Dashboard → Authentication → Settings → Email Auth → uncheck "Enable email confirmations"

  If email confirmation is enabled, signUp will return a user but NO session,
  and the UI will show a "check your email" state instead of auto-redirecting.
*/
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { AuthError } from '@supabase/supabase-js';
import type { Profile } from '@/types';

interface SessionLike {
  user: AuthUser | null;
}

interface AuthUser {
  id: string;
  email: string | null;
  full_name?: string | null;
}

interface SignUpResult {
  user: AuthUser | null;
  session: SessionLike | null;
  needsEmailConfirmation: boolean;
  error: AuthError | null;
}

interface SignInResult {
  session: SessionLike | null;
  error: AuthError | null;
  emailNotConfirmed: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  session: SessionLike | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<SignUpResult>;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<SessionLike | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/session', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user ?? null);
        setSession(data.user ? { user: data.user } : null);
        setProfile(data.profile ?? null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, fullName: string): Promise<SignUpResult> => {
      const res = await fetch('/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      });
      const data = await res.json();
      if (!res.ok) {
        return {
          user: null,
          session: null,
          needsEmailConfirmation: false,
          error: { message: data.error || 'Unable to create account.' } as AuthError,
        };
      }

      setUser(data.user ?? null);
      setSession(data.user ? { user: data.user } : null);
      setProfile(data.profile ?? null);

      return {
        user: data.user ?? null,
        session: data.user ? { user: data.user } : null,
        needsEmailConfirmation: false,
        error: null,
      };
    },
    []
  );

  const signIn = useCallback(
    async (email: string, password: string): Promise<SignInResult> => {
      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return {
          session: null,
          error: { message: data.error || 'Unable to sign in.' } as AuthError,
          emailNotConfirmed: false,
        };
      }

      setUser(data.user ?? null);
      setSession(data.user ? { user: data.user } : null);
      setProfile(data.profile ?? null);

      return {
        session: data.user ? { user: data.user } : null,
        error: null,
        emailNotConfirmed: false,
      };
    },
    []
  );

  const signOut = useCallback(async () => {
    await fetch('/api/auth/sign-out', { method: 'POST' });
    setUser(null);
    setSession(null);
    setProfile(null);
  }, []);

  const resendConfirmation = useCallback(async () => {
    return {
      error: { message: 'Email confirmation is not enabled in this auth flow.' } as AuthError,
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, session, profile, loading, signUp, signIn, signOut, resendConfirmation }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
