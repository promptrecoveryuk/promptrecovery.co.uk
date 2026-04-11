# Improvements

Practical backlog for improving `promptrecovery.co.uk`.

## High Priority

- [ ] Add Lighthouse CI to GitHub Actions and fail builds when performance, SEO, or accessibility scores regress below
      agreed thresholds.
  - [ ] Decide the initial thresholds for performance, accessibility, best practices, and SEO.
  - [ ] Run Lighthouse against the homepage and at least one content page template.
  - [ ] Add the Lighthouse check to GitHub Actions so regressions fail CI.
  - [ ] Document how to update thresholds when intentional design or content changes affect scores.
- [ ] Add a broken-link checker for internal links, canonical URLs, sitemap entries, and markdown links inside MDX
      content.
  - [ ] Check all internal route links rendered from pages, components, and MDX.
  - [ ] Verify canonical URLs match real exported routes.
  - [ ] Validate all sitemap entries resolve successfully.
  - [ ] Parse markdown-style links inside FAQ answers and body content.
- [ ] Expand unit test coverage around metadata, schema generation, sitemap logic, `services.json` consistency, and
      service-page linking.
  - [ ] Add tests for metadata fallbacks and canonical URL generation.
  - [ ] Add tests for JSON-LD builders with FAQ and breadcrumb edge cases.
  - [ ] Add tests for sitemap inclusion and exclusion rules.
  - [ ] Add tests that catch mismatches between `services.json` and MDX service pages.
- [ ] Expand the existing Playwright coverage with a dedicated smoke suite for key commercial paths.
  - [ ] Add homepage smoke assertions beyond the contact form.
  - [ ] Add individual service page coverage, not just the services listing page.
  - [ ] Add a small fast-running core-routes smoke suite for CI.
  - [ ] Add any extra explicit 404 smoke coverage outside the existing blog and area checks.
- [ ] Review image delivery and convert large assets to modern formats with explicit width/height to reduce layout shift
      and improve mobile performance.
  - [ ] Identify the heaviest assets in `public/` and on the homepage.
  - [ ] Convert oversized images to modern formats where practical.
  - [ ] Ensure rendered images have explicit dimensions or reserved space.
  - [ ] Re-check mobile Lighthouse and layout shift after the asset pass.
- [ ] Audit every page for unique title, description, H1, canonical URL, and matching page intent to avoid SEO dilution.
  - [ ] Review homepage, services, areas, blog, and about pages first.
  - [ ] Check that each page has a single clear search intent.
  - [ ] Flag duplicated metadata or vague headings for rewrite.
  - [ ] Verify canonical URLs use `seo.url` consistently.
- [ ] Add a simple content validation script that flags missing frontmatter, duplicate slugs, empty FAQ answers, and
      schema-unfriendly markdown in structured data fields.
  - [ ] Validate required frontmatter fields across posts, areas, and services.
  - [ ] Catch duplicate slugs or duplicate canonical targets.
  - [ ] Flag FAQ answers that are empty, placeholder-like, or unsuitable for schema output.
  - [ ] Run the validator in CI so content problems are caught before deploy.
- [ ] Tighten form resilience with better spam protection, clearer success/failure states, and analytics events for
      quote submissions and phone-call clicks.
  - [ ] Review whether the current form setup needs a honeypot, rate limiting proxy, or extra anti-spam measures.
  - [ ] Improve the user-facing error copy for failed submissions.
  - [ ] Track successful quote requests as a primary conversion event.
  - [ ] Track click-to-call interactions separately from form submissions.

## Medium Priority

- [ ] Add a reusable social/open-graph image strategy so key pages and blog posts share with branded, readable preview
      images.
  - [ ] Define one base visual system for static page and article previews.
  - [ ] Decide which routes need unique OG images and which can share templates.
  - [ ] Ensure text remains readable on mobile social previews.
  - [ ] Add generation guidance so new content ships with matching share assets.
- [ ] Add a content freshness workflow for area pages, service pages, and blog posts so stale pages are reviewed on a
      schedule.
  - [ ] Define review intervals for core services, locations, and advice content.
  - [ ] Record last-reviewed dates for each content type.
  - [ ] Create a lightweight reminder or report for stale pages.
  - [ ] Prioritise commercial pages before informational blog posts.
- [ ] Add a small analytics dashboard or reporting script for top landing pages, quote conversions, phone clicks, and
      organic search growth.
  - [ ] Decide whether this should be a script, spreadsheet export, or simple internal dashboard.
  - [ ] Pull the core KPIs into one place.
  - [ ] Separate branded from non-branded organic traffic if possible.
  - [ ] Make it easy to compare month-on-month performance.
- [ ] Review third-party script usage and loading strategy to keep GTM/GA integration as light as possible on first
      load.
  - [ ] Inventory all third-party scripts and embeds currently on the site.
  - [ ] Confirm each one is still necessary.
  - [ ] Delay or remove anything non-essential on initial load.
  - [ ] Re-test performance after the script pass.
- [ ] Add a checked deployment preview step that verifies the static export output, sitemap, robots, and key route
      responses before publish.
  - [ ] Build the static export in CI before deployment.
  - [ ] Check that `robots.txt` and `sitemap.xml` are present and correct.
  - [ ] Verify key commercial routes return the expected status codes.
  - [ ] Fail the deployment pipeline if any of the checks break.
- [ ] Document a clear MDX authoring checklist for titles, FAQs, schema suitability, internal links, and local SEO
      wording.
  - [ ] Cover frontmatter requirements and slug conventions.
  - [ ] Explain how FAQ answers should be written for both users and schema output.
  - [ ] Include internal-linking expectations between services, areas, and blog posts.
  - [ ] Add examples of acceptable local SEO phrasing versus keyword stuffing.

