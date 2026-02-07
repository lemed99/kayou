import { expect, test } from '@playwright/test';

test.describe('Breadcrumb', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/breadcrumb');
  });

  // ==================== Basic Rendering ====================

  test('should render nav element with aria-label "Breadcrumb"', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Breadcrumb"]').first();
    await expect(nav).toBeVisible();
  });

  test('should render ordered list with breadcrumb items', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Breadcrumb"]').first();
    const ol = nav.locator('ol');
    await expect(ol).toBeVisible();

    const items = ol.locator('li');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('should render items in correct hierarchical order', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Breadcrumb"]').first();
    const items = nav.locator('li');

    await expect(items.first()).toContainText('Home');
    await expect(items.last()).toContainText('Current Page');
  });

  // ==================== Links ====================

  test('should render items with href as links', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Breadcrumb"]').first();
    const links = nav.locator('a[href]');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(1);

    const firstHref = await links.first().getAttribute('href');
    expect(firstHref).toBe('/');
  });

  test('should render items without href as spans', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Breadcrumb"]').first();
    const lastItem = nav.locator('li').last();
    const span = lastItem.locator('span');
    await expect(span).toBeVisible();

    const link = lastItem.locator('a');
    await expect(link).toHaveCount(0);
  });

  // ==================== Current Page (aria-current) ====================

  test('should add aria-current="page" to current item', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Breadcrumb"]').nth(1);
    const currentElement = nav.locator('[aria-current="page"]');
    await expect(currentElement).toBeVisible();
    await expect(currentElement).toContainText('Profile');
  });

  test('current page item should render as span, not link', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Breadcrumb"]').nth(1);
    const currentElement = nav.locator('[aria-current="page"]');

    const tagName = await currentElement.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe('span');
  });

  // ==================== Separators ====================

  test('should render chevron separators between items', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Breadcrumb"]').first();
    const svgs = nav.locator('svg');
    const itemCount = await nav.locator('li').count();

    // Each item has an SVG but the first is hidden via CSS (group-first:hidden)
    const svgCount = await svgs.count();
    expect(svgCount).toBe(itemCount);
    await expect(svgs.first()).toBeHidden();

    for (let i = 1; i < itemCount; i++) {
      await expect(svgs.nth(i)).toBeVisible();
    }
  });

  test('separators should have aria-hidden', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Breadcrumb"]').first();
    const svgs = nav.locator('svg');
    const count = await svgs.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(svgs.nth(i)).toHaveAttribute('aria-hidden', 'true');
    }
  });

  // ==================== Keyboard Navigation ====================

  test('links should be focusable via keyboard', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Breadcrumb"]').first();
    const firstLink = nav.locator('a[href]').first();

    await firstLink.focus();
    await expect(firstLink).toBeFocused();
  });

  test('should have visible focus indicator on links', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Breadcrumb"]').first();
    const firstLink = nav.locator('a[href]').first();

    await firstLink.focus();
    await expect(firstLink).toBeFocused();

    const classes = await firstLink.getAttribute('class');
    expect(classes).toContain('focus-visible:ring-2');
  });

  test('Tab key should move focus between links', async ({ page }) => {
    // Use the "All Links" breadcrumb which has 3 consecutive links
    const nav = page
      .locator('nav[aria-label="Breadcrumb"]')
      .filter({ hasText: /Dashboard/ });
    const links = nav.locator('a[href]');
    await expect(links).toHaveCount(3);

    await links.first().focus();
    await expect(links.first()).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(links.nth(1)).toBeFocused();
  });

  // ==================== Visual States ====================

  test('links and non-link items should have different styles', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Breadcrumb"]').first();
    const link = nav.locator('a[href]').first();
    const span = nav.locator('li').last().locator('span');

    const linkClasses = await link.getAttribute('class');
    const spanClasses = await span.getAttribute('class');

    expect(linkClasses).toContain('cursor-pointer');
    expect(spanClasses).not.toContain('cursor-pointer');
  });

  // ==================== ariaLabels Override (i18n) ====================

  test('should support custom aria-label via ariaLabels prop', async ({ page }) => {
    const customNav = page.locator('nav[aria-label="Fil d\'Ariane"]');
    await expect(customNav).toBeVisible();
    await expect(customNav).toContainText('Accueil');
  });

  // ==================== All Links Example ====================

  test('should render breadcrumb where all items are links', async ({ page }) => {
    const allLinksNav = page
      .locator('nav[aria-label="Breadcrumb"]')
      .filter({ hasText: /Dashboard/ });

    await expect(allLinksNav).toBeVisible();

    const links = allLinksNav.locator('a[href]');
    await expect(links).toHaveCount(3);
  });

  // ==================== Responsive ====================

  test('should have flex-wrap on the ordered list for responsive layout', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Breadcrumb"]').first();
    const ol = nav.locator('ol');
    const classes = await ol.getAttribute('class');
    expect(classes).toContain('flex-wrap');
  });

  // ==================== Multiple Breadcrumbs ====================

  test('should render multiple independent breadcrumb examples', async ({ page }) => {
    const navs = page.locator('nav[aria-label]');
    const count = await navs.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });
});
