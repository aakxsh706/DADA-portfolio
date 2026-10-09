import type { MetadataRoute } from 'next';
import { projects } from '@/data/projects';
import { siteConfig } from '@/data/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteConfig.url, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    ...projects.map((project) => ({
      url: `${siteConfig.url}/projects/${project.slug}`,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
  ];
}
