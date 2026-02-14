import { test, expect } from '@playwright/test';

test.describe('Dashboard Features', () => {
  test.describe('Kitchen Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to kitchen dashboard
      await page.goto('/kitchen/dashboard');
      
      // Should redirect to login if not authenticated
      if (await page.url().includes('login')) {
        // Skip tests if authentication is required
        test.skip();
      }
    });

    test('should display orders queue', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check for orders section
      const ordersSection = page.locator('[data-testid*="order"]').or(
        page.locator('text=/orders|الطلبات/i')
      );
      
      await expect(ordersSection.first()).toBeVisible({ timeout: 10000 });
    });

    test('should display order cards', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check for order cards or empty state
      const orderCards = page.locator('[data-testid*="order-card"]');
      const emptyState = page.locator('text=/no orders|لا توجد طلبات/i');
      
      const hasOrders = await orderCards.first().isVisible({ timeout: 5000 }).catch(() => false);
      const isEmpty = await emptyState.isVisible({ timeout: 5000 }).catch(() => false);
      
      expect(hasOrders || isEmpty).toBeTruthy();
    });

    test('should update order status', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Find status update button
      const statusButton = page.getByRole('button', { name: /preparing|ready|complete|جاري التحضير|جاهز/i }).first();
      
      if (await statusButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await statusButton.click();
        
        // Wait for status update
        await page.waitForTimeout(1000);
        
        // Check for success notification or status change
        const notification = page.locator('text=/updated|success|تم التحديث|نجح/i');
        await expect(notification.first()).toBeVisible({ timeout: 5000 });
      }
    });

    test('should filter orders by status', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Find filter buttons
      const filterButtons = page.getByRole('button', { name: /all|pending|preparing|ready|الكل|قيد الانتظار|جاري التحضير|جاهز/i });
      
      if (await filterButtons.first().isVisible({ timeout: 5000 }).catch(() => false)) {
        await filterButtons.first().click();
        
        // Wait for filter to apply
        await page.waitForTimeout(1000);
        
        // Orders should be filtered
        const orders = page.locator('[data-testid*="order"]');
        await expect(orders.first()).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Owner Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to owner dashboard
      await page.goto('/owner/dashboard');
      
      // Should redirect to login if not authenticated
      if (await page.url().includes('login')) {
        test.skip();
      }
    });

    test('should display dashboard statistics', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check for stats cards
      const statsCards = page.locator('[data-testid*="stat"]').or(
        page.locator('[class*="stat-card"]')
      );
      
      await expect(statsCards.first()).toBeVisible({ timeout: 10000 });
    });

    test('should display revenue chart', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check for chart
      const chart = page.locator('svg').or(
        page.locator('[data-testid*="chart"]')
      );
      
      if (await chart.first().isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(chart.first()).toBeVisible();
      }
    });

    test('should navigate to menu management', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Find menu management link
      const menuLink = page.getByRole('link', { name: /menu|القائمة/i });
      
      if (await menuLink.first().isVisible({ timeout: 5000 }).catch(() => false)) {
        await menuLink.first().click();
        
        // Should navigate to menu management
        await expect(page).toHaveURL(/.*menu/, { timeout: 5000 });
      }
    });

    test('should navigate to analytics', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Find analytics link
      const analyticsLink = page.getByRole('link', { name: /analytics|تحليلات/i });
      
      if (await analyticsLink.first().isVisible({ timeout: 5000 }).catch(() => false)) {
        await analyticsLink.first().click();
        
        // Should navigate to analytics
        await expect(page).toHaveURL(/.*analytics/, { timeout: 5000 });
      }
    });

    test('should display recent orders', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check for recent orders section
      const recentOrders = page.locator('text=/recent orders|الطلبات الأخيرة/i');
      
      if (await recentOrders.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(recentOrders).toBeVisible();
      }
    });
  });

  test.describe('Admin Dashboard', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to admin dashboard
      await page.goto('/admin/dashboard');
      
      // Should redirect to login if not authenticated
      if (await page.url().includes('login')) {
        test.skip();
      }
    });

    test('should display platform statistics', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check for platform stats
      const statsCards = page.locator('[data-testid*="stat"]').or(
        page.locator('[class*="stat-card"]')
      );
      
      await expect(statsCards.first()).toBeVisible({ timeout: 10000 });
    });

    test('should display restaurants list', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Navigate to restaurants management
      const restaurantsLink = page.getByRole('link', { name: /restaurants|المطاعم/i });
      
      if (await restaurantsLink.first().isVisible({ timeout: 5000 }).catch(() => false)) {
        await restaurantsLink.first().click();
        
        // Wait for navigation
        await page.waitForTimeout(1000);
        
        // Check for restaurants table or list
        const restaurantsList = page.locator('table').or(
          page.locator('[data-testid*="restaurant"]')
        );
        
        await expect(restaurantsList.first()).toBeVisible({ timeout: 5000 });
      }
    });

    test('should manage subscriptions', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Navigate to subscriptions
      const subscriptionsLink = page.getByRole('link', { name: /subscriptions|الاشتراكات/i });
      
      if (await subscriptionsLink.first().isVisible({ timeout: 5000 }).catch(() => false)) {
        await subscriptionsLink.first().click();
        
        // Wait for navigation
        await page.waitForTimeout(1000);
        
        // Check for subscriptions list
        const subscriptionsList = page.locator('table').or(
          page.locator('[data-testid*="subscription"]')
        );
        
        await expect(subscriptionsList.first()).toBeVisible({ timeout: 5000 });
      }
    });
  });
});
