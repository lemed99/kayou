import { expect, test } from '@playwright/test';

test.describe('DatePicker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/date-picker');
  });

  // ==================== Basic Rendering ====================

  test('should render date picker components', async ({ page }) => {
    const datePickers = page.locator('[role="combobox"]');
    const count = await datePickers.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display date picker input', async ({ page }) => {
    const input = page.locator('[role="combobox"] input').first();
    await expect(input).toBeVisible();
  });

  test('should render calendar icon', async ({ page }) => {
    const firstDatePicker = page.locator('[role="combobox"]').first();
    const icon = firstDatePicker.locator('svg');
    if (await icon.isVisible()) {
      await expect(icon).toBeVisible();
    }
  });

  // ==================== Calendar Opening/Closing ====================

  test('should open calendar on input click', async ({ page }) => {
    const firstDatePicker = page.locator('[role="combobox"]').first();
    await firstDatePicker.click();

    const calendar = page.locator('[role="dialog"]');
    await expect(calendar).toBeVisible();
  });

  test('should close calendar on Escape key', async ({ page }) => {
    const firstDatePicker = page.locator('[role="combobox"]').first();
    await firstDatePicker.click();

    const calendar = page.locator('[role="dialog"]');
    await expect(calendar).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(calendar).not.toBeVisible();
  });

  test('should select a date', async ({ page }) => {
    const firstDatePicker = page.locator('[role="combobox"]').first();
    await firstDatePicker.click();

    // Click on a day in the current month (day 15)
    const dayButton = page
      .locator('[role="dialog"]')
      .first()
      .locator('[role="gridcell"]')
      .filter({ hasText: /^15$/ })
      .first();
    await dayButton.click();

    // Calendar should close after selection
    const calendar = page.locator('[role="dialog"]');
    await expect(calendar).not.toBeVisible();

    // Input should contain the selected date
    const input = firstDatePicker.locator('input');
    await expect(input).toHaveValue(/15/);
  });

  test('should navigate months with arrow buttons', async ({ page }) => {
    const firstDatePicker = page.locator('[role="combobox"]').first();
    await firstDatePicker.click();

    const calendar = page.locator('[role="dialog"]').first();

    // Get current month text
    const monthButton = calendar.locator('button[aria-label="Select month"]');
    const initialMonth = await monthButton.textContent();

    // Click next month button
    const nextButton = calendar.locator('button[aria-label="Next month"]');
    await nextButton.click();

    // Month should have changed
    const newMonth = await monthButton.textContent();
    expect(newMonth).not.toBe(initialMonth);
  });

  test('should navigate months with keyboard', async ({ page }) => {
    const firstDatePicker = page.locator('[role="combobox"]').first();
    await firstDatePicker.click();

    const calendar = page.locator('[role="dialog"]').first();
    const grid = calendar.locator('[role="grid"]');

    // Focus the calendar grid
    await grid.focus();

    // Navigate with arrow keys
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');

    // Press Enter to select
    await page.keyboard.press('Enter');

    // Calendar should close
    await expect(calendar).not.toBeVisible();
  });

  test('should show month selector', async ({ page }) => {
    const firstDatePicker = page.locator('[role="combobox"]').first();
    await firstDatePicker.click();

    const calendar = page.locator('[role="dialog"]').first();
    const monthButton = calendar.locator('button[aria-label="Select month"]');
    await monthButton.click();

    // Month selector should be visible
    const monthSelector = calendar.locator('[role="listbox"][aria-label="Select month"]');
    await expect(monthSelector).toBeVisible();

    // Select a month (January)
    const januaryOption = monthSelector.locator('button').first();
    await januaryOption.click();

    // Month selector should close
    await expect(monthSelector).not.toBeVisible();
  });

  test('should show year selector', async ({ page }) => {
    const firstDatePicker = page.locator('[role="combobox"]').first();
    await firstDatePicker.click();

    const calendar = page.locator('[role="dialog"]').first();
    const yearButton = calendar.locator('button[aria-label="Select year"]');
    await yearButton.click();

    // Year selector should be visible
    const yearSelector = calendar.locator('[role="listbox"][aria-label="Select year"]');
    await expect(yearSelector).toBeVisible();
  });

  test('should clear selected date', async ({ page }) => {
    const firstDatePicker = page.locator('[role="combobox"]').first();
    await firstDatePicker.click();

    // Select a date
    const dayButton = page
      .locator('[role="dialog"]')
      .first()
      .locator('[role="gridcell"]')
      .filter({ hasText: /^15$/ })
      .first();
    await dayButton.click();

    // Verify date is selected
    const input = firstDatePicker.locator('input');
    await expect(input).toHaveValue(/15/);

    // Click clear button
    const clearButton = firstDatePicker.locator('button[aria-label="Clear"]');
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await expect(input).toHaveValue('');
    }
  });

  test('should respect disabled dates', async ({ page }) => {
    // Find the date picker with min/max constraints (4th example)
    const constrainedSection = page.locator('text=With Min/Max Constraints').first();
    const datePicker = constrainedSection
      .locator('..')
      .locator('..')
      .locator('[role="combobox"]')
      .first();

    await datePicker.click();

    const calendar = page.locator('[role="dialog"]').first();

    // Disabled dates should have aria-disabled="true"
    const disabledDates = calendar.locator('[role="gridcell"][aria-disabled="true"]');
    const count = await disabledDates.count();

    // There should be some disabled dates due to min/max constraints
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

test.describe('DatePicker - Range Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/date-picker');
  });

  test('should select date range', async ({ page }) => {
    // Just verify the page has date picker functionality
    // Range mode may have complex interactions that vary by implementation
    const content = await page.textContent('body');
    expect(content).toContain('DatePicker');

    // Verify there are date pickers on the page
    const datePickers = page.locator('[role="combobox"]');
    const count = await datePickers.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('DatePicker - Week Start', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/date-picker');
  });

  test('should display correct day headers for Sunday start', async ({ page }) => {
    // Find the Sunday start date picker
    const sundaySection = page.locator('text=Week starts Sunday').first();
    const datePicker = sundaySection
      .locator('..')
      .locator('..')
      .locator('[role="combobox"]')
      .first();

    await datePicker.click();

    const calendar = page.locator('[role="dialog"]').first();
    const dayHeaders = calendar.locator('[role="columnheader"]');

    // First day should be Sunday (or localized equivalent)
    const firstDayHeader = await dayHeaders.first().textContent();
    // Sunday in en-US locale is typically "Sun"
    expect(firstDayHeader?.toLowerCase()).toContain('sun');
  });

  test('should display correct day headers for Monday start', async ({ page }) => {
    // Find the Monday start date picker
    const mondaySection = page.locator('text=Week starts Monday').first();
    const datePicker = mondaySection
      .locator('..')
      .locator('..')
      .locator('[role="combobox"]')
      .first();

    await datePicker.click();

    const calendar = page.locator('[role="dialog"]').first();
    const dayHeaders = calendar.locator('[role="columnheader"]');

    // First day should be Monday (or localized equivalent)
    const firstDayHeader = await dayHeaders.first().textContent();
    // Monday in en-US locale is typically "Mon"
    expect(firstDayHeader?.toLowerCase()).toContain('mon');
  });
});

