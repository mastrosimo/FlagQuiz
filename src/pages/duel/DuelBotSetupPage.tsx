import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../components/common/Card';
import { DuelMockBanner } from '../../components/duel/DuelMockBanner';
import {
  BOT_DIFFICULTY_ORDER,
  BOT_DIFFICULTY_ICON,
  BOT_DIFFICULTY_LABEL_KEY,
  BOT_DIFFICULTY_DESCRIPTION_KEY,
} from '../../duel/botDifficulty';
import { useTranslation } from '../../i18n/useTranslation';

export function DuelBotSetupPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:px-6">
      <DuelMockBanner />
      <div className="text-center">
        <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">
          {t('duel.bot.chooseDifficultyTitle')}
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">{t('duel.bot.chooseDifficultySubtitle')}</p>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {BOT_DIFFICULTY_ORDER.map((difficulty) => (
          <motion.button
            key={difficulty}
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/1vs1/computer/${difficulty}`)}
          >
            <Card className="flex items-center gap-4 p-5 text-left transition-shadow hover:shadow-md">
              <span className="text-3xl" aria-hidden="true">
                {BOT_DIFFICULTY_ICON[difficulty]}
              </span>
              <span>
                <span className="block font-display text-lg font-bold text-slate-900 dark:text-white">
                  {t(BOT_DIFFICULTY_LABEL_KEY[difficulty])}
                </span>
                <span className="block text-sm text-slate-500 dark:text-slate-400">
                  {t(BOT_DIFFICULTY_DESCRIPTION_KEY[difficulty])}
                </span>
              </span>
            </Card>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
