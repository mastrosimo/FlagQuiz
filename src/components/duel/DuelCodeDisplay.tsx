import { useState } from 'react';
import { useTranslation } from '../../i18n/useTranslation';

interface DuelCodeDisplayProps {
  code: string;
}

export function DuelCodeDisplay({ code }: DuelCodeDisplayProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/1vs1/${code}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard non disponibile (es. contesto non sicuro): nessun effetto, l'utente può selezionare il testo a mano.
    }
  };

  return (
    <div className="rounded-3xl bg-slate-50 p-5 text-center dark:bg-slate-800">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{t('duel.lobby.codeLabel')}</p>
      <p className="mt-1 font-display text-4xl font-black tracking-[0.3em] text-brand-600 dark:text-brand-400">
        {code}
      </p>
      <p className="mt-2 break-all text-xs text-slate-400">{shareUrl}</p>
      <button
        type="button"
        onClick={handleCopy}
        className="mt-3 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
      >
        {copied ? t('duel.lobby.copied') : t('duel.lobby.copyButton')}
      </button>
      <p className="mt-2 text-xs text-slate-400">{t('duel.lobby.shareHint')}</p>
    </div>
  );
}
