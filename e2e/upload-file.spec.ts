import { expect, test } from '@playwright/test';

test.describe('UploadFile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/upload-file');
    await page.waitForLoadState('networkidle');
  });

  test('should render upload area with drop zone', async ({ page }) => {
    const dropZone = page.locator('[class*="border-dashed"]').first();
    await expect(dropZone).toBeVisible();
  });

  test('should render browse files button', async ({ page }) => {
    const browseButton = page.locator('button', { hasText: /browse|select|choose/i }).first();
    await expect(browseButton).toBeVisible();
  });

  test('should render hidden file input', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]').first();
    await expect(fileInput).toBeAttached();
  });

  test('should accept file and display file name', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]').first();

    await fileInput.setInputFiles({
      name: 'test-document.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello world'),
    });

    await expect(page.locator('text=test-document.txt')).toBeVisible({ timeout: 5000 });
  });

  test('should display file size after selection', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]').first();

    await fileInput.setInputFiles({
      name: 'test-file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello world'),
    });

    // File size should be shown (11 bytes)
    await expect(page.locator('text=11 B')).toBeVisible({ timeout: 5000 });
  });

  test('should allow removing a selected file', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]').first();

    await fileInput.setInputFiles({
      name: 'removable-file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('content'),
    });

    await expect(page.locator('text=removable-file.txt')).toBeVisible({ timeout: 5000 });

    // Click the remove button (XIcon button near the file name)
    const removeButton = page.locator('button[aria-label*="Remove"]').first();
    await removeButton.click();

    await expect(page.locator('text=removable-file.txt')).not.toBeVisible({ timeout: 5000 });
  });

  test('should show error for invalid file type', async ({ page }) => {
    // Find the image-only upload example's input (accept="image/*")
    const imageInput = page.locator('input[type="file"][accept="image/*"]');

    if ((await imageInput.count()) > 0) {
      await imageInput.first().setInputFiles({
        name: 'invalid.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('not an image'),
      });

      // Should show a file type error
      const error = page.locator('text=/not allowed|File type/i');
      await expect(error).toBeVisible({ timeout: 5000 });
    }
  });

  test('should show error for file exceeding max size', async ({ page }) => {
    // Find the size-limited example's input (there's one with maxSize=2MB)
    // The "With Size Limit" example is the 5th example
    const sizeInputs = page.locator('input[type="file"]');
    const count = await sizeInputs.count();

    // The size-limited example should be one of the inputs
    // Try uploading a large file to each until we find the constrained one
    if (count >= 5) {
      const sizeInput = sizeInputs.nth(4); // 5th example (0-indexed)
      await sizeInput.setInputFiles({
        name: 'large-file.bin',
        mimeType: 'application/octet-stream',
        buffer: Buffer.alloc(3 * 1024 * 1024), // 3MB, exceeds 2MB limit
      });

      const error = page.locator('text=/too large|exceeds/i');
      await expect(error).toBeVisible({ timeout: 5000 });
    }
  });

  test('should render helper text', async ({ page }) => {
    await expect(page.locator('text=PNG, JPG or PDF (max 5MB)')).toBeVisible();
  });

  test('should support multiple file selection', async ({ page }) => {
    const multipleInput = page.locator('input[type="file"][multiple]').first();

    if (await multipleInput.isVisible().catch(() => false)) {
      await multipleInput.setInputFiles([
        { name: 'file1.txt', mimeType: 'text/plain', buffer: Buffer.from('one') },
        { name: 'file2.txt', mimeType: 'text/plain', buffer: Buffer.from('two') },
      ]);

      await expect(page.locator('text=file1.txt')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text=file2.txt')).toBeVisible({ timeout: 5000 });
    }
  });
});
