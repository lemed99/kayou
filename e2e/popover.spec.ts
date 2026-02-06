import { expect, test } from '@playwright/test';

test.describe('Popover', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/popover');
    await page.waitForLoadState('networkidle');
  });

  test('should render popover trigger', async ({ page }) => {
    const trigger = page.locator('button', { hasText: 'Click me' });
    await expect(trigger).toBeVisible();
  });

  test('should show popover on trigger click', async ({ page }) => {
    const trigger = page.locator('[aria-haspopup="dialog"]').first();
    await trigger.click();

    const popover = page.locator('[role="dialog"]').first();
    await expect(popover).toBeVisible({ timeout: 5000 });
    await expect(popover).toContainText('Popover Title');
  });

  test('should hide popover on second click', async ({ page }) => {
    const trigger = page.locator('[aria-haspopup="dialog"]').first();

    await trigger.click();
    const popover = page.locator('[role="dialog"]').first();
    await expect(popover).toBeVisible({ timeout: 5000 });

    await trigger.click();
    await expect(popover).not.toBeVisible({ timeout: 5000 });
  });

  test('should close popover on Escape', async ({ page }) => {
    const trigger = page.locator('[aria-haspopup="dialog"]').first();
    await trigger.click();

    const popover = page.locator('[role="dialog"]').first();
    await expect(popover).toBeVisible({ timeout: 5000 });

    await page.keyboard.press('Escape');
    await expect(popover).not.toBeVisible({ timeout: 5000 });
  });

  test('should close popover on outside click', async ({ page }) => {
    const trigger = page.locator('[aria-haspopup="dialog"]').first();
    await trigger.click();

    const popover = page.locator('[role="dialog"]').first();
    await expect(popover).toBeVisible({ timeout: 5000 });

    // Click outside the popover and trigger
    await page.locator('body').click({ position: { x: 10, y: 10 } });
    await expect(popover).not.toBeVisible({ timeout: 5000 });
  });

  test('should render popover content', async ({ page }) => {
    const trigger = page.locator('[aria-haspopup="dialog"]').first();
    await trigger.click();

    const popover = page.locator('[role="dialog"]').first();
    await expect(popover).toBeVisible({ timeout: 5000 });
    await expect(popover).toContainText('popover content');
  });

  test('should position popover correctly', async ({ page }) => {
    const trigger = page.locator('[aria-haspopup="dialog"]').first();
    await trigger.click();

    const popover = page.locator('[role="dialog"]').first();
    await expect(popover).toBeVisible({ timeout: 5000 });

    const triggerBox = await trigger.boundingBox();
    const popoverBox = await popover.boundingBox();
    expect(triggerBox).toBeTruthy();
    expect(popoverBox).toBeTruthy();
    // Popover should be positioned near the trigger (default is bottom)
    expect(popoverBox!.y).toBeGreaterThanOrEqual(triggerBox!.y);
  });

  test('should support different placements', async ({ page }) => {
    for (const placement of ['Top', 'Right', 'Bottom', 'Left']) {
      await expect(page.locator('button', { hasText: placement })).toBeVisible();
    }

    // Open a specific placement popover and verify content
    const rightButton = page.locator('button', { hasText: 'Right' });
    await rightButton.click();

    const popover = page.locator('[role="dialog"]', { hasText: 'Right position' });
    await expect(popover).toBeVisible({ timeout: 5000 });
  });

  test('should focus first focusable element when opened', async ({ page }) => {
    // Use the interactive content example which has buttons inside
    const trigger = page.locator('button', { hasText: 'Delete Item' });
    await trigger.click();

    const popover = page.locator('[role="dialog"]', { hasText: 'Confirm Action' });
    await expect(popover).toBeVisible({ timeout: 5000 });

    // First focusable element in the popover should have focus
    const cancelButton = popover.locator('button', { hasText: 'Cancel' });
    await expect(cancelButton).toBeFocused({ timeout: 5000 });
  });

  test('should return focus to trigger on close', async ({ page }) => {
    const trigger = page.locator('[aria-haspopup="dialog"]').first();
    await trigger.click();

    const popover = page.locator('[role="dialog"]').first();
    await expect(popover).toBeVisible({ timeout: 5000 });

    await page.keyboard.press('Escape');
    await expect(popover).not.toBeVisible({ timeout: 5000 });
    await expect(trigger).toBeFocused({ timeout: 5000 });
  });
});
