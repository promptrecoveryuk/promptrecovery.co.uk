import Image from 'next/image';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';

import type { BaseContentMeta, BreadcrumbItem, Faq, GoogleReview, PictureImage } from '@/types';

import { mdxComponents } from '../../mdx-components';
import { FaqItem } from './faq-item';
import { ReviewCardV2 } from './review-card-v2';

/**
 * Shared renderer for MDX-backed article pages. Blog posts and area pages use
 * the same shell: breadcrumbs, heading block, hero image, body copy, optional
 * FAQs, optional related links, and one or more JSON-LD payloads.
 */
type ContentArticlePageProps = {
  breadcrumbs: BreadcrumbItem[];
  content: string;
  faqs?: Faq[];
  reviews?: GoogleReview[];
  image: PictureImage;
  meta: BaseContentMeta;
  readingTime: number;
  relatedHrefBase?: string;
  relatedItems?: BaseContentMeta[];
  relatedTitle?: string;
  schemaObjects: object[];
};

/**
 * Renders an article-like content page with shared layout and schema output.
 * Collection-specific loaders prepare data before passing it in here.
 */
export function ContentArticlePage({
  breadcrumbs,
  content,
  faqs,
  reviews,
  image,
  meta,
  readingTime,
  relatedHrefBase,
  relatedItems = [],
  relatedTitle,
  schemaObjects,
}: ContentArticlePageProps) {
  return (
    <main className="flex min-h-screen flex-col justify-center">
      {schemaObjects.map((schemaObject, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaObject) }}
        />
      ))}

      <div className="bg-navy text-white">
        <div className="xs:px-6 mx-auto max-w-2xl px-4 pt-32 sm:px-6 lg:px-8 lg:pt-36">
          <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-sm">
            {breadcrumbs.map((item, index) => (
              <div key={`${item.name}-${index}`} className="contents">
                {index > 0 && <span aria-hidden="true">/</span>}
                {item.item ? (
                  <Link href={item.item} className="underline">
                    {item.name}
                  </Link>
                ) : (
                  <span className="" aria-current="page">
                    {item.name}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      <article>
        <div className="bg-navy mb-2 text-white">
          <div className="xs:px-6 mx-auto max-w-2xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-10">
            <header className="">
              <h1 className="font-heading text-center text-3xl leading-tight font-bold md:text-left md:text-4xl">
                {meta.title}
              </h1>
              <h2 className="mt-3 text-lg">{meta.description}</h2>
              <p className="mt-3 text-sm">
                By {meta.author} &middot;{' '}
                <time dateTime={meta.modified}>
                  {new Date(meta.modified).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>{' '}
                &middot; {readingTime} min read
              </p>
              <Image
                className="rounded-base mt-4 h-auto w-full"
                width={image.width}
                height={image.height}
                src={image.url}
                alt={image.description}
              />
            </header>
          </div>
        </div>
        <div className="xs:px-6 mx-auto max-w-2xl px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14">
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      </article>

      {faqs && faqs.length > 0 && (
        <aside className="xs:px-6 mx-auto mt-12 max-w-2xl border-t border-gray-200 px-4 pt-8 pb-6 sm:px-6 lg:px-8 lg:pb-10">
          <h2 className="text-heading font-heading decoration-yellow mb-4 text-2xl font-semibold underline decoration-3 underline-offset-8">
            Common questions
          </h2>
          {faqs.map((faq) => (
            <FaqItem key={faq.question} faq={faq} />
          ))}
        </aside>
      )}

      {reviews && reviews.length > 0 && (
        <aside className="xs:px-6 mx-auto mt-12 max-w-2xl border-t border-gray-200 px-4 pt-8 pb-6 sm:px-6 lg:px-8 lg:pb-10">
          <h2 className="text-heading font-heading decoration-yellow mb-0 text-2xl font-semibold underline decoration-3 underline-offset-8">
            What our customers say
          </h2>
          {reviews.map((review) => (
            <ReviewCardV2 key={review.authorUrl} review={review} />
          ))}
        </aside>
      )}

      {relatedTitle && relatedHrefBase && relatedItems.length > 0 && (
        <aside className="xs:px-6 mx-auto mb-8 w-full max-w-2xl border-t border-gray-200 px-4 pt-8 pb-6 sm:px-6 lg:px-8 lg:pb-10">
          <h2 className="text-heading font-heading mb-6 text-xl font-semibold">{relatedTitle}</h2>
          <ul className="space-y-4">
            {relatedItems.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`${relatedHrefBase}/${item.slug}/`}
                  className="text-brand hover:text-brand-light font-medium"
                >
                  {item.title}
                </Link>
                <p className="mt-1 text-sm text-gray-500">
                  <time dateTime={item.date}>
                    {new Date(item.date).toLocaleDateString('en-GB', {
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
    </main>
  );
}
