import { expect, Page, test } from '@playwright/test';

/**
 * Performance regression tests for charts, virtual lists, and virtual grid.
 *
 * Each test dispatches interactions from within the page (no IPC overhead)
 * and measures per-frame durations via requestAnimationFrame.
 * A frame exceeding MAX_FRAME_MS indicates the main thread was blocked
 * long enough to cause visible jank.
 */

/** Max acceptable single-frame duration in ms. Generous for CI stability. */
const MAX_FRAME_MS = 100;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Sweep synthetic mousemove events across a chart SVG and return per-frame durations. */
async function measureChartHover(
  page: Page,
  svgSelector: string,
  steps = 40,
): Promise<number[]> {
  return page.evaluate(
    async ({ selector, steps }) => {
      const svg = document.querySelector(selector);
      if (!svg) return [];
      const rect = svg.getBoundingClientRect();
      const frames: number[] = [];

      for (let i = 0; i <= steps; i++) {
        const t0 = performance.now();
        const x = rect.left + (rect.width * i) / steps;
        const y = rect.top + rect.height / 2;
        svg.dispatchEvent(
          new MouseEvent('mousemove', { clientX: x, clientY: y, bubbles: true }),
        );
        await new Promise<void>((r) => requestAnimationFrame(() => r()));
        frames.push(performance.now() - t0);
      }

      return frames;
    },
    { selector: svgSelector, steps },
  );
}

/** Incrementally scroll a container and return per-frame durations + max DOM child count. */
async function measureScroll(
  page: Page,
  containerSelector: string,
  childSelector: string,
  steps = 30,
): Promise<{ frames: number[]; maxDomCount: number }> {
  return page.evaluate(
    async ({ containerSel, childSel, steps }) => {
      const el = document.querySelector(containerSel);
      if (!el) return { frames: [], maxDomCount: 0 };

      const maxScroll = el.scrollHeight - el.clientHeight;
      const frames: number[] = [];
      let maxDomCount = 0;

      for (let i = 0; i <= steps; i++) {
        const t0 = performance.now();
        el.scrollTop = (maxScroll * i) / steps;
        await new Promise<void>((r) => requestAnimationFrame(() => r()));
        frames.push(performance.now() - t0);
        maxDomCount = Math.max(maxDomCount, el.querySelectorAll(childSel).length);
      }

      // Scroll back to top to test reverse direction
      for (let i = steps; i >= 0; i--) {
        const t0 = performance.now();
        el.scrollTop = (maxScroll * i) / steps;
        await new Promise<void>((r) => requestAnimationFrame(() => r()));
        frames.push(performance.now() - t0);
        maxDomCount = Math.max(maxDomCount, el.querySelectorAll(childSel).length);
      }

      return { frames, maxDomCount };
    },
    { containerSel: containerSelector, childSel: childSelector, steps },
  );
}

/** Annotate the test report with frame-time stats. */
function reportFrameStats(frames: number[]) {
  const sorted = [...frames].sort((a, b) => a - b);
  const p50 = sorted[Math.floor(sorted.length * 0.5)];
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const max = sorted[sorted.length - 1];

  test.info().annotations.push({
    type: 'perf',
    description: `p50=${p50.toFixed(1)}ms  p95=${p95.toFixed(1)}ms  max=${max.toFixed(1)}ms  (${frames.length} frames)`,
  });

  return { p50, p95, max };
}

// ---------------------------------------------------------------------------
// Chart performance tests
// ---------------------------------------------------------------------------

test.describe('Performance: Charts', () => {
  for (const { name, route } of [
    { name: 'AreaChart', route: '/ui/area-chart' },
    { name: 'LineChart', route: '/ui/line-chart' },
    { name: 'BarChart', route: '/ui/bar-chart' },
  ]) {
    test(`${name} hover should not cause long frames`, async ({ page }) => {
      await page.goto(route);
      const svg = page.locator('svg[role="img"]').first();
      await expect(svg).toBeVisible();

      const frames = await measureChartHover(page, 'svg[role="img"]');
      expect(frames.length).toBeGreaterThan(0);

      const { max } = reportFrameStats(frames);
      expect(max).toBeLessThan(MAX_FRAME_MS);
    });
  }
});

// ---------------------------------------------------------------------------
// Virtual list performance tests
// ---------------------------------------------------------------------------

test.describe('Performance: Virtual Lists', () => {
  test('VirtualList scroll should not cause long frames', async ({ page }) => {
    await page.goto('/ui/virtual-list');
    const listbox = page.locator('role=listbox').first();
    await expect(listbox).toBeVisible();

    const { frames, maxDomCount } = await measureScroll(
      page,
      '[role="listbox"]',
      '[role="option"]',
    );
    expect(frames.length).toBeGreaterThan(0);

    const { max } = reportFrameStats(frames);
    expect(max).toBeLessThan(MAX_FRAME_MS);
    expect(maxDomCount).toBeLessThan(30);
  });

  test('DynamicVirtualList scroll should not cause long frames', async ({ page }) => {
    await page.goto('/ui/dynamic-virtual-list');
    const listbox = page.locator('role=listbox').first();
    await expect(listbox).toBeVisible();

    const { frames, maxDomCount } = await measureScroll(
      page,
      '[role="listbox"]',
      '[role="option"]',
    );
    expect(frames.length).toBeGreaterThan(0);

    const { max } = reportFrameStats(frames);
    expect(max).toBeLessThan(MAX_FRAME_MS);
    expect(maxDomCount).toBeLessThan(20);
  });
});

// ---------------------------------------------------------------------------
// Virtual grid performance tests
// ---------------------------------------------------------------------------

test.describe('Performance: Virtual Grid', () => {
  test('VirtualGrid scroll should not cause long frames', async ({ page }) => {
    await page.goto('/ui/virtual-grid');
    const grid = page.locator('role=grid').first();
    await expect(grid).toBeVisible();

    const { frames, maxDomCount } = await measureScroll(
      page,
      '[role="grid"]',
      '[role="gridcell"]',
    );
    expect(frames.length).toBeGreaterThan(0);

    const { max } = reportFrameStats(frames);
    expect(max).toBeLessThan(MAX_FRAME_MS);
    expect(maxDomCount).toBeLessThan(30);
  });
});
