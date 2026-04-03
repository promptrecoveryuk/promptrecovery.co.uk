import Image from 'next/image';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';

import type { BaseContentMeta, BreadcrumbItem, Faq, PictureImage } from '@/types';

import { mdxComponents } from '../../mdx-components';
import { FaqItem } from './faq-item';

/**
 * Shared renderer for MDX-backed article pages. Blog posts and area pages use
 * the same shell: breadcrumbs, heading block, hero image, body copy, optional
 * FAQs, optional related links, and one or more JSON-LD payloads.
 */
type ContentArticlePageProps = {
  breadcrumbs: BreadcrumbItem[];
  content: string;
  faqs?: Faq[];
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
  image,
  meta,
  readingTime,
  relatedHrefBase,
  relatedItems = [],
  relatedTitle,
  schemaObjects,
}: ContentArticlePageProps) {
  return (
    <div className="mx-auto max-w-340 px-4 py-10 pt-42 sm:px-6 lg:px-8 lg:py-14 lg:pt-42">
      {schemaObjects.map((schemaObject, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaObject) }}
        />
      ))}

      <div className="mx-auto max-w-2xl">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          {breadcrumbs.map((item, index) => (
            <div key={`${item.name}-${index}`} className="contents">
              {index > 0 && <span aria-hidden="true">/</span>}
              {item.item ? (
                <Link href={item.item} className="hover:text-brand">
                  {item.name}
                </Link>
              ) : (
                <span className="text-gray-700" aria-current="page">
                  {item.name}
                </span>
              )}
            </div>
          ))}
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
              width={image.width}
              height={image.height}
              src={image.url}
              alt={image.description}
            />
          </header>

          <MDXRemote source={content} components={mdxComponents} />
        </article>

        {faqs && faqs.length > 0 && (
          <aside className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-heading mb-6 text-xl font-semibold">Common questions</h2>
            {faqs.map((faq) => (
              <FaqItem key={faq.question} faq={faq} />
            ))}
          </aside>
        )}

        {relatedTitle && relatedHrefBase && relatedItems.length > 0 && (
          <aside className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-heading mb-6 text-xl font-semibold">{relatedTitle}</h2>
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
      </div>
    </div>
  );
}
