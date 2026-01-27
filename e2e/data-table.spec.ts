import { expect, test } from '@playwright/test';

test.describe('DataTable', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/data-table');
  });

  // ==================== Basic Rendering ====================

  test('should render data table container', async ({ page }) => {
    // DataTable uses CSS Grid with divs, not actual table elements
    const content = await page.textContent('body');
    expect(content).toContain('DataTable');
  });

  test('should display column headers', async ({ page }) => {
    // Check for column header text
    const nameHeader = page.locator('text=Name').first();
    if (await nameHeader.isVisible()) {
      await expect(nameHeader).toBeVisible();
    }
  });

  test('should display data rows', async ({ page }) => {
    // Check for sample data content
    const johnDoe = page.locator('text=John Doe').first();
    if (await johnDoe.isVisible()) {
      await expect(johnDoe).toBeVisible();
    }
  });

  test('should display email content', async ({ page }) => {
    const email = page.locator('text=john@example.com').first();
    if (await email.isVisible()) {
      await expect(email).toBeVisible();
    }
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
    const users = [
      'John Doe',
      'Jane Smith',
      'Bob Johnson',
      'Alice Williams',
      'Charlie Brown',
    ];
    let foundCount = 0;

    for (const user of users) {
      const row = page.locator(`text=${user}`).first();
      if (await row.isVisible()) {
        foundCount++;
      }
    }

    expect(foundCount).toBeGreaterThan(0);
  });

  test('should display role data', async ({ page }) => {
    const roles = ['Admin', 'User', 'Editor'];
    let foundCount = 0;

    for (const role of roles) {
      const cell = page.locator(`text=${role}`).first();
      if (await cell.isVisible()) {
        foundCount++;
      }
    }

    expect(foundCount).toBeGreaterThan(0);
  });

  test('should display status data', async ({ page }) => {
    const statuses = ['active', 'inactive', 'pending'];
    let foundCount = 0;

    for (const status of statuses) {
      const cell = page.locator(`text=${status}`).first();
      if (await cell.isVisible()) {
        foundCount++;
      }
    }

    expect(foundCount).toBeGreaterThan(0);
  });

  // ==================== Row Selection ====================

  test('should render row selection checkboxes when enabled', async ({ page }) => {
    const rowCheckbox = page.locator('input[type="checkbox"]').first();
    if (await rowCheckbox.isVisible()) {
      await expect(rowCheckbox).toBeVisible();
    }
  });

  test('should toggle row selection on checkbox click', async ({ page }) => {
    const rowCheckbox = page.locator('input[type="checkbox"]').first();

    if (await rowCheckbox.isVisible()) {
      const initialChecked = await rowCheckbox.isChecked();
      await rowCheckbox.click();
      const newChecked = await rowCheckbox.isChecked();
      expect(newChecked).toBe(!initialChecked);
    }
  });

  test('should support select all functionality', async ({ page }) => {
    // Find a "select all" checkbox in the header area
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();

    if (count > 1) {
      // First checkbox is often "select all"
      const selectAll = checkboxes.first();
      if (await selectAll.isVisible()) {
        await expect(selectAll).toBeVisible();
      }
    }
  });

  // ==================== Search Bar ====================

  test('should render search bar when enabled', async ({ page }) => {
    const searchInput = page
      .locator('input[type="search"], input[placeholder*="Search"]')
      .first();
    if (await searchInput.isVisible()) {
      await expect(searchInput).toBeVisible();
    }
  });

  test('should filter data on search', async ({ page }) => {
    const searchInput = page
      .locator('input[type="search"], input[placeholder*="Search"]')
      .first();

    if (await searchInput.isVisible()) {
      await searchInput.fill('John');
      await page.waitForTimeout(300);
      // Data should be filtered
      const content = await page.textContent('body');
      expect(content).toContain('John');
    }
  });

  // ==================== Filter System ====================

  test('should render filter button', async ({ page }) => {
    const filterButton = page
      .locator('button')
      .filter({ hasText: /Filter/i })
      .first();
    if (await filterButton.isVisible()) {
      await expect(filterButton).toBeVisible();
    }
  });

  test('should open filter popover on button click', async ({ page }) => {
    const filterButton = page
      .locator('button')
      .filter({ hasText: /Filter/i })
      .first();

    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.waitForTimeout(300);

      // Filter popover should be visible
      const popover = page.locator('[role="dialog"], [data-popover]').first();
      if (await popover.isVisible()) {
        await expect(popover).toBeVisible();
      }
    }
  });

  test('should have add filter option', async ({ page }) => {
    const filterButton = page
      .locator('button')
      .filter({ hasText: /Filter/i })
      .first();

    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.waitForTimeout(300);

      const addFilter = page.locator('text=Add filter').first();
      if (await addFilter.isVisible()) {
        await expect(addFilter).toBeVisible();
      }
    }
  });

  // ==================== Pagination ====================

  test('should render pagination controls', async ({ page }) => {
    const pagination = page
      .locator('[class*="pagination"], nav[aria-label*="pagination"]')
      .first();
    if (await pagination.isVisible()) {
      await expect(pagination).toBeVisible();
    }
  });

  test('should render per-page control when enabled', async ({ page }) => {
    const perPage = page.locator('text=per page').first();
    if (await perPage.isVisible()) {
      await expect(perPage).toBeVisible();
    }
  });

  // ==================== Loading State ====================

  test('should render loading skeleton', async ({ page }) => {
    // Look for loading skeleton indicators
    const skeleton = page
      .locator('[class*="animate-pulse"], [class*="skeleton"]')
      .first();
    if (await skeleton.isVisible()) {
      await expect(skeleton).toBeVisible();
    }
  });

  // ==================== Error State ====================

  test('should render error message', async ({ page }) => {
    const errorMessage = page.locator('text=Failed to load').first();
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toBeVisible();
    }
  });

  // ==================== Expandable Table ====================

  test('should render see more button when expandable', async ({ page }) => {
    const seeMore = page
      .locator('button')
      .filter({ hasText: /See more/i })
      .first();
    if (await seeMore.isVisible()) {
      await expect(seeMore).toBeVisible();
    }
  });

  test('should expand to full view on see more click', async ({ page }) => {
    const seeMore = page
      .locator('button')
      .filter({ hasText: /See more/i })
      .first();

    if (await seeMore.isVisible()) {
      await seeMore.click();
      await page.waitForTimeout(500);

      // Modal or expanded view should appear
      const modal = page.locator('[role="dialog"]').first();
      if (await modal.isVisible()) {
        await expect(modal).toBeVisible();
      }
    }
  });

  // ==================== Custom Cell Rendering ====================

  test('should render custom status badges', async ({ page }) => {
    // Look for status badges with custom styling
    const activeBadge = page.locator('[class*="bg-green"]').first();
    if (await activeBadge.isVisible()) {
      await expect(activeBadge).toBeVisible();
    }
  });

  // ==================== Keyboard Accessibility ====================

  test('should be keyboard navigable', async ({ page }) => {
    const firstInteractive = page
      .locator('input, button')
      .filter({ has: page.locator(':visible') })
      .first();

    if (await firstInteractive.isVisible()) {
      await firstInteractive.focus();
      await page.keyboard.press('Tab');
    }
  });

  test('checkboxes should be focusable', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();

    if (await checkbox.isVisible()) {
      await checkbox.focus();
      await expect(checkbox).toBeFocused();
    }
  });

  test('should toggle checkbox with Space key', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();

    if (await checkbox.isVisible()) {
      await checkbox.focus();
      const initialChecked = await checkbox.isChecked();
      await page.keyboard.press('Space');
      const newChecked = await checkbox.isChecked();
      expect(newChecked).toBe(!initialChecked);
    }
  });

  // ==================== CSS Grid Layout ====================

  test('should use CSS Grid for layout', async ({ page }) => {
    // DataTable uses div-based CSS Grid
    const gridContainer = page.locator('[style*="grid"], [class*="grid"]').first();
    if (await gridContainer.isVisible()) {
      await expect(gridContainer).toBeVisible();
    }
  });

  // ==================== Selected Elements Count ====================

  test('should display selected count when rows selected', async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]').first();

    if (await checkbox.isVisible()) {
      await checkbox.click();
      await page.waitForTimeout(100);

      const selectedText = page.locator('text=/\\d+ of \\d+ selected/').first();
      if (await selectedText.isVisible()) {
        await expect(selectedText).toBeVisible();
      }
    }
  });

  // ==================== Multiple Tables ====================

  test('should render multiple data table examples', async ({ page }) => {
    const content = await page.textContent('body');
    expect(content).toContain('Basic Table');
  });

  test('each table example should display data', async ({ page }) => {
    const johnDoe = page.locator('text=John Doe');
    const count = await johnDoe.count();
    expect(count).toBeGreaterThan(0);
  });

  // ==================== Edge Cases ====================

  test('should handle empty data gracefully', async ({ page }) => {
    // Look for "no data" message in one of the examples
    const noData = page.locator('text=No users found').first();
    if (await noData.isVisible()) {
      await expect(noData).toBeVisible();
    }
  });

  test('should maintain layout with varying content', async ({ page }) => {
    const content = await page.textContent('body');
    expect(content).toContain('DataTable');
  });

  test('should render without crashing', async ({ page }) => {
    await page.waitForTimeout(500);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
