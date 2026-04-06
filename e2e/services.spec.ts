import { expect, test } from '@playwright/test';

const LINKED_SERVICE_TITLE = 'Breakdown & Towing';
const LINKED_SERVICE_SLUG = 'breakdown-towing';
const UNLINKED_SERVICE_TITLE = 'Motorway Recovery';

test.describe('Services listing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/services/');
  });

  test('linked services navigate to their own service page', async ({ page }) => {
    await page.getByRole('link', { name: new RegExp(LINKED_SERVICE_TITLE) }).click();
    await expect(page).toHaveURL(new RegExp(`/services/${LINKED_SERVICE_SLUG}/`));
  });

  test('services without their own page are not links', async ({ page }) => {
    await expect(page.getByRole('link', { name: new RegExp(UNLINKED_SERVICE_TITLE) })).toHaveCount(0);
  });
});
