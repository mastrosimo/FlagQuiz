/**
 * Nome da mostrare per l'utente autenticato corrente: il suo display_name se
 * impostato, altrimenti la parte prima della @ dell'email, altrimenti
 * l'email intera. Stessa logica usata in UserMenu (navbar) e nel flusso
 * "sfida un amico" (1vs1 online) — un'unica fonte per restare coerenti in
 * tutta l'app.
 */
export function getShownName(displayName: string | null | undefined, email: string | null | undefined): string {
  const trimmedName = displayName?.trim();
  if (trimmedName) return trimmedName;
  const safeEmail = email ?? '';
  return safeEmail.split('@')[0] || safeEmail;
}
