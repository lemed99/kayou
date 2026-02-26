import { expect, test } from '@playwright/test';

test.describe('Alert', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/alert');
  });

  // ==================== Basic Rendering ====================

  test('should render alerts with role="alert"', async ({ page }) => {
    const alerts = page.locator('[role="alert"]');
    const count = await alerts.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('should display alert with text content', async ({ page }) => {
    const alert = page.locator('[role="alert"]').first();
    await expect(alert).toBeVisible();
    await expect(alert).toContainText('Info alert message');
  });

  // ==================== Color Variants ====================

  test('should render info variant with blue background', async ({ page }) => {
    const infoAlert = page.locator('[role="alert"].bg-blue-100').first();
    await expect(infoAlert).toBeVisible();
    await expect(infoAlert).toContainText('Info alert message');
  });

  test('should render success variant with green background', async ({ page }) => {
    const successAlert = page.locator('[role="alert"].bg-green-100').first();
    await expect(successAlert).toBeVisible();
    await expect(successAlert).toContainText('Success alert message');
  });

  test('should render warning variant with yellow background', async ({ page }) => {
    const warningAlert = page.locator('[role="alert"].bg-yellow-100').first();
    await expect(warningAlert).toBeVisible();
    await expect(warningAlert).toContainText('Warning alert message');
  });

  test('should render failure variant with red background', async ({ page }) => {
    const failureAlert = page.locator('[role="alert"].bg-red-100').first();
    await expect(failureAlert).toBeVisible();
    await expect(failureAlert).toContainText('Failure alert message');
  });

  test('should render dark variant with gray background', async ({ page }) => {
    const darkAlert = page.locator('[role="alert"].bg-neutral-800').first();
    await expect(darkAlert).toBeVisible();
    await expect(darkAlert).toContainText('Dark alert message');
  });

  test('all five color variants should have distinct background classes', async ({
    page,
  }) => {
    const bgClasses = [
      'bg-blue-100',
      'bg-green-100',
      'bg-yellow-100',
      'bg-red-100',
      'bg-neutral-800',
    ];
    for (const bg of bgClasses) {
      const alert = page.locator(`[role="alert"].${bg}`);
      await expect(alert.first()).toBeVisible();
    }
  });

  // ==================== Border ====================

  test('should render visible border on alerts', async ({ page }) => {
    const alert = page.locator('[role="alert"]').first();
    const classes = await alert.getAttribute('class');
    expect(classes).toContain('border');
  });

  test('info alert should have blue border color', async ({ page }) => {
    const infoAlert = page.locator('[role="alert"].bg-blue-100').first();
    const classes = await infoAlert.getAttribute('class');
    expect(classes).toContain('border-blue-500');
  });

  // ==================== Icon Support ====================

  test('should display SVG icon when icon prop is provided', async ({ page }) => {
    const iconAlert = page
      .locator('[role="alert"]')
      .filter({ hasText: 'Alert with an info icon' });
    await expect(iconAlert).toBeVisible();

    const svg = iconAlert.locator('svg');
    await expect(svg).toBeVisible();
  });

  test('icon should have aria-hidden for accessibility', async ({ page }) => {
    const iconAlert = page
      .locator('[role="alert"]')
      .filter({ hasText: 'Alert with an info icon' });
    const svg = iconAlert.locator('svg');
    await expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  // ==================== Additional Content ====================

  test('should render additional content below main message', async ({ page }) => {
    const alert = page.locator('[role="alert"]').filter({ hasText: 'Action required' });
    await expect(alert).toBeVisible();
    await expect(alert).toContainText('Please review the details and take action.');
  });

  test('additional content should be in a separate div from main message', async ({
    page,
  }) => {
    const alert = page.locator('[role="alert"]').filter({ hasText: 'Action required' });

    // The alert should have at least 2 child divs: one for message, one for additional content
    const childDivs = alert.locator(':scope > div');
    const count = await childDivs.count();
    expect(count).toBe(2);
  });

  // ==================== Accessibility ====================

  test('all alerts should have role="alert"', async ({ page }) => {
    const alerts = page.locator('[role="alert"]');
    const count = await alerts.count();

    for (let i = 0; i < count; i++) {
      await expect(alerts.nth(i)).toHaveAttribute('role', 'alert');
    }
  });

  // ==================== Styling ====================

  test('alerts should have rounded corners', async ({ page }) => {
    const alert = page.locator('[role="alert"]').first();
    const classes = await alert.getAttribute('class');
    expect(classes).toContain('rounded-lg');
  });

  test('alerts should have padding', async ({ page }) => {
    const alert = page.locator('[role="alert"]').first();
    const classes = await alert.getAttribute('class');
    expect(classes).toContain('p-4');
  });

  // ==================== Multiple Alerts ====================

  test('should render multiple independent alerts', async ({ page }) => {
    const alerts = page.locator('[role="alert"]');
    const count = await alerts.count();
    expect(count).toBeGreaterThanOrEqual(7);

    // First and last should have different background colors
    const firstClasses = await alerts.first().getAttribute('class');
    const lastClasses = await alerts.last().getAttribute('class');
    expect(firstClasses).not.toBe(lastClasses);
  });
});
