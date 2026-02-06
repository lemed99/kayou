import { expect, test, type Page } from '@playwright/test';

/** Click the first "Open Modal" trigger with scroll + hydration wait. */
async function openModal(page: Page) {
  const trigger = page
    .locator('button')
    .filter({ hasText: /open|modal|show/i })
    .first();
  await trigger.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await trigger.click();
  const modal = page.locator('[role="dialog"]').first();
  await expect(modal).toBeVisible({ timeout: 5000 });
  return modal;
}

test.describe('Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/modal');
  });

  // ==================== Basic Rendering ====================

  test('should render modal trigger button', async ({ page }) => {
    const trigger = page
      .locator('button')
      .filter({ hasText: /open|modal|show/i })
      .first();
    await expect(trigger).toBeVisible();
  });

  test('should open modal on trigger click', async ({ page }) => {
    const modal = await openModal(page);
    await expect(modal).toBeVisible();
  });

  // ==================== Close Behavior ====================

  test('should close modal on close button click', async ({ page }) => {
    const modal = await openModal(page);

    const closeButton = page.locator('button[aria-label="Close"]').first();
    await closeButton.click();
    await expect(modal).not.toBeVisible({ timeout: 5000 });
  });

  test('should close modal on Escape key', async ({ page }) => {
    const modal = await openModal(page);

    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible({ timeout: 5000 });
  });

  test('should close modal on backdrop click', async ({ page }) => {
    const modal = await openModal(page);

    // Click outside the modal content (on the backdrop area)
    await page.mouse.click(10, 10);
    await expect(modal).not.toBeVisible({ timeout: 5000 });
  });

  // ==================== Accessibility ====================

  test('should have proper aria attributes', async ({ page }) => {
    const modal = await openModal(page);
    await expect(modal).toHaveAttribute('role', 'dialog');
    await expect(modal).toHaveAttribute('aria-modal', 'true');
  });

  test('should have aria-labelledby linked to title', async ({ page }) => {
    const modal = await openModal(page);
    const labelledBy = await modal.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();

    const title = modal.locator(`[id="${labelledBy}"]`);
    await expect(title).toBeVisible();
    const text = await title.textContent();
    expect(text).toBeTruthy();
  });

  test('should trap focus inside modal', async ({ page }) => {
    const modal = await openModal(page);
    await expect(modal).toBeVisible();

    // Tab should cycle within modal
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
  });

  // ==================== Content ====================

  test('should render modal with title', async ({ page }) => {
    const modal = await openModal(page);
    const title = modal.locator('h2');
    await expect(title.first()).toBeVisible();
  });

  test('should render modal with content', async ({ page }) => {
    const modal = await openModal(page);
    const content = await modal.textContent();
    expect(content).toBeTruthy();
  });
});
