interface TimerProps {
  secondsRemaining: number;
}

export function Timer({ secondsRemaining }: TimerProps) {
  const isLow = secondsRemaining <= 10;

  return (
    <div
      className={`flex items-center gap-2 rounded-full px-4 py-2 font-display font-bold shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 ${
        isLow
          ? 'animate-pulse bg-danger-500/10 text-danger-600 dark:text-danger-500'
          : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200'
      }`}
    >
      <span aria-hidden="true">⏱️</span>
      <span>{secondsRemaining}s</span>
    </div>
  );
}
