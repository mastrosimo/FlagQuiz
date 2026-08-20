import { useCallback, useRef } from 'react';
import { useProfileStore } from '../store/profileStore';

type ToneStep = { freq: number; duration: number; delay: number };

function playTones(ctx: AudioContext, steps: ToneStep[]) {
  const now = ctx.currentTime;
  for (const step of steps) {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = step.freq;
    oscillator.connect(gain);
    gain.connect(ctx.destination);

    const startAt = now + step.delay;
    const endAt = startAt + step.duration;
    gain.gain.setValueAtTime(0, startAt);
    gain.gain.linearRampToValueAtTime(0.2, startAt + 0.01);
    gain.gain.linearRampToValueAtTime(0, endAt);

    oscillator.start(startAt);
    oscillator.stop(endAt + 0.02);
  }
}

export function useSound() {
  const soundEnabled = useProfileStore((state) => state.soundEnabled);
  const ctxRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (steps: ToneStep[]) => {
      if (!soundEnabled) return;
      try {
        playTones(getContext(), steps);
      } catch {
        // Web Audio unavailable — fail silently
      }
    },
    [soundEnabled, getContext],
  );

  return {
    playCorrect: () => play([{ freq: 523.25, duration: 0.1, delay: 0 }, { freq: 783.99, duration: 0.15, delay: 0.1 }]),
    playWrong: () => play([{ freq: 220, duration: 0.2, delay: 0 }, { freq: 164.81, duration: 0.25, delay: 0.15 }]),
    playComplete: () =>
      play([
        { freq: 523.25, duration: 0.12, delay: 0 },
        { freq: 659.25, duration: 0.12, delay: 0.12 },
        { freq: 783.99, duration: 0.12, delay: 0.24 },
        { freq: 1046.5, duration: 0.2, delay: 0.36 },
      ]),
    playUnlock: () =>
      play([
        { freq: 659.25, duration: 0.1, delay: 0 },
        { freq: 987.77, duration: 0.18, delay: 0.1 },
      ]),
  };
}
