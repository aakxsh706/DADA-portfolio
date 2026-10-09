'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { siteConfig } from '@/data/site-config';
import { usePreloader } from './PreloaderProvider';

/**
 * Cinematic intro: counter → identity → horizontal mask → slide away.
 * Runs once per session; timing adapts to the real page load so it never
 * artificially stalls the experience.
 */
export default function Preloader() {
  const { active, finish } = usePreloader();
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!active || !root.current) return;
    const scope = root.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const q = gsap.utils.selector(scope);
    const value = { n: 0 };
    const loaded = document.readyState === 'complete';
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: () => {
          document.body.style.overflow = previousOverflow;
          finish();
        },
      });

      tl.to(value, {
        n: 100,
        duration: loaded ? 1.1 : 1.6,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (counter.current) counter.current.textContent = String(Math.round(value.n));
        },
      })
        .from(q('.pre-identity .mask-lines > *'), {
          yPercent: 110,
          duration: 0.9,
          stagger: 0.08,
          ease: 'expo.out',
        }, '-=0.6')
        .to(q('.pre-counter'), { yPercent: -20, autoAlpha: 0, duration: 0.5 }, '-=0.3')
        .fromTo(
          q('.pre-mask'),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.7, ease: 'expo.inOut' },
          '-=0.2',
        )
        .to(q('.pre-identity'), { yPercent: -30, autoAlpha: 0, duration: 0.55 }, '-=0.15')
        .to(q('.pre-mask'), { scaleY: 0, transformOrigin: 'center', duration: 0.3 }, '<')
        .to(scope, { yPercent: -100, duration: 0.95, ease: 'expo.inOut' }, '-=0.1')
        .to(q('.pre-panel'), { yPercent: 25, duration: 0.95, ease: 'expo.inOut' }, '<');
    }, scope);

    return () => {
      ctx.revert();
      document.body.style.overflow = previousOverflow;
    };
  }, [active, finish]);

  if (!active) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] overflow-hidden bg-[#0b0b0b] text-fg"
      aria-hidden="true"
    >
      <div className="pre-panel absolute inset-0 flex flex-col justify-between container-x py-8">
        <div className="flex items-center justify-between eyebrow">
          <span>{siteConfig.tagline}</span>
          <span>{siteConfig.location}</span>
        </div>

        <div className="pre-identity relative">
          <div className="mask-lines">
            <h1 className="text-display font-heading uppercase">{siteConfig.name}</h1>
          </div>
          <div className="mask-lines mt-4">
            <p className="text-lead text-muted">Portfolio — Selected work</p>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <span className="eyebrow">Loading</span>
          <span className="pre-counter font-heading text-display-sm tabular-nums leading-none">
            <span ref={counter}>0</span>
            <span className="text-muted">%</span>
          </span>
        </div>
      </div>

      <div className="pre-mask absolute left-0 top-1/2 h-px w-full origin-left bg-accent" />
    </div>
  );
}
