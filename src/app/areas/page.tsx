import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { PageHeader } from '@/components/page-header';
import { getAllAreasMeta } from '@/lib/areas';
import { getPictureAsImage } from '@/lib/pictures';
import { buildPageSchema, getSchemaIds } from '@/lib/schema';

import { seo } from '../data/index';
import { baseOpenGraph } from '../layout';

export const metadata: Metadata = {
  title: 'Breakdown Recovery Areas We Cover',
  alternates: { canonical: `${seo.url}/areas/` },
  description:
    'Breakdown recovery areas covered by Prompt Recovery in Watford, including local service pages for towns and nearby roads.',
  openGraph: { ...baseOpenGraph, url: `${seo.url}/areas/` },
};

export default function AreaPage() {
  const areas = getAllAreasMeta();
  const canonicalUrl = `${seo.url}/areas/`;
  const { localBusiness, website } = getSchemaIds(seo.url);
  const webpageSchema = buildPageSchema({
    description: metadata.description,
    localBusinessId: localBusiness,
    name: 'Breakdown Recovery Areas We Cover',
    pageType: 'CollectionPage',
    url: canonicalUrl,
    websiteId: website,
  });

  return (
    <div className="mx-auto max-w-340 px-4 py-10 pt-42 sm:px-6 lg:px-8 lg:py-14 lg:pt-42">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }} />
      <PageHeader
        title="Areas"
        subtitle="Local breakdown recovery pages for Watford, nearby towns, and the roads we regularly cover."
      />

      <ul className="mx-auto max-w-2xl divide-y divide-gray-200">
        {areas.map((area) => {
          const image = getPictureAsImage(area.imageIndex, 2);
          return (
            <li key={area.slug} className="py-8">
              <Link href={`/areas/${area.slug}/`} className="hover:text-brand block">
                <time className="text-sm text-gray-500">
                  {new Date(area.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </time>
                <h3 className="mt-2 text-xl font-semibold">{area.title}</h3>
                {image && (
                  <Image
                    className="rounded-base my-3 h-auto w-full"
                    width={image.width}
                    height={image.height}
                    src={image.url}
                    alt={image.description}
                  />
                )}
                <p className="mt-2">{area.description}</p>
                <span className="mt-3 inline-block text-sm font-medium">Read more →</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
