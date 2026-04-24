import { expect, test, type Locator, type Page } from '@playwright/test';

/** Scroll the playground into view and wait for the DataTable to render. */
async function waitForPlayground(page: Page): Promise<Locator> {
  const playground = page.locator('section#playground');
  await playground.scrollIntoViewIfNeeded();
  // Wait for the DataTable component to render inside the playground
  const table = playground.locator('[role="table"]').first();
  await expect(table).toBeVisible({ timeout: 15000 });
  return playground;
}

/** Sort a column via the sort dropdown. */
async function sortColumn(
  page: Page,
  header: Locator,
  action: 'asc' | 'desc' | 'clear',
) {
  const sortBtn = header.locator('button[data-sort-button]');
  await sortBtn.click();
  // Scope to this button's listbox via aria-controls to avoid strict mode violations
  const listboxId = await sortBtn.getAttribute('aria-controls');
  const label =
    action === 'asc'
      ? 'Sort ascending'
      : action === 'desc'
        ? 'Sort descending'
        : 'Clear sort';
  const option = page
    .locator(`#${listboxId}`)
    .getByRole('option', { name: label, exact: true })
    .first();
  await option.waitFor({ state: 'visible' });
  await option.click({ force: true });
}

async function getComputedTextAlign(locator: Locator): Promise<string> {
  return locator.evaluate((element) => getComputedStyle(element as HTMLElement).textAlign);
}

