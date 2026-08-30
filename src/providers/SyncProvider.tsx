import { useEffect, useRef, type ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import { handleSignIn, handleSignOut } from '../services/syncService';

interface SyncProviderProps {
  children: ReactNode;
}

// Osserva le transizioni di authStore e avvia/ferma la sincronizzazione di
// conseguenza. Separato da AuthProvider (che gestisce solo sessione/JWT) per
// non toccare quel codice gia' verificato: qui viviamo interamente sopra
// authStore, mai dentro le API di supabase.auth.
export function SyncProvider({ children }: SyncProviderProps) {
  const status = useAuthStore((state) => state.status);
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const previousUserId = useRef<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && userId && previousUserId.current !== userId) {
      previousUserId.current = userId;
      void handleSignIn(userId);
    } else if (status === 'guest' && previousUserId.current !== null) {
      previousUserId.current = null;
      handleSignOut();
    }
  }, [status, userId]);

  return <>{children}</>;
}
