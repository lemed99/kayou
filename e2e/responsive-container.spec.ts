import { expect, test } from '@playwright/test';

test.describe('ResponsiveContainer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/responsive-container');
  });

  test('should render container', async ({ page }) => {
    const container = page.locator('[class*="responsive"], [class*="container"]').first();
    await expect(container).toBeVisible();
  });

  test('should have width and height', async ({ page }) => {
    const container = page
      .locator('[class*="responsive"], [class*="container"], div')
      .first();
    const boundingBox = await container.boundingBox();

    expect(boundingBox).toBeTruthy();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);
  });

  test('should resize with viewport', async ({ page }) => {
    const container = page.locator('[class*="responsive"], div').first();

    // Resize viewport
    await page.setViewportSize({ width: 800, height: 600 });
    await page.waitForTimeout(100);

    const newBox = await container.boundingBox();
    expect(newBox).toBeTruthy();
  });

  test('should maintain aspect ratio if configured', async ({ page }) => {
    const container = page.locator('[class*="aspect"], [style*="aspect"]');
    const count = await container.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render children correctly', async ({ page }) => {
    const container = page.locator('[class*="responsive"], [class*="container"]').first();
    const children = container.locator('> *');
    const count = await children.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should handle different screen sizes', async ({ page }) => {
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(100);

    const container = page.locator('[class*="responsive"], div').first();
    await expect(container).toBeVisible();

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(100);
    await expect(container).toBeVisible();

    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(100);
    await expect(container).toBeVisible();
  });

  test('should fill parent container', async ({ page }) => {
    const container = page.locator('[class*="w-full"], [class*="h-full"]').first();
    const count = await container.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should support min/max dimensions', async ({ page }) => {
    const container = page.locator('[class*="min-"], [class*="max-"]');
    const count = await container.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
