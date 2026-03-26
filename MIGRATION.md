# Migration plan

## What Google cares about

### 1. Trailing slashes — no action needed

With `trailingSlash: true`, GitHub Pages serves `about/index.html` and treats both `/about` and `/about/` as the same
resource. Google will follow the canonical tags you've set (`/about/`) and consolidate signals to the trailing-slash
version within a few crawl cycles. No redirects needed — Next.js + GitHub Pages handle it transparently.

### 2. The `/blog 404` — only action required

The old sitemap includes `/blog` and Google likely has it indexed. When the new site goes live, `/blog` returns a 404.
That's a crawl error in GSC and any link equity to `/blog` is lost.

Since you can't do server-side 301s on a static GitHub Pages export, your options are:

#### Option A (recommended) — redirect stub page

Create `src/app/blog/page.tsx` that immediately redirects to home. Next.js supports this cleanly with `redirect()`:

```tsx
// src/app/blog/page.tsx
import { redirect } from 'next/navigation';
export default function BlogPage() {
  redirect('/');
}
```

This generates a static page that Next.js renders with a 308 redirect response in dev, and produces a meta-refresh for
the static export. Not a true 301 but Google handles it.

#### Option B — accept the 404

If `/blog` was a stub with no real content, it has minimal link equity. A temporary crawl error for a low-value stub
won't materially hurt rankings.

### 3. SEO signal changes — all positive

The new site is strictly better: JSON-LD, proper per-page canonicals, manifest, better descriptions. Google re-crawls
and re-evaluates these within days to weeks of deployment.

---

## Migration checklist

### Before deploying

- [x] Make sure [Google Search Console](https://search.google.com/search-console) is set up for promptrecovery.co.uk and
      you have access
- [x] Ensure `/src/app/data/seo.url` is <https://promptrecovery.co.uk>
- [x] Ensure `/public/CNAME` is <https://promptrecovery.co.uk>
- [x] Decide on /blog (stub redirect vs accept 404)
- [x] Remove APP_INDEX_MODE=NOINDEX from the production environment (don't set it as a GitHub Actions secret/variable)

### Deploy day

- [x] Push to `main` — GitHub Actions builds and deploys to `promptrecovery.co.uk`
- [] Verify <https://promptrecovery.co.uk/robots.txt> shows `Allow: /` (confirms NOINDEX is off)
- [] In GSC: **Sitemaps** → remove the old sitemap entry → submit <https://promptrecovery.co.uk/sitemap.xml>
- [] In GSC: **URL Inspection** → test the home page → request indexing

### First week

- [] Monitor GSC **Coverage** report for 404s (especially /blog)
- [] Monitor GSC **Core Web Vitals** — the new build should be comparable or better
- [] Check that rich results are detected: use Google's Rich Results Test against the live URL to confirm the
  LocalBusiness JSON-LD is picked up

### Expected timeline

- Robots/sitemap changes: hours to days
- Re-crawl of existing pages: days to 2 weeks
- Rich result eligibility (JSON-LD): 2–4 weeks after re-crawl
- Rankings stabilising: 2–6 weeks (minimal disruption expected given same domain)
