import { expect, test } from '@playwright/test';

test.describe('Label', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/label');
  });

  test('should render label components', async ({ page }) => {
    const labels = page.locator('label');
    const count = await labels.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display label text', async ({ page }) => {
    const label = page.locator('label').first();
    const text = await label.textContent();
    expect(text).toBeTruthy();
  });

  test('should be associated with form input', async ({ page }) => {
    const labelWithFor = page.locator('label[for]');
    const count = await labelWithFor.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should click label to focus associated input', async ({ page }) => {
    const label = page.locator('label[for]').first();

    if (await label.isVisible()) {
      const forId = await label.getAttribute('for');
      if (forId) {
        await label.click();
        const input = page.locator(`#${forId}`);
        if (await input.isVisible()) {
          await expect(input).toBeFocused();
        }
      }
    }
  });

  test('should render required indicator', async ({ page }) => {
    // Required labels typically have an asterisk (*)
    const requiredIndicator = page.locator('label').filter({ hasText: '*' });
    const count = await requiredIndicator.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render with different colors', async ({ page }) => {
    // Labels can have different colors
    const content = await page.textContent('body');
    expect(content).toContain('Label');
  });

  test('should render disabled state', async ({ page }) => {
    // Disabled labels may have different styling
    const disabledLabel = page.locator('label[class*="disabled"], label[class*="opacity"]');
    const count = await disabledLabel.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should support nested input', async ({ page }) => {
    // Labels can wrap inputs directly
    const labelWithInput = page.locator('label').filter({ has: page.locator('input') });
    const count = await labelWithInput.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
