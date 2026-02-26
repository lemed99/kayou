import { expect, test } from '@playwright/test';

test.describe('Skeleton', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/skeleton');
  });

  test.describe('Rendering and accessibility', () => {
    test('should render with role="status" and aria-busy', async ({ page }) => {
      const skeleton = page.locator('[role="status"][aria-busy="true"]').first();
      await expect(skeleton).toBeVisible();
      await expect(skeleton).toHaveAttribute('aria-label', 'Loading...');
    });

    test('should have pulse animation', async ({ page }) => {
      const skeleton = page.locator('[role="status"]').first();
      const classes = await skeleton.getAttribute('class');
      expect(classes).toContain('animate-pulse');
    });

    test('should render multiple skeleton instances across examples', async ({
      page,
    }) => {
      const skeletons = page.locator('[role="status"]');
      const count = await skeletons.count();
      // Doc page has 5 examples with multiple skeletons
      expect(count).toBeGreaterThan(5);
    });
  });

  test.describe('Default dimensions', () => {
    test('should render with default 50px width and 10px height', async ({ page }) => {
      // The "Basic Skeleton" example uses <Skeleton /> with no props
      const skeleton = page.locator('[role="status"]').first();
      const inner = skeleton.locator('div');

      const box = await inner.boundingBox();
      expect(box).toBeTruthy();
      expect(box!.width).toBe(50);
      expect(box!.height).toBe(10);
    });
  });

  test.describe('Custom dimensions', () => {
    test('should render with custom width and height', async ({ page }) => {
      // "Custom Dimensions" example has: 200x20, 100%x16, 100x100
      const section = page.locator('text=Custom Dimensions').locator('..').locator('..');
      const inners = section.locator('[role="status"] div');

      // First: 200x20
      const first = await inners.nth(0).boundingBox();
      expect(first).toBeTruthy();
      expect(first!.width).toBe(200);
      expect(first!.height).toBe(20);

      // Third: 100x100 (square)
      const third = await inners.nth(2).boundingBox();
      expect(third).toBeTruthy();
      expect(third!.width).toBe(100);
      expect(third!.height).toBe(100);
    });

    test('should support percentage width', async ({ page }) => {
      // "Custom Dimensions" example second skeleton: width="100%", height=16
      const section = page.locator('text=Custom Dimensions').locator('..').locator('..');
      const second = section.locator('[role="status"]').nth(1).locator('div');

      const style = await second.getAttribute('style');
      expect(style).toContain('width:100%');
      expect(style).toContain('height:16px');
    });
  });

  test.describe('Gray shades', () => {
    test('should apply different gray background classes', async ({ page }) => {
      const section = page.locator('text=Gray Shades').locator('..').locator('..');
      const inners = section.locator('[role="status"] div');

      const first = await inners.nth(0).getAttribute('class');
      expect(first).toContain('bg-neutral-100');

      const second = await inners.nth(1).getAttribute('class');
      expect(second).toContain('bg-neutral-200');

      const third = await inners.nth(2).getAttribute('class');
      expect(third).toContain('bg-neutral-300');
    });
  });

  test.describe('Composite layouts', () => {
    test('should render card loading skeleton with correct structure', async ({
      page,
    }) => {
      // "Card Loading State" has: 64x64 avatar + 3 text lines (200x20, 150x14, 180x14)
      const section = page.locator('text=Card Loading State').locator('..').locator('..');
      const skeletons = section.locator('[role="status"]');

      const count = await skeletons.count();
      expect(count).toBe(4);

      // Avatar skeleton: 64x64
      const avatar = await skeletons.nth(0).locator('div').boundingBox();
      expect(avatar).toBeTruthy();
      expect(avatar!.width).toBe(64);
      expect(avatar!.height).toBe(64);
    });

    test('should render list loading skeleton with equal-width items', async ({
      page,
    }) => {
      // "List Loading State" has 3 skeletons, each width="100%" height=40
      const section = page.locator('text=List Loading State').locator('..').locator('..');
      const skeletons = section.locator('[role="status"]');

      const count = await skeletons.count();
      expect(count).toBe(3);

      for (let i = 0; i < 3; i++) {
        const inner = skeletons.nth(i).locator('div');
        const style = await inner.getAttribute('style');
        expect(style).toContain('width:100%');
        expect(style).toContain('height:40px');
      }
    });
  });
});
