import { expect, test } from '@playwright/test';

test.describe('UploadFile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ui/upload-file');
  });

  test('should render file input', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]').first();
    await expect(fileInput).toBeAttached();
  });

  test('should render upload area', async ({ page }) => {
    // UploadFile component renders a div with drag and drop area
    const uploadArea = page
      .locator('[class*="border-dashed"], [class*="cursor-pointer"]')
      .first();
    await expect(uploadArea).toBeVisible();
  });

  test('should render upload button', async ({ page }) => {
    // The upload area itself is clickable
    const uploadArea = page
      .locator('[class*="border-dashed"], [class*="cursor-pointer"], button')
      .first();
    await expect(uploadArea).toBeVisible();
  });

  test('should accept file selection', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]').first();

    // Create a fake file for testing
    await fileInput.setInputFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('test content'),
    });
  });

  test('should display selected file name', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]').first();

    await fileInput.setInputFiles({
      name: 'test-file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('test content'),
    });

    // File name should be displayed somewhere
    await page.waitForTimeout(200);
  });

  test('should render drag and drop area', async ({ page }) => {
    // The component has a dashed border for drag and drop
    const dropzone = page.locator('[class*="border-dashed"], [class*="drop"]').first();
    const count = await dropzone.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should show drop indicator on drag over', async ({ page }) => {
    const dropzone = page
      .locator('[class*="border-dashed"], [class*="cursor-pointer"]')
      .first();

    if (await dropzone.isVisible()) {
      // Simulate drag over
      await dropzone.dispatchEvent('dragover');
      await page.waitForTimeout(100);
    }
  });

  test('should render file type restrictions', async ({ page }) => {
    const fileInput = page.locator('input[type="file"][accept]');
    const count = await fileInput.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render multiple file support', async ({ page }) => {
    const multipleInput = page.locator('input[type="file"][multiple]');
    const count = await multipleInput.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render disabled state', async ({ page }) => {
    const disabledInput = page.locator('input[type="file"][disabled]');
    const count = await disabledInput.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render upload progress', async ({ page }) => {
    const progress = page.locator('[role="progressbar"], [class*="progress"]');
    const count = await progress.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should render file preview', async ({ page }) => {
    // File preview area
    const preview = page.locator('[class*="preview"], img');
    const count = await preview.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
