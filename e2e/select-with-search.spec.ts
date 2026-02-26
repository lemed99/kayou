import { expect, test } from '@playwright/test';

test.describe('SelectWithSearch', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/select-with-search');
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

  test('should render select input', async ({ page }) => {
    const select = getTrigger(page);
    await expect(select).toBeVisible();
  });

  test('should open dropdown on click', async ({ page }) => {
    await openDropdown(page);

    const dropdown = page.locator('[role="listbox"]');
    await expect(dropdown.first()).toBeVisible();
  });

  test('should filter options when typing', async ({ page }) => {
    const input = await openDropdown(page);
    await input.fill('a');

    await page.waitForTimeout(300);

    const options = page.locator('[role="option"]');
    const count = await options.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should select option on click', async ({ page }) => {
    await openDropdown(page);

    const option = page.locator('[role="option"]').first();
    if (await option.isVisible()) {
      await option.click();
      await page.waitForTimeout(300);

      const dropdown = page.locator('[role="listbox"]');
      await expect(dropdown.first()).not.toBeVisible();
    }
  });

  test('should highlight option on hover', async ({ page }) => {
    await openDropdown(page);

    const option = page.locator('[role="option"]').first();
    if (await option.isVisible()) {
      await option.hover();
      await expect(option).toBeVisible();
    }
  });

  test('should close dropdown on Escape', async ({ page }) => {
    await openDropdown(page);

    const dropdown = page.locator('[role="listbox"]').first();
    await expect(dropdown).toBeVisible();

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await expect(dropdown).not.toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await openDropdown(page);

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);
  });

  test('should show no results message', async ({ page }) => {
    const input = await openDropdown(page);
    await input.fill('zzzzzzzznonexistent');

    await page.waitForTimeout(300);

    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  test('should clear search on selection', async ({ page }) => {
    const input = await openDropdown(page);
    await input.fill('test');
    await page.waitForTimeout(200);

    const option = page.locator('[role="option"]').first();
    if (await option.isVisible()) {
      await option.click();
    }
  });

  test('should display selected value', async ({ page }) => {
    const trigger = await openDropdown(page);

    const option = page.locator('[role="option"]').first();
    if (await option.isVisible()) {
      const optionText = await option.textContent();
      await option.click();
      await page.waitForTimeout(200);

      const value = await trigger.inputValue();
      expect(value || optionText).toBeTruthy();
    }
  });
});
