import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { Carousel } from '@/components/carousel';
import { ContactForm } from '@/components/contact-form';
import { GoogleMap } from '@/components/google-map';
import { ReviewCardV2 } from '@/components/review-card-v2';
import { Section } from '@/components/section';
import { SectionHeading } from '@/components/section-heading';
import { ServiceItem } from '@/components/service-item';
import { buildPageSchema, getSchemaIds } from '@/lib/schema';
import { hasServicePage } from '@/lib/services';

import { basePath } from './base-path';
import config from './config';
import { reasonsToChooseNick, seo, services, staticGoogleReviews } from './data/index';
import { baseOpenGraph } from './layout';

// Page-level metadata overrides the defaults set in layout.tsx.
// This page's browser tab will read: "Home | Prompt Recovery"
export const metadata: Metadata = {
  // Use absolute title (no template) so og:title is also descriptive
  title: { absolute: 'Breakdown Recovery Watford | Car & Van Recovery | Prompt Recovery' },
  alternates: { canonical: `${seo.url}/` },
  description:
    'Breakdown recovery in Watford for cars and vans. Fast, friendly vehicle recovery, towing, motorway recovery, and jump starts across Watford and surrounding areas. 24 hours a day, Monday to Saturday.',
  openGraph: { ...baseOpenGraph, url: seo.url },
};

