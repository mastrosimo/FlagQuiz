import type { AuthError } from '@supabase/supabase-js';
import type { TranslationKey } from '../i18n/types';

// Codici ufficiali restituiti da Supabase Auth (@supabase/auth-js ErrorCode).
// Vedi node_modules/@supabase/auth-js/dist/module/lib/error-codes.d.ts.
const CODE_MAP: Record<string, TranslationKey> = {
  invalid_credentials: 'auth.errors.invalidCredentials',
  email_not_confirmed: 'auth.errors.emailNotConfirmed',
  user_already_exists: 'auth.errors.userAlreadyExists',
  email_exists: 'auth.errors.userAlreadyExists',
  identity_already_exists: 'auth.errors.userAlreadyExists',
  weak_password: 'auth.errors.weakPassword',
  same_password: 'auth.errors.samePassword',
  over_request_rate_limit: 'auth.errors.rateLimited',
  over_email_send_rate_limit: 'auth.errors.rateLimited',
  otp_expired: 'auth.errors.invalidOrExpiredLink',
  session_expired: 'auth.errors.invalidOrExpiredLink',
  email_address_invalid: 'auth.errors.emailInvalid',
};

// Fallback su messaggio inglese grezzo per versioni/casi senza `code` (alcuni
// errori di rete o pre-risposta non hanno un ErrorCode strutturato).
const MESSAGE_FALLBACKS: Array<[RegExp, TranslationKey]> = [
  [/invalid login credentials/i, 'auth.errors.invalidCredentials'],
  [/email not confirmed/i, 'auth.errors.emailNotConfirmed'],
  [/already registered|already exists/i, 'auth.errors.userAlreadyExists'],
  [/password.*(weak|at least)/i, 'auth.errors.weakPassword'],
  [/rate limit/i, 'auth.errors.rateLimited'],
  [/expired|invalid.*(token|link|code)/i, 'auth.errors.invalidOrExpiredLink'],
];

export function mapAuthError(error: AuthError): TranslationKey {
  if (error.code && error.code in CODE_MAP) return CODE_MAP[error.code];
  for (const [pattern, key] of MESSAGE_FALLBACKS) {
    if (pattern.test(error.message)) return key;
  }
  return 'auth.errors.generic';
}
