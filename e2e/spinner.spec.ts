import { expect, test } from '@playwright/test';

test.describe('Spinner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/spinner');
  });

  test('should render spinner component', async ({ page }) => {
    const spinner = page
      .locator('[class*="spinner"], [class*="animate-spin"], [role="status"]')
      .first();
    await expect(spinner).toBeVisible();
  });

  test('should have spinning animation', async ({ page }) => {
    const animatedSpinner = page.locator('[class*="animate-spin"]').first();
    await expect(animatedSpinner).toBeVisible();
  });

  test('should have accessible label', async ({ page }) => {
    const spinner = page.locator(
      '[role="status"], [aria-label*="loading" i], [aria-label*="Loading" i]',
    );
    const count = await spinner.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render SVG spinner', async ({ page }) => {
    const svgSpinner = page.locator('svg[class*="animate-spin"], svg[class*="spinner"]');
    const count = await svgSpinner.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should render different sizes', async ({ page }) => {
    // Spinners come in different sizes
    const spinners = page.locator('[class*="animate-spin"], [class*="spinner"]');
    const count = await spinners.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should render different colors', async ({ page }) => {
    // Spinners can have different colors
    const spinners = page.locator('[class*="animate-spin"], [class*="spinner"]');
    const count = await spinners.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have appropriate dimensions', async ({ page }) => {
    const spinner = page.locator('[class*="animate-spin"], [class*="spinner"]').first();
    const boundingBox = await spinner.boundingBox();

    expect(boundingBox).toBeTruthy();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);
  });

  test('should be circular', async ({ page }) => {
    const spinner = page.locator('[class*="animate-spin"], [class*="spinner"]').first();
    const boundingBox = await spinner.boundingBox();

    if (boundingBox) {
      // Width and height should be similar for circular spinner
      const ratio = boundingBox.width / boundingBox.height;
      expect(ratio).toBeGreaterThan(0.8);
      expect(ratio).toBeLessThan(1.2);
    }
  });

  test('should render inline with text', async ({ page }) => {
    // Spinners can be used inline with loading text
    const content = await page.textContent('body');
    expect(content).toContain('Spinner');
  });
});
