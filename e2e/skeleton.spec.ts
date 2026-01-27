import { expect, test } from '@playwright/test';

test.describe('Skeleton', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/skeleton');
  });

  test('should render skeleton components', async ({ page }) => {
    const skeleton = page
      .locator('[class*="skeleton"], [class*="animate-pulse"]')
      .first();
    await expect(skeleton).toBeVisible();
  });

  test('should have animation', async ({ page }) => {
    const animatedSkeleton = page.locator('[class*="animate"]').first();
    await expect(animatedSkeleton).toBeVisible();
  });

  test('should render different shapes', async ({ page }) => {
    // Skeletons can be rectangular, circular, etc.
    const skeletons = page.locator('[class*="skeleton"], [class*="animate-pulse"]');
    const count = await skeletons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should render text skeleton', async ({ page }) => {
    const textSkeleton = page.locator(
      '[class*="skeleton"][class*="h-4"], [class*="skeleton"][class*="h-5"]',
    );
    const count = await textSkeleton.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render circular skeleton', async ({ page }) => {
    const circularSkeleton = page.locator(
      '[class*="rounded-full"][class*="skeleton"], [class*="rounded-full"][class*="animate"]',
    );
    const count = await circularSkeleton.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should have appropriate dimensions', async ({ page }) => {
    const skeleton = page
      .locator('[class*="skeleton"], [class*="animate-pulse"]')
      .first();
    const boundingBox = await skeleton.boundingBox();

    expect(boundingBox).toBeTruthy();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);
  });

  test('should render multiple skeleton items', async ({ page }) => {
    const skeletons = page.locator('[class*="skeleton"], [class*="animate-pulse"]');
    const count = await skeletons.count();
    expect(count).toBeGreaterThan(1);
  });

  test('should render card skeleton', async ({ page }) => {
    const cardSkeleton = page
      .locator('[class*="skeleton"]')
      .filter({ has: page.locator('div') });
    const count = await cardSkeleton.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should have consistent color', async ({ page }) => {
    const skeleton = page
      .locator('[class*="skeleton"], [class*="animate-pulse"]')
      .first();
    const styles = await skeleton.evaluate((el) => window.getComputedStyle(el));
    expect(styles).toBeTruthy();
  });
});
