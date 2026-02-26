import { type Locator, type Page, expect, test } from '@playwright/test';

// ==================== Helpers ====================

/** Click the trigger and wait for a listbox to appear. */
const openAndWaitForListbox = async (trigger: Locator, page: Page) => {
  await trigger.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await trigger.click();
  // Wait for a visible listbox to appear
  await page.locator('[role="listbox"]').first().waitFor({ state: 'visible', timeout: 5000 });
  await page.waitForTimeout(200);
};

// All tests use the dedicated preview page
const PREVIEW_URL = '/preview/select-groups';

// ==================== Select — Grouped Options ====================

test.describe('Select - Grouped Options', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PREVIEW_URL);
  });

  const getTrigger = (page: Page) =>
    page.locator('#grouped-select').getByRole('combobox');

  test('should render group headers', async ({ page }) => {
    const trigger = getTrigger(page);
    await openAndWaitForListbox(trigger, page);

    const groups = page.locator('[role="group"]');
    await expect(groups.first()).toBeVisible();
    const count = await groups.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('group headers should have role="presentation"', async ({ page }) => {
    const trigger = getTrigger(page);
    await openAndWaitForListbox(trigger, page);

    const headers = page.locator('[role="group"] [role="presentation"]');
    const count = await headers.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('groups should have aria-labelledby pointing to header', async ({ page }) => {
    const trigger = getTrigger(page);
    await openAndWaitForListbox(trigger, page);

    const group = page.locator('[role="group"]').first();
    const labelledBy = await group.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();

    const header = page.locator(`[id="${labelledBy}"]`);
    await expect(header).toBeVisible();
  });

  test('should display group header text', async ({ page }) => {
    const trigger = getTrigger(page);
    await openAndWaitForListbox(trigger, page);

    const listbox = page.locator('[role="listbox"]').first();
    const text = await listbox.textContent();
    expect(text).toContain('Fruits');
    expect(text).toContain('Vegetables');
  });

  test('should render spacers between groups', async ({ page }) => {
    const trigger = getTrigger(page);
    await openAndWaitForListbox(trigger, page);

    const spacers = page.locator('[role="separator"]');
    const count = await spacers.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('keyboard navigation should skip group headers', async ({ page }) => {
    const trigger = getTrigger(page);
    await openAndWaitForListbox(trigger, page);

    await trigger.press('ArrowDown');
    await trigger.press('ArrowDown');
    await trigger.press('ArrowDown');
    await trigger.press('Enter');
    await page.waitForTimeout(200);

    const value = await trigger.inputValue();
    expect(value).toBeTruthy();
    expect(value).not.toBe('Fruits');
    expect(value).not.toBe('Vegetables');
  });

  test('should select option within a group', async ({ page }) => {
    const trigger = getTrigger(page);
    await openAndWaitForListbox(trigger, page);

    const option = page.locator('[role="option"]').first();
    const optionText = await option.textContent();
    await option.click();
    await page.waitForTimeout(200);

    const value = await trigger.inputValue();
    expect(value).toContain(optionText?.trim() || '');
  });
});

// ==================== SelectWithSearch — Grouped Options ====================

test.describe('SelectWithSearch - Grouped Options', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PREVIEW_URL);
  });

  const getTrigger = (page: Page) =>
    page.locator('#grouped-search').getByRole('combobox');

  test('should render group headers', async ({ page }) => {
    const trigger = getTrigger(page);
    await openAndWaitForListbox(trigger, page);

    const groups = page.locator('[role="group"]');
    await expect(groups.first()).toBeVisible();
  });

  test('search should filter and show only groups with matching options', async ({ page }) => {
    const trigger = getTrigger(page);
    await openAndWaitForListbox(trigger, page);
    await trigger.fill('United');
    await page.waitForTimeout(300);

    const options = page.locator('[role="option"]');
    const count = await options.count();
    expect(count).toBeGreaterThanOrEqual(1);

    for (let i = 0; i < count; i++) {
      const text = await options.nth(i).textContent();
      expect(text?.toLowerCase()).toContain('united');
    }
  });

  test('search with no results should show no-results message', async ({ page }) => {
    const trigger = getTrigger(page);
    await openAndWaitForListbox(trigger, page);
    await trigger.fill('zzzznonexistent');
    await page.waitForTimeout(300);

    const options = page.locator('[role="option"]');
    const count = await options.count();
    expect(count).toBe(0);
  });
});

// ==================== MultiSelect — Grouped Options ====================

