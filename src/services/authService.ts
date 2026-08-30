import { supabase } from '../lib/supabaseClient';
import { mapAuthError } from '../utils/authErrors';
import type { TranslationKey } from '../i18n/types';

export interface AuthResult {
  errorKey: TranslationKey | null;
}

export interface SignUpResult extends AuthResult {
  needsEmailConfirmation: boolean;
}

function serviceUnavailable(): AuthResult {
  return { errorKey: 'auth.errors.serviceUnavailable' };
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  if (!supabase) return serviceUnavailable();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { errorKey: error ? mapAuthError(error) : null };
}

export async function signUp(email: string, password: string): Promise<SignUpResult> {
  if (!supabase) return { ...serviceUnavailable(), needsEmailConfirmation: false };
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${window.location.origin}/` },
  });
  if (error) return { errorKey: mapAuthError(error), needsEmailConfirmation: false };
  // Se signUp non restituisce una sessione, il progetto richiede la conferma
  // email prima di poter accedere.
  return { errorKey: null, needsEmailConfirmation: !data.session };
}

export async function signOut(): Promise<AuthResult> {
  if (!supabase) return serviceUnavailable();
  const { error } = await supabase.auth.signOut();
  return { errorKey: error ? mapAuthError(error) : null };
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  if (!supabase) return serviceUnavailable();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { errorKey: error ? mapAuthError(error) : null };
}

export async function updatePassword(password: string): Promise<AuthResult> {
  if (!supabase) return serviceUnavailable();
  const { error } = await supabase.auth.updateUser({ password });
  return { errorKey: error ? mapAuthError(error) : null };
}

export async function updateEmail(email: string): Promise<AuthResult> {
  if (!supabase) return serviceUnavailable();
  // Supabase invia un'email di conferma al nuovo indirizzo (e in genere anche
  // al vecchio, "secure email change"): l'email della sessione non cambia
  // finche' il link non viene aperto.
  const { error } = await supabase.auth.updateUser(
    { email },
    { emailRedirectTo: `${window.location.origin}/account` },
  );
  return { errorKey: error ? mapAuthError(error) : null };
}

export async function resendConfirmationEmail(email: string): Promise<AuthResult> {
  if (!supabase) return serviceUnavailable();
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: { emailRedirectTo: `${window.location.origin}/` },
  });
  return { errorKey: error ? mapAuthError(error) : null };
}
