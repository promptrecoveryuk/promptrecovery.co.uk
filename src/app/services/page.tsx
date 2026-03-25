import type { Metadata } from 'next';

import { DescriptiveItemWithImage } from '@/components/descriptive-item-with-image';
import { PageHeader } from '@/components/page-header';

import { pictures, seo, services } from '../data/index';
import { baseOpenGraph } from '../layout';

export const metadata: Metadata = {
  title: 'Services',
  alternates: { canonical: `${seo.url}/services/` },
  description:
    'Breakdown towing, motorway recovery, van recovery, stuck vehicle recovery, and more. Safe, fast, and affordable — serving Watford and surrounding areas.',
  openGraph: { ...baseOpenGraph, url: `${seo.url}/services/` },
};

export default function ServicesPage() {
  return (
    <>
      <div className="mx-auto max-w-340 px-4 py-10 pt-42 sm:px-6 lg:px-8 lg:py-14 lg:pt-42">
        <PageHeader
          title="The services that we offer"
          subtitle="We provide safe, fast, and affordable towing for cars and vans that can't be driven — whether you're at home, at work, or stuck after a breakdown."
        />

        <div className="mx-auto grid max-w-7xl items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const picture = pictures[service.pictureIndex];
            return <DescriptiveItemWithImage key={service.name} item={{ ...service, picture }} />;
          })}
        </div>
      </div>
    </>
  );
}
