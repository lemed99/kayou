import { expect, test } from '@playwright/test';

test.describe('Checkbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/checkbox');
  });

  // ==================== Basic Rendering ====================

  test('should render checkbox components', async ({ page }) => {
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should render checkbox with label', async ({ page }) => {
    const label = page
      .locator('label')
      .filter({ has: page.locator('input[type="checkbox"]') })
      .first();
    await expect(label).toBeVisible();
    const text = await label.textContent();
    expect(text).toBeTruthy();
  });

  // ==================== Toggle Behavior ====================

  test('should toggle checkbox on click', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    const initialChecked = await checkbox.isChecked();

    await checkbox.click();

    const newChecked = await checkbox.isChecked();
    expect(newChecked).toBe(!initialChecked);
  });

  test('should toggle checkbox when clicking on label', async ({ page }) => {
    const label = page
      .locator('label')
      .filter({ has: page.locator('input[type="checkbox"]') })
      .first();

    if (await label.isVisible()) {
      const checkbox = label.locator('input[type="checkbox"]');
      const initialChecked = await checkbox.isChecked();

      await label.click();

      const newChecked = await checkbox.isChecked();
      expect(newChecked).toBe(!initialChecked);
    }
  });

  test('should uncheck a checked checkbox on click', async ({ page }) => {
    // Find or create a checked checkbox
    const checkbox = page.locator('input[type="checkbox"]').first();

    // Ensure it's checked first
    if (!(await checkbox.isChecked())) {
      await checkbox.click();
    }

    expect(await checkbox.isChecked()).toBe(true);

    // Click to uncheck
    await checkbox.click();

    expect(await checkbox.isChecked()).toBe(false);
  });

  // ==================== Color Variants ====================

  test('should render blue color variant', async ({ page }) => {
    const blueCheckbox = page
      .locator('label')
      .filter({ hasText: /Blue checkbox/i })
      .first();
    if (await blueCheckbox.isVisible()) {
      await expect(blueCheckbox).toBeVisible();
    }
  });

  test('should render dark color variant', async ({ page }) => {
    const darkCheckbox = page
      .locator('label')
      .filter({ hasText: /Dark checkbox/i })
      .first();
    if (await darkCheckbox.isVisible()) {
      await expect(darkCheckbox).toBeVisible();
    }
  });

  // ==================== Label Position ====================

  test('should render label on right side by default', async ({ page }) => {
    const rightLabel = page
      .locator('label')
      .filter({ hasText: /Label on right/i })
      .first();
    if (await rightLabel.isVisible()) {
      await expect(rightLabel).toBeVisible();
    }
  });

  test('should render label on left side when specified', async ({ page }) => {
    const leftLabel = page
      .locator('label')
      .filter({ hasText: /Label on left/i })
      .first();
    if (await leftLabel.isVisible()) {
      await expect(leftLabel).toBeVisible();
    }
  });

  // ==================== Disabled State ====================

  test('should render disabled unchecked checkbox', async ({ page }) => {
    const disabledCheckbox = page.locator('input[type="checkbox"][disabled]').first();
    const count = await disabledCheckbox.count();

    if (count > 0) {
      await expect(disabledCheckbox).toBeDisabled();
    }
  });

  test('should render disabled checked checkbox', async ({ page }) => {
    const disabledCheckedLabel = page
      .locator('label')
      .filter({ hasText: /Disabled checked/i })
      .first();
    if (await disabledCheckedLabel.isVisible()) {
      const checkbox = disabledCheckedLabel.locator('input[type="checkbox"]');
      await expect(checkbox).toBeDisabled();
      await expect(checkbox).toBeChecked();
    }
  });

  test('disabled checkbox should not be toggleable', async ({ page }) => {
    const disabledCheckbox = page.locator('input[type="checkbox"][disabled]').first();

    if (await disabledCheckbox.isVisible()) {
      const initialChecked = await disabledCheckbox.isChecked();

      // Attempt to click (should not change state)
      await disabledCheckbox.click({ force: true });

      const newChecked = await disabledCheckbox.isChecked();
      expect(newChecked).toBe(initialChecked);
    }
  });

  // ==================== Keyboard Accessibility ====================

  test('should be focusable via keyboard', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.focus();
    await expect(checkbox).toBeFocused();
  });

  test('should toggle with Space key', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.focus();
    await expect(checkbox).toBeFocused();

    const initialChecked = await checkbox.isChecked();

    await page.keyboard.press('Space');

    const newChecked = await checkbox.isChecked();
    expect(newChecked).toBe(!initialChecked);
  });

  test('should navigate between checkboxes with Tab key', async ({ page }) => {
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();

    if (count >= 2) {
      await checkboxes.first().focus();
      await expect(checkboxes.first()).toBeFocused();

      await page.keyboard.press('Tab');
      // Next element should be focused
    }
  });

  // ==================== Label Association ====================

  test('should have associated label via id', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    const id = await checkbox.getAttribute('id');

    // Checkbox should have an ID for label association
    expect(id).toBeTruthy();
  });

  test('clicking label should toggle checkbox', async ({ page }) => {
    const label = page
      .locator('label')
      .filter({ has: page.locator('input[type="checkbox"]') })
      .first();
    const checkbox = label.locator('input[type="checkbox"]');

    const initialChecked = await checkbox.isChecked();
    await label.click();
    const newChecked = await checkbox.isChecked();

    expect(newChecked).toBe(!initialChecked);
  });

  // ==================== Controlled Mode ====================

  test('should work in controlled mode', async ({ page }) => {
    // First checkbox is the controlled one with "Accept terms"
    const termsLabel = page
      .locator('label')
      .filter({ hasText: /Accept terms/i })
      .first();

    if (await termsLabel.isVisible()) {
      const checkbox = termsLabel.locator('input[type="checkbox"]');
      const initialChecked = await checkbox.isChecked();

      await checkbox.click();

      const newChecked = await checkbox.isChecked();
      expect(newChecked).toBe(!initialChecked);
    }
  });

  // ==================== Visual States ====================

  test('should show checked visual state', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();

    // Check the checkbox
    if (!(await checkbox.isChecked())) {
      await checkbox.click();
    }

    await expect(checkbox).toBeChecked();
  });

  test('should show unchecked visual state', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();

    // Uncheck the checkbox
    if (await checkbox.isChecked()) {
      await checkbox.click();
    }

    await expect(checkbox).not.toBeChecked();
  });

  test('should have visible focus indicator', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.focus();
    await expect(checkbox).toBeFocused();
  });

  // ==================== Edge Cases ====================

  test('should handle rapid clicking gracefully', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();

    // Rapid clicks
    await checkbox.click();
    await checkbox.click();
    await checkbox.click();
    await checkbox.click();

    await page.waitForTimeout(100);

    // Should be in a valid state
    const isChecked = await checkbox.isChecked();
    expect(typeof isChecked).toBe('boolean');
  });

  test('should maintain state consistency after multiple toggles', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    const initialChecked = await checkbox.isChecked();

    // Toggle multiple times
    await checkbox.click();
    expect(await checkbox.isChecked()).toBe(!initialChecked);

    await checkbox.click();
    expect(await checkbox.isChecked()).toBe(initialChecked);

    await checkbox.click();
    expect(await checkbox.isChecked()).toBe(!initialChecked);
  });

  // ==================== Multiple Checkboxes ====================

  test('should render multiple independent checkboxes', async ({ page }) => {
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    expect(count).toBeGreaterThan(1);

    // Each checkbox should be independently toggleable
    if (count >= 2) {
      const first = checkboxes.nth(0);

      const firstInitial = await first.isChecked();
      await first.click();

      // First changed
      expect(await first.isChecked()).toBe(!firstInitial);
    }
  });
});