## Lower Priority

- [ ] Introduce visual regression screenshots for the homepage and core templates to catch unintended design shifts.
  - [ ] Start with homepage, area page, service page, and blog post templates.
  - [ ] Capture both desktop and mobile baselines.
  - [ ] Decide which visual differences should fail CI versus require manual review.
- [ ] Add richer structured data where justified, such as more complete FAQ coverage and stronger internal linking
      between services, areas, and blog posts.
  - [ ] Review which current pages already qualify for richer schema.
  - [ ] Expand FAQ coverage only where the content is genuinely useful.
  - [ ] Improve internal links between commercial and informational pages.
  - [ ] Validate the output against Google rich result expectations.
- [ ] Create a small content inventory report showing which services in `services.json` do not yet have matching detail
      pages.
  - [ ] List every service ID in `services.json`.
  - [ ] Match each ID against existing MDX service slugs.
  - [ ] Output missing service pages in a simple report.
  - [ ] Use the report to prioritise future service-page content work.
- [ ] Review whether Flowbite is still earning its keep; remove or replace unused JS-dependent components if they add
      unnecessary weight.
  - [ ] Inventory where Flowbite is currently used.
  - [ ] Identify components that could be replaced with simpler local code.
  - [ ] Measure the bundle and runtime impact before and after changes.
  - [ ] Remove any dead Flowbite dependencies if they are no longer needed.

## YouTube And Social Publishing

- [ ] Create and brand a YouTube channel for Prompt Recovery with consistent logo, banner, business description, contact
      details, and links back to the site.
  - [ ] Finalise channel name, handle, and profile copy.
  - [ ] Prepare banner artwork, profile image, and link set.
  - [ ] Add the website, contact details, and service area information.
  - [ ] Keep branding aligned with the site rather than inventing a separate look.
- [ ] Build a simple publishing workflow for new content so each useful site update can also become a YouTube video,
      YouTube Short, X post, and Facebook post.
  - [ ] Define the steps from website content to video/post outputs.
  - [ ] Decide which content types should trigger social repurposing automatically.
  - [ ] Keep the workflow lightweight enough to use consistently.
  - [ ] Document the process so it can be repeated without rethinking it each time.
- [ ] Write platform-specific descriptive text for every post rather than reusing the same caption everywhere.
  - [ ] Define the ideal post length and tone per platform.
  - [ ] Tailor the hook, body, and call to action for X, Facebook, and YouTube.
  - [ ] Keep service wording practical and local rather than generic.
  - [ ] Reuse ideas, but not identical copy, across platforms.
- [ ] Create a small library of caption templates for:
  - [ ] Service announcements.
  - [ ] Local area posts.
  - [ ] Breakdown advice tips.
  - [ ] Customer review highlights.
  - [ ] Blog-post promotion.
- [ ] Add UTM-tagged links for X, Facebook, and YouTube descriptions so traffic from each platform can be measured in
      analytics.
  - [ ] Define a consistent UTM naming convention.
  - [ ] Create reusable tagged URLs for core landing pages.
  - [ ] Ensure the analytics setup can actually report on the campaigns.
  - [ ] Avoid inconsistent manual tagging from post to post.
- [ ] Add a content calendar covering at least 4 to 6 weeks of posts so publishing stays consistent instead of ad hoc.
  - [ ] Plan a balanced mix of service, location, advice, and trust-building posts.
  - [ ] Schedule at least one recurring short-form video format.
  - [ ] Tie posts to seasonal breakdown trends where relevant.
  - [ ] Leave room for reactive local or operational updates.
- [ ] Record and publish practical short videos such as recovery callout explanations, towing safety tips, local route
      advice, and common breakdown scenarios.
  - [ ] Prioritise low-friction video ideas that can be recorded on real jobs or nearby routes.
  - [ ] Keep videos short, direct, and operationally accurate.
  - [ ] Add subtitles or on-screen text for silent autoplay.
  - [ ] End with a clear service-area and contact prompt.
- [ ] Include a short, descriptive YouTube video summary on each upload with location relevance, service keywords, and a
      clear call to action.
  - [ ] Mention the service and town naturally in the opening lines.
  - [ ] Link back to the most relevant page on the site.
  - [ ] Add contact details and a simple call to action.
  - [ ] Avoid keyword stuffing or vague marketing filler.
- [ ] Include descriptive X and Facebook post text that explains the problem being solved, the area served, and the next
      action to take.
  - [ ] Explain the situation in plain language.
  - [ ] Mention the served town or route where relevant.
  - [ ] Include one clear action such as call, message, or visit the site.
  - [ ] Keep the wording readable for stressed drivers, not polished marketing copy.

## Useful Supporting Assets

- [x] Create a shared folder for approved photos, short-form video clips, logos, thumbnails, and reusable post
      descriptions.
  - [ ] Separate raw assets from approved publish-ready assets.
  - [ ] Use consistent naming so assets are easy to find.
  - [ ] Keep thumbnail and caption drafts together where useful.
- [ ] Create a lightweight posting checklist covering image/video dimensions, link tracking, spelling, hashtags, and
      contact details.
  - [ ] Check post formatting before publishing.
  - [ ] Confirm links and UTM tags are correct.
  - [ ] Confirm phone number, website, and branding are current.
- [ ] Keep a running list of post ideas based on real services, local roads, seasonal breakdown risks, and FAQs from
      customers.
  - [ ] Add ideas after real callouts and customer questions.
  - [ ] Group ideas by service, town, and season.
  - [ ] Mark which ideas are best as blog posts, shorts, or social-only posts.
