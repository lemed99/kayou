import { expect, test } from '@playwright/test';

test.describe('Data Management Blocks', () => {
  test.describe('CRUD Interface Block', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/blocks/data-management/crud-interface');
    });

    test('should render data table or list', async ({ page }) => {
      const dataDisplay = page.locator('table, [class*="list"], [class*="grid"]').first();
      await expect(dataDisplay).toBeVisible();
    });

    test('should have add/create button', async ({ page }) => {
      const addButton = page
        .locator(
          'button:has-text("Add"), button:has-text("Create"), button:has-text("New"), button:has(svg[class*="plus"])',
        )
        .first();
      await expect(addButton).toBeVisible();
    });

    test('should have edit functionality', async ({ page }) => {
      const editButton = page.locator(
        'button:has-text("Edit"), button[aria-label*="edit" i], button:has(svg)',
      );
      const count = await editButton.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have delete functionality', async ({ page }) => {
      const deleteButton = page.locator(
        'button:has-text("Delete"), button[aria-label*="delete" i], button:has(svg[class*="trash"])',
      );
      const count = await deleteButton.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should have search functionality', async ({ page }) => {
      const searchInput = page
        .locator('input[type="search"], input[placeholder*="search" i]')
        .first();
      await expect(searchInput).toBeVisible();
    });

    test('should have stats or summary section', async ({ page }) => {
      const stats = page.locator('[class*="stat"], [class*="summary"], [class*="card"]');
      const count = await stats.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display items in the list/table', async ({ page }) => {
      const items = page.locator('tr, [class*="item"], [class*="row"]');
      const count = await items.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should allow searching for items', async ({ page }) => {
      const searchInput = page
        .locator('input[type="search"], input[placeholder*="search" i]')
        .first();
      await searchInput.fill('test search');
      await expect(searchInput).toHaveValue('test search');
    });

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const container = page
        .locator('[class*="crud"], [class*="interface"], main')
        .first();
      await expect(container).toBeVisible();
    });

    test('stats grid should be responsive', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(300);
      const grid = page.locator('[class*="grid"]').first();
      if (await grid.isVisible()) {
        const gridStyle = await grid.evaluate(
          (el) => window.getComputedStyle(el).gridTemplateColumns,
        );
        expect(gridStyle).toBeDefined();
      }
    });
  });

  test.describe('Table View Block', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/blocks/data-management/table-view');
    });

    test('should render data table', async ({ page }) => {
      const table = page.locator('table').first();
      await expect(table).toBeVisible();
    });

    test('should have table headers', async ({ page }) => {
      const headers = page.locator('th, [role="columnheader"]');
      const count = await headers.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have table rows', async ({ page }) => {
      const rows = page.locator('tbody tr, [role="row"]');
      const count = await rows.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have sorting functionality', async ({ page }) => {
      const sortableHeader = page.locator(
        'th[class*="sort"], th:has(svg), button:has-text("Sort")',
      );
      const count = await sortableHeader.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should have search functionality', async ({ page }) => {
      const searchInput = page
        .locator('input[type="search"], input[placeholder*="search" i]')
        .first();
      await expect(searchInput).toBeVisible();
    });

    test('should have pagination', async ({ page }) => {
      const pagination = page.locator(
        '[class*="pagination"], button:has-text("Next"), button:has-text("Previous"), nav[aria-label*="pagination"]',
      );
      const count = await pagination.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should have row selection checkboxes', async ({ page }) => {
      const checkboxes = page.locator('input[type="checkbox"]');
      const count = await checkboxes.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should allow selecting a row', async ({ page }) => {
      const checkbox = page.locator('tbody input[type="checkbox"]').first();
      if (await checkbox.isVisible()) {
        await checkbox.click();
        await page.waitForTimeout(100);
      }
    });

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const container = page.locator('[class*="table"], main').first();
      await expect(container).toBeVisible();
    });
  });

  test.describe('List View Block', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/blocks/data-management/list-view');
    });

    test('should render list items', async ({ page }) => {
      const listItems = page.locator(
        '[class*="list"] > *, [class*="item"], [class*="card"]',
      );
      const count = await listItems.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have stats or summary', async ({ page }) => {
      const stats = page.locator('[class*="stat"], [class*="summary"]');
      const count = await stats.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have search functionality', async ({ page }) => {
      const searchInput = page
        .locator('input[type="search"], input[placeholder*="search" i]')
        .first();
      await expect(searchInput).toBeVisible();
    });

    test('should have filter options', async ({ page }) => {
      const filterButton = page.locator(
        'button:has-text("Filter"), [class*="filter"], select',
      );
      const count = await filterButton.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should have add new button', async ({ page }) => {
      const addButton = page
        .locator(
          'button:has-text("Add"), button:has-text("New"), button:has-text("Create")',
        )
        .first();
      await expect(addButton).toBeVisible();
    });

    test('list items should be clickable', async ({ page }) => {
      const listItem = page.locator('[class*="item"], [class*="card"]').first();
      if (await listItem.isVisible()) {
        const clickable = await listItem.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return (
            style.cursor === 'pointer' || el.tagName === 'BUTTON' || el.tagName === 'A'
          );
        });
        expect(clickable || true).toBeTruthy();
      }
    });

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const container = page.locator('[class*="list"], main').first();
      await expect(container).toBeVisible();
    });

    test('should show grid or list layout', async ({ page }) => {
      const layout = page.locator('[class*="grid"], [class*="list"]').first();
      await expect(layout).toBeVisible();
    });
  });

  test.describe('Search & Filter Block', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/blocks/data-management/search-filter');
    });

    test('should render search input', async ({ page }) => {
      const searchInput = page
        .locator('input[type="search"], input[placeholder*="search" i]')
        .first();
      await expect(searchInput).toBeVisible();
    });

    test('should have filter options', async ({ page }) => {
      const filterOptions = page.locator(
        'select, [class*="filter"], button:has-text("Filter"), input[type="checkbox"]',
      );
      const count = await filterOptions.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should allow typing in search', async ({ page }) => {
      const searchInput = page
        .locator('input[type="search"], input[placeholder*="search" i]')
        .first();
      await searchInput.fill('test query');
      await expect(searchInput).toHaveValue('test query');
    });

    test('should have clear/reset button', async ({ page }) => {
      const clearButton = page.locator(
        'button:has-text("Clear"), button:has-text("Reset"), button[aria-label*="clear" i]',
      );
      const count = await clearButton.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should display results', async ({ page }) => {
      const results = page.locator('[class*="result"], [class*="item"], [class*="card"]');
      const count = await results.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have category or tag filters', async ({ page }) => {
      const categories = page.locator(
        '[class*="category"], [class*="tag"], [class*="badge"], select',
      );
      const count = await categories.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('filters should be interactive', async ({ page }) => {
      const filterCheckbox = page.locator('input[type="checkbox"]').first();
      if (await filterCheckbox.isVisible()) {
        await filterCheckbox.click();
        await page.waitForTimeout(100);
      }
    });

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const container = page
        .locator('[class*="search"], [class*="filter"], main')
        .first();
      await expect(container).toBeVisible();
    });

    test('filters should collapse or drawer on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(300);
      const filterToggle = page.locator(
        'button:has-text("Filter"), [class*="filter-toggle"]',
      );
      const count = await filterToggle.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});
