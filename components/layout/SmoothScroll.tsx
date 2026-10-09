'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { lenisStore, scrollState } from '@/lib/lenis-store';
import { reducedMotionQuery } from '@/lib/motion';

/**
 * One Lenis instance driven by GSAP's ticker so Lenis, ScrollTrigger and every
 * tween share a single animation frame. Falls back to native scrolling when the
 * visitor prefers reduced motion.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const media = window.matchMedia(reducedMotionQuery);
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    const onNativeScroll = () => {
      const y = window.scrollY;
      const velocity = y - scrollState.scroll;
      scrollState.velocity = velocity;
      if (Math.abs(velocity) > 0.5) scrollState.direction = velocity > 0 ? 1 : -1;
      scrollState.scroll = y;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollState.progress = max > 0 ? y / max : 0;
    };

    const setup = () => {
      if (media.matches) {
        window.addEventListener('scroll', onNativeScroll, { passive: true });
        return;
      }
      lenis = new Lenis({
        autoRaf: false,
        lerp: 0.09,
        wheelMultiplier: 1,
        anchors: { offset: -72 },
      });
      lenis.on('scroll', (instance: Lenis) => {
        scrollState.velocity = instance.velocity;
        if (Math.abs(instance.velocity) > 0.5) scrollState.direction = instance.direction as 1 | -1;
        scrollState.scroll = instance.scroll;
        scrollState.progress = instance.progress;
        ScrollTrigger.update();
      });
      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      lenisStore.set(lenis);
    };

    setup();

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      window.removeEventListener('scroll', onNativeScroll);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      lenisStore.set(null);
    };
  }, []);

  // Reset scroll position on route change (unless navigating to an in-page anchor).
  useEffect(() => {
    if (window.location.hash) return;
    const lenis = lenisStore.get();
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
