import { type Locator, type Page, expect, test } from '@playwright/test';

// ==================== Helpers ====================

const scrollAndWait = async (locator: Locator) => {
  await locator.scrollIntoViewIfNeeded();
  await locator.page().waitForTimeout(200);
};

const openWithClick = async (trigger: Locator) => {
  await scrollAndWait(trigger);
  await trigger.click();
  await trigger.page().waitForTimeout(300);
};

const openWithKey = async (
  trigger: Locator,
  key: 'Enter' | ' ' | 'ArrowDown',
) => {
  await scrollAndWait(trigger);
  await trigger.focus();
  await trigger.page().waitForTimeout(100);
  await trigger.press(key);
  await trigger.page().waitForTimeout(300);
};

/** Locate element by ID safely (IDs may start with digits, so use attribute selector) */
const byId = (page: Page, id: string) => page.locator(`[id="${id}"]`);

// ==================== Select ====================

test.describe('Select - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/select');
  });

  const getSelect = (page: Page) =>
    page.getByRole('combobox', { name: 'Select a fruit' });

  test.describe('ARIA attributes', () => {
    test('should have role="combobox" on trigger', async ({ page }) => {
      const trigger = getSelect(page);
      await expect(trigger).toHaveAttribute('role', 'combobox');
    });

    test('should have aria-haspopup="listbox"', async ({ page }) => {
      const trigger = getSelect(page);
      await expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    });

    test('should have aria-expanded="false" when closed', async ({ page }) => {
      const trigger = getSelect(page);
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    test('should have aria-expanded="true" when open', async ({ page }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    test('should have aria-controls pointing to listbox id', async ({
      page,
    }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);

      const controlsId = await trigger.getAttribute('aria-controls');
      expect(controlsId).toBeTruthy();

      const listbox = byId(page, controlsId!);
      await expect(listbox).toHaveAttribute('role', 'listbox');
    });

    test('options should have role="option"', async ({ page }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);

      const options = page.locator('[role="option"]');
      const count = await options.count();
      expect(count).toBeGreaterThan(0);
    });

    test('selected option should have aria-selected="true"', async ({
      page,
    }) => {
      // "Favorite Fruit" has default value "banana" — wait for the value to appear
      const allComboboxes = page.locator('[role="combobox"]');
      // The third combobox (index 2) is the "With Default Value" example
      const trigger = allComboboxes.nth(2);
      await expect(trigger).toHaveValue('Banana', { timeout: 5000 });
      await openWithClick(trigger);

      const selected = page.locator('[role="option"][aria-selected="true"]');
      await expect(selected.first()).toBeVisible();
    });

    test('aria-activedescendant should update with keyboard navigation', async ({
      page,
    }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);

      await page.keyboard.press('ArrowDown');
      const ad = await trigger.getAttribute('aria-activedescendant');
      expect(ad).toBeTruthy();
    });
  });

  test.describe('Keyboard interaction', () => {
    test('should open with Enter key', async ({ page }) => {
      const trigger = getSelect(page);
      await openWithKey(trigger, 'Enter');

      const listbox = page.locator('[role="listbox"]').first();
      await expect(listbox).toBeVisible();
    });

    test('should open with Space key', async ({ page }) => {
      const trigger = getSelect(page);
      await openWithKey(trigger, ' ');

      const listbox = page.locator('[role="listbox"]').first();
      await expect(listbox).toBeVisible();
    });

    test('should open with ArrowDown key', async ({ page }) => {
      const trigger = getSelect(page);
      await openWithKey(trigger, 'ArrowDown');

      const listbox = page.locator('[role="listbox"]').first();
      await expect(listbox).toBeVisible();
    });

    test('should close with Escape key', async ({ page }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);

      const listbox = page.locator('[role="listbox"]').first();
      await expect(listbox).toBeVisible();

      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      await expect(listbox).not.toBeVisible();
    });

    test('should navigate down with ArrowDown', async ({ page }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);

      await page.keyboard.press('ArrowDown');
      const ad1 = await trigger.getAttribute('aria-activedescendant');

      await page.keyboard.press('ArrowDown');
      const ad2 = await trigger.getAttribute('aria-activedescendant');

      expect(ad1).toBeTruthy();
      expect(ad2).toBeTruthy();
      expect(ad1).not.toBe(ad2);
    });

    test('should navigate up with ArrowUp', async ({ page }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);

      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      const ad2 = await trigger.getAttribute('aria-activedescendant');

      await page.keyboard.press('ArrowUp');
      const ad1 = await trigger.getAttribute('aria-activedescendant');

      expect(ad1).not.toBe(ad2);
    });

    test('should select with Enter key and close', async ({ page }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);

      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);

      const listbox = page.locator('[role="listbox"]').first();
      await expect(listbox).not.toBeVisible();

      const value = await trigger.inputValue();
      expect(value).toBeTruthy();
    });

    test('should jump to first option with Home key', async ({ page }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);

      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');

      await page.keyboard.press('Home');
      const adHome = await trigger.getAttribute('aria-activedescendant');

      // Navigate down once — should be different from Home position
      await page.keyboard.press('ArrowDown');
      const adNext = await trigger.getAttribute('aria-activedescendant');
      expect(adHome).not.toBe(adNext);
    });

    test('should jump to last option with End key', async ({ page }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);

      await page.keyboard.press('End');
      const adEnd = await trigger.getAttribute('aria-activedescendant');
      expect(adEnd).toBeTruthy();

      // ArrowDown from last should stay on last
      await page.keyboard.press('ArrowDown');
      const adAfter = await trigger.getAttribute('aria-activedescendant');
      expect(adEnd).toBe(adAfter);
    });

    test('should not open when disabled', async ({ page }) => {
      // Disabled Select has value "Apple" and [disabled] attribute
      const trigger = page.locator('[role="combobox"][disabled]').first();
      await expect(trigger).toBeDisabled();
    });
  });

  test.describe('Focus management', () => {
    test('should keep focus on trigger during navigation', async ({
      page,
    }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);

      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');

      await expect(trigger).toBeFocused();
    });

    test('aria-expanded should toggle back to false after Escape', async ({
      page,
    }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');

      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test.describe('Click outside', () => {
    test('should close when clicking outside', async ({ page }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);

      const listbox = page.locator('[role="listbox"]').first();
      await expect(listbox).toBeVisible();

      await page.mouse.click(10, 10);
      await page.waitForTimeout(300);
      await expect(listbox).not.toBeVisible();
    });
  });
});

