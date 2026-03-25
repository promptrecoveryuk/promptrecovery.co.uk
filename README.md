# Prompt Recovery

Website for [promptrecovery.co.uk](https://promptrecovery.co.uk) — a small business site for a Watford-based roadside
recovery company. Built with Next.js, TypeScript, and Tailwind CSS, and deployed as a static site to GitHub Pages. UI
interactions are powered by Flowbite; icons come from Lucide React; quote requests are submitted via Web3Forms.

---

## Tech Stack

| Tool                                                                            | Version  | Purpose                                           |
| ------------------------------------------------------------------------------- | -------- | ------------------------------------------------- |
| [Next.js](https://nextjs.org/)                                                  | 15       | React framework, static export                    |
| [React](https://react.dev/)                                                     | 19       | UI library                                        |
| [TypeScript](https://www.typescriptlang.org/)                                   | 5        | Type safety                                       |
| [Tailwind CSS](https://tailwindcss.com/)                                        | 4        | Utility-first styling                             |
| [Flowbite](https://flowbite.com/)                                               | 4        | Interactive UI components (carousel, mobile menu) |
| [Lucide React](https://lucide.dev/)                                             | 0.577    | Icon library                                      |
| [Web3Forms](https://web3forms.com/)                                             | —        | Static-site-compatible contact form submissions   |
| [@next/third-parties](https://nextjs.org/docs/app/guides/third-party-libraries) | 15       | Google Analytics & GTM integration                |
| [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)                 | 5        | RSC-compatible MDX rendering for blog posts       |
| Node.js `node:test`                                                             | built-in | Unit testing                                      |
| [tsx](https://tsx.is/)                                                          | 4        | TypeScript loader for tests                       |

---

## Prerequisites

- **Node.js 22+** — matches the CI environment. Node 18/20 may work but are untested locally.
- **npm 10.5+** — Tailwind v4 uses a native Rust module (`@tailwindcss/oxide`) distributed via npm optional
  dependencies. Older npm releases (pre-10.5) have a bug where optional sub-packages are silently skipped, causing a
  "Cannot find native binding" error at runtime. See [Troubleshooting](#troubleshooting) if you hit this.

Check your versions:

```bash
node --version   # should be v22.x or higher
npm --version    # should be 10.5 or higher
```

Upgrade if needed:

```bash
# Upgrade Node via your version manager (nvm, fnm, volta, etc.)
# e.g. with nvm:
nvm install 22 && nvm use 22

# Upgrade npm independently of Node:
npm install -g npm@latest
```

---

## Getting Started

```bash
# Install dependencies
npm install
```

---

## Configuration & Environment Variables

Runtime configuration is centralised in `src/app/config.ts`, which reads from environment variables. Three variables are
required:

| Variable                | Description                                                | Where to get it                                         |
| ----------------------- | ---------------------------------------------------------- | ------------------------------------------------------- |
| `FORM_ACCESS_KEY`       | Web3Forms access key — routes quote requests to your email | [web3forms.com](https://web3forms.com/) → your account  |
| `GOOGLE_TAG_MANAGER_ID` | GTM container ID (format: `GTM-XXXXXXX`)                   | [tagmanager.google.com](https://tagmanager.google.com/) |
| `GOOGLE_ANALYTICS_ID`   | GA4 measurement ID (format: `G-XXXXXXXXXX`)                | [analytics.google.com](https://analytics.google.com/)   |

### Optional variables

| Variable         | Description                                                              | When to set                                              |
| ---------------- | ------------------------------------------------------------------------ | -------------------------------------------------------- |
| `APP_INDEX_MODE` | Set to `NOINDEX` to make `robots.txt` block all crawlers (`Disallow: /`) | Staging / preview environments only — omit in production |

When `APP_INDEX_MODE=NOINDEX`, `robots.ts` returns `Disallow: /` for all user agents, preventing the environment from
appearing in search results. Leave the variable unset (or absent) in production.

The `.env.example` file includes this variable set to `NOINDEX` as a safe default, so local development is never
accidentally indexed. Remove or unset it if you need to test production crawler behaviour locally.

### Script-only variables (local use, not needed in CI)

| Variable              | Description                                                                                 | Where to get it                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `GOOGLE_PLACE_ID`     | Your Google Business place ID — used by `fetch-reviews` to identify which business to fetch | [Find your Place ID](https://developers.google.com/maps/documentation/places/web-service/place-id) |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key with **Places API (New)** enabled                                       | [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials          |

These two are only read by `scripts/fetch-google-reviews.mjs` and are never injected into the Next.js build.

### Local development

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Then edit `.env` with real values. The file is gitignored — never commit it.

`config.ts` loads the file automatically via `dotenv` when the dev server or build runs locally.

### CI / GitHub Actions (deployed site)

The workflow reads these variables from **environment secrets** scoped to the `github-pages` environment, and injects
them at build time.

**One-time setup** (per variable):

1. Go to your repository on GitHub.
2. Navigate to **Settings → Environments → github-pages → Environment secrets**.
3. Click **Add environment secret**.
4. Add each variable using the exact names in the table above.

The `Build` step in `.github/workflows/deploy.yml` already maps them:

```yaml
env:
  FORM_ACCESS_KEY: ${{ secrets.FORM_ACCESS_KEY }}
  GOOGLE_TAG_MANAGER_ID: ${{ secrets.GOOGLE_TAG_MANAGER_ID }}
  GOOGLE_ANALYTICS_ID: ${{ secrets.GOOGLE_ANALYTICS_ID }}
```

If a secret is missing or empty, the build will still succeed but the corresponding feature (form submissions,
analytics) will be silently disabled.

---

## Development

```bash
npm run dev
```

Opens a local development server at [http://localhost:3000](http://localhost:3000) with hot-reload. Changes to files
under `src/` are reflected instantly without a page refresh.

> The dev server uses a Node.js runtime — it does **not** represent the final static output. Always verify the
> production build before deploying (see below).

---

## Building

```bash
npm run build
```

Next.js compiles and exports the site to the `out/` directory as plain HTML, CSS, and JavaScript — no server required.
The `out/` folder is what gets deployed to GitHub Pages.

To preview the production output locally:

```bash
npx serve out
```

> `out/` is in `.gitignore` and is never committed. GitHub Actions rebuilds it fresh on every deploy.

---

## Testing

Tests use Node's **built-in test runner** (`node:test`) — no Jest, Vitest, or Mocha required.

### Run all tests

```bash
npm test
```

This expands to:

```bash
node --import tsx --test 'src/**/*.test.ts'
```

- `--import tsx` loads TypeScript support so `.ts` files run directly without a separate compile step.
- `--test` activates the native test runner.
- The glob `src/**/*.test.ts` is expanded by the shell (zsh/bash) before Node receives it.

### Run a single file

```bash
node --import tsx --test src/__tests__/example.test.ts
```

### Writing tests

Place test files anywhere under `src/` and name them `*.test.ts`. The test runner picks them up automatically.

```ts
import { describe, it, before, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

describe('My feature', () => {
  it('does something correct', () => {
    assert.equal(myFunction(1, 2), 3);
  });
});
```

**What to test:**

- Pure utility and helper functions
- Data transformation and formatting logic
- URL / slug builders
- Anything that doesn't require a browser or React rendering

**What not to test here:**

- React components (use a browser-based test tool such as Playwright for those)
- Next.js routing (covered by the framework's own tests)

### Test output

The native runner produces TAP-compatible output by default. Pass `--test-reporter=spec` for a more human-readable
format:

```bash
node --import tsx --test --test-reporter=spec 'src/**/*.test.ts'
```

---

## Project Structure

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD: build, test, deploy to GitHub Pages
├── public/
│   ├── CNAME                       # Custom domain for GitHub Pages
│   ├── .nojekyll                   # Prevents GitHub Pages from running Jekyll
│   └── images/                     # Static images served at /images/
├── src/
│   ├── app/
│   │   ├── about/
│   │   │   └── page.tsx            # /about page
│   │   ├── blog/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx        # /blog/<slug> — renders an MDX post via next-mdx-remote
│   │   │   └── page.tsx            # /blog — lists all posts
│   │   ├── data/
│   │   │   ├── index.ts            # Barrel re-export for all data files
│   │   │   ├── faqs.json           # FAQ questions and answers
│   │   │   ├── google-reviews.json # Google review data
│   │   │   ├── pictures.json       # Gallery image paths
│   │   │   ├── reasons-to-choose-nick.json
│   │   │   ├── seo.json            # Business info, SEO metadata, structured data
│   │   │   ├── services.json       # Service names, descriptions, icons
│   │   │   └── values.json         # Company values
│   │   ├── faqs/
│   │   │   └── page.tsx            # /faqs page (includes FAQPage JSON-LD)
│   │   ├── services/
│   │   │   └── page.tsx            # /services page
│   │   ├── globals.css             # Tailwind import + @theme customisation
│   │   ├── layout.tsx              # Root HTML shell, site-wide metadata, JSON-LD
│   │   └── page.tsx                # Home page (/)
│   ├── components/
│   │   ├── carousel.tsx            # Flowbite-powered review carousel
│   │   ├── contact-form.tsx        # Quote request form (Web3Forms submission)
│   │   ├── faq-item.tsx            # Individual FAQ row
│   │   ├── footer.tsx              # Site footer
│   │   ├── form-field.tsx          # Reusable floating-label text input
│   │   ├── google-map.tsx          # Embedded Google Map iframe
│   │   ├── google-user-profile.tsx # Review author avatar + name
│   │   ├── grid-gallery.tsx        # Photo grid
│   │   ├── icons.ts                # Lucide React barrel re-export (see Icons section)
│   │   ├── navbar.tsx              # Fixed top nav, Flowbite mobile menu
│   │   ├── rating.tsx              # Star rating display
│   │   ├── review-card-v2.tsx      # Individual Google review card
│   │   ├── section-heading.tsx     # Styled section title
│   │   ├── section.tsx             # Page section wrapper
│   │   ├── service-item.tsx        # Service/value card
│   │   ├── toast.tsx               # Success/error notification
│   │   └── yes-no-radio-group.tsx  # Yes/No radio pair for contact form
│   ├── content/
│   │   └── posts/
│   │       └── *.mdx               # Blog posts (one file per post)
│   ├── lib/
│   │   ├── pictures.ts             # Helper to resolve a picture by index and size
│   │   └── posts.ts                # Blog post helpers: list slugs, read meta, read content
│   └── types.ts                    # Shared TypeScript types
├── .gitignore
├── .nvmrc                          # Pins the Node.js version for nvm users (run: nvm use)
├── mdx-components.tsx              # MDX element styles (headings, lists, links, etc.)
├── next.config.ts                  # Static export, image, and routing config
├── package.json
├── postcss.config.mjs              # PostCSS pipeline (@tailwindcss/postcss)
├── README.md
└── tsconfig.json
```

---

## UI Components — Flowbite

[Flowbite](https://flowbite.com/) provides interactive component behaviours (carousels, collapsible menus, toasts) via
`data-*` attributes wired up by a small JavaScript library. It is installed via npm and used **without** a CDN
`<script>` tag.

### Initialisation

Flowbite must be initialised after the DOM is ready. Because the site uses client-side navigation (Next.js App Router),
the library must also re-initialise after every route change to re-wire components on new pages. This is handled in
`navbar.tsx`, which is already a client component:

```tsx
useEffect(() => {
  import('flowbite').then(({ initFlowbite }) => initFlowbite());
}, [pathname]); // re-run on every navigation
```

The dynamic `import()` keeps Flowbite out of the server bundle and defers loading until it is actually needed in the
browser.

### Components in use

| Component     | File                          | Key attributes                                                                                                       |
| ------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Carousel      | `src/components/carousel.tsx` | `data-carousel="static"`, `data-carousel-item`, `data-carousel-prev`, `data-carousel-next`, `data-carousel-slide-to` |
| Mobile navbar | `src/components/navbar.tsx`   | `data-collapse-toggle`, `aria-controls`, `aria-expanded`                                                             |

### What Flowbite is NOT used for

The `Toast` component uses React state (an `onClose` callback) rather than Flowbite's `data-dismiss-target` attribute.
This is intentional — Flowbite's dismiss requires the element to already be in the DOM when the library initialises,
which is not guaranteed for dynamically rendered toasts.

### Adding new Flowbite components

1. Find the component in the [Flowbite docs](https://flowbite.com/docs/).
2. Copy the HTML and translate to JSX (camelCase attributes, `className` instead of `class`).
3. Flowbite's JS picks up the `data-*` attributes automatically after the next `initFlowbite()` call — no extra wiring
   needed.

---

## Icons — Lucide React

[Lucide React](https://lucide.dev/) provides 1,500+ consistent, open source icons as React components. Each icon is a
lightweight SVG that accepts standard props (`className`, `size`, `strokeWidth`, `aria-hidden`, etc.).

### Barrel re-export — `src/components/icons.ts`

All icons used in the project are re-exported from a single barrel file rather than imported directly from
`lucide-react` throughout the codebase. This keeps imports consistent and makes it easy to see which icons are in use at
a glance.

```ts
// src/components/icons.ts
export { Check, ChevronLeft, ChevronRight, Menu, X, ... } from 'lucide-react';
```

**Always import icons from `@/components/icons`, not from `lucide-react` directly:**

```tsx
// ✅ correct
import { Check, X } from '@/components/icons';

// ❌ avoid — bypasses the barrel
import { Check } from 'lucide-react';
```

### Adding a new icon

1. Find the icon name on [lucide.dev](https://lucide.dev/).
2. Add the named export to `src/components/icons.ts`.
3. Import and use it in your component.

```ts
// 1. Add to icons.ts
export { ..., MapPin } from 'lucide-react';
```

```tsx
// 2. Use in a component
import { MapPin } from '@/components/icons';

<MapPin className="h-5 w-5" aria-hidden="true" />;
```

### Usage conventions

| Concern          | Convention                                                                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Size             | Prefer Tailwind classes (`className="w-5 h-5"`) for consistency; use the `size` prop only when a numeric value is clearer (e.g. `size={14}` for inline text icons) |
| Decorative icons | Add `aria-hidden="true"` so screen readers skip them                                                                                                               |
| Meaningful icons | Omit `aria-hidden` and add an `aria-label` or adjacent `<span className="sr-only">`                                                                                |
| Stroke width     | Leave at the default (`2`) unless the design requires otherwise                                                                                                    |

### Custom SVGs (non-Lucide)

Two icons in the codebase are intentionally **not** from Lucide:

| Icon                  | Location                            | Reason                                                                     |
| --------------------- | ----------------------------------- | -------------------------------------------------------------------------- |
| WhatsApp logo         | `src/components/navbar.tsx`         | Brand icon with a specific green gradient; no Lucide equivalent            |
| Decorative quote mark | `src/components/review-card-v2.tsx` | Custom shape with a non-standard viewBox, part of the card's visual design |

---

## Content & SEO Data

All editable content lives in JSON files under `src/app/data/`. These are imported and re-exported via
`src/app/data/index.ts`.

### `seo.json`

The single source of truth for business information used across metadata and structured data:

- **Next.js `metadata` export** in `layout.tsx` — populates `<title>`, `<meta name="description">`, Open Graph, and
  Twitter Card tags.
- **`LocalBusiness` + `AggregateRating` JSON-LD** in `layout.tsx` — injected on every page for Google's rich results.
- **`FAQPage` JSON-LD** in `faqs/page.tsx` — built from `faqs.json` at build time.

To update business details (address, phone, hours, social links), edit `seo.json` — no code changes are needed.

---

## Blog

Blog posts are written in MDX (Markdown with optional React components) and live in `src/content/posts/`. Each file
becomes a statically rendered page at `/blog/<slug>/`. There is no CMS or external service — posts are committed to the
repository and built at deploy time alongside the rest of the site.

### Writing a post

Create a new `.mdx` file in `src/content/posts/`. The filename becomes the URL slug:

```text
src/content/posts/my-new-post.mdx  →  /blog/my-new-post/
```

Every post must begin with YAML frontmatter:

```mdx
---
title: 'My Post Title'
date: '2026-06-01'
description: 'One sentence shown on the listing page and used as the meta description.'
imageIndex: 3
---

Your markdown content goes here...
```

| Field         | Required | Description                                                                                                                |
| ------------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `title`       | Yes      | Displayed as the `<h1>` in the post header and used as the `<title>` tag.                                                  |
| `date`        | Yes      | ISO 8601 date (`YYYY-MM-DD`). Used for display and to sort posts newest-first on the index.                                |
| `description` | Yes      | Shown on the listing page below the title and used as the `<meta name="description">` value.                               |
| `imageIndex`  | Yes      | 1-based index into `src/app/data/pictures.json`. Shown in the post header and used for Open Graph / Twitter Card previews. |

### How it works

```
src/content/posts/<slug>.mdx
         │
         ├── gray-matter parses the frontmatter → PostMeta (title, date, description, imageIndex)
         │
         └── next-mdx-remote/rsc compiles the markdown body → React Server Component
                   │
                   └── mdxComponents (mdx-components.tsx) styles headings, lists, links, etc.
```

- **`src/lib/posts.ts`** — Three helpers used at build time:
  - `getPostSlugs()` — reads `src/content/posts/` and returns all `.mdx` filenames (without extension).
  - `getPostMeta(slug)` — reads a single file and returns its frontmatter as `PostMeta`.
  - `getPostContent(slug)` — returns both the frontmatter and the raw markdown body (frontmatter stripped).
  - `getAllPostsMeta()` — returns all posts sorted newest-first; used by the listing page.
- **`generateStaticParams`** in `src/app/blog/[slug]/page.tsx` — calls `getPostSlugs()` so Next.js knows which pages to
  pre-render at build time. No posts are rendered at runtime.
- **`mdx-components.tsx`** (project root) — defines the styled React elements that replace bare HTML tags inside MDX
  (e.g. `<h2>` gets Tailwind heading classes). Also satisfies the `@next/mdx` app-router requirement. The same
  `mdxComponents` object is imported directly by the post page and passed to `<MDXRemote components={...} />`.

### Deploying a new post

Because the site is a static export, a new post requires a build:

1. Add the `.mdx` file to `src/content/posts/`.
2. Push to `main` — the GitHub Actions workflow rebuilds and redeploys automatically.

No other code changes are needed.

---

## Contact Form — Web3Forms

The quote request form (`src/components/contact-form.tsx`) submits to [Web3Forms](https://web3forms.com/), a third-party
service that forwards submissions to an email address. This works without a backend server, making it compatible with a
static export.

The access key is set in `src/app/page.tsx`:

```tsx
const action = 'https://api.web3forms.com/submit';
const accessKey = 'your-access-key-here';
```

On submit, the form POSTs a JSON body containing `access_key` and all form field values. A `Toast` notification confirms
success or failure. On success, the form resets.

> The access key is a public identifier (not a secret) — it is safe to commit and visible in the browser.

---

## Google Reviews — `fetch-reviews`

Google reviews displayed on the homepage are stored as static JSON in `src/app/data/google-reviews.json`. They are
fetched on demand (not at build time) using a local script, then committed so the static site can include them without a
server.

### Running the script

```bash
npm run fetch-reviews
```

This calls `scripts/fetch-google-reviews.mjs`, which:

1. Reads `GOOGLE_PLACE_ID` and `GOOGLE_MAPS_API_KEY` from `.env`.
2. Calls the **Google Places API (New)** to fetch the business's reviews and aggregate rating.
3. Filters to reviews with 4★ or higher.
4. Writes the result to `src/app/data/google-reviews.json`.

The output shape matches the `GoogleReviews` type in `src/types.ts`:

```json
{
  "displayName": "Prompt Recovery",
  "rating": 5.0,
  "userRatingCount": 42,
  "reviewsUrl": "https://maps.google.com/...",
  "reviews": [
    {
      "rating": 5,
      "text": "...",
      "publishTime": "2024-11-01T10:00:00Z",
      "when": "3 months ago",
      "author": "Jane Smith",
      "authorUrl": "https://...",
      "authorPhoto": "https://..."
    }
  ]
}
```

### Setup

Before running the script, add the two variables to your `.env` file (see
[Script-only variables](#script-only-variables-local-use-not-needed-in-ci) above).

You will also need a Google Cloud project with the **Places API (New)** enabled, and an API key restricted to that API.
The key is only used locally and is never exposed in the browser or committed to the repository.

### Keeping reviews up to date

Run `npm run fetch-reviews` whenever you want to pull in new reviews, then commit the updated
`src/app/data/google-reviews.json`. The next deployment will include the latest data automatically.

---

## Deployment

Deployment is fully automated via GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)).

Every push to `main`:

1. Installs dependencies
2. Runs the test suite (a failure here blocks deployment)
3. Runs `npm run build` to produce `out/`
4. Uploads `out/` as a GitHub Pages artifact and deploys it

### One-time GitHub setup

1. **Enable GitHub Pages via Actions:** Go to your repository → **Settings** → **Pages** → **Source** → select **GitHub
   Actions**.

2. **Configure the custom domain:**
   - In **Settings → Pages → Custom domain**, enter `promptrecovery.co.uk`.
   - The `public/CNAME` file (already committed) tells GitHub Pages which domain to serve — these two must match.
   - GitHub will automatically provision a TLS certificate once the DNS records are in place.

3. **DNS records** (at your domain registrar):

   | Type    | Host  | Value                       |
   | ------- | ----- | --------------------------- |
   | `A`     | `@`   | `185.199.108.153`           |
   | `A`     | `@`   | `185.199.109.153`           |
   | `A`     | `@`   | `185.199.110.153`           |
   | `A`     | `@`   | `185.199.111.153`           |
   | `CNAME` | `www` | `<your-username>.github.io` |

   DNS propagation can take up to 48 hours. Check status at **Settings → Pages**.

### Manual deployment trigger

You can also deploy without pushing code via the **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**.

---

## Configuration Notes

### `next.config.ts`

- `output: 'export'` — static export mode; no Node.js server at runtime.
- `images.unoptimized: true` — Next.js image optimisation requires a server; this disables it for static export. Use
  Next.js `<Image />` tags with this flag (supports the basePath setting, useful when running in a folder).
- `trailingSlash: true` — produces `about/index.html` instead of `about.html`, which is the convention expected by
  GitHub Pages.

### `globals.css` / Tailwind v4

Tailwind v4 uses a **CSS-first** configuration model — there is no `tailwind.config.ts`. A single
`@import "tailwindcss"` replaces the three directives from v3. Customise the design system using a `@theme` block with
CSS custom properties:

```css
@theme {
  --color-brand: #1d4ed8;
  --font-sans: 'Inter', sans-serif;
}
```

Tailwind auto-detects source files from your project; no `content` globs to configure.

### Google Fonts — `next/font/google`

The site uses [Inter](https://fonts.google.com/specimen/Inter) loaded via `next/font/google` in `layout.tsx`:

```ts
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
```

`next/font/google` **self-hosts** the font files at build time — it downloads them from Google Fonts during `next build`
and bundles them as static assets. At runtime, the browser loads the font from your own domain (or GitHub Pages), never
from `fonts.googleapis.com`. This means:

- No external DNS lookup or network round-trip for the font at page load
- No Google Fonts cookie or request visible to the user — GDPR-friendly by default
- No `<link rel="preconnect">` or `<link rel="stylesheet">` in `<head>` is needed; Next.js injects an optimised
  `<style>` block instead

To change the font, swap the import and constructor call in `layout.tsx`. The
[Next.js font docs](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) list all available Google
Fonts and configuration options (weights, styles, variable fonts, CSS variable mode).

### `public/.nojekyll`

An empty file that prevents GitHub Pages from running the Jekyll static site generator on your `out/` directory. Without
it, files and folders starting with `_` (which Next.js uses internally) would be silently ignored by GitHub Pages.

---

## Linting & Formatting

Two separate tools handle code quality:

| Tool                             | Config file         | Responsibility                                     |
| -------------------------------- | ------------------- | -------------------------------------------------- |
| [ESLint](https://eslint.org/)    | `eslint.config.mjs` | Code correctness, style rules, import order        |
| [Prettier](https://prettier.io/) | `.prettierrc`       | Consistent code formatting, Tailwind class sorting |

### ESLint

```bash
npm run lint        # report problems
npm run lint:fix    # report and auto-fix where possible
```

The flat config (`eslint.config.mjs`) layers four rule sets in order:

1. **`@eslint/js` recommended** — standard JavaScript best practices
2. **`typescript-eslint` recommended** — TypeScript-specific rules (no unused vars, explicit types where needed, etc.)
3. **`eslint-config-next/core-web-vitals`** — Next.js rules including Core Web Vitals checks (e.g. no `<img>` without
   `<Image />`, correct `<Script>` usage)
4. **`eslint-plugin-simple-import-sort`** — enforces alphabetically sorted import blocks, keeping the import list
   predictable and diff-friendly

### Prettier

```bash
npm run format        # check formatting without making changes (useful in CI)
npm run format:write  # reformat all files in place
```

`.prettierrc` settings of note:

- `printWidth: 120` — longer lines than the Prettier default (80) to suit modern wide screens
- `singleQuote: true` — single quotes for strings
- `proseWrap: always` — wraps Markdown prose at `printWidth`, keeping the README readable in any editor
- `plugins: ["prettier-plugin-tailwindcss"]` — automatically sorts Tailwind utility classes in `className` props into
  the [recommended order](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier); no manual ordering needed

### Running both together

```bash
npm run lint:fix && npm run format:write
```

---

## Troubleshooting

### "Cannot find native binding" on `npm run dev`

Tailwind v4 uses a native Rust module (`@tailwindcss/oxide`) that is distributed as a platform-specific optional npm
package. Older versions of npm have a bug where these optional sub-packages are not installed, even though the parent
package is present.

**Fix:**

```bash
# 1. Upgrade npm to a version that handles optional dependencies correctly
npm install -g npm@latest

# 2. Clear the broken install and reinstall cleanly
rm -rf node_modules package-lock.json
npm install
```

If upgrading npm is not an option, an alternative workaround is to force optional dependency installation:

```bash
rm -rf node_modules package-lock.json
npm install --include=optional
```
