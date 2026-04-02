import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { FaqItem } from '@/components/faq-item';
import { getAllAreasMeta, getAreaContent, getAreaSlugs } from '@/lib/areas';
import { stripMarkdownLinks } from '@/lib/markdown-links';
import { getPictureAsImage } from '@/lib/pictures';

import { mdxComponents } from '../../../../mdx-components';
import { seo } from '../../data/index';
import picturesData from '../../data/pictures.json';
import { baseOpenGraph } from '../../layout';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAreaSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
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

export default async function AreaPostPage({ params }: Props) {
  const { slug } = await params;

  if (!getAreaSlugs().includes(slug)) {
    notFound();
  }

  const { meta, content } = getAreaContent(slug);
  const image450 = getPictureAsImage(meta.imageIndex, 1);

  // Absolute image URL for structured data (always uses the canonical domain).
  const schemaImageUrl = `${seo.url}${picturesData[meta.imageIndex - 1].filePath1}`;
  const canonicalUrl = `${seo.url}/areas/${slug}/`;
  const websiteId = `${seo.url}/#website`;
  const localBusinessId = `${seo.url}/#localbusiness`;

  // Reading time: ~200 words per minute.
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const relatedPosts = getAllAreasMeta().filter((p) => p.slug !== slug);

  const areaPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${canonicalUrl}#blogposting`,
    headline: meta.title,
    description: meta.description,
    datePublished: `${meta.date}T00:00:00+00:00`,
    dateModified: `${meta.date}T00:00:00+00:00`,
    image: schemaImageUrl,
    author: { '@type': 'Person', name: meta.author, url: `${seo.url}/about/` },
    publisher: { '@id': localBusinessId },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    isPartOf: { '@id': websiteId },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${seo.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Areas', item: `${seo.url}/areas/` },
      { '@type': 'ListItem', position: 3, name: meta.title },
    ],
  };

  const faqPageSchema = meta.faqs
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: meta.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: stripMarkdownLinks(faq.answer) },
        })),
      }
    : null;

  return (
    <div className="mx-auto max-w-340 px-4 py-10 pt-42 sm:px-6 lg:px-8 lg:py-14 lg:pt-42">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(areaPostingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqPageSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }} />
      )}

      <div className="mx-auto max-w-2xl">
        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-brand">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/areas/" className="hover:text-brand">
            Areas
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-gray-700" aria-current="page">
            {meta.title}
          </span>
        </nav>

        <article>
          <header className="mb-8 border-b border-gray-200 pb-8">
            <h1 className="text-heading text-center text-3xl leading-tight font-bold md:text-left md:text-4xl">
              {meta.title}
            </h1>
            <h2 className="mt-3 text-lg text-gray-600">{meta.description}</h2>
            <p className="mt-3 text-sm text-gray-500">
              By {meta.author} &middot;{' '}
              <time dateTime={meta.date}>
                {new Date(meta.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </time>{' '}
              &middot; {readingTime} min read
            </p>
            <Image
              className="rounded-base mt-4 h-auto w-full"
              width={image450.width}
              height={image450.height}
              src={image450.url}
              alt={image450.description}
            />
          </header>

          <MDXRemote source={content} components={mdxComponents} />
        </article>

        <aside className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-heading mb-6 text-xl font-semibold">Common questions</h2>
          {meta.faqs?.map((faq) => (
            <FaqItem key={faq.question} faq={faq} />
          ))}
        </aside>

        {relatedPosts.length > 0 && (
          <aside className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-heading mb-6 text-xl font-semibold">More from the area</h2>
            <ul className="space-y-4">
              {relatedPosts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/areas/${post.slug}/`} className="text-brand hover:text-brand-light font-medium">
                    {post.title}
                  </Link>
                  <p className="mt-1 text-sm text-gray-500">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                  </p>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}
