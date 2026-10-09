'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { finePointerQuery } from '@/lib/motion';
import { siteConfig } from '@/data/site-config';
import { usePreloader } from '@/components/layout/PreloaderProvider';
import MagneticButton from '@/components/ui/MagneticButton';
import ArrowIcon from '@/components/ui/ArrowIcon';
import Availability from '@/components/ui/Availability';
import TextReveal from '@/components/animations/TextReveal';

const LINES = ['We build', 'digital', 'experiences', 'that stand out'];

export default function Hero() {
  const { done } = usePreloader();
  const section = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const follower = useRef<HTMLDivElement>(null);

  // Entrance: masked line reveal once the preloader has finished.
  useEffect(() => {
    const el = heading.current;
    const root = section.current;
    if (!el || !root || !done) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const lines = el.querySelectorAll('.hero-line');
      gsap.set(lines, { yPercent: 112 });
      gsap.set(el, { visibility: 'visible' });
      const tl = gsap.timeline({ delay: 0.1 });
      tl.to(lines, { yPercent: 0, duration: 1.3, stagger: 0.11, ease: 'expo.out' })
        .from(
          root.querySelectorAll('.hero-fade'),
          { y: 24, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'power3.out' },
          '-=0.9',
        );
    });
    media.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(el, { visibility: 'visible' });
    });
    return () => media.revert();
  }, [done]);

  // Scroll: headline lines drift at different speeds and fade toward the marquee.
  useEffect(() => {
    const root = section.current;
    const el = heading.current;
    if (!root || !el) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const lines = gsap.utils.toArray<HTMLElement>('.hero-line-mask', el);
      lines.forEach((line, index) => {
        gsap.to(line, {
          yPercent: -(18 + index * 14),
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
        });
      });
      gsap.to(root.querySelectorAll('.hero-fade, .hero-deco'), {
        autoAlpha: 0,
        y: -40,
        ease: 'none',
        scrollTrigger: { trigger: root, start: '30% top', end: '85% top', scrub: true },
      });
      gsap.to(root.querySelector('.hero-deco-ring'), {
        yPercent: 40,
        rotate: 25,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
      });
    });
    return () => media.revert();
  }, []);

  // Cursor-following decorative ring (mouse users only).
  useEffect(() => {
    const el = follower.current;
    const root = section.current;
    if (!el || !root) return;
    const media = gsap.matchMedia();
    media.add(`${finePointerQuery} and (prefers-reduced-motion: no-preference)`, () => {
      const xTo = gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3.out' });
      const move = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        xTo(event.clientX - rect.left);
        yTo(event.clientY - rect.top);
      };
      const enter = () => gsap.to(el, { autoAlpha: 1, scale: 1, duration: 0.8 });
      const leave = () => gsap.to(el, { autoAlpha: 0, scale: 0.6, duration: 0.6 });
      root.addEventListener('pointermove', move);
      root.addEventListener('pointerenter', enter);
      root.addEventListener('pointerleave', leave);
      return () => {
        root.removeEventListener('pointermove', move);
        root.removeEventListener('pointerenter', enter);
        root.removeEventListener('pointerleave', leave);
      };
    });
    return () => media.revert();
  }, []);

  return (
    <section
      ref={section}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-10 pt-32 md:pb-14"
      aria-labelledby="hero-heading"
    >
      {/* Decorative background */}
      <div
        className="hero-deco pointer-events-none absolute right-[-6vw] top-[14vh] hidden md:block"
        aria-hidden="true"
      >
        <div className="hero-deco-ring h-[42vw] w-[42vw] max-w-[640px] rounded-full border border-line" />
      </div>
      <div
        className="hero-deco pointer-events-none absolute left-[var(--gutter)] top-[18vh] hidden select-none font-heading text-[11vw] font-bold leading-none text-transparent md:block"
        style={{ WebkitTextStroke: '1px rgba(245,242,235,0.08)' }}
        aria-hidden="true"
      >
        ®
      </div>
      <div
        ref={follower}
        className="pointer-events-none absolute left-0 top-0 -ml-[90px] -mt-[90px] hidden h-[180px] w-[180px] scale-50 rounded-full border border-fg/25 opacity-0 lg:block"
        aria-hidden="true"
      >
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
      </div>

      <div className="container-x relative">
        <div className="hero-fade mb-10 flex flex-wrap items-center justify-between gap-4 md:mb-16">
          <Availability />
          <span className="eyebrow hidden md:inline">{siteConfig.location}</span>
        </div>

        <h1
          ref={heading}
          id="hero-heading"
          className="will-reveal font-heading text-display font-bold uppercase"
        >
          {LINES.map((line, index) => (
            <span
              key={line}
              className={[
                'hero-line-mask mask-lines block',
                index === 1 ? 'md:pl-[12vw]' : '',
                index === 3 ? 'md:text-right' : '',
              ].join(' ')}
            >
              <span className="hero-line block will-change-transform">
                {line}
                {index === 3 ? <span className="text-accent">.</span> : null}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:items-end">
          <TextReveal
            as="p"
            type="words"
            trigger="manual"
            play={done}
            delay={0.9}
            fade
            className="text-lead max-w-md text-muted md:col-span-6 md:col-start-1"
          >
            {siteConfig.description.replace(' for ambitious clients', '')}
          </TextReveal>

          <div className="hero-fade flex items-center gap-8 md:col-span-6 md:justify-end">
            <MagneticButton href="/#contact" variant="solid" size="lg" strength={0.4}>
              Let&apos;s talk
              <ArrowIcon />
            </MagneticButton>
          </div>
        </div>

        <div className="hero-fade mt-14 flex items-center gap-4 text-xs uppercase tracking-[0.18em] text-muted md:mt-20">
          <span className="relative block h-12 w-px overflow-hidden bg-line">
            <span className="scroll-line absolute inset-0 bg-fg" />
          </span>
          <span>Scroll</span>
        </div>
      </div>
    </section>
  );
}
