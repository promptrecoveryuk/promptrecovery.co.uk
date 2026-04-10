import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // `output: 'export'` tells Next.js to produce a fully static site in the
  // `out/` directory when you run `next build`. No Node.js server is needed
  // at runtime — perfect for GitHub Pages.
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,

  // Static export cannot use Next.js's built-in image optimisation (which
  // requires a server). Setting `unoptimized: true` lets you use <Image />
  // components without a server; images are served as-is from `public/`.
  // If you later move to a server-rendered host, you can remove this.
  images: {
    unoptimized: true,
  },

  // Append a trailing slash to all routes (e.g. /about → /about/).
  // Most static hosts (including GitHub Pages) serve `about/index.html`
  // rather than `about.html`, so this prevents 404s on direct navigation.
  trailingSlash: true,

  // Set NEXT_PUBLIC_BASE_PATH=/promptrecovery.co.uk when building for GitHub Pages
  // (project page URL: username.github.io/repo-name). Leave it unset for the
  // custom domain (promptrecovery.co.uk) and for local dev / Playwright tests.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
};

// Integrate MDX rendering into TypeScript/Next.js
import createMDX from '@next/mdx';
const withMDX = createMDX({});
export default withMDX(nextConfig);
