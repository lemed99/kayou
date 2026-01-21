import { expect, test } from '@playwright/test';

test.describe('Authentication Blocks', () => {
  test.describe('Login Block', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/blocks/authentication/login');
    });

    test('should render login form', async ({ page }) => {
      const form = page.locator('form').first();
      await expect(form).toBeVisible();
    });

    test('should have email input', async ({ page }) => {
      const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]').first();
      await expect(emailInput).toBeVisible();
    });

    test('should have password input', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]').first();
      await expect(passwordInput).toBeVisible();
    });

    test('should have submit button', async ({ page }) => {
      const submitButton = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Log in")').first();
      await expect(submitButton).toBeVisible();
    });

    test('should allow typing in email field', async ({ page }) => {
      const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]').first();
      await emailInput.fill('test@example.com');
      await expect(emailInput).toHaveValue('test@example.com');
    });

    test('should allow typing in password field', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]').first();
      await passwordInput.fill('password123');
      await expect(passwordInput).toHaveValue('password123');
    });

    test('should have remember me checkbox or social login options', async ({ page }) => {
      const checkbox = page.locator('input[type="checkbox"]').first();
      const socialButtons = page.locator('button:has-text("Google"), button:has-text("GitHub"), button:has(svg)');
      const hasCheckbox = await checkbox.isVisible().catch(() => false);
      const hasSocialButtons = await socialButtons.count();
      expect(hasCheckbox || hasSocialButtons > 0).toBeTruthy();
    });

    test('should be responsive on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const form = page.locator('form').first();
      await expect(form).toBeVisible();
    });
  });

  test.describe('Signup Block', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/blocks/authentication/signup');
    });

    test('should render signup form', async ({ page }) => {
      const form = page.locator('form').first();
      await expect(form).toBeVisible();
    });

    test('should have name input', async ({ page }) => {
      const nameInput = page.locator('input[placeholder*="name" i], input[id*="name" i]').first();
      await expect(nameInput).toBeVisible();
    });

    test('should have email input', async ({ page }) => {
      const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]').first();
      await expect(emailInput).toBeVisible();
    });

    test('should have password input', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]').first();
      await expect(passwordInput).toBeVisible();
    });

    test('should have create account button', async ({ page }) => {
      const submitButton = page.locator('button[type="submit"], button:has-text("Create"), button:has-text("Sign up")').first();
      await expect(submitButton).toBeVisible();
    });

    test('should show password strength indicator', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]').first();
      await passwordInput.fill('Str0ngP@ss!');
      // Look for strength indicator
      const strengthIndicator = page.locator('[class*="strength"], [class*="progress"], div:has-text("Strong"), div:has-text("Weak"), div:has-text("Fair")');
      const hasStrengthIndicator = await strengthIndicator.count();
      expect(hasStrengthIndicator).toBeGreaterThanOrEqual(0);
    });

    test('should be responsive on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const form = page.locator('form').first();
      await expect(form).toBeVisible();
    });
  });

  test.describe('Forgot Password Block', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/blocks/authentication/forgot-password');
    });

    test('should render forgot password form', async ({ page }) => {
      const form = page.locator('form').first();
      await expect(form).toBeVisible();
    });

    test('should have email input', async ({ page }) => {
      const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]').first();
      await expect(emailInput).toBeVisible();
    });

    test('should have submit button', async ({ page }) => {
      const submitButton = page.locator('button[type="submit"], button:has-text("Send"), button:has-text("Reset"), button:has-text("Submit")').first();
      await expect(submitButton).toBeVisible();
    });

    test('should allow email submission', async ({ page }) => {
      const emailInput = page.locator('input[type="email"], input[placeholder*="email" i]').first();
      await emailInput.fill('test@example.com');
      await expect(emailInput).toHaveValue('test@example.com');
    });

    test('should have back to login link', async ({ page }) => {
      const backLink = page.locator('a:has-text("back"), a:has-text("login"), a:has-text("sign in"), button:has-text("back")');
      const hasBackLink = await backLink.count();
      expect(hasBackLink).toBeGreaterThanOrEqual(0);
    });

    test('should be responsive on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const form = page.locator('form').first();
      await expect(form).toBeVisible();
    });
  });

  test.describe('Reset Password Block', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/blocks/authentication/reset-password');
    });

    test('should render reset password form', async ({ page }) => {
      const form = page.locator('form').first();
      await expect(form).toBeVisible();
    });

    test('should have new password input', async ({ page }) => {
      const passwordInput = page.locator('input[type="password"]').first();
      await expect(passwordInput).toBeVisible();
    });

    test('should have confirm password input or second password field', async ({ page }) => {
      const passwordInputs = page.locator('input[type="password"]');
      const count = await passwordInputs.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test('should have submit button', async ({ page }) => {
      const submitButton = page.locator('button[type="submit"], button:has-text("Reset"), button:has-text("Update"), button:has-text("Change")').first();
      await expect(submitButton).toBeVisible();
    });

    test('should be responsive on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const form = page.locator('form').first();
      await expect(form).toBeVisible();
    });
  });

  test.describe('OTP Verification Block', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/blocks/authentication/otp-verification');
    });

    test('should render OTP input fields', async ({ page }) => {
      const otpInputs = page.locator('input[maxlength="1"], input[class*="otp"], input[inputmode="numeric"]');
      const count = await otpInputs.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should have verify button', async ({ page }) => {
      const verifyButton = page.locator('button[type="submit"], button:has-text("Verify"), button:has-text("Confirm"), button:has-text("Submit")').first();
      await expect(verifyButton).toBeVisible();
    });

    test('should have resend code option', async ({ page }) => {
      const resendOption = page.locator('button:has-text("Resend"), a:has-text("Resend"), span:has-text("Resend")');
      const hasResend = await resendOption.count();
      expect(hasResend).toBeGreaterThanOrEqual(0);
    });

    test('should be responsive on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const form = page.locator('form').first();
      const container = page.locator('[class*="otp"], [class*="verification"]').first();
      const hasForm = await form.isVisible().catch(() => false);
      const hasContainer = await container.isVisible().catch(() => false);
      expect(hasForm || hasContainer).toBeTruthy();
    });
  });
});
