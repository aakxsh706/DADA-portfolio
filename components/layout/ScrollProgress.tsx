'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from '@/lib/gsap';

/** Thin page-progress bar pinned to the top edge. */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!bar.current) return;
    const tween = gsap.fromTo(
      bar.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.4, invalidateOnRefresh: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [pathname]);

  return (
    <div
      ref={bar}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[80] h-px w-full origin-left bg-accent"
    />
  );
}
