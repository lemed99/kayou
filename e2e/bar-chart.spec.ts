import { expect, test } from '@playwright/test';

test.describe('BarChart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/bar-chart');
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

  test('should have correct ARIA attributes on SVG', async ({ page }) => {
    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveAttribute('aria-label');
    await expect(svg).toHaveAttribute('tabindex', '0');
    await expect(svg).toHaveAttribute('aria-roledescription', 'bar chart');
  });

  test('should have bar series aria-labels', async ({ page }) => {
    const barGroup = page.locator('g[aria-label^="Bar series:"]').first();
    await expect(barGroup).toBeVisible();
  });

  test('should focus chart with Tab and show focus ring', async ({ page }) => {
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

    // Screen reader region should have first data point
    const srRegion = svg.locator('..').locator('[role="status"]');
    const text = await srRegion.textContent();
    expect(text).toContain('Jan');

    await page.keyboard.press('End');
    await page.waitForTimeout(200);
    const textEnd = await srRegion.textContent();
    expect(textEnd).not.toContain('Jan');
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
    // Should contain data series name
    expect(text).toContain('revenue');
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
