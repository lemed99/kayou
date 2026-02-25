import { expect, test, type Page } from '@playwright/test';

const section = (page: Page, id: string) => page.locator(`#${id}`);

/** Platform-aware Ctrl modifier. */
const ctrlKey = async (page: Page) =>
  (await page.evaluate(() => navigator.platform.includes('Mac'))) ? 'Meta' : 'Control';

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
      const editBtn = panel.getByRole('button', { name: 'Edit shortcut: Save' });
      await editBtn.click();

      await expect(panel.getByText('Press a key combination...')).toBeVisible();
    });

    test('pressing Escape cancels editing', async ({ page }) => {
      const panel = section(page, S).locator('[role="region"]');
      const editBtn = panel.getByRole('button', { name: 'Edit shortcut: Save' });
      await editBtn.click();

      await expect(panel.getByText('Press a key combination...')).toBeVisible();

      await page.keyboard.press('Escape');
      await expect(panel.getByText('Press a key combination...')).not.toBeVisible();
    });

    test('clicking Cancel button stops editing', async ({ page }) => {
      const panel = section(page, S).locator('[role="region"]');
      const editBtn = panel.getByRole('button', { name: 'Edit shortcut: Save' });
      await editBtn.click();

      await panel.getByText('Cancel').click();
      await expect(panel.getByText('Press a key combination...')).not.toBeVisible();
    });

    test('recording a new key combo updates the binding', async ({ page }) => {
      const panel = section(page, S).locator('[role="region"]');
      const editBtn = panel.getByRole('button', { name: 'Edit shortcut: Save' });
      await editBtn.click();

      await expect(panel.getByText('Press a key combination...')).toBeVisible();

      // Record a new binding: Ctrl+Shift+S
      const modifier = await ctrlKey(page);
      await page.keyboard.press(`${modifier}+Shift+s`);

      // Recording UI should disappear
      await expect(panel.getByText('Press a key combination...')).not.toBeVisible();
      // New binding should show a Reset button (since it differs from default)
      await expect(panel.getByText('Reset').first()).toBeVisible();

      // The new shortcut should trigger correctly
      await page.keyboard.press(`${modifier}+Shift+s`);
      await expect(page.getByTestId('triggered-action')).toContainText('save');
    });

    test('reset all button resets all bindings to defaults', async ({ page }) => {
      const panel = section(page, S).locator('[role="region"]');

      // First rebind Save to Ctrl+Shift+S
      const editBtn = panel.getByRole('button', { name: 'Edit shortcut: Save' });
      await editBtn.click();
      const modifier = await ctrlKey(page);
      await page.keyboard.press(`${modifier}+Shift+s`);

      // Confirm the Reset button appeared (custom binding)
      await expect(panel.getByText('Reset').first()).toBeVisible();

      // Click Reset all
      await panel.getByText('Reset all').click();

      // Per-action Reset button should disappear (all bindings are defaults)
      await expect(panel.getByText('Reset', { exact: true })).not.toBeVisible();

      // Original Ctrl+S should work again
      await page.keyboard.press(`${modifier}+s`);
      await expect(page.getByTestId('triggered-action')).toContainText('save');
    });
  });

  // ==================== Conflict Detection ====================

  test.describe('conflict detection', () => {
    const S = 'conflicts';

    test('shows conflict warning for duplicate bindings', async ({ page }) => {
      const panel = section(page, S).locator('[role="region"]');
      const conflictBadges = panel.getByText('Conflict', { exact: true });
      await expect(conflictBadges.first()).toBeVisible();
    });

    test('exactly two conflict badges for two conflicting actions', async ({ page }) => {
      const panel = section(page, S).locator('[role="region"]');
      // Action A and B conflict on Ctrl+M, Action C does not
      const conflictBadges = panel.getByText('Conflict', { exact: true });
      await expect(conflictBadges).toHaveCount(2);
    });
  });
});
