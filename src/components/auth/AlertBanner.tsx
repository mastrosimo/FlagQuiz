import type { ReactNode } from 'react';

type Variant = 'error' | 'success';

const VARIANT_CLASSES: Record<Variant, string> = {
  error: 'bg-danger-500/10 text-danger-600 dark:text-danger-500',
  success: 'bg-success-500/10 text-success-600 dark:text-success-500',
};

export function AlertBanner({ variant, children }: { variant: Variant; children: ReactNode }) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`rounded-xl px-4 py-3 text-sm font-medium ${VARIANT_CLASSES[variant]}`}
    >
      {children}
    </div>
  );
}
