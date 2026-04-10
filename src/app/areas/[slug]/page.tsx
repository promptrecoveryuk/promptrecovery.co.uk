import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ContentArticlePage } from '@/components/content-article-page';
import { getAllAreasMeta, getAreaContent, getAreaSlugs } from '@/lib/areas';
import { getPictureAsImage } from '@/lib/pictures';
import { getGoogleReviewById } from '@/lib/reviews';
import { buildArticleSchema, buildBreadcrumbSchema, buildFaqPageSchema, getSchemaIds } from '@/lib/schema';

import { seo } from '../../data/index';
import picturesData from '../../data/pictures.json';
import { baseOpenGraph } from '../../layout';

type Props = { params: Promise<{ slug: string }> };

/**
 * Statically generates every area route from the MDX collection.
 */
export async function generateStaticParams() {
  return getAreaSlugs().map((slug) => ({ slug }));
}

/**
 * Derives per-area metadata from the shared content collection helpers.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const slugs = getAreaSlugs();
  if (!slugs.includes(slug)) notFound();
  const { meta } = getAreaContent(slug);
  const image = getPictureAsImage(meta.imageIndex, 1);

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `${seo.url}/areas/${slug}/` },
    openGraph: { ...baseOpenGraph, url: `${seo.url}/areas/${slug}/`, images: [image], type: 'article' },
    twitter: {
      card: 'summary_large_image',
      images: [image],
    },
  };
}

/**
 * Area route built on top of the shared MDX content loader, schema builders,
 * and article page shell.
 */
export default async function AreaPostPage({ params }: Props) {
  const { slug } = await params;
  const slugs = getAreaSlugs();

  if (!slugs.includes(slug)) {
    notFound();
  }

  const { meta, content } = getAreaContent(slug);
  const image = getPictureAsImage(meta.imageIndex, 1);

  // Absolute image URL for structured data (always uses the canonical domain).
  const schemaImageUrl = `${seo.url}${picturesData[meta.imageIndex - 1].filePath1}`;
  const canonicalUrl = `${seo.url}/areas/${slug}/`;
  const { website, localBusiness } = getSchemaIds(seo.url);

  // Reading time: ~200 words per minute.
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const relatedPosts = getAllAreasMeta().filter((p) => p.slug !== slug);
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
      { name: 'Areas', item: `${seo.url}/areas/` },
      { name: meta.title },
    ]),
    ...(meta.faqs ? [buildFaqPageSchema(meta.faqs)] : []),
  ];

  return (
    <ContentArticlePage
      breadcrumbs={[{ name: 'Home', item: '/' }, { name: 'Areas', item: '/areas/' }, { name: meta.title }]}
      content={content}
      faqs={meta.faqs}
      reviews={reviews}
      image={image}
      meta={meta}
      readingTime={readingTime}
      relatedHrefBase="/areas"
      relatedItems={relatedPosts}
      relatedTitle="More from the area"
      schemaObjects={schemaObjects}
    />
  );
}
