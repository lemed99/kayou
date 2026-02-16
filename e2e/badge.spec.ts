import { expect, test } from '@playwright/test';

test.describe('Badge', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/badge');
  });

  test.describe('Color variants', () => {
    test('should render all six color variants', async ({ page }) => {
      const section = page.locator('#color-variants');
      const badges = section.locator('div.flex.h-fit');

      const count = await badges.count();
      expect(count).toBe(6);

      await expect(badges.filter({ hasText: /^Default$/ })).toBeVisible();
      await expect(badges.filter({ hasText: /^Gray$/ })).toBeVisible();
      await expect(badges.filter({ hasText: /^Success$/ })).toBeVisible();
      await expect(badges.filter({ hasText: /^Warning$/ })).toBeVisible();
      await expect(badges.filter({ hasText: /^Failure$/ })).toBeVisible();
      await expect(badges.filter({ hasText: /^Dark$/ })).toBeVisible();
    });

    test('should apply correct background classes per color', async ({ page }) => {
      const section = page.locator('#color-variants');
      const badges = section.locator('div.flex.h-fit');

      const expected = [
        { text: /^Default$/, bg: 'bg-blue-100' },
        { text: /^Gray$/, bg: 'bg-neutral-100' },
        { text: /^Success$/, bg: 'bg-green-100' },
        { text: /^Warning$/, bg: 'bg-yellow-100' },
        { text: /^Failure$/, bg: 'bg-red-100' },
        { text: /^Dark$/, bg: 'bg-neutral-700' },
      ];

      for (const { text, bg } of expected) {
        const badge = badges.filter({ hasText: text });
        const classes = await badge.getAttribute('class');
        expect(classes).toContain(bg);
      }
    });
  });

  test.describe('Size variants', () => {
    test('should render xs and sm sizes', async ({ page }) => {
      const section = page.locator('#sizes');
      const badges = section.locator('div.flex.h-fit');

      await expect(badges.filter({ hasText: /^Extra Small$/ })).toBeVisible();
      await expect(badges.filter({ hasText: /^Small$/ })).toBeVisible();
    });

    test('should apply correct text size classes', async ({ page }) => {
      const section = page.locator('#sizes');
      const badges = section.locator('div.flex.h-fit');

      const xsClasses = await badges
        .filter({ hasText: /^Extra Small$/ })
        .getAttribute('class');
      const smClasses = await badges.filter({ hasText: /^Small$/ }).getAttribute('class');

      expect(xsClasses).toContain('text-xs');
      expect(smClasses).toContain('text-sm');
    });

    test('sm badge should be taller than xs badge', async ({ page }) => {
      const section = page.locator('#sizes');
      const badges = section.locator('div.flex.h-fit');

      const xsBox = await badges.filter({ hasText: /^Extra Small$/ }).boundingBox();
      const smBox = await badges.filter({ hasText: /^Small$/ }).boundingBox();

      expect(xsBox).toBeTruthy();
      expect(smBox).toBeTruthy();
      expect(smBox!.height).toBeGreaterThan(xsBox!.height);
    });
  });

  test.describe('Status indicators', () => {
    test('should render status badges with semantic colors', async ({ page }) => {
      const section = page.locator('#status-indicators');
      const badges = section.locator('div.flex.h-fit');

      const activeClasses = await badges
        .filter({ hasText: /^Active$/ })
        .getAttribute('class');
      const pendingClasses = await badges
        .filter({ hasText: /^Pending$/ })
        .getAttribute('class');
      const inactiveClasses = await badges
        .filter({ hasText: /^Inactive$/ })
        .getAttribute('class');

      expect(activeClasses).toContain('bg-green-100');
      expect(pendingClasses).toContain('bg-yellow-100');
      expect(inactiveClasses).toContain('bg-red-100');
    });
  });

  test.describe('Structure', () => {
    test('should render children inside a span', async ({ page }) => {
      const section = page.locator('#color-variants');
      const badge = section.locator('div.flex.h-fit').filter({ hasText: /^Default$/ });
      const span = badge.locator('> span');

      await expect(span).toBeVisible();
      await expect(span).toHaveText('Default');
    });

    test('should have base styling classes', async ({ page }) => {
      const section = page.locator('#color-variants');
      const badge = section.locator('div.flex.h-fit').filter({ hasText: /^Default$/ });
      const classes = await badge.getAttribute('class');

      expect(classes).toContain('flex');
      expect(classes).toContain('rounded');
      expect(classes).toContain('px-2');
    });
  });
});
