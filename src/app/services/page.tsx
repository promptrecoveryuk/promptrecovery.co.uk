import type { Metadata } from 'next';

import { DescriptiveItemWithImage } from '@/components/descriptive-item-with-image';
import { PageHeader } from '@/components/page-header';
import { buildPageSchema, getSchemaIds } from '@/lib/schema';
import { hasServicePage } from '@/lib/services';

import { pictures, seo, services } from '../data/index';
import { baseOpenGraph } from '../layout';

export const metadata: Metadata = {
  title: 'Vehicle Recovery Services in Watford',
  alternates: { canonical: `${seo.url}/services/` },
  description:
    'Vehicle recovery services in Watford, including breakdown recovery, motorway recovery, van recovery, towing, jump starts, and accident recovery.',
  openGraph: { ...baseOpenGraph, url: `${seo.url}/services/` },
};

export default function ServicesPage() {
  const canonicalUrl = `${seo.url}/services/`;
  const { localBusiness, website } = getSchemaIds(seo.url);
  const webpageSchema = buildPageSchema({
    description: metadata.description,
    localBusinessId: localBusiness,
    name: 'Vehicle Recovery Services in Watford',
    url: canonicalUrl,
    websiteId: website,
  });

  return (
    <main className="flex min-h-screen flex-col justify-center">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }} />
      <div className="bg-navy mb-10 lg:mb-6">
        <div className="mx-auto max-w-340 px-4 pt-32 pb-10 text-white sm:px-6 lg:px-8 lg:pt-36 lg:pb-14">
          <PageHeader
            title="Vehicle recovery services in and around Watford"
            subtitle="We provide safe, fast, and fully insured towing for cars and vans that can't be driven — handled by an experienced Class 1 HGV driver. 24 hours a day, Monday to Saturday."
          />
        </div>
      </div>
      <div className="mx-auto max-w-2xl px-4 py-10 pt-4 sm:px-6 md:max-w-7xl lg:px-8 lg:py-14 lg:pt-14">
        <div className="grid items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const picture = pictures[service.pictureIndex];
            return (
              <DescriptiveItemWithImage
                key={service.name}
                href={hasServicePage(service.id) ? `/services/${service.id}/` : undefined}
                item={{ ...service, picture }}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}
