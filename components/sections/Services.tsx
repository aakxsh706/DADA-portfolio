'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from '@/lib/gsap';
import { services } from '@/data/services';
import { finePointerQuery } from '@/lib/motion';
import { cn } from '@/lib/utils';
import AnimatedHeading from '@/components/animations/AnimatedHeading';
import SectionTransition from '@/components/animations/SectionTransition';
import ArrowIcon from '@/components/ui/ArrowIcon';
import TransitionLink from '@/components/layout/TransitionLink';

export default function Services() {
  const section = useRef<HTMLElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const floater = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  // Staggered row entrance.
  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(el.querySelectorAll('.svc-row'), {
        y: 50,
        autoAlpha: 0,
        duration: 1.1,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      });
    });
    return () => media.revert();
  }, []);

  // Floating visual follows the cursor across the list (mouse users only).
  useEffect(() => {
    const root = section.current;
    const el = floater.current;
    const listEl = list.current;
    if (!root || !el || !listEl) return;
    const media = gsap.matchMedia();
    media.add(`${finePointerQuery} and (prefers-reduced-motion: no-preference)`, () => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3.out' });
      const move = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        xTo(event.clientX - rect.left);
        yTo(event.clientY - rect.top);
      };
      const enter = () => gsap.to(el, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'power3.out' });
      const leave = () => {
        gsap.to(el, { autoAlpha: 0, scale: 0.85, duration: 0.4 });
        setActive(null);
      };
      listEl.addEventListener('pointermove', move);
      listEl.addEventListener('pointerenter', enter);
      listEl.addEventListener('pointerleave', leave);
      return () => {
        listEl.removeEventListener('pointermove', move);
        listEl.removeEventListener('pointerenter', enter);
        listEl.removeEventListener('pointerleave', leave);
      };
    });
    return () => media.revert();
  }, []);

  return (
    <section
      ref={section}
      id="services"
      className="section-y relative scroll-mt-20"
      aria-labelledby="services-heading"
    >
      <SectionTransition index="03" label="Services" className="mb-[clamp(4rem,8vw,8rem)]" />
      <div className="container-x grid gap-8 lg:grid-cols-12 lg:items-end">
        <AnimatedHeading as="h2" id="services-heading" size="display-sm" className="lg:col-span-8">
          What we do.
        </AnimatedHeading>
        <p className="max-w-xs text-muted lg:col-span-4 lg:justify-self-end lg:text-right">
          Five ways we help brands, professionals and businesses show up well online.
        </p>
      </div>

      <ul ref={list} className="container-x mt-[clamp(4rem,8vw,7rem)]" aria-label="Services">
        {services.map((service, index) => (
          <li
            key={service.number}
            className="svc-row group relative border-t border-line last:border-b"
            onPointerEnter={() => setActive(index)}
          >
            <span
              className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-fg/[0.04] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
              aria-hidden="true"
            />
            <TransitionLink
              href="/#contact"
              className="relative grid gap-3 py-8 md:grid-cols-12 md:items-center md:py-10"
              aria-label={`${service.title} — start a project`}
            >
              <span className="font-heading text-sm font-bold text-muted transition-colors duration-500 group-hover:text-accent md:col-span-2">
                {service.number} /
              </span>
              <h3 className="font-heading text-h2 font-bold uppercase transition-transform duration-700 ease-[var(--ease-out-expo)] md:col-span-6 md:group-hover:translate-x-5">
                {service.title}
              </h3>
              <p className="text-muted md:col-span-3">{service.description}</p>
              <span className="hidden justify-end text-muted transition-colors duration-500 group-hover:text-fg md:col-span-1 md:flex">
                <ArrowIcon size={22} />
              </span>
            </TransitionLink>
          </li>
        ))}
      </ul>

      {/* Floating hover visual */}
      <div
        ref={floater}
        className="pointer-events-none absolute left-0 top-0 z-10 hidden h-[220px] w-[320px] -translate-x-1/2 -translate-y-1/2 scale-90 overflow-hidden rounded-2xl opacity-0 lg:block"
        aria-hidden="true"
      >
        {services.map((service, index) => (
          <div
            key={service.number}
            className={cn(
              'absolute inset-0 transition-opacity duration-500',
              active === index ? 'opacity-100' : 'opacity-0',
            )}
          >
            {'src' in service.visual ? (
              <Image
                src={service.visual.src}
                alt=""
                fill
                sizes="320px"
                className="object-cover object-top"
              />
            ) : (
              <div className="flex h-full w-full flex-col justify-between bg-fg p-6 text-bg">
                <span className="font-heading text-xs font-bold uppercase tracking-[0.18em]">
                  {service.number}
                </span>
                <span className="font-heading text-5xl font-bold uppercase leading-none">
                  {service.visual.label}
                  <span className="text-accent">.</span>
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
