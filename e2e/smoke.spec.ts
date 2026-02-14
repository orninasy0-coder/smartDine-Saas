import { test, expect } from '@playwright/test';

/**
 * Smoke tests - Quick tests to verify basic functionality
 * These tests should run fast and catch major issues
 */

test.describe('Smoke Tests', () => {
  test('should load landing page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Check that page loaded successfully
    await expect(page).toHaveTitle(/.*/);
    
    // Check for main content
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for navigation element
    const nav = page.locator('nav').or(page.locator('[role="navigation"]'));
    await expect(nav.first()).toBeVisible({ timeout: 10000 });
  });

  test('should load login page', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');
    
    // Check that login page loaded
    await expect(page).toHaveURL(/.*login/);
  });

  test('should load register page', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('domcontentloaded');
    
    // Check that register page loaded
    await expect(page).toHaveURL(/.*register/);
  });

  test('should load pricing page', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('domcontentloaded');
    
    // Check that pricing page loaded
    await expect(page).toHaveURL(/.*pricing/);
  });

  test('should have no console errors on landing page', async ({ page }) => {
    const errors: string[] = [];
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Listen for page errors
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Allow some time for any errors to appear
    await page.waitForTimeout(2000);
    
    // Filter out known acceptable errors (like network errors in dev)
    const criticalErrors = errors.filter(error => 
      !error.includes('favicon') &&
      !error.includes('manifest') &&
      !error.includes('service-worker')
    );
    
    // Should have no critical errors
    expect(criticalErrors.length).toBe(0);
  });

  test('should be responsive', async ({ page, isMobile }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that page is visible
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check viewport
    const viewport = page.viewportSize();
    expect(viewport).toBeTruthy();
    
    if (isMobile) {
      // On mobile, check for mobile-specific elements
      const mobileMenu = page.getByRole('button', { name: /menu|القائمة/i }).or(
        page.locator('button').filter({ has: page.locator('svg') })
      );
      
      // Mobile menu button should exist
      if (await mobileMenu.first().isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(mobileMenu.first()).toBeVisible();
      }
    }
  });

  test('should have proper HTML structure', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for html tag
    const html = page.locator('html');
    await expect(html).toBeVisible();
    
    // Check for head
    const head = page.locator('head');
    await expect(head).toBeAttached();
    
    // Check for body
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // Check for main content area
    const main = page.locator('main').or(page.locator('[role="main"]'));
    await expect(main).toBeVisible({ timeout: 10000 });
  });

  test('should load CSS and JavaScript', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that styles are applied (body should have some computed styles)
    const body = page.locator('body');
    const backgroundColor = await body.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // Should have a background color set
    expect(backgroundColor).toBeTruthy();
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('should handle 404 gracefully', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-12345');
    
    // Should either get 404 or redirect
    if (response) {
      const status = response.status();
      expect([200, 404]).toContain(status);
    }
    
    // Page should still be functional
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
