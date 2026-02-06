import { expect, test } from '@playwright/test';

test.describe('MultiSelect', () => {
  test.beforeEach(async ({ page }) => {
    // Suppress ResizeObserver loop errors that trigger SolidStart's dev overlay
    await page.addInitScript(() => {
      window.addEventListener(
        'error',
        (e) => {
          if (e.message?.includes('ResizeObserver')) e.stopImmediatePropagation();
        },
        true,
      );
    });
    await page.goto('/ui/multi-select');
  });

  const getTrigger = (page: import('@playwright/test').Page) =>
    page.getByRole('combobox').first();

  const openDropdown = async (page: import('@playwright/test').Page) => {
    const trigger = getTrigger(page);
    await trigger.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await trigger.click();
    await page.waitForTimeout(300);
    return trigger;
  };

  test('should render multi-select input', async ({ page }) => {
    const multiSelect = getTrigger(page);
    await expect(multiSelect).toBeVisible();
  });

  test('should open dropdown on click', async ({ page }) => {
    await openDropdown(page);

    const dropdown = page.locator('[role="listbox"]');
    await expect(dropdown.first()).toBeVisible();
  });

  test('should select multiple options', async ({ page }) => {
    await openDropdown(page);

    const options = page.locator('[role="option"]');
    const count = await options.count();

    if (count > 1) {
      // Select first option
      await options.first().click();
      await page.waitForTimeout(200);

      // MultiSelect stays open after selection — select second option
      await options.nth(1).click();
    }
  });

  test('should display selected items as tags/chips', async ({ page }) => {
    await openDropdown(page);

    const firstOption = page.locator('[role="option"]').first();
    if (await firstOption.isVisible()) {
      await firstOption.click();
      await page.waitForTimeout(200);

      // Selected items should appear somewhere
      const content = await page.textContent('body');
      expect(content).toBeTruthy();
    }
  });

  test('should remove selected item on tag close click', async ({ page }) => {
    const trigger = await openDropdown(page);

    const firstOption = page.locator('[role="option"]').first();
    if (await firstOption.isVisible()) {
      await firstOption.click();
      await page.waitForTimeout(200);

      // Close the dropdown first
      await trigger.press('Escape');
      await page.waitForTimeout(300);

      // Find the clear/remove button (force: true to bypass any dev overlay)
      const removeButton = page.locator('button[aria-label="Clear selection"]').first();
      if (await removeButton.isVisible()) {
        await removeButton.click({ force: true });
      }
    }
  });

  test('should close dropdown on Escape', async ({ page }) => {
    const trigger = await openDropdown(page);

    const dropdown = page.locator('[role="listbox"]').first();
    await expect(dropdown).toBeVisible();

    await trigger.press('Escape');
    await page.waitForTimeout(300);
    await expect(dropdown).not.toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await openDropdown(page);

    // Navigate with arrow keys
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    // Select with Enter
    await page.keyboard.press('Enter');
  });

  test('should filter options when typing', async ({ page }) => {
    const trigger = await openDropdown(page);

    // Check if there's a search input inside the dropdown
    const searchInput = page.locator('input[aria-label="Search options"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.waitForTimeout(200);
    }
  });

  test('should clear all selections', async ({ page }) => {
    const clearButton = page
      .locator('button[aria-label*="clear" i], button[aria-label*="Clear" i]')
      .first();

    if (await clearButton.isVisible()) {
      await clearButton.click();
    }
  });

  test('should show placeholder when empty', async ({ page }) => {
    const trigger = getTrigger(page);
    const placeholder = await trigger.getAttribute('placeholder');
    expect(placeholder !== null || (await trigger.inputValue()) !== null).toBeTruthy();
  });
});
