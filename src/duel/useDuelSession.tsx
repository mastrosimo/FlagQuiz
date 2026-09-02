import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import type { Question } from '../types';
import type { DuelMatchInfo, DuelMockControls, DuelState, DuelTransport, DuelTransportKind } from './types';
import type { BotDifficulty } from './botDifficulty';
import { LocalMockTransport } from './transport/LocalMockTransport';
import { SupabaseRealtimeTransport } from './transport/SupabaseRealtimeTransport';
import { buildDuelQuestions, createInitialDuelState, duelReducer } from './duelEngine';

export type DuelJoinIntent = 'create' | 'join';

interface DuelSessionValue {
  state: DuelState;
  isMockTransport: boolean;
  mockControls: DuelMockControls | null;
  ready: () => void;
  submitAnswer: (code: string) => void;
  proposeRematch: () => void;
  declineRematch: () => void;
}

const DuelSessionContext = createContext<DuelSessionValue | null>(null);

interface DuelSessionProviderProps {
  intent: DuelJoinIntent;
  code: string;
  localPlayerName: string;
  /** Presente solo per il flusso "1vs1 contro il computer". */
  botDifficulty?: BotDifficulty;
  /** 'supabase-realtime' per il flusso "sfida un amico" reale; richiede userId. */
  transportKind?: DuelTransportKind;
  /** ID dell'utente autenticato: obbligatorio solo per transportKind 'supabase-realtime'. */
  userId?: string;
  /** Mostrato al posto dei children se create/joinMatch fallisce (es. codice non valido/partita piena). */
  renderError?: (message: string) => ReactNode;
  children: ReactNode;
}

/**
 * Punto in cui il "transport layer" viene scelto: il mock locale per "vs
 * Computer" (`botDifficulty` presente) e per l'uso interno di default, il
 * transport reale su Supabase per "sfida un amico" — motore e componenti UI
 * non dipendono da nessuno dei due, solo dall'interfaccia `DuelTransport`.
 */
function createTransport(botDifficulty?: BotDifficulty, transportKind?: DuelTransportKind, userId?: string): DuelTransport {
  if (transportKind === 'supabase-realtime') {
    if (!userId) throw new Error('supabase-realtime transport requires userId');
    return new SupabaseRealtimeTransport(userId);
  }
  return new LocalMockTransport(botDifficulty ? { bot: { difficulty: botDifficulty } } : undefined);
}

export function DuelSessionProvider({
  intent,
  code,
  localPlayerName,
  botDifficulty,
  transportKind,
  userId,
  renderError,
  children,
}: DuelSessionProviderProps) {
  // Creazione e distruzione del transport vivono nello stesso effect (pattern
  // React standard per una "connessione a un sistema esterno"): con lo
  // StrictMode di sviluppo, che monta/smonta/rimonta ogni componente per far
  // emergere effetti collaterali non ripuliti, questo garantisce che l'unica
  // istanza realmente in uso non venga mai distrutta a sua insaputa. Un
  // `useRef` creato in fase di render, distrutto invece in un secondo effect
  // separato, si romperebbe proprio con questo doppio-invoke.
  const [transport, setTransport] = useState<DuelTransport | null>(null);
  const [setup, setSetup] = useState<{ match: DuelMatchInfo; questions: Question[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const instance = createTransport(botDifficulty, transportKind, userId);
    setTransport(instance);
    return () => instance.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Deps intenzionalmente limitate a `transport` (stesso principio di
  // `useQuizEngine`, che calcola le domande una sola volta): la partita va
  // creata/joinata una sola volta per sessione. Un cambio di `code` nell'URL
  // dopo l'avvio (es. il redirect automatico su rivincita, vedi
  // DuelMatchPage) non deve ricrearla — a quel punto è già il transport,
  // tramite l'evento REMATCH_STARTED, ad aver aggiornato lo stato.
  useEffect(() => {
    if (!transport) return;
    let cancelled = false;
    const init = intent === 'create' ? transport.createMatch(code) : transport.joinMatch(code);
    init
      .then((match) => {
        if (cancelled) return;
        setSetup({ match, questions: buildDuelQuestions(match.code, match.questionCount) });
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'duel_join_failed');
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transport]);

  if (error) return <>{renderError?.(error) ?? null}</>;
  if (!transport || !setup) return null;

  return (
    <DuelSessionInner transport={transport} match={setup.match} questions={setup.questions} localPlayerName={localPlayerName}>
      {children}
    </DuelSessionInner>
  );
}

interface DuelSessionInnerProps {
  transport: DuelTransport;
  match: DuelMatchInfo;
  questions: Question[];
  localPlayerName: string;
  children: ReactNode;
}

function DuelSessionInner({ transport, match, questions, localPlayerName, children }: DuelSessionInnerProps) {
  const [state, dispatch] = useReducer(duelReducer, undefined, () =>
    createInitialDuelState(match, questions, localPlayerName),
  );
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => transport.onEvent((event) => dispatch(event)), [transport]);

  const submitAnswer = useCallback(
    (answerCode: string) => {
      const current = stateRef.current;
      if (current.currentQuestionIndex < 0) return;
      const timeMs = Date.now() - (current.roundStartedAt ?? Date.now());
      transport.submitAnswer(current.currentQuestionIndex, answerCode, timeMs);
    },
    [transport],
  );

  const value = useMemo<DuelSessionValue>(
    () => ({
      state,
      isMockTransport: transport.kind === 'local-mock',
      mockControls: transport.simulate ?? null,
      ready: () => transport.setReady(),
      submitAnswer,
      proposeRematch: () => transport.proposeRematch(),
      declineRematch: () => transport.declineRematch(),
    }),
    [state, transport, submitAnswer],
  );

  return <DuelSessionContext.Provider value={value}>{children}</DuelSessionContext.Provider>;
}

export function useDuelSession(): DuelSessionValue {
  const value = useContext(DuelSessionContext);
  if (!value) throw new Error('useDuelSession must be used within a DuelSessionProvider');
  return value;
}
