import fs from 'node:fs';
import path from 'node:path';

import matter from 'gray-matter';

import { AreaMeta } from '@/types';

const areasDirectory = path.join(process.cwd(), 'src/content/areas');

export function getAreaSlugs(): string[] {
  return fs
    .readdirSync(areasDirectory)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getAreaMeta(slug: string): AreaMeta {
  const filePath = path.join(areasDirectory, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(raw);

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

export function getAreaContent(slug: string): { meta: AreaMeta; content: string } {
  const filePath = path.join(areasDirectory, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    content,
    meta: {
      slug,
      title: data.title as string,
      date: data.date as string,
      description: data.description as string,
      imageIndex: data.imageIndex as number,
      author: (data.author as string) ?? 'Nick',
      faqs: Array.isArray(data.faqs) ? data.faqs : undefined,
    },
  };
}

export function getAllAreasMeta(): AreaMeta[] {
  return getAreaSlugs()
    .map(getAreaMeta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
