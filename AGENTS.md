# AGENTS.md

Guidance for coding agents working in this repository.

## Overview

- Project: marketing/site build for `promptrecovery.co.uk`
- Stack: Next.js App Router, React 19, TypeScript, Tailwind CSS 4, MDX
- Deployment target: static export to GitHub Pages
- Package manager: `npm`
- Node version: `24.x`

## Core Commands

- Install deps: `npm install`
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Unit tests: `npm test`
- UI tests: `npm run test:ui`
- Build static export: `npm run build`
- Trello backlog dry-run sync: `npm run trello:sync -- --file LOCAL_SEO_PLAN.md --dry-run`

## Architecture

### App routes

- `src/app/page.tsx`: homepage
- `src/app/about/page.tsx`: about page
- `src/app/services/page.tsx`: services listing page
- `src/app/services/[slug]/page.tsx`: individual service pages from MDX
- `src/app/areas/page.tsx`: areas listing page
- `src/app/areas/[slug]/page.tsx`: individual area pages from MDX
- `src/app/blog/page.tsx`: blog listing page
- `src/app/blog/[slug]/page.tsx`: individual blog posts from MDX

### Content collections

The site has three MDX-backed collections:

- `src/content/posts`
- `src/content/areas`
- `src/content/services`

Shared collection loading lives in:

- `src/lib/mdx-collections.ts`

Collection-specific wrappers live in:

- `src/lib/posts.ts`
- `src/lib/areas.ts`
- `src/lib/services.ts`

### Shared content rendering

Shared article-style page rendering lives in:

- `src/components/content-article-page.tsx`

Blog, area, and service detail pages should reuse this shell where possible.

### Structured data

JSON-LD helpers live in:

- `src/lib/schema.ts`

Prefer using the schema helpers instead of constructing new JSON-LD objects inline unless the shape is genuinely unique.

### Data files

Structured JSON data lives in:

- `src/app/data/services.json`
- `src/app/data/faqs.json`
- `src/app/data/seo.json`
- `src/app/data/google-reviews.json`
- `src/app/data/pictures.json`

Important: `services.json` remains the source of truth for service cards on the homepage and services listing page.
Individual service pages are opt-in via matching MDX files in `src/content/services`.

If a service page exists, its slug should match the corresponding `services.json` `id`.

### Trello backlog files

The backlog and Trello board contract live in:

- `improvement-ideas/*.md`
- `TRELLO.md`

The sync script lives in:

- `scripts/trello-sync.ts`

Shared parsing/building helpers live in:

- `src/lib/trello-backlog.ts`

## Conventions

### SEO

- Primary commercial focus is local `breakdown recovery`, `vehicle recovery`, `car recovery`, `van recovery`, and
  `towing`
- Prefer `breakdown recovery` / `vehicle recovery` over broad `roadside assistance` phrasing unless the wording is
  carefully qualified
- Do not introduce copy that implies full roadside repair/diagnostics unless the business genuinely offers it
- Keep page titles, descriptions, headings, and body copy aligned with the actual service offered
- For location pages, combine service intent with the town/area naturally in:
  - page title
  - H1
  - intro copy
  - at least one subheading where appropriate
- For service pages, keep the service keyword in the title/H1 and use nearby towns or roads only where it reads
  naturally
- Avoid keyword stuffing; this is a local-service site, so clarity and local relevance matter more than repetition

### Structured data / JSON-LD

- Reuse helpers in `src/lib/schema.ts` instead of hand-building new schema objects in route files
- Site-wide entities live in `src/app/layout.tsx` and should stay consistent:
  - `WebSite`
  - `LocalBusiness`
- Static pages should prefer `buildPageSchema(...)`
- Article-like pages should prefer:
  - `buildArticleSchema(...)`
  - `buildBreadcrumbSchema(...)`
  - `buildFaqPageSchema(...)`
  - `buildHowToSchema(...)` where appropriate
