import { cn } from '@/lib/utils';

/** Label that flips upward on hover (duplicate copy slides in from below). */
export default function FlipText({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn('flip-text', className)}>
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}
