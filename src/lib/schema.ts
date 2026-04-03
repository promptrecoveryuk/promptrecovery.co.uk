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
 * Builds a simple page-level schema for static routes that belong to the main
 * site and are about the primary local business entity.
 */
export function buildPageSchema({
  description,
  localBusinessId,
  name,
  pageType = 'WebPage',
  url,
  websiteId,
}: {
  description?: string;
  localBusinessId: string;
  name: string;
  pageType?: 'AboutPage' | 'CollectionPage' | 'FAQPage' | 'WebPage';
  url: string;
  websiteId: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': pageType,
    '@id': url,
    url,
    name,
    ...(description ? { description } : {}),
    isPartOf: { '@id': websiteId },
    about: { '@id': localBusinessId },
  };
}

/**
 * Builds the root `WebSite` entity used by page-level schemas and article
 * schemas across the site.
 */
export function buildWebsiteSchema({
  alternateName,
  siteUrl,
  siteName,
}: {
  alternateName?: string;
  siteName: string;
  siteUrl: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: siteName,
    ...(alternateName ? { alternateName } : {}),
    url: siteUrl,
  };
}

/**
 * Builds the root `LocalBusiness` entity used by static pages and article
 * publisher references.
 */
export function buildLocalBusinessSchema({
  address,
  areaServed,
  description,
  geo,
  hasMap,
  image,
  legalName,
  openingHours,
  phone,
  priceRange,
  ratingValue,
  reviewCount,
  sameAs,
  siteName,
  siteUrl,
}: {
  address: {
    addressCountry: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    streetAddress: string;
  };
  areaServed: string;
  description: string;
  geo: { latitude: number; longitude: number };
  hasMap?: string;
  image: string[];
  legalName?: string;
  openingHours: string[];
  phone: string;
  priceRange?: string;
  ratingValue?: number;
  reviewCount?: number;
  sameAs: string[];
  siteName: string;
  siteUrl: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'AutomotiveBusiness'],
    '@id': `${siteUrl}/#localbusiness`,
    name: siteName,
    ...(legalName ? { legalName } : {}),
    description,
    url: siteUrl,
    telephone: phone,
    image,
    ...(priceRange ? { priceRange } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    openingHours,
    areaServed,
    sameAs,
    ...(ratingValue && reviewCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue,
            reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(hasMap ? { hasMap } : {}),
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
