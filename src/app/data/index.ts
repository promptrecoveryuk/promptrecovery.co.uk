import { basePath } from '../base-path';
import faqs from './faqs.json';
import googleReviews from './google-reviews.json';
import pictures from './pictures.json';
import reasonsToChooseNick from './reasons-to-choose-nick.json';
import seoData from './seo.json';
import services from './services.json';
import values from './values.json';

function normalizeBasePath(path: string): string {
  if (!path) return '';

  return `/${path.replace(/^\/+|\/+$/g, '')}`;
}

function joinUrl(base: string, path: string): string {
  const normalizedBase = base.replace(/\/+$/g, '');
  const normalizedPath = path ? `/${path.replace(/^\/+/, '')}` : '';

  return `${normalizedBase}${normalizedPath}`;
}

const siteUrl = joinUrl(seoData.url, normalizeBasePath(basePath));

const seo = {
  ...seoData,
  url: siteUrl,
  ogImage: {
    ...seoData.ogImage,
    url: /^https?:\/\//.test(seoData.ogImage.url) ? seoData.ogImage.url : joinUrl(siteUrl, seoData.ogImage.url),
  },
};

export { faqs, googleReviews, pictures, reasonsToChooseNick, seo, services, values };
