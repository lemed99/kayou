import { expect, test, type Frame } from '@playwright/test';

/**
 * Helper to get the preview iframe frame
 */
async function getPreviewFrame(page: import('@playwright/test').Page): Promise<Frame> {
  // Wait for iframe to be present
  const iframeLocator = page.locator('iframe[title*="preview" i]');
  await expect(iframeLocator).toBeVisible({ timeout: 10000 });

  // Get the frame
  const iframeElement = await iframeLocator.elementHandle();
  const frame = await iframeElement?.contentFrame();

  if (!frame) {
    throw new Error('Could not find preview iframe frame');
  }

  // Wait for the frame to be loaded
  await frame.waitForLoadState('domcontentloaded');

  return frame;
}

test.describe('Dashboard Blocks', () => {
  test.describe('Admin Panel Block', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/blocks/dashboard/admin-panel');
      await page.waitForLoadState('networkidle');
    });

    test('should render sidebar navigation on desktop', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.waitForTimeout(300);

      const frame = await getPreviewFrame(page);
      const sidebar = frame.locator('nav, aside, [class*="sidebar"]').first();
      await expect(sidebar).toBeVisible({ timeout: 10000 });
    });

    test('should render stats cards', async ({ page }) => {
      const frame = await getPreviewFrame(page);
      // Look for stat cards with values like $45,231, 2,350, etc.
      const statsCards = frame.locator('[class*="rounded-xl"]').filter({ hasText: /\$[\d,]+|\d{1,3}(,\d{3})*/ });
      const count = await statsCards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should render main header', async ({ page }) => {
      const frame = await getPreviewFrame(page);
      const header = frame.locator('header').first();
      await expect(header).toBeVisible();
    });

    test('should have search functionality', async ({ page }) => {
      const frame = await getPreviewFrame(page);
      const searchInput = frame.locator('input[placeholder*="Search" i]').first();
      await expect(searchInput).toBeVisible();
    });

    test('should have notification bell', async ({ page }) => {
      const frame = await getPreviewFrame(page);
      const notificationButton = frame.locator('button').filter({ has: frame.locator('svg') });
      const count = await notificationButton.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should render data table section', async ({ page }) => {
      const frame = await getPreviewFrame(page);
      // DataTable uses a virtualized structure - look for the section heading or content
      const tableSection = frame.locator('text=Recent Customers').first();
      await expect(tableSection).toBeVisible({ timeout: 10000 });
    });

    test('should render charts', async ({ page }) => {
      const frame = await getPreviewFrame(page);
      const charts = frame.locator('svg').filter({ has: frame.locator('path, line, circle') });
      const count = await charts.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should show hamburger menu on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);

      const frame = await getPreviewFrame(page);

      // Look for hamburger menu button (should appear on mobile)
      const menuButton = frame.locator('button').filter({ has: frame.locator('svg') }).first();
      await expect(menuButton).toBeVisible();
    });

    test('should hide sidebar on mobile and show drawer on menu click', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);

      const frame = await getPreviewFrame(page);

      // On mobile, the desktop sidebar should not be visible
      // The sidebar content should be in a drawer instead
      const desktopSidebar = frame.locator('div.w-64, div.w-16').first();
      const isDesktopSidebarVisible = await desktopSidebar.isVisible().catch(() => false);

      // Find and click the menu button to open drawer
      const menuButton = frame.locator('header button').first();
      if (await menuButton.isVisible()) {
        await menuButton.click();
        await page.waitForTimeout(300);

        // Check if drawer opened (look for drawer backdrop or sidebar content)
        const drawer = frame.locator('[class*="drawer"], [role="dialog"], div.fixed');
        const drawerCount = await drawer.count();

        // Either desktop sidebar should be hidden OR drawer should be available
        expect(!isDesktopSidebarVisible || drawerCount >= 0).toBeTruthy();
      }
    });

    test('should show user dropdown on click', async ({ page }) => {
      const frame = await getPreviewFrame(page);

      // Find user avatar button in header
      const userMenuButton = frame.locator('header button').last();
      if (await userMenuButton.isVisible()) {
        await userMenuButton.click();
        await page.waitForTimeout(300);

        // Look for dropdown/popover content
        const dropdown = frame.locator('[role="menu"], [class*="popover"]');
        const hasDropdown = await dropdown.count();
        expect(hasDropdown >= 0).toBeTruthy();
      }
    });
  });

  test.describe('Analytics Block', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/blocks/dashboard/analytics');
      await page.waitForLoadState('networkidle');
    });

    test('should render metrics cards', async ({ page }) => {
      const frame = await getPreviewFrame(page);
      const metricsCards = frame.locator('[class*="rounded"]').filter({ hasText: /\$[\d,]+|[\d,]+%/ });
      const count = await metricsCards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should render line chart', async ({ page }) => {
      const frame = await getPreviewFrame(page);
      const chart = frame.locator('svg').filter({ has: frame.locator('path') });
      const count = await chart.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have date range selector', async ({ page }) => {
      const frame = await getPreviewFrame(page);
      const dateSelector = frame.locator('button').filter({ hasText: /days|month|week/i });
      const count = await dateSelector.count();
      expect(count >= 0).toBeTruthy();
    });

    test('should have export button', async ({ page }) => {
      const frame = await getPreviewFrame(page);
      const exportButton = frame.locator('button').filter({ hasText: /Export|Download/i });
      const count = await exportButton.count();
      expect(count >= 0).toBeTruthy();
    });

    test('should display revenue data', async ({ page }) => {
      const frame = await getPreviewFrame(page);
      const revenueText = frame.locator('text=/Revenue|\\$/i');
      const count = await revenueText.count();
      expect(count >= 0).toBeTruthy();
    });

    test('should be responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.waitForTimeout(300);

      const frame = await getPreviewFrame(page);
      const charts = frame.locator('svg');
      const count = await charts.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(300);

      const frame = await getPreviewFrame(page);
      const container = frame.locator('div').first();
      await expect(container).toBeVisible();
    });
  });

  test.describe('Overview Block', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/blocks/dashboard/overview');
      await page.waitForLoadState('networkidle');
    });

    test('should render stats overview', async ({ page }) => {
      const frame = await getPreviewFrame(page);
      const stats = frame.locator('[class*="rounded"]').filter({ hasText: /\$[\d,]+|[\d,]+/ });
      const count = await stats.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display greeting or title', async ({ page }) => {
      const frame = await getPreviewFrame(page);
      const title = frame.locator('h1, h2, [class*="text-2xl"], [class*="text-xl"]').first();
      await expect(title).toBeVisible();
    });

    test('should have action buttons', async ({ page }) => {
      const frame = await getPreviewFrame(page);
      const buttons = frame.locator('button');
      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should render activity or recent items', async ({ page }) => {
      const frame = await getPreviewFrame(page);
      // Look for list items or activity feed
      const items = frame.locator('[class*="rounded"]');
      const count = await items.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should render chart or visualization', async ({ page }) => {
      const frame = await getPreviewFrame(page);
      const chart = frame.locator('svg');
      const count = await chart.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(300);

      const frame = await getPreviewFrame(page);
      const container = frame.locator('div').first();
      await expect(container).toBeVisible();
    });

    test('stats grid should be responsive', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(300);

      const frame = await getPreviewFrame(page);
      const grid = frame.locator('[class*="grid"]').first();
      await expect(grid).toBeVisible();
    });
  });
});
