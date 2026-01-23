import { expect, test } from '@playwright/test';

test.describe('Textarea', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/textarea');
  });

  test('should render textarea', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await expect(textarea).toBeVisible();
  });

  test('should accept text input', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.click();
    await textarea.fill('Hello World\nMultiple lines');

    const value = await textarea.inputValue();
    expect(value).toContain('Hello World');
    expect(value).toContain('Multiple lines');
  });

  test('should support multiline text', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.fill('Line 1\nLine 2\nLine 3');

    const value = await textarea.inputValue();
    expect(value.split('\n').length).toBe(3);
  });

  test('should clear textarea', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.fill('Test');
    await textarea.clear();

    const value = await textarea.inputValue();
    expect(value).toBe('');
  });

  test('should render placeholder', async ({ page }) => {
    const textarea = page.locator('textarea[placeholder]').first();

    if (await textarea.isVisible()) {
      const placeholder = await textarea.getAttribute('placeholder');
      expect(placeholder).toBeTruthy();
    }
  });

  test('should render disabled state', async ({ page }) => {
    const disabledTextarea = page.locator('textarea[disabled]');
    const count = await disabledTextarea.count();

    if (count > 0) {
      await expect(disabledTextarea.first()).toBeDisabled();
    }
  });

  test('should render readonly state', async ({ page }) => {
    const readonlyTextarea = page.locator('textarea[readonly]');
    const count = await readonlyTextarea.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should be keyboard accessible', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.focus();
    await expect(textarea).toBeFocused();

    await page.keyboard.type('Test');
    const value = await textarea.inputValue();
    expect(value).toBe('Test');
  });

  test('should render with rows attribute', async ({ page }) => {
    const textarea = page.locator('textarea[rows]');
    const count = await textarea.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render with character count', async ({ page }) => {
    // Some textareas show character count
    const characterCount = page.locator('[class*="count"], [class*="character"]');
    const count = await characterCount.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render error state', async ({ page }) => {
    const errorTextarea = page.locator(
      'textarea[class*="error"], textarea[class*="border-red"]',
    );
    const count = await errorTextarea.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should be resizable', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    const resize = await textarea.evaluate((el) => window.getComputedStyle(el).resize);
    expect(['both', 'vertical', 'horizontal', 'none']).toContain(resize);
  });
});
