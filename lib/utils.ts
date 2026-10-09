export const cn = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const lerp = (start: number, end: number, amount: number): number =>
  start + (end - start) * amount;
