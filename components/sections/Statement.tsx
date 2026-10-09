'use client';

import { useRef } from 'react';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { gsap } from '@/lib/gsap';

const STATEMENT = 'Good design gets attention. Great experiences get remembered.';

/**
 * Full-viewport typographic interlude. The statement is revealed word by word
 * while the background drifts from charcoal to warm off-white, handing over to
 * the light contact section that follows.
 */
export default function Statement() {
  const section = useRef<HTMLElement>(null);
  const words = STATEMENT.split(' ');

  // Layout effect: ScrollTrigger pinning re-parents the section inside a spacer, so the
  // cleanup must run before React removes the node on unmount.
  useIsomorphicLayoutEffect(() => {
    const root = section.current;
    if (!root) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const wordEls = root.querySelectorAll('.stmt-word');
      gsap.set(wordEls, { opacity: 0.12 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });
      // Words first; then the surface drifts light while the ink flips quickly at the
      // midpoint so the text never sits in a low-contrast grey-on-grey state.
      tl.to(wordEls, { opacity: 1, stagger: 0.12, duration: 0.6, ease: 'none' }, 0)
        .to(root, { '--surface': '#f5f2eb', duration: 1.2, ease: 'power1.inOut' }, '>-0.4')
        .to(root, { '--ink': '#101010', duration: 0.15, ease: 'none' }, '<0.55');
    });
    return () => media.revert();
  }, []);

  return (
    <section
      ref={section}
      className="relative flex min-h-[100svh] items-center overflow-hidden"
      style={{ background: 'var(--surface)', color: 'var(--ink)' }}
      aria-label="Studio statement"
    >
      <div className="container-x w-full py-24">
        <p className="eyebrow mb-8" style={{ color: 'inherit', opacity: 0.6 }}>
          Why it matters
        </p>
        <h2 className="font-heading text-[clamp(2.6rem,7.5vw,9rem)] font-bold uppercase leading-[0.95] tracking-[-0.04em]">
          <span className="sr-only">{STATEMENT}</span>
          <span aria-hidden="true">
            {words.map((word, index) => (
              <span key={`${word}-${index}`} className="stmt-word inline-block">
                {word}
                {index < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>
        </h2>
      </div>
    </section>
  );
}
