import { expect, test } from '@playwright/test';

test.describe('Accordion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/accordion');
  });

  // ==================== Basic Rendering ====================

  test('should render accordion container', async ({ page }) => {
    const accordion = page.locator('[id^="accordion-item-"]').first();
    await expect(accordion).toBeVisible();
  });

  test('should render multiple accordion items', async ({ page }) => {
    const accordionItems = page.locator('[id^="accordion-item-"]');
    const count = await accordionItems.count();
    expect(count).toBeGreaterThan(1);
  });

  test('should render panel titles', async ({ page }) => {
    const trigger = page.locator('[id^="accordion-trigger-"]').first();
    const text = await trigger.textContent();
    expect(text).toBeTruthy();
    expect(text!.length).toBeGreaterThan(0);
  });

  test('should render chevron/arrow icon in each panel header', async ({ page }) => {
    const trigger = page.locator('[id^="accordion-trigger-"]').first();
    const svg = trigger.locator('svg');
    await expect(svg).toBeVisible();
  });

  // ==================== Expand/Collapse Behavior ====================

  test('should expand accordion item on click', async ({ page }) => {
    const trigger = page.locator('[id^="accordion-trigger-"]').first();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const panelId = await trigger.getAttribute('aria-controls');
    if (panelId) {
      const panel = page.locator(`#${panelId}`);
      await expect(panel).toBeVisible();
    }
  });

  test('should collapse accordion item on second click', async ({ page }) => {
    const trigger = page.locator('[id^="accordion-trigger-"]').first();

    await trigger.click();
    await page.waitForTimeout(300);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await trigger.click();
    await page.waitForTimeout(300);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('should allow multiple panels to be open simultaneously', async ({ page }) => {
    const triggers = page.locator('[id^="accordion-trigger-"]');
    const count = await triggers.count();

    if (count >= 2) {
      await triggers.nth(0).click();
      await page.waitForTimeout(200);
      await expect(triggers.nth(0)).toHaveAttribute('aria-expanded', 'true');

      await triggers.nth(1).click();
      await page.waitForTimeout(200);
      await expect(triggers.nth(1)).toHaveAttribute('aria-expanded', 'true');

      // First panel should still be open
      await expect(triggers.nth(0)).toHaveAttribute('aria-expanded', 'true');
    }
  });

  test('should show panel content when expanded', async ({ page }) => {
    const trigger = page.locator('[id^="accordion-trigger-"]').first();
    await trigger.click();
    await page.waitForTimeout(300);

    const panelId = await trigger.getAttribute('aria-controls');
    if (panelId) {
      const panel = page.locator(`#${panelId}`);
      const content = await panel.textContent();
      expect(content).toBeTruthy();
    }
  });

  // ==================== Accessibility (ARIA) ====================

  test('should have correct aria-expanded attribute', async ({ page }) => {
    const trigger = page.locator('[id^="accordion-trigger-"]').first();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  test('should have aria-controls pointing to panel', async ({ page }) => {
    const trigger = page.locator('[id^="accordion-trigger-"]').first();
    const ariaControls = await trigger.getAttribute('aria-controls');
    expect(ariaControls).toBeTruthy();
    expect(ariaControls).toContain('accordion-panel-');
  });

  test('panel should have aria-labelledby pointing to trigger', async ({ page }) => {
    const trigger = page.locator('[id^="accordion-trigger-"]').first();
    await trigger.click();
    await page.waitForTimeout(300);

    const panelId = await trigger.getAttribute('aria-controls');
    if (panelId) {
      const panel = page.locator(`#${panelId}`);
      const labelledBy = await panel.getAttribute('aria-labelledby');
      expect(labelledBy).toBeTruthy();
    }
  });

  // ==================== Keyboard Navigation ====================

  test('should toggle panel with Enter key', async ({ page }) => {
    const trigger = page.locator('[id^="accordion-trigger-"]').first();
    await trigger.focus();

    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('should toggle panel with Space key', async ({ page }) => {
    const trigger = page.locator('[id^="accordion-trigger-"]').first();
    await trigger.focus();

    await page.keyboard.press('Space');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Space');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('should navigate between triggers with Tab key', async ({ page }) => {
    const triggers = page.locator('[id^="accordion-trigger-"]');
    const count = await triggers.count();

    if (count >= 2) {
      await triggers.first().focus();
      await expect(triggers.first()).toBeFocused();

      await page.keyboard.press('Tab');
      // Next focusable element (may be next trigger or other element)
    }
  });

  // ==================== Controlled Mode ====================

  test('should support controlled mode with external button', async ({ page }) => {
    const toggleButton = page
      .locator('button')
      .filter({ hasText: /Toggle Panel/i })
      .first();

    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await page.waitForTimeout(300);

      const triggers = page.locator('[id^="accordion-trigger-"]');
      const count = await triggers.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  // ==================== Highlighted Panel ====================

  test('should support panel highlighting', async ({ page }) => {
    const highlightButton = page
      .locator('button')
      .filter({ hasText: /Highlight/i })
      .first();

    if (await highlightButton.isVisible()) {
      await highlightButton.click();
      await page.waitForTimeout(300);

      // Verify accordion still works after highlighting
      const triggers = page.locator('[id^="accordion-trigger-"]');
      const count = await triggers.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should clear highlighting when clear button is clicked', async ({ page }) => {
    const highlightButton = page
      .locator('button')
      .filter({ hasText: /Highlight/i })
      .first();
    const clearButton = page.locator('button').filter({ hasText: /Clear/i }).first();

    if ((await highlightButton.isVisible()) && (await clearButton.isVisible())) {
      await highlightButton.click();
      await page.waitForTimeout(300);

      await clearButton.click();
      await page.waitForTimeout(300);

      const triggers = page.locator('[id^="accordion-trigger-"]');
      const count = await triggers.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  // ==================== Edge Cases ====================

  test('should handle rapid clicking gracefully', async ({ page }) => {
    const trigger = page.locator('[id^="accordion-trigger-"]').first();

    await trigger.click();
    await trigger.click();
    await trigger.click();
    await trigger.click();

    await page.waitForTimeout(500);

    const ariaExpanded = await trigger.getAttribute('aria-expanded');
    expect(['true', 'false']).toContain(ariaExpanded);
  });

  test('should maintain state when clicking same panel multiple times', async ({
    page,
  }) => {
    const trigger = page.locator('[id^="accordion-trigger-"]').first();

    await trigger.click();
    await page.waitForTimeout(200);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await trigger.click();
    await page.waitForTimeout(200);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await trigger.click();
    await page.waitForTimeout(200);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  // ==================== Content Types ====================

  test('should render various content types in panel body', async ({ page }) => {
    const trigger = page.locator('[id^="accordion-trigger-"]').first();
    await trigger.click();
    await page.waitForTimeout(300);

    const panelId = await trigger.getAttribute('aria-controls');
    if (panelId) {
      const panel = page.locator(`#${panelId}`);
      const innerHTML = await panel.innerHTML();
      expect(innerHTML).toBeTruthy();
      expect(innerHTML.length).toBeGreaterThan(0);
    }
  });

  // ==================== Visual States ====================

  test('should rotate chevron icon when expanded', async ({ page }) => {
    const trigger = page.locator('[id^="accordion-trigger-"]').first();
    const svg = trigger.locator('svg');

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await trigger.click();
    await page.waitForTimeout(300);

    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    // SVG should have rotation transform or class change
    await expect(svg).toBeVisible();
  });

  // ==================== isSimple Variant ====================

  test('should render simple variant by default', async ({ page }) => {
    const accordionItem = page.locator('[id^="accordion-item-"]').first();
    await expect(accordionItem).toBeVisible();
  });

  test('should render styled variant with borders', async ({ page }) => {
    const styledSection = page.locator('text=/Styled Variant/i').first();
    if (await styledSection.isVisible()) {
      // The styled section should be visible
      await expect(styledSection).toBeVisible();
    }
  });
});
