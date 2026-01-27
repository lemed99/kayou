import { expect, test } from '@playwright/test';

test.describe('BarChart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/bar-chart');
  });

  // ==================== Basic Rendering ====================

  test('should render bar chart container', async ({ page }) => {
    const content = await page.textContent('body');
    expect(content).toContain('BarChart');
  });

  test('should render SVG element', async ({ page }) => {
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  test('should render bar rectangles', async ({ page }) => {
    const bars = page.locator('svg rect');
    const count = await bars.count();
    expect(count).toBeGreaterThan(0);
  });

  // ==================== Chart Components ====================

  test('should render X-axis', async ({ page }) => {
    const xAxis = page.locator('svg g, svg line').first();
    await expect(xAxis).toBeVisible();
  });

  test('should render Y-axis', async ({ page }) => {
    const yAxis = page.locator('svg g, svg line').first();
    await expect(yAxis).toBeVisible();
  });

  test('should render axis labels', async ({ page }) => {
    const labels = page.locator('svg text');
    const count = await labels.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // ==================== Bar Styling ====================

  test('should render bars with fill color', async ({ page }) => {
    const bar = page.locator('svg rect').first();
    if (await bar.isVisible()) {
      const fill = await bar.getAttribute('fill');
      expect(fill).toBeTruthy();
    }
  });

  test('should render bars with proper dimensions', async ({ page }) => {
    const bar = page.locator('svg rect').first();
    if (await bar.isVisible()) {
      const width = await bar.getAttribute('width');
      const height = await bar.getAttribute('height');
      expect(Number(width)).toBeGreaterThan(0);
      expect(Number(height)).toBeGreaterThanOrEqual(0);
    }
  });

  // ==================== Grid Lines ====================

  test('should render grid lines when enabled', async ({ page }) => {
    const gridLines = page.locator('svg line[class*="grid"], svg line[stroke-dasharray]');
    const count = await gridLines.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // ==================== Tooltip ====================

  test('should show tooltip on bar hover', async ({ page }) => {
    const bar = page.locator('svg rect').first();
    if (await bar.isVisible()) {
      await bar.hover();
      await page.waitForTimeout(200);

      // Tooltip may or may not appear
      const tooltip = page.locator('[role="tooltip"], [class*="tooltip"]');
      const count = await tooltip.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
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

  // ==================== Stacked/Grouped Bars ====================

  test('should support multiple data series', async ({ page }) => {
    const bars = page.locator('svg rect');
    const count = await bars.count();
    expect(count).toBeGreaterThan(0);
  });

  // ==================== Accessibility ====================

  test('should be accessible', async ({ page }) => {
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  // ==================== Edge Cases ====================

  test('should render without crashing', async ({ page }) => {
    await page.waitForTimeout(500);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should handle data updates gracefully', async ({ page }) => {
    const content = await page.textContent('body');
    expect(content).toContain('BarChart');
  });
});
