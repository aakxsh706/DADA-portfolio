/**
 * Central site configuration.
 *
 * Everything marked PLACEHOLDER should be replaced before launch. Values can be
 * overridden without code changes through the NEXT_PUBLIC_* environment variables
 * listed in `.env.example`.
 */

/* Env vars must be referenced statically so Next.js can inline them in client bundles. */
const pick = (value: string | undefined, fallback = ''): string =>
  value && value.trim().length > 0 ? value.trim() : fallback;

export const siteConfig = {
  /** PLACEHOLDER — studio / portfolio name used in the wordmark, titles and footer. */
  name: pick(process.env.NEXT_PUBLIC_SITE_NAME, 'Studio'),
  /** Short legal / display name used in the copyright line. */
  legalName: pick(process.env.NEXT_PUBLIC_SITE_LEGAL_NAME, pick(process.env.NEXT_PUBLIC_SITE_NAME, 'Studio')),
  tagline: 'Independent web development studio',
  description:
    'Independent web development studio crafting distinctive websites, digital identities, and interactive experiences for ambitious clients.',
  /** Public URL used for canonical links, sitemap and Open Graph. */
  url: pick(process.env.NEXT_PUBLIC_SITE_URL, 'http://localhost:3000'),
  locale: 'en_IN',
  /** PLACEHOLDER — contact email shown in the contact section and used for mailto links. */
  email: pick(process.env.NEXT_PUBLIC_CONTACT_EMAIL, 'hello@yourstudio.com'),
  /**
   * PLACEHOLDER — WhatsApp number in international format without "+" or spaces,
   * e.g. 919876543210. Leave empty to hide the WhatsApp call to action.
   */
  whatsapp: pick(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
  whatsappMessage: 'Hi! I would like to talk about a web project.',
  /** PLACEHOLDER — social profiles. Empty values are not rendered (no broken links). */
  socials: {
    github: pick(process.env.NEXT_PUBLIC_GITHUB_URL),
    linkedin: pick(process.env.NEXT_PUBLIC_LINKEDIN_URL),
    instagram: pick(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  },
  availability: 'Available for freelance projects',
  location: pick(process.env.NEXT_PUBLIC_LOCATION, 'Chennai, India'),
  nav: [
    { label: 'Work', href: '/#work' },
    { label: 'Approach', href: '/#approach' },
    { label: 'Services', href: '/#services' },
    { label: 'Contact', href: '/#contact' },
  ],
  contactForm: {
    projectTypes: [
      'Portfolio website',
      'Business website',
      'Interactive experience',
      'Redesign of an existing site',
      'Something else',
    ],
    budgets: ['Not sure yet', 'Under ₹50k', '₹50k – ₹1.5L', '₹1.5L – ₹5L', '₹5L and above'],
  },
} as const;

export type SiteConfig = typeof siteConfig;

export const isPlaceholderEmail = siteConfig.email === 'hello@yourstudio.com';

export const socialLinks = (
  Object.entries(siteConfig.socials) as [keyof typeof siteConfig.socials, string][]
)
  .filter(([, href]) => href.length > 0)
  .map(([key, href]) => ({
    key,
    href,
    label: key === 'github' ? 'GitHub' : key === 'linkedin' ? 'LinkedIn' : 'Instagram',
  }));

export const whatsappHref = siteConfig.whatsapp
  ? `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`
  : null;
