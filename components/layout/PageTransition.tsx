'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/motion';
import { lenisStore } from '@/lib/lenis-store';

interface TransitionApi {
  navigate: (href: string) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionApi>({
  navigate: () => {},
  isTransitioning: false,
});

export const usePageTransition = () => useContext(TransitionContext);

/**
 * Off-white panel that wipes up to cover the page before navigation and wipes
 * away once the new route has rendered. Navigation itself stays instant; the
 * cover simply hides the swap.
 */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const covering = useRef(false);
  const pendingPath = useRef<string | null>(null);
  const [isTransitioning, setTransitioning] = useState(false);

  const navigate = useCallback(
    (href: string) => {
      if (covering.current) return;
      if (prefersReducedMotion() || !panel.current) {
        router.push(href);
        return;
      }
      covering.current = true;
      setTransitioning(true);
      pendingPath.current = href.split('#')[0] || '/';
      lenisStore.get()?.stop();
      gsap.killTweensOf(panel.current);
      gsap.fromTo(
        panel.current,
        { yPercent: 100, display: 'block' },
        {
          yPercent: 0,
          duration: 0.6,
          ease: 'expo.inOut',
          onComplete: () => router.push(href),
        },
      );
    },
    [router],
  );

  // Reveal the new page once the route has changed.
  useEffect(() => {
    if (!covering.current || !panel.current) return;
    if (pendingPath.current && pendingPath.current !== pathname) return;
    const el = panel.current;
    const reveal = () => {
      ScrollTrigger.refresh();
      gsap.to(el, {
        yPercent: -100,
        duration: 0.75,
        ease: 'expo.inOut',
        delay: 0.08,
        onComplete: () => {
          gsap.set(el, { display: 'none', yPercent: 100 });
          covering.current = false;
          pendingPath.current = null;
          lenisStore.get()?.start();
          setTransitioning(false);
        },
      });
    };
    const frame = requestAnimationFrame(() => requestAnimationFrame(reveal));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  const value = useMemo(() => ({ navigate, isTransitioning }), [navigate, isTransitioning]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div
        ref={panel}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[95] hidden bg-fg"
        style={{ transform: 'translateY(100%)' }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-accent" />
      </div>
    </TransitionContext.Provider>
  );
}
