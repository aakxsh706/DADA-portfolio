'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';

interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  /** Parallax amount: 0 = none, 1 = strong. */
  speed?: number;
  /** Extra zoom so the moving image never exposes its container edges. */
  scale?: number;
  className?: string;
  imgClassName?: string;
}

/** Image that drifts vertically at a different speed from the page as it scrolls. */
export default function ParallaxImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes = '100vw',
  priority = false,
  quality = 80,
  speed = 0.5,
  scale = 1.18,
  className,
  imgClassName,
}: Props) {
  const wrapper = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!wrapper.current || !img.current || speed === 0) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const amount = 9 * speed;
      gsap.fromTo(
        img.current,
        { yPercent: -amount, scale },
        {
          yPercent: amount,
          scale,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    });
    return () => media.revert();
  }, [speed, scale]);

  return (
    <div
      ref={wrapper}
      className={cn(fill ? 'absolute inset-0' : 'relative', 'overflow-hidden', className)}
    >
      <Image
        ref={img}
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        quality={quality}
        className={cn('h-full w-full object-cover will-change-transform', imgClassName)}
      />
    </div>
  );
}
