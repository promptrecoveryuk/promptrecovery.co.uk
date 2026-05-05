import { joinUrl, resolveSiteUrl } from '../../lib/site-url';
import { basePath } from '../base-path';
import faqs from './faqs.json';
import googleReviews from './google-reviews.json';
import pictures from './pictures.json';
import reasonsToChooseNick from './reasons-to-choose-nick.json';
import seoData from './seo.json';
import services from './services.json';
import staticGoogleReviews from './static-google-reviews.json';
import values from './values.json';

const siteUrl = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_ORIGIN ?? seoData.url, basePath);

const seo = {
  ...seoData,
  url: siteUrl,
  ogImage: {
    ...seoData.ogImage,
    url: /^https?:\/\//.test(seoData.ogImage.url) ? seoData.ogImage.url : joinUrl(siteUrl, seoData.ogImage.url),
  },
  images: seoData.images.map((img) => ({
    ...img,
    url: /^https?:\/\//.test(img.url) ? img.url : joinUrl(siteUrl, img.url),
  })),
};

export { faqs, googleReviews, pictures, reasonsToChooseNick, seo, services, staticGoogleReviews, values };
