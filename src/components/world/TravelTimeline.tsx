import { Card } from '../common/Card';
import { FlagImage } from '../quiz/FlagImage';
import { COUNTRY_BY_CODE } from '../../data/countries';
import type { TimelineEntry } from '../../utils/world';
import { useTranslation } from '../../i18n/useTranslation';

interface TravelTimelineProps {
  dated: TimelineEntry[];
  undated: TimelineEntry[];
}

function formatEntryDate(entry: TimelineEntry, locale: string): string {
  if (entry.date) {
    return new Date(entry.date).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  }
  if (entry.year) return String(entry.year);
  return '';
}

function TimelineRow({ entry, locale }: { entry: TimelineEntry; locale: string }) {
  const country = COUNTRY_BY_CODE[entry.code];
  if (!country) return null;
  const dateLabel = formatEntryDate(entry, locale);

  return (
    <div className="flex items-start gap-3 py-3">
      <FlagImage code={country.code} name={country.name[locale as 'it' | 'en']} className="h-10 w-14 shrink-0 rounded-md shadow-sm" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <p className="font-display font-bold text-slate-900 dark:text-white">{country.name[locale as 'it' | 'en']}</p>
          {dateLabel && <p className="text-xs font-semibold text-slate-400">{dateLabel}</p>}
        </div>
        {entry.note && <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{entry.note}</p>}
      </div>
    </div>
  );
}

export function TravelTimeline({ dated, undated }: TravelTimelineProps) {
  const { t, locale } = useTranslation();

  if (dated.length === 0 && undated.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-3xl" aria-hidden="true">🧭</p>
        <p className="mt-2 font-display text-lg font-bold text-slate-900 dark:text-white">{t('world.timelineEmptyTitle')}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('world.timelineEmptyDescription')}</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {dated.length > 0 && (
        <Card className="divide-y divide-slate-100 p-5 dark:divide-slate-800">
          <h2 className="pb-3 font-display text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t('world.timelineHeading')}
          </h2>
          {dated.map((entry) => (
            <TimelineRow key={entry.code} entry={entry} locale={locale} />
          ))}
        </Card>
      )}

      {undated.length > 0 && (
        <Card className="divide-y divide-slate-100 p-5 dark:divide-slate-800">
          <h2 className="pb-3 font-display text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {t('world.timelineUndatedHeading')}
          </h2>
          {undated.map((entry) => (
            <TimelineRow key={entry.code} entry={entry} locale={locale} />
          ))}
        </Card>
      )}
    </div>
  );
}
