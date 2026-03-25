import { expect, test } from '@playwright/test';

// Known post — the one that ships with the project.
const KNOWN_SLUG = 'what-to-do-when-your-car-breaks-down-on-the-motorway';
const KNOWN_TITLE = 'What to do when your car breaks down on the motorway';
const KNOWN_DATE = '21 March 2026'; // en-GB localeDateString

// ---------------------------------------------------------------------------
// Blog listing page (/blog/)
// ---------------------------------------------------------------------------

test.describe('Blog listing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog/');
  });

  test('renders the page heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Blog', level: 1 })).toBeVisible();
  });

  test('shows at least one post entry', async ({ page }) => {
    await expect(page.locator('ul li').first()).toBeVisible();
  });

  test('shows the known post title as a link', async ({ page }) => {
    await expect(page.getByRole('link', { name: KNOWN_TITLE })).toBeVisible();
  });

  test('shows the known post date', async ({ page }) => {
    await expect(page.getByText(KNOWN_DATE)).toBeVisible();
  });

  test('shows a description for the known post', async ({ page }) => {
    const item = page.locator('li').filter({ hasText: KNOWN_TITLE });
    await expect(item.locator('p')).toBeVisible();
    const text = await item.locator('p').textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('shows a "Read more" link for each post', async ({ page }) => {
    const readMoreLinks = page.getByRole('link', { name: /read more/i });
    await expect(readMoreLinks.first()).toBeVisible();
  });

  test('clicking the post title navigates to the post page', async ({ page }) => {
    await page.getByRole('link', { name: KNOWN_TITLE }).click();
    await expect(page).toHaveURL(new RegExp(`/blog/${KNOWN_SLUG}/`));
  });

  test('clicking "Read more" navigates to the post page', async ({ page }) => {
    const item = page.locator('li').filter({ hasText: KNOWN_TITLE });
    await item.getByRole('link', { name: /read more/i }).click();
    await expect(page).toHaveURL(new RegExp(`/blog/${KNOWN_SLUG}/`));
  });
});

// ---------------------------------------------------------------------------
// Blog post page (/blog/[slug]/)
// ---------------------------------------------------------------------------

test.describe('Blog post page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/blog/${KNOWN_SLUG}/`);
  });

  test('renders the post title as the main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: KNOWN_TITLE, level: 1 })).toBeVisible();
  });

  test('renders the post date', async ({ page }) => {
    await expect(page.getByText(KNOWN_DATE)).toBeVisible();
  });

  test('renders the post description in the header', async ({ page }) => {
    await expect(page.getByText(/Here's a step-by-step guide to staying safe and getting help fast/)).toBeVisible();
  });

  test('renders the post body content', async ({ page }) => {
    // Check for a section heading from the actual MDX content.
    await expect(page.getByRole('heading', { name: /Stay calm and pull over safely/i })).toBeVisible();
  });

  test('renders body text content', async ({ page }) => {
    await expect(page.getByText(/Breakdowns/)).toBeVisible();
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
    const response = await page.goto(`/blog/${KNOWN_SLUG}/`);
    expect(response?.status()).toBe(200);
  });
});

// ---------------------------------------------------------------------------
// Unknown slug → 404
// ---------------------------------------------------------------------------

test.describe('Unknown blog post slug', () => {
  test('returns a 404 for a slug that does not exist', async ({ page }) => {
    const response = await page.goto('/blog/this-post-does-not-exist/');
    expect(response?.status()).toBe(404);
  });
});
