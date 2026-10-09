import type { Project } from '@/data/projects';
import { cn } from '@/lib/utils';

interface Props {
  project: Project;
  className?: string;
  compact?: boolean;
}

/**
 * Honest, typographic stand-in used until real screenshots are supplied. It is
 * deliberately not styled to look like a website capture.
 */
export default function ProjectPlaceholder({ project, className, compact = false }: Props) {
  const { monogram, motif, caption } = project.placeholder;
  return (
    <div
      className={cn(
        'relative flex h-full w-full flex-col justify-between overflow-hidden bg-bg-elevated p-6 text-fg md:p-10',
        className,
      )}
      role="img"
      aria-label={`${project.title} — ${caption}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(245,242,235,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,242,235,0.08) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
        aria-hidden="true"
      />
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        fill="none"
        stroke="rgba(245,242,235,0.22)"
        strokeWidth="0.25"
      >
        {motif === 'cross' ? (
          <>
            <path d="M50 0 V100" />
            <path d="M0 50 H100" />
            <circle cx="50" cy="50" r="22" vectorEffect="non-scaling-stroke" />
          </>
        ) : null}
        {motif === 'lines' ? (
          <>
            <path d="M0 20 H100" />
            <path d="M0 40 H70" />
            <path d="M30 60 H100" />
            <path d="M0 80 H100" />
          </>
        ) : null}
        {motif === 'grid' ? (
          <>
            <path d="M20 0 V100" />
            <path d="M80 0 V100" />
            <path d="M0 30 H100" />
            <path d="M0 70 H100" />
          </>
        ) : null}
        {motif === 'arc' ? (
          <>
            <path d="M0 100 Q50 0 100 100" />
            <path d="M15 100 Q50 30 85 100" />
          </>
        ) : null}
      </svg>

      <div className="relative flex items-start justify-between">
        <span className="eyebrow">{project.category}</span>
        <span className="font-heading text-sm font-bold text-muted">{project.number}</span>
      </div>

      <div className="relative">
        <span
          className={cn(
            'block font-heading font-bold uppercase leading-none tracking-[-0.06em] text-transparent',
            compact ? 'text-[clamp(3rem,10vw,6rem)]' : 'text-[clamp(5rem,16vw,14rem)]',
          )}
          style={{ WebkitTextStroke: '1px rgba(245,242,235,0.55)' }}
          aria-hidden="true"
        >
          {monogram}
        </span>
      </div>

      <div className="relative flex items-end justify-between gap-4">
        <span className="font-heading text-sm font-bold uppercase tracking-wide">
          {project.shortTitle}
        </span>
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          {caption}
        </span>
      </div>
    </div>
  );
}
