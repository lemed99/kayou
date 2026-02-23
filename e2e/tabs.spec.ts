import { expect, test, type Page } from '@playwright/test';

const section = (page: Page, id: string) => page.locator(`#${id}`);

test.describe('Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview/tabs');
    await page.waitForLoadState('networkidle');
  });

  // ==================== Basic Rendering ====================

  test.describe('basic (uncontrolled, underline)', () => {
    const S = 'basic';

    test('renders all tab buttons', async ({ page }) => {
      await expect(section(page, S).getByRole('tab', { name: 'General' })).toBeVisible();
      await expect(section(page, S).getByRole('tab', { name: 'Settings' })).toBeVisible();
      await expect(section(page, S).getByRole('tab', { name: 'Advanced' })).toBeVisible();
    });

    test('first tab is active by default', async ({ page }) => {
      const tab = section(page, S).getByRole('tab', { name: 'General' });
      await expect(tab).toHaveAttribute('aria-selected', 'true');
      await expect(page.getByTestId('basic-content-1')).toBeVisible();
    });

    test('clicking a tab switches content', async ({ page }) => {
      await section(page, S).getByRole('tab', { name: 'Settings' }).click();

      await expect(page.getByTestId('basic-content-2')).toBeVisible();
      await expect(page.getByTestId('basic-content-1')).not.toBeVisible();
    });

    test('tablist has correct role and aria-label', async ({ page }) => {
      const tablist = section(page, S).getByRole('tablist');
      await expect(tablist).toBeVisible();
      await expect(tablist).toHaveAttribute('aria-label', 'Tabs');
    });
  });

  // ==================== ARIA Attributes ====================

  test.describe('ARIA attributes', () => {
    const S = 'basic';

    test('tabs have correct role and aria-selected', async ({ page }) => {
      const tab1 = section(page, S).getByRole('tab', { name: 'General' });
      const tab2 = section(page, S).getByRole('tab', { name: 'Settings' });

      await expect(tab1).toHaveAttribute('aria-selected', 'true');
      await expect(tab2).toHaveAttribute('aria-selected', 'false');

      await tab2.click();
      await expect(tab1).toHaveAttribute('aria-selected', 'false');
      await expect(tab2).toHaveAttribute('aria-selected', 'true');
    });

    test('tabs have aria-controls linked to panels', async ({ page }) => {
      const tab = section(page, S).getByRole('tab', { name: 'General' });
      await expect(tab).toHaveAttribute('aria-controls', 'panel-tab1');
      await expect(tab).toHaveAttribute('id', 'tab-tab1');
    });

    test('panels have correct role and aria-labelledby', async ({ page }) => {
      const panel = page.locator('#panel-tab1');
      await expect(panel).toHaveAttribute('role', 'tabpanel');
      await expect(panel).toHaveAttribute('aria-labelledby', 'tab-tab1');
    });

    test('active tab has tabindex 0, others have -1', async ({ page }) => {
      const tab1 = section(page, S).getByRole('tab', { name: 'General' });
      const tab2 = section(page, S).getByRole('tab', { name: 'Settings' });

      await expect(tab1).toHaveAttribute('tabindex', '0');
      await expect(tab2).toHaveAttribute('tabindex', '-1');
    });
  });

  // ==================== Keyboard Navigation ====================

  test.describe('keyboard navigation', () => {
    const S = 'basic';

    test('ArrowRight moves to next tab', async ({ page }) => {
      const tab1 = section(page, S).getByRole('tab', { name: 'General' });
      await tab1.focus();

      await page.keyboard.press('ArrowRight');
      const tab2 = section(page, S).getByRole('tab', { name: 'Settings' });
      await expect(tab2).toHaveAttribute('aria-selected', 'true');
      await expect(tab2).toBeFocused();
    });

    test('ArrowLeft moves to previous tab', async ({ page }) => {
      // Start on second tab
      await section(page, S).getByRole('tab', { name: 'Settings' }).click();
      const tab2 = section(page, S).getByRole('tab', { name: 'Settings' });
      await tab2.focus();

      await page.keyboard.press('ArrowLeft');
      const tab1 = section(page, S).getByRole('tab', { name: 'General' });
      await expect(tab1).toHaveAttribute('aria-selected', 'true');
      await expect(tab1).toBeFocused();
    });

    test('ArrowRight wraps from last to first', async ({ page }) => {
      await section(page, S).getByRole('tab', { name: 'Advanced' }).click();
      const tab3 = section(page, S).getByRole('tab', { name: 'Advanced' });
      await tab3.focus();

      await page.keyboard.press('ArrowRight');
      const tab1 = section(page, S).getByRole('tab', { name: 'General' });
      await expect(tab1).toHaveAttribute('aria-selected', 'true');
      await expect(tab1).toBeFocused();
    });

    test('ArrowLeft wraps from first to last', async ({ page }) => {
      const tab1 = section(page, S).getByRole('tab', { name: 'General' });
      await tab1.focus();

      await page.keyboard.press('ArrowLeft');
      const tab3 = section(page, S).getByRole('tab', { name: 'Advanced' });
      await expect(tab3).toHaveAttribute('aria-selected', 'true');
      await expect(tab3).toBeFocused();
    });

    test('Home moves to first tab', async ({ page }) => {
      await section(page, S).getByRole('tab', { name: 'Advanced' }).click();
      const tab3 = section(page, S).getByRole('tab', { name: 'Advanced' });
      await tab3.focus();

      await page.keyboard.press('Home');
      const tab1 = section(page, S).getByRole('tab', { name: 'General' });
      await expect(tab1).toHaveAttribute('aria-selected', 'true');
      await expect(tab1).toBeFocused();
    });

    test('End moves to last tab', async ({ page }) => {
      const tab1 = section(page, S).getByRole('tab', { name: 'General' });
      await tab1.focus();

      await page.keyboard.press('End');
      const tab3 = section(page, S).getByRole('tab', { name: 'Advanced' });
      await expect(tab3).toHaveAttribute('aria-selected', 'true');
      await expect(tab3).toBeFocused();
    });
  });

  // ==================== Controlled Mode ====================

  test.describe('controlled', () => {
    const S = 'controlled';

    test('starts with specified active tab', async ({ page }) => {
      await expect(page.getByTestId('controlled-active')).toHaveText('Active: ctrl-2');
      await expect(page.getByTestId('ctrl-content-2')).toBeVisible();
    });

    test('clicking tab updates controlled state', async ({ page }) => {
      await section(page, S).getByRole('tab', { name: 'One' }).click();
      await expect(page.getByTestId('controlled-active')).toHaveText('Active: ctrl-1');
      await expect(page.getByTestId('ctrl-content-1')).toBeVisible();
    });

    test('external button switches tab', async ({ page }) => {
      await section(page, S).getByRole('button', { name: 'Switch to Tab 3' }).click();
      await expect(page.getByTestId('controlled-active')).toHaveText('Active: ctrl-3');
      await expect(page.getByTestId('ctrl-content-3')).toBeVisible();
    });
  });

  // ==================== Disabled Tabs ====================

  test.describe('disabled', () => {
    const S = 'disabled';

    test('disabled tab cannot be clicked', async ({ page }) => {
      const disabledTab = section(page, S).getByRole('tab', { name: 'Disabled' });
      await expect(disabledTab).toBeDisabled();

      await disabledTab.click({ force: true });
      // First tab should still be active
      const tab1 = section(page, S).getByRole('tab', { name: 'Enabled 1' });
      await expect(tab1).toHaveAttribute('aria-selected', 'true');
    });

    test('ArrowRight skips disabled tab', async ({ page }) => {
      const tab1 = section(page, S).getByRole('tab', { name: 'Enabled 1' });
      await tab1.focus();

      await page.keyboard.press('ArrowRight');
      // Should skip Disabled and go to Enabled 2
      const tab3 = section(page, S).getByRole('tab', { name: 'Enabled 2' });
      await expect(tab3).toHaveAttribute('aria-selected', 'true');
      await expect(tab3).toBeFocused();
    });

    test('ArrowLeft skips disabled tab', async ({ page }) => {
      await section(page, S).getByRole('tab', { name: 'Enabled 2' }).click();
      const tab3 = section(page, S).getByRole('tab', { name: 'Enabled 2' });
      await tab3.focus();

      await page.keyboard.press('ArrowLeft');
      const tab1 = section(page, S).getByRole('tab', { name: 'Enabled 1' });
      await expect(tab1).toHaveAttribute('aria-selected', 'true');
      await expect(tab1).toBeFocused();
    });
  });

  // ==================== Variants ====================

  test.describe('pills variant', () => {
    test('renders pills style', async ({ page }) => {
      const tab = section(page, 'pills').getByRole('tab', { name: 'Alpha' });
      await expect(tab).toBeVisible();
      await expect(tab).toHaveClass(/rounded-lg/);
    });

    test('switching tabs works', async ({ page }) => {
      await section(page, 'pills').getByRole('tab', { name: 'Beta' }).click();
      await expect(page.getByTestId('pill-content-2')).toBeVisible();
    });
  });

  test.describe('bordered variant', () => {
    test('renders bordered style', async ({ page }) => {
      const tab = section(page, 'bordered').getByRole('tab', { name: 'First' });
      await expect(tab).toBeVisible();
      await expect(tab).toHaveClass(/rounded-t-lg/);
    });

    test('switching tabs works', async ({ page }) => {
      await section(page, 'bordered').getByRole('tab', { name: 'Second' }).click();
      await expect(page.getByTestId('brd-content-2')).toBeVisible();
    });
  });

  // ==================== Lazy Rendering ====================

  test.describe('lazy rendering', () => {
    const S = 'lazy';

    test('only active panel is in the DOM', async ({ page }) => {
      await expect(page.getByTestId('lazy-content-1')).toBeVisible();
      // Second panel should not exist in DOM (lazy)
      await expect(page.getByTestId('lazy-content-2')).not.toBeAttached();
    });

    test('switching renders new panel and removes old', async ({ page }) => {
      await section(page, S).getByRole('tab', { name: 'Deferred' }).click();

      await expect(page.getByTestId('lazy-content-2')).toBeVisible();
      await expect(page.getByTestId('lazy-content-1')).not.toBeAttached();
    });
  });
});
