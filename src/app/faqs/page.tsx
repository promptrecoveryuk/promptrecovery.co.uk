import type { Metadata } from 'next';

import { FaqItem } from '@/components/faq-item';
import { PageHeader } from '@/components/page-header';

import { faqs, seo } from '../data/index';
import { baseOpenGraph } from '../layout';

export const metadata: Metadata = {
  title: 'FAQs',
  alternates: { canonical: `${seo.url}/faqs/` },
  description:
    'Got a question before booking? Find answers to the most common questions about our vehicle recovery services in Watford and surrounding areas.',
  openGraph: { ...baseOpenGraph, url: `${seo.url}/faqs/` },
};

const faqPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function FaqsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }} />
      {/* FAQ */}
      <div className="mx-auto max-w-340 px-4 py-10 pt-42 sm:px-6 lg:px-8 lg:py-14 lg:pt-42">
        <PageHeader
          title="Frequently asked questions"
          subtitle="Got a question before booking? Here are answers to the most common things customers ask about our vehicle recovery services in Watford and the surrounding area."
        />

        <div className="divide-line-2 mx-auto max-w-2xl divide-y">
          {faqs.map((faq) => (
            <FaqItem key={faq.question} faq={faq} />
          ))}
        </div>
      </div>
      {/* End FAQ */}
    </>
  );
}
