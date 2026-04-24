import { expect, test } from '@playwright/test';

/** Helper to scope locators to a specific example section by title. */
const exampleSection = (page: import('@playwright/test').Page, title: string) =>
  page.locator(`#${title.toLowerCase().replace(/\s+/g, '-')}`);

test.describe('TextInput', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/text-input');
  });

  // ── Basic rendering ──────────────────────────────────────────────

  test('renders basic input with placeholder', async ({ page }) => {
    const section = exampleSection(page, 'Basic Input');
    const input = section.locator('input');
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('placeholder', 'Enter your name');
  });

  test('accepts and clears text', async ({ page }) => {
    const section = exampleSection(page, 'Basic Input');
    const input = section.locator('input');
    await input.fill('Hello World');
    await expect(input).toHaveValue('Hello World');
    await input.clear();
    await expect(input).toHaveValue('');
  });

  test('keyboard input works', async ({ page }) => {
    const section = exampleSection(page, 'Basic Input');
    const input = section.locator('input');
    await input.focus();
    await expect(input).toBeFocused();
    await page.keyboard.type('Test');
    await expect(input).toHaveValue('Test');
  });

  // ── Label + helper text ──────────────────────────────────────────

  test('label is associated with input via for/id', async ({ page }) => {
    const section = exampleSection(page, 'With Label and Helper Text');
    const label = section.locator('label');
    await expect(label).toHaveText('Email Address');
    const forAttr = await label.getAttribute('for');
    expect(forAttr).toBeTruthy();
    const input = section.locator(`input#${forAttr}`);
    await expect(input).toBeVisible();
  });

  test('helper text is linked via aria-describedby', async ({ page }) => {
    const section = exampleSection(page, 'With Label and Helper Text');
    const input = section.locator('input');
    const describedBy = await input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const helper = section.locator(`#${describedBy}`);
    await expect(helper).toHaveText("We'll never share your email.");
  });

  // ── Size variants ────────────────────────────────────────────────

  test('renders three size variants', async ({ page }) => {
    const section = exampleSection(page, 'Size Variants');
    const inputs = section.locator('input');
    await expect(inputs).toHaveCount(3);
    await expect(inputs.nth(0)).toHaveAttribute('placeholder', 'Extra Small');
    await expect(inputs.nth(1)).toHaveAttribute('placeholder', 'Small');
    await expect(inputs.nth(2)).toHaveAttribute('placeholder', 'Medium');
  });

  // ── Validation states ────────────────────────────────────────────

  test('failure state has aria-invalid and red border', async ({ page }) => {
    const section = exampleSection(page, 'Validation States');
    const errorInput = section.locator('input[aria-invalid="true"]');
    await expect(errorInput).toBeVisible();
    await expect(errorInput).toHaveValue('Invalid input');
    await expect(errorInput).toHaveClass(/border-red/);
  });

  test('failure state helper text is linked', async ({ page }) => {
    const section = exampleSection(page, 'Validation States');
    const errorInput = section.locator('input[aria-invalid="true"]');
    const describedBy = await errorInput.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const helper = section.locator(`#${describedBy}`);
    await expect(helper).toHaveText('Please check this field');
  });

  test('success state has green border', async ({ page }) => {
    const section = exampleSection(page, 'Validation States');
    const input = section.locator('input[class*="border-green"]');
    await expect(input).toBeVisible();
    await expect(input).toHaveValue('Valid input');
  });

  // ── Addon ────────────────────────────────────────────────────────

  test('renders left addon text before input by default', async ({ page }) => {
    const section = exampleSection(page, 'With Addon');
    const addon = section.getByText('https://', { exact: true });
    await expect(addon).toBeVisible();
    const input = section.locator('input').first();
    await expect(input).toHaveAttribute('placeholder', 'example.com');
    await expect(input).toHaveClass(/rounded-r-lg/);
    await expect(addon).toHaveClass(/rounded-l-lg/);
  });

  test('renders right addon after input with mirrored rounding', async ({ page }) => {
    const section = exampleSection(page, 'With Right Addon');
    const input = section.locator('input').first();
    const addon = section.getByText('.com', { exact: true });

    await expect(input).toHaveAttribute('placeholder', 'example');
    await expect(input).toHaveClass(/rounded-l-lg/);
    await expect(addon).toHaveClass(/rounded-r-lg/);

    const inputHandle = await input.elementHandle();
    const addonHandle = await addon.elementHandle();
    expect(inputHandle).toBeTruthy();
    expect(addonHandle).toBeTruthy();

    const addonFollowsInput = await page.evaluate(
      ([inputEl, addonEl]) =>
        Boolean(
          inputEl &&
            addonEl &&
            inputEl.compareDocumentPosition(addonEl) & Node.DOCUMENT_POSITION_FOLLOWING,
        ),
      [inputHandle, addonHandle],
    );

    expect(addonFollowsInput).toBe(true);
  });

  // ── Loading state ────────────────────────────────────────────────

  test('loading state disables input and shows spinner', async ({ page }) => {
    const section = exampleSection(page, 'Loading State');
    const input = section.locator('input');
    await expect(input).toBeDisabled();
    await expect(input).toHaveAttribute('aria-busy', 'true');
    // Spinner should be visible via its role="status"
    const spinner = section.getByRole('status');
    await expect(spinner).toBeVisible();
  });

  // ── Disabled state ───────────────────────────────────────────────

  test('disabled state prevents interaction', async ({ page }) => {
    const section = exampleSection(page, 'Disabled State');
    const input = section.locator('input');
    await expect(input).toBeDisabled();
    await expect(input).toHaveValue('Disabled input');
  });

  // ── Required field ───────────────────────────────────────────────

  test('required field has visual indicator and required attribute', async ({ page }) => {
    const section = exampleSection(page, 'Required Field');
    const input = section.locator('input');
    await expect(input).toHaveAttribute('required', '');
    // Visual * indicator should be present and aria-hidden
    const asterisk = section.locator('span[aria-hidden="true"]');
    await expect(asterisk).toHaveText('*');
  });

  // ── Controlled input ─────────────────────────────────────────────

  test('controlled input updates helper text on type', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const input = page.getByRole('textbox', { name: 'Controlled Input' });
    await input.scrollIntoViewIfNeeded();
    await input.focus();
    await expect(input).toBeFocused();
    await page.keyboard.type('hello');
    await expect(input).toHaveValue('hello');
    const section = exampleSection(page, 'Controlled Input');
    await expect(section.getByText('You typed: hello')).toBeVisible();
  });
});
