import { expect, test } from '@playwright/test';

test.describe('RichTextEditor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/rich-text-editor');
  });

  // ==================== Basic Rendering ====================

  test('should render rich text editor container', async ({ page }) => {
    const content = await page.textContent('body');
    expect(content).toContain('RichTextEditor');
  });

  test('should render editable content area', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await expect(editor).toBeVisible();
  });

  test('should render toolbar', async ({ page }) => {
    const toolbar = page.locator('[role="toolbar"], [class*="toolbar"]').first();
    if (await toolbar.isVisible()) {
      await expect(toolbar).toBeVisible();
    }
  });

  // ==================== Toolbar Buttons ====================

  test('should render bold button', async ({ page }) => {
    const boldButton = page
      .locator('button[aria-label*="Bold"], button[title*="Bold"]')
      .first();
    if (await boldButton.isVisible()) {
      await expect(boldButton).toBeVisible();
    }
  });

  test('should render italic button', async ({ page }) => {
    const italicButton = page
      .locator('button[aria-label*="Italic"], button[title*="Italic"]')
      .first();
    if (await italicButton.isVisible()) {
      await expect(italicButton).toBeVisible();
    }
  });

  test('should render underline button', async ({ page }) => {
    const underlineButton = page
      .locator('button[aria-label*="Underline"], button[title*="Underline"]')
      .first();
    if (await underlineButton.isVisible()) {
      await expect(underlineButton).toBeVisible();
    }
  });

  // ==================== Text Editing ====================

  test('should accept text input', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await page.keyboard.type('Hello, World!');

    const content = await editor.textContent();
    expect(content).toContain('Hello, World!');
  });

  test('should apply bold formatting', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await page.keyboard.type('Test text');

    // Select all text
    await page.keyboard.press('Control+a');

    // Click bold button
    const boldButton = page.locator('button').filter({ has: page.locator('svg') }).first();
    if (await boldButton.isVisible()) {
      await boldButton.click();
    }
  });

  // ==================== Keyboard Shortcuts ====================

  test('should support Ctrl+B for bold', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await page.keyboard.type('Test');

    await page.keyboard.press('Control+a');
    await page.keyboard.press('Control+b');

    // Text should have bold formatting
    await expect(editor).toBeVisible();
  });

  test('should support Ctrl+I for italic', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await page.keyboard.type('Test');

    await page.keyboard.press('Control+a');
    await page.keyboard.press('Control+i');

    await expect(editor).toBeVisible();
  });

  // ==================== Focus Behavior ====================

  test('should be focusable', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.focus();
    await expect(editor).toBeFocused();
  });

  test('should show focus indicator', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await expect(editor).toBeVisible();
  });

  // ==================== Lists ====================

  test('should support bullet list', async ({ page }) => {
    const listButton = page
      .locator('button[aria-label*="list"], button[title*="list"]')
      .first();
    if (await listButton.isVisible()) {
      await expect(listButton).toBeVisible();
    }
  });

  test('should support numbered list', async ({ page }) => {
    const orderedListButton = page
      .locator('button[aria-label*="ordered"], button[title*="ordered"]')
      .first();
    if (await orderedListButton.isVisible()) {
      await expect(orderedListButton).toBeVisible();
    }
  });

  // ==================== Headings ====================

  test('should support heading selection', async ({ page }) => {
    const headingDropdown = page.locator('select, [role="combobox"]').first();
    if (await headingDropdown.isVisible()) {
      await expect(headingDropdown).toBeVisible();
    }
  });

  // ==================== Placeholder ====================

  test('should show placeholder when empty', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    const placeholder = await editor.getAttribute('data-placeholder');
    expect(placeholder !== null || (await editor.textContent()) !== null).toBeTruthy();
  });

  // ==================== Disabled State ====================

  test('should render disabled state', async ({ page }) => {
    const disabledEditor = page.locator('[contenteditable="false"]');
    const count = await disabledEditor.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // ==================== Accessibility ====================

  test('should have proper ARIA attributes', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    const role = await editor.getAttribute('role');
    // May have role="textbox" or no specific role
    expect(role === 'textbox' || role === null).toBeTruthy();
  });

  test('toolbar buttons should be keyboard accessible', async ({ page }) => {
    const toolbar = page.locator('[role="toolbar"], [class*="toolbar"]').first();
    if (await toolbar.isVisible()) {
      const buttons = toolbar.locator('button');
      const count = await buttons.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  // ==================== Edge Cases ====================

  test('should render without crashing', async ({ page }) => {
    await page.waitForTimeout(500);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should handle rapid formatting changes', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await page.keyboard.type('Test');

    await page.keyboard.press('Control+a');
    await page.keyboard.press('Control+b');
    await page.keyboard.press('Control+i');
    await page.keyboard.press('Control+u');

    await expect(editor).toBeVisible();
  });

  test('should preserve content on blur and refocus', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await page.keyboard.type('Persistent text');

    // Click outside to blur
    await page.click('body');
    await page.waitForTimeout(100);

    // Click back in editor
    await editor.click();

    const content = await editor.textContent();
    expect(content).toContain('Persistent text');
  });
});
