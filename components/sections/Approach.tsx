'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { pillars } from '@/data/services';
import { projects } from '@/data/projects';
import AnimatedHeading from '@/components/animations/AnimatedHeading';
import TextReveal from '@/components/animations/TextReveal';
import SectionTransition from '@/components/animations/SectionTransition';
import ParallaxImage from '@/components/animations/ParallaxImage';
import ImageReveal from '@/components/animations/ImageReveal';
import ArrowIcon from '@/components/ui/ArrowIcon';

export default function Approach() {
  const list = useRef<HTMLUListElement>(null);
  const preview = projects.find((p) => p.slug === 'belin-dentistry')?.previews?.[1];

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const rows = el.querySelectorAll<HTMLElement>('li');
      gsap.from(rows, {
        y: 40,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      });
      gsap.from(el.querySelectorAll('.row-line'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.4,
        stagger: 0.12,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      });
    });
    return () => media.revert();
  }, []);

  return (
    <section id="approach" className="section-y scroll-mt-20" aria-labelledby="approach-heading">
      <SectionTransition index="01" label="Our approach" className="mb-[clamp(4rem,8vw,8rem)]" />

      <div className="container-x grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          {preview ? (
            <ImageReveal from="bottom" className="aspect-[4/5] w-full max-w-sm">
              <div className="absolute inset-0">
                <ParallaxImage
                  src={preview.src}
                  alt={preview.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, 80vw"
                  speed={0.7}
                />
              </div>
            </ImageReveal>
          ) : null}
          <p className="eyebrow mt-6">Studio practice — design, build, motion</p>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <AnimatedHeading as="h2" id="approach-heading" size="h1">
            Not just websites. Digital experiences.
          </AnimatedHeading>
          <TextReveal
            as="p"
            type="words"
            fade
            className="text-lead mt-10 max-w-xl text-muted lg:ml-[18%]"
          >
            We combine thoughtful design, modern technology, and purposeful interactions to create
            websites that leave a lasting impression.
          </TextReveal>
        </div>
      </div>

      <ul ref={list} className="container-x mt-[clamp(5rem,10vw,9rem)] grid" aria-label="Service pillars">
        {pillars.map((pillar) => (
          <li key={pillar.number} className="group relative">
            <div className="row-line hairline" />
            <div className="grid gap-4 py-8 md:grid-cols-12 md:items-start md:py-10">
              <span className="font-heading text-sm font-bold text-muted transition-colors duration-500 group-hover:text-accent md:col-span-2">
                {pillar.number}
              </span>
              <h3 className="font-heading text-h3 font-bold uppercase transition-transform duration-700 ease-[var(--ease-out-expo)] md:col-span-5 md:group-hover:translate-x-4">
                {pillar.title}
              </h3>
              <div className="md:col-span-4">
                <p className="text-muted">{pillar.description}</p>
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-[var(--ease-out-expo)] group-hover:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <p className="pt-3 text-sm text-fg/80">
                      {pillar.number === '01'
                        ? 'Typography, layout, colour and imagery decided with intent.'
                        : pillar.number === '02'
                          ? 'Next.js, TypeScript and modern tooling, built for speed and longevity.'
                          : 'GSAP, scroll choreography and micro-interactions, tuned for 60 fps.'}
                    </p>
                  </div>
                </div>
              </div>
              <span className="hidden text-muted transition-colors duration-500 group-hover:text-fg md:col-span-1 md:flex md:justify-end">
                <ArrowIcon size={20} />
              </span>
            </div>
          </li>
        ))}
        <li aria-hidden="true">
          <div className="row-line hairline" />
        </li>
      </ul>
    </section>
  );
}
