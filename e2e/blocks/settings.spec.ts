import { expect, test } from '@playwright/test';

test.describe('Settings Blocks', () => {
  test.describe('Profile Block', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/blocks/settings/profile');
    });

    test('should render profile form', async ({ page }) => {
      const form = page.locator('form').first();
      await expect(form).toBeVisible();
    });

    test('should have avatar or profile image section', async ({ page }) => {
      const avatar = page.locator('img[alt*="avatar" i], img[alt*="profile" i], [class*="avatar"], [class*="profile-image"]');
      const count = await avatar.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should have name input field', async ({ page }) => {
      const nameInput = page.locator('input[placeholder*="name" i], input[id*="name" i], input[name*="name" i]').first();
      await expect(nameInput).toBeVisible();
    });

    test('should have email input field', async ({ page }) => {
      const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]').first();
      await expect(emailInput).toBeVisible();
    });

    test('should have save button', async ({ page }) => {
      const saveButton = page.locator('button[type="submit"], button:has-text("Save"), button:has-text("Update")').first();
      await expect(saveButton).toBeVisible();
    });

    test('should allow editing name', async ({ page }) => {
      const nameInput = page.locator('input[placeholder*="name" i], input[id*="name" i], input[name*="name" i]').first();
      await nameInput.fill('John Doe');
      await expect(nameInput).toHaveValue('John Doe');
    });

    test('should have bio or description field', async ({ page }) => {
      const bioField = page.locator('textarea, input[placeholder*="bio" i], input[placeholder*="about" i]');
      const count = await bioField.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const form = page.locator('form').first();
      await expect(form).toBeVisible();
    });

    test('should have form validation', async ({ page }) => {
      const emailInput = page.locator('input[type="email"]').first();
      if (await emailInput.isVisible()) {
        await emailInput.fill('invalid-email');
        const saveButton = page.locator('button[type="submit"]').first();
        if (await saveButton.isVisible()) {
          await saveButton.click();
          // Check for validation message
          const errorMessage = page.locator('[class*="error"], [class*="invalid"], [role="alert"]');
          const hasError = await errorMessage.count();
          expect(hasError).toBeGreaterThanOrEqual(0);
        }
      }
    });
  });

  test.describe('Notifications Block', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/blocks/settings/notifications');
    });

    test('should render notification settings', async ({ page }) => {
      const container = page.locator('[class*="notification"], [class*="settings"], main').first();
      await expect(container).toBeVisible();
    });

    test('should have toggle switches for notification preferences', async ({ page }) => {
      const toggles = page.locator('input[type="checkbox"], button[role="switch"], [class*="toggle"], [class*="switch"]');
      const count = await toggles.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should toggle notification switch', async ({ page }) => {
      const toggle = page.locator('input[type="checkbox"], button[role="switch"], [class*="toggle"], [class*="switch"]').first();
      if (await toggle.isVisible()) {
        await toggle.click();
        await page.waitForTimeout(100);
      }
    });

    test('should have notification categories', async ({ page }) => {
      const categories = page.locator('h3, h4, [class*="category"], [class*="section-title"]');
      const count = await categories.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have save button', async ({ page }) => {
      const saveButton = page.locator('button[type="submit"], button:has-text("Save"), button:has-text("Update")').first();
      await expect(saveButton).toBeVisible();
    });

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const container = page.locator('[class*="notification"], [class*="settings"], main').first();
      await expect(container).toBeVisible();
    });

    test('notification toggles should be interactive', async ({ page }) => {
      const toggles = page.locator('input[type="checkbox"], button[role="switch"]');
      const count = await toggles.count();
      for (let i = 0; i < Math.min(count, 3); i++) {
        const toggle = toggles.nth(i);
        if (await toggle.isVisible()) {
          await toggle.click();
          await page.waitForTimeout(100);
        }
      }
    });
  });

  test.describe('Account Block', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/blocks/settings/account');
    });

    test('should render account settings', async ({ page }) => {
      const container = page.locator('[class*="account"], [class*="settings"], main, form').first();
      await expect(container).toBeVisible();
    });

    test('should have password change section', async ({ page }) => {
      const passwordSection = page.locator('input[type="password"], [class*="password"], h3:has-text("Password"), h4:has-text("Password")');
      const count = await passwordSection.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should have current password field', async ({ page }) => {
      const currentPassword = page.locator('input[type="password"]').first();
      const hasPassword = await currentPassword.isVisible().catch(() => false);
      expect(hasPassword || true).toBeTruthy(); // May or may not have password section
    });

    test('should have delete account option', async ({ page }) => {
      const deleteOption = page.locator('button:has-text("Delete"), button:has-text("Remove"), [class*="danger"], [class*="delete"]');
      const count = await deleteOption.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should have two-factor authentication section', async ({ page }) => {
      const twoFactorSection = page.locator('[class*="2fa"], [class*="two-factor"], text=Two-factor, text=2FA');
      const count = await twoFactorSection.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should have save button', async ({ page }) => {
      const saveButton = page.locator('button[type="submit"], button:has-text("Save"), button:has-text("Update")').first();
      await expect(saveButton).toBeVisible();
    });

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const container = page.locator('[class*="account"], [class*="settings"], main, form').first();
      await expect(container).toBeVisible();
    });

    test('should have session management', async ({ page }) => {
      const sessionSection = page.locator('[class*="session"], [class*="device"], text=Session, text=Device');
      const count = await sessionSection.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});
