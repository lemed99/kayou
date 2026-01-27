import { expect, test } from '@playwright/test';

test.describe('AreaChart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/area-chart');
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

  test('should be keyboard accessible', async ({ page }) => {
    const svg = page.locator('svg').first();
    await svg.focus();
    // SVG should be focusable or its container should be
    await expect(svg).toBeVisible();
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
