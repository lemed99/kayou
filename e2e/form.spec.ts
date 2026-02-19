import { expect, test, type Page } from '@playwright/test';

/** Scope locators to a specific test section by ID. */
const section = (page: Page, id: string) => page.locator(`#${id}`);

/** Get a labelled input within a section. */
const field = (page: Page, sectionId: string, label: string) =>
  section(page, sectionId).getByLabel(label, { exact: true });

/** Get the submit button within a section. */
const submitBtn = (page: Page, sectionId: string) =>
  section(page, sectionId).getByRole('button', { name: 'Submit' });

test.describe('Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview/form');
    await page.waitForLoadState('networkidle');
  });

  // ── 1. Basic submit ─────────────────────────────────────────────

  test.describe('basic submit (validate on submit)', () => {
    const S = 'basic-submit';

    test('renders form fields', async ({ page }) => {
      await expect(field(page, S, 'Name')).toBeVisible();
      await expect(field(page, S, 'Email')).toBeVisible();
      await expect(submitBtn(page, S)).toBeVisible();
    });

    test('form has noValidate attribute', async ({ page }) => {
      const form = section(page, S).locator('form');
      await expect(form).toHaveJSProperty('noValidate', true);
    });

    test('submitting empty form shows validation errors', async ({ page }) => {
      await submitBtn(page, S).click();

      await expect(section(page, S).getByText('Name is required')).toBeVisible();
      await expect(section(page, S).getByText('Email is required')).toBeVisible();
    });

    test('no errors shown before submit', async ({ page }) => {
      await expect(section(page, S).getByText('Name is required')).not.toBeVisible();
      await expect(section(page, S).getByText('Email is required')).not.toBeVisible();
    });

    test('filling fields and submitting succeeds', async ({ page }) => {
      await field(page, S, 'Name').fill('John');
      await field(page, S, 'Email').fill('john@example.com');
      await submitBtn(page, S).click();

      await expect(page.getByTestId('basic-success')).toBeVisible();
    });

    test('fixing a field clears its error', async ({ page }) => {
      // Submit empty to trigger errors
      await submitBtn(page, S).click();
      await expect(section(page, S).getByText('Name is required')).toBeVisible();

      // Type in the Name field — error should clear
      await field(page, S, 'Name').fill('John');
      await expect(section(page, S).getByText('Name is required')).not.toBeVisible();

      // Email error should still be visible
      await expect(section(page, S).getByText('Email is required')).toBeVisible();
    });
  });

  // ── 2. Schema validators ────────────────────────────────────────

  test.describe('schema validators', () => {
    const S = 'schema-validators';

    test('required validator — empty fields show required errors', async ({ page }) => {
      await submitBtn(page, S).click();

      await expect(section(page, S).getByText('Username is required')).toBeVisible();
      await expect(section(page, S).getByText('Email is required')).toBeVisible();
    });

    test('minLength validator — short username shows error', async ({ page }) => {
      await field(page, S, 'Username').fill('ab');
      await submitBtn(page, S).click();

      await expect(section(page, S).getByText('Min 3 chars')).toBeVisible();
    });

    test('maxLength validator — long username shows error', async ({ page }) => {
      await field(page, S, 'Username').fill('a'.repeat(21));
      await submitBtn(page, S).click();

      await expect(section(page, S).getByText('Max 20 chars')).toBeVisible();
    });

    test('email validator — invalid email shows error', async ({ page }) => {
      await field(page, S, 'Email').fill('notanemail');
      await submitBtn(page, S).click();

      await expect(section(page, S).getByText('Invalid email')).toBeVisible();
    });

    test('min validator — age below minimum shows error', async ({ page }) => {
      const age = field(page, S, 'Age');
      await age.fill('10');
      await submitBtn(page, S).click();

      await expect(section(page, S).getByText('Must be 18+')).toBeVisible();
    });

    test('max validator — age above maximum shows error', async ({ page }) => {
      const age = field(page, S, 'Age');
      await age.fill('100');
      await submitBtn(page, S).click();

      await expect(section(page, S).getByText('Must be under 100')).toBeVisible();
    });

    test('pattern validator — invalid URL shows error', async ({ page }) => {
      await field(page, S, 'Website').fill('http://example.com');
      await submitBtn(page, S).click();

      await expect(section(page, S).getByText('Must start with https://')).toBeVisible();
    });

    test('pattern validator — empty value is skipped (no error)', async ({ page }) => {
      // Fill required fields to avoid those errors, leave website empty
      await field(page, S, 'Username').fill('john');
      await field(page, S, 'Email').fill('john@example.com');
      const age = field(page, S, 'Age');
      await age.fill('25');
      await submitBtn(page, S).click();

      await expect(section(page, S).getByText('Must start with https://')).not.toBeVisible();
    });

    test('short-circuit — first error wins per field', async ({ page }) => {
      // Username is empty → required fires, minLength should NOT fire
      await submitBtn(page, S).click();

      await expect(section(page, S).getByText('Username is required')).toBeVisible();
      await expect(section(page, S).getByText('Min 3 chars')).not.toBeVisible();
    });

    test('all valid fields submit successfully', async ({ page }) => {
      await field(page, S, 'Username').fill('john');
      await field(page, S, 'Email').fill('john@example.com');
      const age = field(page, S, 'Age');
      await age.fill('25');
      await field(page, S, 'Website').fill('https://example.com');
      await submitBtn(page, S).click();

      await expect(page.getByTestId('schema-success')).toBeVisible();
    });
  });

  // ── 3. Validate on blur ─────────────────────────────────────────

  test.describe('validate on blur', () => {
    const S = 'validate-on-blur';

    test('no error shown before interaction', async ({ page }) => {
      await expect(section(page, S).getByText('Name is required')).not.toBeVisible();
    });

    test('error appears on blur of empty field', async ({ page }) => {
      const input = field(page, S, 'Name');
      await input.focus();
      await input.blur();

      await expect(section(page, S).getByText('Name is required')).toBeVisible();
    });

    test('typing a short value then blurring shows minLength error', async ({ page }) => {
      const input = field(page, S, 'Name');
      await input.fill('a');
      await input.blur();

      await expect(section(page, S).getByText('Min 2 chars')).toBeVisible();
    });

    test('typing a valid value then blurring shows no error', async ({ page }) => {
      const input = field(page, S, 'Name');
      await input.fill('John');
      await input.blur();

      await expect(section(page, S).getByText('Name is required')).not.toBeVisible();
      await expect(section(page, S).getByText('Min 2 chars')).not.toBeVisible();
    });

    test('error clears when user edits the field', async ({ page }) => {
      const input = field(page, S, 'Name');
      // Trigger error
      await input.focus();
      await input.blur();
      await expect(section(page, S).getByText('Name is required')).toBeVisible();

      // Start typing — error should clear (stale error cleared on change)
      await input.fill('Jo');
      await expect(section(page, S).getByText('Name is required')).not.toBeVisible();
    });
  });

  // ── 4. Validate on change ───────────────────────────────────────

  test.describe('validate on change', () => {
    const S = 'validate-on-change';

    test('error appears immediately as user types', async ({ page }) => {
      const input = field(page, S, 'Name');
      await input.focus();
      await page.keyboard.type('ab');

      await expect(section(page, S).getByText('Min 3 chars')).toBeVisible();
    });

    test('error clears as soon as input becomes valid', async ({ page }) => {
      const input = field(page, S, 'Name');
      await input.focus();
      await page.keyboard.type('ab');
      await expect(section(page, S).getByText('Min 3 chars')).toBeVisible();

      await page.keyboard.type('c');
      await expect(section(page, S).getByText('Min 3 chars')).not.toBeVisible();
    });

    test('clearing input shows required error', async ({ page }) => {
      const input = field(page, S, 'Name');
      await input.fill('abc');
      await expect(section(page, S).getByText('Name is required')).not.toBeVisible();

      await input.clear();
      await expect(section(page, S).getByText('Name is required')).toBeVisible();
    });
  });

  // ── 5. Cross-field validation (schema + validate) ───────────────

  test.describe('cross-field validation', () => {
    const S = 'cross-field';

    test('schema errors shown for empty fields', async ({ page }) => {
      await submitBtn(page, S).click();

      await expect(section(page, S).getByText('Password is required')).toBeVisible();
      await expect(section(page, S).getByText('Confirmation is required')).toBeVisible();
    });

    test('schema minLength error for short password', async ({ page }) => {
      await field(page, S, 'Password').fill('short');
      await field(page, S, 'Confirm Password').fill('short');
      await submitBtn(page, S).click();

      await expect(section(page, S).getByText('Min 8 chars')).toBeVisible();
    });

    test('cross-field validate overrides schema for mismatched passwords', async ({ page }) => {
      await field(page, S, 'Password').fill('password123');
      await field(page, S, 'Confirm Password').fill('different123');
      await submitBtn(page, S).click();

      await expect(section(page, S).getByText('Passwords do not match')).toBeVisible();
    });

    test('matching passwords submit successfully', async ({ page }) => {
      await field(page, S, 'Password').fill('password123');
      await field(page, S, 'Confirm Password').fill('password123');
      await submitBtn(page, S).click();

      await expect(page.getByTestId('cross-field-success')).toBeVisible();
    });
  });

  // ── 6. Server errors ────────────────────────────────────────────

  test.describe('server errors', () => {
    const S = 'server-errors';

    test('server-returned field error is displayed after submit', async ({ page }) => {
      await field(page, S, 'Email').fill('taken@example.com');
      await submitBtn(page, S).click();

      await expect(section(page, S).getByText('Email already taken')).toBeVisible();
    });

    test('editing field after server error clears the error', async ({ page }) => {
      await field(page, S, 'Email').fill('taken@example.com');
      await submitBtn(page, S).click();
      await expect(section(page, S).getByText('Email already taken')).toBeVisible();

      // Edit the field — stale server error should clear
      await field(page, S, 'Email').fill('new@example.com');
      await expect(section(page, S).getByText('Email already taken')).not.toBeVisible();
    });
  });

  // ── 7. Submit error (onSubmit throws) ───────────────────────────

  test.describe('submit error', () => {
    const S = 'submit-error';

    test('thrown error message is displayed', async ({ page }) => {
      await field(page, S, 'Name').fill('John');
      await submitBtn(page, S).click();

      await expect(page.getByTestId('submit-error-msg')).toHaveText('Network error');
    });
  });

  // ── 8. Form state (isDirty, isSubmitting, reset) ────────────────

  test.describe('form state', () => {
    const S = 'form-state';

    test('form starts pristine', async ({ page }) => {
      await expect(page.getByTestId('is-dirty')).toHaveText('pristine');
    });

    test('typing makes form dirty', async ({ page }) => {
      await field(page, S, 'Name').fill('John');
      await expect(page.getByTestId('is-dirty')).toHaveText('dirty');
    });

    test('clearing back to initial makes form pristine', async ({ page }) => {
      await field(page, S, 'Name').fill('John');
      await expect(page.getByTestId('is-dirty')).toHaveText('dirty');

      await field(page, S, 'Name').clear();
      await expect(page.getByTestId('is-dirty')).toHaveText('pristine');
    });

    test('isValid reflects validation state', async ({ page }) => {
      // Initially name is empty, required fails
      await expect(page.getByTestId('is-valid')).toHaveText('invalid');

      await field(page, S, 'Name').fill('John');
      await expect(page.getByTestId('is-valid')).toHaveText('valid');
    });

    test('reset clears field values and state', async ({ page }) => {
      const input = field(page, S, 'Name');
      await input.fill('John');
      await expect(page.getByTestId('is-dirty')).toHaveText('dirty');

      // Click Reset
      await section(page, S).getByRole('button', { name: 'Reset' }).click();

      await expect(input).toHaveValue('');
      await expect(page.getByTestId('is-dirty')).toHaveText('pristine');
    });

    test('reset clears validation errors', async ({ page }) => {
      // Submit empty to show error
      await submitBtn(page, S).click();
      await expect(section(page, S).getByText('Name is required')).toBeVisible();

      // Reset should clear the error
      await section(page, S).getByRole('button', { name: 'Reset' }).click();
      await expect(section(page, S).getByText('Name is required')).not.toBeVisible();
    });

    test('aria-busy is set during submission', async ({ page }) => {
      const form = section(page, S).locator('form');

      // Fill valid data so submission proceeds
      await field(page, S, 'Name').fill('John');
      await submitBtn(page, S).click();

      // Form should have aria-busy during the 500ms async submit
      await expect(form).toHaveAttribute('aria-busy', 'true');

      // After submission completes, aria-busy should be removed
      await expect(form).not.toHaveAttribute('aria-busy', { timeout: 2000 });
    });

    test('submit button is disabled during submission', async ({ page }) => {
      await field(page, S, 'Name').fill('John');
      await submitBtn(page, S).click();

      await expect(submitBtn(page, S)).toBeDisabled();

      // After submission completes, button should re-enable
      await expect(submitBtn(page, S)).toBeEnabled({ timeout: 2000 });
    });
  });
});
