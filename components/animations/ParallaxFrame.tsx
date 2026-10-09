'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { gsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  className?: string;
  /** Parallax strength: 1 ≈ 48px of travel across the viewport. */
  speed?: number;
}

/**
 * Moves a whole image frame at a different speed from the page instead of
 * zooming the picture inside it, so website screenshots are never cropped.
 * Disabled on small screens and for reduced-motion users.
 */
export default function ParallaxFrame({ children, className, speed = 0.6 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || speed === 0) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
      const travel = 48 * speed;
      gsap.fromTo(
        el,
        { y: travel },
        {
          y: -travel,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    });
    return () => media.revert();
  }, [speed]);

  return (
    <div ref={ref} className={cn('will-change-transform', className)}>
      {children}
    </div>
  );
}
