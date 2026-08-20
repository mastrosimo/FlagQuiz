import * as Flags from 'country-flag-icons/react/3x2';
import type { ComponentType, SVGProps } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

interface FlagImageProps {
  code: string;
  name: string;
  className?: string;
}

export function FlagImage({ code, name, className = '' }: FlagImageProps) {
  const { t } = useTranslation();
  const FlagComponent = (Flags as Record<string, ComponentType<SVGProps<SVGSVGElement>>>)[code];
  const label = t('quizPlay.flagAlt', { name });

  if (!FlagComponent) {
    return (
      <div
        role="img"
        aria-label={label}
        className={`flex items-center justify-center bg-slate-200 text-2xl dark:bg-slate-700 ${className}`}
      >
        🏳️
      </div>
    );
  }

  return <FlagComponent role="img" aria-label={label} className={className} />;
}
