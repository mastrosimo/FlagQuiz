import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Solo l'anon key (protetta dalle RLS policy) puo' comparire qui: qualsiasi
// variabile con prefisso VITE_ finisce nel bundle JS pubblico. La service_role
// key non va mai referenziata da questo progetto lato client.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// null quando le env var non sono configurate (es. ambiente locale senza
// .env.local): l'app deve restare pienamente utilizzabile in modalita' guest.
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;
