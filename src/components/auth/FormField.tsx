import type { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function FormField({ label, error, hint, id, className = '', ...props }: FormFieldProps) {
  const errorId = error && id ? `${id}-error` : undefined;
  const hintId = hint && id ? `${id}-hint` : undefined;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm shadow-sm focus:outline-none dark:bg-slate-800 ${
          error
            ? 'border-danger-500 focus:border-danger-500'
            : 'border-slate-200 focus:border-brand-500 dark:border-slate-700'
        } ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId ?? hintId}
        {...props}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-danger-600 dark:text-danger-500">
          {error}
        </p>
      )}
    </div>
  );
}