- Keep schema entity ids connected through `getSchemaIds(siteUrl)`
- If FAQ content contains markdown links, strip them before using answers in structured data

### Metadata

- Canonical URLs should always use `seo.url`
- Reuse `baseOpenGraph` from `src/app/layout.tsx` for page-level Open Graph data
- Keep `title`, `description`, canonical, and visible page intent aligned
- If adding a new significant route, add page-level metadata and any fitting JSON-LD at the same time

### Content Writing Tone

- Write in clear UK English
- Keep the tone practical, calm, and reassuring rather than salesy or exaggerated
- Focus on what the business actually does:
  - recovery
  - towing
  - transport
  - local callouts
- Avoid inflated claims unless they are explicitly supported
- Prefer direct, concrete wording over vague marketing language
- For service and area pages, local knowledge should feel specific and believable rather than generic
- Keep copy readable for stressed users who may be visiting during a breakdown
- Use short-to-medium paragraphs and straightforward headings
- If adding FAQs, write them in natural customer language and make the answers operationally accurate

### Service cards

- Homepage and services listing cards are driven by `services.json`
- Cards become links only when a matching service page exists
- Use `hasServicePage()` from `src/lib/services.ts` for that check

### MDX frontmatter

All MDX-backed content uses the shared content metadata model in `src/types.ts`.

Relevant types:

- `BaseContentMeta`
- `PostMeta`
- `AreaMeta`
- `ServiceMeta`

When introducing a new MDX-backed collection, follow the same pattern:

1. add a collection-specific type in `src/types.ts`
2. add a wrapper in `src/lib/<collection>.ts`
3. reuse `src/lib/mdx-collections.ts`
4. reuse `src/components/content-article-page.tsx` if the page is article-like

### FAQ answers

FAQ answers may contain markdown-style inline links like:

- `[Rickmansworth](/areas/rickmansworth/)`

These are rendered by:

- `src/lib/markdown-links.tsx`

If FAQ answers are used in structured data, strip markdown first rather than emitting raw markdown into JSON-LD.

### Trello backlog sync

- `improvement-ideas/*.md` are machine-parsed by the Trello sync script, so keep its card format stable unless you also
  update the parser and tests
- Each card must use:
  - `### Card: <title>`
  - blank line
  - `Card ID: ...`
  - `List: Inbox 📥`
  - `Labels: ...`
  - `#### What are we trying to achieve?`
  - `#### Why are we doing this?`
  - `#### Acceptance criteria`
- `Card ID` is the sync key for updates, so do not change it casually after a card has been synced
- Trello labels in `improvement-ideas/*.md` must match the names in `TRELLO.md` exactly
- The Trello card description contains the narrative sections; acceptance criteria are synced as a checklist named
  `Acceptance criteria`
- Prefer `npm run trello:sync -- --file <filename>.md --dry-run` before applying Trello changes
- If you change the Trello backlog format or sync behavior, update README and the Trello backlog tests

## Testing Guidance

- Unit tests live in `src/__tests__`
- Use the built-in Node test runner, not Jest/Vitest
- Prefer focused tests for helpers/loaders/schema builders
- Existing coverage includes posts, areas, services, schema builders, and generic MDX collection helpers
- Playwright specs live in `e2e`

When adding behavior in shared loaders, schema helpers, or service-linking logic, add or update unit tests. When
changing the Trello backlog parser or sync contract, update `src/__tests__/trello-backlog.test.ts`.

## Deployment Notes

- GitHub Actions workflow: `.github/workflows/deploy.yml`
- Actions are pinned to current majors and use Node 24
- Static export relies on `trailingSlash: true`
- `basePath` is controlled via `NEXT_PUBLIC_BASE_PATH`

## Practical Advice For Future Changes

- Prefer extending shared helpers over duplicating route logic
- Keep page-specific schema thin and reuse `src/lib/schema.ts`
- Do not replace `services.json` with MDX; MDX only augments it with optional detail pages
- Keep README and tests in sync when introducing new shared abstractions
