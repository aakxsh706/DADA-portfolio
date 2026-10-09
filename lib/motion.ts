/** Shared motion tokens so every animation on the site feels related. */
export const ease = {
  out: 'power3.out',
  inOut: 'power3.inOut',
  expo: 'expo.out',
  expoInOut: 'expo.inOut',
  soft: 'power2.out',
} as const;

export const duration = {
  fast: 0.5,
  base: 0.9,
  slow: 1.3,
  reveal: 1.1,
} as const;

export const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
export const finePointerQuery = '(pointer: fine) and (hover: hover)';
export const desktopQuery = '(min-width: 1024px)';

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia(reducedMotionQuery).matches;

export const hasFinePointer = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia(finePointerQuery).matches;
