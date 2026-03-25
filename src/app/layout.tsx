import './globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import { Rating } from '@/components/rating';

import config from './config';
import { googleReviews, seo } from './data/index';

// The `metadata` export is the Next.js App Router way to set <head> tags.
// This root layout's metadata acts as the site-wide default; individual pages
// can override any field by exporting their own `metadata` object.
// See: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
/**
 * Shared Open Graph fields for every page. Next.js does not inherit `openGraph`
 * from parent layouts, so pages that set their own `openGraph` must spread this
 * to preserve site-level fields (type, locale, siteName, images).
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#opengraph
 */
export const baseOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  locale: 'en_GB',
  siteName: seo.businessName,
  images: [seo.ogImage],
};

export const metadata: Metadata = {
  metadataBase: new URL(seo.url),
  title: {
    // `template` wraps every page's title: "Page Name | Prompt Recovery"
    template: `%s | ${seo.businessName}`,
    // Fallback used when a page doesn't set its own title.
    default: seo.businessName,
  },
  description: seo.description,
  keywords: ['recovery service', 'roadside assistance', 'Watford', 'vehicle recovery', 'prompt recovery'],
  formatDetection: { telephone: true },
  icons: { icon: `${seo.url}/images/logo-128x128.png` },
  manifest: '/manifest.json',
  openGraph: baseOpenGraph,
  twitter: {
    card: 'summary_large_image',
    images: [seo.ogImage],
  },
};

/**
 * @type {Viewport}
 */
export const viewport = {
  themeColor: '#0a192f',
  colorScheme: 'light',
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'AutomotiveBusiness'],
  name: seo.businessName,
  legalName: seo.legalName,
  description: seo.description,
  url: seo.url,
  telephone: seo.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: seo.address.streetAddress,
    addressLocality: seo.address.addressLocality,
    addressRegion: seo.address.addressRegion,
    addressCountry: seo.address.addressCountry,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: seo.geo.latitude,
    longitude: seo.geo.longitude,
  },
  openingHours: seo.openingHours,
  areaServed: seo.areaServed,
  sameAs: seo.sameAs,
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: googleReviews.rating,
    reviewCount: googleReviews.userRatingCount,
    bestRating: 5,
    worstRating: 1,
  },
};

const inter = Inter({
  subsets: ['latin'],
});

// RootLayout wraps every page in the application. It must render an <html>
// and <body> element. Fonts, global providers, and persistent UI elements
// (nav, footer) should live here once they are built.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {/* GTM noscript must be the first element inside <body> per GTM docs */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${config.tracking.gtmId}`}
            height={0}
            width={0}
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

        {/* LocalBusiness JSON-LD — Google supports structured data anywhere in the document */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

        {/* Navbar determines the active page itself via usePathname() —
            no currentPage prop needed. */}
        <Navbar phoneNumber={seo.phone}>
          <div className="flex justify-center">
            <Rating rating={googleReviews.rating} />
            <span className="text-white">
              &nbsp;{googleReviews.rating}.0 from {googleReviews.userRatingCount} reviews on Google
            </span>
          </div>
        </Navbar>
        {children}
        <Footer
          facebookProfileId={config.socials.facebookProfileId}
          xProfileId={config.socials.xProfileId}
          googleReviewsId={config.socials.googleReviewsId}
          phoneNumber={seo.phone}
          phoneNumberDisplayAs={seo.phoneDisplayAs}
          email={seo.email}
        />

        {/* GTM script — deferred 2s to avoid blocking page load */}
        <Script
          defer
          id="googleTagManager"
          dangerouslySetInnerHTML={{
            __html: `
          setTimeout(function() {
              (function (w, d, s, l, i) {
                w[l] = w[l] || [];
                (w)[l].push({
                  "gtm.start": new Date().getTime(),
                  event: "gtm.js",
                });
                var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != "dataLayer" ? "&l=" + l : "";
                j.async = true;
                j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
                f.parentNode.insertBefore(j, f);
              })(window, document, "script", "dataLayer", "${config.tracking.gtmId}");
            }, 2000);
          `,
          }}
        />

        {/* Using next/script for GA may impact page performance. Instead it is
            recommended to use GoogleAnalytics from @next/third-parties/google as
            per https://nextjs.org/docs/messages/next-script-for-ga */}
        <GoogleAnalytics gaId={config.tracking.gaId} />
      </body>
    </html>
  );
}
