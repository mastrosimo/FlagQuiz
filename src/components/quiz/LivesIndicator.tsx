import { useTranslation } from '../../i18n/useTranslation';

interface LivesIndicatorProps {
  lives: number;
  maxLives: number;
}

export function LivesIndicator({ lives, maxLives }: LivesIndicatorProps) {
  const { t } = useTranslation();

  return (
    <div
      className="flex items-center gap-1 rounded-full bg-white px-4 py-2 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10"
      aria-label={t('lives.remaining', { count: lives, max: maxLives })}
    >
      {Array.from({ length: maxLives }).map((_, index) => (
        <span key={index} aria-hidden="true" className={index < lives ? 'opacity-100' : 'opacity-20'}>
          ❤️
        </span>
      ))}
    </div>
  );
}
