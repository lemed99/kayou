import { expect, test, type Page } from '@playwright/test';

const section = (page: Page, id: string) => page.locator(`#${id}`);

test.describe('TimePicker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/preview/time-picker');
    await page.waitForLoadState('networkidle');
  });

  // ==================== Basic 24h Rendering ====================

  test.describe('basic 24h format', () => {
    const S = 'basic-24h';

    test('renders label and group', async ({ page }) => {
      const sec = section(page, S);
      await expect(sec.getByText('Start Time')).toBeVisible();
      const group = sec.locator('[role="group"]');
      await expect(group).toBeVisible();
    });

    test('displays correct initial values', async ({ page }) => {
      const sec = section(page, S);
      const hourInput = sec.locator('input[aria-label="Hour"]');
      const minuteInput = sec.locator('input[aria-label="Minute"]');
      await expect(hourInput).toHaveValue('14');
      await expect(minuteInput).toHaveValue('30');
    });

    test('changes hour via keyboard', async ({ page }) => {
      const sec = section(page, S);
      const hourInput = sec.locator('input[aria-label="Hour"]');
      await hourInput.click();
      await hourInput.press('ArrowUp');
      await expect(hourInput).toHaveValue('15');
      await expect(sec.locator('[data-testid="basic-24h-value"]')).toContainText('15:');
    });

    test('changes minute via keyboard', async ({ page }) => {
      const sec = section(page, S);
      const minuteInput = sec.locator('input[aria-label="Minute"]');
      await minuteInput.click();
      await minuteInput.press('ArrowUp');
      await expect(minuteInput).toHaveValue('31');
    });

    test('no AM/PM selector in 24h mode', async ({ page }) => {
      const sec = section(page, S);
      await expect(sec.getByRole('combobox')).toHaveCount(0);
    });
  });

  // ==================== 12h Format ====================

  test.describe('12h format', () => {
    const S = 'format-12h';

    test('renders AM/PM selector', async ({ page }) => {
      const sec = section(page, S);
      await expect(sec.getByRole('combobox')).toBeVisible();
    });

    test('displays hour as 12h (9 AM)', async ({ page }) => {
      const sec = section(page, S);
      const hourInput = sec.locator('input[aria-label="Hour"]');
      await expect(hourInput).toHaveValue('09');
    });

    test('switching to PM updates the hour value', async ({ page }) => {
      const sec = section(page, S);
      const trigger = sec.getByRole('combobox');
      // Use keyboard to open the Select and pick PM
      await trigger.focus();
      await trigger.press('Enter');
      await page.waitForTimeout(300);

      const pmOption = page.locator('[role="option"]', { hasText: 'PM' });
      await pmOption.click();
      await page.waitForTimeout(200);

      // Hour was 9 (AM), should now be 21 (PM)
      await expect(sec.locator('[data-testid="format-12h-value"]')).toContainText('21:');
    });
  });

  // ==================== With Seconds ====================

  test.describe('with seconds', () => {
    const S = 'with-seconds';

    test('renders seconds input', async ({ page }) => {
      const sec = section(page, S);
      const secondInput = sec.locator('input[aria-label="Second"]');
      await expect(secondInput).toBeVisible();
    });

    test('changes second via keyboard', async ({ page }) => {
      const sec = section(page, S);
      const secondInput = sec.locator('input[aria-label="Second"]');
      await secondInput.click();
      await secondInput.press('ArrowUp');
      await expect(secondInput).toHaveValue('01');
      await expect(sec.locator('[data-testid="with-seconds-value"]')).toContainText(':1');
    });
  });

  // ==================== Step Control ====================

  test.describe('step control', () => {
    const S = 'step-control';

    test('minute steps by 15', async ({ page }) => {
      const sec = section(page, S);
      const minuteInput = sec.locator('input[aria-label="Minute"]');
      await minuteInput.click();
      await minuteInput.press('ArrowUp');
      await expect(minuteInput).toHaveValue('15');
      await expect(sec.locator('[data-testid="step-value"]')).toContainText('10:15');
    });

    test('minute wraps from 45 to 0', async ({ page }) => {
      const sec = section(page, S);
      const minuteInput = sec.locator('input[aria-label="Minute"]');
      await minuteInput.click();
      // Step 3 times: 0 -> 15 -> 30 -> 45
      await minuteInput.press('ArrowUp');
      await minuteInput.press('ArrowUp');
      await minuteInput.press('ArrowUp');
      await expect(minuteInput).toHaveValue('45');
      // Step once more: 45 -> 0 (wrap)
      await minuteInput.press('ArrowUp');
      await expect(minuteInput).toHaveValue('00');
    });
  });

  // ==================== Disabled ====================

  test.describe('disabled state', () => {
    const S = 'disabled';

    test('inputs are disabled', async ({ page }) => {
      const sec = section(page, S);
      const hourInput = sec.locator('input[aria-label="Hour"]');
      await expect(hourInput).toBeDisabled();
      const minuteInput = sec.locator('input[aria-label="Minute"]');
      await expect(minuteInput).toBeDisabled();
    });

    test('group has disabled styling', async ({ page }) => {
      const sec = section(page, S);
      const group = sec.locator('[role="group"]');
      await expect(group).toHaveClass(/opacity-50/);
    });
  });

  // ==================== Loading ====================

  test.describe('loading state', () => {
    const S = 'loading';

    test('inputs are disabled when loading', async ({ page }) => {
      const sec = section(page, S);
      const hourInput = sec.locator('input[aria-label="Hour"]');
      await expect(hourInput).toBeDisabled();
    });

    test('spinner is visible', async ({ page }) => {
      const sec = section(page, S);
      const spinner = sec.locator('[role="status"]');
      await expect(spinner).toBeVisible();
    });
  });

  // ==================== Validation Colors ====================

  test.describe('validation colors', () => {
    const S = 'validation';

    test('failure color sets aria-invalid', async ({ page }) => {
      const sec = section(page, S);
      const groups = sec.locator('[role="group"]');
      const errorGroup = groups.first();
      await expect(errorGroup).toHaveAttribute('aria-invalid', 'true');
    });

    test('helper text is visible', async ({ page }) => {
      const sec = section(page, S);
      await expect(sec.getByText('Time is required')).toBeVisible();
      await expect(sec.getByText('Outside business hours')).toBeVisible();
      await expect(sec.getByText('Time is valid')).toBeVisible();
    });

    test('required asterisk is visible', async ({ page }) => {
      const sec = section(page, S);
      await expect(sec.getByText('*')).toBeVisible();
    });
  });

  // ==================== Sizing ====================

  test.describe('sizing', () => {
    const S = 'sizing';

    test('renders all size variants', async ({ page }) => {
      const sec = section(page, S);
      const groups = sec.locator('[role="group"]');
      await expect(groups).toHaveCount(3);
    });
  });

  // ==================== Accessibility ====================

  test.describe('accessibility', () => {
    test('group has aria-label', async ({ page }) => {
      const group = section(page, 'basic-24h').locator('[role="group"]');
      await expect(group).toHaveAttribute('aria-label', 'Time selection');
    });

    test('hour input has aria-label', async ({ page }) => {
      const hourInput = section(page, 'basic-24h').locator('input[aria-label="Hour"]');
      await expect(hourInput).toBeVisible();
    });

    test('helper text linked via aria-describedby', async ({ page }) => {
      const group = section(page, 'validation').locator('[role="group"]').first();
      const describedby = await group.getAttribute('aria-describedby');
      expect(describedby).toBeTruthy();
      const helper = page.locator(`#${describedby}`);
      await expect(helper).toContainText('Time is required');
    });
  });

  // ==================== Keyboard Navigation ====================

  test.describe('keyboard navigation', () => {
    test('tab moves between inputs', async ({ page }) => {
      const sec = section(page, 'basic-24h');
      const hourInput = sec.locator('input[aria-label="Hour"]');
      const minuteInput = sec.locator('input[aria-label="Minute"]');

      await hourInput.focus();
      await expect(hourInput).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(minuteInput).toBeFocused();
    });

    test('tab moves through hour, minute, second in seconds mode', async ({ page }) => {
      const sec = section(page, 'with-seconds');
      const hourInput = sec.locator('input[aria-label="Hour"]');
      const minuteInput = sec.locator('input[aria-label="Minute"]');
      const secondInput = sec.locator('input[aria-label="Second"]');

      await hourInput.focus();
      await page.keyboard.press('Tab');
      await expect(minuteInput).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(secondInput).toBeFocused();
    });
  });
});
