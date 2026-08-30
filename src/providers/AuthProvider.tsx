import { useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuthStore } from '../store/authStore';
import { getProfile } from '../services/accountService';

interface AuthProviderProps {
  children: ReactNode;
}

// Inizializza/aggiorna authStore in background: non blocca mai il render dei
// children (nessuno spinner, nessun redirect) per non alterare il comportamento
// guest esistente. Se Supabase non e' configurato, supabase e' null e questo
// provider non fa nulla: lo status resta 'guest' (impostato in authStore).
export function AuthProvider({ children }: AuthProviderProps) {
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const setSession = useAuthStore((state) => state.setSession);
  const setProfile = useAuthStore((state) => state.setProfile);

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

  // Riletto ad ogni cambio di utente (login/logout/switch account): tiene
  // display_name e lock allineati per navbar e pagina Account.
  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }
    let cancelled = false;
    getProfile(userId).then((profile) => {
      if (!cancelled) setProfile(profile);
    });
    return () => {
      cancelled = true;
    };
  }, [userId, setProfile]);

  return <>{children}</>;
}
