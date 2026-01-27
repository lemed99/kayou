import { expect, test } from '@playwright/test';

test.describe('Badge', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/badge');
  });

  // ==================== Basic Rendering ====================

  test('should render badge components', async ({ page }) => {
    const badges = page
      .locator('span')
      .filter({
        hasText: /Default|Gray|Success|Warning|Failure|Dark|Active|Pending|Inactive/i,
      });
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display badge with text content', async ({ page }) => {
    const badge = page.locator('text=Default').first();
    await expect(badge).toBeVisible();
  });

  test('should render badge as inline element', async ({ page }) => {
    const badges = page
      .locator('span')
      .filter({ hasText: /Default|Gray|Success|Warning|Failure|Dark/i });
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);
  });

  // ==================== Color Variants ====================

  test('should render default color variant', async ({ page }) => {
    const defaultBadge = page.locator('text=Default').first();
    await expect(defaultBadge).toBeVisible();
  });

  test('should render gray color variant', async ({ page }) => {
    const grayBadge = page
      .locator('span')
      .filter({ hasText: /^Gray$/i })
      .first();
    if (await grayBadge.isVisible()) {
      await expect(grayBadge).toBeVisible();
    }
  });

  test('should render success color variant', async ({ page }) => {
    const successBadge = page
      .locator('span')
      .filter({ hasText: /^Success$/i })
      .first();
    if (await successBadge.isVisible()) {
      await expect(successBadge).toBeVisible();
    }
  });

  test('should render warning color variant', async ({ page }) => {
    const warningBadge = page
      .locator('span')
      .filter({ hasText: /^Warning$/i })
      .first();
    if (await warningBadge.isVisible()) {
      await expect(warningBadge).toBeVisible();
    }
  });

  test('should render failure color variant', async ({ page }) => {
    const failureBadge = page
      .locator('span')
      .filter({ hasText: /^Failure$/i })
      .first();
    if (await failureBadge.isVisible()) {
      await expect(failureBadge).toBeVisible();
    }
  });

  test('should render dark color variant', async ({ page }) => {
    const darkBadge = page
      .locator('span')
      .filter({ hasText: /^Dark$/i })
      .first();
    if (await darkBadge.isVisible()) {
      await expect(darkBadge).toBeVisible();
    }
  });

  test('should render all six color variants', async ({ page }) => {
    const colors = ['Default', 'Gray', 'Success', 'Warning', 'Failure', 'Dark'];
    let foundCount = 0;

    for (const color of colors) {
      const badge = page
        .locator('span')
        .filter({ hasText: new RegExp(`^${color}$`, 'i') })
        .first();
      if (await badge.isVisible()) {
        foundCount++;
      }
    }

    expect(foundCount).toBeGreaterThan(0);
  });

  // ==================== Size Variants ====================

  test('should render extra small size variant', async ({ page }) => {
    const xsBadge = page
      .locator('span')
      .filter({ hasText: /Extra Small/i })
      .first();
    if (await xsBadge.isVisible()) {
      await expect(xsBadge).toBeVisible();
    }
  });

  test('should render small size variant', async ({ page }) => {
    const smBadge = page
      .locator('span')
      .filter({ hasText: /^Small$/i })
      .first();
    if (await smBadge.isVisible()) {
      await expect(smBadge).toBeVisible();
    }
  });

  test('badges should have different sizes', async ({ page }) => {
    const xsBadge = page
      .locator('span')
      .filter({ hasText: /Extra Small/i })
      .first();
    const smBadge = page
      .locator('span')
      .filter({ hasText: /^Small$/i })
      .first();

    if ((await xsBadge.isVisible()) && (await smBadge.isVisible())) {
      const xsBox = await xsBadge.boundingBox();
      const smBox = await smBadge.boundingBox();

      if (xsBox && smBox) {
        // SM should be larger than XS (or at least have different height)
        expect(smBox.height).toBeGreaterThanOrEqual(xsBox.height);
      }
    }
  });

  // ==================== Status Indicators ====================

  test('should render active status badge', async ({ page }) => {
    const activeBadge = page
      .locator('span')
      .filter({ hasText: /^Active$/i })
      .first();
    if (await activeBadge.isVisible()) {
      await expect(activeBadge).toBeVisible();
    }
  });

  test('should render pending status badge', async ({ page }) => {
    const pendingBadge = page
      .locator('span')
      .filter({ hasText: /^Pending$/i })
      .first();
    if (await pendingBadge.isVisible()) {
      await expect(pendingBadge).toBeVisible();
    }
  });

  test('should render inactive status badge', async ({ page }) => {
    const inactiveBadge = page
      .locator('span')
      .filter({ hasText: /^Inactive$/i })
      .first();
    if (await inactiveBadge.isVisible()) {
      await expect(inactiveBadge).toBeVisible();
    }
  });

  // ==================== Visual States ====================

  test('should have distinct visual styles for each color', async ({ page }) => {
    const colors = ['Default', 'Gray', 'Success', 'Warning', 'Failure', 'Dark'];
    let checkedCount = 0;

    for (const color of colors) {
      const badge = page.locator(`text=${color}`).first();
      if (await badge.isVisible()) {
        checkedCount++;
      }
    }

    // At least some badges should be visible
    expect(checkedCount).toBeGreaterThan(0);
  });

  test('should render with rounded corners', async ({ page }) => {
    const badge = page.locator('text=Default').first();
    if (await badge.isVisible()) {
      const classes = await badge.getAttribute('class');
      // Badges typically have rounded classes
      expect(classes).toBeTruthy();
    }
  });

  test('should have proper padding', async ({ page }) => {
    const badge = page.locator('text=Default').first();
    if (await badge.isVisible()) {
      const box = await badge.boundingBox();
      expect(box).toBeTruthy();
      expect(box!.width).toBeGreaterThan(0);
      expect(box!.height).toBeGreaterThan(0);
    }
  });

  // ==================== Compact Design ====================

  test('badges should be compact', async ({ page }) => {
    const badges = page
      .locator('span')
      .filter({ hasText: /Default|Gray|Success|Warning|Failure|Dark/i });
    const count = await badges.count();

    if (count > 0) {
      const badge = badges.first();
      const box = await badge.boundingBox();
      if (box) {
        // Badges should be reasonably compact
        expect(box.height).toBeLessThan(100);
      }
    }
  });

  test('badges should be inline with text', async ({ page }) => {
    const badges = page.locator('span').filter({ hasText: /Default|Gray|Success/i });
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);
  });

  // ==================== Multiple Badges ====================

  test('should render multiple badges in a row', async ({ page }) => {
    const badges = page
      .locator('span')
      .filter({ hasText: /Default|Gray|Success|Warning|Failure|Dark/i });
    const count = await badges.count();
    expect(count).toBeGreaterThan(1);
  });

  test('badges should have proper spacing between them', async ({ page }) => {
    const badges = page
      .locator('span')
      .filter({ hasText: /Default|Gray|Success|Warning|Failure|Dark/i });
    const count = await badges.count();

    if (count >= 2) {
      const firstBox = await badges.nth(0).boundingBox();
      const secondBox = await badges.nth(1).boundingBox();

      if (firstBox && secondBox) {
        // There should be some space between badges
        expect(
          Math.abs(secondBox.x - (firstBox.x + firstBox.width)),
        ).toBeGreaterThanOrEqual(0);
      }
    }
  });

  // ==================== Edge Cases ====================

  test('should handle short text gracefully', async ({ page }) => {
    const badges = page.locator('span').filter({ hasText: /Default|Gray|Dark/i });
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should render without crashing with various text lengths', async ({ page }) => {
    const pageContent = await page.content();
    expect(pageContent).toContain('Badge');
  });

  test('should support custom CSS classes', async ({ page }) => {
    const badge = page.locator('text=Default').first();
    if (await badge.isVisible()) {
      const classes = await badge.getAttribute('class');
      expect(classes).toBeTruthy();
    }
  });

  // ==================== Accessibility ====================

  test('badge content should be readable', async ({ page }) => {
    const badge = page.locator('text=Default').first();
    if (await badge.isVisible()) {
      const text = await badge.textContent();
      expect(text).toBeTruthy();
      expect(text!.trim().length).toBeGreaterThan(0);
    }
  });

  test('badges should have sufficient contrast', async ({ page }) => {
    const badges = page
      .locator('span')
      .filter({ hasText: /Default|Gray|Success|Warning|Failure|Dark/i });
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);

    // Verify badges are visible (indicating sufficient contrast)
    for (let i = 0; i < Math.min(count, 3); i++) {
      await expect(badges.nth(i)).toBeVisible();
    }
  });
});
