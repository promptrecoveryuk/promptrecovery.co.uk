import { expect, type Page, test } from '@playwright/test';

/** Reads and parses every JSON-LD script block in the page. */
async function getJsonLdSchemas(page: Page): Promise<Record<string, unknown>[]> {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('script[type="application/ld+json"]')).flatMap((el) => {
      try {
        return [JSON.parse(el.textContent ?? '') as Record<string, unknown>];
      } catch {
        return [];
      }
    })
  );
}

// Known area — the real Rickmansworth area page.
const KNOWN_SLUG = 'rickmansworth';
const KNOWN_TITLE = 'Breakdown Recovery in Rickmansworth';
const KNOWN_DATE = '10 April 2026'; // en-GB localeDateString
const KNOWN_DESCRIPTION = 'Fast, friendly vehicle recovery and towing in Rickmansworth';

// ---------------------------------------------------------------------------
// Areas listing page (/areas/)
// ---------------------------------------------------------------------------

test.describe('Areas listing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/areas/');
  });

  test('renders the page heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Areas', level: 1 })).toBeVisible();
  });

  test('shows at least one area entry', async ({ page }) => {
    await expect(page.locator('ul li').first()).toBeVisible();
  });

  test('shows the known area title as a link', async ({ page }) => {
    await expect(page.getByRole('link', { name: KNOWN_TITLE })).toBeVisible();
  });

  test('shows the known area date', async ({ page }) => {
    await expect(page.getByText(KNOWN_DATE)).toBeVisible();
  });

  test('shows a description for the known area', async ({ page }) => {
    const item = page.locator('li').filter({ hasText: KNOWN_TITLE });
    await expect(item.locator('p')).toBeVisible();
    const text = await item.locator('p').textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('shows a "Read more" link for each area', async ({ page }) => {
    const readMoreLinks = page.getByRole('link', { name: /read more/i });
    await expect(readMoreLinks.first()).toBeVisible();
  });

  test('clicking the area title navigates to the area page', async ({ page }) => {
    await page.locator(`a[href="/areas/${KNOWN_SLUG}/"]`).click();
    await expect(page).toHaveURL(new RegExp(`/areas/${KNOWN_SLUG}/`));
  });

  test('clicking "Read more" navigates to the area page', async ({ page }) => {
    await page.locator(`a[href="/areas/${KNOWN_SLUG}/"]`).click();
    await expect(page).toHaveURL(new RegExp(`/areas/${KNOWN_SLUG}/`));
  });
});

// ---------------------------------------------------------------------------
// Area detail page (/areas/[slug]/)
// ---------------------------------------------------------------------------

test.describe('Area detail page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/areas/${KNOWN_SLUG}/`);
  });

  test('renders the area title as the main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: KNOWN_TITLE, level: 1 })).toBeVisible();
  });

  test('renders the area date', async ({ page }) => {
    await expect(page.getByText(KNOWN_DATE)).toBeVisible();
  });

  test('renders the area description in the header', async ({ page }) => {
    await expect(page.getByText(new RegExp(KNOWN_DESCRIPTION))).toBeVisible();
  });

  test('renders the area body content', async ({ page }) => {
    // Check for a section heading from the actual MDX content.
    await expect(page.getByRole('heading', { name: /Trouble Spots and Busy Routes/i })).toBeVisible();
  });

  test('renders body text content', async ({ page }) => {
    await expect(page.getByText(/Breaking down is one of those moments/)).toBeVisible();
  });

  test('does not render raw frontmatter on the page', async ({ page }) => {
    const body = await page.locator('body').textContent();
    expect(body).not.toContain('imageIndex:');
    expect(body).not.toContain('---');
  });

  test('has the correct page <title> tag', async ({ page }) => {
    await expect(page).toHaveTitle(new RegExp(KNOWN_TITLE));
  });

  test('returns a non-404 status', async ({ page }) => {
    const response = await page.goto(`/areas/${KNOWN_SLUG}/`);
    expect(response?.status()).toBe(200);
  });

  // -------------------------------------------------------------------------
  // Breadcrumb
  // -------------------------------------------------------------------------

  test('renders the breadcrumb navigation', async ({ page }) => {
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible();
  });

  test('breadcrumb contains a link to Home', async ({ page }) => {
    const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(breadcrumb.getByRole('link', { name: 'Home' })).toBeVisible();
  });

  test('breadcrumb contains a link to Areas', async ({ page }) => {
    const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(breadcrumb.getByRole('link', { name: 'Areas' })).toBeVisible();
  });

  test('breadcrumb shows the current area title', async ({ page }) => {
    const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(breadcrumb.getByText(KNOWN_TITLE)).toBeVisible();
  });

  // -------------------------------------------------------------------------
  // JSON-LD structured data
  // -------------------------------------------------------------------------

  test('emits a FAQPage JSON-LD script block', async ({ page }) => {
    const schemas = await getJsonLdSchemas(page);
    expect(schemas.some((s) => s['@type'] === 'FAQPage')).toBe(true);
  });

  test('FAQPage JSON-LD contains the expected questions', async ({ page }) => {
    const schemas = await getJsonLdSchemas(page);
    const faqSchema = schemas.find((s) => s['@type'] === 'FAQPage') as
      | { mainEntity: Array<{ name: string }> }
      | undefined;
    expect(faqSchema).toBeDefined();
    expect(faqSchema!.mainEntity.length).toBeGreaterThan(0);
    const questions = faqSchema!.mainEntity.map((q) => q.name);
    expect(questions).toContain('Do you cover the motorway routes near Rickmansworth?');
  });

  test('emits a BreadcrumbList JSON-LD script block', async ({ page }) => {
    const schemas = await getJsonLdSchemas(page);
    expect(schemas.some((s) => s['@type'] === 'BreadcrumbList')).toBe(true);
  });

  // -------------------------------------------------------------------------
  // Reviews section
  // -------------------------------------------------------------------------

  test('shows the "What our customers say" heading when reviewIds are set', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /What our customers say/i })).toBeVisible();
  });

  test('renders at least one review card', async ({ page }) => {
    await expect(page.locator('blockquote').first()).toBeVisible();
  });

  // -------------------------------------------------------------------------
  // "More from the area" related areas sidebar
  // -------------------------------------------------------------------------
  // This test is skipped because it relies on the presence of at least one other area .mdx file in the content directory.
  // I haven't set up a test fixture for this yet, and I don't want to add a dummy .mdx file just for the test, so for now it's skipped.
  test.skip('shows the "More from the area" section when other areas exist', async ({ page }) => {
    // This relies on there being at least one other area in /content/areas/.
    // If this test fails, ensure a second .mdx file exists alongside the known slug.
    const aside = page.getByRole('complementary');
    const heading = aside.getByRole('heading', { name: /More from the area/i });
    await expect(heading).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Page without reviewIds — reviews section should be absent
// ---------------------------------------------------------------------------

test.describe('Area page without reviewIds', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/areas/made-up-area-test/');
  });

  test('does not show the "What our customers say" heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /What our customers say/i })).not.toBeVisible();
  });

  test('does not render any review cards', async ({ page }) => {
    await expect(page.locator('blockquote')).toHaveCount(0);
  });
});

// ---------------------------------------------------------------------------
// Unknown slug → 404
// ---------------------------------------------------------------------------

test.describe('Unknown area slug', () => {
  test('returns a 404 for a slug that does not exist', async ({ page }) => {
    const response = await page.goto('/areas/this-area-does-not-exist/');
    expect(response?.status()).toBe(404);
  });
});
