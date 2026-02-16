import { expect, test } from '@playwright/test';

test.describe('Label', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/label');
  });

  test.describe('Basic rendering', () => {
    test('should render labels with value prop', async ({ page }) => {
      const section = page.locator('#basic-label');
      const labels = section.locator('label');

      await expect(labels.filter({ hasText: 'Email' })).toBeVisible();
      await expect(labels.filter({ hasText: 'Password' })).toBeVisible();
    });

    test('should render as native label element', async ({ page }) => {
      const section = page.locator('#basic-label');
      const label = section.locator('label').first();

      await expect(label).toBeVisible();
      expect(await label.evaluate((el) => el.tagName)).toBe('LABEL');
    });
  });

  test.describe('Color variants', () => {
    test('should render all five color variants', async ({ page }) => {
      const section = page.locator('#color-variants');
      const labels = section.locator('label');

      await expect(labels.filter({ hasText: 'Default label' })).toBeVisible();
      await expect(labels.filter({ hasText: 'Info label' })).toBeVisible();
      await expect(labels.filter({ hasText: 'Success label' })).toBeVisible();
      await expect(labels.filter({ hasText: 'Warning label' })).toBeVisible();
      await expect(labels.filter({ hasText: 'Error label' })).toBeVisible();
    });

    test('should apply correct text color classes', async ({ page }) => {
      const section = page.locator('#color-variants');
      const labels = section.locator('label');

      const expected = [
        { text: 'Default label', color: 'text-neutral-900' },
        { text: 'Info label', color: 'text-blue-500' },
        { text: 'Success label', color: 'text-green-700' },
        { text: 'Warning label', color: 'text-yellow-500' },
        { text: 'Error label', color: 'text-red-700' },
      ];

      for (const { text, color } of expected) {
        const label = labels.filter({ hasText: text });
        const classes = await label.getAttribute('class');
        expect(classes, `"${text}" should have ${color}`).toContain(color);
      }
    });
  });

  test.describe('Form association', () => {
    test('should associate with input via for attribute', async ({ page }) => {
      const section = page.locator('#with-form-element');
      const label = section.locator('label');

      await expect(label).toHaveAttribute('for', 'username-input');
    });

    test('should focus associated input on click', async ({ page }) => {
      const section = page.locator('#with-form-element');
      const label = section.locator('label');
      const input = section.locator('#username-input');

      await label.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await label.click();
      await expect(input).toBeFocused();
    });
  });

  test.describe('Children content', () => {
    test('should render children with custom JSX', async ({ page }) => {
      const section = page.locator('#using-children');
      const label = section.locator('label');

      await expect(label).toBeVisible();
      await expect(label).toContainText('Email Address');
      // Should contain the red asterisk span
      const asterisk = label.locator('span.text-red-500');
      await expect(asterisk).toHaveText('*');
    });
  });

  test.describe('Base styling', () => {
    test('should have base text-sm font-medium classes', async ({ page }) => {
      const section = page.locator('#basic-label');
      const label = section.locator('label').first();
      const classes = await label.getAttribute('class');

      expect(classes).toContain('text-sm');
      expect(classes).toContain('font-medium');
    });
  });
});
