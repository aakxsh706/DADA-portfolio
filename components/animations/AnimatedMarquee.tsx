'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { gsap } from '@/lib/gsap';
import { scrollState } from '@/lib/lenis-store';
import { reducedMotionQuery } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface Props {
  items: string[];
  separator?: ReactNode;
  /** Base speed in pixels per second. */
  speed?: number;
  className?: string;
  itemClassName?: string;
  /** Accessible summary read once by screen readers. */
  label?: string;
}

/**
 * Seamless marquee driven by GSAP's ticker. Direction follows the scroll
 * direction, hover eases the speed down, and the content is repeated just enough
 * times to cover the viewport so there is never a visible loop jump.
 */
export default function AnimatedMarquee({
  items,
  separator = <span className="text-accent">✳</span>,
  speed = 90,
  className,
  itemClassName,
  label,
}: Props) {
  const track = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(2);

  useEffect(() => {
    const trackEl = track.current;
    const firstEl = first.current;
    if (!trackEl || !firstEl) return;

    let width = firstEl.offsetWidth;
    const resize = new ResizeObserver(() => {
      width = firstEl.offsetWidth;
      if (width > 0) setCopies(Math.max(2, Math.ceil(window.innerWidth / width) + 1));
    });
    resize.observe(firstEl);

    if (window.matchMedia(reducedMotionQuery).matches) {
      return () => resize.disconnect();
    }

    let position = 0;
    let factor = 1;
    let targetFactor = 1;
    const onEnter = () => {
      targetFactor = 0.2;
    };
    const onLeave = () => {
      targetFactor = 1;
    };
    trackEl.addEventListener('pointerenter', onEnter);
    trackEl.addEventListener('pointerleave', onLeave);

    const tick = (_time: number, deltaTime: number) => {
      if (!width) return;
      const dt = Math.min(deltaTime, 50) / 1000;
      factor += (targetFactor - factor) * 0.08;
      const boost = 1 + Math.min(Math.abs(scrollState.velocity) / 40, 2.5);
      position -= speed * factor * boost * dt * scrollState.direction;
      position = ((position % width) + width) % width;
      trackEl.style.transform = `translate3d(${-position}px, 0, 0)`;
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      resize.disconnect();
      trackEl.removeEventListener('pointerenter', onEnter);
      trackEl.removeEventListener('pointerleave', onLeave);
    };
  }, [speed]);

  const content = (
    <>
      {items.map((item, index) => (
        <Fragment key={`${item}-${index}`}>
          <span className={cn('whitespace-nowrap', itemClassName)}>{item}</span>
          <span className="mx-[0.45em] inline-flex shrink-0 items-center text-[0.55em]" aria-hidden>
            {separator}
          </span>
        </Fragment>
      ))}
    </>
  );

  return (
    <div className={cn('relative w-full overflow-hidden', className)}>
      {label ? <span className="sr-only">{label}</span> : null}
      <div ref={track} className="flex w-max will-change-transform" aria-hidden="true">
        {Array.from({ length: copies }).map((_, index) => (
          <div
            key={index}
            ref={index === 0 ? first : undefined}
            className="flex shrink-0 items-center"
          >
            {content}
          </div>
        ))}
      </div>
    </div>
  );
}
