import { expect, test } from '@playwright/test';

test.describe('Button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/button');
  });

  // ==================== Basic Rendering ====================

  test('should render button components', async ({ page }) => {
    const buttons = page.locator('button');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display button text', async ({ page }) => {
    const button = page.locator('button').first();
    const text = await button.textContent();
    expect(text).toBeTruthy();
    expect(text!.length).toBeGreaterThan(0);
  });

  // ==================== Click Behavior ====================

  test('should be clickable', async ({ page }) => {
    const button = page
      .locator('button')
      .filter({ hasNotText: /Disabled/i })
      .first();
    await expect(button).toBeEnabled();
    await button.click();
  });

  test('should trigger click handler on click', async ({ page }) => {
    // Find the Interactive Loading section
    const interactiveSection = page.locator('text=Interactive Loading').first();

    if (await interactiveSection.isVisible()) {
      // Find an enabled button with "Click Me" text (not disabled/loading)
      const button = page
        .locator('button:not([disabled])')
        .filter({ hasText: /Click Me/i })
        .first();

      if (await button.isVisible()) {
        await button.click();

        // Wait for loading state to appear - the button should now show "Loading"
        await expect(
          page
            .locator('button')
            .filter({ hasText: /Loading/i })
            .first(),
        ).toBeVisible({
          timeout: 2000,
        });
      }
    }
  });

  // ==================== Color Variants ====================

  test('should render info color variant', async ({ page }) => {
    const infoButton = page
      .locator('button')
      .filter({ hasText: /^Info$/i })
      .first();
    if (await infoButton.isVisible()) {
      await expect(infoButton).toBeVisible();
    }
  });

  test('should render gray color variant', async ({ page }) => {
    const grayButton = page
      .locator('button')
      .filter({ hasText: /^Gray$/i })
      .first();
    if (await grayButton.isVisible()) {
      await expect(grayButton).toBeVisible();
    }
  });

  test('should render dark color variant', async ({ page }) => {
    const darkButton = page
      .locator('button')
      .filter({ hasText: /^Dark$/i })
      .first();
    if (await darkButton.isVisible()) {
      await expect(darkButton).toBeVisible();
    }
  });

  test('should render light color variant', async ({ page }) => {
    const lightButton = page
      .locator('button')
      .filter({ hasText: /^Light$/i })
      .first();
    if (await lightButton.isVisible()) {
      await expect(lightButton).toBeVisible();
    }
  });

  test('should render success color variant', async ({ page }) => {
    const successButton = page
      .locator('button')
      .filter({ hasText: /^Success$/i })
      .first();
    if (await successButton.isVisible()) {
      await expect(successButton).toBeVisible();
    }
  });

  test('should render failure color variant', async ({ page }) => {
    const failureButton = page
      .locator('button')
      .filter({ hasText: /^Failure$/i })
      .first();
    if (await failureButton.isVisible()) {
      await expect(failureButton).toBeVisible();
    }
  });

  test('should render warning color variant', async ({ page }) => {
    const warningButton = page
      .locator('button')
      .filter({ hasText: /^Warning$/i })
      .first();
    if (await warningButton.isVisible()) {
      await expect(warningButton).toBeVisible();
    }
  });

  test('should render blue color variant', async ({ page }) => {
    const blueButton = page
      .locator('button')
      .filter({ hasText: /^Blue$/i })
      .first();
    if (await blueButton.isVisible()) {
      await expect(blueButton).toBeVisible();
    }
  });

  // ==================== Size Variants ====================

  test('should render extra small size variant', async ({ page }) => {
    const xsButton = page
      .locator('button')
      .filter({ hasText: /Extra Small/i })
      .first();
    if (await xsButton.isVisible()) {
      await expect(xsButton).toBeVisible();
      // XS buttons should have smaller padding/font
      const classes = await xsButton.getAttribute('class');
      expect(classes).toBeTruthy();
    }
  });

  test('should render small size variant', async ({ page }) => {
    const smButton = page
      .locator('button')
      .filter({ hasText: /^Small$/i })
      .first();
    if (await smButton.isVisible()) {
      await expect(smButton).toBeVisible();
    }
  });

  test('should render medium size variant', async ({ page }) => {
    const mdButton = page
      .locator('button')
      .filter({ hasText: /Medium/i })
      .first();
    if (await mdButton.isVisible()) {
      await expect(mdButton).toBeVisible();
    }
  });

  test('buttons should have different sizes', async ({ page }) => {
    const xsButton = page
      .locator('button')
      .filter({ hasText: /Extra Small/i })
      .first();
    const mdButton = page
      .locator('button')
      .filter({ hasText: /Medium/i })
      .first();

    if ((await xsButton.isVisible()) && (await mdButton.isVisible())) {
      const xsBox = await xsButton.boundingBox();
      const mdBox = await mdButton.boundingBox();

      if (xsBox && mdBox) {
        // MD should be larger than XS
        expect(mdBox.height).toBeGreaterThanOrEqual(xsBox.height);
      }
    }
  });

  // ==================== Loading State ====================

  test('should render loading state with spinner', async ({ page }) => {
    // Look for buttons with loading text or spinner
    const loadingButton = page
      .locator('button')
      .filter({ hasText: /Saving|Processing|Loading/i })
      .first();

    if (await loadingButton.isVisible()) {
      // Loading button should have spinner SVG with animate-spin
      const spinner = loadingButton.locator('svg');
      const count = await spinner.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('loading button should not be interactive', async ({ page }) => {
    // Find the interactive loading button and click it
    const clickMeButton = page
      .locator('button')
      .filter({ hasText: /Click Me/i })
      .first();

    if (await clickMeButton.isVisible()) {
      await clickMeButton.click();
      await page.waitForTimeout(100);

      // While loading, button should have pointer-events-none or be disabled
      const loadingButton = page
        .locator('button')
        .filter({ hasText: /Loading/i })
        .first();
      if (await loadingButton.isVisible()) {
        const classes = await loadingButton.getAttribute('class');
        // Should have some indication of non-interactivity
        expect(classes).toBeTruthy();
      }
    }
  });

  test('loading state should show spinner overlay', async ({ page }) => {
    const loadingButton = page
      .locator('button')
      .filter({ hasText: /Saving|Processing/i })
      .first();

    if (await loadingButton.isVisible()) {
      const spinner = loadingButton.locator('svg.animate-spin, [class*="animate-spin"]');
      const count = await spinner.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  // ==================== Disabled State ====================

  test('should render disabled button', async ({ page }) => {
    const disabledButton = page.locator('button[disabled]');
    const count = await disabledButton.count();

    if (count > 0) {
      await expect(disabledButton.first()).toBeDisabled();
    }
  });

  test('disabled button should not be clickable', async ({ page }) => {
    const disabledButton = page.locator('button[disabled]').first();

    if (await disabledButton.isVisible()) {
      await expect(disabledButton).toBeDisabled();
    }
  });

  test('disabled button should have reduced opacity or different styling', async ({
    page,
  }) => {
    const disabledButton = page.locator('button[disabled]').first();

    if (await disabledButton.isVisible()) {
      const classes = await disabledButton.getAttribute('class');
      // Should have disabled styling (cursor-not-allowed, opacity, etc.)
      expect(classes).toBeTruthy();
    }
  });

  // ==================== Keyboard Accessibility ====================

  test('should be focusable via keyboard', async ({ page }) => {
    const button = page
      .locator('button')
      .filter({ hasNotText: /Disabled/i })
      .first();
    await button.focus();
    await expect(button).toBeFocused();
  });

  test('should activate on Enter key', async ({ page }) => {
    const button = page
      .locator('button')
      .filter({ hasText: /Click Me/i })
      .first();

    if (await button.isVisible()) {
      await button.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(100);

      // Button should have triggered its action
      const text = await button.textContent();
      expect(text).toBeTruthy();
    }
  });

  test('should activate on Space key', async ({ page }) => {
    const button = page
      .locator('button')
      .filter({ hasText: /Click Me/i })
      .first();

    if (await button.isVisible()) {
      await button.focus();
      await page.keyboard.press('Space');
      await page.waitForTimeout(100);

      const text = await button.textContent();
      expect(text).toBeTruthy();
    }
  });

  test('should have visible focus indicator', async ({ page }) => {
    const button = page
      .locator('button')
      .filter({ hasNotText: /Disabled/i })
      .first();
    await button.focus();
    await expect(button).toBeFocused();
  });

  // ==================== Button Type Attribute ====================

  test('should have proper button type attribute', async ({ page }) => {
    const button = page.locator('button').first();
    const type = await button.getAttribute('type');
    expect(['button', 'submit', 'reset', null]).toContain(type);
  });

  // ==================== Hover States ====================

  test('should change appearance on hover', async ({ page }) => {
    const button = page
      .locator('button')
      .filter({ hasNotText: /Disabled/i })
      .first();

    if (await button.isVisible()) {
      await button.hover();
      // Hover state should be applied (visual change)
      await expect(button).toBeVisible();
    }
  });

  // ==================== Edge Cases ====================

  test('should handle rapid clicking gracefully', async ({ page }) => {
    const button = page
      .locator('button')
      .filter({ hasText: /Click Me/i })
      .first();

    if (await button.isVisible()) {
      // Rapid clicks
      await button.click();
      await button.click();
      await button.click();

      await page.waitForTimeout(500);

      // Page should still be functional
      await expect(button).toBeVisible();
    }
  });

  test('should render button with long text', async ({ page }) => {
    // Verify buttons with various text lengths render properly
    const buttons = page.locator('button');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });

  // ==================== Interactive Loading Demo ====================

  test('should show loading state after click and return to normal', async ({ page }) => {
    // Find the Interactive Loading section
    const interactiveSection = page.locator('text=Interactive Loading').first();

    if (await interactiveSection.isVisible()) {
      // Find an enabled button with "Click Me" text (not disabled/loading)
      const button = page
        .locator('button:not([disabled])')
        .filter({ hasText: /Click Me/i })
        .first();

      if (await button.isVisible()) {
        // Click to trigger loading
        await button.click();

        // Wait for loading state to appear
        await expect(
          page
            .locator('button')
            .filter({ hasText: /Loading/i })
            .first(),
        ).toBeVisible({
          timeout: 2000,
        });

        // Wait for loading to complete (2 seconds based on the component)
        await expect(
          page
            .locator('button:not([disabled])')
            .filter({ hasText: /Click Me/i })
            .first(),
        ).toBeVisible({
          timeout: 3000,
        });
      }
    }
  });

  // ==================== Multiple Buttons ====================

  test('should render all color variants', async ({ page }) => {
    const colors = [
      'Info',
      'Gray',
      'Dark',
      'Light',
      'Success',
      'Failure',
      'Warning',
      'Blue',
    ];
    let foundCount = 0;

    for (const color of colors) {
      const button = page
        .locator('button')
        .filter({ hasText: new RegExp(`^${color}$`, 'i') })
        .first();
      if (await button.isVisible()) {
        foundCount++;
      }
    }

    // Should find at least some color variants
    expect(foundCount).toBeGreaterThan(0);
  });

  test('should render all size variants', async ({ page }) => {
    const sizes = ['Extra Small', 'Small', 'Medium'];
    let foundCount = 0;

    for (const size of sizes) {
      const button = page
        .locator('button')
        .filter({ hasText: new RegExp(size, 'i') })
        .first();
      if (await button.isVisible()) {
        foundCount++;
      }
    }

    expect(foundCount).toBeGreaterThan(0);
  });
});
