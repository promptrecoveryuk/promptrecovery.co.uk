import type { Metadata } from 'next';
import Image from 'next/image';

import { GridGallery } from '@/components/grid-gallery';
import { PageHeader } from '@/components/page-header';
import { SectionHeading } from '@/components/section-heading';
import { ServiceItem } from '@/components/service-item';

import { basePath } from '../base-path';
import { pictures, seo, values } from '../data/index';
import { baseOpenGraph } from '../layout';

export const metadata: Metadata = {
  title: 'About',
  alternates: { canonical: `${seo.url}/about/` },
  description:
    'Meet Nick — founder of Prompt Recovery Ltd, with 20+ years of professional driving experience. Trusted, local roadside recovery in Watford and nearby areas.',
  openGraph: { ...baseOpenGraph, url: `${seo.url}/about/` },
};

export default function AboutPage() {
  return (
    <>
      {/* About */}
      <div className="mx-auto max-w-340 px-4 py-10 pt-42 sm:px-6 lg:px-8 lg:py-14 lg:pt-42">
        <PageHeader
          title="Meet Prompt Recovery — Watford's trusted recovery specialist"
          subtitle="Prompt Recovery Ltd was built on one mission: to provide fast, friendly and reliable roadside recovery across Watford and nearby areas. Get to know the person behind the wheel and what drives our services."
        />

        <div className="mx-auto max-w-7xl px-4 py-10 pt-4 sm:px-6 lg:px-8 lg:py-14 lg:pt-4">
          <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
            <div>
              <SectionHeading sectionName="Hi, I'm Nick - Founder of Prompt Recovery" />
              <p className="text-thin font-light">
                I have over 20 years of experience as a professional truck driver, and I&apos;ve built this business to
                offer fast, honest, and reliable towing for inoperable vehicles. I recover cars, SUVs, and small vans
                (under 4 tonnes) across Watford, Bushey, Rickmansworth, and nearby areas. Whether it&apos;s a breakdown,
                accident, or stuck vehicle, I&apos;ll handle it with care, like I&apos;m helping a neighbour.
              </p>
              <p className="text-thin font-light">
                I&apos;m local to Watford, and I treat every call like I&apos;m helping a neighbour because most of the
                time, I am.
              </p>
            </div>
            <Image
              src={`${basePath}/images/image2-1185x593.jpg`}
              width={1185}
              height={593}
              className="rounded-base"
              alt="Nick, founder of Prompt Recovery"
            />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 pt-4 sm:px-6 lg:px-8 lg:py-14 lg:pt-4">
          <div>
            <SectionHeading sectionName="Our values" />

            <div className="grid items-center gap-6 sm:grid-cols-1 lg:grid-cols-4">
              {values.map((value) => (
                <ServiceItem key={value.name} service={value} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <SectionHeading sectionName="Some of our recoveries" />
          <GridGallery items={pictures} />
        </div>
      </div>
      {/* End About */}
    </>
  );
}
