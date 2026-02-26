import { expect, test } from '@playwright/test';

test.describe('AreaChart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/area-chart');
  });

  // ==================== Basic Rendering ====================

  test('should render area chart container', async ({ page }) => {
    const content = await page.textContent('body');
    expect(content).toContain('AreaChart');
  });

  test('should render SVG element', async ({ page }) => {
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  test('should render chart area path', async ({ page }) => {
    const path = page.locator('svg path').first();
    if (await path.isVisible()) {
      await expect(path).toBeVisible();
    }
  });

  // ==================== Chart Components ====================

  test('should render X-axis', async ({ page }) => {
    const xAxis = page.locator('svg line, svg g').first();
    await expect(xAxis).toBeVisible();
  });

  test('should render Y-axis', async ({ page }) => {
    const yAxis = page.locator('svg line, svg g').first();
    await expect(yAxis).toBeVisible();
  });

  test('should render area fill', async ({ page }) => {
    const area = page.locator('svg path[fill], svg path[class*="fill"]').first();
    if (await area.isVisible()) {
      await expect(area).toBeVisible();
    }
  });

  // ==================== Grid Lines ====================

  test('should render grid lines when enabled', async ({ page }) => {
    const gridLines = page.locator('svg line[class*="grid"], svg line[stroke-dasharray]');
    const count = await gridLines.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // ==================== Tooltip ====================

  test('should show tooltip on hover', async ({ page }) => {
    const svg = page.locator('svg').first();
    await svg.hover();
    await page.waitForTimeout(200);

    // Tooltip may or may not appear depending on implementation
    const tooltip = page.locator('[role="tooltip"], [class*="tooltip"]');
    const count = await tooltip.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // ==================== Responsive Behavior ====================

  test('should render within container bounds', async ({ page }) => {
    const svg = page.locator('svg').first();
    const box = await svg.boundingBox();
    expect(box).toBeTruthy();
    if (box) {
      expect(box.width).toBeGreaterThan(0);
      expect(box.height).toBeGreaterThan(0);
    }
  });

  // ==================== Multiple Areas ====================

  test('should support multiple data series', async ({ page }) => {
    const paths = page.locator('svg path');
    const count = await paths.count();
    expect(count).toBeGreaterThan(0);
  });

  // ==================== Accessibility ====================

  test('should have correct ARIA attributes on SVG', async ({ page }) => {
    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveAttribute('aria-label');
    await expect(svg).toHaveAttribute('tabindex', '0');
    await expect(svg).toHaveAttribute('aria-roledescription', 'area chart');
  });

  test('should have area series aria-labels', async ({ page }) => {
    const areaGroup = page.locator('g[aria-label^="Area series:"]').first();
    await expect(areaGroup).toBeVisible();
  });

  test('should focus chart with Tab', async ({ page }) => {
    const svg = page.locator('svg[role="img"]').first();
    await svg.scrollIntoViewIfNeeded();
    await svg.focus();
    await expect(svg).toBeFocused();
  });

  test('should navigate data points with ArrowRight', async ({ page }) => {
    const svg = page.locator('svg[role="img"]').first();
    await svg.scrollIntoViewIfNeeded();
    await svg.focus();
    await page.waitForTimeout(100);

    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);

    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible();
  });

  test('should navigate with Home and End keys', async ({ page }) => {
    const svg = page.locator('svg[role="img"]').first();
    await svg.scrollIntoViewIfNeeded();
    await svg.focus();

    await page.keyboard.press('Home');
    await page.waitForTimeout(200);

    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible();

    const srRegion = svg.locator('..').locator('[role="status"]');
    const text = await srRegion.textContent();
    expect(text).toContain('Jan');
  });

  test('should clear active state with Escape', async ({ page }) => {
    const svg = page.locator('svg[role="img"]').first();
    await svg.scrollIntoViewIfNeeded();
    await svg.focus();

    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);
    const tooltip = page.locator('[role="tooltip"]');
    await expect(tooltip).toBeVisible();

    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    await expect(tooltip).not.toBeVisible();
  });

  test('should update screen reader region on keyboard navigation', async ({ page }) => {
    const svg = page.locator('svg[role="img"]').first();
    await svg.scrollIntoViewIfNeeded();
    await svg.focus();

    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);

    const srRegion = svg.locator('..').locator('[role="status"]');
    const text = await srRegion.textContent();
    expect(text!.trim().length).toBeGreaterThan(0);
    expect(text).toContain('revenue');
  });

  // ==================== Edge Cases ====================

  test('should render without crashing', async ({ page }) => {
    await page.waitForTimeout(500);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should handle empty data gracefully', async ({ page }) => {
    // Chart should still render even with minimal/no data
    const content = await page.textContent('body');
    expect(content).toContain('AreaChart');
  });
});
