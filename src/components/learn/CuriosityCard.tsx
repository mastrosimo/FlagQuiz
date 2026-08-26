import { motion } from 'framer-motion';
import type { CountryFact, CountryFactCategory } from '../../data/countryFacts';
import { useTranslation } from '../../i18n/useTranslation';

const CATEGORY_META: Record<CountryFactCategory, { icon: string; accent: string }> = {
  geography: { icon: '🌍', accent: 'from-brand-500/15 to-brand-500/5 ring-brand-500/20' },
  history: { icon: '📜', accent: 'from-amber-500/15 to-amber-500/5 ring-amber-500/20' },
  culture: { icon: '🎭', accent: 'from-fuchsia-500/15 to-fuchsia-500/5 ring-fuchsia-500/20' },
  nature: { icon: '🌿', accent: 'from-success-500/15 to-success-500/5 ring-success-500/20' },
  record: { icon: '🏆', accent: 'from-accent-500/15 to-accent-500/5 ring-accent-500/20' },
};

interface CuriosityCardProps {
  fact: CountryFact;
  index: number;
}

export function CuriosityCard({ fact, index }: CuriosityCardProps) {
  const { t, locale } = useTranslation();
  const meta = CATEGORY_META[fact.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`rounded-2xl bg-gradient-to-br p-4 ring-1 ${meta.accent} dark:bg-slate-900/40`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden="true">{meta.icon}</span>
        <div className="flex-1">
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t(`learn.factCategory.${fact.category}`)}
          </span>
          <p className="mt-1 text-sm leading-relaxed text-slate-800 dark:text-slate-100">{fact.text[locale]}</p>
          <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">{fact.source}</p>
        </div>
      </div>
    </motion.div>
  );
}
