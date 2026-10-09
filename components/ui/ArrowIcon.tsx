import { ArrowUpRight, ArrowRight, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  direction?: 'up-right' | 'right' | 'down';
  className?: string;
  size?: number;
}

/**
 * Arrow that slides out of its mask and re-enters from the opposite corner when
 * the parent `.group` is hovered.
 */
export default function ArrowIcon({ direction = 'up-right', className, size = 16 }: Props) {
  const Icon = direction === 'right' ? ArrowRight : direction === 'down' ? ArrowDown : ArrowUpRight;
  const out =
    direction === 'right'
      ? 'group-hover:translate-x-[140%]'
      : direction === 'down'
        ? 'group-hover:translate-y-[140%]'
        : 'group-hover:translate-x-[140%] group-hover:-translate-y-[140%]';
  const start =
    direction === 'right'
      ? '-translate-x-[140%]'
      : direction === 'down'
        ? '-translate-y-[140%]'
        : '-translate-x-[140%] translate-y-[140%]';

  return (
    <span
      className={cn('relative inline-block shrink-0 overflow-hidden', className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Icon
        size={size}
        strokeWidth={2}
        className={cn(
          'absolute inset-0 transition-transform duration-500 ease-[var(--ease-out-expo)]',
          out,
        )}
      />
      <Icon
        size={size}
        strokeWidth={2}
        className={cn(
          'absolute inset-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0 group-hover:translate-y-0',
          start,
        )}
      />
    </span>
  );
}