test.describe('MultiSelect - Grouped Options', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PREVIEW_URL);
  });

  const getTrigger = (page: Page) =>
    page.locator('#grouped-multi').getByRole('combobox');

  test('should render group headers', async ({ page }) => {
    const trigger = getTrigger(page);
    await openAndWaitForListbox(trigger, page);

    const listbox = page.locator('[role="listbox"]').first();
    const text = await listbox.textContent();
    expect(text).toContain('JavaScript');
    expect(text).toContain('Python');
  });

  test('should select option within a group', async ({ page }) => {
    const trigger = getTrigger(page);
    await openAndWaitForListbox(trigger, page);

    const option = page.locator('[role="option"]').first();
    await option.click();
    await page.waitForTimeout(200);

    const ariaSelected = await option.getAttribute('aria-selected');
    expect(ariaSelected).toBe('true');
  });

  test('keyboard navigation should work with grouped options', async ({ page }) => {
    const trigger = getTrigger(page);
    await openAndWaitForListbox(trigger, page);

    await trigger.press('ArrowDown');
    await trigger.press('ArrowDown');
    await trigger.press(' ');
    await page.waitForTimeout(200);

    const value = await trigger.inputValue();
    expect(value).toBeTruthy();
  });
});

// ==================== MultiSelect — Virtualized Grouped Options ====================

test.describe('MultiSelect - Virtualized Grouped Options', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PREVIEW_URL);
  });

  const getTrigger = (page: Page) =>
    page.locator('#virtualized-multi').getByRole('combobox');

  test('should open dropdown and render options', async ({ page }) => {
    const trigger = getTrigger(page);
    await openAndWaitForListbox(trigger, page);

    const options = page.locator('[role="option"]');
    const count = await options.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should render group header text', async ({ page }) => {
    const trigger = getTrigger(page);
    await openAndWaitForListbox(trigger, page);

    const listbox = page.locator('[role="listbox"]').last();
    const text = await listbox.textContent();
    expect(text).toContain('JavaScript');
  });

  test('should render separators between groups', async ({ page }) => {
    const trigger = getTrigger(page);
    await openAndWaitForListbox(trigger, page);

    const listbox = page.locator('[role="listbox"]').last();
    await listbox.evaluate((el) => (el.scrollTop = el.scrollHeight));
    await page.waitForTimeout(200);

    const spacers = listbox.locator('[role="separator"]');
    const count = await spacers.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should select an option by clicking', async ({ page }) => {
    const trigger = getTrigger(page);
    await openAndWaitForListbox(trigger, page);

    const firstOption = page.locator('[role="option"]').first();
    await firstOption.click();
    await page.waitForTimeout(200);

    const value = await trigger.inputValue();
    expect(value).toBeTruthy();
  });

  test('keyboard navigation should work across virtualized groups', async ({ page }) => {
    const trigger = getTrigger(page);
    await openAndWaitForListbox(trigger, page);

    // Use trigger.press to ensure events go to the right element
    await trigger.press('ArrowDown');
    await trigger.press('ArrowDown');
    await trigger.press('ArrowDown');
    await trigger.press(' ');
    await page.waitForTimeout(200);

    const value = await trigger.inputValue();
    expect(value).toBeTruthy();
    expect(value).not.toBe('JavaScript');
    expect(value).not.toBe('Python');
    expect(value).not.toBe('Ruby');
  });

  test('should toggle all group options via group header checkbox', async ({ page }) => {
    const trigger = getTrigger(page);
    await openAndWaitForListbox(trigger, page);

    // Find the "JavaScript" group header checkbox by its label text
    const listbox = page.locator('[role="listbox"]').last();
    const jsCheckbox = listbox.getByLabel('JavaScript');

    await jsCheckbox.click({ force: true });
    await page.waitForTimeout(200);

    // JavaScript options should now be selected
    const firstOption = listbox.locator('[role="option"]').first();
    const firstOptionSelected = await firstOption.getAttribute('aria-selected');
    expect(firstOptionSelected).toBe('true');

    const value = await trigger.inputValue();
    expect(value).toBeTruthy();
  });

  test('should uncheck all group options when header is clicked again', async ({ page }) => {
    const trigger = getTrigger(page);
    await openAndWaitForListbox(trigger, page);

    const listbox = page.locator('[role="listbox"]').last();
    const jsCheckbox = listbox.getByLabel('JavaScript');

    // Click to select all
    await jsCheckbox.click({ force: true });
    await page.waitForTimeout(200);

    // Click again to deselect all
    await jsCheckbox.click({ force: true });
    await page.waitForTimeout(200);

    const firstOption = listbox.locator('[role="option"]').first();
    const ariaSelected = await firstOption.getAttribute('aria-selected');
    expect(ariaSelected).toBe('false');

    const value = await trigger.inputValue();
    expect(value).toBe('');
  });

  test('should scroll to reveal options in later groups', async ({ page }) => {
    const trigger = getTrigger(page);
    await openAndWaitForListbox(trigger, page);

    const listbox = page.locator('[role="listbox"]').last();
    await listbox.evaluate((el) => (el.scrollTop = el.scrollHeight));
    await page.waitForTimeout(300);

    const text = await listbox.textContent();
    expect(text).toContain('Ruby');
  });

  test('should close dropdown on Escape', async ({ page }) => {
    const trigger = getTrigger(page);
    await openAndWaitForListbox(trigger, page);

    const listbox = page.locator('[role="listbox"]').last();
    await expect(listbox).toBeVisible();

    // Press Escape on the trigger to close
    await trigger.press('Escape');
    await page.waitForTimeout(300);

    await expect(listbox).not.toBeVisible();
  });
});
