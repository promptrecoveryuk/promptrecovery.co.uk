import path from 'node:path';

import type { AreaMeta } from '@/types';

import { getCollectionMeta, getCollectionSlugs, getMdxContent, getMdxMeta } from './mdx-collections';

const areasDirectory = path.join(process.cwd(), 'src/content/areas');

/**
 * Lists every area page stored in `src/content/areas`.
 */
export function getAreaSlugs(): string[] {
  return getCollectionSlugs(areasDirectory);
}

/**
 * Returns the typed frontmatter for a single area page.
 */
export function getAreaMeta(slug: string): AreaMeta {
  return getMdxMeta(areasDirectory, slug, parseAreaFrontmatter);
}

/**
 * Returns both the parsed frontmatter and MDX body for a single area page.
 */
export function getAreaContent(slug: string) {
  return getMdxContent(areasDirectory, slug, parseAreaFrontmatter);
}

/**
 * Returns all area metadata sorted newest-first for listing/related content.
 */
export function getAllAreasMeta(): AreaMeta[] {
  return getCollectionMeta(areasDirectory, parseAreaFrontmatter).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Narrows raw gray-matter output into the `AreaMeta` shape expected by the
 * route layer.
 */
function parseAreaFrontmatter(slug: string, data: Record<string, unknown>): AreaMeta {
  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    description: data.description as string,
    imageIndex: data.imageIndex as number,
    author: (data.author as string) ?? 'Nick',
    faqs: Array.isArray(data.faqs) ? data.faqs : undefined,
  };
}