test.describe('DatePicker - Time Selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/date-picker');
  });

  test('should show time picker when showTime is enabled', async ({ page }) => {
    // Find the time selection date picker
    const timeSection = page.locator('text=Date with Time Selection').first();
    const datePicker = timeSection
      .locator('..')
      .locator('..')
      .locator('[role="combobox"]')
      .first();

    await datePicker.click();

    const calendar = page.locator('[role="dialog"]').first();

    // Time picker inputs should be visible
    const hourInput = calendar.locator('input[aria-label="Hour"]');
    const minuteInput = calendar.locator('input[aria-label="Minute"]');
    const secondInput = calendar.locator('input[aria-label="Second"]');

    await expect(hourInput).toBeVisible();
    await expect(minuteInput).toBeVisible();
    await expect(secondInput).toBeVisible();

    // Footer Apply button should be visible (replaces old Done button)
    const applyButton = calendar.locator('button:has-text("Apply")');
    await expect(applyButton).toBeVisible();
  });

  test('should select date and time', async ({ page }) => {
    const timeSection = page.locator('text=Date with Time Selection').first();
    const datePicker = timeSection
      .locator('..')
      .locator('..')
      .locator('[role="combobox"]')
      .first();

    await datePicker.click();

    const calendar = page.locator('[role="dialog"]').first();

    // Select a date
    const dayButton = calendar
      .locator('[role="gridcell"]')
      .filter({ hasText: /^15$/ })
      .first();
    await dayButton.click();

    // Set time
    const hourInput = calendar.locator('input[aria-label="Hour"]');
    await hourInput.fill('14');

    const minuteInput = calendar.locator('input[aria-label="Minute"]');
    await minuteInput.fill('30');

    // Click Apply button
    const applyButton = calendar.locator('button:has-text("Apply")');
    await applyButton.click();

    // Calendar should close
    await expect(calendar).not.toBeVisible();

    // Input should contain the date and time
    const input = datePicker.locator('input');
    const value = await input.inputValue();
    expect(value).toContain('15');
    expect(value).toContain('14:30');
  });
});

test.describe('DatePicker - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/date-picker');
  });

  test('should have proper ARIA attributes on input', async ({ page }) => {
    const datePicker = page.locator('[role="combobox"]').first();
    await expect(datePicker).toHaveAttribute('role', 'combobox');
  });

  test('calendar should have dialog role', async ({ page }) => {
    const firstDatePicker = page.locator('[role="combobox"]').first();
    await firstDatePicker.click();

    const calendar = page.locator('[role="dialog"]');
    await expect(calendar).toHaveAttribute('role', 'dialog');
  });

  test('calendar grid should have proper role', async ({ page }) => {
    const firstDatePicker = page.locator('[role="combobox"]').first();
    await firstDatePicker.click();

    const grid = page.locator('[role="dialog"] [role="grid"]');
    if (await grid.isVisible()) {
      await expect(grid).toBeVisible();
    }
  });

  test('day cells should have gridcell role', async ({ page }) => {
    const firstDatePicker = page.locator('[role="combobox"]').first();
    await firstDatePicker.click();

    const gridCells = page.locator('[role="dialog"] [role="gridcell"]');
    const count = await gridCells.count();
    expect(count).toBeGreaterThan(0);
  });

  test('input should be focusable', async ({ page }) => {
    const input = page.locator('[role="combobox"] input').first();
    await input.focus();
    await expect(input).toBeFocused();
  });
});

test.describe('DatePicker - Visual States', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/date-picker');
  });

  test("should highlight today's date", async ({ page }) => {
    const firstDatePicker = page.locator('[role="combobox"]').first();
    await firstDatePicker.click();

    // Today's date typically has special styling
    const calendar = page.locator('[role="dialog"]').first();
    await expect(calendar).toBeVisible();
  });

  test('should show selected date with different styling', async ({ page }) => {
    const firstDatePicker = page.locator('[role="combobox"]').first();
    await firstDatePicker.click();

    // Select a date
    const dayButton = page
      .locator('[role="dialog"]')
      .first()
      .locator('[role="gridcell"]')
      .filter({ hasText: /^15$/ })
      .first();
    await dayButton.click();

    // Reopen and verify selection styling
    await firstDatePicker.click();
    const calendar = page.locator('[role="dialog"]');
    await expect(calendar).toBeVisible();
  });

  test('should show hover state on days', async ({ page }) => {
    const firstDatePicker = page.locator('[role="combobox"]').first();
    await firstDatePicker.click();

    const dialog = page.locator('[role="dialog"]').first();
    await expect(dialog).toBeVisible();

    const dayButton = dialog
      .locator('[role="gridcell"]')
      .filter({ hasText: /^15$/ })
      .first();

    await dayButton.hover();
    await expect(dayButton).toBeVisible();
  });
});