// This is the home page, rendered at the root path `/`.
// Replace this placeholder with real content as the site is built out.
export default function HomePage() {
  const { localBusiness, website } = getSchemaIds(seo.url);
  const webpageSchema = buildPageSchema({
    description: metadata.description,
    localBusinessId: localBusiness,
    name: 'Breakdown Recovery Watford | Car & Van Recovery | Prompt Recovery',
    url: `${seo.url}/`,
    websiteId: website,
  });
  const googleReviews = { reviews: [] as typeof staticGoogleReviews };
  googleReviews.reviews = [
    staticGoogleReviews[0],
    staticGoogleReviews[2],
    staticGoogleReviews[4],
    staticGoogleReviews[7],
    staticGoogleReviews[14],
    staticGoogleReviews[21],
  ];

  return (
    <main className="flex min-h-screen flex-col justify-center">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }} />
      {/*-- Hero --*/}
      <div className="from-primary-100 dark:from-primary-950 bg-light-grey relative bg-linear-to-bl via-transparent dark:via-transparent">
        <div className="mx-auto max-w-7xl px-4 py-10 pt-42 sm:px-6 lg:px-8 lg:py-14 lg:pt-36">
          {/*-- Grid --*/}
          <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
            <div>
              {/*-- Title --*/}
              <div className="mt-4 md:mb-12">
                <h1 className="text-foreground mb-4 text-center text-4xl font-bold md:text-left lg:text-5xl">
                  Breakdown Recovery in Watford
                </h1>
                <h2 className="text-foreground mb-4 text-center text-2xl font-semibold md:text-left lg:text-3xl">
                  Serving Watford, Bushey,{' '}
                  <Link href="/areas/rickmansworth/" className="text-brand underline">
                    Rickmansworth
                  </Link>
                  , and the surrounding areas
                </h2>
                <p className="text-muted-foreground-2 mb-4 text-center text-xl font-normal md:text-left">
                  Fast, friendly and affordable help for vehicles under 4 tonnes you can rely on. Fully insured,
                  professionally trained, and experienced in safe vehicle recovery.
                </p>
                <p className="pt-4 text-center md:text-left">
                  <Link
                    href={`tel:${seo.phone}`}
                    className="bg-brand hover:bg-brand-light focus:ring-yellow rounded-base box-border inline-block border border-transparent px-3 py-1 text-lg leading-5 font-normal text-white shadow-xs focus:ring-2 focus:outline-none"
                  >
                    <span className="block text-center">Call Now</span>
                    <span className="block text-center text-xs">24hr Mon-Sat</span>
                  </Link>
                </p>
                <p className="text-muted-foreground-2 my-4 text-center text-lg font-normal md:text-left">
                  Trusted local recovery with safe vehicle handling from an experienced Class 1 HGV driver.
                </p>
              </div>
              {/*-- End Title --*/}
            </div>

            <div>
              {/*-- Carousel --*/}
              <Carousel>
                {googleReviews.reviews.map((review) => (
                  <ReviewCardV2 key={review.reviewId} review={review} />
                ))}
              </Carousel>
              {/*-- End Carousel --*/}
            </div>
          </div>
          {/*-- End Grid --*/}
        </div>
      </div>
      {/*-- End Hero --*/}
      {/* About Section */}
      <Section id="about" classNames="bg-light-yellow">
        <div className="mx-auto max-w-7xl px-4 py-10 pt-18 sm:px-6 lg:px-8 lg:py-14 lg:pt-18">
          <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
            <div>
              <SectionHeading sectionName="About" />
              <p className="text-xl font-normal">
                Prompt Recovery Ltd is a locally trusted vehicle recovery company based in Watford. With experience and
                a commitment to fast, reliable service, we provide breakdown recovery and towing for cars and vans
                across Watford and the surrounding area. We&apos;re the first call you make when you&apos;re stuck.
              </p>
              <p className="mt-8">
                <Link
                  href="/about/"
                  className="text-brand inline text-xl leading-5 font-normal underline underline-offset-4 hover:underline"
                >
                  Learn more about us
                </Link>
              </p>
            </div>
            <Image
              src={`${basePath}/images/nick-1060x593-16x9.jpg`}
              width={1185}
              height={593}
              className="rounded-base"
              alt="Nick, founder of Prompt Recovery"
            />
          </div>
        </div>
      </Section>
      {/* End About Section */}
      {/* Contact Form Section */}
      <Section id="request-a-quote">
        <div className="mx-auto max-w-7xl px-4 py-10 pt-18 sm:px-6 lg:px-8 lg:py-14 lg:pt-18">
          <SectionHeading sectionName="Request a quote" />
          <ContactForm action={config.form.action} accessKey={config.form.accessKey} />
        </div>
      </Section>
      {/* End Contact Form Section */}
      {/* Services Section */}
      <Section id="services" classNames="bg-light-grey">
        <div className="mx-auto max-w-7xl px-4 py-10 pt-18 sm:px-6 lg:px-8 lg:py-14 lg:pt-18">
          <SectionHeading sectionName="Services" />
          <div className="grid items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceItem
                key={service.name}
                href={hasServicePage(service.id) ? `/services/${service.id}/` : undefined}
                service={service}
              />
            ))}
          </div>
        </div>
      </Section>
      {/* End Services Section */}
      {/* Why Choose Us Section */}
      <Section id="choose-us" classNames="bg-light-grey">
        <div className="mx-auto max-w-7xl px-4 py-10 pt-18 sm:px-6 lg:px-8 lg:py-14 lg:pt-18">
          <SectionHeading sectionName="Why choose us" />
          <div className="grid items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reasonsToChooseNick.map((reason) => (
              <ServiceItem key={reason.name} service={reason} />
            ))}
          </div>
        </div>
      </Section>
      {/* End Why Choose Us Section */}
      {/* Find Us Section */}
      <Section id="find-us">
        <div className="mx-auto max-w-7xl px-4 py-10 pt-18 sm:px-6 lg:px-8 lg:py-14 lg:pt-18">
          <SectionHeading sectionName="Find us" />
          <h3 className="mb-2 text-center text-xl">We operate throughout Watford and surrounding areas.</h3>
          <h4 className="text-gl mb-8 text-center">Leggatts Wood Ave, Watford, WD24 6RR</h4>
          <GoogleMap />
        </div>
      </Section>
      {/* End Find Us Section */}
    </main>
  );
}
