'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { gsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Edge the image is revealed from. */
  from?: 'bottom' | 'left' | 'right' | 'top';
  delay?: number;
  start?: string;
  /** Initial zoom of the content inside the mask. */
  zoom?: number;
}

const closed: Record<NonNullable<Props['from']>, string> = {
  bottom: 'inset(100% 0 0 0)',
  top: 'inset(0 0 100% 0)',
  left: 'inset(0 100% 0 0)',
  right: 'inset(0 0 0 100%)',
};

/** Scroll-triggered clip-path mask reveal with a slow settle-zoom on its content. */
export default function ImageReveal({
  children,
  className,
  style,
  from = 'bottom',
  delay = 0,
  start = 'top 85%',
  zoom = 1.3,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const inner = el.firstElementChild;
      const tl = gsap.timeline({
        defaults: { ease: 'expo.out', duration: 1.5, delay },
        scrollTrigger: { trigger: el, start, once: true },
      });
      tl.fromTo(el, { clipPath: closed[from] }, { clipPath: 'inset(0% 0 0 0)' }, 0);
      if (inner) tl.fromTo(inner, { scale: zoom }, { scale: 1, duration: 1.9 }, 0);
    });
    return () => media.revert();
  }, [from, delay, start, zoom]);

  return (
    <div ref={ref} style={style} className={cn('relative overflow-hidden will-change-[clip-path]', className)}>
      {children}
    </div>
  );
}
