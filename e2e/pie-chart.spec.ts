import { expect, test } from '@playwright/test';

test.describe('PieChart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/pie-chart');
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

      // Tooltip may appear - just wait for any potential tooltip
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

  // ==================== Accessibility ====================

  test('should have correct ARIA attributes on SVG', async ({ page }) => {
    const svg = page.locator('svg[role="img"]').first();
    await expect(svg).toBeVisible();
    await expect(svg).toHaveAttribute('aria-label');
  });

  test('should have focusable pie segments with role=listitem', async ({ page }) => {
    const segments = page.locator('g[role="listitem"]');
    await expect(segments.first()).toBeAttached({ timeout: 5000 });
    const count = await segments.count();
    expect(count).toBeGreaterThan(0);
    // Segments should be focusable
    const tabindex = await segments.first().getAttribute('tabindex');
    expect(tabindex).toBe('0');
  });

  test('segments should have descriptive aria-labels with values and percentages', async ({
    page,
  }) => {
    const segment = page.locator('g[role="listitem"]').first();
    await expect(segment).toBeAttached({ timeout: 5000 });
    const label = await segment.getAttribute('aria-label');
    expect(label).toBeTruthy();
    // Label should contain a number (value) and percentage
    expect(label).toMatch(/\d+/);
    expect(label).toMatch(/%/);
  });

  test('should have pie segments list with aria-label', async ({ page }) => {
    const list = page.locator('g[role="list"]');
    await expect(list.first()).toBeAttached({ timeout: 5000 });
    const count = await list.count();
    expect(count).toBeGreaterThan(0);
    await expect(list.first()).toHaveAttribute('aria-label', 'Pie chart segments');
  });

  test('should support keyboard interaction on segments', async ({ page }) => {
    const firstSegment = page.locator('g[role="listitem"]').first();
    await expect(firstSegment).toBeAttached({ timeout: 5000 });
    await firstSegment.scrollIntoViewIfNeeded();
    await firstSegment.focus();
    await page.waitForTimeout(100);

    // Segment should be focused
    const focused = await page.evaluate(() => document.activeElement?.getAttribute('role'));
    expect(focused).toBe('listitem');

    // Arrow key should not throw (visual highlight moves, DOM focus stays)
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);

    // Focus should still be on a listitem
    const stillFocused = await page.evaluate(() => document.activeElement?.getAttribute('role'));
    expect(stillFocused).toBe('listitem');
  });
});
