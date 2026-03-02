import { expect, test } from '@playwright/test';

test.describe('Popover horizontal shift logic on mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview/popover-flip');
    await page.waitForLoadState('networkidle');
  });

  test('should not shift alignment when the shifted position overflows more than the original', async ({
    page,
  }) => {
    // 580px wide popover, bottom-start, on a 375px mobile screen.
    // Trigger is near the left. start alignment overflows right by ~220px.
    // Shifting to end would overflow left by ~440px — much worse.
    // So it should stay on start alignment.
    await page.setViewportSize({ width: 375, height: 667 });

    const trigger = page.getByTestId('trigger-right-btn');
    await trigger.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await trigger.click();

    const popover = page.locator('[role="dialog"]').first();
    await expect(popover).toBeVisible({ timeout: 5000 });

    const triggerBox = await trigger.boundingBox();
    const popoverBox = await popover.boundingBox();
    expect(triggerBox).toBeTruthy();
    expect(popoverBox).toBeTruthy();

    // Popover should stay start-aligned and not go off-screen to the left.
    // Before the fix, shiftWithinBounds would shift to end alignment,
    // placing the popover at ~x=-409. Now it should stay within the viewport.
    expect(popoverBox!.x).toBeGreaterThanOrEqual(0);
  });
});
