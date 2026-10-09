'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode, MouseEvent } from 'react';
import { gsap } from '@/lib/gsap';
import { finePointerQuery, reducedMotionQuery } from '@/lib/motion';
import { cn } from '@/lib/utils';
import TransitionLink from '@/components/layout/TransitionLink';

type Variant = 'solid' | 'outline' | 'accent' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  children: ReactNode;
  href?: string;
  external?: boolean;
  type?: 'button' | 'submit';
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  className?: string;
  variant?: Variant;
  size?: Size;
  /** How far the button follows the cursor (0–1). */
  strength?: number;
  ariaLabel?: string;
  'data-cursor'?: string;
}

const variants: Record<Variant, string> = {
  solid: 'bg-fg text-bg hover:bg-accent',
  outline: 'border border-line-strong text-fg hover:border-fg hover:bg-fg hover:text-bg',
  accent: 'bg-accent text-bg hover:bg-fg',
  ghost: 'text-fg hover:text-accent',
};

const sizes: Record<Size, string> = {
  sm: 'px-5 py-2.5 text-[0.7rem] gap-2',
  md: 'px-7 py-4 text-xs gap-3',
  lg: 'px-9 py-5 text-sm gap-4',
};

/**
 * Pill button that gently follows the cursor with a spring-like return. The pull
 * is applied to the whole button and, more subtly, to its label for extra depth.
 * Disabled automatically on touch devices and for reduced-motion users.
 */
export default function MagneticButton({
  children,
  href,
  external = false,
  type = 'button',
  onClick,
  disabled,
  className,
  variant = 'solid',
  size = 'md',
  strength = 0.35,
  ariaLabel,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const label = inner.current;
    if (!el || !label) return;
    if (!window.matchMedia(finePointerQuery).matches || window.matchMedia(reducedMotionQuery).matches)
      return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    const lxTo = gsap.quickTo(label, 'x', { duration: 0.6, ease: 'power3.out' });
    const lyTo = gsap.quickTo(label, 'y', { duration: 0.6, ease: 'power3.out' });

    const move = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
      lxTo(dx * strength * 0.45);
      lyTo(dy * strength * 0.45);
    };
    const leave = () => {
      gsap.to([el, label], { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.45)' });
    };

    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      gsap.killTweensOf([el, label]);
    };
  }, [strength]);

  const classes = cn(
    'group relative inline-flex select-none items-center justify-center rounded-full font-heading font-bold uppercase tracking-[0.14em] will-change-transform transition-colors duration-500 ease-[var(--ease-out-expo)]',
    variants[variant],
    sizes[size],
    disabled && 'pointer-events-none opacity-50',
    className,
  );

  const content = (
    <span ref={inner} className="inline-flex items-center gap-[inherit] will-change-transform">
      {children}
    </span>
  );

  if (href && external) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        aria-label={ariaLabel}
        onClick={onClick}
        {...rest}
      >
        {content}
      </a>
    );
  }

  if (href) {
    return (
      <TransitionLink
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={classes}
        aria-label={ariaLabel}
        onClick={onClick}
        {...rest}
      >
        {content}
      </TransitionLink>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...rest}
    >
      {content}
    </button>
  );
}
