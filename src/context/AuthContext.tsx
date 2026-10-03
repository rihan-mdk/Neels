'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

interface SignUpResult {
  error: Error | null;
  user?: User | null;
  session?: Session | null;
  requiresConfirmation?: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  isGuest: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<SignUpResult>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    // Check initial guest status
    if (typeof window !== 'undefined') {
      const visited = localStorage.getItem('neelsh_visited');
      if (visited === 'true') {
        setIsGuest(true);
      }
    }

    if (!configured) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) {
        localStorage.setItem('neelsh_visited', 'true');
        localStorage.setItem('neelsh_user', JSON.stringify({ email: session.user.email, loggedIn: true }));
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) {
        localStorage.setItem('neelsh_visited', 'true');
        localStorage.setItem('neelsh_user', JSON.stringify({ email: session.user.email, loggedIn: true }));
      } else {
        localStorage.removeItem('neelsh_user');
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [configured]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!configured) {
      return { error: new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local') };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.session) {
      localStorage.setItem('neelsh_visited', 'true');
      localStorage.setItem('neelsh_user', JSON.stringify({ email: data.session.user.email, loggedIn: true }));
    }
    return { error };
  }, [configured]);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    if (!configured) {
      return {
        error: new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'),
      };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (!error) {
      localStorage.setItem('neelsh_visited', 'true');
      if (data.session) {
        localStorage.setItem('neelsh_user', JSON.stringify({ email: data.user?.email, name: fullName, loggedIn: true }));
      }
    }

    return {
      error,
      user: data.user,
      session: data.session,
      requiresConfirmation: Boolean(data.user && !data.session),
    };
  }, [configured]);

  const resetPassword = useCallback(async (email: string) => {
    if (!configured) {
      return { error: new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local') };
    }
    const location = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location}/login`,
    });
    return { error };
  }, [configured]);

  const signInWithGoogle = useCallback(async () => {
    if (!configured) {
      return { error: new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local') };
    }
    const location = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location}/`,
      },
    });
    return { error };
  }, [configured]);

  const signOut = useCallback(async () => {
    if (configured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('neelsh_user');
    }
  }, [configured]);

  const continueAsGuest = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('neelsh_visited', 'true');
    }
    setIsGuest(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: configured,
        isGuest,
        signIn,
        signUp,
        resetPassword,
        signInWithGoogle,
        signOut,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
