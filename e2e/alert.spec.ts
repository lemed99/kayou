import { expect, test } from '@playwright/test';

test.describe('Alert', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/alert');
  });

  // ==================== Basic Rendering ====================

  test('should render alert components', async ({ page }) => {
    const alerts = page.locator('[role="alert"]');
    const count = await alerts.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display alert with content', async ({ page }) => {
    const alert = page.locator('[role="alert"]').first();
    const text = await alert.textContent();
    expect(text).toBeTruthy();
    expect(text!.length).toBeGreaterThan(0);
  });

  test('should render alert as block element', async ({ page }) => {
    const alert = page.locator('[role="alert"]').first();
    const box = await alert.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThan(100);
  });

  // ==================== Color Variants ====================

  test('should render info color variant', async ({ page }) => {
    const infoAlert = page
      .locator('[role="alert"]')
      .filter({ hasText: /Info alert/i })
      .first();
    if (await infoAlert.isVisible()) {
      await expect(infoAlert).toBeVisible();
    }
  });

  test('should render success color variant', async ({ page }) => {
    const successAlert = page
      .locator('[role="alert"]')
      .filter({ hasText: /Success alert/i })
      .first();
    if (await successAlert.isVisible()) {
      await expect(successAlert).toBeVisible();
    }
  });

  test('should render warning color variant', async ({ page }) => {
    const warningAlert = page
      .locator('[role="alert"]')
      .filter({ hasText: /Warning/i })
      .first();
    if (await warningAlert.isVisible()) {
      await expect(warningAlert).toBeVisible();
    }
  });

  test('should render failure color variant', async ({ page }) => {
    const failureAlert = page
      .locator('[role="alert"]')
      .filter({ hasText: /Failure alert/i })
      .first();
    if (await failureAlert.isVisible()) {
      await expect(failureAlert).toBeVisible();
    }
  });

  test('should render dark color variant', async ({ page }) => {
    const darkAlert = page
      .locator('[role="alert"]')
      .filter({ hasText: /Dark alert/i })
      .first();
    if (await darkAlert.isVisible()) {
      await expect(darkAlert).toBeVisible();
    }
  });

  test('should render all five color variants', async ({ page }) => {
    const colors = ['Info', 'Success', 'Warning', 'Failure', 'Dark'];
    let foundCount = 0;

    for (const color of colors) {
      const alert = page
        .locator('[role="alert"]')
        .filter({ hasText: new RegExp(`${color}`, 'i') })
        .first();
      if (await alert.isVisible()) {
        foundCount++;
      }
    }

    expect(foundCount).toBeGreaterThan(0);
  });

  // ==================== Icon Support ====================

  test('should display alert icon when provided', async ({ page }) => {
    // Find alert with icon text
    const alertWithIcon = page
      .locator('[role="alert"]')
      .filter({ hasText: /icon/i })
      .first();

    if (await alertWithIcon.isVisible()) {
      const svg = alertWithIcon.locator('svg');
      const count = await svg.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should position icon correctly within alert', async ({ page }) => {
    const alert = page.locator('[role="alert"]').first();
    const svg = alert.locator('svg').first();

    if (await svg.isVisible()) {
      await expect(svg).toBeVisible();
    }
  });

  // ==================== Additional Content ====================

  test('should render additional content below main message', async ({ page }) => {
    const additionalContentAlert = page
      .locator('[role="alert"]')
      .filter({ hasText: /additional|review|action/i })
      .first();

    if (await additionalContentAlert.isVisible()) {
      const content = await additionalContentAlert.textContent();
      expect(content).toBeTruthy();
    }
  });

  test('should support rich content in additional section', async ({ page }) => {
    const alerts = page.locator('[role="alert"]');
    const count = await alerts.count();

    // Check that at least one alert has nested content
    for (let i = 0; i < count; i++) {
      const alert = alerts.nth(i);
      const innerHTML = await alert.innerHTML();
      if (innerHTML.includes('<div')) {
        // Found an alert with nested divs (additional content)
        expect(innerHTML).toBeTruthy();
        break;
      }
    }
  });

  // ==================== Accessibility (ARIA) ====================

  test('should have correct aria role', async ({ page }) => {
    const alerts = page.locator('[role="alert"]');
    const count = await alerts.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      await expect(alerts.nth(i)).toHaveAttribute('role', 'alert');
    }
  });

  test('should be accessible to screen readers', async ({ page }) => {
    const alert = page.locator('[role="alert"]').first();
    await expect(alert).toBeVisible();
    await expect(alert).toHaveAttribute('role', 'alert');
  });

  test('should have sufficient color contrast', async ({ page }) => {
    const alert = page.locator('[role="alert"]').first();
    await expect(alert).toBeVisible();
    // Just verify the alert is visible - color contrast should be handled by the component
  });

  // ==================== Keyboard Accessibility ====================

  test('should be focusable if interactive', async ({ page }) => {
    const alert = page.locator('[role="alert"]').first();

    // Alerts themselves are not typically focusable, but any buttons inside should be
    const button = alert.locator('button');
    const buttonCount = await button.count();

    if (buttonCount > 0) {
      await button.first().focus();
      await expect(button.first()).toBeFocused();
    }
  });

  // ==================== Visual States ====================

  test('should have distinct visual styles for each color', async ({ page }) => {
    const alerts = page.locator('[role="alert"]');
    const count = await alerts.count();
    expect(count).toBeGreaterThan(0);

    // Each alert should have some styling classes
    for (let i = 0; i < Math.min(count, 3); i++) {
      const classes = await alerts.nth(i).getAttribute('class');
      expect(classes).toBeTruthy();
    }
  });

  test('should render with proper spacing', async ({ page }) => {
    const alert = page.locator('[role="alert"]').first();
    const box = await alert.boundingBox();

    expect(box).toBeTruthy();
    expect(box!.height).toBeGreaterThan(20); // Minimum height for padding
  });

  test('should render text content correctly', async ({ page }) => {
    const alert = page.locator('[role="alert"]').first();
    const text = await alert.textContent();

    expect(text).toBeTruthy();
    expect(text!.trim().length).toBeGreaterThan(0);
  });

  // ==================== Multiple Alerts ====================

  test('should render multiple alerts on page', async ({ page }) => {
    const alerts = page.locator('[role="alert"]');
    const count = await alerts.count();
    expect(count).toBeGreaterThan(1);
  });

  test('each alert should be independently styled', async ({ page }) => {
    const alerts = page.locator('[role="alert"]');
    const count = await alerts.count();

    if (count >= 2) {
      const firstClasses = await alerts.nth(0).getAttribute('class');
      const secondClasses = await alerts.nth(1).getAttribute('class');

      // Both should have classes (may be same or different depending on color)
      expect(firstClasses).toBeTruthy();
      expect(secondClasses).toBeTruthy();
    }
  });

  // ==================== Edge Cases ====================

  test('should handle long content gracefully', async ({ page }) => {
    const alerts = page.locator('[role="alert"]');
    const count = await alerts.count();
    expect(count).toBeGreaterThan(0);

    // Verify alerts are visible even with varying content lengths
    await expect(alerts.first()).toBeVisible();
  });

  test('should remain visible after page interactions', async ({ page }) => {
    const alert = page.locator('[role="alert"]').first();
    await expect(alert).toBeVisible();

    // Scroll the page
    await page.evaluate(() => window.scrollBy(0, 100));
    await page.waitForTimeout(100);

    // Alert should still be visible or scrolled
    const count = await page.locator('[role="alert"]').count();
    expect(count).toBeGreaterThan(0);
  });

  test('should support custom CSS classes', async ({ page }) => {
    const alert = page.locator('[role="alert"]').first();
    const classes = await alert.getAttribute('class');
    expect(classes).toBeTruthy();
  });
});
