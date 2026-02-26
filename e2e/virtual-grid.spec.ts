import { expect, test } from '@playwright/test';

test.describe('VirtualGrid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/virtual-grid');
  });

  test('should render grid with correct ARIA attributes', async ({ page }) => {
    const grid = page.locator('role=grid').first();
    await expect(grid).toBeVisible();
    await expect(grid).toHaveAttribute('aria-rowcount');
    await expect(grid).toHaveAttribute('aria-colcount');
  });

  test('should only render visible items (virtualization)', async ({ page }) => {
    // First example: 100 items in 3 columns — far fewer should be in the DOM
    const grid = page.locator('role=grid').first();
    await expect(grid).toBeVisible();

    const cells = grid.locator('role=gridcell');
    const cellCount = await cells.count();

    expect(cellCount).toBeGreaterThan(0);
    expect(cellCount).toBeLessThan(30);
  });

  test('should render gridcells with correct ARIA roles', async ({ page }) => {
    const grid = page.locator('role=grid').first();
    const firstCell = grid.locator('role=gridcell').first();
    await expect(firstCell).toBeVisible();
    await expect(firstCell).toHaveAttribute('aria-rowindex');
    await expect(firstCell).toHaveAttribute('aria-colindex');
  });

  test('should update visible items on scroll', async ({ page }) => {
    const grid = page.locator('role=grid').first();

    const initialFirstCell = grid.locator('role=gridcell').first();
    const initialRowIndex = await initialFirstCell.getAttribute('aria-rowindex');

    // Scroll down significantly
    await grid.evaluate((el) => {
      el.scrollTop = 500;
    });
    await page.waitForTimeout(200);

    // First visible cell should now have a higher row index
    const newFirstCell = grid.locator('role=gridcell').first();
    const newRowIndex = await newFirstCell.getAttribute('aria-rowindex');
    expect(Number(newRowIndex)).toBeGreaterThan(Number(initialRowIndex));
  });

  test('should maintain virtualization with large dataset', async ({ page }) => {
    // Second example: 200 items in 4 columns
    const grid = page.locator('role=grid').nth(1);
    await expect(grid).toBeVisible();

    const cells = grid.locator('role=gridcell');
    const cellCount = await cells.count();
    expect(cellCount).toBeLessThan(50);
  });

  test('should navigate with arrow keys', async ({ page }) => {
    const grid = page.locator('role=grid').first();
    await grid.focus();
    await page.waitForTimeout(100);

    // After focus, first cell should be marked as focused
    let focusedCell = grid.locator('[data-focused]');
    await expect(focusedCell).toHaveCount(1);

    const initialColIndex = await focusedCell.getAttribute('aria-colindex');
    expect(initialColIndex).toBe('1');

    // Arrow right moves to next column
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(50);
    focusedCell = grid.locator('[data-focused]');
    await expect(focusedCell).toHaveAttribute('aria-colindex', '2');

    // Arrow down moves to next row
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(50);
    focusedCell = grid.locator('[data-focused]');
    await expect(focusedCell).toHaveAttribute('aria-rowindex', '2');
  });

  test('should navigate to start/end with Home/End', async ({ page }) => {
    const grid = page.locator('role=grid').first();
    await grid.focus();
    await page.waitForTimeout(100);

    // Move right twice
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(50);

    // Home should go to start of row
    await page.keyboard.press('Home');
    await page.waitForTimeout(50);
    const focusedCell = grid.locator('[data-focused]');
    await expect(focusedCell).toHaveAttribute('aria-colindex', '1');
  });

  test('should handle empty data gracefully', async ({ page }) => {
    // Last example starts with empty data
    const grids = page.locator('role=grid');
    const lastGrid = grids.last();
    await expect(lastGrid).toBeVisible();

    const cells = lastGrid.locator('role=gridcell');
    await expect(cells).toHaveCount(0);
  });

  test('should set aria-activedescendant on focus', async ({ page }) => {
    const grid = page.locator('role=grid').first();
    await grid.focus();
    await page.waitForTimeout(100);

    const activedescendant = await grid.getAttribute('aria-activedescendant');
    expect(activedescendant).toBeTruthy();

    // The referenced element should exist in the DOM
    const activeCell = page.locator(`[id="${activedescendant}"]`);
    await expect(activeCell).toBeVisible();
  });

  test('should keep rendered item count bounded during scroll', async ({ page }) => {
    const grid = page.locator('role=grid').first();

    for (const scrollPos of [0, 300, 600, 900]) {
      await grid.evaluate((el, pos) => {
        el.scrollTop = pos;
      }, scrollPos);
      await page.waitForTimeout(200);

      const cells = grid.locator('role=gridcell');
      const count = await cells.count();
      expect(count).toBeLessThan(30);
      expect(count).toBeGreaterThan(0);
    }
  });
});
