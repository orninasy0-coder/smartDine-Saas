/**
 * Advanced Visual Regression Tests
 * 
 * These tests demonstrate advanced visual regression testing techniques
 * using the helper utilities.
 */

import { test, expect } from '@playwright/test';
import {
  waitForPageStable,
  takeFullPageScreenshot,
  setViewport,
  testAcrossViewports,
  testBothThemes,
  testBothLanguages,
  testInteractiveState,
  testFormStates,
  switchToDarkMode,
  switchLanguage,
  hideDynamicContent,
  takeScreenshotWithMask,
  waitForImages,
  waitForFonts,
} from './helpers/visual-regression-utils';

test.describe('Advanced Visual Regression - Cross-Browser', () => {
  test('Landing page - all viewports', async ({ page }) => {
    await testAcrossViewports(
      page,
      '/',
      'landing-responsive',
      ['mobile', 'tablet', 'desktop', 'desktopLarge']
    );
  });

  test('Pricing page - theme variations', async ({ page }) => {
    await testBothThemes(page, '/pricing', 'pricing-themes');
  });

  test('Menu page - language variations', async ({ page }) => {
    await testBothLanguages(page, '/menu', 'menu-i18n');
  });
});

test.describe('Advanced Visual Regression - Interactive States', () => {
  test('Button hover states', async ({ page }) => {
    await page.goto('/');
    await waitForPageStable(page);

    // Test primary button hover
    await testInteractiveState(
      page,
      'button[class*="primary"]:first-of-type',
      'hover',
      'button-primary-hover.png'
    );

    // Test secondary button hover
    await testInteractiveState(
      page,
      'button[class*="secondary"]:first-of-type',
      'hover',
      'button-secondary-hover.png'
    );
  });

  test('Input focus states', async ({ page }) => {
    await page.goto('/login');
    await waitForPageStable(page);

    // Test email input focus
    await testInteractiveState(
      page,
      'input[type="email"]',
      'focus',
      'input-email-focus.png'
    );

    // Test password input focus
    await testInteractiveState(
      page,
      'input[type="password"]',
      'focus',
      'input-password-focus.png'
    );
  });

  test('Form validation states', async ({ page }) => {
    await page.goto('/login');
    await waitForPageStable(page);

    await testFormStates(page, 'form', 'login-form', {
      'input[type="email"]': 'test@example.com',
      'input[type="password"]': 'password123',
    });
  });
});

test.describe('Advanced Visual Regression - Dynamic Content', () => {
  test('Landing page - hide dynamic timestamps', async ({ page }) => {
    await page.goto('/');
    await waitForPageStable(page);

    // Hide any dynamic content like timestamps, counters, etc.
    await hideDynamicContent(page, [
      '[class*="timestamp"]',
      '[class*="counter"]',
      '[data-testid="dynamic-content"]',
    ]);

    await takeFullPageScreenshot(page, 'landing-no-dynamic.png');
  });

  test('Dashboard - mask user-specific data', async ({ page }) => {
    await page.goto('/');
    await waitForPageStable(page);

    // Mask user-specific or dynamic regions
    await takeScreenshotWithMask(page, 'landing-masked.png', [
      '[class*="user-info"]',
      '[class*="notification"]',
      '[data-testid="user-avatar"]',
    ]);
  });
});

test.describe('Advanced Visual Regression - Performance', () => {
  test('Menu page - wait for images', async ({ page }) => {
    await page.goto('/menu');
    await waitForPageStable(page);
    
    // Ensure all images are loaded
    await waitForImages(page);
    
    await takeFullPageScreenshot(page, 'menu-images-loaded.png');
  });

  test('Landing page - wait for fonts', async ({ page }) => {
    await page.goto('/');
    await waitForPageStable(page);
    
    // Ensure all fonts are loaded
    await waitForFonts(page);
    
    await takeFullPageScreenshot(page, 'landing-fonts-loaded.png');
  });
});

test.describe('Advanced Visual Regression - Complex Scenarios', () => {
  test('Menu page - search and filter', async ({ page }) => {
    await page.goto('/menu');
    await waitForPageStable(page);

    // Test search functionality
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('pizza');
      await page.waitForTimeout(500);
      await takeFullPageScreenshot(page, 'menu-search-results.png');
    }
  });

  test('Cart page - with items', async ({ page }) => {
    await page.goto('/menu');
    await waitForPageStable(page);

    // Add items to cart
    const addToCartButton = page.locator('button:has-text("Add to Cart"), button[aria-label*="add" i]').first();
    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();
      await page.waitForTimeout(500);
    }

    // Navigate to cart
    await page.goto('/cart');
    await waitForPageStable(page);
    await takeFullPageScreenshot(page, 'cart-with-items.png');
  });

  test('Pricing page - plan comparison', async ({ page }) => {
    await page.goto('/pricing');
    await waitForPageStable(page);

    // Scroll to comparison table if exists
    const comparisonTable = page.locator('[class*="comparison"], table').first();
    if (await comparisonTable.isVisible()) {
      await comparisonTable.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await takeFullPageScreenshot(page, 'pricing-comparison.png');
    }
  });
});

test.describe('Advanced Visual Regression - Accessibility', () => {
  test('High contrast mode', async ({ page }) => {
    await page.goto('/');
    await waitForPageStable(page);

    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' });
    await page.waitForTimeout(500);

    await takeFullPageScreenshot(page, 'landing-high-contrast.png');
  });

  test('Reduced motion', async ({ page }) => {
    await page.goto('/');
    
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await waitForPageStable(page);

    await takeFullPageScreenshot(page, 'landing-reduced-motion.png');
  });
});

test.describe('Advanced Visual Regression - Mobile Specific', () => {
  test('Mobile menu navigation', async ({ page }) => {
    await setViewport(page, 'mobile');
    await page.goto('/');
    await waitForPageStable(page);

    // Open mobile menu
    const menuButton = page.locator('button[aria-label*="menu" i]').first();
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(500);
      await takeFullPageScreenshot(page, 'mobile-menu-open.png');
    }
  });

  test('Mobile landscape orientation', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await page.goto('/');
    await waitForPageStable(page);

    await takeFullPageScreenshot(page, 'mobile-landscape.png');
  });
});

test.describe('Advanced Visual Regression - Print Styles', () => {
  test('Landing page - print preview', async ({ page }) => {
    await page.goto('/');
    await waitForPageStable(page);

    // Emulate print media
    await page.emulateMedia({ media: 'print' });
    await page.waitForTimeout(500);

    await takeFullPageScreenshot(page, 'landing-print.png');
  });

  test('User guide - print preview', async ({ page }) => {
    await page.goto('/guide');
    await waitForPageStable(page);

    // Emulate print media
    await page.emulateMedia({ media: 'print' });
    await page.waitForTimeout(500);

    await takeFullPageScreenshot(page, 'guide-print.png');
  });
});

test.describe('Advanced Visual Regression - Error States', () => {
  test('Form validation errors', async ({ page }) => {
    await page.goto('/login');
    await waitForPageStable(page);

    // Submit empty form to trigger validation
    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();
    await page.waitForTimeout(500);

    await takeFullPageScreenshot(page, 'login-validation-errors.png');
  });

  test('Network error state', async ({ page }) => {
    // Simulate offline mode
    await page.context().setOffline(true);
    
    await page.goto('/menu');
    await page.waitForTimeout(2000);

    await takeFullPageScreenshot(page, 'menu-offline.png');
  });
});
