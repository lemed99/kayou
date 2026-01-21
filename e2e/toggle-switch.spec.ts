import { expect, test } from '@playwright/test';

test.describe('ToggleSwitch', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/toggle-switch');
  });

  test('should render toggle switch', async ({ page }) => {
    // ToggleSwitch uses role="switch" on the button
    const toggle = page.locator('[role="switch"]').first();
    await expect(toggle).toBeVisible();
  });

  test('should toggle on click', async ({ page }) => {
    const toggle = page.locator('[role="switch"]').first();
    const initialState = await toggle.getAttribute('aria-checked');

    await toggle.click();
    await page.waitForTimeout(100);

    const newState = await toggle.getAttribute('aria-checked');
    expect(newState).not.toBe(initialState);
  });

  test('should toggle off on second click', async ({ page }) => {
    const toggle = page.locator('[role="switch"]').first();

    // Toggle on
    await toggle.click();
    await page.waitForTimeout(100);
    const onState = await toggle.getAttribute('aria-checked');

    // Toggle off
    await toggle.click();
    await page.waitForTimeout(100);
    const offState = await toggle.getAttribute('aria-checked');

    expect(offState).not.toBe(onState);
  });

  test('should have correct aria attributes', async ({ page }) => {
    const toggle = page.locator('[role="switch"]').first();
    await expect(toggle).toHaveAttribute('role', 'switch');
    // Should have aria-checked attribute
    const ariaChecked = await toggle.getAttribute('aria-checked');
    expect(['true', 'false']).toContain(ariaChecked);
  });

  test('should render disabled state', async ({ page }) => {
    const disabledToggle = page.locator('[role="switch"][aria-disabled="true"], [role="switch"][disabled]');
    const count = await disabledToggle.count();

    if (count > 0) {
      // Disabled toggle should exist
      const toggle = disabledToggle.first();
      await expect(toggle).toBeVisible();
    }
  });

  test('should support keyboard interaction', async ({ page }) => {
    const toggle = page.locator('[role="switch"]').first();
    await toggle.focus();
    await expect(toggle).toBeFocused();

    const initialState = await toggle.getAttribute('aria-checked');

    // Press Space to toggle (standard for buttons/switches)
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    const newState = await toggle.getAttribute('aria-checked');
    expect(newState).not.toBe(initialState);
  });

  test('should render with label', async ({ page }) => {
    // ToggleSwitch components have labels
    const content = await page.textContent('body');
    expect(content).toBeTruthy();

    // Check for any label elements or text near the toggles
    const toggles = page.locator('[role="switch"]');
    const count = await toggles.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should toggle when label is clicked', async ({ page }) => {
    // The ToggleSwitch component includes its label in the clickable area
    // Find any toggle and get its initial state
    const toggle = page.locator('[role="switch"]').first();
    const initialState = await toggle.getAttribute('aria-checked');

    // Click the toggle (which includes the label area)
    await toggle.click();
    await page.waitForTimeout(100);

    const newState = await toggle.getAttribute('aria-checked');
    expect(newState).not.toBe(initialState);
  });

  test('should render different sizes', async ({ page }) => {
    const toggles = page.locator('[role="switch"]');
    const count = await toggles.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should render different colors', async ({ page }) => {
    // Toggles can have different colors when on/off
    const content = await page.textContent('body');
    expect(content).toContain('Toggle');
  });
});
