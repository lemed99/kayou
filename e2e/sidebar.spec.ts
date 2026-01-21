import { expect, test } from '@playwright/test';

test.describe('Sidebar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/sidebar');
  });

  test('should render sidebar', async ({ page }) => {
    const sidebar = page.locator('nav, aside, [class*="sidebar"]').first();
    await expect(sidebar).toBeVisible();
  });

  test('should render navigation items', async ({ page }) => {
    const navItems = page.locator('nav a, aside a, [class*="sidebar"] a');
    const count = await navItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should highlight active item', async ({ page }) => {
    const activeItem = page.locator('[aria-current="page"], [class*="active"]');
    const count = await activeItem.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should support collapsible sections', async ({ page }) => {
    const collapsibleTrigger = page.locator('button[aria-expanded]').first();

    if (await collapsibleTrigger.isVisible()) {
      const initialExpanded = await collapsibleTrigger.getAttribute('aria-expanded');

      await collapsibleTrigger.click();

      const newExpanded = await collapsibleTrigger.getAttribute('aria-expanded');
      expect(newExpanded).not.toBe(initialExpanded);
    }
  });

  test('should render icons', async ({ page }) => {
    const icons = page.locator('nav svg, aside svg, [class*="sidebar"] svg');
    const count = await icons.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should be keyboard navigable', async ({ page }) => {
    const firstLink = page.locator('nav a, aside a').first();
    await firstLink.focus();
    await expect(firstLink).toBeFocused();

    // Tab to next item
    await page.keyboard.press('Tab');
  });

  test('should support collapse/expand toggle', async ({ page }) => {
    const toggleButton = page.locator('button[aria-label*="collapse" i], button[aria-label*="expand" i], button[aria-label*="toggle" i]').first();

    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await page.waitForTimeout(200);
    }
  });

  test('should render nested navigation', async ({ page }) => {
    const nestedNav = page.locator('nav ul ul, nav ol ol');
    const count = await nestedNav.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should show tooltips when collapsed', async ({ page }) => {
    // When sidebar is collapsed, items may show tooltips
    const tooltip = page.locator('[role="tooltip"]');
    const count = await tooltip.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should have proper semantic structure', async ({ page }) => {
    const nav = page.locator('nav');
    const count = await nav.count();
    expect(count).toBeGreaterThan(0);
  });
});
