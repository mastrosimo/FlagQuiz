import { useEffect, useState } from 'react';

/** Secondi rimanenti (arrotondati per eccesso) fino a `targetTimestamp`. */
export function useRemainingSeconds(targetTimestamp: number | null): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (targetTimestamp == null) return;
    const interval = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  if (targetTimestamp == null) return 0;
  return Math.max(0, Math.ceil((targetTimestamp - now) / 1000));
}
