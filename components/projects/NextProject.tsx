import type { Project } from '@/data/projects';
import TransitionLink from '@/components/layout/TransitionLink';
import ProjectVisual from './ProjectVisual';
import ArrowIcon from '@/components/ui/ArrowIcon';
import ParallaxFrame from '@/components/animations/ParallaxFrame';
import { aspectStyle, frameEdge } from '@/lib/images';
import { cn } from '@/lib/utils';

export default function NextProject({ project }: { project: Project }) {
  return (
    <section className="border-t border-line" aria-labelledby="next-project">
      <TransitionLink
        href={`/projects/${project.slug}`}
        className="group container-x grid gap-10 py-16 md:grid-cols-12 md:items-center md:py-24"
        data-cursor="view"
      >
        <div className="md:col-span-7">
          <p className="eyebrow mb-6">Next project</p>
          <h2
            id="next-project"
            className="font-heading text-display-sm font-bold uppercase transition-colors duration-500 group-hover:text-accent"
          >
            {project.shortTitle}
          </h2>
          <p className="mt-6 inline-flex items-center gap-3 text-muted">
            {project.category}
            <ArrowIcon direction="right" />
          </p>
        </div>
        <ParallaxFrame speed={0.4} className="md:col-span-5">
          <div
            className={cn('relative overflow-hidden', !project.cover && 'aspect-[4/3]', project.cover && frameEdge)}
            style={aspectStyle(project.cover)}
          >
            <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.02]">
              <ProjectVisual project={project} sizes="(min-width: 768px) 40vw, 100vw" compact />
            </div>
          </div>
        </ParallaxFrame>
      </TransitionLink>
    </section>
  );
}
