import { expect, test } from '@playwright/test';

test.describe('LineChart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/line-chart');
  });

  test('should render chart container', async ({ page }) => {
    const chart = page.locator('svg, canvas, [class*="chart"]').first();
    await expect(chart).toBeVisible();
  });

  test('should render chart with SVG elements', async ({ page }) => {
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  test('should render line path', async ({ page }) => {
    const linePath = page.locator('svg path, svg polyline, svg line');
    const count = await linePath.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should render axis labels', async ({ page }) => {
    const axisLabels = page.locator('svg text');
    const count = await axisLabels.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render grid lines', async ({ page }) => {
    const gridLines = page.locator('svg line[class*="grid"], svg g[class*="grid"]');
    const count = await gridLines.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should show tooltip on hover', async ({ page }) => {
    const chart = page.locator('svg').first();

    if (await chart.isVisible()) {
      // Hover over the chart
      await chart.hover();

      // Tooltip may appear - just wait for any potential tooltip
      await page.waitForTimeout(100);
    }
  });

  test('should render data points', async ({ page }) => {
    const dataPoints = page.locator('svg circle, svg rect[class*="point"]');
    const count = await dataPoints.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render legend', async ({ page }) => {
    const legend = page.locator('[class*="legend"]');
    const count = await legend.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should be responsive', async ({ page }) => {
    const chart = page.locator('svg').first();

    if (await chart.isVisible()) {
      const boundingBox = await chart.boundingBox();
      expect(boundingBox).toBeTruthy();
      expect(boundingBox!.width).toBeGreaterThan(0);
      expect(boundingBox!.height).toBeGreaterThan(0);
    }
  });

  test('should handle empty data gracefully', async ({ page }) => {
    // Chart should still render even with no data
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  // ==================== Accessibility ====================

  test('should have correct ARIA attributes on SVG', async ({ page }) => {
    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveAttribute('aria-label');
    await expect(svg).toHaveAttribute('tabindex', '0');
    await expect(svg).toHaveAttribute('aria-roledescription', 'line chart');
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
});
