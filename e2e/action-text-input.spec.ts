import { expect, test, type Locator, type Page } from '@playwright/test';

const exampleSection = (page: Page, id: string) => page.locator(`#${id}`);

const fieldWrapper = (section: Locator) => section.locator('.relative').first();

test.describe('ActionTextInput', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/action-text-input');
    await page.waitForLoadState('networkidle');
  });

  test('renders the input and CTA button inside the same field wrapper', async ({
    page,
  }) => {
    const section = exampleSection(page, 'basic-action-input');
    const wrapper = fieldWrapper(section);

    await expect(wrapper.locator('input')).toBeVisible();
    await expect(wrapper.locator('button[aria-label="Run search"]')).toBeVisible();
  });

  test('CTA has the required aria-label', async ({ page }) => {
    const section = exampleSection(page, 'basic-action-input');
    await expect(section.locator('button[aria-label="Run search"]')).toBeVisible();
  });

  test('CTA click handler works for button actions', async ({ page }) => {
    const section = exampleSection(page, 'basic-action-input');
    await section.locator('button[aria-label="Run search"]').click();
    await expect(section.getByText('Action pressed: 1 time')).toBeVisible();
  });

  test('submit action submits the surrounding form', async ({ page }) => {
    const section = exampleSection(page, 'submit-action');
    const input = section.locator('input');
    await input.fill('Bleu');
    await section.locator('button[aria-label="Save changes"]').click();
    await expect(section.locator('[data-testid="submitted-name"]')).toContainText('Bleu');
  });

  test('hidden action removes the button and extra right padding', async ({ page }) => {
    const section = exampleSection(page, 'hidden-action');
    const input = section.locator('input');

    await expect(section.locator('button')).toHaveCount(0);
    await expect(input).not.toHaveClass(/pr-10/);
  });

  test('disabled input disables the CTA', async ({ page }) => {
    const section = exampleSection(page, 'disabled-action');
    await expect(section.locator('button[aria-label="Disabled action"]')).toBeDisabled();
  });

  test('action loading shows a spinner and disables the CTA', async ({ page }) => {
    const section = exampleSection(page, 'loading-action');
    const button = section.locator('button[aria-label="Saving"]');

    await expect(button).toBeDisabled();
    await expect(section.getByRole('status')).toBeVisible();
  });

  test('failure color applies to the CTA button', async ({ page }) => {
    const section = exampleSection(page, 'validation-state');
    await expect(section.locator('button[aria-label="Retry save"]')).toHaveClass(/text-red/);
  });

  test('label is correctly associated with the input', async ({ page }) => {
    const section = exampleSection(page, 'basic-action-input');
    const label = section.locator('label');
    const forAttr = await label.getAttribute('for');

    expect(forAttr).toBeTruthy();
    await expect(section.locator(`input#${forAttr}`)).toBeVisible();
  });

  test('helper text is linked through aria-describedby', async ({ page }) => {
    const section = exampleSection(page, 'validation-state');
    const input = section.locator('input');
    const describedBy = await input.getAttribute('aria-describedby');

    expect(describedBy).toBeTruthy();
    await expect(section.locator(`#${describedBy}`)).toContainText(
      'Please resolve the duplicate name.',
    );
  });
});
