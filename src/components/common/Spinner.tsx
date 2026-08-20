export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Caricamento"
      className={`h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600 ${className}`}
    />
  );
}
