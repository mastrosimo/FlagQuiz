import { supabase } from '../lib/supabaseClient';
import type { TranslationKey } from '../i18n/types';

export interface ServiceResult {
  errorKey: TranslationKey | null;
}

function serviceUnavailable(): ServiceResult {
  return { errorKey: 'auth.errors.serviceUnavailable' };
}

export async function getDisplayName(userId: string): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.from('profiles').select('display_name').eq('id', userId).single();
  return data?.display_name ?? null;
}

export async function updateDisplayName(userId: string, displayName: string): Promise<ServiceResult> {
  if (!supabase) return serviceUnavailable();
  const { error } = await supabase
    .from('profiles')
    .update({ display_name: displayName.trim() || null })
    .eq('id', userId);
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
