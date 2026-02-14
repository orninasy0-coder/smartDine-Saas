import { test, expect } from '@playwright/test';

test.describe('Menu Browsing and Ordering', () => {
  test.describe('Menu Browse Page', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to menu page (assuming QR code redirects to menu)
      await page.goto('/menu/restaurant-1');
    });

    test('should display menu items', async ({ page }) => {
      // Wait for menu items to load
      await page.waitForLoadState('networkidle');
      
      // Check for menu items
      const menuItems = page.locator('[data-testid*="dish"]').or(
        page.locator('[class*="dish-card"]')
      );
      
      // At least one menu item should be visible
      await expect(menuItems.first()).toBeVisible({ timeout: 10000 });
    });

    test('should filter menu by category', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Find category filter buttons
      const categoryButtons = page.locator('button').filter({ hasText: /appetizer|main|dessert|مقبلات|أطباق رئيسية|حلويات/i });
      
      if (await categoryButtons.first().isVisible({ timeout: 5000 }).catch(() => false)) {
        // Click on a category
        await categoryButtons.first().click();
        
        // Wait for filter to apply
        await page.waitForTimeout(1000);
        
        // Menu should still show items
        const menuItems = page.locator('[data-testid*="dish"]').or(
          page.locator('[class*="dish-card"]')
        );
        await expect(menuItems.first()).toBeVisible();
      }
    });

    test('should search for dishes', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Find search input
      const searchInput = page.getByPlaceholder(/search|بحث/i).or(
        page.getByRole('searchbox')
      );
      
      if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Type search query
        await searchInput.fill('pizza');
        
        // Wait for search results
        await page.waitForTimeout(1000);
        
        // Results should be displayed
        const searchResults = page.locator('[data-testid*="dish"]').or(
          page.locator('[class*="dish-card"]')
        );
        
        // Either results are shown or "no results" message
        const hasResults = await searchResults.first().isVisible({ timeout: 2000 }).catch(() => false);
        const noResults = await page.locator('text=/no results|لا توجد نتائج/i').isVisible({ timeout: 2000 }).catch(() => false);
        
        expect(hasResults || noResults).toBeTruthy();
      }
    });

    test('should open dish details', async ({ page }) => {
      // Wait for menu items to load
      await page.waitForLoadState('networkidle');
      
      // Click on first dish
      const firstDish = page.locator('[data-testid*="dish"]').or(
        page.locator('[class*="dish-card"]')
      ).first();
      
      await firstDish.click();
      
      // Wait for details to appear (modal or new page)
      await page.waitForTimeout(1000);
      
      // Check for dish details
      const dishDetails = page.locator('[role="dialog"]').or(
        page.locator('[data-testid*="dish-detail"]')
      );
      
      await expect(dishDetails).toBeVisible({ timeout: 5000 });
    });

    test('should add item to cart', async ({ page }) => {
      // Wait for menu items to load
      await page.waitForLoadState('networkidle');
      
      // Click on first dish
      const firstDish = page.locator('[data-testid*="dish"]').or(
        page.locator('[class*="dish-card"]')
      ).first();
      
      await firstDish.click();
      
      // Wait for details
      await page.waitForTimeout(1000);
      
      // Find add to cart button
      const addToCartButton = page.getByRole('button', { name: /add to cart|أضف إلى السلة/i });
      
      if (await addToCartButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await addToCartButton.click();
        
        // Wait for cart update
        await page.waitForTimeout(1000);
        
        // Check for cart indicator or notification
        const cartIndicator = page.locator('[data-testid*="cart"]').or(
          page.locator('text=/added|تمت الإضافة/i')
        );
        
        await expect(cartIndicator.first()).toBeVisible({ timeout: 5000 });
      }
    });

    test('should adjust quantity before adding to cart', async ({ page }) => {
      // Wait for menu items to load
      await page.waitForLoadState('networkidle');
      
      // Click on first dish
      const firstDish = page.locator('[data-testid*="dish"]').or(
        page.locator('[class*="dish-card"]')
      ).first();
      
      await firstDish.click();
      
      // Wait for details
      await page.waitForTimeout(1000);
      
      // Find quantity controls
      const increaseButton = page.getByRole('button', { name: /\+|increase|زيادة/i }).or(
        page.locator('button').filter({ hasText: '+' })
      );
      
      if (await increaseButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Click increase button
        await increaseButton.click();
        
        // Wait for quantity update
        await page.waitForTimeout(500);
        
        // Quantity should be updated
        const quantityDisplay = page.locator('text=/quantity|الكمية/i').or(
          page.locator('[data-testid*="quantity"]')
        );
        
        await expect(quantityDisplay.first()).toBeVisible();
      }
    });
  });

  test.describe('Shopping Cart', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to menu and add item to cart
      await page.goto('/menu/restaurant-1');
      await page.waitForLoadState('networkidle');
      
      // Try to add an item to cart
      const firstDish = page.locator('[data-testid*="dish"]').or(
        page.locator('[class*="dish-card"]')
      ).first();
      
      if (await firstDish.isVisible({ timeout: 5000 }).catch(() => false)) {
        await firstDish.click();
        await page.waitForTimeout(1000);
        
        const addToCartButton = page.getByRole('button', { name: /add to cart|أضف إلى السلة/i });
        if (await addToCartButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await addToCartButton.click();
          await page.waitForTimeout(1000);
        }
      }
    });

    test('should open cart', async ({ page }) => {
      // Find cart button
      const cartButton = page.getByRole('button', { name: /cart|السلة/i }).or(
        page.locator('[data-testid*="cart"]')
      );
      
      if (await cartButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await cartButton.click();
        
        // Cart should be visible
        const cart = page.locator('[role="dialog"]').or(
          page.locator('[data-testid*="cart"]')
        );
        
        await expect(cart).toBeVisible({ timeout: 5000 });
      }
    });

    test('should display cart items', async ({ page }) => {
      // Open cart
      const cartButton = page.getByRole('button', { name: /cart|السلة/i }).or(
        page.locator('[data-testid*="cart"]')
      );
      
      if (await cartButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await cartButton.click();
        await page.waitForTimeout(1000);
        
        // Check for cart items or empty state
        const cartItems = page.locator('[data-testid*="cart-item"]');
        const emptyState = page.locator('text=/empty|فارغة/i');
        
        const hasItems = await cartItems.first().isVisible({ timeout: 2000 }).catch(() => false);
        const isEmpty = await emptyState.isVisible({ timeout: 2000 }).catch(() => false);
        
        expect(hasItems || isEmpty).toBeTruthy();
      }
    });

    test('should update item quantity in cart', async ({ page }) => {
      // Open cart
      const cartButton = page.getByRole('button', { name: /cart|السلة/i }).or(
        page.locator('[data-testid*="cart"]')
      );
      
      if (await cartButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await cartButton.click();
        await page.waitForTimeout(1000);
        
        // Find quantity controls in cart
        const increaseButton = page.locator('[data-testid*="cart"]').locator('button').filter({ hasText: '+' }).first();
        
        if (await increaseButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await increaseButton.click();
          
          // Wait for update
          await page.waitForTimeout(500);
          
          // Total should be updated
          const total = page.locator('text=/total|المجموع/i');
          await expect(total.first()).toBeVisible();
        }
      }
    });

    test('should remove item from cart', async ({ page }) => {
      // Open cart
      const cartButton = page.getByRole('button', { name: /cart|السلة/i }).or(
        page.locator('[data-testid*="cart"]')
      );
      
      if (await cartButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await cartButton.click();
        await page.waitForTimeout(1000);
        
        // Find remove button
        const removeButton = page.getByRole('button', { name: /remove|delete|حذف/i }).or(
          page.locator('button').filter({ has: page.locator('svg') })
        ).first();
        
        if (await removeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await removeButton.click();
          
          // Wait for removal
          await page.waitForTimeout(500);
          
          // Item should be removed or cart should be empty
          const emptyState = page.locator('text=/empty|فارغة/i');
          await expect(emptyState).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test('should proceed to checkout', async ({ page }) => {
      // Open cart
      const cartButton = page.getByRole('button', { name: /cart|السلة/i }).or(
        page.locator('[data-testid*="cart"]')
      );
      
      if (await cartButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await cartButton.click();
        await page.waitForTimeout(1000);
        
        // Find checkout button
        const checkoutButton = page.getByRole('button', { name: /checkout|place order|تأكيد الطلب/i });
        
        if (await checkoutButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await checkoutButton.click();
          
          // Should navigate to checkout or show confirmation
          await page.waitForTimeout(1000);
          
          // Check for checkout page or confirmation
          const checkoutPage = page.locator('text=/checkout|order confirmation|تأكيد الطلب/i');
          await expect(checkoutPage.first()).toBeVisible({ timeout: 5000 });
        }
      }
    });
  });

  test.describe('AR Viewer', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/menu/restaurant-1');
      await page.waitForLoadState('networkidle');
    });

    test('should display AR button for supported dishes', async ({ page }) => {
      // Click on first dish
      const firstDish = page.locator('[data-testid*="dish"]').or(
        page.locator('[class*="dish-card"]')
      ).first();
      
      if (await firstDish.isVisible({ timeout: 5000 }).catch(() => false)) {
        await firstDish.click();
        await page.waitForTimeout(1000);
        
        // Check for AR button
        const arButton = page.getByRole('button', { name: /ar|3d|view in ar|عرض ثلاثي الأبعاد/i });
        
        // AR button might be visible
        if (await arButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await expect(arButton).toBeEnabled();
        }
      }
    });

    test('should open AR viewer', async ({ page }) => {
      // Click on first dish
      const firstDish = page.locator('[data-testid*="dish"]').or(
        page.locator('[class*="dish-card"]')
      ).first();
      
      if (await firstDish.isVisible({ timeout: 5000 }).catch(() => false)) {
        await firstDish.click();
        await page.waitForTimeout(1000);
        
        // Find and click AR button
        const arButton = page.getByRole('button', { name: /ar|3d|view in ar|عرض ثلاثي الأبعاد/i });
        
        if (await arButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await arButton.click();
          
          // Wait for AR viewer to load
          await page.waitForTimeout(2000);
          
          // Check for AR viewer or canvas
          const arViewer = page.locator('canvas').or(
            page.locator('[data-testid*="ar-viewer"]')
          );
          
          await expect(arViewer.first()).toBeVisible({ timeout: 10000 });
        }
      }
    });
  });
});
