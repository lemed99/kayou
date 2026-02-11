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

    const popover = page.locator('[data-filter-popover]').first();
    await expect(popover).toBeVisible();
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

  // ==================== Pagination ====================

  test('should render pagination controls', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const pagination = pg.locator('nav[aria-label="Page"]').first();
    await expect(pagination).toBeVisible();
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
    const sortButton = nameHeader.locator('button');
    await expect(sortButton).toBeVisible();
  });

  test('should update aria-sort on column header click', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    await expect(nameHeader).toBeVisible();

    // Initially no sort
    await expect(nameHeader).toHaveAttribute('aria-sort', 'none');

    // Click to sort ascending
    const sortButton = nameHeader.locator('button');
    await sortButton.click();
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

    // Click again for descending
    await sortButton.click();
    await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');

    // Click again to clear sort (back to none)
    await sortButton.click();
    await expect(nameHeader).toHaveAttribute('aria-sort', 'none');
  });

  test('non-sortable columns should not have sort button', async ({ page }) => {
    const pg = await waitForPlayground(page);
    // Email column is not in sortableColumns in the demo
    const emailHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Email' }).first();
    await expect(emailHeader).toBeVisible();

    const sortButton = emailHeader.locator('button');
    await expect(sortButton).toHaveCount(0);
  });

  // ==================== Multi-Sort ====================

  test('clicking another column should add it to the sort stack', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    const statusHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Status' }).first();

    // Click Name to sort ascending
    await nameHeader.locator('button').click();
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

    // Click Status to add to sort
    await statusHeader.locator('button').click();
    await expect(statusHeader).toHaveAttribute('aria-sort', 'ascending');

    // Name should still be sorted
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
  });

  test('priority badges should appear with multi-sort', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    const statusHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Status' }).first();

    // Click Name, then click Status
    await nameHeader.locator('button').click();
    await statusHeader.locator('button').click();

    // Priority badges should be visible
    const badge1 = nameHeader.locator('[data-sort-priority="1"]');
    const badge2 = statusHeader.locator('[data-sort-priority="2"]');
    await expect(badge1).toBeVisible();
    await expect(badge2).toBeVisible();
    await expect(badge1).toHaveText('1');
    await expect(badge2).toHaveText('2');
  });

  test('clicking sorted column should cycle to descending', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();

    // Click Name (ascending)
    await nameHeader.locator('button').click();
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

    // Click Name again to cycle to descending
    await nameHeader.locator('button').click();
    await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
  });

  test('third click should remove column from sort', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();

    // Click Name (ascending)
    await nameHeader.locator('button').click();
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

    // Click again → descending
    await nameHeader.locator('button').click();
    await expect(nameHeader).toHaveAttribute('aria-sort', 'descending');

    // Click again → removed
    await nameHeader.locator('button').click();
    await expect(nameHeader).toHaveAttribute('aria-sort', 'none');
  });

  test('clicking third column should add to existing multi-sort', async ({ page }) => {
    const pg = await waitForPlayground(page);
    const nameHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Name' }).first();
    const statusHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Status' }).first();
    const ageHeader = pg.locator('[role="columnheader"]').filter({ hasText: 'Age' }).first();

    // Build multi-sort: Name + Status
    await nameHeader.locator('button').click();
    await statusHeader.locator('button').click();
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    await expect(statusHeader).toHaveAttribute('aria-sort', 'ascending');

    // Click Age to add as third sort column
    await ageHeader.scrollIntoViewIfNeeded();
    await ageHeader.locator('button').click();
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
    await nameHeader.locator('button').click();
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
    await nameHeader.locator('button').click();

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
    await nameHeader.locator('button').click();
    await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');

    const saveBtn = pg.locator('[data-config-save-trigger]');
    await saveBtn.click();
    const nameInput = page.locator('input[placeholder="Enter a name..."]');
    await nameInput.fill('Sorted by Name');
    const submitBtn = page.locator('button').filter({ hasText: 'Save' }).last();
    await submitBtn.click();

    // Change sort: click Name twice more (desc → none)
    await nameHeader.locator('button').click();
    await nameHeader.locator('button').click();
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
    await nameHeader.locator('button').click();

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
    await nameHeader.locator('button').click();
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
    await nameHeader.locator('button').click();
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

    // Save 3 configs
    for (let i = 1; i <= 3; i++) {
      // Sort to make dirty
      await nameHeader.locator('button').click();

      const saveBtn = pg.locator('[data-config-save-trigger]');
      await expect(saveBtn).toBeVisible();
      await saveBtn.click();

      const nameInput = page.locator('input[placeholder="Enter a name..."]');
      await nameInput.fill(`Config ${i}`);
      const submitBtn = page.locator('button').filter({ hasText: 'Save' }).last();
      await submitBtn.click();

      // Wait for drawer to close
      await page.waitForTimeout(300);
    }

    // Sort again to make dirty
    await nameHeader.locator('button').click();

    // Save button should NOT appear (at limit), limit message should show
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
    await nameHeader.locator('button').click();
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
});
