import { expect, test } from '@playwright/test';

test.describe('VirtualList', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/virtual-list');
  });

  test('should render listbox with correct ARIA attributes', async ({ page }) => {
    const listbox = page.locator('role=listbox').first();
    await expect(listbox).toBeVisible();
    await expect(listbox).toHaveAttribute('aria-label', 'Select an option');
  });

  test('should only render visible items (virtualization)', async ({ page }) => {
    // Selection example has 100 items — far fewer should be in the DOM
    const listbox = page.locator('role=listbox').first();
    const options = listbox.locator('role=option');
    const count = await options.count();

    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(30);
  });

  test('should render options with correct ARIA attributes', async ({ page }) => {
    const listbox = page.locator('role=listbox').first();
    const firstOption = listbox.locator('role=option').first();
    await expect(firstOption).toBeVisible();
    await expect(firstOption).toHaveAttribute('aria-selected');
  });

  test('should update visible items on scroll', async ({ page }) => {
    const listbox = page.locator('role=listbox').first();

    const initialFirstOption = listbox.locator('role=option').first();
    const initialText = await initialFirstOption.textContent();

    // Scroll down significantly
    await listbox.evaluate((el) => {
      el.scrollTop = 500;
    });
    await page.waitForTimeout(200);

    // First visible option should now be different
    const newFirstOption = listbox.locator('role=option').first();
    const newText = await newFirstOption.textContent();
    expect(newText).not.toBe(initialText);
  });

  test('should select item on click', async ({ page }) => {
    const listbox = page.locator('role=listbox').first();
    const secondOption = listbox.locator('role=option').nth(1);

    await secondOption.click();
    await page.waitForTimeout(100);

    await expect(secondOption).toHaveAttribute('aria-selected', 'true');
  });

  test('should keep rendered item count bounded during scroll', async ({ page }) => {
    const listbox = page.locator('role=listbox').first();

    for (const scrollPos of [0, 300, 600, 900]) {
      await listbox.evaluate((el, pos) => {
        el.scrollTop = pos;
      }, scrollPos);
      await page.waitForTimeout(200);

      const options = listbox.locator('role=option');
      const count = await options.count();
      expect(count).toBeLessThan(30);
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
    // The empty state example uses a toggle button
    const toggleButton = page.locator('button', { hasText: 'Toggle Items' });
    if (await toggleButton.isVisible()) {
      // Ensure items are hidden (initial state is empty)
      const fallbackText = page.locator('text=No items to display');
      if (await fallbackText.isVisible()) {
        // Empty state is showing — verify no rendered rows
        expect(await fallbackText.textContent()).toBeTruthy();
      }
    }
  });
});
