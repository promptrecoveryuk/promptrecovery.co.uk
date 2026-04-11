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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }} />
      <div className="mx-auto max-w-340 px-4 py-10 pt-42 sm:px-6 lg:px-8 lg:py-14 lg:pt-42">
        <PageHeader
          title="Vehicle recovery services in and around Watford"
          subtitle="We provide safe, fast, and affordable towing for cars and vans that can't be driven — whether you're at home, at work, or stuck after a breakdown. 24 hours a day, Monday to Saturday."
        />

        <div className="mx-auto grid max-w-7xl items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </>
  );
}
