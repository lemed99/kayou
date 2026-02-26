import { expect, test, type Locator, type Page } from '@playwright/test';

/** Wait for the playground to compile and render the first TimePicker. */
async function waitForPlayground(page: Page): Promise<Locator> {
  const playground = page.locator('section#playground');
  await playground.scrollIntoViewIfNeeded();
  const firstGroup = playground.locator('[role="group"]').first();
  await expect(firstGroup).toBeVisible({ timeout: 15000 });
  return playground;
}

/** Get a data-section wrapper inside the playground. */
const section = (pg: Locator, name: string) => pg.locator(`[data-section="${name}"]`);

test.describe('TimePicker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/time-picker', { waitUntil: 'networkidle' });
  });

  // ==================== Basic 24h Rendering ====================

  test.describe('basic 24h format', () => {
    test('renders label and group', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'basic-24h');
      await expect(sec.getByText('Start Time')).toBeVisible();
      const group = sec.locator('[role="group"]');
      await expect(group).toBeVisible();
    });

    test('displays correct initial values', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'basic-24h');
      const hourInput = sec.locator('input[aria-label="Hour"]');
      const minuteInput = sec.locator('input[aria-label="Minute"]');
      await expect(hourInput).toHaveValue('14');
      await expect(minuteInput).toHaveValue('30');
    });

    test('changes hour via keyboard', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'basic-24h');
      const hourInput = sec.locator('input[aria-label="Hour"]');
      await hourInput.click();
      await hourInput.press('ArrowUp');
      await expect(hourInput).toHaveValue('15');
      await expect(sec.locator('[data-testid="basic-24h-value"]')).toContainText('15:');
    });

    test('changes minute via keyboard', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'basic-24h');
      const minuteInput = sec.locator('input[aria-label="Minute"]');
      await minuteInput.click();
      await minuteInput.press('ArrowUp');
      await expect(minuteInput).toHaveValue('31');
    });

    test('no AM/PM selector in 24h mode', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'basic-24h');
      await expect(sec.getByRole('combobox')).toHaveCount(0);
    });
  });

  // ==================== 12h Format ====================

  test.describe('12h format', () => {
    test('renders AM/PM selector', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'format-12h');
      await expect(sec.getByRole('combobox')).toBeVisible();
    });

    test('displays hour as 12h (9 AM)', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'format-12h');
      const hourInput = sec.locator('input[aria-label="Hour"]');
      await expect(hourInput).toHaveValue('09');
    });

    test('switching to PM updates the hour value', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'format-12h');
      const trigger = sec.getByRole('combobox');
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

  // ==================== 12h Edge Cases ====================

  test.describe('12h edge cases', () => {
    test('AM to PM at midnight (hour 0 → 12)', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'midnight-12h');
      const trigger = sec.getByRole('combobox');
      await trigger.focus();
      await trigger.press('Enter');
      await page.waitForTimeout(300);

      const pmOption = page.locator('[role="option"]', { hasText: 'PM' });
      await pmOption.click();
      await page.waitForTimeout(200);

      // hour was 0 (12 AM), should now be 12 (12 PM)
      await expect(sec.locator('[data-testid="midnight-12h-value"]')).toContainText('12:');
    });

    test('PM to AM at noon (hour 12 → 0)', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'midnight-12h');
      const trigger = sec.getByRole('combobox');

      // First switch to PM (hour 0 → 12)
      await trigger.focus();
      await trigger.press('Enter');
      await page.waitForTimeout(300);
      await page.locator('[role="option"]', { hasText: 'PM' }).click();
      await page.waitForTimeout(200);
      await expect(sec.locator('[data-testid="midnight-12h-value"]')).toContainText('12:');

      // Now switch back to AM (hour 12 → 0)
      await trigger.focus();
      await trigger.press('Enter');
      await page.waitForTimeout(300);
      await page.locator('[role="option"]', { hasText: 'AM' }).click();
      await page.waitForTimeout(200);
      await expect(sec.locator('[data-testid="midnight-12h-value"]')).toContainText('0:');
    });
  });

  // ==================== With Seconds ====================

  test.describe('with seconds', () => {
    test('renders seconds input', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'with-seconds');
      const secondInput = sec.locator('input[aria-label="Second"]');
      await expect(secondInput).toBeVisible();
    });

    test('changes second via keyboard', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'with-seconds');
      const secondInput = sec.locator('input[aria-label="Second"]');
      await secondInput.click();
      await secondInput.press('ArrowUp');
      await expect(secondInput).toHaveValue('01');
      await expect(sec.locator('[data-testid="with-seconds-value"]')).toContainText(':1');
    });
  });

  // ==================== Step Control ====================

  test.describe('step control', () => {
    test('minute steps by 15', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'step-control');
      const minuteInput = sec.locator('input[aria-label="Minute"]');
      await minuteInput.click();
      await minuteInput.press('ArrowUp');
      await expect(minuteInput).toHaveValue('15');
      await expect(sec.locator('[data-testid="step-value"]')).toContainText('10:15');
    });

    test('minute wraps from 45 to 0', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'step-control');
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

  // ==================== Second Step ====================

  test.describe('second step', () => {
    test('second steps by 15', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'second-step');
      const secondInput = sec.locator('input[aria-label="Second"]');
      await secondInput.click();
      await secondInput.press('ArrowUp');
      await expect(secondInput).toHaveValue('15');
      await expect(sec.locator('[data-testid="second-step-value"]')).toContainText('8:0:15');
    });
  });

  // ==================== Hour Wrapping ====================

  test.describe('hour wrapping', () => {
    test('24h: hour wraps 23 → 0 on ArrowUp', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'basic-24h');
      const hourInput = sec.locator('input[aria-label="Hour"]');
      await hourInput.click();
      await hourInput.fill('23');
      await hourInput.press('Tab');
      await hourInput.focus();
      await hourInput.press('ArrowUp');
      await expect(hourInput).toHaveValue('00');
    });

    test('12h: hour wraps 12 → 1 on ArrowUp', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'format-12h');
      const hourInput = sec.locator('input[aria-label="Hour"]');
      await hourInput.click();
      await hourInput.fill('12');
      await hourInput.press('Tab');
      await hourInput.focus();
      await hourInput.press('ArrowUp');
      await expect(hourInput).toHaveValue('01');
    });
  });

  // ==================== Disabled ====================

  test.describe('disabled state', () => {
    test('inputs are disabled', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'disabled');
      const hourInput = sec.locator('input[aria-label="Hour"]');
      await expect(hourInput).toBeDisabled();
      const minuteInput = sec.locator('input[aria-label="Minute"]');
      await expect(minuteInput).toBeDisabled();
    });

    test('group has disabled styling', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'disabled');
      const group = sec.locator('[role="group"]');
      await expect(group).toHaveClass(/opacity-50/);
    });
  });

  // ==================== Loading ====================

  test.describe('loading state', () => {
    test('inputs are disabled when loading', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'loading');
      const hourInput = sec.locator('input[aria-label="Hour"]');
      await expect(hourInput).toBeDisabled();
    });

    test('spinner is visible', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'loading');
      const spinner = sec.locator('[role="status"]');
      await expect(spinner).toBeVisible();
    });
  });

  // ==================== Validation Colors ====================

  test.describe('validation colors', () => {
    test('failure color sets aria-invalid', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'validation');
      const groups = sec.locator('[role="group"]');
      const errorGroup = groups.first();
      await expect(errorGroup).toHaveAttribute('aria-invalid', 'true');
    });

    test('helper text is visible', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'validation');
      await expect(sec.getByText('Time is required')).toBeVisible();
      await expect(sec.getByText('Outside business hours')).toBeVisible();
      await expect(sec.getByText('Time is valid')).toBeVisible();
    });

    test('required asterisk is visible', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'validation');
      await expect(sec.getByText('*')).toBeVisible();
    });
  });

  // ==================== Sizing ====================

  test.describe('sizing', () => {
    test('renders all size variants', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'sizing');
      const groups = sec.locator('[role="group"]');
      await expect(groups).toHaveCount(3);
    });
  });

  // ==================== Accessibility ====================

  test.describe('accessibility', () => {
    test('group has aria-labelledby pointing to label', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'basic-24h');
      const group = sec.locator('[role="group"]');
      const labelledby = await group.getAttribute('aria-labelledby');
      expect(labelledby).toBeTruthy();
      const label = page.locator(`#${labelledby}`);
      await expect(label).toContainText('Start Time');
    });

    test('group falls back to aria-label when no label prop', async ({ page }) => {
      const pg = await waitForPlayground(page);
      // First sizing variant has no label prop
      const group = section(pg, 'sizing').locator('[role="group"]').first();
      await expect(group).toHaveAttribute('aria-label', 'Time selection');
      await expect(group).not.toHaveAttribute('aria-labelledby');
    });

    test('hour input has aria-label', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const hourInput = section(pg, 'basic-24h').locator('input[aria-label="Hour"]');
      await expect(hourInput).toBeVisible();
    });

    test('helper text linked via aria-describedby', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const group = section(pg, 'validation').locator('[role="group"]').first();
      const describedby = await group.getAttribute('aria-describedby');
      expect(describedby).toBeTruthy();
      const helper = page.locator(`#${describedby}`);
      await expect(helper).toContainText('Time is required');
    });
  });

  // ==================== Keyboard Navigation ====================

  test.describe('keyboard navigation', () => {
    test('tab moves between inputs', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'basic-24h');
      const hourInput = sec.locator('input[aria-label="Hour"]');
      const minuteInput = sec.locator('input[aria-label="Minute"]');

      await hourInput.focus();
      await expect(hourInput).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(minuteInput).toBeFocused();
    });

    test('tab moves through hour, minute, AM/PM in 12h mode', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'format-12h');
      const hourInput = sec.locator('input[aria-label="Hour"]');
      const minuteInput = sec.locator('input[aria-label="Minute"]');
      const combobox = sec.getByRole('combobox');

      await hourInput.focus();
      await page.keyboard.press('Tab');
      await expect(minuteInput).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(combobox).toBeFocused();
    });

    test('tab moves through hour, minute, second in seconds mode', async ({ page }) => {
      const pg = await waitForPlayground(page);
      const sec = section(pg, 'with-seconds');
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
