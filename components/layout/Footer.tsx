'use client';

import { ArrowUp } from 'lucide-react';
import { siteConfig, socialLinks } from '@/data/site-config';
import { scrollTo } from '@/lib/lenis-store';
import TransitionLink from './TransitionLink';
import FlipText from '@/components/ui/FlipText';
import TextReveal from '@/components/animations/TextReveal';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line bg-bg" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container-x grid gap-12 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-5">
          <TransitionLink href="/" className="font-heading text-lg font-bold uppercase tracking-tight">
            {siteConfig.name}
          </TransitionLink>
          <p className="mt-5 max-w-sm text-muted">{siteConfig.description}</p>
          <p className="mt-6 text-sm text-muted">{siteConfig.location}</p>
        </div>

        <nav className="md:col-span-3" aria-label="Footer">
          <p className="eyebrow mb-5">Navigate</p>
          <ul className="grid gap-3">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <TransitionLink href={item.href} className="text-fg">
                  <FlipText>{item.label}</FlipText>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="eyebrow mb-5">Connect</p>
          <ul className="grid gap-3">
            <li>
              <a href={`mailto:${siteConfig.email}`} className="link-underline break-all text-fg">
                {siteConfig.email}
              </a>
            </li>
            {socialLinks.map((social) => (
              <li key={social.key}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-fg"
                >
                  <FlipText>{social.label}</FlipText>
                  <span className="text-muted transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-x overflow-hidden pb-6">
        <TextReveal
          as="p"
          type="chars"
          stagger={0.03}
          start="top 95%"
          className="font-heading text-[clamp(4rem,19vw,22rem)] font-bold uppercase leading-[0.8] tracking-[-0.05em] text-fg/90"
          aria-hidden="true"
        >
          {siteConfig.name}
        </TextReveal>
      </div>

      <div className="container-x flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 text-sm text-muted">
        <p>
          © {year} {siteConfig.legalName}. All rights reserved.
        </p>
        <button
          type="button"
          onClick={() => scrollTo(0)}
          className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
        >
          <FlipText>Back to top</FlipText>
          <ArrowUp
            size={14}
            className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1"
            aria-hidden="true"
          />
        </button>
      </div>
    </footer>
  );
}
