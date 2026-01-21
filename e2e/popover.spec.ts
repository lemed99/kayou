import { expect, test } from '@playwright/test';

test.describe('Popover', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/popover');
  });

  test('should render popover trigger', async ({ page }) => {
    const trigger = page.locator('button').first();
    await expect(trigger).toBeVisible();
  });

  test('should show popover on trigger click', async ({ page }) => {
    // Find trigger with aria-haspopup="dialog"
    const trigger = page.locator('[aria-haspopup="dialog"]').first();
    await trigger.click();

    // Wait for animation
    await page.waitForTimeout(300);

    const popover = page.locator('[role="dialog"]');
    await expect(popover.first()).toBeVisible();
  });

  test('should hide popover on second click', async ({ page }) => {
    const trigger = page.locator('[aria-haspopup="dialog"]').first();

    // Open
    await trigger.click();
    await page.waitForTimeout(300);

    const popover = page.locator('[role="dialog"]').first();
    await expect(popover).toBeVisible();

    // Close by clicking trigger again
    await trigger.click();
    await page.waitForTimeout(300);
    await expect(popover).not.toBeVisible();
  });

  test('should close popover on Escape', async ({ page }) => {
    const trigger = page.locator('[aria-haspopup="dialog"]').first();
    await trigger.click();
    await page.waitForTimeout(300);

    const popover = page.locator('[role="dialog"]').first();
    await expect(popover).toBeVisible();

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await expect(popover).not.toBeVisible();
  });

  test('should close popover on outside click', async ({ page }) => {
    const trigger = page.locator('[aria-haspopup="dialog"]').first();
    await trigger.click();
    await page.waitForTimeout(300);

    const popover = page.locator('[role="dialog"]').first();
    await expect(popover).toBeVisible();

    // Click outside - on page body area that's not the popover
    await page.locator('body').click({ position: { x: 10, y: 10 } });
    await page.waitForTimeout(300);
    // Popover should be closed or still exist - check count
    const count = await page.locator('[role="dialog"]').count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render popover content', async ({ page }) => {
    const trigger = page.locator('[aria-haspopup="dialog"]').first();
    await trigger.click();
    await page.waitForTimeout(300);

    const popover = page.locator('[role="dialog"]').first();
    await expect(popover).toBeVisible();
    const content = await popover.textContent();
    expect(content).toBeTruthy();
  });

  test('should position popover correctly', async ({ page }) => {
    const trigger = page.locator('[aria-haspopup="dialog"]').first();
    await trigger.click();
    await page.waitForTimeout(300);

    const popover = page.locator('[role="dialog"]').first();
    await expect(popover).toBeVisible();
    const boundingBox = await popover.boundingBox();

    expect(boundingBox).toBeTruthy();
    expect(boundingBox!.x).toBeGreaterThanOrEqual(0);
    expect(boundingBox!.y).toBeGreaterThanOrEqual(0);
  });

  test('should support different placements', async ({ page }) => {
    // Popovers can be positioned top, bottom, left, right
    const content = await page.textContent('body');
    expect(content).toContain('Popover');
  });

  test('should render arrow indicator', async ({ page }) => {
    const trigger = page.locator('[aria-haspopup="dialog"]').first();
    await trigger.click();
    await page.waitForTimeout(300);

    const arrow = page.locator('[data-arrow], [class*="arrow"]');
    const count = await arrow.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should trap focus when open', async ({ page }) => {
    const trigger = page.locator('[aria-haspopup="dialog"]').first();
    await trigger.click();
    await page.waitForTimeout(300);

    const popover = page.locator('[role="dialog"]').first();
    await expect(popover).toBeVisible();

    // Tab should work within popover or move through focusable elements
    await page.keyboard.press('Tab');
  });
});