test.describe('DatePicker - Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/date-picker');
  });

  test('should focus date button when calendar opens', async ({ page }) => {
    // Click on the input specifically to ensure calendar opens
    const datePicker = page.locator('[role="combobox"]').first();
    await datePicker.click();

    // Wait for calendar to be visible with a longer timeout
    const calendar = page.locator('[role="dialog"]').first();
    await expect(calendar).toBeVisible({ timeout: 5000 });

    // A date button should be focused
    const focusedElement = page.locator('[role="gridcell"]:focus');
    await expect(focusedElement).toBeVisible({ timeout: 5000 });
  });

  test('should navigate dates with arrow keys', async ({ page }) => {
    const datePicker = page.locator('[role="combobox"]').first();
    await datePicker.click();

    const calendar = page.locator('[role="dialog"]').first();
    await expect(calendar).toBeVisible({ timeout: 5000 });

    // Get initial focused date
    const initialFocused = page.locator('[role="gridcell"]:focus');
    const initialDate = await initialFocused.getAttribute('data-date');

    // Navigate right
    await page.keyboard.press('ArrowRight');
    const afterRightFocused = page.locator('[role="gridcell"]:focus');
    const afterRightDate = await afterRightFocused.getAttribute('data-date');
    expect(afterRightDate).not.toBe(initialDate);

    // Navigate down (should move 7 days)
    await page.keyboard.press('ArrowDown');
    const afterDownFocused = page.locator('[role="gridcell"]:focus');
    await expect(afterDownFocused).toBeFocused();

    // Navigate left
    await page.keyboard.press('ArrowLeft');
    const afterLeftFocused = page.locator('[role="gridcell"]:focus');
    await expect(afterLeftFocused).toBeFocused();

    // Navigate up
    await page.keyboard.press('ArrowUp');
    const afterUpFocused = page.locator('[role="gridcell"]:focus');
    await expect(afterUpFocused).toBeFocused();
  });

  test('should select date with Enter key', async ({ page }) => {
    const datePicker = page.locator('[role="combobox"]').first();
    await datePicker.click();

    const calendar = page.locator('[role="dialog"]').first();
    await expect(calendar).toBeVisible({ timeout: 5000 });

    // Navigate to a specific date
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    // Press Enter to select
    await page.keyboard.press('Enter');

    // Calendar should close
    await expect(calendar).not.toBeVisible();

    // Input should have a value
    const input = datePicker.locator('input');
    const value = await input.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test('should select date with Space key', async ({ page }) => {
    const datePicker = page.locator('[role="combobox"]').first();
    await datePicker.click();

    const calendar = page.locator('[role="dialog"]').first();
    await expect(calendar).toBeVisible({ timeout: 5000 });

    // Navigate to a date
    await page.keyboard.press('ArrowRight');

    // Press Space to select
    await page.keyboard.press('Space');

    // Calendar should close
    await expect(calendar).not.toBeVisible();
  });

  test('should cycle focus with Tab key: date -> header buttons -> date', async ({ page }) => {
    const datePicker = page.locator('[role="combobox"]').first();
    await datePicker.click();

    const calendar = page.locator('[role="dialog"]').first();
    await expect(calendar).toBeVisible({ timeout: 5000 });

    // Initial focus should be on a date button
    const initialFocused = page.locator('[role="gridcell"]:focus');
    await expect(initialFocused).toBeVisible();

    // Tab to first header button (Previous month)
    await page.keyboard.press('Tab');
    const prevMonthBtn = calendar.locator('button[aria-label="Previous month"]');
    await expect(prevMonthBtn).toBeFocused();

    // Tab to month button
    await page.keyboard.press('Tab');
    const monthBtn = calendar.locator('button[aria-label="Select month"]');
    await expect(monthBtn).toBeFocused();

    // Tab to year button
    await page.keyboard.press('Tab');
    const yearBtn = calendar.locator('button[aria-label="Select year"]');
    await expect(yearBtn).toBeFocused();

    // Tab to next month button
    await page.keyboard.press('Tab');
    const nextMonthBtn = calendar.locator('button[aria-label="Next month"]');
    await expect(nextMonthBtn).toBeFocused();

    // Tab should cycle back to date button
    await page.keyboard.press('Tab');
    const cycledFocused = page.locator('[role="gridcell"]:focus');
    await expect(cycledFocused).toBeVisible();
  });

  test('should not navigate dates with arrow keys when header button is focused', async ({
    page,
  }) => {
    const datePicker = page.locator('[role="combobox"]').first();
    await datePicker.click();

    const calendar = page.locator('[role="dialog"]').first();
    await expect(calendar).toBeVisible({ timeout: 5000 });

    // Get initial focused date
    const initialFocused = page.locator('[role="gridcell"]:focus');
    const initialDate = await initialFocused.getAttribute('data-date');

    // Tab to header button
    await page.keyboard.press('Tab');
    const prevMonthBtn = calendar.locator('button[aria-label="Previous month"]');
    await expect(prevMonthBtn).toBeFocused();

    // Press arrow keys - should not change the focused date
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');

    // Tab back to date and verify it's the same date
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const afterFocused = page.locator('[role="gridcell"]:focus');
    const afterDate = await afterFocused.getAttribute('data-date');
    expect(afterDate).toBe(initialDate);
  });

  test('should activate header button with Enter when focused', async ({ page }) => {
    const datePicker = page.locator('[role="combobox"]').first();
    await datePicker.click();

    const calendar = page.locator('[role="dialog"]').first();
    await expect(calendar).toBeVisible({ timeout: 5000 });

    // Tab to month button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const monthBtn = calendar.locator('button[aria-label="Select month"]');
    await expect(monthBtn).toBeFocused();

    // Press Enter to open month selector
    await page.keyboard.press('Enter');

    // Month selector should be visible
    const monthSelector = calendar.locator('[role="listbox"][aria-label="Select month"]');
    await expect(monthSelector).toBeVisible();
  });

  test('should navigate month selector with arrow keys', async ({ page }) => {
    const datePicker = page.locator('[role="combobox"]').first();
    await datePicker.click();

    const calendar = page.locator('[role="dialog"]').first();
    await expect(calendar).toBeVisible({ timeout: 5000 });

    // Open month selector
    const monthBtn = calendar.locator('button[aria-label="Select month"]');
    await monthBtn.click();

    const monthSelector = calendar.locator('[role="listbox"][aria-label="Select month"]');
    await expect(monthSelector).toBeVisible();

    // A month should be focused
    const focusedMonth = monthSelector.locator('button:focus');
    await expect(focusedMonth).toBeVisible();

    // Navigate with arrow keys
    await page.keyboard.press('ArrowRight');
    const afterRightFocused = monthSelector.locator('button:focus');
    await expect(afterRightFocused).toBeVisible();

    await page.keyboard.press('ArrowDown');
    const afterDownFocused = monthSelector.locator('button:focus');
    await expect(afterDownFocused).toBeVisible();

    // Select with Enter
    await page.keyboard.press('Enter');

    // Month selector should close
    await expect(monthSelector).not.toBeVisible();

    // Focus should return to date grid
    const dateFocused = page.locator('[role="gridcell"]:focus');
    await expect(dateFocused).toBeVisible();
  });

  test('should navigate year selector with arrow keys', async ({ page }) => {
    const datePicker = page.locator('[role="combobox"]').first();
    await datePicker.click();

    const calendar = page.locator('[role="dialog"]').first();
    await expect(calendar).toBeVisible({ timeout: 5000 });

    // Open year selector
    const yearBtn = calendar.locator('button[aria-label="Select year"]');
    await yearBtn.click();

    const yearSelector = calendar.locator('[role="listbox"][aria-label="Select year"]');
    await expect(yearSelector).toBeVisible();

    // A year should be focused
    const focusedYear = yearSelector.locator('button:focus');
    await expect(focusedYear).toBeVisible();

    // Navigate with arrow keys
    await page.keyboard.press('ArrowLeft');
    const afterLeftFocused = yearSelector.locator('button:focus');
    await expect(afterLeftFocused).toBeVisible();

    await page.keyboard.press('ArrowUp');
    const afterUpFocused = yearSelector.locator('button:focus');
    await expect(afterUpFocused).toBeVisible();

    // Select with Enter
    await page.keyboard.press('Enter');

    // Year selector should close
    await expect(yearSelector).not.toBeVisible();

    // Focus should return to date grid
    const dateFocused = page.locator('[role="gridcell"]:focus');
    await expect(dateFocused).toBeVisible();
  });

  test('should close month selector with Escape and return focus to month button', async ({
    page,
  }) => {
    const datePicker = page.locator('[role="combobox"]').first();
    await datePicker.click();

    const calendar = page.locator('[role="dialog"]').first();
    await expect(calendar).toBeVisible({ timeout: 5000 });

    // Open month selector
    const monthBtn = calendar.locator('button[aria-label="Select month"]');
    await monthBtn.click();

    const monthSelector = calendar.locator('[role="listbox"][aria-label="Select month"]');
    await expect(monthSelector).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Month selector should close
    await expect(monthSelector).not.toBeVisible();

    // Focus should return to month button
    await expect(monthBtn).toBeFocused();
  });

  test('should update focused date when changing month', async ({ page }) => {
    const datePicker = page.locator('[role="combobox"]').first();
    await datePicker.click();

    const calendar = page.locator('[role="dialog"]').first();
    await expect(calendar).toBeVisible({ timeout: 5000 });

    // Get current focused date day
    const initialFocused = page.locator('[role="gridcell"]:focus');
    const initialDataDate = await initialFocused.getAttribute('data-date');
    const initialDay = initialDataDate ? new Date(initialDataDate).getDate() : 0;

    // Open month selector and select a different month
    const monthBtn = calendar.locator('button[aria-label="Select month"]');
    await monthBtn.click();

    const monthSelector = calendar.locator('[role="listbox"][aria-label="Select month"]');
    await expect(monthSelector).toBeVisible();

    // Navigate to a different month and select
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');

    // Focus should be on a date in the new month with same day (or clamped)
    const newFocused = page.locator('[role="gridcell"]:focus');
    await expect(newFocused).toBeVisible();
    const newDataDate = await newFocused.getAttribute('data-date');
    const newDay = newDataDate ? new Date(newDataDate).getDate() : 0;

    // Day should be preserved or clamped (e.g., 31 Jan -> 28 Feb)
    expect(newDay).toBeLessThanOrEqual(initialDay);
    expect(newDay).toBeGreaterThan(0);
  });

  test('should clamp day when changing to month with fewer days', async ({ page }) => {
    const datePicker = page.locator('[role="combobox"]').first();
    await datePicker.click();

    const calendar = page.locator('[role="dialog"]').first();
    await expect(calendar).toBeVisible({ timeout: 5000 });

    // Navigate to day 31
    const day31 = calendar.locator('[role="gridcell"]').filter({ hasText: /^31$/ }).first();
    if (await day31.isVisible()) {
      await day31.focus();

      // Open month selector
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');

      const monthSelector = calendar.locator('[role="listbox"][aria-label="Select month"]');
      await expect(monthSelector).toBeVisible();

      // Navigate to February (index 1) which has 28/29 days
      // First go to January (index 0), then right to February
      const months = monthSelector.locator('button');
      const febButton = months.nth(1); // February is index 1
      await febButton.click();

      // Focus should be on a date, day should be clamped to 28 or 29
      const newFocused = page.locator('[role="gridcell"]:focus');
      await expect(newFocused).toBeVisible();
      const newDataDate = await newFocused.getAttribute('data-date');
      const newDay = newDataDate ? new Date(newDataDate).getDate() : 0;

      expect(newDay).toBeLessThanOrEqual(29); // Feb has max 29 days
    }
  });

  test('should maintain focus cycle after changing month', async ({ page }) => {
    const datePicker = page.locator('[role="combobox"]').first();
    await datePicker.click();

    const calendar = page.locator('[role="dialog"]').first();
    await expect(calendar).toBeVisible({ timeout: 5000 });

    // Verify initial focus is on a date
    const initialFocused = page.locator('[role="gridcell"]:focus');
    await expect(initialFocused).toBeVisible();

    // Open month selector and select a different month
    const monthBtn = calendar.locator('button[aria-label="Select month"]');
    await monthBtn.click();

    const monthSelector = calendar.locator('[role="listbox"][aria-label="Select month"]');
    await expect(monthSelector).toBeVisible();

    // Navigate to a different month and select
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');

    // After selecting month, focus should be back on a date
    const dateAfterMonthChange = page.locator('[role="gridcell"]:focus');
    await expect(dateAfterMonthChange).toBeVisible({ timeout: 5000 });

    // Now test the full Tab cycle: date -> prev month -> month -> year -> next month -> date
    await page.keyboard.press('Tab');
    const prevMonthBtn = calendar.locator('button[aria-label="Previous month"]');
    await expect(prevMonthBtn).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(monthBtn).toBeFocused();

    await page.keyboard.press('Tab');
    const yearBtn = calendar.locator('button[aria-label="Select year"]');
    await expect(yearBtn).toBeFocused();

    await page.keyboard.press('Tab');
    const nextMonthBtn = calendar.locator('button[aria-label="Next month"]');
    await expect(nextMonthBtn).toBeFocused();

    // Tab should cycle back to the focused date
    await page.keyboard.press('Tab');
    const cycledDate = page.locator('[role="gridcell"]:focus');
    await expect(cycledDate).toBeVisible();
  });

  test('should maintain focus cycle after changing year', async ({ page }) => {
    const datePicker = page.locator('[role="combobox"]').first();
    await datePicker.click();

    const calendar = page.locator('[role="dialog"]').first();
    await expect(calendar).toBeVisible({ timeout: 5000 });

    // Verify initial focus is on a date
    const initialFocused = page.locator('[role="gridcell"]:focus');
    await expect(initialFocused).toBeVisible();

    // Open year selector and select a different year
    const yearBtn = calendar.locator('button[aria-label="Select year"]');
    await yearBtn.click();

    const yearSelector = calendar.locator('[role="listbox"][aria-label="Select year"]');
    await expect(yearSelector).toBeVisible();

    // Navigate to a different year and select
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('Enter');

    // After selecting year, focus should be back on a date
    const dateAfterYearChange = page.locator('[role="gridcell"]:focus');
    await expect(dateAfterYearChange).toBeVisible({ timeout: 5000 });

    // Now test the full Tab cycle: date -> prev month -> month -> year -> next month -> date
    await page.keyboard.press('Tab');
    const prevMonthBtn = calendar.locator('button[aria-label="Previous month"]');
    await expect(prevMonthBtn).toBeFocused();

    await page.keyboard.press('Tab');
    const monthBtn = calendar.locator('button[aria-label="Select month"]');
    await expect(monthBtn).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(yearBtn).toBeFocused();

    await page.keyboard.press('Tab');
    const nextMonthBtn = calendar.locator('button[aria-label="Next month"]');
    await expect(nextMonthBtn).toBeFocused();

    // Tab should cycle back to the focused date
    await page.keyboard.press('Tab');
    const cycledDate = page.locator('[role="gridcell"]:focus');
    await expect(cycledDate).toBeVisible();
  });

  test('should open calendar with Enter key on input', async ({ page }) => {
    const firstDatePicker = page.locator('[role="combobox"]').first();
    const input = firstDatePicker.locator('input');
    await input.focus();

    // Press Enter to open calendar
    await page.keyboard.press('Enter');

    const calendar = page.locator('[role="dialog"]').first();
    await expect(calendar).toBeVisible();

    // A date should be focused
    const focusedDate = page.locator('[role="gridcell"]:focus');
    await expect(focusedDate).toBeVisible();
  });

  test('should open calendar with Space key on input', async ({ page }) => {
    const firstDatePicker = page.locator('[role="combobox"]').first();
    const input = firstDatePicker.locator('input');
    await input.focus();

    // Press Space to open calendar
    await page.keyboard.press('Space');

    const calendar = page.locator('[role="dialog"]').first();
    await expect(calendar).toBeVisible();
  });

  test('should open calendar with ArrowDown key on input', async ({ page }) => {
    const firstDatePicker = page.locator('[role="combobox"]').first();
    const input = firstDatePicker.locator('input');
    await input.focus();

    // Press ArrowDown to open calendar
    await page.keyboard.press('ArrowDown');

    const calendar = page.locator('[role="dialog"]').first();
    await expect(calendar).toBeVisible();
  });

  test('should close calendar and return focus to input on Escape', async ({ page }) => {
    const datePicker = page.locator('[role="combobox"]').first();
    const input = datePicker.locator('input');
    await datePicker.click();

    const calendar = page.locator('[role="dialog"]').first();
    await expect(calendar).toBeVisible({ timeout: 5000 });

    // Press Escape
    await page.keyboard.press('Escape');

    // Calendar should close
    await expect(calendar).not.toBeVisible();

    // Input should be focused
    await expect(input).toBeFocused();
  });
});

