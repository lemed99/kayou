import { expect, test } from '@playwright/test';

/** Helper to scope locators to a specific example section by title. */
const exampleSection = (page: import('@playwright/test').Page, title: string) =>
  page.locator(`#${title.toLowerCase().replace(/\s+/g, '-')}`);

test.describe('Checkbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/checkbox');
  });

  // ── Basic Checkbox ───────────────────────────────────────────────

  test('renders checkbox with label', async ({ page }) => {
    const section = exampleSection(page, 'Basic Checkbox');
    const checkbox = section.getByRole('checkbox', { name: 'Accept terms and conditions' });
    await expect(checkbox).toBeVisible();
    await expect(checkbox).not.toBeChecked();
  });

  test('toggles on click', async ({ page }) => {
    const section = exampleSection(page, 'Basic Checkbox');
    const checkbox = section.getByRole('checkbox', { name: 'Accept terms and conditions' });
    await checkbox.click();
    await expect(checkbox).toBeChecked();
    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
  });

  test('toggles when clicking label text', async ({ page }) => {
    const section = exampleSection(page, 'Basic Checkbox');
    const labelSpan = section.getByText('Accept terms and conditions', { exact: true });
    const checkbox = section.getByRole('checkbox', { name: 'Accept terms and conditions' });
    await labelSpan.click();
    await expect(checkbox).toBeChecked();
  });

  test('label is associated with checkbox via for/id', async ({ page }) => {
    const section = exampleSection(page, 'Basic Checkbox');
    const checkbox = section.locator('input[type="checkbox"]');
    const checkboxId = await checkbox.getAttribute('id');
    expect(checkboxId).toBeTruthy();
    const label = section.locator(`label[for="${checkboxId}"]`);
    await expect(label).toBeVisible();
  });

  // ── Keyboard accessibility ───────────────────────────────────────

  test('toggles with Space key', async ({ page }) => {
    const section = exampleSection(page, 'Basic Checkbox');
    const checkbox = section.getByRole('checkbox', { name: 'Accept terms and conditions' });
    await checkbox.focus();
    await expect(checkbox).toBeFocused();
    await page.keyboard.press('Space');
    await expect(checkbox).toBeChecked();
    await page.keyboard.press('Space');
    await expect(checkbox).not.toBeChecked();
  });

  test('Tab navigates between checkboxes', async ({ page }) => {
    const section = exampleSection(page, 'Color Variants');
    const blue = section.getByRole('checkbox', { name: 'Blue checkbox' });
    const dark = section.getByRole('checkbox', { name: 'Dark checkbox' });
    await blue.focus();
    await expect(blue).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(dark).toBeFocused();
  });

  // ── Color Variants ───────────────────────────────────────────────

  test('renders blue and dark color variants checked', async ({ page }) => {
    const section = exampleSection(page, 'Color Variants');
    const blue = section.getByRole('checkbox', { name: 'Blue checkbox' });
    const dark = section.getByRole('checkbox', { name: 'Dark checkbox' });
    await expect(blue).toBeChecked();
    await expect(dark).toBeChecked();
  });

  test('blue variant has blue checked background', async ({ page }) => {
    const section = exampleSection(page, 'Color Variants');
    const blue = section.getByRole('checkbox', { name: 'Blue checkbox' });
    await expect(blue).toHaveClass(/checked:bg-blue-600/);
  });

  test('dark variant has gray checked background', async ({ page }) => {
    const section = exampleSection(page, 'Color Variants');
    const dark = section.getByRole('checkbox', { name: 'Dark checkbox' });
    await expect(dark).toHaveClass(/checked:bg-gray-800/);
  });

  // ── Label Position ───────────────────────────────────────────────

  test('label on right renders text after checkbox', async ({ page }) => {
    const section = exampleSection(page, 'Label Position');
    const label = section.locator('label').filter({ hasText: 'Label on right' });
    // The input should come before the text span
    const children = label.locator('> *');
    const first = children.first();
    await expect(first).toHaveAttribute('type', 'checkbox');
  });

  test('label on left renders text before checkbox', async ({ page }) => {
    const section = exampleSection(page, 'Label Position');
    const label = section.locator('label').filter({ hasText: 'Label on left' });
    // The text span should come before the input
    const firstChild = label.locator('> *').first();
    // First child should be the span, not the input
    const tagName = await firstChild.evaluate((el) => el.tagName.toLowerCase());
    expect(tagName).toBe('span');
  });

  // ── Disabled State ───────────────────────────────────────────────

  test('disabled unchecked checkbox is not toggleable', async ({ page }) => {
    const section = exampleSection(page, 'Disabled State');
    const checkbox = section.getByRole('checkbox', { name: 'Disabled unchecked' });
    await expect(checkbox).toBeDisabled();
    await expect(checkbox).not.toBeChecked();
    await checkbox.click({ force: true });
    await expect(checkbox).not.toBeChecked();
  });

  test('disabled checked checkbox stays checked', async ({ page }) => {
    const section = exampleSection(page, 'Disabled State');
    const checkbox = section.getByRole('checkbox', { name: 'Disabled checked' });
    await expect(checkbox).toBeDisabled();
    await expect(checkbox).toBeChecked();
    await checkbox.click({ force: true });
    await expect(checkbox).toBeChecked();
  });

  test('disabled label has not-allowed cursor class', async ({ page }) => {
    const section = exampleSection(page, 'Disabled State');
    const label = section.locator('label').filter({ hasText: 'Disabled unchecked' });
    await expect(label).toHaveClass(/cursor-not-allowed/);
  });
});
