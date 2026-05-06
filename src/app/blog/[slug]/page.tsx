import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ContentArticlePage } from '@/components/content-article-page';
import { getPictureAsImage } from '@/lib/pictures';
import { getAllPostsMeta, getPostContent, getPostSlugs } from '@/lib/posts';
import { getGoogleReviewById } from '@/lib/reviews';
import { buildArticleSchema, buildBreadcrumbSchema, buildHowToSchema, getSchemaIds } from '@/lib/schema';

import { seo } from '../../data/index';
import picturesData from '../../data/pictures.json';
import { baseOpenGraph } from '../../layout';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

/**
 * Statically generates every blog post route from the MDX collection.
 */
export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

/**
 * Derives per-post metadata from the shared content collection helpers.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!getPostSlugs().includes(slug)) return {};
  const { meta } = getPostContent(slug);
  const image = getPictureAsImage(meta.imageIndex, 1);

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `${seo.url}/blog/${slug}/` },
    openGraph: { ...baseOpenGraph, url: `${seo.url}/blog/${slug}/`, images: [image], type: 'article' },
    twitter: {
      card: 'summary_large_image',
      images: [image],
    },
  };
}

/**
 * Blog post route built on top of the shared MDX content loader, schema
 * builders, and article page shell.
 */
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const slugs = getPostSlugs();

  if (!slugs.includes(slug)) {
    notFound();
  }

  const { meta, content } = getPostContent(slug);
  const image = getPictureAsImage(meta.imageIndex, 1);

  // Absolute image URL for structured data (always uses the canonical domain).
  const schemaImageUrl = `${seo.url}${picturesData[meta.imageIndex - 1].filePath1}`;
  const canonicalUrl = `${seo.url}/blog/${slug}/`;
  const { website, localBusiness } = getSchemaIds(seo.url);

  // Reading time: ~200 words per minute.
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const relatedPosts = getAllPostsMeta().filter((p) => p.slug !== slug);
  const reviews = (meta.reviewIds ?? []).map(getGoogleReviewById).filter((r) => r !== undefined);
  const schemaObjects = [
    buildArticleSchema({
      authorName: meta.author,
      canonicalUrl,
      datePublished: meta.date,
      description: meta.description,
      headline: meta.title,
      image: schemaImageUrl,
      localBusinessId: localBusiness,
      websiteId: website,
    }),
    buildBreadcrumbSchema([
      { name: 'Home', item: `${seo.url}/` },
      { name: 'Blog', item: `${seo.url}/blog/` },
      { name: meta.title },
    ]),
    ...(meta.steps ? [buildHowToSchema(meta.title, meta.description, meta.steps)] : []),
  ];

  return (
    <ContentArticlePage
      breadcrumbs={[{ name: 'Home', item: '/' }, { name: 'Blog', item: '/blog/' }, { name: meta.title }]}
      content={content}
      reviews={reviews}
      image={image}
      meta={meta}
      readingTime={readingTime}
      relatedHrefBase="/blog"
      relatedItems={relatedPosts}
      relatedTitle="More from the blog"
      schemaObjects={schemaObjects}
    />
  );
}
