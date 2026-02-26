import { expect, test } from '@playwright/test';

test.describe('Pagination', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/pagination');
  });

  test.describe('Basic rendering', () => {
    test('should render navigation buttons with correct aria labels', async ({ page }) => {
      const nav = page.locator('nav[aria-label="Page"]').first();
      await expect(nav).toBeVisible();

      await expect(nav.locator('button[aria-label="Go to first page"]')).toBeVisible();
      await expect(nav.locator('button[aria-label="Go to previous page"]')).toBeVisible();
      await expect(nav.locator('button[aria-label="Go to next page"]')).toBeVisible();
      await expect(nav.locator('button[aria-label="Go to last page"]')).toBeVisible();
    });

    test('should render page input with "Page" label and total', async ({ page }) => {
      const container = page.locator('[aria-current="page"]').first();
      await expect(container).toBeVisible();
      await expect(container).toContainText('Page');
      await expect(container).toContainText('of');
    });
  });

  test.describe('Boundary disabling', () => {
    test('should disable first/previous buttons on page 1', async ({ page }) => {
      const nav = page.locator('nav[aria-label="Page"]').first();

      await expect(nav.locator('button[aria-label="Go to first page"]')).toBeDisabled();
      await expect(nav.locator('button[aria-label="Go to previous page"]')).toBeDisabled();
      await expect(nav.locator('button[aria-label="Go to next page"]')).toBeEnabled();
      await expect(nav.locator('button[aria-label="Go to last page"]')).toBeEnabled();
    });

    test('should disable all buttons when total is 1 (single page)', async ({ page }) => {
      const singlePageSection = page.locator('text=Single Page').locator('..').locator('..');
      const nav = singlePageSection.locator('nav[aria-label="Page"]');

      await expect(nav.locator('button[aria-label="Go to first page"]')).toBeDisabled();
      await expect(nav.locator('button[aria-label="Go to previous page"]')).toBeDisabled();
      await expect(nav.locator('button[aria-label="Go to next page"]')).toBeDisabled();
      await expect(nav.locator('button[aria-label="Go to last page"]')).toBeDisabled();
    });

    test('should disable all controls when total is 0', async ({ page }) => {
      const emptySection = page.locator('text=Empty (No Pages)').locator('..').locator('..');
      const nav = emptySection.locator('nav[aria-label="Page"]');

      await expect(nav.locator('button[aria-label="Go to first page"]')).toBeDisabled();
      await expect(nav.locator('button[aria-label="Go to previous page"]')).toBeDisabled();
      await expect(nav.locator('button[aria-label="Go to next page"]')).toBeDisabled();
      await expect(nav.locator('button[aria-label="Go to last page"]')).toBeDisabled();

      const input = emptySection.locator('input');
      await expect(input).toBeDisabled();
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to next page on next click', async ({ page }) => {
      const nav = page.locator('nav[aria-label="Page"]').first();
      const input = page.getByRole('spinbutton').first();

      await expect(input).toHaveValue('1');

      const nextBtn = nav.locator('button[aria-label="Go to next page"]');
      await nextBtn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await nextBtn.click({ force: true });
      await expect(input).toHaveValue('2');
    });

    test('should navigate to previous page', async ({ page }) => {
      const nav = page.locator('nav[aria-label="Page"]').first();
      const input = page.getByRole('spinbutton').first();

      const nextBtn = nav.locator('button[aria-label="Go to next page"]');
      await nextBtn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await nextBtn.click({ force: true });
      await expect(input).toHaveValue('2');

      const prevBtn = nav.locator('button[aria-label="Go to previous page"]');
      await prevBtn.click({ force: true });
      await expect(input).toHaveValue('1');
    });

    test('should navigate to last page', async ({ page }) => {
      const nav = page.locator('nav[aria-label="Page"]').first();
      const input = page.getByRole('spinbutton').first();

      const lastBtn = nav.locator('button[aria-label="Go to last page"]');
      await lastBtn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await lastBtn.click({ force: true });
      await expect(input).toHaveValue('10');

      await expect(nav.locator('button[aria-label="Go to next page"]')).toBeDisabled();
      await expect(nav.locator('button[aria-label="Go to last page"]')).toBeDisabled();
    });

    test('should navigate to first page', async ({ page }) => {
      const nav = page.locator('nav[aria-label="Page"]').first();
      const input = page.getByRole('spinbutton').first();

      // Go to last first
      const lastBtn = nav.locator('button[aria-label="Go to last page"]');
      await lastBtn.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await lastBtn.click({ force: true });
      await expect(input).toHaveValue('10');

      // Go back to first
      const firstBtn = nav.locator('button[aria-label="Go to first page"]');
      await firstBtn.click({ force: true });
      await expect(input).toHaveValue('1');
    });
  });

  test.describe('Direct page input', () => {
    test('should navigate via direct page number entry', async ({ page }) => {
      const input = page.getByRole('spinbutton').first();

      await input.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await input.click();
      await input.fill('5');
      await input.press('Enter');
      await expect(input).toHaveValue('5');
    });

    test('should clamp value to max when exceeding total', async ({ page }) => {
      const input = page.getByRole('spinbutton').first();

      await input.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await input.click();
      await input.fill('999');
      await input.press('Tab');
      await expect(input).toHaveValue('10');
    });
  });

  test.describe('Keyboard navigation', () => {
    test('should activate button with Enter key', async ({ page }) => {
      const nav = page.locator('nav[aria-label="Page"]').first();
      const input = page.getByRole('spinbutton').first();
      const nextButton = nav.locator('button[aria-label="Go to next page"]');

      await nextButton.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await nextButton.focus();
      await nextButton.press('Enter');
      await expect(input).toHaveValue('2');
    });
  });

  test.describe('Middle page example', () => {
    test('should start at page 5 with all buttons enabled', async ({ page }) => {
      const navs = page.locator('nav[aria-label="Page"]');
      const nav = navs.nth(1);
      const input = page.getByRole('spinbutton').nth(1);

      await expect(input).toHaveValue('5');
      await expect(nav.locator('button[aria-label="Go to first page"]')).toBeEnabled();
      await expect(nav.locator('button[aria-label="Go to previous page"]')).toBeEnabled();
      await expect(nav.locator('button[aria-label="Go to next page"]')).toBeEnabled();
      await expect(nav.locator('button[aria-label="Go to last page"]')).toBeEnabled();
    });
  });
});
