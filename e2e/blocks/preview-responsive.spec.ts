import { expect, test } from '@playwright/test';

test.describe('Preview Page Responsive Tests', () => {
  test.describe('Admin Panel Preview', () => {
    test('should show desktop sidebar on large viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/preview/dashboard/admin-panel');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Desktop sidebar should be visible
      const desktopSidebar = page.locator('div.w-64, div.w-16').first();
      await expect(desktopSidebar).toBeVisible({ timeout: 10000 });
    });

    test('should hide desktop sidebar on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/preview/dashboard/admin-panel');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Desktop sidebar should NOT be visible on mobile
      const desktopSidebar = page.locator('div.w-64').first();
      const isVisible = await desktopSidebar.isVisible().catch(() => false);

      // Either sidebar is hidden or doesn't exist
      expect(isVisible).toBe(false);
    });

    test('should show hamburger menu button on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/preview/dashboard/admin-panel');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Look for mobile menu button in header
      const menuButton = page.locator('header button').first();
      await expect(menuButton).toBeVisible();
    });

    test('should open drawer when menu button clicked on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/preview/dashboard/admin-panel');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Click the menu button (first button in header)
      const menuButton = page.locator('header button').first();
      await menuButton.click();
      await page.waitForTimeout(500);

      // Drawer should be open - look for z-[90] backdrop or z-[91] content
      const drawerBackdrop = page.locator('[class*="z-[90]"], [class*="bg-gray-800"]');
      const drawerContent = page.locator('[class*="z-[91]"]');

      const backdropCount = await drawerBackdrop.count();
      const contentCount = await drawerContent.count();

      expect(backdropCount + contentCount).toBeGreaterThan(0);
    });
  });

  test.describe('WhatsApp Style Chat Preview', () => {
    test('should show conversation list on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto('/preview/messaging/in-app-messages?variant=2');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Desktop conversation list should be visible
      const conversationList = page.locator('div.w-80').first();
      await expect(conversationList).toBeVisible({ timeout: 10000 });
    });

    test('should hide conversation list on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/preview/messaging/in-app-messages?variant=2');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Desktop conversation list should NOT be visible on mobile
      const conversationList = page.locator('div.w-80');
      const isVisible = await conversationList.isVisible().catch(() => false);

      expect(isVisible).toBe(false);
    });

    test('should show back button on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/preview/messaging/in-app-messages?variant=2');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Look for back/menu button - first button with an svg icon
      const backButton = page.locator('button').filter({ has: page.locator('svg') }).first();
      await expect(backButton).toBeVisible();
    });

    test('should open drawer when back button clicked on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/preview/messaging/in-app-messages?variant=2');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);

      // Click the back/menu button
      const backButton = page.locator('button').first();
      await backButton.click();
      await page.waitForTimeout(500);

      // Drawer should be open
      const drawer = page.locator('[class*="fixed"], [role="dialog"]');
      const drawerCount = await drawer.count();

      expect(drawerCount).toBeGreaterThan(0);
    });
  });
});
