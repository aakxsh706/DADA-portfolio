'use client';

import { useSyncExternalStore } from 'react';

const subscribe = (query: string) => (callback: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
};

/**
 * Reads a media query without hydration mismatches: the server snapshot is the
 * provided default, the client snapshot is the live match.
 */
export const useMediaQuery = (query: string, serverDefault = false): boolean =>
  useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => serverDefault,
  );
