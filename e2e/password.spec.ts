import { expect, test, type Locator, type Page } from '@playwright/test';

const exampleSection = (page: Page, name: string) =>
  page.locator(`[data-section="${name}"]`);

const passwordInput = (section: Locator) =>
  section.locator('input[type="password"], input[type="text"]').first();

const fillPassword = async (section: Locator, value: string) => {
  const input = passwordInput(section);
  await input.scrollIntoViewIfNeeded();
  await input.focus();
  await input.fill(value);
  return input;
};

const blurPassword = async (section: Locator) => {
  await passwordInput(section).evaluate((input) => input.blur());
};

test.describe('Password', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/password');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(100);
  });

  test('renders a password input and toggle button', async ({ page }) => {
    const section = exampleSection(page, 'passthrough');
    await expect(passwordInput(section)).toBeVisible();
    await expect(section.locator('button[aria-label="Show password"]')).toBeVisible();
  });

  test('toggles password visibility without losing the typed value', async ({ page }) => {
    const section = exampleSection(page, 'passthrough');
    const input = passwordInput(section);
    const toggleButton = section.locator('button[aria-label="Show password"]').first();

    await fillPassword(section, 'mySecurePassword');
    await toggleButton.click();

    await expect(section.locator('button[aria-label="Hide password"]')).toBeVisible();
    await expect(input).toHaveAttribute('type', 'text');
    await expect(input).toHaveValue('mySecurePassword');

    await section.locator('button[aria-label="Hide password"]').click();
    await expect(input).toHaveAttribute('type', 'password');
    await expect(input).toHaveValue('mySecurePassword');
  });

  test('passes through the raw value when requiredStrength is unset', async ({ page }) => {
    const section = exampleSection(page, 'passthrough');
    const input = await fillPassword(section, 'plain-password');

    await expect(input).toHaveValue('plain-password');
    await expect(section.locator('[data-testid="passthrough-typed"]')).toContainText(
      'plain-password',
    );
  });

  test('keeps invalid typed value visible while onChange still exposes an empty value below the strong threshold', async ({
    page,
  }) => {
    const section = exampleSection(page, 'required-strong');
    const input = await fillPassword(section, 'Abcdefgh');

    await expect(input).toHaveValue('Abcdefgh');
    await expect(section.locator('[data-testid="threshold-typed"]')).toContainText(
      'Abcdefgh',
    );
    await expect(section.locator('[data-testid="threshold-accepted"]')).toContainText(
      '[empty]',
    );
    await expect(section.locator('[data-testid="threshold-strength"]')).toContainText(
      'good',
    );
    await expect(section.locator('[data-testid="threshold-status"]')).toContainText(
      'rejected',
    );
    await expect(input).toHaveClass(/border-red-500/);
  });

  test('exposes the real value once the required strong threshold is met', async ({
    page,
  }) => {
    const section = exampleSection(page, 'required-strong');
    const input = await fillPassword(section, 'Abcdefg1!');

    await expect(input).toHaveValue('Abcdefg1!');
    await expect(section.locator('[data-testid="threshold-typed"]')).toContainText(
      'Abcdefg1!',
    );
    await blurPassword(section);
    await expect(section.locator('[data-testid="threshold-accepted"]')).toContainText(
      'Abcdefg1!',
    );
    await expect(section.locator('[data-testid="threshold-strength"]')).toContainText(
      'strong',
    );
    await expect(section.locator('[data-testid="threshold-status"]')).toContainText(
      'accepted',
    );
  });

  test('returns to an empty exposed value when strength drops below the threshold again', async ({
    page,
  }) => {
    const section = exampleSection(page, 'required-strong');
    const input = await fillPassword(section, 'Abcdefg1!');

    await blurPassword(section);
    await expect(section.locator('[data-testid="threshold-accepted"]')).toContainText(
      'Abcdefg1!',
    );

    await fillPassword(section, 'Abcdefgh');

    await expect(input).toHaveValue('Abcdefgh');
    await expect(section.locator('[data-testid="threshold-typed"]')).toContainText(
      'Abcdefgh',
    );
    await blurPassword(section);
    await expect(section.locator('[data-testid="threshold-accepted"]')).toContainText(
      '[empty]',
    );
    await expect(section.locator('[data-testid="threshold-strength"]')).toContainText(
      'good',
    );

    await input.focus();
    await input.press('Backspace');
    await expect(input).toHaveValue('Abcdefg');
    await expect(section.locator('[data-testid="threshold-typed"]')).toContainText(
      'Abcdefg',
    );
    await blurPassword(section);
    await expect(section.locator('[data-testid="threshold-accepted"]')).toContainText(
      '[empty]',
    );
  });

  test('requiredStrength honors a custom strength calculator', async ({ page }) => {
    const section = exampleSection(page, 'custom-strength');
    const input = await fillPassword(section, 'abcdefz');

    await expect(input).toHaveValue('abcdefz');
    await expect(section.locator('[data-testid="custom-typed"]')).toContainText('abcdefz');
    await expect(section.locator('[data-testid="custom-strength"]')).toContainText('strong');
    await blurPassword(section);
    await expect(section.locator('[data-testid="custom-accepted"]')).toContainText(
      'abcdefz',
    );
  });

  test('below-threshold failure styling overrides an explicit color prop', async ({ page }) => {
    const section = exampleSection(page, 'color-override');
    const input = await fillPassword(section, 'Abcdefgh');

    await expect(input).toHaveClass(/border-red-500/);
    await expect(input).not.toHaveClass(/border-blue-500/);
    await expect(section.locator('[data-testid="color-override-typed"]')).toContainText(
      'Abcdefgh',
    );
    await blurPassword(section);
    await expect(section.locator('[data-testid="color-override-accepted"]')).toContainText(
      '[empty]',
    );

    await fillPassword(section, 'Abcdefg1!');

    await expect(section.locator('[data-testid="color-override-typed"]')).toContainText(
      'Abcdefg1!',
    );
    await blurPassword(section);
    await expect(input).toHaveClass(/border-blue-500/);
    await expect(section.locator('[data-testid="color-override-strength"]')).toContainText(
      'strong',
    );
  });

  test('supports sanitized values through onChange handlers', async ({ page }) => {
    const section = exampleSection(page, 'change-handler-camel');
    const input = await fillPassword(section, 'Abcdefgh');

    await blurPassword(section);
    await expect(section.locator('[data-testid="camel-change-value"]')).toContainText(
      '[empty]',
    );

    await fillPassword(section, 'Abcdefg1!');
    await blurPassword(section);
    await expect(section.locator('[data-testid="camel-change-value"]')).toContainText(
      'Abcdefg1!',
    );
  });

  test('can couple password validation into useForm on the docs page', async ({
    page,
  }) => {
    const section = exampleSection(page, 'form-coupling');
    const input = await fillPassword(section, 'Abcdefgh');

    await section.getByRole('button', { name: 'Submit' }).click();
    await expect(
      section.getByText('Password strength is currently good. It must be at least strong.'),
    ).toBeVisible();
    await expect(section.locator('[role="progressbar"]')).not.toBeVisible();
    await expect(
      section.getByText('Password requirements:', { exact: true }),
    ).toBeVisible();
    await expect(section.locator('[data-testid="form-coupling-submitted"]')).toContainText(
      '[empty]',
    );

    await input.fill('Abcdefg1!');
    await section.getByRole('button', { name: 'Submit' }).click();
    await expect(
      section.getByText('Password strength is currently good. It must be at least strong.'),
    ).not.toBeVisible();
    await expect(section.locator('[data-testid="form-coupling-submitted"]')).toContainText(
      'Abcdefg1!',
    );
  });
});
