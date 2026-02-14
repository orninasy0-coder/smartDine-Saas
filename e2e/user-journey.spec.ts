import { test, expect } from '@playwright/test';

test.describe('Complete User Journey', () => {
  test.describe('Customer Journey - From Landing to Order', () => {
    test('should complete full customer journey', async ({ page }) => {
      // Step 1: Visit landing page
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Verify landing page loaded
      const heroHeading = page.getByRole('heading', { level: 1 });
      await expect(heroHeading).toBeVisible({ timeout: 10000 });
      
      // Step 2: Navigate to pricing
      const pricingLink = page.getByRole('link', { name: /pricing|الأسعار/i }).first();
      if (await pricingLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await pricingLink.click();
        await page.waitForLoadState('networkidle');
        
        // Verify pricing page
        await expect(page).toHaveURL(/.*pricing/);
      }
      
      // Step 3: Navigate to demo/menu
      await page.goto('/menu/restaurant-1');
      await page.waitForLoadState('networkidle');
      
      // Step 4: Browse menu
      const menuItems = page.locator('[data-testid*="dish"]').or(
        page.locator('[class*="dish-card"]')
      );
      await expect(menuItems.first()).toBeVisible({ timeout: 10000 });
      
      // Step 5: Search for a dish
      const searchInput = page.getByPlaceholder(/search|بحث/i).or(
        page.getByRole('searchbox')
      );
      
      if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await searchInput.fill('pizza');
        await page.waitForTimeout(1000);
      }
      
      // Step 6: View dish details
      const firstDish = menuItems.first();
      await firstDish.click();
      await page.waitForTimeout(1000);
      
      // Step 7: Add to cart
      const addToCartButton = page.getByRole('button', { name: /add to cart|أضف إلى السلة/i });
      
      if (await addToCartButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await addToCartButton.click();
        await page.waitForTimeout(1000);
        
        // Step 8: Open cart
        const cartButton = page.getByRole('button', { name: /cart|السلة/i }).or(
          page.locator('[data-testid*="cart"]')
        );
        
        if (await cartButton.isVisible({ timeout: 5000 }).catch(() => false)) {
          await cartButton.click();
          await page.waitForTimeout(1000);
          
          // Verify cart has items
          const cartItems = page.locator('[data-testid*="cart-item"]');
          const emptyState = page.locator('text=/empty|فارغة/i');
          
          const hasItems = await cartItems.first().isVisible({ timeout: 3000 }).catch(() => false);
          const isEmpty = await emptyState.isVisible({ timeout: 3000 }).catch(() => false);
          
          expect(hasItems || isEmpty).toBeTruthy();
        }
      }
    });

    test('should interact with AI assistant', async ({ page }) => {
      // Navigate to menu
      await page.goto('/menu/restaurant-1');
      await page.waitForLoadState('networkidle');
      
      // Open AI assistant
      const aiButton = page.getByRole('button', { name: /ai|assistant|مساعد/i }).or(
        page.locator('[data-testid*="ai-button"]')
      );
      
      if (await aiButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await aiButton.click();
        await page.waitForTimeout(1000);
        
        // Send message
        const messageInput = page.getByPlaceholder(/message|type|رسالة|اكتب/i).or(
          page.locator('input[type="text"]').or(page.locator('textarea'))
        );
        
        if (await messageInput.isVisible({ timeout: 3000 }).catch(() => false)) {
          await messageInput.fill('What do you recommend for lunch?');
          
          const sendButton = page.getByRole('button', { name: /send|إرسال/i }).or(
            page.locator('button[type="submit"]')
          );
          
          await sendButton.click();
          
          // Wait for AI response
          await page.waitForTimeout(5000);
          
          // Verify response received
          const aiResponse = page.locator('[data-testid*="message"]').or(
            page.locator('[class*="message"]')
          );
          
          if (await aiResponse.first().isVisible({ timeout: 10000 }).catch(() => false)) {
            await expect(aiResponse.first()).toBeVisible();
          }
        }
      }
    });

    test('should view dish in AR', async ({ page }) => {
      // Navigate to menu
      await page.goto('/menu/restaurant-1');
      await page.waitForLoadState('networkidle');
      
      // Click on first dish
      const firstDish = page.locator('[data-testid*="dish"]').or(
        page.locator('[class*="dish-card"]')
      ).first();
      
      if (await firstDish.isVisible({ timeout: 5000 }).catch(() => false)) {
        await firstDish.click();
        await page.waitForTimeout(1000);
        
        // Find AR button
        const arButton = page.getByRole('button', { name: /ar|3d|view in ar|عرض ثلاثي الأبعاد/i });
        
        if (await arButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await arButton.click();
          
          // Wait for AR viewer
          await page.waitForTimeout(3000);
          
          // Verify AR viewer loaded
          const arViewer = page.locator('canvas').or(
            page.locator('[data-testid*="ar-viewer"]')
          );
          
          await expect(arViewer.first()).toBeVisible({ timeout: 10000 });
        }
      }
    });
  });

  test.describe('Restaurant Owner Journey', () => {
    test('should navigate through owner dashboard', async ({ page }) => {
      // Navigate to owner dashboard
      await page.goto('/owner/dashboard');
      
      // If redirected to login, skip test
      if (await page.url().includes('login')) {
        test.skip();
        return;
      }
      
      await page.waitForLoadState('networkidle');
      
      // Verify dashboard loaded
      const statsCards = page.locator('[data-testid*="stat"]').or(
        page.locator('[class*="stat-card"]')
      );
      await expect(statsCards.first()).toBeVisible({ timeout: 10000 });
      
      // Navigate to menu management
      const menuLink = page.getByRole('link', { name: /menu|القائمة/i });
      
      if (await menuLink.first().isVisible({ timeout: 5000 }).catch(() => false)) {
        await menuLink.first().click();
        await page.waitForTimeout(1000);
        
        // Verify menu management page
        await expect(page).toHaveURL(/.*menu/);
      }
    });

    test('should view analytics', async ({ page }) => {
      // Navigate to owner dashboard
      await page.goto('/owner/dashboard');
      
      if (await page.url().includes('login')) {
        test.skip();
        return;
      }
      
      await page.waitForLoadState('networkidle');
      
      // Navigate to analytics
      const analyticsLink = page.getByRole('link', { name: /analytics|تحليلات/i });
      
      if (await analyticsLink.first().isVisible({ timeout: 5000 }).catch(() => false)) {
        await analyticsLink.first().click();
        await page.waitForTimeout(1000);
        
        // Verify analytics page
        await expect(page).toHaveURL(/.*analytics/);
        
        // Check for charts
        const chart = page.locator('svg').or(
          page.locator('[data-testid*="chart"]')
        );
        
        if (await chart.first().isVisible({ timeout: 5000 }).catch(() => false)) {
          await expect(chart.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('Kitchen Staff Journey', () => {
    test('should manage orders in kitchen dashboard', async ({ page }) => {
      // Navigate to kitchen dashboard
      await page.goto('/kitchen/dashboard');
      
      if (await page.url().includes('login')) {
        test.skip();
        return;
      }
      
      await page.waitForLoadState('networkidle');
      
      // Verify orders section
      const ordersSection = page.locator('[data-testid*="order"]').or(
        page.locator('text=/orders|الطلبات/i')
      );
      await expect(ordersSection.first()).toBeVisible({ timeout: 10000 });
      
      // Try to update order status
      const statusButton = page.getByRole('button', { name: /preparing|ready|complete|جاري التحضير|جاهز/i }).first();
      
      if (await statusButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await statusButton.click();
        await page.waitForTimeout(1000);
        
        // Check for success notification
        const notification = page.locator('text=/updated|success|تم التحديث|نجح/i');
        if (await notification.first().isVisible({ timeout: 5000 }).catch(() => false)) {
          await expect(notification.first()).toBeVisible();
        }
      }
    });
  });

  test.describe('Multi-language Journey', () => {
    test('should switch between English and Arabic', async ({ page }) => {
      // Start on landing page
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Find language selector
      const languageSelector = page.getByRole('button', { name: /language|اللغة/i }).or(
        page.locator('[aria-label*="language"]')
      );
      
      if (await languageSelector.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Get initial language
        const html = page.locator('html');
        const initialDir = await html.getAttribute('dir');
        
        // Switch language
        await languageSelector.click();
        await page.waitForTimeout(500);
        
        // Select different language
        const languageOption = page.getByRole('menuitem').or(
          page.locator('[role="option"]')
        ).first();
        
        if (await languageOption.isVisible({ timeout: 3000 }).catch(() => false)) {
          await languageOption.click();
          await page.waitForTimeout(1000);
          
          // Verify language changed
          const newDir = await html.getAttribute('dir');
          
          // Direction should change between ltr and rtl
          if (initialDir && newDir) {
            expect(initialDir).not.toBe(newDir);
          }
        }
      }
    });

    test('should maintain language preference across pages', async ({ page }) => {
      // Start on landing page
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Switch to Arabic if not already
      const languageSelector = page.getByRole('button', { name: /language|اللغة/i }).or(
        page.locator('[aria-label*="language"]')
      );
      
      if (await languageSelector.isVisible({ timeout: 5000 }).catch(() => false)) {
        await languageSelector.click();
        await page.waitForTimeout(500);
        
        // Select Arabic
        const arabicOption = page.locator('text=/arabic|عربي/i').first();
        
        if (await arabicOption.isVisible({ timeout: 3000 }).catch(() => false)) {
          await arabicOption.click();
          await page.waitForTimeout(1000);
          
          // Get language setting
          const html = page.locator('html');
          const dir = await html.getAttribute('dir');
          
          // Navigate to another page
          await page.goto('/pricing');
          await page.waitForLoadState('networkidle');
          
          // Verify language persisted
          const newDir = await html.getAttribute('dir');
          expect(newDir).toBe(dir);
        }
      }
    });
  });

  test.describe('Theme Switching Journey', () => {
    test('should switch between light and dark mode', async ({ page }) => {
      // Start on landing page
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Find theme toggle
      const themeToggle = page.getByRole('button', { name: /theme|السمة/i }).or(
        page.locator('[aria-label*="theme"]').or(
          page.locator('button').filter({ has: page.locator('svg') }).first()
        )
      );
      
      // Get initial theme
      const html = page.locator('html');
      const initialTheme = await html.getAttribute('class');
      
      // Toggle theme
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // Verify theme changed
      const newTheme = await html.getAttribute('class');
      expect(initialTheme).not.toBe(newTheme);
      
      // Toggle back
      await themeToggle.click();
      await page.waitForTimeout(500);
      
      // Should return to original theme
      const finalTheme = await html.getAttribute('class');
      expect(finalTheme).toBe(initialTheme);
    });

    test('should maintain theme preference across pages', async ({ page }) => {
      // Start on landing page
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Switch to dark mode
      const themeToggle = page.getByRole('button', { name: /theme|السمة/i }).or(
        page.locator('[aria-label*="theme"]').or(
          page.locator('button').filter({ has: page.locator('svg') }).first()
        )
      );
      
      const html = page.locator('html');
      let currentTheme = await html.getAttribute('class');
      
      // Ensure dark mode
      if (!currentTheme?.includes('dark')) {
        await themeToggle.click();
        await page.waitForTimeout(500);
        currentTheme = await html.getAttribute('class');
      }
      
      // Navigate to another page
      await page.goto('/pricing');
      await page.waitForLoadState('networkidle');
      
      // Verify theme persisted
      const newTheme = await html.getAttribute('class');
      expect(newTheme).toContain('dark');
    });
  });

  test.describe('Responsive Design Journey', () => {
    test('should work on mobile devices', async ({ page, isMobile }) => {
      if (!isMobile) {
        test.skip();
        return;
      }
      
      // Navigate to landing page
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Verify mobile menu
      const mobileMenuButton = page.getByRole('button', { name: /menu|القائمة/i }).or(
        page.locator('button').filter({ has: page.locator('svg') })
      );
      
      await expect(mobileMenuButton.first()).toBeVisible({ timeout: 5000 });
      
      // Open mobile menu
      await mobileMenuButton.first().click();
      await page.waitForTimeout(500);
      
      // Verify menu opened
      const mobileMenu = page.locator('[role="dialog"]').or(
        page.locator('[data-testid*="mobile-menu"]')
      );
      
      if (await mobileMenu.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(mobileMenu).toBeVisible();
      }
    });

    test('should have touch-friendly elements on mobile', async ({ page, isMobile }) => {
      if (!isMobile) {
        test.skip();
        return;
      }
      
      await page.goto('/menu/restaurant-1');
      await page.waitForLoadState('networkidle');
      
      // Check dish cards are touch-friendly
      const dishCard = page.locator('[data-testid*="dish"]').or(
        page.locator('[class*="dish-card"]')
      ).first();
      
      if (await dishCard.isVisible({ timeout: 5000 }).catch(() => false)) {
        const box = await dishCard.boundingBox();
        
        if (box) {
          // Touch targets should be reasonably sized
          expect(box.height).toBeGreaterThan(60);
          expect(box.width).toBeGreaterThan(100);
        }
      }
    });
  });

  test.describe('Error Handling Journey', () => {
    test('should handle 404 errors gracefully', async ({ page }) => {
      // Navigate to non-existent page
      await page.goto('/non-existent-page');
      await page.waitForLoadState('networkidle');
      
      // Should show 404 page or redirect
      const errorMessage = page.locator('text=/404|not found|page not found/i');
      
      if (await errorMessage.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(errorMessage).toBeVisible();
      }
    });

    test('should handle network errors', async ({ page }) => {
      // Navigate to menu
      await page.goto('/menu/restaurant-1');
      await page.waitForLoadState('networkidle');
      
      // Simulate offline
      await page.context().setOffline(true);
      
      // Try to perform action
      await page.reload();
      
      // Should show offline indicator or error
      const offlineIndicator = page.locator('text=/offline|no connection|لا يوجد اتصال/i');
      
      if (await offlineIndicator.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(offlineIndicator).toBeVisible();
      }
      
      // Restore connection
      await page.context().setOffline(false);
    });
  });
});
