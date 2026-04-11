import path from 'node:path';

import type { ServiceMeta } from '@/types';

import { getCollectionMeta, getCollectionSlugs, getMdxContent, getMdxMeta } from './mdx-collections';

const servicesDirectory = path.join(process.cwd(), 'src/content/services');

/**
 * Lists every individual service page stored in `src/content/services`.
 */
export function getServiceSlugs(): string[] {
  return getCollectionSlugs(servicesDirectory);
}

/**
 * Returns the typed frontmatter for a single service page.
 */
export function getServiceMeta(slug: string): ServiceMeta {
  return getMdxMeta(servicesDirectory, slug, parseServiceFrontmatter);
}

/**
 * Returns both the parsed frontmatter and MDX body for a single service page.
 */
export function getServiceContent(slug: string) {
  return getMdxContent(servicesDirectory, slug, parseServiceFrontmatter);
}

/**
 * Returns all service metadata sorted newest-first for listing/related content.
 */
export function getAllServicesMeta(): ServiceMeta[] {
  return getCollectionMeta(servicesDirectory, parseServiceFrontmatter).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Fast existence check for card-linking logic on the home/services pages.
 */
export function hasServicePage(slug: string): boolean {
  return getServiceSlugs().includes(slug);
}

function parseServiceFrontmatter(slug: string, data: Record<string, unknown>): ServiceMeta {
  const date = data.date as string;
  return {
    slug,
    title: data.title as string,
    date,
    modified: (data.modified as string) ?? date,
    description: data.description as string,
    imageIndex: data.imageIndex as number,
    author: (data.author as string) ?? 'Nick',
    faqs: Array.isArray(data.faqs) ? data.faqs : undefined,
    reviewIds: Array.isArray(data.reviewIds) ? (data.reviewIds as string[]) : undefined,
  };
}
