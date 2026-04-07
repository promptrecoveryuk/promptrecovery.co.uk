import path from 'node:path';

import type { PostMeta } from '@/types';

import { getCollectionMeta, getCollectionSlugs, getMdxContent, getMdxMeta } from './mdx-collections';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

/**
 * Lists every blog post stored in `src/content/posts`.
 */
export function getPostSlugs(): string[] {
  return getCollectionSlugs(postsDirectory);
}

/**
 * Returns the typed frontmatter for a single post.
 */
export function getPostMeta(slug: string): PostMeta {
  return getMdxMeta(postsDirectory, slug, parsePostFrontmatter);
}

/**
 * Returns both the parsed frontmatter and MDX body for a single post.
 */
export function getPostContent(slug: string) {
  return getMdxContent(postsDirectory, slug, parsePostFrontmatter);
}

/**
 * Returns all post metadata sorted newest-first for listing/related content.
 */
export function getAllPostsMeta(): PostMeta[] {
  return getCollectionMeta(postsDirectory, parsePostFrontmatter).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Narrows raw gray-matter output into the `PostMeta` shape expected by the
 * route layer.
 */
function parsePostFrontmatter(slug: string, data: Record<string, unknown>): PostMeta {
  const date = data.date as string;
  return {
    slug,
    title: data.title as string,
    date,
    modified: (data.modified as string) ?? date,
    description: data.description as string,
    imageIndex: data.imageIndex as number,
    author: (data.author as string) ?? 'Nick',
    steps: Array.isArray(data.steps) ? (data.steps as string[]) : undefined,
  };
}
