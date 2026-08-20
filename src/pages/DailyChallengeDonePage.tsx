import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useTranslation } from '../i18n/useTranslation';

interface DailyChallengeDonePageProps {
  result: { score: number; correctCount: number; totalQuestions: number } | null;
  onBackHome: () => void;
}

export function DailyChallengeDonePage({ result, onBackHome }: DailyChallengeDonePageProps) {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-4 py-16 text-center">
      <span className="text-5xl" aria-hidden="true">✅</span>
      <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
        {t('dailyChallenge.doneTitle')}
      </h1>
      <p className="text-slate-500 dark:text-slate-400">{t('dailyChallenge.doneSubtitle')}</p>
      {result && (
        <Card className="w-full p-6">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">{result.score}</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('dailyChallenge.points')}</p>
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                {result.correctCount}/{result.totalQuestions}
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('dailyChallenge.correct')}</p>
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                {result.totalQuestions
                  ? Math.round((result.correctCount / result.totalQuestions) * 100)
                  : 0}
                %
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('dailyChallenge.accuracy')}</p>
            </div>
          </div>
        </Card>
      )}
      <Button size="lg" onClick={onBackHome}>
        {t('dailyChallenge.backHome')}
      </Button>
    </div>
  );
}
