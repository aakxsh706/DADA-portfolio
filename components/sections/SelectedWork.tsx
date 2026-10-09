import { projects } from '@/data/projects';
import AnimatedHeading from '@/components/animations/AnimatedHeading';
import TextReveal from '@/components/animations/TextReveal';
import SectionTransition from '@/components/animations/SectionTransition';
import ProjectShowcase from '@/components/projects/ProjectShowcase';

export default function SelectedWork() {
  return (
    <section id="work" className="section-y scroll-mt-20" aria-labelledby="work-heading">
      <SectionTransition index="02" label="Selected work" className="mb-[clamp(4rem,8vw,8rem)]" />
      <div className="container-x mb-[clamp(5rem,10vw,9rem)] grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <AnimatedHeading as="h2" id="work-heading" size="display-sm">
            Selected work.
          </AnimatedHeading>
        </div>
        <div className="flex items-end justify-between gap-6 lg:col-span-4 lg:flex-col lg:items-end">
          <TextReveal as="p" type="lines" className="text-lead max-w-xs text-muted lg:text-right">
            A collection of digital experiences we&apos;ve brought to life.
          </TextReveal>
          <span className="font-heading text-sm font-bold text-muted">
            ({String(projects.length).padStart(2, '0')})
          </span>
        </div>
      </div>
      <ProjectShowcase projects={projects} />
    </section>
  );
}
