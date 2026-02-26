import { expect, test } from '@playwright/test';

test.describe('Textarea', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/textarea');
  });

  // ==================== Basic Rendering ====================

  test('should render textarea with label', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await expect(textarea).toBeVisible();

    const label = page.locator('label').first();
    await expect(label).toBeVisible();
    await expect(label).toHaveText('Description');
  });

  test('should render textarea with placeholder', async ({ page }) => {
    const textarea = page.locator('textarea[placeholder]').first();
    await expect(textarea).toBeVisible();

    const placeholder = await textarea.getAttribute('placeholder');
    expect(placeholder).toBe('Enter description...');
  });

  // ==================== Text Input ====================

  test('should accept text input', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.click();
    await textarea.fill('Hello World');

    const value = await textarea.inputValue();
    expect(value).toBe('Hello World');
  });

  test('should support multiline text', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.click();
    await textarea.pressSequentially('Line 1');
    await page.keyboard.press('Enter');
    await textarea.pressSequentially('Line 2');
    await page.keyboard.press('Enter');
    await textarea.pressSequentially('Line 3');

    const value = await textarea.inputValue();
    expect(value.split('\n').length).toBe(3);
  });

  test('should clear textarea', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.fill('Test');
    await textarea.clear();

    const value = await textarea.inputValue();
    expect(value).toBe('');
  });

  // ==================== Label Association ====================

  test('should link label to textarea via for/id', async ({ page }) => {
    const label = page.locator('label').first();
    const textarea = page.locator('textarea').first();

    const forAttr = await label.getAttribute('for');
    const idAttr = await textarea.getAttribute('id');

    expect(forAttr).toBeTruthy();
    expect(idAttr).toBeTruthy();
    expect(forAttr).toBe(idAttr);
  });

  // ==================== Helper Text ====================

  test('should render helper text', async ({ page }) => {
    // Second example has helperText="Write a short bio about yourself"
    const helperText = page.getByText('Write a short bio about yourself', { exact: true });
    await expect(helperText).toBeVisible();
  });

  test('should link helper text to textarea via aria-describedby', async ({ page }) => {
    // Find the textarea that has aria-describedby set
    const textarea = page.locator('textarea[aria-describedby]').first();
    const describedBy = await textarea.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();

    const helperText = page.locator(`[id="${describedBy}"]`);
    await expect(helperText).toBeVisible();
    await expect(helperText).toContainText('Write a short bio');
  });

  // ==================== Color Variants ====================

  test('should render failure state with red border', async ({ page }) => {
    const errorTextarea = page.locator('textarea.border-red-500');
    await expect(errorTextarea).toBeVisible();
  });

  test('should set aria-invalid on failure textarea', async ({ page }) => {
    const errorTextarea = page.locator('textarea.border-red-500');
    await expect(errorTextarea).toHaveAttribute('aria-invalid', 'true');
  });

  test('should render success state with green border', async ({ page }) => {
    const successTextarea = page.locator('textarea.border-green-500');
    await expect(successTextarea).toBeVisible();
  });

  test('should render warning state with yellow border', async ({ page }) => {
    const warningTextarea = page.locator('textarea.border-yellow-500');
    await expect(warningTextarea).toBeVisible();
  });

  // ==================== Required ====================

  test('should show asterisk for required field', async ({ page }) => {
    // "Required Field" example has required prop
    const asterisk = page.locator('span').filter({ hasText: '*' });
    await expect(asterisk.first()).toBeVisible();
  });

  test('should set native required attribute on textarea', async ({ page }) => {
    const requiredTextarea = page.locator('textarea[required]');
    await expect(requiredTextarea).toBeVisible();
  });

  // ==================== Disabled ====================

  test('should render disabled textarea', async ({ page }) => {
    const disabledTextarea = page.locator('textarea[disabled]').last();
    await expect(disabledTextarea).toBeDisabled();
  });

  // ==================== Loading ====================

  test('should show spinner in loading state', async ({ page }) => {
    // "Loading State" example
    const loadingSection = page.locator('div').filter({ hasText: /^Comments/ }).first();
    const spinner = loadingSection.locator('[role="status"]');
    await expect(spinner).toBeVisible();
  });

  test('should disable textarea in loading state', async ({ page }) => {
    const loadingSection = page.locator('div').filter({ hasText: /^Comments/ }).first();
    const textarea = loadingSection.locator('textarea');
    await expect(textarea).toBeDisabled();
  });

  test('should set aria-busy on loading textarea', async ({ page }) => {
    const loadingSection = page.locator('div').filter({ hasText: /^Comments/ }).first();
    const textarea = loadingSection.locator('textarea');
    await expect(textarea).toHaveAttribute('aria-busy', 'true');
  });

  // ==================== Keyboard ====================

  test('should be focusable via keyboard', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.focus();
    await expect(textarea).toBeFocused();
  });

  test('should accept keyboard input', async ({ page }) => {
    const textarea = page.locator('textarea').first();
    await textarea.click();
    await textarea.pressSequentially('Test input');
    const value = await textarea.inputValue();
    expect(value).toContain('Test input');
  });
});
