'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { siteConfig, socialLinks } from '@/data/site-config';
import { startScroll, stopScroll } from '@/lib/lenis-store';
import { cn } from '@/lib/utils';
import TransitionLink from './TransitionLink';
import MagneticButton from '@/components/ui/MagneticButton';
import FlipText from '@/components/ui/FlipText';
import { usePreloader } from './PreloaderProvider';

/**
 * Sticky navigation that compacts and gains a translucent background after the
 * first scroll, plus a full-screen animated menu on small screens.
 */
export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const { done } = usePreloader();

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 48,
      end: 'max',
      onToggle: (self) => setScrolled(self.isActive),
    });
    return () => trigger.kill();
  }, []);

  // Entrance after the preloader finishes.
  useEffect(() => {
    if (!done || !header.current) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        header.current,
        { y: -24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', delay: 0.35 },
      );
    });
    media.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(header.current, { autoAlpha: 1 });
    });
    return () => media.revert();
  }, [done]);

  // Scroll locking, focus and Escape key while the menu is open.
  useEffect(() => {
    if (open) {
      stopScroll();
      document.body.style.overflow = 'hidden';
      closeButton.current?.focus();
    } else {
      startScroll();
      document.body.style.overflow = '';
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header
        ref={header}
        className={cn(
          'fixed inset-x-0 top-0 z-[70] transition-[background-color,border-color,backdrop-filter] duration-500 ease-[var(--ease-out-expo)]',
          scrolled && !open
            ? 'border-b border-line bg-bg/75 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent',
          !done && 'invisible',
        )}
        data-scrolled={scrolled}
      >
        <nav
          aria-label="Primary"
          className={cn(
            'container-x flex items-center justify-between transition-[height] duration-500 ease-[var(--ease-out-expo)]',
            scrolled ? 'h-14 md:h-16' : 'h-20 md:h-24',
          )}
        >
          <TransitionLink
            href="/"
            className="group flex items-center gap-2 font-heading text-base font-bold uppercase tracking-tight"
            aria-label={`${siteConfig.name} — home`}
          >
            <span>{siteConfig.name}</span>
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-150"
              aria-hidden="true"
            />
          </TransitionLink>

          <ul className="hidden items-center gap-10 md:flex">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <TransitionLink
                  href={item.href}
                  className="text-sm font-medium tracking-wide text-muted transition-colors hover:text-fg"
                >
                  <FlipText>{item.label}</FlipText>
                </TransitionLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <MagneticButton href="/#contact" variant="outline" size="sm">
                Let&apos;s talk
                <ArrowUpRight size={14} aria-hidden="true" />
              </MagneticButton>
            </div>
            <button
              type="button"
              className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-line-strong md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <span
                className={cn(
                  'absolute h-px w-4 bg-fg transition-transform duration-500 ease-[var(--ease-out-expo)]',
                  open ? 'rotate-45' : '-translate-y-[3px]',
                )}
              />
              <span
                className={cn(
                  'absolute h-px w-4 bg-fg transition-transform duration-500 ease-[var(--ease-out-expo)]',
                  open ? '-rotate-45' : 'translate-y-[3px]',
                )}
              />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            key="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.87, 0, 0.13, 1] }}
            className="fixed inset-0 z-[65] flex flex-col bg-bg md:hidden"
          >
            <div className="container-x flex h-20 items-center justify-between">
              <span className="font-heading text-base font-bold uppercase">{siteConfig.name}</span>
              <button
                ref={closeButton}
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-line-strong px-4 py-2 text-xs font-medium uppercase tracking-[0.14em]"
              >
                Close
              </button>
            </div>
            <ul className="container-x flex flex-1 flex-col justify-center gap-2">
              {siteConfig.nav.map((item, index) => (
                <motion.li
                  key={item.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ delay: 0.25 + index * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden border-b border-line"
                >
                  <TransitionLink
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between py-4 font-heading text-h1 font-bold uppercase"
                  >
                    <span>{item.label}</span>
                    <span className="font-heading text-sm text-muted">0{index + 1}</span>
                  </TransitionLink>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="container-x flex flex-wrap items-end justify-between gap-6 pb-10"
            >
              <a href={`mailto:${siteConfig.email}`} className="link-underline text-sm text-muted">
                {siteConfig.email}
              </a>
              {socialLinks.length > 0 ? (
                <ul className="flex gap-5">
                  {socialLinks.map((social) => (
                    <li key={social.key}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline text-sm text-muted"
                      >
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
