# Improvements

Practical backlog for improving `promptrecovery.co.uk`.

## High Priority

- [ ] Add Lighthouse CI to GitHub Actions and fail builds when performance, SEO, or accessibility scores regress below
      agreed thresholds.
- [ ] Add a broken-link checker for internal links, canonical URLs, sitemap entries, and markdown links inside MDX
      content.
- [ ] Expand unit test coverage around metadata, schema generation, sitemap logic, `services.json` consistency, and
      service-page linking.
- [ ] Add Playwright smoke coverage for key commercial paths: homepage, services list, a service page, an area page,
      blog, contact/quote form, and 404 handling.
- [ ] Review image delivery and convert large assets to modern formats with explicit width/height to reduce layout shift
      and improve mobile performance.
- [ ] Audit every page for unique title, description, H1, canonical URL, and matching page intent to avoid SEO dilution.
- [ ] Add a simple content validation script that flags missing frontmatter, duplicate slugs, empty FAQ answers, and
      schema-unfriendly markdown in structured data fields.
- [ ] Tighten form resilience with better spam protection, clearer success/failure states, and analytics events for
      quote submissions and phone-call clicks.

## Medium Priority

- [ ] Add a reusable social/open-graph image strategy so key pages and blog posts share with branded, readable preview
      images.
- [ ] Add a content freshness workflow for area pages, service pages, and blog posts so stale pages are reviewed on a
      schedule.
- [ ] Add a small analytics dashboard or reporting script for top landing pages, quote conversions, phone clicks, and
      organic search growth.
- [ ] Review third-party script usage and loading strategy to keep GTM/GA integration as light as possible on first
      load.
- [ ] Add a checked deployment preview step that verifies the static export output, sitemap, robots, and key route
      responses before publish.
- [ ] Document a clear MDX authoring checklist for titles, FAQs, schema suitability, internal links, and local SEO
      wording.

## Lower Priority

- [ ] Introduce visual regression screenshots for the homepage and core templates to catch unintended design shifts.
- [ ] Add richer structured data where justified, such as more complete FAQ coverage and stronger internal linking
      between services, areas, and blog posts.
- [ ] Create a small content inventory report showing which services in `services.json` do not yet have matching detail
      pages.
- [ ] Review whether Flowbite is still earning its keep; remove or replace unused JS-dependent components if they add
      unnecessary weight.

## YouTube And Social Publishing

- [ ] Create and brand a YouTube channel for Prompt Recovery with consistent logo, banner, business description, contact
      details, and links back to the site.
- [ ] Build a simple publishing workflow for new content so each useful site update can also become a YouTube video,
      YouTube Short, X post, and Facebook post.
- [ ] Write platform-specific descriptive text for every post rather than reusing the same caption everywhere.
- [ ] Create a small library of caption templates for:
  - service announcements
  - local area posts
  - breakdown advice tips
  - customer review highlights
  - blog-post promotion
- [ ] Add UTM-tagged links for X, Facebook, and YouTube descriptions so traffic from each platform can be measured in
      analytics.
- [ ] Add a content calendar covering at least 4 to 6 weeks of posts so publishing stays consistent instead of ad hoc.
- [ ] Record and publish practical short videos such as recovery callout explanations, towing safety tips, local route
      advice, and common breakdown scenarios.
- [ ] Include a short, descriptive YouTube video summary on each upload with location relevance, service keywords, and a
      clear call to action.
- [ ] Include descriptive X and Facebook post text that explains the problem being solved, the area served, and the next
      action to take.

## Useful Supporting Assets

- [ ] Create a shared folder for approved photos, short-form video clips, logos, thumbnails, and reusable post
      descriptions.
- [ ] Create a lightweight posting checklist covering image/video dimensions, link tracking, spelling, hashtags, and
      contact details.
- [ ] Keep a running list of post ideas based on real services, local roads, seasonal breakdown risks, and FAQs from
      customers.
