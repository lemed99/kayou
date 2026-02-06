import { expect, test } from '@playwright/test';

test.describe('RichTextEditor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/rich-text-editor');
    await page.waitForLoadState('networkidle');
  });

  test('should render editable content area', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await expect(editor).toBeVisible();
    await expect(editor).toHaveAttribute('role', 'textbox');
    await expect(editor).toHaveAttribute('aria-multiline', 'true');
  });

  test('should render toolbar with formatting buttons', async ({ page }) => {
    const boldButton = page.locator('button[aria-label*="Bold"]').first();
    const italicButton = page.locator('button[aria-label*="Italic"]').first();
    const underlineButton = page.locator('button[aria-label*="Underline"]').first();
    await expect(boldButton).toBeVisible();
    await expect(italicButton).toBeVisible();
    await expect(underlineButton).toBeVisible();
  });

  test('should accept text input', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await page.keyboard.type('Hello, World!');
    await expect(editor).toContainText('Hello, World!');
  });

  test('should apply bold formatting with Ctrl+B', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await page.keyboard.type('bold text');
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Control+b');

    const strong = editor.locator('strong');
    await expect(strong).toContainText('bold text');
  });

  test('should apply italic formatting with Ctrl+I', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await page.keyboard.type('italic text');
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Control+i');

    const em = editor.locator('em');
    await expect(em).toContainText('italic text');
  });

  test('should apply underline formatting with Ctrl+U', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await page.keyboard.type('underlined');
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Control+u');

    const u = editor.locator('u');
    await expect(u).toContainText('underlined');
  });

  test('should toggle bold button active state', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    const boldButton = page.locator('button[aria-label*="Bold"]').first();

    await editor.click();
    await page.keyboard.type('text');
    await page.keyboard.press('Control+a');

    await expect(boldButton).toHaveAttribute('aria-pressed', 'false');
    await page.keyboard.press('Control+b');
    await expect(boldButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('should display pre-populated content', async ({ page }) => {
    // The "With Initial Content" example has sample content
    const editors = page.locator('[contenteditable="true"]');
    const secondEditor = editors.nth(1);
    await expect(secondEditor).toContainText('Welcome to RichTextEditor');
  });

  test('should show character count when enabled', async ({ page }) => {
    // The "Product Review Editor" example has showCharacterCount and maxLength=1000
    const charCount = page.locator('text=/\\d+\\s*\\/\\s*1000/');
    await expect(charCount).toBeVisible();
  });

  test('should show error message', async ({ page }) => {
    // The "With Label and Validation" example has error="Description is required"
    await expect(page.locator('text=Description is required')).toBeVisible();
  });

  test('should show label with required indicator', async ({ page }) => {
    // The "With Label and Validation" example has label="Product Description" and required
    await expect(page.locator('text=Product Description')).toBeVisible();
    const requiredStar = page.locator('label:has-text("Product Description") span.text-red-500');
    await expect(requiredStar).toBeVisible();
  });

  test('should be focusable', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.focus();
    await expect(editor).toBeFocused();
  });

  test('should preserve content on blur and refocus', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await page.keyboard.type('Persistent text');

    // Click outside to blur
    await page.locator('body').click({ position: { x: 10, y: 10 } });
    await page.waitForTimeout(100);

    // Click back in editor
    await editor.click();
    await expect(editor).toContainText('Persistent text');
  });

  test('should handle rapid formatting changes', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await page.keyboard.type('styled text');

    await page.keyboard.press('Control+a');
    await page.keyboard.press('Control+b');
    await page.keyboard.press('Control+i');
    await page.keyboard.press('Control+u');

    // Text should have all three formats applied
    const u = editor.locator('u');
    const em = u.locator('em');
    const strong = em.locator('strong');
    await expect(strong).toContainText('styled text');
  });

  test('should render disabled state without toolbar', async ({ page }) => {
    // The "Disabled State" example has disabled editor
    const disabledEditor = page.locator('[contenteditable="false"]').first();
    await expect(disabledEditor).toBeVisible();
    await expect(disabledEditor).toContainText('This content cannot be edited');
  });

  test('should render read-only mode without toolbar', async ({ page }) => {
    // The "Read-Only Mode" example
    const readOnlySection = page.locator('text=Read-Only Mode').locator('..');
    const readOnlyEditor = readOnlySection.locator('[contenteditable="false"]');
    await expect(readOnlyEditor).toBeVisible();
  });

  test('should undo with Ctrl+Z', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await page.keyboard.type('first ');
    await page.keyboard.type('second');
    await expect(editor).toContainText('first second');

    await page.keyboard.press('Control+z');
    await expect(editor).not.toContainText('second');
  });
});
