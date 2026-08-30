import type { ReactNode } from 'react';
import { Card } from '../common/Card';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <h1 className="text-center font-display text-3xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
      {subtitle && <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      <Card className="mt-6 p-6 sm:p-8">{children}</Card>
    </div>
  );
}
