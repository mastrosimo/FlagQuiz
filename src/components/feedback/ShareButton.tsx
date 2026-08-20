import { useState } from 'react';
import { Button } from '../common/Button';

interface ShareButtonProps {
  text: string;
}

export function ShareButton({ text }: ShareButtonProps) {
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
      {copied ? 'Copiato negli appunti ✓' : 'Condividi risultato 📤'}
    </Button>
  );
}
