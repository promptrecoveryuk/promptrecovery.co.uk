import './globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { Bitter, Inter } from 'next/font/google';
import Script from 'next/script';

import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import { Rating } from '@/components/rating';
import { ratingToString } from '@/lib/rating-to-string';
import { buildLocalBusinessSchema, buildWebsiteSchema } from '@/lib/schema';

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
  keywords: [
    'breakdown recovery Watford',
    'vehicle recovery Watford',
    'car recovery Watford',
    'van recovery Watford',
    'motorway recovery Watford',
    'Prompt Recovery',
  ],
  formatDetection: { telephone: true },
  icons: { icon: `${seo.url}/favicon.png` },
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

const localBusinessSchema = buildLocalBusinessSchema({
  address: seo.address,
  areaServed: seo.areaServed,
  description: seo.description,
  geo: seo.geo,
  hasMap: seo.googleMapsUrl,
  image: seo.images.map((img) => img.url),
  legalName: seo.legalName,
  openingHours: seo.openingHours,
  phone: seo.phone,
  priceRange: '$',
  ratingValue: googleReviews.rating,
  reviewCount: googleReviews.userRatingCount,
  sameAs: seo.sameAs,
  siteName: seo.businessName,
  siteUrl: seo.url,
});

const websiteSchema = buildWebsiteSchema({
  alternateName: seo.legalName,
  siteName: seo.businessName,
  siteUrl: seo.url,
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const bitter = Bitter({
  subsets: ['latin'],
  variable: '--font-bitter',
});

// RootLayout wraps every page in the application. It must render an <html>
// and <body> element. Fonts, global providers, and persistent UI elements
// (nav, footer) should live here once they are built.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${bitter.variable}`}>
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

        {/* Site name and business schema help Google understand the brand and entity behind the site. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

        {/* Navbar determines the active page itself via usePathname() —
            no currentPage prop needed. */}
        <Navbar phoneNumber={seo.phone}>
          <div className="flex justify-center">
            <Rating rating={googleReviews.rating} size={26} />
            <span className="text-white">
              &nbsp;
              <a
                href={`https://www.google.com/maps/place/${config.socials.googleReviewsId}`}
                rel="noopener noreferrer"
                target="_blank"
                className="inline-block text-sm"
              >
                <span className="xs:inline hidden">Rated </span>
                {ratingToString(googleReviews.rating)}/5 from {googleReviews.userRatingCount} Google reviews
              </a>
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
