/**
 * Central project data. Update titles, copy, links and image paths here — the
 * showcase, detail pages, sitemap and metadata all read from this file.
 *
 * Images live in `public/projects/<slug>/`. When `cover` is omitted the UI renders
 * an elegant typographic placeholder instead of a fake screenshot.
 */

export type ProjectLayout = 'left' | 'right' | 'full' | 'split';

export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  category: string;
  description: string;
  /** Starter overview copy. Describes the website itself, not client results. */
  overview: string[];
  /** Services the studio provided. Edit to match the real engagement. */
  services: string[];
  /** Live URL — omit when not available yet. */
  url?: string;
  year?: string;
  layout: ProjectLayout;
  /** Main visual. Real screenshot captured from the live website. */
  cover?: ProjectImage;
  /** Additional previews (mobile capture, detail crops…). */
  previews?: ProjectImage[];
  /** Placeholder styling used when no cover image exists yet. */
  placeholder: {
    monogram: string;
    motif: 'cross' | 'lines' | 'grid' | 'arc';
    caption: string;
  };
}

export const projects: Project[] = [
  {
    slug: 'mbbs-portfolio',
    number: '01',
    title: 'MBBS Portfolio',
    shortTitle: 'MBBS Portfolio',
    category: 'Personal Portfolio / Medical',
    description:
      "A thoughtfully designed portfolio experience showcasing a medical professional's journey, achievements, and expertise.",
    overview: [
      'A personal portfolio for a medical professional, structured around a clear narrative: background, training, achievements and areas of expertise.',
      'The layout favours calm typography and generous spacing so that credentials and milestones read with clarity rather than clutter.',
    ],
    services: ['Web design', 'Web development', 'Content structure'],
    layout: 'left',
    placeholder: {
      monogram: 'MB',
      motif: 'cross',
      caption: 'Preview coming soon',
    },
  },
  {
    slug: 'ddreams-interiors',
    number: '02',
    title: "D'dreams Interiors Website",
    shortTitle: "D'dreams Interiors",
    category: 'Interior Design / Business Website',
    description:
      'A refined digital presence designed to showcase interior spaces, design expertise, and creative vision.',
    overview: [
      "A business website for an interior design practice, built to let photography of finished spaces take centre stage.",
      'Editorial pacing, large imagery and restrained typography frame the studio’s work and make it simple to start a conversation.',
    ],
    services: ['Web design', 'Web development', 'Responsive build'],
    layout: 'right',
    placeholder: {
      monogram: 'DD',
      motif: 'lines',
      caption: 'Preview coming soon',
    },
  },
  {
    slug: 'ss-builders',
    number: '03',
    title: 'SS Builders',
    shortTitle: 'SS Builders',
    category: 'Construction / Corporate Website',
    description:
      'A professional web experience highlighting construction services, completed projects, and brand credibility.',
    overview: [
      'A corporate website for a Chennai-based construction and interiors company, presenting its services, completed projects and ways to get in touch.',
      'The site pairs architectural imagery with a structured, confident layout designed to build trust with prospective clients.',
    ],
    services: ['Web design', 'Web development', 'Project archive', 'Inquiry form'],
    url: 'https://ssbuilders18.com/',
    layout: 'full',
    cover: {
      src: '/projects/ss-builders/desktop-fold.jpg',
      alt: 'Screenshot of the SS Builders website homepage on a desktop screen',
      width: 1920,
      height: 1200,
    },
    previews: [
      {
        src: '/projects/ss-builders/mobile-fold.jpg',
        alt: 'Screenshot of the SS Builders website on a mobile screen',
        width: 780,
        height: 1688,
      },
      {
        src: '/projects/ss-builders/desktop-section.jpg',
        alt: 'Screenshot of a content section from the SS Builders website',
        width: 1920,
        height: 1200,
      },
    ],
    placeholder: { monogram: 'SS', motif: 'grid', caption: 'Preview coming soon' },
  },
  {
    slug: 'belin-dentistry',
    number: '04',
    title: 'Belin Dentistry',
    shortTitle: 'Belin Dentistry',
    category: 'Healthcare / Dental Website',
    description:
      'A welcoming and modern healthcare website focused on presenting dental services with clarity and trust.',
    overview: [
      'A healthcare website for a dental practice, organised so that visitors can understand services, meet the team and book an appointment without friction.',
      'A soft palette, legible type and clear calls to action keep the experience approachable for patients of every age.',
    ],
    services: ['Web design', 'Web development', 'Appointment call to action'],
    url: 'https://www.drbelinsdentistry.com/',
    layout: 'split',
    cover: {
      src: '/projects/belin-dentistry/desktop-fold.jpg',
      alt: 'Screenshot of the Belin Dentistry website homepage on a desktop screen',
      width: 1920,
      height: 1200,
    },
    previews: [
      {
        src: '/projects/belin-dentistry/mobile-fold.jpg',
        alt: 'Screenshot of the Belin Dentistry website on a mobile screen',
        width: 780,
        height: 1688,
      },
      {
        src: '/projects/belin-dentistry/desktop-section.jpg',
        alt: 'Screenshot of a content section from the Belin Dentistry website',
        width: 1920,
        height: 1200,
      },
    ],
    placeholder: { monogram: 'BD', motif: 'arc', caption: 'Preview coming soon' },
  },
];

export const getProject = (slug: string): Project | undefined =>
  projects.find((project) => project.slug === slug);

export const getNextProject = (slug: string): Project => {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
};