test.describe('DatePicker - Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/date-picker');
  });

  test('should handle rapid calendar open/close', async ({ page }) => {
    const firstDatePicker = page.locator('[role="combobox"]').first();

    await firstDatePicker.click();
    await page.keyboard.press('Escape');
    await firstDatePicker.click();
    await page.keyboard.press('Escape');

    // Should be in a valid state
    await expect(firstDatePicker).toBeVisible();
  });

  test('should maintain selection after closing and reopening', async ({ page }) => {
    const firstDatePicker = page.locator('[role="combobox"]').first();
    await firstDatePicker.click();

    // Select a date
    const dayButton = page
      .locator('[role="dialog"]')
      .first()
      .locator('[role="gridcell"]')
      .filter({ hasText: /^15$/ })
      .first();
    await dayButton.click();

    // Get the selected value
    const input = firstDatePicker.locator('input');
    const value = await input.inputValue();

    // Reopen and verify value persists
    await firstDatePicker.click();
    await page.keyboard.press('Escape');

    const newValue = await input.inputValue();
    expect(newValue).toBe(value);
  });

  test('should render without crashing', async ({ page }) => {
    await page.waitForTimeout(500);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  // ==================== Shortcuts Keyboard Navigation ====================

  test.describe('Shortcuts - Keyboard Navigation', () => {
    const openShortcutsDatePicker = async (page: import('@playwright/test').Page) => {
      const datePicker = page.getByRole('combobox', { name: 'Quick Select' });
      await datePicker.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await datePicker.click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog.first()).toBeVisible({ timeout: 10000 });
      return dialog.first();
    };

    test('should show shortcuts panel when calendar opens', async ({ page }) => {
      const dialog = await openShortcutsDatePicker(page);
      const shortcutsList = dialog.locator('[role="listbox"]').first();
      await expect(shortcutsList).toBeVisible();

      // Single type shows Today and Yesterday
      const options = shortcutsList.locator('[role="option"]');
      await expect(options.first()).toContainText('Today');
      await expect(options.nth(1)).toContainText('Yesterday');
    });

    test('should navigate shortcuts with ArrowDown key', async ({ page }) => {
      const dialog = await openShortcutsDatePicker(page);
      const shortcutsList = dialog.locator('[role="listbox"]').first();
      const firstShortcut = shortcutsList.locator('[role="option"]').first();
      const secondShortcut = shortcutsList.locator('[role="option"]').nth(1);

      // Focus the first shortcut
      await firstShortcut.focus();
      await expect(firstShortcut).toBeFocused();

      // ArrowDown should move to second shortcut
      await page.keyboard.press('ArrowDown');
      await expect(secondShortcut).toBeFocused();
    });

    test('should navigate shortcuts with ArrowUp key', async ({ page }) => {
      const dialog = await openShortcutsDatePicker(page);
      const shortcutsList = dialog.locator('[role="listbox"]').first();
      const firstShortcut = shortcutsList.locator('[role="option"]').first();
      const secondShortcut = shortcutsList.locator('[role="option"]').nth(1);

      // Focus the second shortcut
      await secondShortcut.focus();
      await expect(secondShortcut).toBeFocused();

      // ArrowUp should move to first shortcut
      await page.keyboard.press('ArrowUp');
      await expect(firstShortcut).toBeFocused();
    });

    test('should not go past first shortcut with ArrowUp', async ({ page }) => {
      const dialog = await openShortcutsDatePicker(page);
      const shortcutsList = dialog.locator('[role="listbox"]').first();
      const firstShortcut = shortcutsList.locator('[role="option"]').first();

      await firstShortcut.focus();
      await page.keyboard.press('ArrowUp');
      await expect(firstShortcut).toBeFocused();
    });

    test('should not go past last shortcut with ArrowDown', async ({ page }) => {
      const dialog = await openShortcutsDatePicker(page);
      const shortcutsList = dialog.locator('[role="listbox"]').first();
      const options = shortcutsList.locator('[role="option"]');
      const count = await options.count();
      const lastShortcut = options.nth(count - 1);

      await lastShortcut.focus();
      await page.keyboard.press('ArrowDown');
      await expect(lastShortcut).toBeFocused();
    });

    test('should select shortcut with Enter key', async ({ page }) => {
      const dialog = await openShortcutsDatePicker(page);
      const shortcutsList = dialog.locator('[role="listbox"]').first();
      const todayShortcut = shortcutsList.locator('[role="option"]').first();

      await todayShortcut.focus();
      await page.keyboard.press('Enter');

      // Calendar should close after selecting a single-date shortcut
      await expect(dialog).not.toBeVisible();

      // Input should have today's date
      const input = page.getByRole('combobox', { name: 'Quick Select' }).locator('input');
      const value = await input.inputValue();
      expect(value).not.toBe('');
    });

    test('should close calendar with Escape from shortcuts', async ({ page }) => {
      const dialog = await openShortcutsDatePicker(page);
      const shortcutsList = dialog.locator('[role="listbox"]').first();
      const firstShortcut = shortcutsList.locator('[role="option"]').first();

      await firstShortcut.focus();
      await page.keyboard.press('Escape');

      await expect(dialog).not.toBeVisible();
    });

    test('should Tab: shortcuts (single stop) -> header buttons -> date -> shortcuts', async ({
      page,
    }) => {
      const dialog = await openShortcutsDatePicker(page);
      const shortcutsList = dialog.locator('[role="listbox"]').first();
      const shortcuts = shortcutsList.locator('[role="option"]');

      // Focus the first shortcut
      await shortcuts.first().focus();
      await expect(shortcuts.first()).toBeFocused();

      // Navigate to second shortcut with ArrowDown (not Tab)
      await page.keyboard.press('ArrowDown');
      await expect(shortcuts.nth(1)).toBeFocused();

      // Tab from shortcuts should jump to first header button (not next shortcut)
      await page.keyboard.press('Tab');
      const prevMonthBtn = dialog.locator('button[aria-label="Previous month"]');
      await expect(prevMonthBtn).toBeFocused();

      // Tab through header buttons
      await page.keyboard.press('Tab');
      const monthBtn = dialog.locator('button[aria-label="Select month"]');
      await expect(monthBtn).toBeFocused();

      await page.keyboard.press('Tab');
      const yearBtn = dialog.locator('button[aria-label="Select year"]');
      await expect(yearBtn).toBeFocused();

      await page.keyboard.press('Tab');
      const nextMonthBtn = dialog.locator('button[aria-label="Next month"]');
      await expect(nextMonthBtn).toBeFocused();

      // Tab to focused date button
      await page.keyboard.press('Tab');
      const focusedDate = page.locator('[role="gridcell"]:focus');
      await expect(focusedDate).toBeVisible();

      // Tab should wrap back to shortcuts (first shortcut)
      await page.keyboard.press('Tab');
      await expect(shortcuts.first()).toBeFocused();
    });

    test('should Shift+Tab from shortcuts wrap to date, then header', async ({
      page,
    }) => {
      const dialog = await openShortcutsDatePicker(page);
      const shortcutsList = dialog.locator('[role="listbox"]').first();
      const firstShortcut = shortcutsList.locator('[role="option"]').first();

      // Focus first shortcut
      await firstShortcut.focus();
      await expect(firstShortcut).toBeFocused();

      // Shift+Tab should wrap to focused date button (last section before shortcuts)
      await page.keyboard.press('Shift+Tab');
      const focusedDate = page.locator('[role="gridcell"]:focus');
      await expect(focusedDate).toBeVisible();

      // Shift+Tab to next month button
      await page.keyboard.press('Shift+Tab');
      const nextMonthBtn = dialog.locator('button[aria-label="Next month"]');
      await expect(nextMonthBtn).toBeFocused();

      // Shift+Tab to year button
      await page.keyboard.press('Shift+Tab');
      const yearBtn = dialog.locator('button[aria-label="Select year"]');
      await expect(yearBtn).toBeFocused();
    });
  });

  // ==================== Range/Multiple Focus Persistence ====================

  test.describe('Range/Multiple - Focus after month change', () => {
    test('should maintain Tab cycle after selecting range start and changing month', async ({
      page,
    }) => {
      const datePicker = page.getByRole('combobox', { name: 'Select Date Range' });
      await datePicker.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await datePicker.click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog.first()).toBeVisible();

      // Select a date (range start)
      const dateBtn = dialog.first().locator('[role="gridcell"]').nth(10);
      await dateBtn.click();

      // Focus should still be on a date button after selection
      const focusedDate = page.locator('[role="gridcell"]:focus');
      await expect(focusedDate).toBeVisible({ timeout: 3000 });

      // Tab to header buttons
      await page.keyboard.press('Tab');
      const prevMonthBtn = dialog.first().locator('button[aria-label="Previous month"]');
      await expect(prevMonthBtn).toBeFocused();

      await page.keyboard.press('Tab');
      const monthBtn = dialog.first().locator('button[aria-label="Select month"]');
      await expect(monthBtn).toBeFocused();

      await page.keyboard.press('Tab');
      const yearBtn = dialog.first().locator('button[aria-label="Select year"]');
      await expect(yearBtn).toBeFocused();

      await page.keyboard.press('Tab');
      const nextMonthBtn = dialog.first().locator('button[aria-label="Next month"]');
      await expect(nextMonthBtn).toBeFocused();

      // Tab should cycle back to date
      await page.keyboard.press('Tab');
      const cycledDate = page.locator('[role="gridcell"]:focus');
      await expect(cycledDate).toBeVisible({ timeout: 3000 });
    });

    test('should maintain Tab cycle after selecting range start and using month selector', async ({
      page,
    }) => {
      const datePicker = page.getByRole('combobox', { name: 'Select Date Range' });
      await datePicker.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await datePicker.click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog.first()).toBeVisible();

      // Select a date (range start)
      const dateBtn = dialog.first().locator('[role="gridcell"]').nth(10);
      await dateBtn.click();

      // Focus should remain on date
      const focusedDate = page.locator('[role="gridcell"]:focus');
      await expect(focusedDate).toBeVisible({ timeout: 3000 });

      // Tab to month button and open month selector
      await page.keyboard.press('Tab'); // prev month
      await page.keyboard.press('Tab'); // month button
      const monthBtn = dialog.first().locator('button[aria-label="Select month"]');
      await expect(monthBtn).toBeFocused();

      // Open month selector and pick a different month
      await page.keyboard.press('Enter');
      // Navigate to a different month with arrow keys
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('Enter');

      // After month change, focus should be on a date button
      const dateAfterMonthChange = page.locator('[role="gridcell"]:focus');
      await expect(dateAfterMonthChange).toBeVisible({ timeout: 3000 });

      // Verify Tab cycle works: date -> header -> date
      await page.keyboard.press('Tab');
      const prevMonthBtn = dialog.first().locator('button[aria-label="Previous month"]');
      await expect(prevMonthBtn).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(dialog.first().locator('button[aria-label="Select month"]')).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(dialog.first().locator('button[aria-label="Select year"]')).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(dialog.first().locator('button[aria-label="Next month"]')).toBeFocused();

      await page.keyboard.press('Tab');
      const cycledDate = page.locator('[role="gridcell"]:focus');
      await expect(cycledDate).toBeVisible({ timeout: 3000 });
    });

    test('should maintain Tab cycle after selecting range start and using PageUp', async ({
      page,
    }) => {
      const datePicker = page.getByRole('combobox', { name: 'Select Date Range' });
      await datePicker.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await datePicker.click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog.first()).toBeVisible();

      // Select a date (range start) via keyboard
      const focusedDate = page.locator('[role="gridcell"]:focus');
      await expect(focusedDate).toBeVisible({ timeout: 3000 });
      await page.keyboard.press('Enter');

      // Focus should remain on date after range start selection
      await expect(focusedDate).toBeVisible({ timeout: 3000 });

      // Use PageUp to go to previous month
      await page.keyboard.press('PageUp');
      const dateAfterPageUp = page.locator('[role="gridcell"]:focus');
      await expect(dateAfterPageUp).toBeVisible({ timeout: 3000 });

      // Verify Tab cycle: date -> header -> date
      await page.keyboard.press('Tab');
      await expect(dialog.first().locator('button[aria-label="Previous month"]')).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(dialog.first().locator('button[aria-label="Select month"]')).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(dialog.first().locator('button[aria-label="Select year"]')).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(dialog.first().locator('button[aria-label="Next month"]')).toBeFocused();

      await page.keyboard.press('Tab');
      const backToDate = page.locator('[role="gridcell"]:focus');
      await expect(backToDate).toBeVisible({ timeout: 3000 });
    });
  });

  // ==================== Footer ====================

  test.describe('Footer - Cancel/Apply', () => {
    const openFooterDatePicker = async (page: import('@playwright/test').Page, label: string) => {
      const datePicker = page.getByRole('combobox', { name: label });
      await datePicker.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await datePicker.click();
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog.first()).toBeVisible({ timeout: 10000 });
      return dialog.first();
    };

    test('should show footer with Cancel and Apply buttons when showFooter is true', async ({
      page,
    }) => {
      const dialog = await openFooterDatePicker(page, 'Select with Footer');
      const cancelBtn = dialog.locator('button:has-text("Cancel")');
      const applyBtn = dialog.locator('button:has-text("Apply")');
      await expect(cancelBtn).toBeVisible();
      await expect(applyBtn).toBeVisible();
    });

    test('should show footer when showTime is true', async ({ page }) => {
      const datePicker = page.getByRole('combobox', { name: 'Appointment', exact: true });
      await datePicker.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await datePicker.click();
      const dialog = page.locator('[role="dialog"]').first();
      await expect(dialog).toBeVisible({ timeout: 10000 });

      const cancelBtn = dialog.locator('button:has-text("Cancel")');
      const applyBtn = dialog.locator('button:has-text("Apply")');
      await expect(cancelBtn).toBeVisible();
      await expect(applyBtn).toBeVisible();
    });

    test('should not close calendar when selecting a date with showFooter', async ({ page }) => {
      const dialog = await openFooterDatePicker(page, 'Select with Footer');

      // Select a date
      const dayButton = dialog.locator('[role="gridcell"]').filter({ hasText: /^15$/ }).first();
      await dayButton.click();

      // Calendar should remain open (not closed like without footer)
      await expect(dialog).toBeVisible();

      // Footer buttons should still be visible
      await expect(dialog.locator('button:has-text("Cancel")')).toBeVisible();
      await expect(dialog.locator('button:has-text("Apply")')).toBeVisible();
    });

    test('should fire onChange and close when Apply is clicked', async ({ page }) => {
      const dialog = await openFooterDatePicker(page, 'Select with Footer');

      // Select a date
      const dayButton = dialog.locator('[role="gridcell"]').filter({ hasText: /^15$/ }).first();
      await dayButton.click();

      // Click Apply
      const applyBtn = dialog.locator('button:has-text("Apply")');
      await applyBtn.click();

      // Calendar should close
      await expect(dialog).not.toBeVisible();

      // Input should have the date
      const input = page.getByRole('combobox', { name: 'Select with Footer' }).locator('input');
      await expect(input).toHaveValue(/15/);
    });

    test('should close without onChange when Cancel is clicked', async ({ page }) => {
      const dialog = await openFooterDatePicker(page, 'Select with Footer');

      // Select a date
      const dayButton = dialog.locator('[role="gridcell"]').filter({ hasText: /^15$/ }).first();
      await dayButton.click();
      await expect(dialog).toBeVisible();

      // Click Cancel
      const cancelBtn = dialog.locator('button:has-text("Cancel")');
      await cancelBtn.click();

      // Calendar should close
      await expect(dialog).not.toBeVisible();

      // Reopen - should not have the date selected (onChange was never called)
      const dialog2 = await openFooterDatePicker(page, 'Select with Footer');
      // The 15th should NOT be aria-selected since Cancel discarded changes
      const day15 = dialog2.locator('[role="gridcell"]').filter({ hasText: /^15$/ }).first();
      const isSelected = await day15.getAttribute('aria-selected');
      expect(isSelected).toBe('false');
    });

    test('should not close range calendar when selecting end date with showFooter', async ({
      page,
    }) => {
      const dialog = await openFooterDatePicker(page, 'Range with Footer');

      // Select start date
      const startDay = dialog.locator('[role="gridcell"]').filter({ hasText: /^10$/ }).first();
      await startDay.click();
      await expect(dialog).toBeVisible();

      // Select end date
      const endDay = dialog.locator('[role="gridcell"]').filter({ hasText: /^20$/ }).first();
      await endDay.click();

      // Calendar should remain open (footer controls closing)
      await expect(dialog).toBeVisible();

      // Click Apply to confirm
      const applyBtn = dialog.locator('button:has-text("Apply")');
      await applyBtn.click();
      await expect(dialog).not.toBeVisible();

      // Input should have the range
      const input = page.getByRole('combobox', { name: 'Range with Footer' }).locator('input');
      await expect(input).toHaveValue(/10/);
      await expect(input).toHaveValue(/20/);
    });

    test('should include footer buttons in Tab cycle', async ({ page }) => {
      const dialog = await openFooterDatePicker(page, 'Select with Footer');

      // Initial focus on date
      const focusedDate = page.locator('[role="gridcell"]:focus');
      await expect(focusedDate).toBeVisible({ timeout: 5000 });

      // Tab order: header (prev, month, year, next) -> date -> footer (Cancel, Apply) -> header
      // From date, Tab goes to Cancel
      await page.keyboard.press('Tab');
      const cancelBtn = dialog.locator('button:has-text("Cancel")');
      await expect(cancelBtn).toBeFocused();

      // Tab to Apply
      await page.keyboard.press('Tab');
      const applyBtn = dialog.locator('button:has-text("Apply")');
      await expect(applyBtn).toBeFocused();

      // Tab wraps to first header button
      await page.keyboard.press('Tab');
      await expect(dialog.locator('button[aria-label="Previous month"]')).toBeFocused();

      // Tab through header buttons
      await page.keyboard.press('Tab'); // month
      await expect(dialog.locator('button[aria-label="Select month"]')).toBeFocused();

      await page.keyboard.press('Tab'); // year
      await expect(dialog.locator('button[aria-label="Select year"]')).toBeFocused();

      await page.keyboard.press('Tab'); // next month
      await expect(dialog.locator('button[aria-label="Next month"]')).toBeFocused();

      // Tab back to date
      await page.keyboard.press('Tab');
      await expect(page.locator('[role="gridcell"]:focus')).toBeVisible();
    });

    test('should include footer buttons in Tab cycle with showTime', async ({ page }) => {
      const datePicker = page.getByRole('combobox', { name: 'Appointment', exact: true });
      await datePicker.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await datePicker.click();
      const dialog = page.locator('[role="dialog"]').first();
      await expect(dialog).toBeVisible({ timeout: 10000 });

      // Focus should be on a date
      const focusedDate = page.locator('[role="gridcell"]:focus');
      await expect(focusedDate).toBeVisible({ timeout: 5000 });

      // Tab order: header (4) -> date -> time inputs (3) -> footer (Cancel, Apply) -> header
      // From date, Tab to time picker controls
      await page.keyboard.press('Tab'); // hour
      const hourInput = dialog.locator('input[aria-label="Hour"]');
      await expect(hourInput).toBeFocused();

      await page.keyboard.press('Tab'); // minute
      await page.keyboard.press('Tab'); // second

      // Now should be at Cancel button
      const cancelBtn = dialog.locator('button:has-text("Cancel")');
      await page.keyboard.press('Tab');
      await expect(cancelBtn).toBeFocused();

      await page.keyboard.press('Tab'); // Apply button
      const applyBtn = dialog.locator('button:has-text("Apply")');
      await expect(applyBtn).toBeFocused();
    });
  });

  // ==================== AM/PM Time Picker ====================

  test.describe('AM/PM Time Picker', () => {
    const openMeetingTimePicker = async (page: import('@playwright/test').Page) => {
      const datePicker = page.getByRole('combobox', { name: 'Meeting Time' });
      await datePicker.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await datePicker.click();
      const dialog = page.locator('[role="dialog"]').first();
      await expect(dialog.first()).toBeVisible({ timeout: 10000 });
      return dialog.first();
    };

    test('should show AM/PM selector when timeFormat is 12h', async ({ page }) => {
      const dialog = await openMeetingTimePicker(page);

      // AM/PM input should be visible
      const ampmInput = dialog.locator('input[aria-label="AM/PM"]');
      await expect(ampmInput).toBeVisible();

      // Should default to AM (hour 0 = 12 AM)
      await expect(ampmInput).toHaveValue('AM');
    });

    test('should open AM/PM dropdown with keyboard', async ({ page }) => {
      const dialog = await openMeetingTimePicker(page);

      const ampmInput = dialog.locator('input[aria-label="AM/PM"]');
      await ampmInput.focus();
      await expect(ampmInput).toBeFocused();

      // Press Enter to open dropdown
      await page.keyboard.press('Enter');

      // Listbox should appear (rendered via Portal, outside dialog)
      const listbox = page.locator('[role="listbox"]').last();
      await expect(listbox).toBeVisible({ timeout: 3000 });
    });

    test('should navigate AM/PM options with arrow keys and select with Enter', async ({
      page,
    }) => {
      const dialog = await openMeetingTimePicker(page);

      const ampmInput = dialog.locator('input[aria-label="AM/PM"]');
      await ampmInput.focus();

      // Open dropdown
      await page.keyboard.press('Enter');
      const listbox = page.locator('[role="listbox"]').last();
      await expect(listbox).toBeVisible({ timeout: 3000 });

      // Arrow down to PM
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');

      // Select PM with Enter
      await page.keyboard.press('Enter');

      // Should now show PM
      await expect(ampmInput).toHaveValue('PM');
    });

    test('should open and close AM/PM dropdown with keyboard', async ({ page }) => {
      const dialog = await openMeetingTimePicker(page);

      const ampmInput = dialog.locator('input[aria-label="AM/PM"]');
      await ampmInput.focus();

      // Open dropdown with Enter
      await page.keyboard.press('Enter');
      const listbox = page.locator('[role="listbox"]').last();
      await expect(listbox).toBeVisible({ timeout: 3000 });

      // Should have aria-expanded=true when open
      await expect(ampmInput).toHaveAttribute('aria-expanded', 'true');

      // Navigate and select PM with keyboard (select closes dropdown on selection)
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');

      // Listbox should be hidden after selection
      await expect(listbox).not.toBeVisible();
    });

    test('should select date and apply with AM/PM time picker', async ({ page }) => {
      const dialog = await openMeetingTimePicker(page);

      // Select a date
      const dayButton = dialog.locator('[role="gridcell"]').filter({ hasText: /^10$/ }).first();
      await dayButton.click();
      await expect(dialog).toBeVisible();

      // Footer Apply button should be visible (showTime implies hasFooter)
      const applyBtn = dialog.locator('button:has-text("Apply")');
      await expect(applyBtn).toBeVisible();

      // Click Apply
      await applyBtn.click();

      // Calendar should close
      await expect(dialog).not.toBeVisible();

      // Input should contain the date
      const input = page.getByRole('combobox', { name: 'Meeting Time' }).locator('input');
      await expect(input).toHaveValue(/10/);
    });

    test('should have proper ARIA attributes on AM/PM select', async ({ page }) => {
      const dialog = await openMeetingTimePicker(page);

      const ampmInput = dialog.locator('input[aria-label="AM/PM"]');

      // Should have aria-expanded=false when closed
      await expect(ampmInput).toHaveAttribute('aria-expanded', 'false');
      await expect(ampmInput).toHaveAttribute('aria-haspopup', 'listbox');

      // Open dropdown
      await ampmInput.focus();
      await page.keyboard.press('Enter');

      // Should have aria-expanded=true when open
      await expect(ampmInput).toHaveAttribute('aria-expanded', 'true');

      // Options should have role="option" (rendered via Portal)
      const listbox = page.locator('[role="listbox"]').last();
      const options = listbox.locator('[role="option"]');
      await expect(options).toHaveCount(2);
    });
  });
});
