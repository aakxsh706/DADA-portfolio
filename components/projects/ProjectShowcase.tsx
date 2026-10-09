'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Project, ProjectImage } from '@/data/projects';
import { gsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';
import TransitionLink from '@/components/layout/TransitionLink';
import ImageReveal from '@/components/animations/ImageReveal';
import MagneticButton from '@/components/ui/MagneticButton';
import ArrowIcon from '@/components/ui/ArrowIcon';
import ProjectVisual from './ProjectVisual';

type RevealFrom = 'bottom' | 'left' | 'right' | 'top';

interface Props {
  projects: Project[];
}

/** Full-width editorial showcase; each project uses a different composition. */
export default function ProjectShowcase({ projects }: Props) {
  return (
    <div className="grid gap-[clamp(6rem,14vw,12rem)]">
      {projects.map((project, index) => (
        <ProjectItem key={project.slug} project={project} index={index} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Building blocks                                                      */
/* ------------------------------------------------------------------ */

function Visual({
  project,
  href,
  from,
  aspect,
  className,
  sizes,
  image,
  speed,
  delay,
  compact,
}: {
  project: Project;
  href: string;
  from: RevealFrom;
  aspect: string;
  className?: string;
  sizes?: string;
  image?: ProjectImage;
  speed?: number;
  delay?: number;
  compact?: boolean;
}) {
  return (
    <TransitionLink
      href={href}
      className={cn('group/visual relative block', className)}
      aria-label={`View project: ${project.title}`}
      data-cursor="view"
    >
      <ImageReveal from={from} className={cn('relative w-full', aspect)} delay={delay}>
        <div className="absolute inset-0">
          <div className="h-full w-full transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover/visual:scale-[1.03]">
            <ProjectVisual project={project} image={image} sizes={sizes} speed={speed} compact={compact} />
          </div>
        </div>
      </ImageReveal>
    </TransitionLink>
  );
}

function LiveLink({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
    >
      <span className="link-underline">Live site</span>
      <ArrowUpRight
        size={14}
        className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </a>
  );
}

function Meta({ project, href, className }: { project: Project; href: string; className?: string }) {
  return (
    <div className={cn('flex flex-col', className)}>
      <div className="pj-meta flex items-baseline gap-4">
        <span className="font-heading text-sm font-bold text-accent">({project.number})</span>
        <span className="eyebrow">{project.category}</span>
      </div>
      <h3 className="pj-meta mt-5 font-heading text-h2 font-bold uppercase">
        <TransitionLink href={href} className="transition-colors hover:text-accent">
          {project.shortTitle}
        </TransitionLink>
      </h3>
      <p className="pj-meta mt-6 max-w-md text-muted">{project.description}</p>
      <div className="pj-meta mt-8 flex flex-wrap items-center gap-4">
        <MagneticButton href={href} variant="outline">
          View project
          <ArrowIcon />
        </MagneticButton>
        {project.url ? <LiveLink url={project.url} /> : null}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Item                                                                 */
/* ------------------------------------------------------------------ */

function ProjectItem({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(el.querySelectorAll('.pj-meta'), {
        y: 36,
        autoAlpha: 0,
        duration: 1.1,
        stagger: 0.09,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 72%', once: true },
      });
    });
    return () => media.revert();
  }, []);

  const href = `/projects/${project.slug}`;
  const from = (['bottom', 'left', 'bottom', 'right'] as const)[index % 4];

  if (project.layout === 'full') {
    return (
      <article ref={ref} className="container-x">
        <Visual
          project={project}
          href={href}
          from={from}
          aspect="aspect-[4/3] md:aspect-[16/9] xl:aspect-[21/9]"
          sizes="100vw"
        />
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="pj-meta lg:col-span-3">
            <span className="font-heading text-sm font-bold text-accent">({project.number})</span>
            <p className="eyebrow mt-3">{project.category}</p>
          </div>
          <h3 className="pj-meta font-heading text-h1 font-bold uppercase lg:col-span-5">
            <TransitionLink href={href} className="transition-colors hover:text-accent">
              {project.shortTitle}
            </TransitionLink>
          </h3>
          <div className="lg:col-span-4">
            <p className="pj-meta text-muted">{project.description}</p>
            <div className="pj-meta mt-8 flex flex-wrap items-center gap-4">
              <MagneticButton href={href} variant="outline">
                View project
                <ArrowIcon />
              </MagneticButton>
              {project.url ? <LiveLink url={project.url} /> : null}
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (project.layout === 'split') {
    return (
      <article ref={ref} className="container-x grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5 lg:pt-10">
          <Meta project={project} href={href} />
          {project.previews?.[0] ? (
            <Visual
              project={project}
              href={href}
              from="bottom"
              aspect="aspect-[9/16]"
              className="mt-12 hidden w-[42%] lg:block"
              image={project.previews[0]}
              sizes="20vw"
              speed={0.3}
              delay={0.15}
            />
          ) : null}
        </div>
        <div className="lg:col-span-7">
          <Visual
            project={project}
            href={href}
            from={from}
            aspect="aspect-[4/3] lg:aspect-[4/5]"
            sizes="(min-width: 1024px) 58vw, 100vw"
          />
        </div>
      </article>
    );
  }

  const imageLeft = project.layout === 'left';
  return (
    <article ref={ref} className="container-x grid gap-10 lg:grid-cols-12 lg:gap-8">
      <div className={cn('lg:col-span-8', imageLeft ? 'lg:order-1' : 'lg:order-2')}>
        <Visual project={project} href={href} from={from} aspect="aspect-[4/3] lg:aspect-[16/10]" />
      </div>
      <div className={cn('flex lg:col-span-4 lg:items-end', imageLeft ? 'lg:order-2' : 'lg:order-1')}>
        <Meta project={project} href={href} />
      </div>
    </article>
  );
}
