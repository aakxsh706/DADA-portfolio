import type { CSSProperties } from 'react';
import type { ProjectImage } from '@/data/projects';

/**
 * Inline aspect-ratio for a frame so a screenshot is shown whole, never cropped.
 * Falls back to `undefined` (use a design aspect class) when no image exists.
 */
export const aspectStyle = (image?: ProjectImage): CSSProperties | undefined =>
  image ? { aspectRatio: `${image.width} / ${image.height}` } : undefined;

/** Thin inset hairline so light screenshots keep a crisp edge on dark surfaces. */
export const frameEdge =
  'after:pointer-events-none after:absolute after:inset-0 after:ring-1 after:ring-inset after:ring-fg/10';
