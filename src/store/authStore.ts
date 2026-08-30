import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export type AuthStatus = 'loading' | 'authenticated' | 'guest';

interface AuthState {
  status: AuthStatus;
  session: Session | null;
  user: User | null;
  setSession: (session: Session | null) => void;
}

// Store volatile (nessun persist middleware): la sessione Supabase viene gia'
// persistita e ripristinata dal client stesso (@supabase/supabase-js gestisce
// il proprio storage), qui teniamo solo lo stato derivato per l'app.
// - 'loading': Supabase e' configurato ma la sessione iniziale non e' ancora nota
// - 'guest': nessuna sessione (o Supabase non configurato) -> comportamento invariato
// - 'authenticated': sessione valida
export const useAuthStore = create<AuthState>()((set) => ({
  status: isSupabaseConfigured ? 'loading' : 'guest',
  session: null,
  user: null,
  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
      status: session ? 'authenticated' : 'guest',
    }),
}));
