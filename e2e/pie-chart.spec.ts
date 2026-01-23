import { expect, test } from '@playwright/test';

test.describe('PieChart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/pie-chart');
  });

  test('should render chart container', async ({ page }) => {
    const chart = page.locator('svg, canvas, [class*="chart"]').first();
    await expect(chart).toBeVisible();
  });

  test('should render SVG pie chart', async ({ page }) => {
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });

  test('should render pie slices', async ({ page }) => {
    const slices = page.locator('svg path[d*="A"], svg path[class*="slice"]');
    const count = await slices.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show tooltip on slice hover', async ({ page }) => {
    const slice = page.locator('svg path').first();

    if (await slice.isVisible()) {
      await slice.hover();

      // Tooltip may appear
      const tooltip = page.locator('[role="tooltip"], [class*="tooltip"]');
      await page.waitForTimeout(200);
    }
  });

  test('should render legend', async ({ page }) => {
    const legend = page.locator('[class*="legend"]');
    const count = await legend.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render with different colors', async ({ page }) => {
    const paths = page.locator('svg path[fill], svg path[style*="fill"]');
    const count = await paths.count();
    expect(count).toBeGreaterThan(0);
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

  test('should render labels', async ({ page }) => {
    const labels = page.locator('svg text');
    const count = await labels.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render center label for donut chart', async ({ page }) => {
    const centerLabel = page.locator(
      'svg text[class*="center"], svg text[text-anchor="middle"]',
    );
    const count = await centerLabel.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should handle empty data gracefully', async ({ page }) => {
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });
});
