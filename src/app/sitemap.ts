import type { MetadataRoute } from 'next';

import { getAreaContent, getAreaSlugs } from '../lib/areas';
import { getPostContent, getPostSlugs } from '../lib/posts';
import { getServiceContent, getServiceSlugs } from '../lib/services';
import { seo } from './data/index';

// Required for `output: 'export'` — see https://github.com/vercel/next.js/issues/68667
export const dynamic = 'force-static';

// Get sitemap details for blog posts
const blogPostSitemapEntries: MetadataRoute.Sitemap = getPostSlugs().map((slug) => {
  const { meta } = getPostContent(slug);
  return {
    url: `${seo.url}/blog/${slug}/`,
    lastModified: new Date(meta.modified),
    changeFrequency: 'monthly',
    priority: 0.7,
  };
});

// Get sitemap details for area pages
const areaPageSitemapEntries: MetadataRoute.Sitemap = getAreaSlugs().map((slug) => {
  const { meta } = getAreaContent(slug);
  return {
    url: `${seo.url}/areas/${slug}/`,
    lastModified: new Date(meta.modified),
    changeFrequency: 'monthly',
    priority: 0.7,
  };
});

// Get sitemap details for service pages
const servicePageSitemapEntries: MetadataRoute.Sitemap = getServiceSlugs().map((slug) => {
  const { meta } = getServiceContent(slug);
  return {
    url: `${seo.url}/services/${slug}/`,
    lastModified: new Date(meta.modified),
    changeFrequency: 'monthly',
    priority: 0.7,
  };
});

/**
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-a-sitemap-using-code-js-ts
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${seo.url}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${seo.url}/about/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${seo.url}/services/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...servicePageSitemapEntries,
    {
      url: `${seo.url}/faqs/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${seo.url}/blog/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...blogPostSitemapEntries,
    {
      url: `${seo.url}/area/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...areaPageSitemapEntries,
  ];
}
