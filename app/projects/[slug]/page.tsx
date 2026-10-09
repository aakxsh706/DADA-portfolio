import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { getNextProject, getProject, projects } from '@/data/projects';
import { siteConfig } from '@/data/site-config';
import AnimatedHeading from '@/components/animations/AnimatedHeading';
import TextReveal from '@/components/animations/TextReveal';
import ImageReveal from '@/components/animations/ImageReveal';
import ParallaxFrame from '@/components/animations/ParallaxFrame';
import { aspectStyle, frameEdge } from '@/lib/images';
import { cn } from '@/lib/utils';
import ProjectVisual from '@/components/projects/ProjectVisual';
import NextProject from '@/components/projects/NextProject';
import MagneticButton from '@/components/ui/MagneticButton';
import ArrowIcon from '@/components/ui/ArrowIcon';
import TransitionLink from '@/components/layout/TransitionLink';

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = `${project.title} — ${project.category}`;
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title,
      description: project.description,
      url: `/projects/${project.slug}`,
      type: 'article',
      ...(project.cover ? { images: [{ url: project.cover.src, alt: project.cover.alt }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: project.description,
      ...(project.cover ? { images: [project.cover.src] } : {}),
    },
  };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const next = getNextProject(project.slug);

  return (
    <article>
      {/* Introduction */}
      <header className="container-x pb-[clamp(3rem,6vw,6rem)] pt-32 md:pt-44">
        <TransitionLink
          href="/#work"
          className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
        >
          <span className="inline-block rotate-180 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-x-1">
            →
          </span>
          Back to selected work
        </TransitionLink>
        <div className="mt-10 flex flex-wrap items-baseline gap-4">
          <span className="font-heading text-sm font-bold text-accent">Project {project.number}</span>
          <span className="eyebrow">{project.category}</span>
        </div>
        <AnimatedHeading as="h1" size="display-sm" className="mt-6" trigger="scroll">
          {project.title}
        </AnimatedHeading>
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <TextReveal as="p" type="lines" className="text-lead max-w-2xl text-muted lg:col-span-8">
            {project.description}
          </TextReveal>
          <dl className="grid grid-cols-2 gap-6 text-sm lg:col-span-4">
            <div>
              <dt className="eyebrow mb-2">Services</dt>
              <dd className="text-fg">{project.services.join(', ')}</dd>
            </div>
            <div>
              <dt className="eyebrow mb-2">Live website</dt>
              <dd>
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-fg"
                  >
                    <span className="link-underline">{new URL(project.url).hostname}</span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                ) : (
                  <span className="text-muted">Not published yet</span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </header>

      {/* Hero image */}
      <div className="container-x">
        <ParallaxFrame speed={0.35}>
          <ImageReveal
            from="bottom"
            className={cn('relative w-full', !project.cover && 'aspect-[4/3] md:aspect-[16/9]', project.cover && frameEdge)}
            style={aspectStyle(project.cover)}
            start="top 90%"
          >
            <div className="absolute inset-0">
              <ProjectVisual project={project} sizes="100vw" priority />
            </div>
          </ImageReveal>
        </ParallaxFrame>
      </div>

      {/* Overview */}
      <section className="container-x section-y grid gap-12 lg:grid-cols-12" aria-labelledby="overview-heading">
        <div className="lg:col-span-4">
          <h2 id="overview-heading" className="eyebrow">
            Overview
          </h2>
        </div>
        <div className="grid gap-8 lg:col-span-7 lg:col-start-6">
          {project.overview.map((paragraph) => (
            <TextReveal key={paragraph} as="p" type="lines" className="text-lead text-fg/90">
              {paragraph}
            </TextReveal>
          ))}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="border-t border-line pt-4">
              <h3 className="eyebrow mb-3">Services provided</h3>
              <ul className="grid gap-1.5">
                {project.services.map((service) => (
                  <li key={service} className="text-fg">
                    {service}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-line pt-4">
              <h3 className="eyebrow mb-3">Category</h3>
              <p className="text-fg">{project.category}</p>
            </div>
          </div>
          {project.url ? (
            <div className="mt-6">
              <MagneticButton href={project.url} external variant="solid" size="lg">
                Visit live website
                <ArrowIcon />
              </MagneticButton>
            </div>
          ) : null}
        </div>
      </section>

      {/* Additional previews */}
      <section className="container-x pb-[clamp(5rem,10vw,10rem)]" aria-labelledby="previews-heading">
        <h2 id="previews-heading" className="eyebrow mb-8">
          Previews
        </h2>
        {project.previews && project.previews.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-12 md:items-start">
            <ParallaxFrame speed={0.8} className="md:col-span-4">
              <ImageReveal from="left" className={cn('relative', frameEdge)} style={aspectStyle(project.previews[0])}>
                <div className="absolute inset-0">
                  <ProjectVisual
                    project={project}
                    image={project.previews[0]}
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                </div>
              </ImageReveal>
            </ParallaxFrame>
            {project.previews[1] ? (
              <ParallaxFrame speed={0.4} className="md:col-span-8 md:mt-24">
                <ImageReveal from="right" className={cn('relative', frameEdge)} style={aspectStyle(project.previews[1])} delay={0.1}>
                  <div className="absolute inset-0">
                    <ProjectVisual
                      project={project}
                      image={project.previews[1]}
                      sizes="(min-width: 768px) 66vw, 100vw"
                    />
                  </div>
                </ImageReveal>
              </ParallaxFrame>
            ) : null}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-12">
            <div className="relative aspect-[4/5] md:col-span-5">
              <ProjectVisual project={project} compact />
            </div>
            <p className="max-w-sm text-muted md:col-span-6 md:col-start-7 md:self-end">
              Screenshots for this project will be added once they are supplied. Until then this
              page shows a placeholder rather than an invented preview.
            </p>
          </div>
        )}
      </section>

      <NextProject project={next} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: project.title,
            description: project.description,
            url: `${siteConfig.url}/projects/${project.slug}`,
            ...(project.url ? { sameAs: project.url } : {}),
            creator: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
          }),
        }}
      />
    </article>
  );
}
