'use client';

import Link from 'next/link';
import type { ComponentProps, MouseEvent } from 'react';
import { usePathname } from 'next/navigation';
import { usePageTransition } from './PageTransition';
import { scrollTo } from '@/lib/lenis-store';

type Props = ComponentProps<typeof Link> & { href: string };

/**
 * Drop-in replacement for next/link that routes internal navigations through the
 * page transition and turns same-page hash links into smooth scrolls.
 */
export default function TransitionLink({ href, onClick, children, ...rest }: Props) {
  const { navigate } = usePageTransition();
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      rest.target === '_blank'
    )
      return;
    if (/^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    const [path, hash] = href.split('#');
    const targetPath = path || pathname;

    if (hash && targetPath === pathname) {
      event.preventDefault();
      const target = document.getElementById(hash);
      if (target) {
        scrollTo(target, -72);
        window.history.replaceState(null, '', `#${hash}`);
      }
      return;
    }

    if (targetPath === pathname && !hash) {
      event.preventDefault();
      scrollTo(0);
      return;
    }

    event.preventDefault();
    navigate(href);
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
