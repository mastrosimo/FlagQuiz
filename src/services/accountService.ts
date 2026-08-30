import { supabase } from '../lib/supabaseClient';
import type { TranslationKey } from '../i18n/types';

export interface ServiceResult {
  errorKey: TranslationKey | null;
}

function serviceUnavailable(): ServiceResult {
  return { errorKey: 'auth.errors.serviceUnavailable' };
}

export interface Profile {
  displayName: string | null;
  displayNameLocked: boolean;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from('profiles')
    .select('display_name, display_name_locked')
    .eq('id', userId)
    .single();
  if (!data) return null;
  return { displayName: data.display_name ?? null, displayNameLocked: Boolean(data.display_name_locked) };
}

// Il nome puo' essere impostato una sola volta: una volta bloccato, il
// trigger public.protect_display_name rifiuta qualunque ulteriore modifica
// (vedi supabase/migrations/20260830130000_lock_display_name_after_first_set.sql).
// Il frontend non invia mai display_name_locked: e' calcolato solo dal DB.
export async function updateDisplayName(userId: string, displayName: string): Promise<ServiceResult> {
  if (!supabase) return serviceUnavailable();
  const { error } = await supabase.from('profiles').update({ display_name: displayName.trim() }).eq('id', userId);
  return { errorKey: error ? 'auth.errors.generic' : null };
}

// Richiede l'Edge Function "delete-account" (vedi supabase/functions/delete-account
// e supabase/README.md): e' l'unico modo corretto per cancellare un utente da
// auth.users, perche' richiede la service_role key, che deve restare sempre
// lato server e non puo' mai essere usata dal frontend.
export async function deleteAccount(): Promise<ServiceResult> {
  if (!supabase) return serviceUnavailable();
  const { error } = await supabase.functions.invoke('delete-account', { method: 'POST' });
  return { errorKey: error ? 'auth.errors.generic' : null };
}