test.describe('DataTable', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/data-table', { waitUntil: 'networkidle' });
  });

  // ==================== Basic Rendering ====================

  test('should render data table container', async ({ page }) => {
    const content = await page.textContent('body');
    expect(content).toContain('DataTable');
  });

  test('should display column headers', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    await expect(nameHeader).toBeVisible();
  });

  test('should display data rows', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const johnDoe = pg.locator('text=John Doe').first();
    await expect(johnDoe).toBeVisible();
  });

  test('should display email content', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const email = pg.locator('text=john@example.com').first();
    await expect(email).toBeVisible();
  });

  // ==================== Column Headers ====================

  test('should render Name column', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const header = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    await expect(header).toBeVisible();
  });

  test('should render Email column', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const header = pg.locator('[role="columnheader"]').filter({ hasText: 'Email' }).first();
    await expect(header).toBeVisible();
  });

  test('should render Role column', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const header = pg.locator('[role="columnheader"]').filter({ hasText: 'Role' }).first();
    await expect(header).toBeVisible();
  });

  test('should render Status column', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const header = pg.locator('[role="columnheader"]').filter({ hasText: 'Status' }).first();
    await expect(header).toBeVisible();
  });

  test('should render Department column', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const header = pg.locator('[role="columnheader"]').filter({ hasText: 'Department' }).first();
    await expect(header).toBeVisible();
  });

  test('should apply configured column alignment to header and cells', async ({
    page,
  }) => {
    const pg = await waitForPlayground(page);

    const emailHeader = pg
      .locator('[role="columnheader"]')
      .filter({ hasText: 'Email' })
      .first();
    const statusHeader = pg
      .locator('[role="columnheader"]')
      .filter({ hasText: 'Status' })
      .first();
    const ageHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Age' }).first();

    await expect(emailHeader).toBeVisible();
    await expect(statusHeader).toBeVisible();
    await expect(ageHeader).toBeVisible();

    const emailHeaderLabel = emailHeader.locator('span').filter({ hasText: 'Email' }).first();
    const statusHeaderButton = statusHeader.locator('button[data-sort-button]').first();
    const ageHeaderButton = ageHeader.locator('button[data-sort-button]').first();

    expect(await getComputedTextAlign(emailHeaderLabel)).toBe('left');
    expect(await getComputedTextAlign(statusHeaderButton)).toBe('center');
    expect(await getComputedTextAlign(ageHeaderButton)).toBe('right');

    const emailCellText = pg.locator('[data-column="email"]').first();
    const statusCellText = pg.locator('[data-column="status"]').first();
    const ageCellText = pg.locator('[data-column="age"]').first();

    expect(await getComputedTextAlign(emailCellText)).toBe('left');
    expect(await getComputedTextAlign(statusCellText)).toBe('center');
    expect(await getComputedTextAlign(ageCellText)).toBe('right');
  });

  test('aligned sortable columns should keep sorting behavior', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const statusHeader = pg
      .locator('[role="columnheader"]')
      .filter({ hasText: 'Status' })
      .first();

    await sortColumn(page, statusHeader, 'asc');
    await expect(statusHeader).toHaveAttribute('aria-sort', 'ascending');
  });

  // ==================== Data Display ====================

  test('should display user data', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const users = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams'];
    for (const user of users) {
      const row = pg.locator(`text=${user}`).first();
      await expect(row).toBeVisible();
    }
  });

  test('should display role data', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const roles = ['Admin', 'User', 'Editor'];
    let foundCount = 0;
    for (const role of roles) {
      const cell = pg.locator(`text=${role}`).first();
      if (await cell.isVisible()) foundCount++;
    }
    expect(foundCount).toBeGreaterThan(0);
  });

  test('should display status data', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const statuses = ['active', 'inactive', 'pending'];
    let foundCount = 0;
    for (const status of statuses) {
      const cell = pg.locator(`text=${status}`).first();
      if (await cell.isVisible()) foundCount++;
    }
    expect(foundCount).toBeGreaterThan(0);
  });

  // ==================== Row Selection ====================

  test('should render row selection checkboxes when enabled', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const rowCheckbox = pg.locator('input[type="checkbox"]').first();
    await expect(rowCheckbox).toBeVisible();
  });

  test('should toggle row selection on checkbox click', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const rowCheckbox = pg.locator('input[type="checkbox"]').first();
    await expect(rowCheckbox).toBeVisible();

    const initialChecked = await rowCheckbox.isChecked();
    await rowCheckbox.click();
    const newChecked = await rowCheckbox.isChecked();
    expect(newChecked).toBe(!initialChecked);
  });

  test('should support select all functionality', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const checkboxes = pg.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    expect(count).toBeGreaterThan(1);

    // First checkbox is "select all"
    const selectAll = checkboxes.first();
    await expect(selectAll).toBeVisible();
  });

  // ==================== Search Bar ====================

  test('should render search bar when enabled', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const searchInput = pg
      .locator('input[type="search"], input[placeholder*="Search"]')
      .first();
    await expect(searchInput).toBeVisible();
  });

  test('should accept search input', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const searchInput = pg
      .locator('input[type="search"], input[placeholder*="Search"]')
      .first();
    await expect(searchInput).toBeVisible();

    await searchInput.fill('John');
    await expect(searchInput).toHaveValue('John');
  });

  // ==================== Filter System ====================

  test('should render filter button', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const filterButton = pg
      .locator('button')
      .filter({ hasText: /Filter/i })
      .first();
    await expect(filterButton).toBeVisible();
  });

  test('should open filter popover on button click', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const filterButton = pg
      .locator('button')
      .filter({ hasText: /Filter/i })
      .first();
    await expect(filterButton).toBeVisible();

    await filterButton.click();
    await page.waitForTimeout(300);

    const addFilter = page.locator('text=Add filter').first();
    await expect(addFilter).toBeVisible();
  });

  test('should have add filter option', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const filterButton = pg
      .locator('button')
      .filter({ hasText: /Filter/i })
      .first();
    await filterButton.click();
    await page.waitForTimeout(300);

    const addFilter = page.locator('text=Add filter').first();
    await expect(addFilter).toBeVisible();
  });

  test('should keep filter popover open when clicking datepicker input', async ({ page }) => {
    const pg = await waitForPlayground(page);
    // Open the filter popover
    const filterButton = pg
      .locator('button')
      .filter({ hasText: /Filter/i })
      .first();
    await filterButton.click();

    // The filter popover is a Portal-rendered dialog containing "Add filter"
    const filterPopover = page.locator('[role="dialog"]').filter({ hasText: /Add filter/ }).first();
    await expect(filterPopover).toBeVisible();

    // Click "Add filter" — this is a Select trigger that opens a column dropdown
    const addFilterTrigger = filterPopover.getByRole('button', { name: 'Add filter' });
    await addFilterTrigger.click();

    const joinedOption = page.getByRole('option', { name: 'Joined' }).last();
    await expect(joinedOption).toBeVisible();
    await joinedOption.click({ force: true });

    // The datepicker input should now be visible in the filter row
    const datepickerInput = filterPopover.getByPlaceholder('Select a date');
    await expect(datepickerInput).toBeVisible();

    // Click the datepicker input — use force to bypass any overlapping dropdown
    await datepickerInput.click({ force: true });
    await page.waitForTimeout(300);

    // The filter popover should still be visible (not closed by the click)
    await expect(filterPopover).toBeVisible();

    // The calendar should be visible (it contains a grid for the month days)
    const calendar = page.locator('[role="grid"]');
    await expect(calendar.first()).toBeVisible();
  });

  // ==================== Pagination ====================

  test('should render cursor pagination controls', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const pagination = pg.locator('nav[aria-label="Table pagination"]').first();
    await expect(pagination).toBeVisible();
    await expect(pg.getByRole('button', { name: 'Go to previous page' })).toBeVisible();
    await expect(pg.getByRole('button', { name: 'Go to next page' })).toBeVisible();
  });

  test('should disable the previous cursor button on the first page', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const previousButton = pg.getByRole('button', { name: 'Go to previous page' });
    const nextButton = pg.getByRole('button', { name: 'Go to next page' });

    await expect(previousButton).toBeDisabled();
    await expect(nextButton).toBeEnabled();
  });

  test('should navigate between pages with cursor controls', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const table = pg.locator('[role="table"]').first();
    const previousButton = pg.getByRole('button', { name: 'Go to previous page' });
    const nextButton = pg.getByRole('button', { name: 'Go to next page' });
    const cursorState = pg.locator('[data-cursor-state]');

    await expect(cursorState).toContainText('Showing page 1');
    await expect(table.locator('text=John Doe').first()).toBeVisible();

    await nextButton.click();

    await expect(cursorState).toContainText('Showing page 2');
    await expect(previousButton).toBeEnabled();
    await expect(table.locator('text=Samuel Green').first()).toBeVisible();
    await expect(table.locator('text=John Doe')).toHaveCount(0);

    await previousButton.click();

    await expect(cursorState).toContainText('Showing page 1');
    await expect(table.locator('text=John Doe').first()).toBeVisible();
  });

  test('should render per-page control when enabled', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const perPage = pg.locator('text=per page').first();
    await expect(perPage).toBeVisible();
  });

  // ==================== Expandable Table ====================

  test('should render expand button when expandable', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const expandBtn = pg.locator('button').filter({ hasText: /See more/ }).first();
    await expect(expandBtn).toBeVisible();
  });

  test('should expand inline on expand button click', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const seeMoreBtn = pg.locator('button').filter({ hasText: 'See more' }).first();
    await expect(seeMoreBtn).toBeVisible();

    await seeMoreBtn.scrollIntoViewIfNeeded();
    await seeMoreBtn.click();

    // After clicking, button text changes to "See less"
    const seeLessBtn = pg.locator('button').filter({ hasText: 'See less' }).first();
    await expect(seeLessBtn).toHaveAttribute('aria-expanded', 'true');

    // Should show more rows than the default count
    const table = pg.locator('[role="table"]').first();
    const dataRows = table.locator('[role="row"]');
    const rowCount = await dataRows.count();
    // Header row + more than defaultRowsCount data rows
    expect(rowCount).toBeGreaterThan(4);
  });

  test('should display data rows in expanded view', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const expandBtn = pg.locator('button').filter({ hasText: /See more/ }).first();
    await expect(expandBtn).toBeVisible();

    await expandBtn.scrollIntoViewIfNeeded();
    await expandBtn.click();

    const table = pg.locator('[role="table"]').first();
    const content = await table.textContent();
    expect(content).toContain('John Doe');
  });

  test('should collapse on expand button click again', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const seeMoreBtn = pg.locator('button').filter({ hasText: 'See more' }).first();
    await expect(seeMoreBtn).toBeVisible();

    await seeMoreBtn.scrollIntoViewIfNeeded();
    await seeMoreBtn.click();

    // After expanding, button text changes to "See less"
    const seeLessBtn = pg.locator('button').filter({ hasText: 'See less' }).first();
    await expect(seeLessBtn).toHaveAttribute('aria-expanded', 'true');

    // Click again to collapse
    await seeLessBtn.click();

    // Button reverts to "See more"
    await expect(seeMoreBtn).toHaveAttribute('aria-expanded', 'false');
  });

  // ==================== Custom Cell Rendering ====================

  test('should render custom status badges', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const activeBadge = pg.locator('[class*="bg-green"]').first();
    await expect(activeBadge).toBeVisible();
  });

  // ==================== Keyboard Accessibility ====================

  test('should be keyboard navigable', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const firstInteractive = pg.locator('input, button').first();
    await expect(firstInteractive).toBeVisible();

    await firstInteractive.focus();
    await page.keyboard.press('Tab');
  });

  test('checkboxes should be focusable', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const checkbox = pg.locator('input[type="checkbox"]').first();
    await expect(checkbox).toBeVisible();

    await checkbox.focus();
    await expect(checkbox).toBeFocused();
  });

  test('should toggle checkbox with Space key', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const checkbox = pg.locator('input[type="checkbox"]').first();
    await expect(checkbox).toBeVisible();

    await checkbox.focus();
    const initialChecked = await checkbox.isChecked();
    await page.keyboard.press('Space');
    const newChecked = await checkbox.isChecked();
    expect(newChecked).toBe(!initialChecked);
  });

  // ==================== CSS Grid Layout ====================

  test('should use CSS Grid for layout', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const gridContainer = pg.locator('[style*="grid"], [class*="grid"]').first();
    await expect(gridContainer).toBeVisible();
  });

  // ==================== Selected Elements Count ====================

  test('should display selected count when rows selected', async ({ page }) => {
    const pg = await waitForPlayground(page);
    // Click second checkbox (first is "select all")
    const checkboxes = pg.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    expect(count).toBeGreaterThan(1);

    await checkboxes.nth(1).click();
    await page.waitForTimeout(100);

    const selectedText = pg.locator('text=/\\d+ of \\d+ selected/').first();
    await expect(selectedText).toBeVisible();
  });

  // ==================== Multiple Tables ====================

  test('should render data table page', async ({ page }) => {
    const content = await page.textContent('body');
    expect(content).toContain('DataTable');
  });

  test('each table example should display data', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const johnDoe = pg.locator('text=John Doe');
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
    const pg = await waitForPlayground(page);
    const table = pg.locator('[role="table"]').first();
    await expect(table).toBeVisible();
  });

  test('should have role="rowgroup" for header and body', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const rowgroups = pg.locator('[role="rowgroup"]');
    const count = await rowgroups.count();
    // At least 2: one for header, one for body
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('should have role="columnheader" on header cells', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const headers = pg.locator('[role="columnheader"]');
    const count = await headers.count();
    expect(count).toBeGreaterThan(0);
  });

  test('expand button should have aria-label', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const expandBtn = pg.locator('button').filter({ hasText: /See more/ }).first();
    await expect(expandBtn).toBeVisible();
    await expect(expandBtn).toHaveAttribute('aria-label');
  });

  // ==================== Sorting ====================

  test('should render sort indicators on sortable columns', async ({ page }) => {
    const pg = await waitForPlayground(page);
    // Name column is sortable in the demo
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    await expect(nameHeader).toBeVisible();

    // Should have a sort button
    const sortButton = nameHeader.locator('button[data-sort-button]');
    await expect(sortButton).toBeVisible();
  });

  test('should update aria-sort via sort dropdown', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    await expect(nameHeader).toBeVisible();

    // Initially no sort
    await expect(nameHeader).toHaveAttribute('aria-sort', 'none');

    // Sort ascending via dropdown
    await sortColumn(page, nameHeader, 'asc');
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

    // Sort descending via dropdown
    await sortColumn(page, nameHeader, 'desc');
    await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');

    // Clear sort via dropdown
    await sortColumn(page, nameHeader, 'clear');
    await expect(nameHeader).toHaveAttribute('aria-sort', 'none');
  });

  test('non-sortable columns should not have sort button', async ({ page }) => {
    const pg = await waitForPlayground(page);
    // Email column is not in sortableColumns in the demo
    const emailHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Email' }).first();
    await expect(emailHeader).toBeVisible();

    const sortButton = emailHeader.locator('button[data-sort-button]');
    await expect(sortButton).toHaveCount(0);
  });

  // ==================== Multi-Sort ====================

  test('sorting another column should add it to the sort stack', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    const statusHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Status' }).first();

    // Sort Name ascending
    await sortColumn(page, nameHeader, 'asc');
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

    // Sort Status ascending — adds to multi-sort
    await sortColumn(page, statusHeader, 'asc');
    await expect(statusHeader).toHaveAttribute('aria-sort', 'ascending');

    // Name should still be sorted
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
  });

  test('should change sort direction via dropdown', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();

    // Sort ascending
    await sortColumn(page, nameHeader, 'asc');
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

    // Change to descending
    await sortColumn(page, nameHeader, 'desc');
    await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
  });

  test('clear sort should remove column from sort', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();

    // Sort ascending
    await sortColumn(page, nameHeader, 'asc');
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

    // Clear sort
    await sortColumn(page, nameHeader, 'clear');
    await expect(nameHeader).toHaveAttribute('aria-sort', 'none');
  });

  test('sorting third column should add to existing multi-sort', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    const statusHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Status' }).first();
    const ageHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Age' }).first();

    // Build multi-sort: Name + Status + Age
    await sortColumn(page, nameHeader, 'asc');
    await sortColumn(page, statusHeader, 'asc');
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    await expect(statusHeader).toHaveAttribute('aria-sort', 'ascending');

    await sortColumn(page, ageHeader, 'asc');
    await expect(ageHeader).toHaveAttribute('aria-sort', 'ascending');
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    await expect(statusHeader).toHaveAttribute('aria-sort', 'ascending');
  });

  // ==================== Saved Configurations ====================

  test('no config buttons shown initially', async ({ page }) => {
    await page.evaluate(() => {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('datatable-configs:')) localStorage.removeItem(key);
      }
    });
    await page.reload({ waitUntil: 'networkidle' });
    const pg = await waitForPlayground(page);

    // No save or configurations button should be visible
    const saveBtn = pg.locator('[data-config-save-trigger]');
    const listBtn = pg.locator('[data-config-list-trigger]');
    await expect(saveBtn).toHaveCount(0);
    await expect(listBtn).toHaveCount(0);
  });

  test('save button appears after sorting', async ({ page }) => {
    await page.evaluate(() => {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('datatable-configs:')) localStorage.removeItem(key);
      }
    });
    await page.reload({ waitUntil: 'networkidle' });
    const pg = await waitForPlayground(page);

    // Sort a column to make state dirty
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    await sortColumn(page, nameHeader, 'asc');
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

    // Save button should now appear
    const saveBtn = pg.locator('[data-config-save-trigger]');
    await expect(saveBtn).toBeVisible();
  });

  test('save config flow: drawer opens, name entered, config saved', async ({ page }) => {
    await page.evaluate(() => {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('datatable-configs:')) localStorage.removeItem(key);
      }
    });
    await page.reload({ waitUntil: 'networkidle' });
    const pg = await waitForPlayground(page);

    // Sort to make dirty
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    await sortColumn(page, nameHeader, 'asc');

    // Click save button
    const saveBtn = pg.locator('[data-config-save-trigger]');
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();

    // Drawer should open with title
    const drawer = page.locator('text=Save configuration').first();
    await expect(drawer).toBeVisible();

    // Enter name and submit
    const nameInput = page.locator('input[placeholder="Enter a name..."]');
    await nameInput.fill('My Config');
    const submitBtn = page.locator('button').filter({ hasText: 'Save' }).last();
    await submitBtn.click();

    // Configurations button should now be visible
    const listBtn = pg.locator('[data-config-list-trigger]');
    await expect(listBtn).toBeVisible();
  });

  test('load config: save config, change sort, apply config restores state', async ({ page }) => {
    await page.evaluate(() => {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('datatable-configs:')) localStorage.removeItem(key);
      }
    });
    await page.reload({ waitUntil: 'networkidle' });
    const pg = await waitForPlayground(page);

    // Sort Name ascending and save config
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    await sortColumn(page, nameHeader, 'asc');
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

    const saveBtn = pg.locator('[data-config-save-trigger]');
    await saveBtn.click();
    const nameInput = page.locator('input[placeholder="Enter a name..."]');
    await nameInput.fill('Sorted by Name');
    const submitBtn = page.locator('button').filter({ hasText: 'Save' }).last();
    await submitBtn.click();

    // Clear the sort
    await sortColumn(page, nameHeader, 'clear');
    await expect(nameHeader).toHaveAttribute('aria-sort', 'none');

    // Open config list and click saved config
    const listBtn = pg.locator('[data-config-list-trigger]');
    await listBtn.click();
    const configOption = page.locator('[data-config-list]').locator('text=Sorted by Name');
    await configOption.click();

    // Name should be sorted ascending again
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
  });

  test('default option resets table state', async ({ page }) => {
    await page.evaluate(() => {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('datatable-configs:')) localStorage.removeItem(key);
      }
    });
    await page.reload({ waitUntil: 'networkidle' });
    const pg = await waitForPlayground(page);

    // Sort and save
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    await sortColumn(page, nameHeader, 'asc');

    const saveBtn = pg.locator('[data-config-save-trigger]');
    await saveBtn.click();
    const nameInput = page.locator('input[placeholder="Enter a name..."]');
    await nameInput.fill('Test Config');
    const submitBtn = page.locator('button').filter({ hasText: 'Save' }).last();
    await submitBtn.click();

    // Apply the saved config
    const listBtn = pg.locator('[data-config-list-trigger]');
    await listBtn.click();
    const configOption = page.locator('[data-config-list]').locator('text=Test Config');
    await configOption.click();
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

    // Click Default to reset
    await listBtn.click();
    const defaultOption = page.locator('[data-config-list]').locator('text=Default');
    await defaultOption.click();

    // Sort should be cleared
    await expect(nameHeader).toHaveAttribute('aria-sort', 'none');
  });

  test('edit config: rename via drawer', async ({ page }) => {
    await page.evaluate(() => {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('datatable-configs:')) localStorage.removeItem(key);
      }
    });
    await page.reload({ waitUntil: 'networkidle' });
    const pg = await waitForPlayground(page);

    // Sort and save config
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    await sortColumn(page, nameHeader, 'asc');
    const saveBtn = pg.locator('[data-config-save-trigger]');
    await saveBtn.click();
    const nameInput = page.locator('input[placeholder="Enter a name..."]');
    await nameInput.fill('Old Name');
    const submitBtn = page.locator('button').filter({ hasText: 'Save' }).last();
    await submitBtn.click();

    // Open config list and click edit icon
    const listBtn = pg.locator('[data-config-list-trigger]');
    await listBtn.click();
    const editBtn = page.locator('[data-config-list]').locator('button[aria-label="Edit Old Name"]');
    await editBtn.click();

    // Drawer should open with "Edit configuration" title
    const editTitle = page.locator('text=Edit configuration').first();
    await expect(editTitle).toBeVisible();

    // Change name and save
    const editInput = page.locator('input[placeholder="Enter a name..."]');
    await editInput.clear();
    await editInput.fill('New Name');
    const editSubmit = page.locator('button').filter({ hasText: 'Save' }).last();
    await editSubmit.click();

    // Config list should now show updated name
    await listBtn.click();
    const updatedConfig = page.locator('[data-config-list]').locator('text=New Name');
    await expect(updatedConfig).toBeVisible();
  });

  test('delete config with confirmation', async ({ page }) => {
    await page.evaluate(() => {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('datatable-configs:')) localStorage.removeItem(key);
      }
    });
    await page.reload({ waitUntil: 'networkidle' });
    const pg = await waitForPlayground(page);

    // Sort and save config
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    await sortColumn(page, nameHeader, 'asc');
    const saveBtn = pg.locator('[data-config-save-trigger]');
    await saveBtn.click();
    const nameInput = page.locator('input[placeholder="Enter a name..."]');
    await nameInput.fill('To Delete');
    const submitBtn = page.locator('button').filter({ hasText: 'Save' }).last();
    await submitBtn.click();

    // Open config list and edit
    const listBtn = pg.locator('[data-config-list-trigger]');
    await listBtn.click();
    const editBtn = page.locator('[data-config-list]').locator('button[aria-label="Edit To Delete"]');
    await editBtn.click();

    // Click delete button in drawer
    const deleteBtn = page.locator('button[aria-label="Delete"]');
    await deleteBtn.click();

    // Confirmation popover should appear
    const confirmText = page.locator('[data-config-delete-confirm]').locator('text=Confirm deletion?');
    await expect(confirmText).toBeVisible();

    // Confirm deletion
    const confirmDeleteBtn = page.locator('[data-config-delete-confirm]').locator('button').filter({ hasText: 'Delete' });
    await confirmDeleteBtn.click();

    // Config list button should be gone (no configs left)
    await expect(listBtn).toHaveCount(0);
  });

  test('maximum of 3 configurations limit', async ({ page }) => {
    await page.evaluate(() => {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('datatable-configs:')) localStorage.removeItem(key);
      }
    });
    await page.reload({ waitUntil: 'networkidle' });
    const pg = await waitForPlayground(page);

    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();

    // Save 3 configs — saveConfig auto-activates, so subsequent saves show
    // the choose screen; we click "Create new" to keep creating.
    // Alternate sort directions to ensure state changes between saves.
    const directions: Array<'asc' | 'desc'> = ['asc', 'desc', 'asc'];
    for (let i = 1; i <= 3; i++) {
      await sortColumn(page, nameHeader, directions[i - 1]);

      const saveBtn = pg.locator('[data-config-save-trigger]');
      await expect(saveBtn).toBeVisible();
      await saveBtn.click();
      await page.waitForTimeout(300);

      // If choose screen appears (config was active), click "Create new"
      const chooseCreate = page.locator('[data-config-choose-create]');
      if (await chooseCreate.count() > 0) {
        await chooseCreate.click();
        await page.waitForTimeout(300);
      }

      await page.locator('input[placeholder="Enter a name..."]').fill(`Config ${i}`);
      await page.locator('button').filter({ hasText: /^Save$/ }).last().click();
      await page.waitForTimeout(500);
    }

    // Config 3 is now active. Deactivate by selecting Default.
    const listBtn = pg.locator('[data-config-list-trigger]');
    await expect(listBtn).toBeVisible();
    await listBtn.click();
    await page.waitForTimeout(300);
    await page.locator('[data-config-list]').locator('text=Default').click();
    await page.waitForTimeout(300);

    // Sort again to make dirty (no active config)
    await sortColumn(page, nameHeader, 'asc');

    // Save button should NOT appear (at limit, no active config), limit message should show
    const saveBtn = pg.locator('[data-config-save-trigger]');
    await expect(saveBtn).toHaveCount(0);
    const limitMsg = pg.locator('text=Maximum of 3 configurations reached');
    await expect(limitMsg).toBeVisible();
  });

  test('configs persist after page reload', async ({ page }) => {
    await page.evaluate(() => {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('datatable-configs:')) localStorage.removeItem(key);
      }
    });
    await page.reload({ waitUntil: 'networkidle' });
    const pg = await waitForPlayground(page);

    // Sort and save config
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    await sortColumn(page, nameHeader, 'asc');
    const saveBtn = pg.locator('[data-config-save-trigger]');
    await saveBtn.click();
    const nameInput = page.locator('input[placeholder="Enter a name..."]');
    await nameInput.fill('Persistent Config');
    const submitBtn = page.locator('button').filter({ hasText: 'Save' }).last();
    await submitBtn.click();

    // Reload the page
    await page.reload({ waitUntil: 'networkidle' });
    const pg2 = await waitForPlayground(page);

    // Configurations button should still be visible
    const listBtn = pg2.locator('[data-config-list-trigger]');
    await expect(listBtn).toBeVisible();

    // Open and verify config is there
    await listBtn.click();
    const configOption = page.locator('[data-config-list]').locator('text=Persistent Config');
    await expect(configOption).toBeVisible();
  });

  // ==================== Config Button & Choose/Update Flow ====================

  test('config button shows active config name', async ({ page }) => {
    await page.evaluate(() => {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('datatable-configs:')) localStorage.removeItem(key);
      }
    });
    await page.reload({ waitUntil: 'networkidle' });
    const pg = await waitForPlayground(page);

    // Sort and save config
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    await sortColumn(page, nameHeader, 'asc');
    const saveBtn = pg.locator('[data-config-save-trigger]');
    await saveBtn.click();
    const nameInput = page.locator('input[placeholder="Enter a name..."]');
    await nameInput.fill('My View');
    const submitBtn = page.locator('button').filter({ hasText: 'Save' }).last();
    await submitBtn.click();
    await page.waitForTimeout(500);

    // saveConfig auto-activates — button should now show the active config name
    const listBtn = pg.locator('[data-config-list-trigger]');
    await expect(listBtn).toContainText('My View');
  });

  test('choose screen appears when dirty under active config', async ({ page }) => {
    await page.evaluate(() => {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('datatable-configs:')) localStorage.removeItem(key);
      }
    });
    await page.reload({ waitUntil: 'networkidle' });
    const pg = await waitForPlayground(page);

    // Sort, save, and apply config
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    await sortColumn(page, nameHeader, 'asc');
    const saveBtn = pg.locator('[data-config-save-trigger]');
    await saveBtn.click();
    const nameInput = page.locator('input[placeholder="Enter a name..."]');
    await nameInput.fill('Base Config');
    const submitBtn = page.locator('button').filter({ hasText: 'Save' }).last();
    await submitBtn.click();
    await page.waitForTimeout(300);

    // saveConfig auto-activates the config, so it's already applied
    // Make a change to become dirty (sort Status)
    const statusHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Status' }).first();
    await sortColumn(page, statusHeader, 'asc');

    // Click save → drawer should show choose screen
    const saveBtn2 = pg.locator('[data-config-save-trigger]');
    await expect(saveBtn2).toBeVisible();
    await saveBtn2.click();
    await page.waitForTimeout(300);

    // Choose screen should show both options
    const chooseScreen = page.locator('[data-config-choose]');
    await expect(chooseScreen).toBeVisible();
    const createOption = page.locator('[data-config-choose-create]');
    const updateOption = page.locator('[data-config-choose-update]');
    await expect(createOption).toBeVisible();
    await expect(updateOption).toBeVisible();
  });

  test('create new from choose screen shows form with back button', async ({ page }) => {
    await page.evaluate(() => {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('datatable-configs:')) localStorage.removeItem(key);
      }
    });
    await page.reload({ waitUntil: 'networkidle' });
    const pg = await waitForPlayground(page);

    // Sort, save, apply config
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    await sortColumn(page, nameHeader, 'asc');
    pg.locator('[data-config-save-trigger]').click();
    await page.waitForTimeout(300);
    await page.locator('input[placeholder="Enter a name..."]').fill('Config A');
    await page.locator('button').filter({ hasText: 'Save' }).last().click();
    await page.waitForTimeout(300);

    // Apply the config
    await pg.locator('[data-config-list-trigger]').locator('..').click();
    await page.waitForTimeout(300);
    await page.locator('[data-config-list]').locator('text=Config A').click();
    await page.waitForTimeout(300);

    // Sort Status to become dirty
    const statusHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Status' }).first();
    await sortColumn(page, statusHeader, 'asc');

    // Click save → choose screen
    await pg.locator('[data-config-save-trigger]').click();
    await page.waitForTimeout(300);

    // Click "Create new"
    await page.locator('[data-config-choose-create]').click();
    await page.waitForTimeout(300);

    // Form should appear with Back button (not Cancel)
    const nameInput = page.locator('input[placeholder="Enter a name..."]');
    await expect(nameInput).toBeVisible();
    const backBtn = page.locator('button').filter({ hasText: /^Back$/ });
    await expect(backBtn).toBeVisible();
  });

  test('back button returns to choose screen', async ({ page }) => {
    await page.evaluate(() => {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('datatable-configs:')) localStorage.removeItem(key);
      }
    });
    await page.reload({ waitUntil: 'networkidle' });
    const pg = await waitForPlayground(page);

    // Sort, save, apply config
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    await sortColumn(page, nameHeader, 'asc');
    await pg.locator('[data-config-save-trigger]').click();
    await page.waitForTimeout(300);
    await page.locator('input[placeholder="Enter a name..."]').fill('Config B');
    await page.locator('button').filter({ hasText: 'Save' }).last().click();
    await page.waitForTimeout(300);

    // Apply config
    await pg.locator('[data-config-list-trigger]').locator('..').click();
    await page.waitForTimeout(300);
    await page.locator('[data-config-list]').locator('text=Config B').click();
    await page.waitForTimeout(300);

    // Sort to dirty, open save drawer
    const statusHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Status' }).first();
    await sortColumn(page, statusHeader, 'asc');
    await pg.locator('[data-config-save-trigger]').click();
    await page.waitForTimeout(300);

    // Go to create form
    await page.locator('[data-config-choose-create]').click();
    await page.waitForTimeout(300);

    // Click Back
    await page.locator('button').filter({ hasText: /^Back$/ }).click();
    await page.waitForTimeout(300);

    // Choose screen should be visible again
    const chooseScreen = page.locator('[data-config-choose]');
    await expect(chooseScreen).toBeVisible();
  });

  test('update current config from choose screen', async ({ page }) => {
    await page.evaluate(() => {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('datatable-configs:')) localStorage.removeItem(key);
      }
    });
    await page.reload({ waitUntil: 'networkidle' });
    const pg = await waitForPlayground(page);

    // Sort Name asc and save config
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    await sortColumn(page, nameHeader, 'asc');
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    await pg.locator('[data-config-save-trigger]').click();
    await page.waitForTimeout(300);
    await page.locator('input[placeholder="Enter a name..."]').fill('Sortable');
    await page.locator('button').filter({ hasText: 'Save' }).last().click();
    await page.waitForTimeout(300);

    // Apply config
    await pg.locator('[data-config-list-trigger]').locator('..').click();
    await page.waitForTimeout(300);
    await page.locator('[data-config-list]').locator('text=Sortable').click();
    await page.waitForTimeout(300);

    // Add Status sort to make dirty
    const statusHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Status' }).first();
    await sortColumn(page, statusHeader, 'asc');
    await expect(statusHeader).toHaveAttribute('aria-sort', 'ascending');

    // Click save → choose screen → Update current
    await pg.locator('[data-config-save-trigger]').click();
    await page.waitForTimeout(300);
    await page.locator('[data-config-choose-update]').click();
    await page.waitForTimeout(300);

    // Drawer should close
    const chooseScreen = page.locator('[data-config-choose]');
    await expect(chooseScreen).toHaveCount(0);

    // Config should be updated — switch away and back to verify
    // Click Default to reset
    await pg.locator('[data-config-list-trigger]').locator('..').click();
    await page.waitForTimeout(300);
    await page.locator('[data-config-list]').locator('text=Default').click();
    await page.waitForTimeout(300);
    await expect(nameHeader).toHaveAttribute('aria-sort', 'none');
    await expect(statusHeader).toHaveAttribute('aria-sort', 'none');

    // Re-apply "Sortable" — should now have both Name+Status sorts
    await pg.locator('[data-config-list-trigger]').locator('..').click();
    await page.waitForTimeout(300);
    await page.locator('[data-config-list]').locator('text=Sortable').click();
    await page.waitForTimeout(300);
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    await expect(statusHeader).toHaveAttribute('aria-sort', 'ascending');
  });

  test('save button visible at limit when config is active', async ({ page }) => {
    await page.evaluate(() => {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('datatable-configs:')) localStorage.removeItem(key);
      }
    });
    await page.reload({ waitUntil: 'networkidle' });
    const pg = await waitForPlayground(page);

    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();

    // Save 3 configs — saveConfig auto-activates, so subsequent saves show
    // the choose screen; we click "Create new" to keep creating.
    // Alternate sort directions to ensure state changes between saves.
    const dirs: Array<'asc' | 'desc'> = ['asc', 'desc', 'asc'];
    for (let i = 1; i <= 3; i++) {
      await sortColumn(page, nameHeader, dirs[i - 1]);
      await pg.locator('[data-config-save-trigger]').click();
      await page.waitForTimeout(300);

      const chooseCreate = page.locator('[data-config-choose-create]');
      if (await chooseCreate.count() > 0) {
        await chooseCreate.click();
        await page.waitForTimeout(300);
      }

      await page.locator('input[placeholder="Enter a name..."]').fill(`Cfg ${i}`);
      await page.locator('button').filter({ hasText: /^Save$/ }).last().click();
      await page.waitForTimeout(500);
    }

    // Cfg 3 is active. Apply Cfg 1 instead.
    const listBtn = pg.locator('[data-config-list-trigger]');
    await expect(listBtn).toBeVisible();
    await listBtn.click();
    await page.waitForTimeout(300);
    await page.locator('[data-config-list]').locator('text=Cfg 1').click();
    await page.waitForTimeout(300);

    // Sort to make dirty
    const statusHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Status' }).first();
    await sortColumn(page, statusHeader, 'asc');

    // Save button should be visible (can update current, even at limit)
    const saveBtn = pg.locator('[data-config-save-trigger]');
    await expect(saveBtn).toBeVisible();

    // Limit message should NOT show
    const limitMsg = pg.locator('text=Maximum of 3 configurations reached');
    await expect(limitMsg).toHaveCount(0);

    // Click save → choose screen should only show "Update" (no "Create new" since at limit)
    await saveBtn.click();
    await page.waitForTimeout(300);
    const createOption = page.locator('[data-config-choose-create]');
    const updateOption = page.locator('[data-config-choose-update]');
    await expect(createOption).toHaveCount(0);
    await expect(updateOption).toBeVisible();
  });

  // ==================== Column Resizing ====================

  test('resize separator should be visible on header hover', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const nameHeader = pg
      .locator('[role="columnheader"]')
      .filter({ hasText: 'Name' })
      .first();
    const separator = nameHeader.locator('[role="separator"]');
    await expect(separator).toBeAttached();
    // Separator is hidden by default (opacity-0)
    await expect(separator).toHaveCSS('opacity', '0');
    // Hover the header cell to reveal it
    await nameHeader.hover();
    await expect(separator).not.toHaveCSS('opacity', '0');
  });

  test('dragging resize separator should change column width', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const nameHeader = pg
      .locator('[role="columnheader"]')
      .filter({ hasText: 'Name' })
      .first();
    const initialWidth = (await nameHeader.boundingBox())!.width;

    // Hover to reveal separator, then drag it
    await nameHeader.hover();
    const separator = nameHeader.locator('[role="separator"]');
    const sepBox = (await separator.boundingBox())!;
    const startX = sepBox.x + sepBox.width / 2;
    const startY = sepBox.y + sepBox.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 200, startY, { steps: 5 });
    await page.mouse.up();
    // Wait for grid style to recompute (double-rAF)
    await page.waitForTimeout(200);

    const newWidth = (await nameHeader.boundingBox())!.width;
    expect(newWidth).toBeGreaterThan(initialWidth + 100);
  });

  test('double-clicking resize separator should reset column width', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const nameHeader = pg
      .locator('[role="columnheader"]')
      .filter({ hasText: 'Name' })
      .first();
    const initialWidth = (await nameHeader.boundingBox())!.width;

    // Resize the column wider
    await nameHeader.hover();
    const separator = nameHeader.locator('[role="separator"]');
    const sepBox = (await separator.boundingBox())!;
    const startX = sepBox.x + sepBox.width / 2;
    const startY = sepBox.y + sepBox.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 200, startY, { steps: 5 });
    await page.mouse.up();

    const resizedWidth = (await nameHeader.boundingBox())!.width;
    expect(resizedWidth).toBeGreaterThan(initialWidth + 100);

    // Double-click the separator to reset
    await nameHeader.hover();
    const newSepBox = (await separator.boundingBox())!;
    await page.mouse.dblclick(
      newSepBox.x + newSepBox.width / 2,
      newSepBox.y + newSepBox.height / 2,
    );
    // Wait for grid style to recompute (double-rAF)
    await page.waitForTimeout(200);

    // Width should return close to the initial size
    const resetWidth = (await nameHeader.boundingBox())!.width;
    expect(Math.abs(resetWidth - initialWidth)).toBeLessThan(20);
  });

  test('resized column width should apply to body cells too', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const nameHeader = pg
      .locator('[role="columnheader"]')
      .filter({ hasText: 'Name' })
      .first();

    // Resize Name column
    await nameHeader.hover();
    const separator = nameHeader.locator('[role="separator"]');
    const sepBox = (await separator.boundingBox())!;
    const startX = sepBox.x + sepBox.width / 2;
    const startY = sepBox.y + sepBox.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 200, startY, { steps: 5 });
    await page.mouse.up();
    // Wait for grid style to recompute (double-rAF)
    await page.waitForTimeout(200);

    // Header and body cell should have the same width (shared grid-template-columns)
    const headerWidth = (await nameHeader.boundingBox())!.width;
    const firstNameCell = pg
      .locator('[role="row"]')
      .nth(1)
      .locator('[role="cell"]')
      .filter({ hasText: 'John Doe' });
    const cellWidth = (await firstNameCell.boundingBox())!.width;
    expect(Math.abs(headerWidth - cellWidth)).toBeLessThan(5);
  });

  // ==================== Row Locking ====================

  test('row lock overlay should not appear while row is fully visible', async ({ page }) => {
    const pg = await waitForPlayground(page);

    // Expand the table so virtualization kicks in
    const seeMoreBtn = pg.locator('button').filter({ hasText: 'See more' }).first();
    await seeMoreBtn.scrollIntoViewIfNeeded();
    await seeMoreBtn.click();
    await page.waitForTimeout(500);

    // Find the first data row and hover to reveal the lock icon
    const firstRow = pg.locator('[role="row"][data-row-index="0"]');
    await firstRow.scrollIntoViewIfNeeded();
    await firstRow.hover();
    await page.waitForTimeout(200);

    // Click the lock button
    const lockBtn = firstRow.locator('..').locator('button[aria-pressed]');
    await lockBtn.click();
    await page.waitForTimeout(300);

    // Take screenshot — the overlay should NOT be visible (row is in view)
    const table = pg.locator('[role="table"]').first();
    await table.screenshot({ path: 'e2e/screenshots/row-lock-visible.png' });

    // The overlay should not be rendered (row is fully visible)
    const overlay = pg.locator('[data-locked-overlay]');
    await expect(overlay).toHaveCount(0);
  });

  test('row lock overlay pins to top when scrolled past', async ({ page }) => {
    const pg = await waitForPlayground(page);

    // Expand the table
    const seeMoreBtn = pg.locator('button').filter({ hasText: 'See more' }).first();
    await seeMoreBtn.scrollIntoViewIfNeeded();
    await seeMoreBtn.click();
    await page.waitForTimeout(500);

    // Lock the first row
    const firstRow = pg.locator('[role="row"][data-row-index="0"]');
    await firstRow.scrollIntoViewIfNeeded();
    await firstRow.hover();
    await page.waitForTimeout(200);
    const lockBtn = firstRow.locator('..').locator('button[aria-pressed]');
    await lockBtn.click();
    await page.waitForTimeout(300);

    // Scroll the virtual container down so row 0 is out of view
    const scrollContainer = pg.locator('[role="rowgroup"]').last().locator('div[style*="overflow"]').first();
    await scrollContainer.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    await page.waitForTimeout(500);

    // Take screenshot
    const table = pg.locator('[role="table"]').first();
    await table.screenshot({ path: 'e2e/screenshots/row-lock-pinned-top.png' });

    // The overlay should be visible
    const overlay = pg.locator('[data-locked-overlay]');
    await expect(overlay).toBeVisible();
  });

  test('row lock overlay pins to bottom when row is below viewport', async ({ page }) => {
    const pg = await waitForPlayground(page);

    // Expand the table
    const seeMoreBtn = pg.locator('button').filter({ hasText: 'See more' }).first();
    await seeMoreBtn.scrollIntoViewIfNeeded();
    await seeMoreBtn.click();
    await page.waitForTimeout(500);

    // Scroll down first to see a later row
    const scrollContainer = pg.locator('[role="rowgroup"]').last().locator('div[style*="overflow"]').first();
    await scrollContainer.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    await page.waitForTimeout(500);

    // Lock the last visible row
    const lastRow = pg.locator('[role="row"][data-row-index]').last();
    await lastRow.hover();
    await page.waitForTimeout(200);
    const lockBtn = lastRow.locator('..').locator('button[aria-pressed]');
    await lockBtn.click();
    await page.waitForTimeout(300);

    // Scroll back to the top so the locked row is below the viewport
    await scrollContainer.evaluate((el) => {
      el.scrollTop = 0;
    });
    await page.waitForTimeout(500);

    // Take screenshot
    const table = pg.locator('[role="table"]').first();
    await table.screenshot({ path: 'e2e/screenshots/row-lock-pinned-bottom.png' });

    // The overlay should be visible (pinned to bottom)
    const overlay = pg.locator('[data-locked-overlay]');
    await expect(overlay).toBeVisible();
  });

  // ==================== Column Locking ====================

  test('column lock icon should appear on header hover and toggle sticky', async ({ page }) => {
    const pg = await waitForPlayground(page);

    // Expand so we get the full wide table with horizontal scroll
    const seeMoreBtn = pg.locator('button').filter({ hasText: 'See more' }).first();
    await seeMoreBtn.scrollIntoViewIfNeeded();
    await seeMoreBtn.click();
    await page.waitForTimeout(500);

    // Hover the Name column header to reveal the lock icon
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    await nameHeader.hover();
    await page.waitForTimeout(300);

    // Click the column lock button
    const colLockBtn = nameHeader.locator('button[aria-pressed]');
    await expect(colLockBtn).toBeVisible();
    await colLockBtn.click();
    await page.waitForTimeout(300);

    // The column should have the dashed border indicator
    await expect(nameHeader).toHaveCSS('border-left-style', 'dashed');

    // Take screenshot before horizontal scroll
    const table = pg.locator('[role="table"]').first();
    await table.screenshot({ path: 'e2e/screenshots/column-lock-before-scroll.png' });

    // Scroll horizontally
    const hScrollContainer = pg.locator('div.overflow-x-auto:has([role="table"])').first();
    await hScrollContainer.evaluate((el) => { el.scrollLeft = 300; });
    await page.waitForTimeout(300);

    // Take screenshot after horizontal scroll — Name column should stay sticky
    await table.screenshot({ path: 'e2e/screenshots/column-lock-after-hscroll.png' });
  });

  test('column lock + row lock work together', async ({ page }) => {
    const pg = await waitForPlayground(page);

    // Expand
    const seeMoreBtn = pg.locator('button').filter({ hasText: 'See more' }).first();
    await seeMoreBtn.scrollIntoViewIfNeeded();
    await seeMoreBtn.click();
    await page.waitForTimeout(500);

    // Lock the Name column
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    await nameHeader.hover();
    await page.waitForTimeout(200);
    const colLockBtn = nameHeader.locator('button[aria-pressed]');
    await colLockBtn.click();
    await page.waitForTimeout(300);

    // Lock the first data row
    const firstRow = pg.locator('[role="row"][data-row-index="0"]');
    await firstRow.scrollIntoViewIfNeeded();
    await firstRow.hover();
    await page.waitForTimeout(200);
    const rowLockBtn = firstRow.locator('..').locator('button[aria-pressed]');
    await rowLockBtn.click();
    await page.waitForTimeout(300);

    // Scroll down so the locked row pins to top
    const scrollContainer = pg.locator('[role="rowgroup"]').last().locator('div[style*="overflow"]').first();
    await scrollContainer.evaluate((el) => { el.scrollTop = el.scrollHeight; });
    await page.waitForTimeout(500);

    // Take screenshot — row pinned to top + column lock indicator
    const table = pg.locator('[role="table"]').first();
    await table.screenshot({ path: 'e2e/screenshots/column-row-lock-vscroll.png' });

    // Now also scroll horizontally
    const hScrollContainer = pg.locator('div.overflow-x-auto:has([role="table"])').first();
    await hScrollContainer.evaluate((el) => { el.scrollLeft = 300; });
    await page.waitForTimeout(300);

    // Take screenshot — both locks active
    await table.screenshot({ path: 'e2e/screenshots/column-row-lock-both-scroll.png' });

    // Overlay should still be visible
    const overlay = pg.locator('[data-locked-overlay]');
    await expect(overlay).toBeVisible();
  });

  test('column lock: sticky cell stays aligned during horizontal scroll steps', async ({ page }) => {
    const pg = await waitForPlayground(page);

    // Expand table
    const seeMoreBtn = pg.locator('button').filter({ hasText: 'See more' }).first();
    await seeMoreBtn.scrollIntoViewIfNeeded();
    await seeMoreBtn.click();
    await page.waitForTimeout(500);

    // Lock the Name column
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    await nameHeader.hover();
    await page.waitForTimeout(200);
    const colLockBtn = nameHeader.locator('button[aria-pressed]');
    await colLockBtn.click();
    await page.waitForTimeout(300);

    const hScroll = pg.locator('div.overflow-x-auto:has([role="table"])').first();

    // Scroll in steps, take screenshot at each and verify sticky cell alignment
    const positions = [100, 200, 300, 400];
    for (let i = 0; i < positions.length; i++) {
      await hScroll.evaluate((el, pos) => { el.scrollLeft = pos; }, positions[i]);
      await page.waitForTimeout(150);
    }

    // Final screenshot at max scroll
    const table = pg.locator('[role="table"]').first();
    await table.screenshot({ path: 'e2e/screenshots/column-lock-scroll-steps.png' });

    // Verify the sticky Name header cell is still visible and within the viewport
    const hScrollBox = await hScroll.boundingBox();
    const nameBox = await nameHeader.boundingBox();
    expect(nameBox).toBeTruthy();
    // The Name cell's left edge should be at or near the scroll container's left edge
    expect(nameBox!.x).toBeGreaterThanOrEqual(hScrollBox!.x - 2);
    expect(nameBox!.x).toBeLessThan(hScrollBox!.x + hScrollBox!.width);
  });
});
