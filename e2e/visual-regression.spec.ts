/**
 * Visual Regression Tests
 * 
 * These tests capture screenshots of key pages and components
 * and compare them against baseline images to detect visual changes.
 * 
 * Run tests: npm run test:e2e -- visual-regression
 * Update baselines: npm run test:e2e -- visual-regression --update-snapshots
 */

import { test, expect } from '@playwright/test';

test.describe('Visual Regression - Public Pages', () => {
  test('Landing page - desktop', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for animations to complete
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('landing-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('Landing page - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('landing-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('Pricing page - desktop', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('pricing-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('Pricing page - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('pricing-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('Contact page - desktop', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('contact-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('User Guide page - desktop', async ({ page }) => {
    await page.goto('/guide');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('guide-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Authentication Pages', () => {
  test('Login page - desktop', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('login-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('Login page - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('login-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('Register page - desktop', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('register-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('Register page - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('register-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('Reset password page - desktop', async ({ page }) => {
    await page.goto('/reset-password');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('reset-password-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Menu & Cart', () => {
  test('Menu browse page - desktop', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('menu-browse-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('Menu browse page - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('menu-browse-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('Dish detail page - desktop', async ({ page }) => {
    await page.goto('/menu/dish/1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('dish-detail-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('Cart page - desktop', async ({ page }) => {
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('cart-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('Cart page - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('cart-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Error Pages', () => {
  test('404 Not Found page - desktop', async ({ page }) => {
    await page.goto('/non-existent-page');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('404-desktop.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('404 Not Found page - mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/non-existent-page');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('404-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Theme Variations', () => {
  test('Landing page - dark mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Toggle to dark mode
    await page.click('[aria-label*="theme" i], [aria-label*="Toggle theme" i]');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('landing-dark-mode.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('Pricing page - dark mode', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    
    // Toggle to dark mode
    await page.click('[aria-label*="theme" i], [aria-label*="Toggle theme" i]');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('pricing-dark-mode.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('Menu page - dark mode', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');
    
    // Toggle to dark mode
    await page.click('[aria-label*="theme" i], [aria-label*="Toggle theme" i]');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('menu-dark-mode.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - RTL Support', () => {
  test('Landing page - Arabic (RTL)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Switch to Arabic
    const languageSelector = page.locator('[aria-label*="language" i], button:has-text("EN"), button:has-text("AR")').first();
    if (await languageSelector.isVisible()) {
      await languageSelector.click();
      await page.waitForTimeout(300);
      
      const arabicOption = page.locator('text=/AR|Arabic|العربية/i').first();
      if (await arabicOption.isVisible()) {
        await arabicOption.click();
        await page.waitForTimeout(500);
      }
    }
    
    await expect(page).toHaveScreenshot('landing-rtl.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('Pricing page - Arabic (RTL)', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    
    // Switch to Arabic
    const languageSelector = page.locator('[aria-label*="language" i], button:has-text("EN"), button:has-text("AR")').first();
    if (await languageSelector.isVisible()) {
      await languageSelector.click();
      await page.waitForTimeout(300);
      
      const arabicOption = page.locator('text=/AR|Arabic|العربية/i').first();
      if (await arabicOption.isVisible()) {
        await arabicOption.click();
        await page.waitForTimeout(500);
      }
    }
    
    await expect(page).toHaveScreenshot('pricing-rtl.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});
