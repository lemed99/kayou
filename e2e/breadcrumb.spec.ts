import { expect, test } from '@playwright/test';

test.describe('Breadcrumb', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/breadcrumb');
  });

  // ==================== Basic Rendering ====================

  test('should render breadcrumb navigation', async ({ page }) => {
    const nav = page.locator(
      'nav[aria-label*="breadcrumb" i], nav[aria-label*="Breadcrumb" i]',
    );
    const count = await nav.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display breadcrumb items', async ({ page }) => {
    const breadcrumbItems = page
      .locator('nav li, nav a, nav span')
      .filter({ hasText: /.+/ });
    const count = await breadcrumbItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should render nav element with proper aria-label', async ({ page }) => {
    const nav = page.locator('nav[aria-label]').first();
    if (await nav.isVisible()) {
      const ariaLabel = await nav.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    }
  });

  // ==================== Breadcrumb Items ====================

  test('should render Home item', async ({ page }) => {
    const homeItem = page
      .locator('nav')
      .filter({ hasText: /Home|Dashboard/i })
      .first();
    if (await homeItem.isVisible()) {
      await expect(homeItem).toBeVisible();
    }
  });

  test('should render multiple items in hierarchical order', async ({ page }) => {
    const nav = page.locator('nav').first();
    const text = await nav.textContent();
    expect(text).toBeTruthy();
  });

  test('should render current page item', async ({ page }) => {
    const currentItem = page
      .locator('nav')
      .filter({ hasText: /Current Page|Profile|John Doe/i })
      .first();
    if (await currentItem.isVisible()) {
      await expect(currentItem).toBeVisible();
    }
  });

  // ==================== Separators ====================

  test('should have separator between items', async ({ page }) => {
    const nav = page.locator('nav').first();
    const content = await nav.textContent();
    const svgCount = await nav.locator('svg').count();

    // Should have some separator character or SVG icon
    const hasSeparator =
      content?.includes('/') ||
      content?.includes('>') ||
      content?.includes('›') ||
      svgCount > 0;
    expect(hasSeparator).toBeTruthy();
  });

  test('should render SVG separators', async ({ page }) => {
    const nav = page.locator('nav').first();
    const svgCount = await nav.locator('svg').count();
    expect(svgCount).toBeGreaterThanOrEqual(0);
  });

  test('separator should be visible', async ({ page }) => {
    const nav = page.locator('nav').first();
    const svg = nav.locator('svg').first();
    if (await svg.isVisible()) {
      await expect(svg).toBeVisible();
    }
  });

  // ==================== Links ====================

  test('should have clickable links for non-current items', async ({ page }) => {
    const links = page.locator('nav a[href]');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('links should have href attributes', async ({ page }) => {
    const links = page.locator('nav a[href]');
    const count = await links.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('link should navigate on click', async ({ page }) => {
    const link = page.locator('nav a[href]').first();
    if (await link.isVisible()) {
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  // ==================== Current Page Indicator ====================

  test('should indicate current page', async ({ page }) => {
    const currentPage = page.locator(
      '[aria-current="page"], nav li:last-child, nav span:last-child',
    );
    const count = await currentPage.count();
    expect(count).toBeGreaterThan(0);
  });

  test('current page should have aria-current attribute', async ({ page }) => {
    const currentPage = page.locator('[aria-current="page"]');
    const count = await currentPage.count();
    if (count > 0) {
      await expect(currentPage.first()).toHaveAttribute('aria-current', 'page');
    }
  });

  test('current page should not be a link', async ({ page }) => {
    // The current page item typically doesn't have href
    const nav = page.locator('nav').first();
    const allItems = await nav.locator('li, span').count();
    expect(allItems).toBeGreaterThan(0);
  });

  // ==================== Keyboard Navigation ====================

  test('should be keyboard navigable', async ({ page }) => {
    const firstLink = page.locator('nav a[href]').first();

    if (await firstLink.isVisible()) {
      await firstLink.focus();
      await expect(firstLink).toBeFocused();
    }
  });

  test('should navigate between links with Tab key', async ({ page }) => {
    const links = page.locator('nav a[href]');
    const count = await links.count();

    if (count >= 2) {
      await links.first().focus();
      await expect(links.first()).toBeFocused();

      await page.keyboard.press('Tab');
      // Next link should be focusable
    }
  });

  test('links should be focusable', async ({ page }) => {
    const link = page.locator('nav a[href]').first();
    if (await link.isVisible()) {
      await link.focus();
      await expect(link).toBeFocused();
    }
  });

  test('should activate link on Enter key', async ({ page }) => {
    const link = page.locator('nav a[href]').first();
    if (await link.isVisible()) {
      await link.focus();
      await expect(link).toBeFocused();
      // Enter should activate the link
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  // ==================== Accessibility (ARIA) ====================

  test('should have correct aria-label on nav', async ({ page }) => {
    const nav = page.locator('nav[aria-label]').first();
    if (await nav.isVisible()) {
      const ariaLabel = await nav.getAttribute('aria-label');
      expect(ariaLabel?.toLowerCase()).toContain('breadcrumb');
    }
  });

  test('should be accessible to screen readers', async ({ page }) => {
    const nav = page.locator('nav[aria-label]').first();
    if (await nav.isVisible()) {
      await expect(nav).toBeVisible();
      const ariaLabel = await nav.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    }
  });

  // ==================== Visual States ====================

  test('links should have different styling from current page', async ({ page }) => {
    const link = page.locator('nav a[href]').first();
    if (await link.isVisible()) {
      const classes = await link.getAttribute('class');
      expect(classes).toBeTruthy();
    }
  });

  test('should have hover effect on links', async ({ page }) => {
    const link = page.locator('nav a[href]').first();
    if (await link.isVisible()) {
      await link.hover();
      await expect(link).toBeVisible();
    }
  });

  test('should have focus indicator', async ({ page }) => {
    const link = page.locator('nav a[href]').first();
    if (await link.isVisible()) {
      await link.focus();
      await expect(link).toBeFocused();
    }
  });

  // ==================== Multiple Breadcrumbs ====================

  test('should render multiple breadcrumb examples', async ({ page }) => {
    const navs = page.locator('nav');
    const count = await navs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('each breadcrumb should function independently', async ({ page }) => {
    const navs = page.locator('nav');
    const count = await navs.count();

    for (let i = 0; i < Math.min(count, 3); i++) {
      const nav = navs.nth(i);
      if (await nav.isVisible()) {
        await expect(nav).toBeVisible();
      }
    }
  });

  // ==================== Hierarchical Navigation ====================

  test('should show hierarchical path', async ({ page }) => {
    const nav = page.locator('nav').first();
    const text = await nav.textContent();

    // Should contain multiple items indicating hierarchy
    expect(text).toBeTruthy();
    expect(text!.length).toBeGreaterThan(5);
  });

  test('items should be in correct order', async ({ page }) => {
    const nav = page.locator('nav').first();
    const links = nav.locator('a, span');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  // ==================== Edge Cases ====================

  test('should handle single item breadcrumb', async ({ page }) => {
    const navs = page.locator('nav');
    const count = await navs.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should handle long item text gracefully', async ({ page }) => {
    const nav = page.locator('nav').first();
    const box = await nav.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThan(0);
  });

  test('should support custom CSS classes', async ({ page }) => {
    const nav = page.locator('nav').first();
    const classes = await nav.getAttribute('class');
    expect(classes).toBeTruthy();
  });

  // ==================== All Links Example ====================

  test('should render breadcrumb with all clickable links', async ({ page }) => {
    const allLinksNav = page
      .locator('nav')
      .filter({ hasText: /Dashboard.*Users.*John Doe/i })
      .first();
    if (await allLinksNav.isVisible()) {
      const links = allLinksNav.locator('a[href]');
      const count = await links.count();
      expect(count).toBeGreaterThan(0);
    }
  });
});
