import type { Metadata } from 'next';

import { FaqItem } from '@/components/faq-item';
import { PageHeader } from '@/components/page-header';
import { stripMarkdownLinks } from '@/lib/markdown-links';
import { buildPageSchema, getSchemaIds } from '@/lib/schema';

import { faqs, seo } from '../data/index';
import { baseOpenGraph } from '../layout';

export const metadata: Metadata = {
  title: 'Breakdown Recovery FAQs in Watford',
  alternates: { canonical: `${seo.url}/faqs/` },
  description:
    'Got a question before booking? Find answers to the most common questions about our breakdown recovery and towing services in Watford and surrounding areas.',
  openGraph: { ...baseOpenGraph, url: `${seo.url}/faqs/` },
};

export default function FaqsPage() {
  const canonicalUrl = `${seo.url}/faqs/`;
  const { localBusiness, website } = getSchemaIds(seo.url);
  const faqPageSchema = {
    ...buildPageSchema({
      description: metadata.description,
      localBusinessId: localBusiness,
      name: 'Breakdown Recovery FAQs in Watford',
      pageType: 'FAQPage',
      url: canonicalUrl,
      websiteId: website,
    }),
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripMarkdownLinks(faq.answer),
      },
    })),
  };

  return (
    <main className="flex min-h-screen flex-col justify-center">
      {/* FAQ */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }} />
      <div className="bg-navy mb-10 lg:mb-6">
        <div className="mx-auto max-w-340 px-4 py-10 pt-32 text-white sm:px-6 lg:px-8 lg:py-14 lg:pt-36">
          <PageHeader
            title="Frequently asked questions"
            subtitle="Got a question before booking? Here are answers to the most common things customers ask about our breakdown recovery and towing services in Watford and the surrounding area. 24 hours a day, Monday to Saturday."
          />
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-4 py-10 pt-4 sm:px-6 md:max-w-7xl lg:px-8 lg:py-14 lg:pt-14">
        <div className="divide-line-2 mx-auto max-w-2xl divide-y">
          {faqs.map((faq) => (
            <FaqItem key={faq.question} faq={faq} />
          ))}
        </div>
      </div>
      {/* End FAQ */}
    </main>
  );
}
