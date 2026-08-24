import { useEffect, useState } from 'react';

function msUntilNextMidnight(): number {
  const now = new Date();
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  return nextMidnight.getTime() - now.getTime();
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function useMidnightCountdown(): string {
  const [label, setLabel] = useState(() => formatCountdown(msUntilNextMidnight()));

  useEffect(() => {
    const interval = setInterval(() => setLabel(formatCountdown(msUntilNextMidnight())), 60_000);
    return () => clearInterval(interval);
  }, []);

  return label;
}
