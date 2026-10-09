export interface Service {
  number: string;
  title: string;
  description: string;
  /** Visual revealed on hover (desktop). */
  visual: { src: string; alt: string } | { label: string };
}

export const services: Service[] = [
  {
    number: '01',
    title: 'Website Design',
    description:
      'Art direction, typography and layout systems that give a brand a distinctive presence on screen.',
    visual: { label: 'Design' },
  },
  {
    number: '02',
    title: 'Website Development',
    description:
      'Fast, accessible, maintainable builds with modern frameworks and careful attention to detail.',
    visual: { label: 'Build' },
  },
  {
    number: '03',
    title: 'Portfolio Websites',
    description:
      'Personal and professional portfolios that present work, credentials and story with clarity.',
    visual: { label: 'Portfolio' },
  },
  {
    number: '04',
    title: 'Business Websites',
    description:
      'Corporate and small-business websites designed to build trust and convert visitors into inquiries.',
    visual: { src: '/projects/ss-builders/desktop-fold.jpg', alt: 'SS Builders website' },
  },
  {
    number: '05',
    title: 'Interactive Web Experiences',
    description:
      'Scroll-driven storytelling, motion and micro-interactions that make a website memorable.',
    visual: { label: 'Motion' },
  },
];

export const pillars = [
  {
    number: '01',
    title: 'Web Design',
    description: 'Editorial layouts, expressive typography and a visual identity that fits the brand.',
  },
  {
    number: '02',
    title: 'Web Development',
    description: 'Clean, performant code built with modern tooling and a focus on accessibility.',
  },
  {
    number: '03',
    title: 'Interactive Experiences',
    description: 'Motion and interaction used with intent, to guide attention and reward exploration.',
  },
];
