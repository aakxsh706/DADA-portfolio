'use client';

import type { ElementType, ReactNode } from 'react';
import TextReveal from './TextReveal';
import { cn } from '@/lib/utils';

type Size = 'display' | 'display-sm' | 'h1' | 'h2' | 'h3';

interface Props {
  as?: ElementType;
  size?: Size;
  children: ReactNode;
  className?: string;
  trigger?: 'scroll' | 'manual';
  play?: boolean;
  delay?: number;
  stagger?: number;
  id?: string;
  type?: 'lines' | 'words' | 'chars';
}

const sizeClass: Record<Size, string> = {
  display: 'text-display',
  'display-sm': 'text-display-sm',
  h1: 'text-h1',
  h2: 'text-h2',
  h3: 'text-h3',
};

/** Oversized heading with a masked line-by-line reveal. */
export default function AnimatedHeading({
  as = 'h2',
  size = 'h2',
  children,
  className,
  trigger = 'scroll',
  play,
  delay,
  stagger,
  id,
  type = 'lines',
}: Props) {
  return (
    <TextReveal
      as={as}
      id={id}
      type={type}
      trigger={trigger}
      play={play}
      delay={delay}
      stagger={stagger}
      className={cn('font-heading uppercase', sizeClass[size], className)}
    >
      {children}
    </TextReveal>
  );
}
