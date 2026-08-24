import { MASTERY_LEVEL_META, type MasteryLevel } from '../../utils/mastery';
import { useTranslation } from '../../i18n/useTranslation';

interface MasteryBadgeProps {
  level: MasteryLevel;
  className?: string;
}

export function MasteryBadge({ level, className = '' }: MasteryBadgeProps) {
  const { t } = useTranslation();
  const meta = MASTERY_LEVEL_META[level];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-3 py-1 text-sm font-semibold text-brand-600 dark:text-brand-400 ${className}`}
    >
      <span aria-hidden="true">{meta.icon}</span> {t(meta.labelKey)}
    </span>
  );
}
