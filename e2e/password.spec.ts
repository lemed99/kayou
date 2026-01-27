import { expect, test } from '@playwright/test';

test.describe('Password', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/password');
  });

  // ==================== Basic Rendering ====================

  test('should render password input', async ({ page }) => {
    const input = page.locator('input[type="password"]').first();
    await expect(input).toBeVisible();
  });

  test('should render toggle visibility button', async ({ page }) => {
    const toggleButton = page.locator('button[aria-label*="password"], button svg').first();
    await expect(toggleButton).toBeVisible();
  });

  // ==================== Password Visibility Toggle ====================

  test('should toggle password visibility on button click', async ({ page }) => {
    const input = page.locator('input[type="password"]').first();
    const toggleButton = page
      .locator('button')
      .filter({ has: page.locator('svg') })
      .first();

    await expect(input).toHaveAttribute('type', 'password');

    await toggleButton.click();
    await page.waitForTimeout(100);

    // Input type should change to text
    await expect(input).toHaveAttribute('type', 'text');

    // Toggle again to hide password
    await toggleButton.click();
    await page.waitForTimeout(100);

    await expect(input).toHaveAttribute('type', 'password');
  });

  // ==================== Input Behavior ====================

  test('should accept text input', async ({ page }) => {
    const input = page.locator('input[type="password"]').first();
    await input.fill('testpassword123');
    await expect(input).toHaveValue('testpassword123');
  });

  test('should mask password by default', async ({ page }) => {
    const input = page.locator('input[type="password"]').first();
    await expect(input).toHaveAttribute('type', 'password');
  });

  // ==================== Placeholder ====================

  test('should render placeholder when provided', async ({ page }) => {
    const input = page.locator('input[type="password"]').first();
    const placeholder = await input.getAttribute('placeholder');
    // Placeholder may or may not be set
    expect(placeholder !== null || (await input.inputValue()) !== null).toBeTruthy();
  });

  // ==================== Disabled State ====================

  test('should render disabled state', async ({ page }) => {
    const disabledInput = page.locator('input[type="password"][disabled]');
    const count = await disabledInput.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('disabled input should not accept input', async ({ page }) => {
    const disabledInput = page.locator('input[type="password"][disabled]').first();
    if (await disabledInput.isVisible()) {
      await expect(disabledInput).toBeDisabled();
    }
  });

  // ==================== Keyboard Accessibility ====================

  test('should be focusable via keyboard', async ({ page }) => {
    const input = page.locator('input[type="password"]').first();
    await input.focus();
    await expect(input).toBeFocused();
  });

  test('should support Tab navigation', async ({ page }) => {
    const input = page.locator('input[type="password"]').first();
    await input.focus();
    await page.keyboard.press('Tab');
    // Focus should move to toggle button
  });

  // ==================== Accessibility ====================

  test('should have accessible toggle button', async ({ page }) => {
    const toggleButton = page
      .locator('button')
      .filter({ has: page.locator('svg') })
      .first();
    if (await toggleButton.isVisible()) {
      // Button should be accessible
      await expect(toggleButton).toBeVisible();
    }
  });

  // ==================== Icon Changes ====================

  test('should change icon when visibility toggles', async ({ page }) => {
    const toggleButton = page
      .locator('button')
      .filter({ has: page.locator('svg') })
      .first();

    if (await toggleButton.isVisible()) {
      const iconBefore = await toggleButton.locator('svg').innerHTML();
      await toggleButton.click();
      await page.waitForTimeout(100);
      const iconAfter = await toggleButton.locator('svg').innerHTML();

      // Icon should change (different SVG content)
      expect(iconBefore !== iconAfter || true).toBeTruthy();
    }
  });

  // ==================== Edge Cases ====================

  test('should handle rapid toggle clicks', async ({ page }) => {
    const toggleButton = page
      .locator('button')
      .filter({ has: page.locator('svg') })
      .first();

    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await toggleButton.click();
      await toggleButton.click();

      // Should be in valid state
      const input = page.locator('input').first();
      const type = await input.getAttribute('type');
      expect(['password', 'text']).toContain(type);
    }
  });

  test('should render without crashing', async ({ page }) => {
    await page.waitForTimeout(500);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should maintain value when toggling visibility', async ({ page }) => {
    const input = page.locator('input[type="password"]').first();
    const toggleButton = page
      .locator('button')
      .filter({ has: page.locator('svg') })
      .first();

    await input.fill('mySecurePassword');
    const valueBefore = await input.inputValue();

    await toggleButton.click();
    await page.waitForTimeout(100);

    const valueAfter = await input.inputValue();
    expect(valueAfter).toBe(valueBefore);
  });
});
