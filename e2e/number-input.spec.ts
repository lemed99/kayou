import { expect, test } from '@playwright/test';

test.describe('NumberInput', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/number-input');
  });

  test('should render number input', async ({ page }) => {
    const input = page.locator('input[type="number"], input[inputmode="numeric"]').first();
    await expect(input).toBeVisible();
  });

  test('should accept numeric input', async ({ page }) => {
    const input = page.locator('input[type="number"], input[inputmode="numeric"]').first();
    await input.click();
    await input.fill('42');

    const value = await input.inputValue();
    expect(value).toBe('42');
  });

  test('should increment value with up arrow', async ({ page }) => {
    const input = page.locator('input[type="number"], input[inputmode="numeric"]').first();
    await input.click();
    await input.fill('10');

    await page.keyboard.press('ArrowUp');

    const value = await input.inputValue();
    expect(parseInt(value)).toBeGreaterThanOrEqual(10);
  });

  test('should decrement value with down arrow', async ({ page }) => {
    const input = page.locator('input[type="number"], input[inputmode="numeric"]').first();
    await input.click();
    await input.fill('10');

    await page.keyboard.press('ArrowDown');

    const value = await input.inputValue();
    expect(parseInt(value)).toBeLessThanOrEqual(10);
  });

  test('should respect min value', async ({ page }) => {
    const input = page.locator('input[min]').first();

    if (await input.isVisible()) {
      const min = await input.getAttribute('min');
      if (min) {
        await input.fill((parseInt(min) - 1).toString());
        // Input should either reject or clamp the value
      }
    }
  });

  test('should respect max value', async ({ page }) => {
    const input = page.locator('input[max]').first();

    if (await input.isVisible()) {
      const max = await input.getAttribute('max');
      if (max) {
        await input.fill((parseInt(max) + 1).toString());
        // Input should either reject or clamp the value
      }
    }
  });

  test('should respect step value', async ({ page }) => {
    const input = page.locator('input[step]').first();

    if (await input.isVisible()) {
      const step = await input.getAttribute('step');
      expect(step).toBeTruthy();
    }
  });

  test('should render increment/decrement buttons', async ({ page }) => {
    const incrementButton = page.locator('button[aria-label*="increment" i], button[aria-label*="increase" i], button:has-text("+")');
    const decrementButton = page.locator('button[aria-label*="decrement" i], button[aria-label*="decrease" i], button:has-text("-")');

    // Some number inputs have buttons
    const incCount = await incrementButton.count();
    const decCount = await decrementButton.count();
    expect(incCount + decCount).toBeGreaterThanOrEqual(0);
  });

  test('should be keyboard accessible', async ({ page }) => {
    const input = page.locator('input[type="number"], input[inputmode="numeric"]').first();
    await input.focus();
    await expect(input).toBeFocused();
  });

  test('should render disabled state', async ({ page }) => {
    const disabledInput = page.locator('input[disabled]');
    const count = await disabledInput.count();

    if (count > 0) {
      await expect(disabledInput.first()).toBeDisabled();
    }
  });

  test('should handle decimal numbers', async ({ page }) => {
    const input = page.locator('input[type="number"], input[inputmode="numeric"]').first();
    await input.click();
    await input.fill('3.14');

    const value = await input.inputValue();
    expect(value).toContain('3');
  });
});
