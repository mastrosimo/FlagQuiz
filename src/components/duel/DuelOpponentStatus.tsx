import { useTranslation } from '../../i18n/useTranslation';

interface DuelOpponentStatusProps {
  answered: boolean;
  youAnswered: boolean;
}

export function DuelOpponentStatus({ answered, youAnswered }: DuelOpponentStatusProps) {
  const { t } = useTranslation();

  return (
    <p className="mt-2 text-center text-xs font-semibold text-slate-400">
      {answered
        ? t('duel.play.opponentAnswered')
        : youAnswered
          ? t('duel.play.youAnswered')
          : t('duel.play.waitingOpponentAnswer')}
    </p>
  );
}
