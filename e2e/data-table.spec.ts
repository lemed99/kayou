import { expect, test } from '@playwright/test';

test.describe('DataTable', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/data-table', { waitUntil: 'networkidle' });
  });

  // ==================== Basic Rendering ====================

  test('should render data table container', async ({ page }) => {
    const content = await page.textContent('body');
    expect(content).toContain('DataTable');
  });

  test('should display column headers', async ({ page }) => {
    const nameHeader = page.locator('text=Name').first();
    await expect(nameHeader).toBeVisible();
  });

  test('should display data rows', async ({ page }) => {
    const johnDoe = page.locator('text=John Doe').first();
    await expect(johnDoe).toBeVisible();
  });

  test('should display email content', async ({ page }) => {
    const email = page.locator('text=john@example.com').first();
    await expect(email).toBeVisible();
  });

  // ==================== Column Headers ====================

  test('should render Name column', async ({ page }) => {
    const header = page.locator('text=Name').first();
    await expect(header).toBeVisible();
  });

  test('should render Email column', async ({ page }) => {
    const header = page.locator('text=Email').first();
    await expect(header).toBeVisible();
  });

  test('should render Role column', async ({ page }) => {
    const header = page.locator('text=Role').first();
    await expect(header).toBeVisible();
  });

  test('should render Status column', async ({ page }) => {
    const header = page.locator('text=Status').first();
    await expect(header).toBeVisible();
  });

  test('should render Department column', async ({ page }) => {
    const header = page.locator('text=Department').first();
    await expect(header).toBeVisible();
  });

  // ==================== Data Display ====================

  test('should display user data', async ({ page }) => {
    const users = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams'];
    for (const user of users) {
      const row = page.locator(`text=${user}`).first();
      await expect(row).toBeVisible();
    }
  });

  test('should display role data', async ({ page }) => {
    const roles = ['Admin', 'User', 'Editor'];
    let foundCount = 0;
    for (const role of roles) {
      const cell = page.locator(`text=${role}`).first();
      if (await cell.isVisible()) foundCount++;
    }
    expect(foundCount).toBeGreaterThan(0);
  });

  test('should display status data', async ({ page }) => {
    const statuses = ['active', 'inactive', 'pending'];
    let foundCount = 0;
    for (const status of statuses) {
      const cell = page.locator(`text=${status}`).first();
      if (await cell.isVisible()) foundCount++;
    }
    expect(foundCount).toBeGreaterThan(0);
  });

  // ==================== Row Selection ====================

  test('should render row selection checkboxes when enabled', async ({ page }) => {
    const rowCheckbox = page.locator('input[type="checkbox"]').first();
    await expect(rowCheckbox).toBeVisible();
  });

  test('should toggle row selection on checkbox click', async ({ page }) => {
    const rowCheckbox = page.locator('input[type="checkbox"]').first();
    await expect(rowCheckbox).toBeVisible();

    const initialChecked = await rowCheckbox.isChecked();
    await rowCheckbox.click();
    const newChecked = await rowCheckbox.isChecked();
    expect(newChecked).toBe(!initialChecked);
  });

  test('should support select all functionality', async ({ page }) => {
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    expect(count).toBeGreaterThan(1);

    // First checkbox is "select all"
    const selectAll = checkboxes.first();
    await expect(selectAll).toBeVisible();
  });

  // ==================== Search Bar ====================

  test('should render search bar when enabled', async ({ page }) => {
    const searchInput = page
      .locator('input[type="search"], input[placeholder*="Search"]')
      .first();
    await expect(searchInput).toBeVisible();
  });

  test('should accept search input', async ({ page }) => {
    const searchInput = page
      .locator('input[type="search"], input[placeholder*="Search"]')
      .first();
    await expect(searchInput).toBeVisible();

    await searchInput.fill('John');
    await expect(searchInput).toHaveValue('John');
  });

  // ==================== Filter System ====================

  test('should render filter button', async ({ page }) => {
    const filterButton = page
      .locator('button')
      .filter({ hasText: /Filter/i })
      .first();
    await expect(filterButton).toBeVisible();
  });

  test('should open filter popover on button click', async ({ page }) => {
    const filterButton = page
      .locator('button')
      .filter({ hasText: /Filter/i })
      .first();
    await expect(filterButton).toBeVisible();

    await filterButton.click();
    await page.waitForTimeout(300);

    const popover = page.locator('[data-filter-popover]').first();
    await expect(popover).toBeVisible();
  });

  test('should have add filter option', async ({ page }) => {
    const filterButton = page
      .locator('button')
      .filter({ hasText: /Filter/i })
      .first();
    await filterButton.click();
    await page.waitForTimeout(300);

    const addFilter = page.locator('text=Add filter').first();
    await expect(addFilter).toBeVisible();
  });

  // ==================== Pagination ====================

  test('should render pagination controls', async ({ page }) => {
    const pagination = page
      .locator('[class*="pagination"], nav[aria-label*="pagination"]')
      .first();
    await expect(pagination).toBeVisible();
  });

  test('should render per-page control when enabled', async ({ page }) => {
    const perPage = page.locator('text=per page').first();
    await expect(perPage).toBeVisible();
  });

  // ==================== Expandable Table ====================

  test('should render expand button when expandable', async ({ page }) => {
    const expandBtn = page.locator('button[aria-expanded]').first();
    await expect(expandBtn).toBeVisible();
  });

  test('should expand inline on expand button click', async ({ page }) => {
    const expandBtn = page.locator('button[aria-expanded="false"]').first();
    await expect(expandBtn).toBeVisible();

    await expandBtn.scrollIntoViewIfNeeded();
    await expandBtn.click();

    await expect(expandBtn).toHaveAttribute('aria-expanded', 'true');

    // Should show more rows than the default count
    const table = page.locator('[role="table"]').first();
    const dataRows = table.locator('[role="row"]');
    const rowCount = await dataRows.count();
    // Header row + more than defaultRowsCount data rows
    expect(rowCount).toBeGreaterThan(4);
  });

  test('should display data rows in expanded view', async ({ page }) => {
    const expandBtn = page.locator('button[aria-expanded="false"]').first();
    await expect(expandBtn).toBeVisible();

    await expandBtn.scrollIntoViewIfNeeded();
    await expandBtn.click();

    const table = page.locator('[role="table"]').first();
    const content = await table.textContent();
    expect(content).toContain('John Doe');
  });

  test('should collapse on expand button click again', async ({ page }) => {
    const expandBtn = page.locator('button[aria-expanded="false"]').first();
    await expect(expandBtn).toBeVisible();

    await expandBtn.scrollIntoViewIfNeeded();
    await expandBtn.click();
    await expect(expandBtn).toHaveAttribute('aria-expanded', 'true');

    // Click again to collapse — same button, now aria-expanded="true"
    await expandBtn.click();
    await expect(expandBtn).toHaveAttribute('aria-expanded', 'false');
  });

  // ==================== Custom Cell Rendering ====================

  test('should render custom status badges', async ({ page }) => {
    const activeBadge = page.locator('[class*="bg-green"]').first();
    await expect(activeBadge).toBeVisible();
  });

  // ==================== Keyboard Accessibility ====================

  test('should be keyboard navigable', async ({ page }) => {
    const firstInteractive = page.locator('input, button').first();
    await expect(firstInteractive).toBeVisible();

    await firstInteractive.focus();
    await page.keyboard.press('Tab');
  });

  test('checkboxes should be focusable', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    await expect(checkbox).toBeVisible();

    await checkbox.focus();
    await expect(checkbox).toBeFocused();
  });

  test('should toggle checkbox with Space key', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();
    await expect(checkbox).toBeVisible();

    await checkbox.focus();
    const initialChecked = await checkbox.isChecked();
    await page.keyboard.press('Space');
    const newChecked = await checkbox.isChecked();
    expect(newChecked).toBe(!initialChecked);
  });

  // ==================== CSS Grid Layout ====================

  test('should use CSS Grid for layout', async ({ page }) => {
    const gridContainer = page.locator('[style*="grid"], [class*="grid"]').first();
    await expect(gridContainer).toBeVisible();
  });

  // ==================== Selected Elements Count ====================

  test('should display selected count when rows selected', async ({ page }) => {
    // Click second checkbox (first is "select all")
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    expect(count).toBeGreaterThan(1);

    await checkboxes.nth(1).click();
    await page.waitForTimeout(100);

    const selectedText = page.locator('text=/\\d+ of \\d+ selected/').first();
    await expect(selectedText).toBeVisible();
  });

  // ==================== Multiple Tables ====================

  test('should render data table page', async ({ page }) => {
    const content = await page.textContent('body');
    expect(content).toContain('DataTable');
  });

  test('each table example should display data', async ({ page }) => {
    const johnDoe = page.locator('text=John Doe');
    const count = await johnDoe.count();
    expect(count).toBeGreaterThan(0);
  });

  // ==================== Edge Cases ====================

  test('should maintain layout with varying content', async ({ page }) => {
    const content = await page.textContent('body');
    expect(content).toContain('DataTable');
  });

  test('should render without crashing', async ({ page }) => {
    await page.waitForTimeout(500);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  // ==================== ARIA ====================

  test('should have role="table" on container', async ({ page }) => {
    const table = page.locator('[role="table"]').first();
    await expect(table).toBeVisible();
  });

  test('should have role="rowgroup" for header and body', async ({ page }) => {
    const rowgroups = page.locator('[role="rowgroup"]');
    const count = await rowgroups.count();
    // At least 2: one for header, one for body
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('should have role="columnheader" on header cells', async ({ page }) => {
    const headers = page.locator('[role="columnheader"]');
    const count = await headers.count();
    expect(count).toBeGreaterThan(0);
  });

  test('expand button should have aria-label', async ({ page }) => {
    const expandBtn = page.locator('button[aria-expanded]').first();
    await expect(expandBtn).toBeVisible();
    await expect(expandBtn).toHaveAttribute('aria-label');
  });
});
