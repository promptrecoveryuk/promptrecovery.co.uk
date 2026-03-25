import { expect, type Locator, type Page, test } from '@playwright/test';

const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function scrollToForm(page: Page) {
  await page.locator('form').scrollIntoViewIfNeeded();
}

/** The toast element — excludes Next.js's built-in route announcer which also uses role="alert". */
function toast(page: Page): Locator {
  return page.getByRole('alert').filter({ hasText: /./ });
}

/**
 * Fill every required field with valid defaults. Accepts an `overrides` map to
 * replace individual field values for targeted validation tests.
 */
async function fillRequiredFields(page: Page, overrides: Partial<Record<string, string>> = {}) {
  const values = {
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane@example.com',
    phone: '07700 900123',
    from_location: '1 High Street, WD1 1AB',
    to_location: '10 Test Road, WD2 2CD',
    vehicle_reg: 'AB12 CDE',
    vehicle_make_and_model: 'Ford Focus',
    ...overrides,
  };

  await page.getByLabel('First name').fill(values.first_name);
  await page.getByLabel('Last name').fill(values.last_name);
  await page.getByLabel('Email address').fill(values.email);
  await page.getByLabel('Phone number').fill(values.phone);
  await page.getByLabel(/From street address/).fill(values.from_location);
  await page.getByLabel(/To street address/).fill(values.to_location);
  await page.getByLabel('Vehicle reg').fill(values.vehicle_reg);
  await page.getByLabel(/Vehicle make/).fill(values.vehicle_make_and_model);

  // Select "Yes" for every Yes/No radio group.
  const yesRadios = page.getByRole('radio', { name: 'Yes' });
  await yesRadios.nth(0).check();
  await yesRadios.nth(1).check();
  await yesRadios.nth(2).check();
}

/** Mock the Web3Forms endpoint and return a success response. */
function mockSuccess(page: Page) {
  return page.route(WEB3FORMS_URL, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  );
}

