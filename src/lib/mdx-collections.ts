import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

import type { BaseContentMeta, MdxContent } from '@/types';

/**
 * Generic frontmatter shape returned by gray-matter before collection-specific
 * parsing narrows it into a typed metadata object.
 */
type Frontmatter = Record<string, unknown>;

/**
 * Maps a slug + raw frontmatter into a strongly-typed metadata object.
 * Collection modules such as `areas.ts` and `posts.ts` supply the parser so
 * this file can stay collection-agnostic.
 */
type FrontmatterParser<TMeta extends BaseContentMeta> = (slug: string, data: Frontmatter) => TMeta;

/**
 * Returns every `.mdx` filename in a collection directory as a clean slug.
 */
export function getCollectionSlugs(directory: string): string[] {
  return fs
    .readdirSync(directory)
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => fileName.replace(/\.mdx$/, ''));
}

/**
 * Reads the frontmatter for every file in a collection and returns parsed
 * metadata objects without loading the content bodies.
 */
export function getCollectionMeta<TMeta extends BaseContentMeta>(
  directory: string,
  parseFrontmatter: FrontmatterParser<TMeta>
): TMeta[] {
  return getCollectionSlugs(directory).map((slug) => getMdxMeta(directory, slug, parseFrontmatter));
}

/**
 * Reads and parses frontmatter for one MDX document.
 */
export function getMdxMeta<TMeta extends BaseContentMeta>(
  directory: string,
  slug: string,
  parseFrontmatter: FrontmatterParser<TMeta>
): TMeta {
  const raw = fs.readFileSync(path.join(directory, `${slug}.mdx`), 'utf-8');
  const { data } = matter(raw);

  return parseFrontmatter(slug, data);
}

/**
 * Reads both metadata and rendered MDX body source for a single document.
 */
export function getMdxContent<TMeta extends BaseContentMeta>(
  directory: string,
  slug: string,
  parseFrontmatter: FrontmatterParser<TMeta>
): MdxContent<TMeta> {
  const raw = fs.readFileSync(path.join(directory, `${slug}.mdx`), 'utf-8');
  const { data, content } = matter(raw);

  return {
    content,
    meta: parseFrontmatter(slug, data),
  };
}
