import { useTranslation } from '../../i18n/useTranslation';

export function Spinner({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <div
      role="status"
      aria-label={t('a11y.loading')}
      className={`h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600 ${className}`}
    />
  );
}
