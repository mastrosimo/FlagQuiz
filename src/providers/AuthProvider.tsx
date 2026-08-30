import { useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuthStore } from '../store/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

// Inizializza/aggiorna authStore in background: non blocca mai il render dei
// children (nessuno spinner, nessun redirect) per non alterare il comportamento
// guest esistente. Se Supabase non e' configurato, supabase e' null e questo
// provider non fa nulla: lo status resta 'guest' (impostato in authStore).
export function AuthProvider({ children }: AuthProviderProps) {
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, [setSession]);

  return <>{children}</>;
}
