import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { PageHeader } from '@/components/page-header';
import { getPictureAsImage } from '@/lib/pictures';
import { getAllPostsMeta } from '@/lib/posts';

import { seo } from '../data/index';
import { baseOpenGraph } from '../layout';

export const metadata: Metadata = {
  title: 'Blog',
  alternates: { canonical: `${seo.url}/blog/` },
  description:
    'Helpful guides and advice on vehicle recovery, breakdowns, and staying safe on the road — from the team at Prompt Recovery in Watford.',
  openGraph: { ...baseOpenGraph, url: `${seo.url}/blog/` },
};

export default function BlogPage() {
  const posts = getAllPostsMeta();

  return (
    <div className="mx-auto max-w-340 px-4 py-10 pt-42 sm:px-6 lg:px-8 lg:py-14 lg:pt-42">
      <PageHeader
        title="Blog"
        subtitle="Helpful guides and advice on vehicle recovery, breakdowns, and staying safe on the road."
      />

      <ul className="mx-auto max-w-2xl divide-y divide-gray-200">
        {posts.map((post) => {
          const image = getPictureAsImage(post.imageIndex, 2);
          return (
            <li key={post.slug} className="py-8">
              <Link href={`/blog/${post.slug}/`} className="hover:text-brand">
                <time className="text-sm text-gray-500">
                  {new Date(post.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </time>
                <h3 className="mt-2 text-xl font-semibold">{post.title}</h3>
                {image && (
                  <Image
                    className="rounded-base my-3 h-auto w-full"
                    width={image.width}
                    height={image.height}
                    src={image.url}
                    alt={image.description}
                  />
                )}
                <p className="mt-2">{post.description}</p>
                <span className="mt-3 inline-block text-sm font-medium">Read more →</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
