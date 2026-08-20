import { useState } from 'react';
import { Button } from '../common/Button';
import { useTranslation } from '../../i18n/useTranslation';

interface ShareButtonProps {
  text: string;
}

export function ShareButton({ text }: ShareButtonProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text, title: 'FlagQuiz' });
        return;
      } catch {
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — nothing more we can do without user interaction
    }
  };

  return (
    <Button size="lg" variant="secondary" onClick={handleShare} className="relative">
      {copied ? t('share.copied') : t('share.button')}
    </Button>
  );
}
