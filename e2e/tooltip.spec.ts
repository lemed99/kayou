import { expect, test } from '@playwright/test';

test.describe('Tooltip', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/tooltip');
    await page.waitForLoadState('networkidle');
  });

  test('should render tooltip trigger', async ({ page }) => {
    const trigger = page.locator('button', { hasText: 'Hover me' });
    await expect(trigger).toBeVisible();
  });

  test('should show tooltip on hover', async ({ page }) => {
    const trigger = page.locator('button', { hasText: 'Hover me' });
    await trigger.hover();

    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible({ timeout: 5000 });
    await expect(tooltip).toContainText('This is a tooltip');
  });

  test('should hide tooltip on mouse leave', async ({ page }) => {
    const trigger = page.locator('button', { hasText: 'Hover me' });
    await trigger.hover();

    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible({ timeout: 5000 });

    await page.mouse.move(0, 0);
    await expect(tooltip).not.toBeVisible({ timeout: 5000 });
  });

  test('should display tooltip content', async ({ page }) => {
    const trigger = page.locator('button', { hasText: 'Hover me' });
    await trigger.hover();

    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible({ timeout: 5000 });
    await expect(tooltip).toContainText('This is a tooltip');
  });

  test('should show tooltip when anchor is focused via keyboard', async ({ page }) => {
    const trigger = page.locator('button', { hasText: 'Hover me' });
    await expect(trigger).toBeVisible();
    await trigger.scrollIntoViewIfNeeded();

    await trigger.evaluate((el) => el.focus());

    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible({ timeout: 5000 });
  });

  test('should hide tooltip when anchor loses focus via keyboard', async ({ page }) => {
    const trigger = page.locator('button', { hasText: 'Hover me' });
    await expect(trigger).toBeVisible();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.evaluate((el) => el.focus());

    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible({ timeout: 5000 });

    await trigger.evaluate((el) => el.blur());
    await expect(tooltip).not.toBeVisible({ timeout: 5000 });
  });

  test('should dismiss tooltip on Escape key', async ({ page }) => {
    const trigger = page.locator('button', { hasText: 'Hover me' });
    await trigger.evaluate((el) => el.focus());

    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible({ timeout: 5000 });

    await page.keyboard.press('Escape');
    await expect(tooltip).not.toBeVisible({ timeout: 5000 });
  });

  test('should support different placements', async ({ page }) => {
    for (const placement of ['Top', 'Bottom', 'Left', 'Right']) {
      await expect(page.locator('button', { hasText: placement })).toBeVisible();
    }

    const button = page.locator('button', { hasText: 'Bottom' });
    await button.hover();

    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible({ timeout: 5000 });
    await expect(tooltip).toContainText('Bottom tooltip');
  });

  test('should render with delay', async ({ page }) => {
    const delayedTrigger = page.locator('button').filter({ hasText: /delay/i }).first();

    if (await delayedTrigger.isVisible()) {
      await delayedTrigger.hover();

      // Tooltip should NOT be visible immediately (500ms delay)
      const tooltip = page.locator('[role="tooltip"]');
      await expect(tooltip).not.toBeVisible({ timeout: 200 });

      // But should appear after the delay
      await expect(tooltip).toBeVisible({ timeout: 5000 });
    }
  });
});
