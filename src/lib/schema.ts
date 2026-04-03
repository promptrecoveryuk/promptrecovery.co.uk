import type { BreadcrumbItem, Faq } from '@/types';

import { stripMarkdownLinks } from './markdown-links';

/**
 * Central registry for stable site-level entity ids used across JSON-LD
 * payloads. Keeping these in one place avoids string drift between pages.
 */
export function getSchemaIds(siteUrl: string) {
  return {
    localBusiness: `${siteUrl}/#localbusiness`,
    website: `${siteUrl}/#website`,
  };
}

/**
 * Builds the shared article-style schema used by both blog posts and area
 * pages. The page routes decide whether extra schemas like FAQPage or HowTo
 * should be emitted alongside it.
 */
export function buildArticleSchema({
  articleType = 'BlogPosting',
  authorName,
  canonicalUrl,
  datePublished,
  description,
  headline,
  image,
  localBusinessId,
  websiteId,
}: {
  articleType?: 'Article' | 'BlogPosting';
  authorName: string;
  canonicalUrl: string;
  datePublished: string;
  description: string;
  headline: string;
  image: string;
  localBusinessId: string;
  websiteId: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': articleType,
    '@id': `${canonicalUrl}#article`,
    headline,
    description,
    datePublished: `${datePublished}T00:00:00+00:00`,
    dateModified: `${datePublished}T00:00:00+00:00`,
    image,
    author: {
      '@type': 'Person',
      name: authorName,
      url: `${new URL('/about/', canonicalUrl).toString()}`,
    },
    publisher: { '@id': localBusinessId },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    isPartOf: { '@id': websiteId },
  };
}

/**
 * Converts simple breadcrumb data into the Schema.org `BreadcrumbList` format.
 * The final crumb can omit `item` to mark the current page.
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.item ? { item: item.item } : {}),
    })),
  };
}

/**
 * Converts FAQ UI data into JSON-LD-safe FAQ entries. Markdown links are
 * stripped so structured data contains plain answer text rather than inline
 * markdown syntax.
 */
export function buildFaqPageSchema(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: stripMarkdownLinks(faq.answer) },
    })),
  };
}

/**
 * Converts an ordered string list into `HowToStep` entries.
 */
export function buildHowToSchema(title: string, description: string, steps: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description,
    step: steps.map((name, index) => ({ '@type': 'HowToStep', position: index + 1, name })),
  };
}
