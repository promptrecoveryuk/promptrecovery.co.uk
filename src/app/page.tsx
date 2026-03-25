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

import { basePath } from './base-path';
import config from './config';
import { googleReviews, reasonsToChooseNick, seo, services } from './data/index';
import { baseOpenGraph } from './layout';

// Page-level metadata overrides the defaults set in layout.tsx.
// This page's browser tab will read: "Home | Prompt Recovery"
export const metadata: Metadata = {
  // Use absolute title (no template) so og:title is also descriptive
  title: { absolute: 'Prompt Recovery | Roadside Recovery & Towing in Watford' },
  alternates: { canonical: `${seo.url}/` },
  openGraph: { ...baseOpenGraph, url: seo.url },
};

// This is the home page, rendered at the root path `/`.
// Replace this placeholder with real content as the site is built out.
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col justify-center">
      {/*-- Hero --*/}
      <div className="from-primary-100 dark:from-primary-950 bg-light-grey relative bg-linear-to-bl via-transparent dark:via-transparent">
        <div className="mx-auto max-w-7xl px-4 py-10 pt-42 sm:px-6 lg:px-8 lg:py-14 lg:pt-36">
          {/*-- Grid --*/}
          <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-12">
            <div>
              {/*-- Title --*/}
              <div className="mt-4 md:mb-12">
                <h1 className="text-foreground mb-4 text-center text-4xl font-bold md:text-left lg:text-5xl">
                  Roadside recovery you can rely on
                </h1>
                <h2 className="text-foreground mb-4 text-center text-2xl font-semibold md:text-left lg:text-3xl">
                  Serving Watford and the surrounding areas
                </h2>
                <p className="text-muted-foreground-2 mb-4 text-center text-xl font-light md:text-left">
                  Fast, friendly and affordable help for vehicles under 4 tonnes
                </p>
                <p className="pt-4 text-center md:text-left">
                  <Link
                    href={`tel:${seo.phone}`}
                    className="bg-brand hover:bg-brand-light focus:ring-yellow rounded-base text-md box-border inline border border-transparent px-3 py-3 leading-5 font-normal text-white shadow-xs focus:ring-2 focus:outline-none"
                  >
                    Call Now
                  </Link>
                </p>
              </div>
              {/*-- End Title --*/}
            </div>

            <div>
              {/*-- Carousel --*/}
              <Carousel>
                {googleReviews.reviews.map((review) => (
                  <ReviewCardV2 key={review.publishTime} review={review} />
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
              <p className="text-xl font-light">
                Prompt Recovery Ltd is a locally trusted roadside recovery company based in Watford. With experience and
                a commitment to fast, reliable service, we&apos;re the first call you make when you&apos;re stuck.
              </p>
              <p className="mt-8">
                <Link
                  href="/about"
                  className="text-navy underline-navy inline text-xl leading-5 font-semibold underline-offset-4 hover:underline"
                >
                  Learn more about us
                </Link>
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
              <ServiceItem key={service.name} service={service} />
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
          <h3 className="mb-8 text-center text-xl">We operate throughout Watford and surrounding areas.</h3>
          <GoogleMap />
        </div>
      </Section>
      {/* End Find Us Section */}
    </main>
  );
}
