'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import type { ReactNode } from 'react';
import { reducedMotionQuery } from '@/lib/motion';

export const PRELOADER_KEY = 'studio:preloader-seen';

type Decision = 'unknown' | 'run' | 'skip';

interface PreloaderState {
  /** True once the intro has finished (or was skipped) — sections wait for this. */
  done: boolean;
  /** True while the preloader overlay should be rendered. */
  active: boolean;
  finish: () => void;
}

const PreloaderContext = createContext<PreloaderState>({
  done: false,
  active: false,
  finish: () => {},
});

export const usePreloader = () => useContext(PreloaderContext);

const subscribe = () => () => {};

/** Client-only decision: run once per session, never for reduced-motion users. */
const readDecision = (): Decision => {
  try {
    if (window.sessionStorage.getItem(PRELOADER_KEY) === '1') return 'skip';
  } catch {
    return 'skip';
  }
  return window.matchMedia(reducedMotionQuery).matches ? 'skip' : 'run';
};

export function PreloaderProvider({ children }: { children: ReactNode }) {
  // 'unknown' on the server and during hydration so nothing animates before the decision.
  const decision = useSyncExternalStore(subscribe, readDecision, () => 'unknown' as Decision);
  const [finished, setFinished] = useState(false);

  const finish = useCallback(() => {
    try {
      window.sessionStorage.setItem(PRELOADER_KEY, '1');
    } catch {
      /* storage unavailable — the preloader simply runs again next time */
    }
    setFinished(true);
  }, []);

  const active = decision === 'run' && !finished;
  const done = decision === 'skip' || finished;

  const value = useMemo(() => ({ done, active, finish }), [done, active, finish]);

  return <PreloaderContext.Provider value={value}>{children}</PreloaderContext.Provider>;
}
