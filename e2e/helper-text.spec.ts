import { expect, test } from '@playwright/test';

test.describe('HelperText', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/helper-text');
  });

  // ==================== Basic Rendering ====================

  test('should render helper text with content', async ({ page }) => {
    const helperText = page.getByText('This is a neutral hint', { exact: true });
    await expect(helperText).toBeVisible();
  });

  test('should render as a span element', async ({ page }) => {
    const helperText = page.getByText('This is a neutral hint', { exact: true });
    const tagName = await helperText.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe('span');
  });

  test('should have text-xs font size class', async ({ page }) => {
    const helperText = page.getByText('This is a neutral hint', { exact: true });
    const classes = await helperText.getAttribute('class');
    expect(classes).toContain('text-xs');
  });

  // ==================== Color Variants ====================

  test('should render gray variant with gray text color', async ({ page }) => {
    const gray = page.getByText('This is a neutral hint', { exact: true });
    const classes = await gray.getAttribute('class');
    expect(classes).toContain('text-neutral-500');
  });

  test('should render info variant with blue text color', async ({ page }) => {
    const info = page.getByText('This is informational', { exact: true });
    const classes = await info.getAttribute('class');
    expect(classes).toContain('text-blue-600');
  });

  test('should render success variant with green text color', async ({ page }) => {
    const success = page.getByText('This is a success message', { exact: true });
    const classes = await success.getAttribute('class');
    expect(classes).toContain('text-green-600');
  });

  test('should render warning variant with yellow text color', async ({ page }) => {
    const warning = page.getByText('This is a warning', { exact: true });
    const classes = await warning.getAttribute('class');
    expect(classes).toContain('text-yellow-600');
  });

  test('should render failure variant with red text color', async ({ page }) => {
    const failure = page.getByText('This is an error message', { exact: true });
    const classes = await failure.getAttribute('class');
    expect(classes).toContain('text-red-600');
  });

  // ==================== Form Field Example ====================

  test('should render below a form input', async ({ page }) => {
    const input = page.locator('input[type="email"]');
    await expect(input).toBeVisible();

    const helperText = page.getByText("We'll never share your email", { exact: true });
    await expect(helperText).toBeVisible();

    // Helper text should be positioned below the input
    const inputBox = await input.boundingBox();
    const helperBox = await helperText.boundingBox();
    expect(inputBox).toBeTruthy();
    expect(helperBox).toBeTruthy();
    expect(helperBox!.y).toBeGreaterThan(inputBox!.y);
  });

  // ==================== Validation Messages ====================

  test('should render failure validation message', async ({ page }) => {
    const failure = page.getByText('Password must be at least 8 characters', {
      exact: true,
    });
    await expect(failure).toBeVisible();
    const classes = await failure.getAttribute('class');
    expect(classes).toContain('text-red-600');
  });

  test('should render success validation message', async ({ page }) => {
    const success = page.getByText('Email is valid', { exact: true });
    await expect(success).toBeVisible();
    const classes = await success.getAttribute('class');
    expect(classes).toContain('text-green-600');
  });

  // ==================== Multiple Instances ====================

  test('should render all five color variants on the page', async ({ page }) => {
    const texts = [
      'This is a neutral hint',
      'This is informational',
      'This is a success message',
      'This is a warning',
      'This is an error message',
    ];

    for (const text of texts) {
      const el = page.getByText(text, { exact: true });
      await expect(el).toBeVisible();
    }
  });
});