// ==================== SelectWithSearch ====================

test.describe('SelectWithSearch - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/select-with-search');
  });

  // Use .first() since "Search frameworks..." appears in multiple examples
  const getSelect = (page: Page) =>
    page.getByRole('combobox', { name: 'Search frameworks...' }).first();

  test.describe('ARIA attributes', () => {
    test('should have role="combobox"', async ({ page }) => {
      const trigger = getSelect(page);
      await expect(trigger).toHaveAttribute('role', 'combobox');
    });

    test('should have aria-haspopup="listbox"', async ({ page }) => {
      const trigger = getSelect(page);
      await expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    });

    test('should have aria-autocomplete="list"', async ({ page }) => {
      const trigger = getSelect(page);
      await expect(trigger).toHaveAttribute('aria-autocomplete', 'list');
    });

    test('should have aria-expanded="false" when closed', async ({ page }) => {
      const trigger = getSelect(page);
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    test('should have aria-expanded="true" when open', async ({ page }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    test('should have aria-controls pointing to listbox', async ({ page }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);

      const controlsId = await trigger.getAttribute('aria-controls');
      expect(controlsId).toBeTruthy();

      const listbox = byId(page, controlsId!);
      await expect(listbox).toHaveAttribute('role', 'listbox');
    });

    test('options should have role="option" with aria-selected', async ({
      page,
    }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);

      const options = page.locator('[role="option"]');
      const count = await options.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < Math.min(count, 3); i++) {
        const ariaSelected = await options.nth(i).getAttribute('aria-selected');
        expect(ariaSelected).toBeTruthy();
      }
    });

    test('aria-activedescendant should update during navigation', async ({
      page,
    }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);

      await page.keyboard.press('ArrowDown');
      const ad = await trigger.getAttribute('aria-activedescendant');
      expect(ad).toBeTruthy();
    });
  });

  test.describe('Keyboard interaction', () => {
    test('should open with Enter key', async ({ page }) => {
      const trigger = getSelect(page);
      await openWithKey(trigger, 'Enter');

      const listbox = page.locator('[role="listbox"]').first();
      await expect(listbox).toBeVisible();
    });

    test('should open with ArrowDown key', async ({ page }) => {
      const trigger = getSelect(page);
      await openWithKey(trigger, 'ArrowDown');

      const listbox = page.locator('[role="listbox"]').first();
      await expect(listbox).toBeVisible();
    });

    test('should close with Escape key', async ({ page }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);

      const listbox = page.locator('[role="listbox"]').first();
      await expect(listbox).toBeVisible();

      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      await expect(listbox).not.toBeVisible();
    });

    test('should select option with Enter after navigation', async ({
      page,
    }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);

      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);

      const listbox = page.locator('[role="listbox"]').first();
      await expect(listbox).not.toBeVisible();
    });

    test('should filter options when typing', async ({ page }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);

      const optionsBefore = await page.locator('[role="option"]').count();

      await trigger.fill('Sol');
      await page.waitForTimeout(200);

      const optionsAfter = await page.locator('[role="option"]').count();
      expect(optionsAfter).toBeLessThanOrEqual(optionsBefore);
      expect(optionsAfter).toBeGreaterThan(0);
    });

    test('should navigate with Home and End keys', async ({ page }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);

      await page.keyboard.press('End');
      const adEnd = await trigger.getAttribute('aria-activedescendant');
      expect(adEnd).toBeTruthy();

      await page.keyboard.press('Home');
      const adHome = await trigger.getAttribute('aria-activedescendant');
      expect(adHome).toBeTruthy();
      expect(adHome).not.toBe(adEnd);
    });
  });

  test.describe('Focus management', () => {
    test('search input should be focused when opened by click', async ({
      page,
    }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);

      // For SelectWithSearch, the search input IS the trigger
      await expect(trigger).toBeFocused();
    });

    test('should remain focused during arrow navigation', async ({ page }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);

      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');

      await expect(trigger).toBeFocused();
    });
  });

  test.describe('Click outside', () => {
    test('should close when clicking outside', async ({ page }) => {
      const trigger = getSelect(page);
      await openWithClick(trigger);

      const listbox = page.locator('[role="listbox"]').first();
      await expect(listbox).toBeVisible();

      await page.mouse.click(10, 10);
      await page.waitForTimeout(300);
      await expect(listbox).not.toBeVisible();
    });
  });
});

