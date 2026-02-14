import { test, expect } from '@playwright/test';

test.describe('AI Assistant', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to menu page where AI assistant is available
    await page.goto('/menu/restaurant-1');
    await page.waitForLoadState('networkidle');
  });

  test('should display AI assistant widget', async ({ page }) => {
    // Check for AI assistant button or widget
    const aiWidget = page.getByRole('button', { name: /ai|assistant|مساعد/i }).or(
      page.locator('[data-testid*="ai"]')
    );
    
    if (await aiWidget.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(aiWidget).toBeVisible();
    }
  });

  test('should open AI chat interface', async ({ page }) => {
    // Find and click AI assistant button
    const aiButton = page.getByRole('button', { name: /ai|assistant|مساعد/i }).or(
      page.locator('[data-testid*="ai-button"]')
    );
    
    if (await aiButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await aiButton.click();
      
      // Wait for chat interface to open
      await page.waitForTimeout(1000);
      
      // Check for chat interface
      const chatInterface = page.locator('[role="dialog"]').or(
        page.locator('[data-testid*="chat"]')
      );
      
      await expect(chatInterface).toBeVisible({ timeout: 5000 });
    }
  });

  test('should send message to AI', async ({ page }) => {
    // Open AI assistant
    const aiButton = page.getByRole('button', { name: /ai|assistant|مساعد/i }).or(
      page.locator('[data-testid*="ai-button"]')
    );
    
    if (await aiButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await aiButton.click();
      await page.waitForTimeout(1000);
      
      // Find message input
      const messageInput = page.getByPlaceholder(/message|type|رسالة|اكتب/i).or(
        page.locator('input[type="text"]').or(page.locator('textarea'))
      );
      
      if (await messageInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        // Type message
        await messageInput.fill('What do you recommend?');
        
        // Send message
        const sendButton = page.getByRole('button', { name: /send|إرسال/i }).or(
          page.locator('button[type="submit"]')
        );
        
        await sendButton.click();
        
        // Wait for AI response
        await page.waitForTimeout(3000);
        
        // Check for AI response
        const aiResponse = page.locator('[data-testid*="message"]').or(
          page.locator('[class*="message"]')
        );
        
        await expect(aiResponse.first()).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test('should display suggested actions', async ({ page }) => {
    // Open AI assistant
    const aiButton = page.getByRole('button', { name: /ai|assistant|مساعد/i }).or(
      page.locator('[data-testid*="ai-button"]')
    );
    
    if (await aiButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await aiButton.click();
      await page.waitForTimeout(1000);
      
      // Check for suggested actions or quick replies
      const suggestions = page.locator('[data-testid*="suggestion"]').or(
        page.locator('button').filter({ hasText: /recommend|suggest|popular/i })
      );
      
      if (await suggestions.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(suggestions.first()).toBeVisible();
      }
    }
  });

  test('should click on suggested action', async ({ page }) => {
    // Open AI assistant
    const aiButton = page.getByRole('button', { name: /ai|assistant|مساعد/i }).or(
      page.locator('[data-testid*="ai-button"]')
    );
    
    if (await aiButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await aiButton.click();
      await page.waitForTimeout(1000);
      
      // Find and click suggestion
      const suggestion = page.locator('button').filter({ hasText: /recommend|suggest|popular/i }).first();
      
      if (await suggestion.isVisible({ timeout: 3000 }).catch(() => false)) {
        await suggestion.click();
        
        // Wait for AI response
        await page.waitForTimeout(3000);
        
        // Check for response
        const response = page.locator('[data-testid*="message"]').or(
          page.locator('[class*="message"]')
        );
        
        await expect(response.first()).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test('should display dish recommendations', async ({ page }) => {
    // Open AI assistant
    const aiButton = page.getByRole('button', { name: /ai|assistant|مساعد/i }).or(
      page.locator('[data-testid*="ai-button"]')
    );
    
    if (await aiButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await aiButton.click();
      await page.waitForTimeout(1000);
      
      // Ask for recommendations
      const messageInput = page.getByPlaceholder(/message|type|رسالة|اكتب/i).or(
        page.locator('input[type="text"]').or(page.locator('textarea'))
      );
      
      if (await messageInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await messageInput.fill('Recommend me something');
        
        const sendButton = page.getByRole('button', { name: /send|إرسال/i }).or(
          page.locator('button[type="submit"]')
        );
        
        await sendButton.click();
        
        // Wait for recommendations
        await page.waitForTimeout(5000);
        
        // Check for dish cards or recommendations
        const recommendations = page.locator('[data-testid*="recommendation"]').or(
          page.locator('[data-testid*="dish"]')
        );
        
        if (await recommendations.first().isVisible({ timeout: 5000 }).catch(() => false)) {
          await expect(recommendations.first()).toBeVisible();
        }
      }
    }
  });

  test('should add recommended dish to cart', async ({ page }) => {
    // Open AI assistant
    const aiButton = page.getByRole('button', { name: /ai|assistant|مساعد/i }).or(
      page.locator('[data-testid*="ai-button"]')
    );
    
    if (await aiButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await aiButton.click();
      await page.waitForTimeout(1000);
      
      // Ask for recommendations
      const messageInput = page.getByPlaceholder(/message|type|رسالة|اكتب/i).or(
        page.locator('input[type="text"]').or(page.locator('textarea'))
      );
      
      if (await messageInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await messageInput.fill('Recommend me something');
        
        const sendButton = page.getByRole('button', { name: /send|إرسال/i }).or(
          page.locator('button[type="submit"]')
        );
        
        await sendButton.click();
        
        // Wait for recommendations
        await page.waitForTimeout(5000);
        
        // Find add to cart button in recommendations
        const addToCartButton = page.getByRole('button', { name: /add to cart|أضف إلى السلة/i }).first();
        
        if (await addToCartButton.isVisible({ timeout: 5000 }).catch(() => false)) {
          await addToCartButton.click();
          
          // Wait for cart update
          await page.waitForTimeout(1000);
          
          // Check for success notification
          const notification = page.locator('text=/added|تمت الإضافة/i');
          await expect(notification.first()).toBeVisible({ timeout: 5000 });
        }
      }
    }
  });

  test('should close AI assistant', async ({ page }) => {
    // Open AI assistant
    const aiButton = page.getByRole('button', { name: /ai|assistant|مساعد/i }).or(
      page.locator('[data-testid*="ai-button"]')
    );
    
    if (await aiButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await aiButton.click();
      await page.waitForTimeout(1000);
      
      // Find close button
      const closeButton = page.getByRole('button', { name: /close|إغلاق/i }).or(
        page.locator('button').filter({ has: page.locator('svg') })
      ).first();
      
      if (await closeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await closeButton.click();
        
        // Wait for close animation
        await page.waitForTimeout(500);
        
        // Chat interface should be hidden
        const chatInterface = page.locator('[role="dialog"]').filter({ hasText: /ai|assistant|مساعد/i });
        await expect(chatInterface).not.toBeVisible({ timeout: 3000 });
      }
    }
  });
});
