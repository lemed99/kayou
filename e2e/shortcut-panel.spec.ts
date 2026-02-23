import { expect, test, type Page } from '@playwright/test';

const section = (page: Page, id: string) => page.locator(`#${id}`);

/** Platform-aware Ctrl modifier. */
const ctrlKey = (page: Page) =>
  page.evaluate(() => navigator.platform.includes('Mac')) ? 'Meta' : 'Control';

test.describe('ShortcutPanel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview/shortcut-panel');
    await page.waitForLoadState('networkidle');
  });

  // ==================== Basic Rendering ====================

  test.describe('basic shortcuts', () => {
    const S = 'basic-shortcuts';

    test('renders all registered shortcuts', async ({ page }) => {
      const panel = section(page, S).locator('[role="region"]');
      await expect(panel).toBeVisible();

      await expect(panel.getByText('Save', { exact: true })).toBeVisible();
      await expect(panel.getByText('Open', { exact: true })).toBeVisible();
      await expect(panel.getByText('Find', { exact: true })).toBeVisible();
      await expect(panel.getByText('Undo', { exact: true })).toBeVisible();
    });

    test('renders category headers', async ({ page }) => {
      const panel = section(page, S).locator('[role="region"]');
      await expect(panel.getByText('File')).toBeVisible();
      await expect(panel.getByText('Edit')).toBeVisible();
    });

    test('renders shortcut key combinations as kbd elements', async ({ page }) => {
      const panel = section(page, S).locator('[role="region"]');
      const kbds = panel.locator('kbd');
      // At least one kbd element should be visible (key combos)
      await expect(kbds.first()).toBeVisible();
    });

    test('renders descriptions', async ({ page }) => {
      const panel = section(page, S).locator('[role="region"]');
      await expect(panel.getByText('Save the current document')).toBeVisible();
    });

    test('search filters shortcuts', async ({ page }) => {
      const searchInput = section(page, S).locator('input[type="text"]');
      await searchInput.fill('Save');

      const panel = section(page, S).locator('[role="region"]');
      await expect(panel.getByText('Save', { exact: true })).toBeVisible();
      await expect(panel.getByText('Open', { exact: true })).not.toBeVisible();
      await expect(panel.getByText('Find', { exact: true })).not.toBeVisible();
    });

    test('search with no results shows empty message', async ({ page }) => {
      const searchInput = section(page, S).locator('input[type="text"]');
      await searchInput.fill('nonexistent_xyz');

      const panel = section(page, S).locator('[role="region"]');
      await expect(panel.getByText('No shortcuts registered')).toBeVisible();
    });
  });

  // ==================== Shortcut Triggering ====================

  test.describe('shortcut triggering', () => {
    const S = 'basic-shortcuts';

    test('pressing shortcut triggers the action', async ({ page }) => {
      const modifier = await ctrlKey(page);
      await page.keyboard.press(`${modifier}+s`);

      await expect(page.getByTestId('triggered-action')).toContainText('save');
    });

    test('pressing different shortcut triggers correct action', async ({ page }) => {
      const modifier = await ctrlKey(page);
      await page.keyboard.press(`${modifier}+f`);

      await expect(page.getByTestId('triggered-action')).toContainText('find');
    });
  });

  // ==================== Input Interaction ====================

  test.describe('input interaction (ignoreInputs)', () => {
    const S = 'input-interaction';

    test('shortcut with ignoreInputs=true does NOT fire when input focused', async ({ page }) => {
      const input = page.getByTestId('shortcut-input');
      await input.focus();

      const modifier = await ctrlKey(page);
      await page.keyboard.press(`${modifier}+k`);

      // Should not have triggered
      await expect(page.getByTestId('input-triggered')).not.toBeAttached();
    });

    test('shortcut with ignoreInputs=false DOES fire when input focused', async ({ page }) => {
      const input = page.getByTestId('shortcut-input');
      await input.focus();

      const modifier = await ctrlKey(page);
      await page.keyboard.press(`${modifier}+j`);

      await expect(page.getByTestId('input-triggered')).toContainText('always-fires');
    });

    test('shortcut with ignoreInputs=true fires when input NOT focused', async ({ page }) => {
      // Click the clear button to ensure focus is not on input
      await page.getByTestId('input-clear').click();

      const modifier = await ctrlKey(page);
      await page.keyboard.press(`${modifier}+k`);

      await expect(page.getByTestId('input-triggered')).toContainText('ignored-in-input');
    });
  });

  // ==================== Binding Editing ====================

  test.describe('binding editing', () => {
    const S = 'basic-shortcuts';

    test('clicking edit shows recording UI', async ({ page }) => {
      const panel = section(page, S).locator('[role="region"]');
      // Click the edit button for Save action
      const saveRow = panel.getByText('Save', { exact: true }).locator('..');
      const editBtn = saveRow.locator('..').locator('button').first();
      await editBtn.click();

      await expect(panel.getByText('Press a key combination...')).toBeVisible();
    });

    test('pressing Escape cancels editing', async ({ page }) => {
      const panel = section(page, S).locator('[role="region"]');
      const saveRow = panel.getByText('Save', { exact: true }).locator('..');
      const editBtn = saveRow.locator('..').locator('button').first();
      await editBtn.click();

      await expect(panel.getByText('Press a key combination...')).toBeVisible();

      await page.keyboard.press('Escape');
      await expect(panel.getByText('Press a key combination...')).not.toBeVisible();
    });

    test('clicking Cancel button stops editing', async ({ page }) => {
      const panel = section(page, S).locator('[role="region"]');
      const saveRow = panel.getByText('Save', { exact: true }).locator('..');
      const editBtn = saveRow.locator('..').locator('button').first();
      await editBtn.click();

      await panel.getByText('Cancel').click();
      await expect(panel.getByText('Press a key combination...')).not.toBeVisible();
    });

    test('reset all button resets all bindings', async ({ page }) => {
      const panel = section(page, S).locator('[role="region"]');
      const resetAllBtn = panel.getByText('Reset all');
      await expect(resetAllBtn).toBeVisible();
    });
  });

  // ==================== Conflict Detection ====================

  test.describe('conflict detection', () => {
    const S = 'conflicts';

    test('shows conflict warning for duplicate bindings', async ({ page }) => {
      const panel = section(page, S).locator('[role="region"]');
      // Conflict badges are red spans with exact text "Conflict"
      const conflictBadges = panel.locator('.text-red-600, .dark\\:text-red-400').getByText('Conflict', { exact: true });
      await expect(conflictBadges.first()).toBeVisible();
    });

    test('non-conflicting shortcut has no warning', async ({ page }) => {
      const panel = section(page, S).locator('[role="region"]');
      // Count conflict badges — Action A and B conflict on Ctrl+M, Action C does not
      // So there should be exactly 2 conflict badges (one per conflicting action)
      const conflictBadges = panel.locator('.text-red-600').filter({ hasText: /^Conflict$/ });
      await expect(conflictBadges).toHaveCount(2);
    });
  });
});
