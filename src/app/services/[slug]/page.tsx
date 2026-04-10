import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ContentArticlePage } from '@/components/content-article-page';
import { getPictureAsImage } from '@/lib/pictures';
import { buildArticleSchema, buildBreadcrumbSchema, buildFaqPageSchema, getSchemaIds } from '@/lib/schema';
import { getAllServicesMeta, getServiceContent, getServiceSlugs } from '@/lib/services';

import { seo } from '../../data/index';
import picturesData from '../../data/pictures.json';
import { baseOpenGraph } from '../../layout';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const slugs = getServiceSlugs();
  if (!slugs.includes(slug)) notFound();
  const { meta } = getServiceContent(slug);
  const image = getPictureAsImage(meta.imageIndex, 1);

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `${seo.url}/services/${slug}/` },
    openGraph: { ...baseOpenGraph, url: `${seo.url}/services/${slug}/`, images: [image], type: 'article' },
    twitter: {
      card: 'summary_large_image',
      images: [image],
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const slugs = getServiceSlugs();

  if (!slugs.includes(slug)) {
    notFound();
  }

  const { meta, content } = getServiceContent(slug);
  const image = getPictureAsImage(meta.imageIndex, 1);
  const schemaImageUrl = `${seo.url}${picturesData[meta.imageIndex - 1].filePath1}`;
  const canonicalUrl = `${seo.url}/services/${slug}/`;
  const { website, localBusiness } = getSchemaIds(seo.url);

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const relatedServices = getAllServicesMeta().filter((service) => service.slug !== slug);

  const schemaObjects = [
    buildArticleSchema({
      articleType: 'Article',
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
      { name: 'Services', item: `${seo.url}/services/` },
      { name: meta.title },
    ]),
    ...(meta.faqs ? [buildFaqPageSchema(meta.faqs)] : []),
  ];

  return (
    <ContentArticlePage
      breadcrumbs={[{ name: 'Home', item: '/' }, { name: 'Services', item: '/services/' }, { name: meta.title }]}
      content={content}
      faqs={meta.faqs}
      image={image}
      meta={meta}
      readingTime={readingTime}
      relatedHrefBase="/services"
      relatedItems={relatedServices}
      relatedTitle="More services"
      schemaObjects={schemaObjects}
    />
  );
}
