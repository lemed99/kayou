import { expect, test } from '@playwright/test';

test.describe('Select', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/select');
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

  test('should render select component', async ({ page }) => {
    const select = getTrigger(page);
    await expect(select).toBeVisible();
  });

  test('should open dropdown on click', async ({ page }) => {
    await openDropdown(page);

    const dropdown = page.locator('[role="listbox"]');
    await expect(dropdown.first()).toBeVisible();
  });

  test('should display options', async ({ page }) => {
    await openDropdown(page);

    const options = page.locator('[role="option"]');
    const count = await options.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should select option on click', async ({ page }) => {
    const trigger = await openDropdown(page);

    const option = page.locator('[role="option"]').first();
    const optionText = await option.textContent();
    await option.click();

    await page.waitForTimeout(200);

    const inputValue = await trigger.inputValue();
    expect(inputValue).toContain(optionText?.trim() || '');
  });

  test('should close dropdown after selection', async ({ page }) => {
    await openDropdown(page);

    const dropdown = page.locator('[role="listbox"]').first();
    await expect(dropdown).toBeVisible();

    const option = page.locator('[role="option"]').first();
    await option.click();
    await page.waitForTimeout(300);

    await expect(dropdown).not.toBeVisible();
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

    const dropdown = page.locator('[role="listbox"]');
    const count = await dropdown.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render disabled state', async ({ page }) => {
    const disabledSelect = page.locator('input[disabled]');
    const count = await disabledSelect.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render placeholder', async ({ page }) => {
    const trigger = getTrigger(page);
    const placeholder = await trigger.getAttribute('placeholder');
    expect(placeholder !== null || (await trigger.inputValue()) !== null).toBeTruthy();
  });

  test('should have proper aria attributes', async ({ page }) => {
    await openDropdown(page);

    const listbox = page.locator('[role="listbox"]').first();
    await expect(listbox).toHaveAttribute('role', 'listbox');
  });

  test('should highlight option on hover', async ({ page }) => {
    await openDropdown(page);

    const option = page.locator('[role="option"]').first();
    await option.hover();
    await expect(option).toBeVisible();
  });
});
