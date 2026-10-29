import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface Auth {
  /** false si Supabase no está configurado */
  available: boolean;
  user: User | null;
  loading: boolean;
  /** Motivo por el que falló el último inicio de sesión */
  authError: string | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<Auth | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    // Si Google o Supabase rechazan el inicio de sesión, el motivo llega en la URL de regreso
    const params = new URLSearchParams(window.location.search + '&' + window.location.hash.slice(1));
    const urlError = params.get('error_description') || params.get('error');
    if (urlError) {
      console.error('[auth] error al volver del login:', Object.fromEntries(params));
      setAuthError(urlError.replace(/\+/g, ' '));
    }
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error('[auth] getSession:', error);
        setAuthError(error.message);
      }
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  const value: Auth = {
    available: Boolean(supabase),
    user,
    loading,
    authError,
    clearAuthError: () => setAuthError(null),
    signInWithGoogle: async () => {
      setAuthError(null);
      const { error } = (await supabase?.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })) ?? {};
      if (error) setAuthError(error.message);
    },
    signOut: async () => {
      await supabase?.auth.signOut();
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth fuera de AuthProvider');
  return c;
}
