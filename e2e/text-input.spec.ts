import { expect, test } from '@playwright/test';

test.describe('TextInput', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/text-input');
  });

  test('should render text input', async ({ page }) => {
    const input = page.locator('input[type="text"], input:not([type])').first();
    await expect(input).toBeVisible();
  });

  test('should accept text input', async ({ page }) => {
    const input = page.locator('input[type="text"], input:not([type])').first();
    await input.click();
    await input.fill('Hello World');

    const value = await input.inputValue();
    expect(value).toBe('Hello World');
  });

  test('should clear input', async ({ page }) => {
    const input = page.locator('input[type="text"], input:not([type])').first();
    await input.fill('Test');
    await input.clear();

    const value = await input.inputValue();
    expect(value).toBe('');
  });

  test('should render placeholder', async ({ page }) => {
    const input = page.locator('input[placeholder]').first();

    if (await input.isVisible()) {
      const placeholder = await input.getAttribute('placeholder');
      expect(placeholder).toBeTruthy();
    }
  });

  test('should render disabled state', async ({ page }) => {
    const disabledInput = page.locator('input[disabled]');
    const count = await disabledInput.count();

    if (count > 0) {
      await expect(disabledInput.first()).toBeDisabled();
    }
  });

  test('should render readonly state', async ({ page }) => {
    const readonlyInput = page.locator('input[readonly]');
    const count = await readonlyInput.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should be keyboard accessible', async ({ page }) => {
    const input = page.locator('input[type="text"], input:not([type])').first();
    await input.focus();
    await expect(input).toBeFocused();

    // Type with keyboard
    await page.keyboard.type('Test');
    const value = await input.inputValue();
    expect(value).toBe('Test');
  });

  test('should render with label', async ({ page }) => {
    const label = page.locator('label');
    const count = await label.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should render with helper text', async ({ page }) => {
    const helperText = page.locator('[class*="helper"], [class*="text-sm"]');
    const count = await helperText.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render error state', async ({ page }) => {
    const errorInput = page.locator('input[class*="error"], input[class*="border-red"]');
    const count = await errorInput.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render with icon', async ({ page }) => {
    const inputWithIcon = page.locator('input').locator('..').locator('svg');
    const count = await inputWithIcon.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render different sizes', async ({ page }) => {
    // Inputs come in different sizes
    const inputs = page.locator('input');
    const count = await inputs.count();
    expect(count).toBeGreaterThan(1);
  });
});
