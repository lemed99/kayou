import { expect, test } from '@playwright/test';

const exampleSection = (page: import('@playwright/test').Page, id: string) =>
  page.locator(`#${id}`);

test.describe('TagInput', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/tag-input');
  });

  test('renders the basic example with label and helper text', async ({ page }) => {
    const section = exampleSection(page, 'basic-input');
    await expect(section.getByText('Topics')).toBeVisible();
    await expect(
      section.getByText('Use comma or semicolon to separate tags.'),
    ).toBeVisible();
    await expect(section.getByRole('textbox', { name: 'Topics' })).toBeVisible();
  });

  test('creates a tag with a comma separator', async ({ page }) => {
    const section = exampleSection(page, 'basic-input');
    const input = section.getByRole('textbox', { name: 'Topics' });

    await input.fill('alpha');
    await input.press(',');

    await expect(section.getByText('alpha', { exact: true })).toBeVisible();
    await expect(input).toHaveValue('');
  });

  test('creates a tag with a semicolon separator', async ({ page }) => {
    const section = exampleSection(page, 'basic-input');
    const input = section.getByRole('textbox', { name: 'Topics' });

    await input.fill('beta');
    await input.press(';');

    await expect(section.getByText('beta', { exact: true })).toBeVisible();
    await expect(input).toHaveValue('');
  });

  test('splits values on comma and semicolon separators in a single input event', async ({
    page,
  }) => {
    const section = exampleSection(page, 'separator-support');
    const input = section.getByRole('textbox', { name: 'Recipients' });

    await input.fill('alice@example.com,bob@example.com;carol@example.com;');

    await expect(section.getByText('team@example.com', { exact: true })).toBeVisible();
    await expect(section.getByText('alice@example.com', { exact: true })).toBeVisible();
    await expect(section.getByText('bob@example.com', { exact: true })).toBeVisible();
    await expect(section.getByText('carol@example.com', { exact: true })).toBeVisible();
  });

  test('supports controlled tags with onValueChange', async ({ page }) => {
    const section = exampleSection(page, 'controlled-value');
    const input = section.getByRole('textbox', { name: 'Frameworks' });

    await input.fill('vite');
    await input.press('Enter');

    await expect(section.getByTestId('controlled-tags')).toContainText(
      'Tags: solid, ui, vite',
    );
  });

  test('removes a tag with the accessible remove button', async ({ page }) => {
    const section = exampleSection(page, 'controlled-value');

    await section.getByRole('button', { name: 'Remove tag solid' }).click();

    await expect(section.getByTestId('controlled-tags')).toContainText('Tags: ui');
  });

  test('validation styling keeps helper text linked to the input', async ({ page }) => {
    const section = exampleSection(page, 'validation-state');
    const input = section.getByRole('textbox', { name: 'Required Skills' });

    await expect(input).toHaveAttribute('aria-invalid', 'true');
    const describedBy = await input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();

    const helperId = describedBy!
      .split(' ')
      .find((id) => id.endsWith('-helper'));
    expect(helperId).toBeTruthy();
    await expect(section.locator(`#${helperId}`)).toHaveText('Please add at least one skill.');
  });

  test('disabled state prevents editing and tag removal', async ({ page }) => {
    const section = exampleSection(page, 'disabled-state');
    const input = section.getByRole('textbox', { name: 'Locked Tags' });

    await expect(input).toBeDisabled();
    await expect(section.getByRole('button', { name: 'Remove tag readonly' })).toBeDisabled();
    await expect(section.getByRole('button', { name: 'Remove tag archived' })).toBeDisabled();
  });
});
