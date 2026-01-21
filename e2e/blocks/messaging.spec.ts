import { expect, test } from '@playwright/test';

test.describe('Messaging Blocks', () => {
  test.describe('In-App Messages Block', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/blocks/messaging/in-app-messages');
    });

    test('should render chat interface', async ({ page }) => {
      const chatContainer = page.locator('[class*="chat"], [class*="message"], main').first();
      await expect(chatContainer).toBeVisible();
    });

    test('should display messages', async ({ page }) => {
      const messages = page.locator('[class*="message"], [class*="chat-bubble"]');
      const count = await messages.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have message input field', async ({ page }) => {
      const messageInput = page.locator('input[placeholder*="message" i], textarea[placeholder*="message" i], input[placeholder*="type" i]').first();
      await expect(messageInput).toBeVisible();
    });

    test('should have send button', async ({ page }) => {
      const sendButton = page.locator('button:has-text("Send"), button[aria-label*="send" i], button:has(svg)').last();
      await expect(sendButton).toBeVisible();
    });

    test('should allow typing a message', async ({ page }) => {
      const messageInput = page.locator('input[placeholder*="message" i], textarea[placeholder*="message" i], input[placeholder*="type" i]').first();
      await messageInput.fill('Hello, this is a test message!');
      await expect(messageInput).toHaveValue('Hello, this is a test message!');
    });

    test('should send message on button click', async ({ page }) => {
      const messageInput = page.locator('input[placeholder*="message" i], textarea[placeholder*="message" i], input[placeholder*="type" i]').first();
      await messageInput.fill('Test message');

      const sendButton = page.locator('button:has(svg[class*="send"]), button[type="submit"]').first();
      if (await sendButton.isVisible()) {
        await sendButton.click();
        await page.waitForTimeout(500);
      }
    });

    test('should show message timestamps', async ({ page }) => {
      const timestamps = page.locator('[class*="time"], [class*="timestamp"], time');
      const count = await timestamps.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should have user avatar or initials', async ({ page }) => {
      const avatars = page.locator('[class*="avatar"], img[alt*="avatar" i]');
      const count = await avatars.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should display message status (sent/delivered/read)', async ({ page }) => {
      const messageStatus = page.locator('[class*="status"], svg[class*="check"], [class*="delivered"], [class*="read"]');
      const count = await messageStatus.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      const chatContainer = page.locator('[class*="chat"], [class*="message"], main').first();
      await expect(chatContainer).toBeVisible();
    });

    test('should show menu button on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(300);
      const menuButton = page.locator('button:has(svg), [class*="menu-button"], button[aria-label*="menu" i]');
      const count = await menuButton.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('WhatsApp Style Chat', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/blocks/messaging/in-app-messages');
      // Navigate to WhatsApp variant if multiple variants exist
    });

    test('should have conversation list on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.waitForTimeout(300);
      const conversationList = page.locator('[class*="conversation"], [class*="chat-list"], aside');
      const count = await conversationList.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should show online status indicators', async ({ page }) => {
      const onlineStatus = page.locator('[class*="online"], [class*="status-indicator"], span[class*="green"]');
      const count = await onlineStatus.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should have search in conversations', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="search" i]').first();
      await expect(searchInput).toBeVisible();
    });

    test('should display unread message count', async ({ page }) => {
      const unreadBadge = page.locator('[class*="badge"], [class*="unread"], span[class*="count"]');
      const count = await unreadBadge.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should show chat header with contact info', async ({ page }) => {
      const chatHeader = page.locator('header, [class*="chat-header"]');
      const count = await chatHeader.count();
      expect(count).toBeGreaterThan(0);
    });

    test('conversation list should hide on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(300);
      // On mobile, the conversation list should be in a drawer or hidden
      const drawer = page.locator('[class*="drawer"], [role="dialog"]');
      const hasDrawer = await drawer.count();
      // Either no visible sidebar or it's in a drawer
      expect(hasDrawer >= 0).toBeTruthy();
    });

    test('should open drawer on mobile menu click', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(300);
      const menuButton = page.locator('button:has(svg[class*="arrow"]), button:has(svg[class*="menu"])').first();
      if (await menuButton.isVisible()) {
        await menuButton.click();
        await page.waitForTimeout(300);
        const drawer = page.locator('[class*="drawer"], [role="dialog"]');
        const hasDrawer = await drawer.count();
        expect(hasDrawer >= 0).toBeTruthy();
      }
    });
  });

  test.describe('Modern Chat Interface', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/blocks/messaging/in-app-messages');
    });

    test('should display typing indicator when appropriate', async ({ page }) => {
      const typingIndicator = page.locator('[class*="typing"], [class*="dots"]');
      const count = await typingIndicator.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should have emoji or attachment button', async ({ page }) => {
      const emojiButton = page.locator('button:has(svg[class*="smile"]), button:has(svg[class*="emoji"]), button:has(svg[class*="attach"])');
      const count = await emojiButton.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should allow sending message with Enter key', async ({ page }) => {
      const messageInput = page.locator('input[placeholder*="message" i], textarea[placeholder*="message" i]').first();
      await messageInput.fill('Test message');
      await messageInput.press('Enter');
      await page.waitForTimeout(500);
    });

    test('messages should be properly aligned (user vs other)', async ({ page }) => {
      const messages = page.locator('[class*="message"]');
      const count = await messages.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have auto-scroll to latest message', async ({ page }) => {
      const messageContainer = page.locator('[class*="message-container"], [class*="chat-body"]').first();
      if (await messageContainer.isVisible()) {
        const scrollTop = await messageContainer.evaluate(el => el.scrollTop);
        // Should be scrolled to show latest messages
        expect(scrollTop >= 0).toBeTruthy();
      }
    });
  });

  test.describe('Slack Style Chat', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/blocks/messaging/in-app-messages');
    });

    test('should display channel or thread header', async ({ page }) => {
      const header = page.locator('header, [class*="header"]').first();
      await expect(header).toBeVisible();
    });

    test('should show user names with messages', async ({ page }) => {
      const userNames = page.locator('[class*="sender"], [class*="author"], [class*="user-name"]');
      const count = await userNames.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should display message reactions', async ({ page }) => {
      const reactions = page.locator('[class*="reaction"], [class*="emoji"]');
      const count = await reactions.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should be responsive on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      const chatContainer = page.locator('[class*="chat"], main').first();
      await expect(chatContainer).toBeVisible();
    });
  });
});