// ==================== MultiSelect (no search) ====================

test.describe('MultiSelect - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Suppress ResizeObserver loop errors that trigger SolidStart's dev overlay
    await page.addInitScript(() => {
      window.addEventListener(
        'error',
        (e) => {
          if (e.message?.includes('ResizeObserver')) e.stopImmediatePropagation();
        },
        true,
      );
    });
    await page.goto('/ui/multi-select');
  });

  const getMultiSelect = (page: Page) =>
    page.getByRole('combobox', { name: 'Select frameworks' }).first();

  test.describe('ARIA attributes', () => {
    test('should have role="combobox"', async ({ page }) => {
      const trigger = getMultiSelect(page);
      await expect(trigger).toHaveAttribute('role', 'combobox');
    });

    test('should have aria-haspopup="listbox"', async ({ page }) => {
      const trigger = getMultiSelect(page);
      await expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
    });

    test('should have aria-expanded="false" when closed', async ({ page }) => {
      const trigger = getMultiSelect(page);
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    test('should have aria-expanded="true" when open', async ({ page }) => {
      const trigger = getMultiSelect(page);
      await openWithClick(trigger);
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    test('should have aria-controls pointing to listbox', async ({ page }) => {
      const trigger = getMultiSelect(page);
      await openWithClick(trigger);

      const controlsId = await trigger.getAttribute('aria-controls');
      expect(controlsId).toBeTruthy();

      const listbox = byId(page, controlsId!);
      await expect(listbox).toHaveAttribute('role', 'listbox');
    });

    test('listbox should have aria-multiselectable="true"', async ({
      page,
    }) => {
      const trigger = getMultiSelect(page);
      await openWithClick(trigger);

      const controlsId = await trigger.getAttribute('aria-controls');
      const listbox = byId(page, controlsId!);
      await expect(listbox).toHaveAttribute('aria-multiselectable', 'true');
    });

    test('options should have role="option"', async ({ page }) => {
      const trigger = getMultiSelect(page);
      await openWithClick(trigger);

      const options = page.locator('[role="option"]');
      const count = await options.count();
      expect(count).toBeGreaterThan(0);
    });

    test('option aria-selected should toggle on selection', async ({
      page,
    }) => {
      const trigger = getMultiSelect(page);
      await openWithClick(trigger);

      const firstOption = page.locator('[role="option"]').first();
      await expect(firstOption).toHaveAttribute('aria-selected', 'false');

      await firstOption.click();
      await page.waitForTimeout(200);
      await expect(firstOption).toHaveAttribute('aria-selected', 'true');

      await firstOption.click();
      await page.waitForTimeout(200);
      await expect(firstOption).toHaveAttribute('aria-selected', 'false');
    });
  });

  test.describe('Keyboard interaction', () => {
    test('should open with Enter key', async ({ page }) => {
      const trigger = getMultiSelect(page);
      await openWithKey(trigger, 'Enter');

      const listbox = page.locator('[role="listbox"]').first();
      await expect(listbox).toBeVisible();
    });

    test('should open with Space key', async ({ page }) => {
      const trigger = getMultiSelect(page);
      await openWithKey(trigger, ' ');

      const listbox = page.locator('[role="listbox"]').first();
      await expect(listbox).toBeVisible();
    });

    test('should open with ArrowDown key', async ({ page }) => {
      const trigger = getMultiSelect(page);
      await openWithKey(trigger, 'ArrowDown');

      const listbox = page.locator('[role="listbox"]').first();
      await expect(listbox).toBeVisible();
    });

    test('should close with Escape key', async ({ page }) => {
      const trigger = getMultiSelect(page);
      await openWithClick(trigger);

      const listbox = page.locator('[role="listbox"]').first();
      await expect(listbox).toBeVisible();

      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      await expect(listbox).not.toBeVisible();
    });

    test('should navigate with ArrowDown and ArrowUp', async ({ page }) => {
      const trigger = getMultiSelect(page);
      await openWithClick(trigger);

      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowUp');

      const listbox = page.locator('[role="listbox"]').first();
      await expect(listbox).toBeVisible();
    });

    test('should toggle selection with Enter key', async ({ page }) => {
      const trigger = getMultiSelect(page);
      await openWithClick(trigger);

      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);

      // Should stay open (multi-select)
      const listbox = page.locator('[role="listbox"]').first();
      await expect(listbox).toBeVisible();

      const firstOption = page.locator('[role="option"]').first();
      await expect(firstOption).toHaveAttribute('aria-selected', 'true');
    });

    test('should navigate with Home and End keys', async ({ page }) => {
      const trigger = getMultiSelect(page);
      await openWithClick(trigger);

      await page.keyboard.press('End');
      const listbox = page.locator('[role="listbox"]').first();
      await expect(listbox).toBeVisible();

      await page.keyboard.press('Home');
      await expect(listbox).toBeVisible();
    });
  });

  test.describe('Focus management', () => {
    test('should keep focus on trigger during navigation', async ({
      page,
    }) => {
      const trigger = getMultiSelect(page);
      await openWithClick(trigger);

      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');

      await expect(trigger).toBeFocused();
    });
  });

  test.describe('Click outside', () => {
    test('should close when clicking outside', async ({ page }) => {
      const trigger = getMultiSelect(page);
      await openWithClick(trigger);

      const listbox = page.locator('[role="listbox"]').first();
      await expect(listbox).toBeVisible();

      await page.mouse.click(10, 10);
      await page.waitForTimeout(300);
      await expect(listbox).not.toBeVisible();
    });
  });
});

// ==================== MultiSelect with Search ====================

test.describe('MultiSelect with Search - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Suppress ResizeObserver loop errors that trigger SolidStart's dev overlay
    await page.addInitScript(() => {
      window.addEventListener(
        'error',
        (e) => {
          if (e.message?.includes('ResizeObserver')) e.stopImmediatePropagation();
        },
        true,
      );
    });
    await page.goto('/ui/multi-select');
  });

  const getSearchMultiSelect = (page: Page) =>
    page.getByRole('combobox', { name: 'Select countries' });

  test.describe('Search input focus', () => {
    test('should focus search input when opened with click', async ({
      page,
    }) => {
      const trigger = getSearchMultiSelect(page);
      await openWithClick(trigger);

      const searchInput = page.locator(
        'input[aria-label="Search options"]',
      );
      await expect(searchInput.first()).toBeFocused();
    });

    test('should focus search input when opened with Enter key', async ({
      page,
    }) => {
      const trigger = getSearchMultiSelect(page);
      await openWithKey(trigger, 'Enter');

      const searchInput = page.locator(
        'input[aria-label="Search options"]',
      );
      await expect(searchInput.first()).toBeFocused();
    });

    test('should focus search input when opened with Space key', async ({
      page,
    }) => {
      const trigger = getSearchMultiSelect(page);
      await openWithKey(trigger, ' ');

      const searchInput = page.locator(
        'input[aria-label="Search options"]',
      );
      await expect(searchInput.first()).toBeFocused();
    });

    test('should focus search input when opened with ArrowDown key', async ({
      page,
    }) => {
      const trigger = getSearchMultiSelect(page);
      await openWithKey(trigger, 'ArrowDown');

      const searchInput = page.locator(
        'input[aria-label="Search options"]',
      );
      await expect(searchInput.first()).toBeFocused();
    });

    test('should return focus to search after selecting an option', async ({
      page,
    }) => {
      const trigger = getSearchMultiSelect(page);
      await openWithClick(trigger);

      const searchInput = page.locator(
        'input[aria-label="Search options"]',
      );
      await expect(searchInput.first()).toBeFocused();

      const firstOption = page.locator('[role="option"]').first();
      await firstOption.click();
      await page.waitForTimeout(200);

      await expect(searchInput.first()).toBeFocused();
    });
  });

  test.describe('Search filtering', () => {
    test('should filter options when typing', async ({ page }) => {
      const trigger = getSearchMultiSelect(page);
      await openWithClick(trigger);

      const searchInput = page.locator(
        'input[aria-label="Search options"]',
      ).first();
      const optionsBefore = await page.locator('[role="option"]').count();

      await searchInput.fill('United');
      await page.waitForTimeout(200);

      const optionsAfter = await page.locator('[role="option"]').count();
      expect(optionsAfter).toBeLessThan(optionsBefore);
      expect(optionsAfter).toBeGreaterThan(0);
    });

    test('search input should have aria-controls pointing to listbox', async ({
      page,
    }) => {
      const trigger = getSearchMultiSelect(page);
      await openWithClick(trigger);

      const searchInput = page.locator(
        'input[aria-label="Search options"]',
      ).first();
      const controlsId = await searchInput.getAttribute('aria-controls');
      expect(controlsId).toBeTruthy();

      const listbox = byId(page, controlsId!);
      await expect(listbox).toHaveAttribute('role', 'listbox');
    });

    test('search input should have accessible label', async ({ page }) => {
      const trigger = getSearchMultiSelect(page);
      await openWithClick(trigger);

      const searchInput = page.locator(
        'input[aria-label="Search options"]',
      ).first();
      await expect(searchInput).toBeVisible();

      const ariaLabel = await searchInput.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    });
  });

  test.describe('Keyboard navigation from search input', () => {
    test('should navigate options with ArrowDown from search', async ({
      page,
    }) => {
      const trigger = getSearchMultiSelect(page);
      await openWithClick(trigger);

      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');

      const listbox = page.locator('[role="listbox"]').first();
      await expect(listbox).toBeVisible();
    });

    test('should select option with Enter from search', async ({ page }) => {
      const trigger = getSearchMultiSelect(page);
      await openWithClick(trigger);

      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);

      // Should remain open (multi-select)
      const listbox = page.locator('[role="listbox"]').first();
      await expect(listbox).toBeVisible();

      const firstOption = page.locator('[role="option"]').first();
      await expect(firstOption).toHaveAttribute('aria-selected', 'true');
    });

    test('should close with Escape from search input', async ({ page }) => {
      const trigger = getSearchMultiSelect(page);
      await openWithClick(trigger);

      const searchInput = page.locator(
        'input[aria-label="Search options"]',
      ).first();
      await expect(searchInput).toBeFocused();

      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);

      const listbox = page.locator('[role="listbox"]').first();
      await expect(listbox).not.toBeVisible();
    });

    test('should return focus to trigger after Escape from search input', async ({ page }) => {
      const trigger = getSearchMultiSelect(page);
      await openWithClick(trigger);

      const searchInput = page.locator(
        'input[aria-label="Search options"]',
      ).first();
      await expect(searchInput).toBeFocused();

      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);

      // Focus should return to the combobox trigger
      await expect(trigger).toBeFocused();
    });
  });
});
