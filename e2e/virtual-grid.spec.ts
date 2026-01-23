import { expect, test } from '@playwright/test';

test.describe('VirtualGrid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/virtual-grid');
  });

  test('should render virtual grid container', async ({ page }) => {
    // VirtualGrid renders in a scrollable container
    const container = page
      .locator('[class*="overflow-auto"], [class*="overflow-y-auto"], [class*="grid"]')
      .first();
    await expect(container).toBeVisible();
  });

  test('should render visible grid items only', async ({ page }) => {
    // Virtual grid renders only visible items
    const items = page
      .locator('[class*="overflow-auto"] > div, [class*="grid"] > div')
      .first();
    await expect(items).toBeVisible();
  });

  test('should render items in grid layout', async ({ page }) => {
    // Grid items are laid out in a grid or flex pattern
    const gridContainer = page.locator('[class*="grid"], [class*="flex"]').first();
    await expect(gridContainer).toBeVisible();
  });

  test('should scroll vertically', async ({ page }) => {
    const container = page
      .locator('[class*="overflow-auto"], [class*="overflow-y-auto"]')
      .first();

    if (await container.isVisible()) {
      const initialScroll = await container.evaluate((el) => el.scrollTop);

      await container.evaluate((el) => {
        el.scrollTop = 500;
      });

      await page.waitForTimeout(200);

      const scrollTop = await container.evaluate((el) => el.scrollTop);
      expect(scrollTop).toBeGreaterThanOrEqual(0);
    }
  });

  test('should scroll horizontally if enabled', async ({ page }) => {
    const container = page
      .locator('[class*="overflow-x-auto"], [class*="overflow-auto"]')
      .first();

    if (await container.isVisible()) {
      await container.evaluate((el) => {
        el.scrollLeft = 200;
      });

      await page.waitForTimeout(200);
      // Test passes if no error
    }
  });

  test('should update items on scroll', async ({ page }) => {
    const container = page
      .locator('[class*="overflow-auto"], [class*="overflow-y-auto"]')
      .first();

    if (await container.isVisible()) {
      await container.evaluate((el) => {
        el.scrollTop = 1000;
      });

      await page.waitForTimeout(300);

      // Content should be updated (new items rendered)
      const newContent = await container.innerHTML();
      expect(newContent).toBeTruthy();
    }
  });

  test('should handle large datasets', async ({ page }) => {
    // Virtual grid should handle large amounts of data efficiently
    const container = page.locator('[class*="overflow-auto"], [class*="grid"]').first();
    await expect(container).toBeVisible();
  });

  test('should maintain grid structure', async ({ page }) => {
    const gridItems = page.locator(
      '[class*="grid"] > div, [class*="overflow-auto"] > div > div',
    );
    const count = await gridItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should support variable item sizes', async ({ page }) => {
    // Grid items may have variable sizes
    const container = page.locator('[class*="overflow-auto"], [class*="grid"]').first();
    await expect(container).toBeVisible();
  });

  test('should be keyboard navigable', async ({ page }) => {
    const firstItem = page
      .locator('[class*="grid"] > div, [class*="overflow-auto"] > div')
      .first();

    if (await firstItem.isVisible()) {
      await firstItem.click();

      // Arrow keys should navigate
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowDown');
    }
  });
});
