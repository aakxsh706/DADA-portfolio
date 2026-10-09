'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties, ElementType, ReactNode } from 'react';
import { gsap, SplitText } from '@/lib/gsap';
import { reducedMotionQuery } from '@/lib/motion';
import { cn } from '@/lib/utils';

export type SplitType = 'lines' | 'words' | 'chars';

export interface TextRevealProps {
  as?: ElementType;
  children: ReactNode;
  /** How the text is split. Each piece is wrapped in an overflow mask. */
  type?: SplitType;
  /** `scroll` reveals on viewport entry, `manual` waits for `play` to become true. */
  trigger?: 'scroll' | 'manual';
  play?: boolean;
  delay?: number;
  stagger?: number;
  duration?: number;
  /** ScrollTrigger start position. */
  start?: string;
  className?: string;
  style?: CSSProperties;
  id?: string;
  /** Pieces fade in as well as slide up (good for body copy). */
  fade?: boolean;
}

/**
 * Masked text reveal built on GSAP SplitText. The visible text is left intact for
 * assistive technology: SplitText adds an aria-label to the element and hides the
 * generated fragments, so the copy is announced exactly once.
 */
export default function TextReveal({
  as = 'div',
  children,
  type = 'lines',
  trigger = 'scroll',
  play = false,
  delay = 0,
  stagger,
  duration = 1.1,
  start = 'top 88%',
  className,
  style,
  id,
  fade = false,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const playedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia(reducedMotionQuery).matches) {
      el.classList.remove('will-reveal');
      return;
    }

    let split: SplitText | null = null;
    let cancelled = false;
    const pieceStagger = stagger ?? (type === 'chars' ? 0.02 : type === 'words' ? 0.045 : 0.09);

    const build = () => {
      if (cancelled) return;
      split = SplitText.create(el, {
        type,
        mask: type,
        autoSplit: true,
        aria: 'auto',
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
        onSplit: (self) => {
          const pieces = self[type];
          gsap.set(pieces, { yPercent: 110, opacity: fade ? 0 : 1 });
          gsap.set(el, { visibility: 'visible' });
          if (trigger === 'manual' && playedRef.current) {
            gsap.set(pieces, { yPercent: 0, opacity: 1 });
            return undefined;
          }
          const tween = gsap.to(pieces, {
            yPercent: 0,
            opacity: 1,
            duration,
            delay,
            stagger: pieceStagger,
            ease: 'expo.out',
            paused: trigger === 'manual',
            scrollTrigger:
              trigger === 'scroll' ? { trigger: el, start, once: true } : undefined,
          });
          tweenRef.current = tween;
          if (trigger === 'manual' && play) {
            playedRef.current = true;
            tween.play();
          }
          return tween;
        },
      });
    };

    const ready = document.fonts?.ready ?? Promise.resolve();
    ready.then(build).catch(build);

    return () => {
      cancelled = true;
      tweenRef.current?.scrollTrigger?.kill();
      tweenRef.current?.kill();
      tweenRef.current = null;
      split?.revert();
    };
    // Rebuilding on prop changes is intentional only for structural props.
  }, [type, trigger, delay, stagger, duration, start, fade]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (trigger !== 'manual' || !play || playedRef.current) return;
    if (tweenRef.current) {
      playedRef.current = true;
      tweenRef.current.play();
    }
  }, [play, trigger]);

  const Tag = as;
  return (
    <Tag ref={ref} id={id} style={style} className={cn('will-reveal', className)}>
      {children}
    </Tag>
  );
}
