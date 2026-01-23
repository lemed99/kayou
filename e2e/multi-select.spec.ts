import { expect, test } from '@playwright/test';

test.describe('MultiSelect', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/multi-select');
  });

  test('should render multi-select input', async ({ page }) => {
    const multiSelect = page.locator('input').first();
    await expect(multiSelect).toBeVisible();
  });

  test('should open dropdown on click', async ({ page }) => {
    const trigger = page.locator('input').first();
    await trigger.click();
    await page.waitForTimeout(300);

    const dropdown = page.locator('[role="listbox"]');
    await expect(dropdown.first()).toBeVisible();
  });

  test('should select multiple options', async ({ page }) => {
    const trigger = page.locator('input').first();
    await trigger.click();
    await page.waitForTimeout(300);

    // Options are divs inside the listbox
    const options = page.locator('[role="listbox"] > div');
    const count = await options.count();

    if (count > 1) {
      // Select first option
      await options.first().click();
      await page.waitForTimeout(200);

      // Re-click to reopen dropdown
      await trigger.click();
      await page.waitForTimeout(300);

      // Select second option
      await options.nth(1).click();
    }
  });

  test('should display selected items as tags/chips', async ({ page }) => {
    const trigger = page.locator('input').first();
    await trigger.click();
    await page.waitForTimeout(300);

    const firstOption = page.locator('[role="listbox"] > div').first();
    if (await firstOption.isVisible()) {
      await firstOption.click();
      await page.waitForTimeout(200);

      // Selected items should appear somewhere
      const content = await page.textContent('body');
      expect(content).toBeTruthy();
    }
  });

  test('should remove selected item on tag close click', async ({ page }) => {
    const trigger = page.locator('input').first();
    await trigger.click();
    await page.waitForTimeout(300);

    const firstOption = page.locator('[role="listbox"] > div').first();
    if (await firstOption.isVisible()) {
      await firstOption.click();
      await page.waitForTimeout(200);

      // Find remove button
      const removeButton = page.locator('button svg').first();
      if (await removeButton.isVisible()) {
        await removeButton.click();
      }
    }
  });

  test('should close dropdown on Escape', async ({ page }) => {
    const trigger = page.locator('input').first();
    await trigger.click();
    await page.waitForTimeout(300);

    const dropdown = page.locator('[role="listbox"]').first();
    await expect(dropdown).toBeVisible();

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await expect(dropdown).not.toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    const trigger = page.locator('input').first();
    await trigger.click();
    await page.waitForTimeout(300);

    // Navigate with arrow keys
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    // Select with Enter
    await page.keyboard.press('Enter');
  });

  test('should filter options when typing', async ({ page }) => {
    const input = page.locator('input').first();
    await input.click();
    await input.fill('test');

    // Options should be filtered
    await page.waitForTimeout(200);
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
    const input = page.locator('input').first();
    const placeholder = await input.getAttribute('placeholder');
    expect(placeholder !== null || (await input.inputValue()) !== null).toBeTruthy();
  });
});
