'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';

interface Props {
  index: string;
  label: string;
  className?: string;
  /** Use light-on-dark (default) or dark-on-light colouring. */
  tone?: 'dark' | 'light';
}

/**
 * Editorial divider used between sections: a hairline draws across the page and
 * the section index / label fade up as the visitor approaches.
 */
export default function SectionTransition({ index, label, className, tone = 'dark' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      });
      tl.fromTo(
        el.querySelector('.st-line'),
        { scaleX: 0 },
        { scaleX: 1, duration: 1.4, ease: 'expo.inOut' },
      ).fromTo(
        el.querySelectorAll('.st-meta'),
        { y: 14, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
        '-=0.9',
      );
    });
    return () => media.revert();
  }, []);

  return (
    <div ref={ref} className={cn('container-x', className)} aria-hidden="true">
      <div
        className={cn(
          'st-line h-px w-full origin-left',
          tone === 'dark' ? 'bg-line-strong' : 'bg-bg/30',
        )}
      />
      <div className="flex items-center justify-between pt-4">
        <span className={cn('st-meta eyebrow', tone === 'light' && 'text-bg/60')}>{label}</span>
        <span
          className={cn(
            'st-meta font-heading text-sm font-bold tabular-nums',
            tone === 'light' ? 'text-bg/60' : 'text-muted',
          )}
        >
          ({index})
        </span>
      </div>
    </div>
  );
}
