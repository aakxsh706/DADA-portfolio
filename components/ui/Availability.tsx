import { cn } from '@/lib/utils';
import { siteConfig } from '@/data/site-config';

export default function Availability({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-3 text-sm text-muted', className)}>
      <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
      {siteConfig.availability}
    </span>
  );
}