/** Mock the Web3Forms endpoint and return a non-success response. */
function mockFailure(page: Page) {
  return page.route(WEB3FORMS_URL, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: false, message: 'Invalid access key' }),
    })
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await scrollToForm(page);
  });

  // --- Field presence -----------------------------------------------------------

  test('renders all required text fields', async ({ page }) => {
    await expect(page.getByLabel('First name')).toBeVisible();
    await expect(page.getByLabel('Last name')).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Phone number')).toBeVisible();
    await expect(page.getByLabel(/From street address/)).toBeVisible();
    await expect(page.getByLabel(/To street address/)).toBeVisible();
    await expect(page.getByLabel('Vehicle reg')).toBeVisible();
    await expect(page.getByLabel(/Vehicle make/)).toBeVisible();
  });

  test('renders three Yes/No radio groups with the correct questions', async ({ page }) => {
    await expect(page.getByText('Does the vehicle roll?')).toBeVisible();
    await expect(page.getByText('Does the vehicle start and drive?')).toBeVisible();
    await expect(page.getByText('Does the vehicle go into neutral?')).toBeVisible();
    await expect(page.getByRole('radio', { name: 'Yes' })).toHaveCount(3);
    await expect(page.getByRole('radio', { name: 'No' })).toHaveCount(3);
  });

  test('renders an enabled submit button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Request quote' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Request quote' })).toBeEnabled();
  });

  // --- HTML5 validation ---------------------------------------------------------

  test('blocks empty submission and focuses the first required field', async ({ page }) => {
    await page.getByRole('button', { name: 'Request quote' }).click();
    await expect(page.getByLabel('First name')).toBeFocused();
  });

  test('blocks submission when a required text field is cleared', async ({ page }) => {
    await fillRequiredFields(page);
    await page.getByLabel('Vehicle reg').fill('');
    await page.getByRole('button', { name: 'Request quote' }).click();
    await expect(page.getByLabel('Vehicle reg')).toBeFocused();
  });

  test('blocks submission when no radio option is selected for a group', async ({ page }) => {
    await fillRequiredFields(page);
    // Uncheck the first radio group programmatically (cannot uncheck a radio via UI).
    await page
      .locator('input[name="vehicle_rolls"]')
      .nth(0)
      .evaluate((el) => {
        (el as HTMLInputElement).checked = false;
      });
    await page.getByRole('button', { name: 'Request quote' }).click();
    await expect(page.locator('input[name="vehicle_rolls"]').nth(0)).toBeFocused();
  });

  // --- UK phone number validation -----------------------------------------------

  test.describe('phone number validation', () => {
    test('rejects a US-format number', async ({ page }) => {
      await fillRequiredFields(page, { phone: '555-123-4567' });
      await page.getByRole('button', { name: 'Request quote' }).click();
      await expect(page.getByLabel('Phone number')).toBeFocused();
    });

    test('rejects a number that is too short', async ({ page }) => {
      await fillRequiredFields(page, { phone: '0123' });
      await page.getByRole('button', { name: 'Request quote' }).click();
      await expect(page.getByLabel('Phone number')).toBeFocused();
    });

    test('rejects a number that does not start with 0 or +44', async ({ page }) => {
      await fillRequiredFields(page, { phone: '17700 900123' });
      await page.getByRole('button', { name: 'Request quote' }).click();
      await expect(page.getByLabel('Phone number')).toBeFocused();
    });

    test('accepts a standard UK mobile number (07xxx xxxxxx)', async ({ page }) => {
      await mockSuccess(page);
      await fillRequiredFields(page, { phone: '07700 900123' });
      await page.getByRole('button', { name: 'Request quote' }).click();
      await expect(toast(page)).toBeVisible();
    });

    test('accepts a UK mobile number without spaces', async ({ page }) => {
      await mockSuccess(page);
      await fillRequiredFields(page, { phone: '07700900123' });
      await page.getByRole('button', { name: 'Request quote' }).click();
      await expect(toast(page)).toBeVisible();
    });

    test('accepts a UK number with +44 international prefix', async ({ page }) => {
      await mockSuccess(page);
      await fillRequiredFields(page, { phone: '+44 7700 900123' });
      await page.getByRole('button', { name: 'Request quote' }).click();
      await expect(toast(page)).toBeVisible();
    });

    test('accepts a UK landline number', async ({ page }) => {
      await mockSuccess(page);
      await fillRequiredFields(page, { phone: '01923 123456' });
      await page.getByRole('button', { name: 'Request quote' }).click();
      await expect(toast(page)).toBeVisible();
    });
  });

  // --- Submission ---------------------------------------------------------------

  test('disables the button and shows "Sending…" while the request is in flight', async ({ page }) => {
    // Hold the route open until we have checked the loading state.
    let releaseRoute!: () => void;
    await page.route(WEB3FORMS_URL, async (route) => {
      await new Promise<void>((resolve) => (releaseRoute = resolve));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await fillRequiredFields(page);
    await page.getByRole('button', { name: 'Request quote' }).click();

    await expect(page.getByRole('button', { name: 'Sending…' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sending…' })).toBeDisabled();

    // Release the route and confirm the button returns to its idle label.
    releaseRoute();
    await expect(page.getByRole('button', { name: 'Request quote' })).toBeVisible();
  });

  test('sends the correct JSON payload, including the access key', async ({ page }) => {
    let requestBody: Record<string, unknown> = {};
    await page.route(WEB3FORMS_URL, async (route) => {
      requestBody = JSON.parse(route.request().postData() ?? '{}');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await fillRequiredFields(page);
    await page.getByRole('button', { name: 'Request quote' }).click();
    await expect(toast(page)).toBeVisible();

    expect(requestBody.access_key).toBeDefined();
    expect(requestBody.first_name).toBe('Jane');
    expect(requestBody.last_name).toBe('Smith');
    expect(requestBody.email).toBe('jane@example.com');
    expect(requestBody.phone).toBe('07700 900123');
    expect(requestBody.from_location).toBe('1 High Street, WD1 1AB');
    expect(requestBody.to_location).toBe('10 Test Road, WD2 2CD');
    expect(requestBody.vehicle_reg).toBe('AB12 CDE');
    expect(requestBody.vehicle_make_and_model).toBe('Ford Focus');
    expect(requestBody.vehicle_rolls).toBe('Yes');
    expect(requestBody.vehicle_starts_and_drives).toBe('Yes');
    expect(requestBody.vehicle_neutral).toBe('Yes');
  });

  test('shows a success toast and resets the form on a successful response', async ({ page }) => {
    await mockSuccess(page);
    await fillRequiredFields(page);
    await page.getByRole('button', { name: 'Request quote' }).click();

    await expect(toast(page)).toBeVisible();
    await expect(toast(page)).toContainText('Your quote request has been sent');

    // All text fields should be cleared after the reset.
    await expect(page.getByLabel('First name')).toHaveValue('');
    await expect(page.getByLabel('Last name')).toHaveValue('');
    await expect(page.getByLabel('Email address')).toHaveValue('');
  });

  test('shows an error toast when the API returns success: false', async ({ page }) => {
    await mockFailure(page);
    await fillRequiredFields(page);
    await page.getByRole('button', { name: 'Request quote' }).click();

    await expect(toast(page)).toBeVisible();
    await expect(toast(page)).toContainText('Something went wrong');
  });

  test('shows an error toast on a network failure', async ({ page }) => {
    await page.route(WEB3FORMS_URL, (route) => route.abort('failed'));
    await fillRequiredFields(page);
    await page.getByRole('button', { name: 'Request quote' }).click();

    await expect(toast(page)).toBeVisible();
    await expect(toast(page)).toContainText('Something went wrong');
  });

  test('preserves form values after a failed submission', async ({ page }) => {
    await mockFailure(page);
    await fillRequiredFields(page);
    await page.getByRole('button', { name: 'Request quote' }).click();

    await expect(toast(page)).toBeVisible();
    await expect(page.getByLabel('First name')).toHaveValue('Jane');
    await expect(page.getByLabel('Email address')).toHaveValue('jane@example.com');
  });

  // --- Optional fields ----------------------------------------------------------

  test('renders the optional additional information textarea', async ({ page }) => {
    await expect(page.getByPlaceholder('Any additional information')).toBeVisible();
  });

  test('includes the message field in the payload when filled', async ({ page }) => {
    let requestBody: Record<string, unknown> = {};
    await page.route(WEB3FORMS_URL, async (route) => {
      requestBody = JSON.parse(route.request().postData() ?? '{}');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await fillRequiredFields(page);
    await page.getByPlaceholder('Any additional information').fill('Please call before arriving.');
    await page.getByRole('button', { name: 'Request quote' }).click();
    await expect(toast(page)).toBeVisible();

    expect(requestBody.message).toBe('Please call before arriving.');
  });

  test('omits the message field from the payload when left empty', async ({ page }) => {
    let requestBody: Record<string, unknown> = {};
    await page.route(WEB3FORMS_URL, async (route) => {
      requestBody = JSON.parse(route.request().postData() ?? '{}');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await fillRequiredFields(page);
    await page.getByRole('button', { name: 'Request quote' }).click();
    await expect(toast(page)).toBeVisible();

    expect(requestBody.message).toBeFalsy();
  });

  // --- Radio "No" option --------------------------------------------------------

  test('sends "No" in the payload when the No radio is selected', async ({ page }) => {
    let requestBody: Record<string, unknown> = {};
    await page.route(WEB3FORMS_URL, async (route) => {
      requestBody = JSON.parse(route.request().postData() ?? '{}');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await fillRequiredFields(page);
    // Override all three groups to "No".
    const noRadios = page.getByRole('radio', { name: 'No' });
    await noRadios.nth(0).check();
    await noRadios.nth(1).check();
    await noRadios.nth(2).check();
    await page.getByRole('button', { name: 'Request quote' }).click();
    await expect(toast(page)).toBeVisible();

    expect(requestBody.vehicle_rolls).toBe('No');
    expect(requestBody.vehicle_starts_and_drives).toBe('No');
    expect(requestBody.vehicle_neutral).toBe('No');
  });

  // --- Re-submission after success ----------------------------------------------

  test('can be submitted a second time after a successful submission', async ({ page }) => {
    await mockSuccess(page);
    await fillRequiredFields(page);
    await page.getByRole('button', { name: 'Request quote' }).click();

    await expect(toast(page)).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(toast(page)).not.toBeVisible();

    // Fill and submit a second time.
    await fillRequiredFields(page);
    await page.getByRole('button', { name: 'Request quote' }).click();

    await expect(toast(page)).toBeVisible();
    await expect(toast(page)).toContainText('Your quote request has been sent');
  });

  // --- Toast -------------------------------------------------------------------

  test('dismisses the toast when the close button is clicked', async ({ page }) => {
    await mockSuccess(page);
    await fillRequiredFields(page);
    await page.getByRole('button', { name: 'Request quote' }).click();

    await expect(toast(page)).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(toast(page)).not.toBeVisible();
  });

  test('re-enables the submit button after the toast is dismissed', async ({ page }) => {
    await mockFailure(page);
    await fillRequiredFields(page);
    await page.getByRole('button', { name: 'Request quote' }).click();

    await expect(toast(page)).toBeVisible();
    // Button is enabled again once the loading phase ends (error state).
    await expect(page.getByRole('button', { name: 'Request quote' })).toBeEnabled();

    // Dismissing the toast returns to idle — form can be submitted again.
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(toast(page)).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Request quote' })).toBeEnabled();
  });
});
