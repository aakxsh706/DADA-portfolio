import type { Project, ProjectImage } from '@/data/projects';
import ParallaxImage from '@/components/animations/ParallaxImage';
import ProjectPlaceholder from './ProjectPlaceholder';
import { cn } from '@/lib/utils';

interface Props {
  project: Project;
  image?: ProjectImage;
  className?: string;
  sizes?: string;
  priority?: boolean;
  speed?: number;
  compact?: boolean;
}

/**
 * Renders the real screenshot when one exists, otherwise the placeholder. Fills
 * its nearest positioned ancestor, so wrap it in a `relative` box with a size
 * (an aspect-ratio box works).
 */
export default function ProjectVisual({
  project,
  image = project.cover,
  className,
  sizes = '(min-width: 1024px) 66vw, 100vw',
  priority = false,
  speed = 0,
  compact = false,
}: Props) {
  if (!image) {
    return (
      <div className={cn('absolute inset-0', className)}>
        <ProjectPlaceholder project={project} compact={compact} />
      </div>
    );
  }
  return (
    <ParallaxImage
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      speed={speed}
      className={className}
      imgClassName="object-top"
    />
  );
}
