import type { MetadataRoute } from 'next';

import config from './config';
import { seo } from './data/index';

// Required for `output: 'export'` — see https://github.com/vercel/next.js/issues/68667
export const dynamic = 'force-static';

/**
 * Set APP_INDEX_MODE=NOINDEX in your environment to block all crawlers — useful
 * for staging/preview deployments that should not appear in search results.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots#generate-a-robots-file
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      ...(config.isNoindex ? { disallow: '/' } : { allow: '/' }),
    },
    sitemap: `${seo.url}/sitemap.xml`,
  };
}
