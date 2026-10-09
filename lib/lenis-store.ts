import type Lenis from 'lenis';

/**
 * Tiny shared store for the single Lenis instance and live scroll state. Components
 * read from it instead of creating their own scroll loops.
 */
type Listener = (lenis: Lenis | null) => void;

let instance: Lenis | null = null;
const listeners = new Set<Listener>();

export const scrollState = {
  /** Scroll velocity in px per frame (positive = scrolling down). */
  velocity: 0,
  /** 1 = down, -1 = up. */
  direction: 1 as 1 | -1,
  /** Current scroll position in px. */
  scroll: 0,
  /** 0–1 page progress. */
  progress: 0,
};

export const lenisStore = {
  get: () => instance,
  set(next: Lenis | null) {
    instance = next;
    listeners.forEach((listener) => listener(instance));
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    listener(instance);
    return () => {
      listeners.delete(listener);
    };
  },
};

export const scrollTo = (target: string | number | HTMLElement, offset = 0) => {
  const lenis = lenisStore.get();
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.4 });
    return;
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
    return;
  }
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (element instanceof HTMLElement) {
    const top = element.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};

export const stopScroll = () => lenisStore.get()?.stop();
export const startScroll = () => lenisStore.get()?.start();
