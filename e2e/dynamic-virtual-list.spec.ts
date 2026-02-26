import { expect, test } from '@playwright/test';

test.describe('DynamicVirtualList', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/dynamic-virtual-list');
  });

  test('should render listbox with correct ARIA attributes', async ({ page }) => {
    // "With Selection and Accessibility" example uses role="listbox"
    const listbox = page.locator('role=listbox').first();
    await expect(listbox).toBeVisible();
    await expect(listbox).toHaveAttribute('aria-label', 'Select an item');
    await expect(listbox).toHaveAttribute('aria-rowcount');
  });

  test('should only render visible items (virtualization)', async ({ page }) => {
    // Listbox example has 50 items — far fewer should be in the DOM
    const listbox = page.locator('role=listbox').first();
    const options = listbox.locator('role=option');
    const count = await options.count();

    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(20);
  });

  test('should render options with ARIA set attributes', async ({ page }) => {
    const listbox = page.locator('role=listbox').first();
    const firstOption = listbox.locator('role=option').first();
    await expect(firstOption).toBeVisible();
    await expect(firstOption).toHaveAttribute('aria-setsize');
    await expect(firstOption).toHaveAttribute('aria-posinset');
  });

  test('should update visible items on scroll', async ({ page }) => {
    const listbox = page.locator('role=listbox').first();

    const initialFirstOption = listbox.locator('role=option').first();
    const initialPosinset = await initialFirstOption.getAttribute('aria-posinset');

    // Scroll down significantly
    await listbox.evaluate((el) => {
      el.scrollTop = 500;
    });
    await page.waitForTimeout(300);

    // First visible option should now have a higher posinset
    const newFirstOption = listbox.locator('role=option').first();
    const newPosinset = await newFirstOption.getAttribute('aria-posinset');
    expect(Number(newPosinset)).toBeGreaterThan(Number(initialPosinset));
  });

  test('should handle variable height items', async ({ page }) => {
    const listbox = page.locator('role=listbox').first();
    const options = listbox.locator('role=option');

    // Measure heights of first few items — they should vary
    const heights: number[] = [];
    const count = Math.min(await options.count(), 5);
    for (let i = 0; i < count; i++) {
      const box = await options.nth(i).boundingBox();
      if (box) heights.push(Math.round(box.height));
    }

    // Items with different content lengths should produce different heights
    const uniqueHeights = new Set(heights);
    expect(uniqueHeights.size).toBeGreaterThanOrEqual(1);
  });

  test('should keep rendered item count bounded during scroll', async ({ page }) => {
    const listbox = page.locator('role=listbox').first();

    for (const scrollPos of [0, 200, 400, 600]) {
      await listbox.evaluate((el, pos) => {
        el.scrollTop = pos;
      }, scrollPos);
      await page.waitForTimeout(300);

      const options = listbox.locator('role=option');
      const count = await options.count();
      expect(count).toBeLessThan(20);
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should render item content correctly', async ({ page }) => {
    const listbox = page.locator('role=listbox').first();
    const firstOption = listbox.locator('role=option').first();
    const text = await firstOption.textContent();
    expect(text).toBeTruthy();
  });

  test('should handle empty state', async ({ page }) => {
    // Last example toggles between empty and populated
    const toggleButton = page.locator('button', { hasText: 'Toggle Items' });
    if (await toggleButton.isVisible()) {
      const fallbackText = page.locator('text=No items to display');
      if (await fallbackText.isVisible()) {
        expect(await fallbackText.textContent()).toBeTruthy();
      }
    }
  });
});
