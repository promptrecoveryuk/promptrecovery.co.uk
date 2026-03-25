import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  imageIndex: number;
  author: string;
  /** Optional ordered step names — used to generate HowTo structured data. */
  steps?: string[];
}

export function getPostSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getPostMeta(slug: string): PostMeta {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(raw);

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    description: data.description as string,
    imageIndex: data.imageIndex as number,
    author: (data.author as string) ?? 'Nick',
    steps: Array.isArray(data.steps) ? (data.steps as string[]) : undefined,
  };
}

export function getPostContent(slug: string): { meta: PostMeta; content: string } {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
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
      steps: Array.isArray(data.steps) ? (data.steps as string[]) : undefined,
    },
  };
}

export function getAllPostsMeta(): PostMeta[] {
  return getPostSlugs()
    .map(getPostMeta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
