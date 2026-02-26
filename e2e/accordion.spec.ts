import { expect, test } from '@playwright/test';

test.describe('Accordion', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate via client-side routing to avoid pre-existing SSR hydration mismatch
    await page.goto('/components/button');
    await page.waitForLoadState('networkidle');
    // Use JS-based navigation to trigger client-side routing
    await page.evaluate(() => {
      const link = document.querySelector('a[href="/ui/accordion"]') as HTMLAnchorElement;
      link?.click();
    });
    await page.waitForURL('/components/accordion');
    await page.locator('#accordion-trigger-basic-1').waitFor({ state: 'visible' });
  });

  // ==================== Basic Rendering ====================

  test('should render panels with titles', async ({ page }) => {
    const trigger = page.locator('#accordion-trigger-basic-1');
    await expect(trigger).toBeVisible();
    await expect(trigger).toContainText('What is SolidJS?');
  });

  test('should render chevron icon in panel header', async ({ page }) => {
    const trigger = page.locator('#accordion-trigger-basic-1');
    const svg = trigger.locator('svg');
    await expect(svg).toBeVisible();
  });

  // ==================== Expand/Collapse ====================

  test('should expand panel on click and show content', async ({ page }) => {
    const trigger = page.locator('#accordion-trigger-basic-1');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const panel = page.locator('#accordion-panel-basic-1');
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('SolidJS is a declarative JavaScript library');
  });

  test('should collapse panel on second click', async ({ page }) => {
    const trigger = page.locator('#accordion-trigger-basic-1');

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('should allow multiple panels open simultaneously', async ({ page }) => {
    const trigger1 = page.locator('#accordion-trigger-basic-1');
    const trigger2 = page.locator('#accordion-trigger-basic-2');

    await trigger1.click();
    await expect(trigger1).toHaveAttribute('aria-expanded', 'true');

    await trigger2.click();
    await expect(trigger2).toHaveAttribute('aria-expanded', 'true');
    // First panel stays open
    await expect(trigger1).toHaveAttribute('aria-expanded', 'true');
  });

  test('should rotate chevron when expanded', async ({ page }) => {
    const trigger = page.locator('#accordion-trigger-basic-1');
    const chevron = trigger.locator('svg');

    await expect(chevron).not.toHaveClass(/rotate-90/);

    await trigger.click();
    await expect(chevron).toHaveClass(/rotate-90/);
  });

  // ==================== Accessibility ====================

  test('should have correct ARIA attributes', async ({ page }) => {
    const trigger = page.locator('#accordion-trigger-basic-1');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toHaveAttribute('aria-controls', 'accordion-panel-basic-1');

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const panel = page.locator('#accordion-panel-basic-1');
    await expect(panel).toHaveAttribute('role', 'region');
    await expect(panel).toHaveAttribute('aria-labelledby', 'accordion-trigger-basic-1');
  });

  // ==================== Keyboard Navigation ====================

  test('should toggle panel with Enter key', async ({ page }) => {
    const trigger = page.locator('#accordion-trigger-basic-1');
    await trigger.focus();

    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('should toggle panel with Space key', async ({ page }) => {
    const trigger = page.locator('#accordion-trigger-basic-1');
    await trigger.focus();

    await page.keyboard.press('Space');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Space');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  // ==================== Exclusive Mode ====================

  test('should close other panels in exclusive mode', async ({ page }) => {
    const trigger1 = page.locator('#accordion-trigger-exc-1');
    const trigger2 = page.locator('#accordion-trigger-exc-2');

    await trigger1.click();
    await expect(trigger1).toHaveAttribute('aria-expanded', 'true');

    await trigger2.click();
    await expect(trigger2).toHaveAttribute('aria-expanded', 'true');
    // First panel should be closed
    await expect(trigger1).toHaveAttribute('aria-expanded', 'false');
  });

  // ==================== Controlled Mode ====================

  test('should start with controlled panel open', async ({ page }) => {
    const trigger = page.locator('#accordion-trigger-ctrl-1');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(trigger).toContainText('Panel 1 (starts open)');
  });

  test('should toggle panel via external button', async ({ page }) => {
    const trigger2 = page.locator('#accordion-trigger-ctrl-2');
    await expect(trigger2).toHaveAttribute('aria-expanded', 'false');

    const toggleBtn = page.locator('button').filter({ hasText: 'Toggle Panel 2' });
    await toggleBtn.click();
    await expect(trigger2).toHaveAttribute('aria-expanded', 'true');

    await toggleBtn.click();
    await expect(trigger2).toHaveAttribute('aria-expanded', 'false');
  });

  // ==================== Highlighted Panel ====================

  test('should highlight panel when button is clicked', async ({ page }) => {
    const highlightBtn = page.locator('button').filter({ hasText: 'Highlight Panel 3' });
    await highlightBtn.click();

    const trigger = page.locator('#accordion-trigger-hl-3');
    await expect(trigger).toHaveClass(/bg-yellow-200/);
  });

  test('should clear highlight when clear button is clicked', async ({ page }) => {
    const highlightBtn = page.locator('button').filter({ hasText: 'Highlight Panel 3' });
    const clearBtn = page.locator('button').filter({ hasText: 'Clear' });

    await highlightBtn.click();
    const trigger = page.locator('#accordion-trigger-hl-3');
    await expect(trigger).toHaveClass(/bg-yellow-200/);

    await clearBtn.click();
    await expect(trigger).not.toHaveClass(/bg-yellow-200/);
  });

  // ==================== Separated Cards ====================

  test('should render separated panels with gap', async ({ page }) => {
    const item = page.locator('#accordion-item-sep-1');
    await expect(item).toBeVisible();
    await expect(item).toHaveClass(/rounded-lg/);
    await expect(item).toHaveClass(/border/);
  });

  // ==================== Rapid Interaction ====================

  test('should handle rapid clicking with correct final state', async ({ page }) => {
    const trigger = page.locator('#accordion-trigger-basic-1');

    // 4 clicks = even number = back to closed
    await trigger.click();
    await trigger.click();
    await trigger.click();
    await trigger.click();

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
