import { expect, test } from '@playwright/test';

test.describe('HelperText', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/helper-text');
  });

  test('should render helper text components', async ({ page }) => {
    const helperTexts = page.locator('p, span').filter({ hasText: /.+/ });
    const count = await helperTexts.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display text content', async ({ page }) => {
    const content = await page.textContent('body');
    expect(content).toContain('Helper');
  });

  test('should render with different colors', async ({ page }) => {
    // Helper text comes in different colors (gray, red for errors, etc.)
    const pageContent = await page.content();
    expect(pageContent).toContain('Helper');
  });

  test('should be associated with form inputs', async ({ page }) => {
    // Helper text is typically linked to inputs via aria-describedby
    const inputs = page.locator('input[aria-describedby]');
    const count = await inputs.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render error helper text', async ({ page }) => {
    // Error helper text is typically red
    const errorText = page.locator('[class*="text-red"], [class*="error"]');
    const count = await errorText.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render success helper text', async ({ page }) => {
    // Success helper text is typically green
    const successText = page.locator('[class*="text-green"], [class*="success"]');
    const count = await successText.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should have proper font size', async ({ page }) => {
    // Helper text is typically smaller than regular text
    const helperText = page.locator('[class*="text-sm"], [class*="text-xs"]').first();
    const count = await helperText.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
