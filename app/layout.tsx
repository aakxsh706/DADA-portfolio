import type { Metadata, Viewport } from 'next';
import { DM_Sans, Space_Grotesk } from 'next/font/google';
import Script from 'next/script';
import { siteConfig } from '@/data/site-config';
import { PreloaderProvider } from '@/components/layout/PreloaderProvider';
import { PageTransitionProvider } from '@/components/layout/PageTransition';
import SmoothScroll from '@/components/layout/SmoothScroll';
import ScrollProgress from '@/components/layout/ScrollProgress';
import Preloader from '@/components/layout/Preloader';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import CustomCursor from '@/components/layout/CustomCursor';
import Grain from '@/components/layout/Grain';
import './globals.css';

/* Exactly two font families are used across the site. */
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const title = `${siteConfig.name} — Freelance Web Design & Development Studio`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'freelance web developer',
    'web design studio',
    'portfolio website design',
    'business website development',
    'interactive web experiences',
    'Next.js developer',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: '/',
    siteName: siteConfig.name,
    title,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#101010',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="bg-bg font-body text-fg antialiased">
        {/* Flags JS availability before paint so reveal-gated text is hidden only when it will animate. */}
        <Script id="js-flag" strategy="beforeInteractive">
          {`document.documentElement.classList.add('js')`}
        </Script>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:font-heading focus:text-sm focus:font-bold focus:uppercase focus:tracking-wide focus:text-bg"
        >
          Skip to content
        </a>
        <PreloaderProvider>
          <PageTransitionProvider>
            <SmoothScroll />
            <ScrollProgress />
            <Preloader />
            <Navigation />
            <main id="main">{children}</main>
            <Footer />
            <CustomCursor />
            <Grain />
          </PageTransitionProvider>
        </PreloaderProvider>
      </body>
    </html>
  );
}
