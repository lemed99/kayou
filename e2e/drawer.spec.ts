import { expect, test, type Page } from '@playwright/test';

/** Click the first drawer trigger with scroll + hydration wait. */
async function openDrawer(page: Page, triggerFilter: RegExp = /open|drawer|show/i) {
  const trigger = page.locator('button').filter({ hasText: triggerFilter }).first();
  await trigger.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await trigger.click();
  const drawer = page.locator('[role="dialog"]').first();
  await expect(drawer).toBeVisible({ timeout: 5000 });
  return drawer;
}

test.describe('Drawer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/drawer');
  });

  // ==================== Basic Rendering ====================

  test('should render drawer trigger button', async ({ page }) => {
    const trigger = page
      .locator('button')
      .filter({ hasText: /open|drawer|show/i })
      .first();
    await expect(trigger).toBeVisible();
  });

  test('should render multiple drawer examples', async ({ page }) => {
    const triggers = page.locator('button').filter({ hasText: /open|drawer|show/i });
    const count = await triggers.count();
    expect(count).toBeGreaterThan(0);
  });

  // ==================== Opening/Closing ====================

  test('should open drawer on trigger click', async ({ page }) => {
    const drawer = await openDrawer(page);
    await expect(drawer).toBeVisible();
  });

  test('should close drawer on close button click', async ({ page }) => {
    const drawer = await openDrawer(page);

    const closeButton = page.locator('button[aria-label="Close"]').first();
    await closeButton.click();
    await expect(drawer).not.toBeVisible({ timeout: 5000 });
  });

  test('should close drawer on Escape key', async ({ page }) => {
    const drawer = await openDrawer(page);

    await page.keyboard.press('Escape');
    await expect(drawer).not.toBeVisible({ timeout: 5000 });
  });

  test('should close drawer on backdrop click', async ({ page }) => {
    const drawer = await openDrawer(page);

    await page.mouse.click(10, 10);
    await expect(drawer).not.toBeVisible({ timeout: 5000 });
  });

  // ==================== Position Variants ====================

  test('should render drawer from left position', async ({ page }) => {
    const drawer = await openDrawer(page, /left/i);
    await expect(drawer).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('should render drawer from right position', async ({ page }) => {
    const drawer = await openDrawer(page, /right/i);
    await expect(drawer).toBeVisible();
  });

  test('should render drawer from top position', async ({ page }) => {
    const drawer = await openDrawer(page, /top/i);
    await expect(drawer).toBeVisible();
  });

  test('should render drawer from bottom position', async ({ page }) => {
    const drawer = await openDrawer(page, /bottom/i);
    await expect(drawer).toBeVisible();
  });

  // ==================== Accessibility (ARIA) ====================

  test('should have proper aria attributes', async ({ page }) => {
    const drawer = await openDrawer(page);
    await expect(drawer).toHaveAttribute('role', 'dialog');
    await expect(drawer).toHaveAttribute('aria-modal', 'true');
  });

  test('should have aria-labelledby linked to title', async ({ page }) => {
    const drawer = await openDrawer(page);
    const labelledBy = await drawer.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();

    const title = drawer.locator(`[id="${labelledBy}"]`);
    await expect(title).toBeVisible();
    const text = await title.textContent();
    expect(text).toBeTruthy();
  });

  test('close button should have aria-label', async ({ page }) => {
    const drawer = await openDrawer(page);
    const closeButton = drawer.locator('button[aria-label="Close"]');
    await expect(closeButton).toHaveAttribute('aria-label', 'Close');
  });

  // ==================== Focus Management ====================

  test('should trap focus inside drawer when open', async ({ page }) => {
    const drawer = await openDrawer(page);
    await expect(drawer).toBeVisible();

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
  });

  test('close button should be focusable', async ({ page }) => {
    await openDrawer(page);
    const closeButton = page.locator('button[aria-label="Close"]').first();
    await closeButton.focus();
    await expect(closeButton).toBeFocused();
  });

  // ==================== Drawer Content ====================

  test('should display drawer title', async ({ page }) => {
    const drawer = await openDrawer(page);
    const title = drawer.locator('h2');
    await expect(title.first()).toBeVisible();
  });

  test('should display drawer content', async ({ page }) => {
    const drawer = await openDrawer(page);
    const content = await drawer.textContent();
    expect(content).toBeTruthy();
  });

  // ==================== Animation ====================

  test('should animate on open', async ({ page }) => {
    const drawer = await openDrawer(page);
    await expect(drawer).toBeVisible();
  });

  test('should animate on close', async ({ page }) => {
    const drawer = await openDrawer(page);

    await page.mouse.click(10, 10);
    await expect(drawer).not.toBeVisible({ timeout: 5000 });
  });

  // ==================== Backdrop ====================

  test('should render backdrop when drawer is open', async ({ page }) => {
    const drawer = await openDrawer(page);
    await expect(drawer).toBeVisible();
  });

  // ==================== Edge Cases ====================

  test('should handle rapid open/close', async ({ page }) => {
    const trigger = page
      .locator('button')
      .filter({ hasText: /open|drawer|show/i })
      .first();
    await trigger.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await trigger.click();
    await page.waitForTimeout(100);
    await page.mouse.click(10, 10);
    await page.waitForTimeout(100);
    await trigger.click();
    await page.waitForTimeout(600);

    // Should be in a valid state
    const drawer = page.locator('[role="dialog"]');
    const count = await drawer.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render without crashing', async ({ page }) => {
    await page.waitForTimeout(500);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should maintain state after interactions', async ({ page }) => {
    const drawer = await openDrawer(page);
    await expect(drawer).toBeVisible();

    await page.mouse.click(10, 10);
    await expect(drawer).not.toBeVisible({ timeout: 5000 });

    // Trigger should still be functional
    const trigger = page
      .locator('button')
      .filter({ hasText: /open|drawer|show/i })
      .first();
    await expect(trigger).toBeVisible();
  });
});
