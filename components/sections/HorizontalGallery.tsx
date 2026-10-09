'use client';

import { useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import Image from 'next/image';
import { gsap } from '@/lib/gsap';
import { projects } from '@/data/projects';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { desktopQuery } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { frameEdge } from '@/lib/images';

type Panel =
  | { kind: 'intro' }
  | { kind: 'text'; index: string; title: string; body: string }
  | { kind: 'image'; src: string; alt: string; width: number; height: number; caption: string; portrait?: boolean };

const capabilities = [
  ['Art direction', 'A clear visual idea first — type, rhythm, imagery — before a single component.'],
  ['Design systems', 'Tokens, spacing and components that keep a site coherent as it grows.'],
  ['Front-end engineering', 'Next.js, TypeScript and accessible markup, built to be maintained.'],
  ['Motion & interaction', 'Scroll choreography and micro-interactions that guide, never distract.'],
  ['Performance & SEO', 'Optimised media, semantic structure and metadata that search engines read.'],
  ['Launch & support', 'Deployment on Vercel, analytics hooks and a handover you can build on.'],
] as const;

const buildPanels = (): Panel[] => {
  const ss = projects.find((p) => p.slug === 'ss-builders');
  const belin = projects.find((p) => p.slug === 'belin-dentistry');
  const panels: Panel[] = [{ kind: 'intro' }];
  capabilities.forEach(([title, body], i) => {
    panels.push({ kind: 'text', index: String(i + 1).padStart(2, '0'), title, body });
    if (i === 0 && ss?.previews?.[0])
      panels.push({ kind: 'image', ...ss.previews[0], caption: 'SS Builders — mobile', portrait: true });
    if (i === 2 && belin?.cover)
      panels.push({ kind: 'image', ...belin.cover, caption: 'Belin Dentistry — homepage' });
    if (i === 4 && ss?.previews?.[1])
      panels.push({ kind: 'image', ...ss.previews[1], caption: 'SS Builders — detail' });
  });
  return panels;
};

const PANELS = buildPanels();

/**
 * Pinned horizontal gallery on desktop (vertical scroll drives horizontal
 * motion); natural swipeable row on smaller screens and for reduced motion.
 */
export default function HorizontalGallery() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const isDesktop = useMediaQuery(desktopQuery, false);
  const [pinned, setPinned] = useState(false);

  // Layout effect: ScrollTrigger pinning re-parents the section inside a spacer, so the
  // cleanup must run before React removes the node on unmount.
  useIsomorphicLayoutEffect(() => {
    const root = section.current;
    const trackEl = track.current;
    if (!root || !trackEl) return;
    const media = gsap.matchMedia();
    media.add(`${desktopQuery} and (prefers-reduced-motion: no-preference)`, () => {
      setPinned(true);
      const distance = () => trackEl.scrollWidth - window.innerWidth;
      const tween = gsap.to(trackEl, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progress.current) progress.current.style.transform = `scaleX(${self.progress})`;
            if (counter.current) {
              const current = Math.min(
                PANELS.length,
                Math.max(1, Math.round(self.progress * (PANELS.length - 1)) + 1),
              );
              counter.current.textContent = String(current).padStart(2, '0');
            }
          },
        },
      });
      gsap.utils.toArray<HTMLElement>('.hg-figure', trackEl).forEach((figure, i) => {
        const drift = 22 + (i % 2) * 14;
        gsap.fromTo(
          figure,
          { y: drift },
          {
            y: -drift,
            ease: 'none',
            scrollTrigger: {
              trigger: figure,
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        );
      });
      gsap.from(root.querySelectorAll('.hg-head'), {
        y: 30,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: root, start: 'top 70%', once: true },
      });
      return () => setPinned(false);
    });
    return () => media.revert();
  }, []);

  const horizontal = isDesktop && pinned;

  return (
    <section
      ref={section}
      className="relative overflow-hidden border-t border-line bg-bg py-16 lg:h-screen lg:py-0"
      aria-labelledby="gallery-heading"
    >
      <div className="container-x flex items-end justify-between lg:absolute lg:inset-x-0 lg:top-10 lg:z-10">
        <div>
          <p className="hg-head eyebrow mb-3">Studio capabilities</p>
          <h2 id="gallery-heading" className="hg-head font-heading text-h3 font-bold uppercase">
            What goes into a site
          </h2>
        </div>
        <p className="hg-head hidden font-heading text-sm font-bold tabular-nums text-muted lg:block">
          <span ref={counter}>01</span> / {String(PANELS.length).padStart(2, '0')}
        </p>
      </div>

      <div
        ref={track}
        className={cn(
          'mt-10 flex gap-6 lg:mt-0 lg:h-full lg:items-center lg:gap-10 lg:pl-[var(--gutter)] lg:pr-[var(--gutter)]',
          horizontal
            ? 'w-max will-change-transform'
            : 'snap-x snap-mandatory overflow-x-auto px-[var(--gutter)] pb-6 scroll-pl-[var(--gutter)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:overflow-visible',
        )}
      >
        {PANELS.map((panel, index) => {
          if (panel.kind === 'intro') {
            return (
              <article
                key="intro"
                className="flex w-[78vw] shrink-0 snap-start flex-col justify-end sm:w-[60vw] lg:h-[62vh] lg:w-[36vw]"
              >
                <p className="font-heading text-[clamp(2.5rem,6vw,6rem)] font-bold uppercase leading-[0.9]">
                  Every project, <span className="text-muted">end to end.</span>
                </p>
                <p className="mt-6 max-w-sm text-muted">
                  From the first sketch to deployment — a single studio responsible for design,
                  code and motion.
                </p>
              </article>
            );
          }
          if (panel.kind === 'text') {
            return (
              <article
                key={panel.title}
                className="flex w-[78vw] shrink-0 snap-start flex-col justify-between border-l border-line pl-6 sm:w-[48vw] lg:h-[62vh] lg:w-[26vw] lg:pl-8"
              >
                <span className="font-heading text-sm font-bold text-accent">({panel.index})</span>
                <div>
                  <h3 className="font-heading text-h3 font-bold uppercase">{panel.title}</h3>
                  <p className="mt-5 text-muted">{panel.body}</p>
                </div>
              </article>
            );
          }
          return (
            <figure
              key={`${panel.src}-${index}`}
              className={cn(
                'hg-figure relative shrink-0 snap-start overflow-hidden',
                frameEdge,
                panel.portrait
                  ? 'w-[58vw] sm:w-[34vw] lg:h-[62vh] lg:w-auto'
                  : 'w-[86vw] sm:w-[70vw] lg:h-[62vh] lg:w-auto',
              )}
              style={{ aspectRatio: `${panel.width} / ${panel.height}` }}
            >
              <div className="absolute inset-0">
                <Image
                  src={panel.src}
                  alt={panel.alt}
                  fill
                  sizes="(min-width: 1024px) 60vw, 90vw"
                  className="object-cover object-top"
                />
              </div>
              <figcaption className="absolute bottom-4 left-4 rounded-full bg-bg/80 px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-fg backdrop-blur-sm">
                {panel.caption}
              </figcaption>
            </figure>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-[var(--gutter)] bottom-8 hidden h-px bg-line lg:block">
        <div ref={progress} className="h-full w-full origin-left bg-accent" style={{ transform: 'scaleX(0)' }} />
      </div>
    </section>
  );
}
