import { useState } from 'react';
import type { Country } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { FlagImage } from '../quiz/FlagImage';
import { useCollectionStore } from '../../store/collectionStore';
import { useWorldStore } from '../../store/worldStore';
import { useMasteryStore } from '../../store/masteryStore';
import { useMissionStore } from '../../store/missionStore';
import { useProfileStore } from '../../store/profileStore';
import { getMasteredCount } from '../../utils/mastery';
import { useTranslation } from '../../i18n/useTranslation';

interface CountryDetailModalProps {
  country: Country | null;
  onClose: () => void;
}

// Ricontrolla gli achievement con uno snapshot fresco di tutti gli assi di
// progressione, esattamente come fa QuizPage.handleFinish: nessuna
// sottoscrizione reattiva nuova, nessun secondo motore achievement.
function recheckAchievements() {
  useProfileStore.getState().checkAchievements({
    collectionCount: useCollectionStore.getState().recognizedCodes.length,
    masteredCount: getMasteredCount(useMasteryStore.getState().counts),
    missionsCompletedCount: useMissionStore.getState().totalCompleted,
    visitedCount: Object.keys(useWorldStore.getState().visited).length,
  });
}

export function CountryDetailModal({ country, onClose }: CountryDetailModalProps) {
  return (
    <Modal open={country !== null} onClose={onClose}>
      {country && <CountryDetailContent key={country.code} country={country} />}
    </Modal>
  );
}

function CountryDetailContent({ country }: { country: Country }) {
  const { t, locale } = useTranslation();
  const recognizedCodes = useCollectionStore((state) => state.recognizedCodes);
  const visited = useWorldStore((state) => state.visited);
  const wishlist = useWorldStore((state) => state.wishlist);
  const markVisited = useWorldStore((state) => state.markVisited);
  const unmarkVisited = useWorldStore((state) => state.unmarkVisited);
  const updateVisitedDetails = useWorldStore((state) => state.updateVisitedDetails);
  const toggleWishlist = useWorldStore((state) => state.toggleWishlist);

  const isKnown = recognizedCodes.includes(country.code);
  const visitedEntry = visited[country.code];
  const isVisited = Boolean(visitedEntry);
  const isWishlisted = wishlist.includes(country.code);

  const [year, setYear] = useState(visitedEntry?.year ? String(visitedEntry.year) : '');
  const [date, setDate] = useState(visitedEntry?.date ?? '');
  const [note, setNote] = useState(visitedEntry?.note ?? '');
  const [saved, setSaved] = useState(false);

  const handleToggleVisited = () => {
    if (isVisited) {
      unmarkVisited(country.code);
    } else {
      markVisited(country.code, { year: null, date: null, note: null });
    }
    recheckAchievements();
  };

  const handleSaveDetails = () => {
    const parsedYear = year.trim() === '' ? null : Number(year);
    updateVisitedDetails(country.code, {
      year: parsedYear !== null && !Number.isNaN(parsedYear) ? parsedYear : null,
      date: date || null,
      note: note.trim() === '' ? null : note.trim(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="text-center">
        <FlagImage
          code={country.code}
          name={country.name[locale]}
          className="mx-auto aspect-[3/2] w-40 rounded-xl shadow-md"
        />
        <h2 className="mt-4 font-display text-2xl font-bold text-slate-900 dark:text-white">
          {country.name[locale]}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{t(`continents.${country.continent}`)}</p>

        {isKnown ? (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-success-500/10 px-3 py-1 text-sm font-semibold text-success-600 dark:text-success-500">
            <span aria-hidden="true">✓</span> {t('learn.recognizedBadge')}
          </p>
        ) : (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <span aria-hidden="true">○</span> {t('learn.notRecognizedYet')}
          </p>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">{t('world.visitedToggleLabel')}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('world.visitedToggleDescription')}</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isVisited}
          onClick={handleToggleVisited}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${isVisited ? 'bg-brand-600' : 'bg-slate-300'}`}
        >
          <span
            className={`absolute left-0 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${isVisited ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
      </div>

      {isVisited && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('world.yearLabel')}</span>
              <input
                type="number"
                inputMode="numeric"
                min={1900}
                max={new Date().getFullYear()}
                value={year}
                onChange={(event) => setYear(event.target.value)}
                placeholder={t('world.yearPlaceholder')}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('world.dateLabel')}</span>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('world.noteLabel')}</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={280}
              rows={3}
              placeholder={t('world.notePlaceholder')}
              className="resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
            />
          </label>
          <Button size="md" onClick={handleSaveDetails}>
            {saved ? t('world.savedConfirmation') : t('world.saveDetailsButton')}
          </Button>
        </div>
      )}

      {!isVisited && (
        <Button variant="secondary" size="md" className="mt-4 w-full" onClick={() => toggleWishlist(country.code)}>
          {isWishlisted ? `★ ${t('world.removeFromWishlist')}` : `☆ ${t('world.addToWishlist')}`}
        </Button>
      )}
    </div>
  );
}
