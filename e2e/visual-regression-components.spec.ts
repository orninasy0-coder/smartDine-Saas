/**
 * Visual Regression Tests - Component Level
 * 
 * These tests capture screenshots of individual components
 * in isolation to detect visual changes at the component level.
 */

import { test, expect } from '@playwright/test';

test.describe('Visual Regression - Navigation Components', () => {
  test('Public header - desktop', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const header = page.locator('header, nav').first();
    await expect(header).toHaveScreenshot('header-desktop.png', {
      animations: 'disabled',
    });
  });

  test('Public header - mobile menu open', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Open mobile menu
    const menuButton = page.locator('button[aria-label*="menu" i], button:has-text("Menu")').first();
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(500);
    }
    
    await expect(page).toHaveScreenshot('header-mobile-menu-open.png', {
      animations: 'disabled',
    });
  });

  test('Footer - desktop', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const footer = page.locator('footer').first();
    await expect(footer).toHaveScreenshot('footer-desktop.png', {
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Form Components', () => {
  test('Login form - empty state', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    const form = page.locator('form').first();
    await expect(form).toHaveScreenshot('login-form-empty.png', {
      animations: 'disabled',
    });
  });

  test('Login form - filled state', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('input[type="email"], input[name="email"]', 'test@example.com');
    await page.fill('input[type="password"], input[name="password"]', 'password123');
    
    const form = page.locator('form').first();
    await expect(form).toHaveScreenshot('login-form-filled.png', {
      animations: 'disabled',
    });
  });

  test('Register form - empty state', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    
    const form = page.locator('form').first();
    await expect(form).toHaveScreenshot('register-form-empty.png', {
      animations: 'disabled',
    });
  });

  test('Contact form - empty state', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    
    const form = page.locator('form').first();
    await expect(form).toHaveScreenshot('contact-form-empty.png', {
      animations: 'disabled',
    });
  });
});

test.describe('Visual Regression - Card Components', () => {
  test('Pricing cards - all plans', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    const pricingCards = page.locator('[class*="pricing"], [class*="plan"]').first();
    if (await pricingCards.isVisible()) {
      await expect(pricingCards).toHaveScreenshot('pricing-cards.png', {
        animations: 'disabled',
      });
    }
  });

  test('Feature cards - landing page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Scroll to features section
    await page.evaluate(() => {
      const featuresSection = document.querySelector('[class*="feature"]');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
    await page.waitForTimeout(500);
    
    const featuresSection = page.locator('[class*="feature"]').first();
    if (await featuresSection.isVisible()) {
      await expect(featuresSection).toHaveScreenshot('feature-cards.png', {
        animations: 'disabled',
      });
    }
  });

  test('Dish cards - menu page', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const dishCard = page.locator('[class*="dish"], [class*="menu-item"]').first();
    if (await dishCard.isVisible()) {
      await expect(dishCard).toHaveScreenshot('dish-card.png', {
        animations: 'disabled',
      });
    }
  });
});

test.describe('Visual Regression - Button States', () => {
  test('Primary button - normal state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const primaryButton = page.locator('button[class*="primary"], a[class*="primary"]').first();
    if (await primaryButton.isVisible()) {
      await expect(primaryButton).toHaveScreenshot('button-primary-normal.png', {
        animations: 'disabled',
      });
    }
  });

  test('Primary button - hover state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const primaryButton = page.locator('button[class*="primary"], a[class*="primary"]').first();
    if (await primaryButton.isVisible()) {
      await primaryButton.hover();
      await page.waitForTimeout(200);
      
      await expect(primaryButton).toHaveScreenshot('button-primary-hover.png', {
        animations: 'disabled',
      });
    }
  });

  test('Secondary button - normal state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const secondaryButton = page.locator('button[class*="secondary"], button[class*="outline"]').first();
    if (await secondaryButton.isVisible()) {
      await expect(secondaryButton).toHaveScreenshot('button-secondary-normal.png', {
        animations: 'disabled',
      });
    }
  });
});

test.describe('Visual Regression - Interactive States', () => {
  test('Search bar - focused state', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
    if (await searchInput.isVisible()) {
      await searchInput.focus();
      await page.waitForTimeout(200);
      
      await expect(searchInput).toHaveScreenshot('search-focused.png', {
        animations: 'disabled',
      });
    }
  });

  test('Dropdown menu - open state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Try to open language selector or any dropdown
    const dropdown = page.locator('[role="button"][aria-haspopup], button[aria-haspopup]').first();
    if (await dropdown.isVisible()) {
      await dropdown.click();
      await page.waitForTimeout(300);
      
      await expect(page).toHaveScreenshot('dropdown-open.png', {
        animations: 'disabled',
      });
    }
  });

  test('Modal dialog - open state', async ({ page }) => {
    await page.goto('/menu');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Try to open a modal (e.g., dish detail)
    const dishCard = page.locator('[class*="dish"], [class*="menu-item"]').first();
    if (await dishCard.isVisible()) {
      await dishCard.click();
      await page.waitForTimeout(500);
      
      const modal = page.locator('[role="dialog"], [class*="modal"]').first();
      if (await modal.isVisible()) {
        await expect(modal).toHaveScreenshot('modal-open.png', {
          animations: 'disabled',
        });
      }
    }
  });
});

test.describe('Visual Regression - Loading States', () => {
  test('Loading spinner', async ({ page }) => {
    await page.goto('/menu');
    
    // Try to capture loading state
    const loadingIndicator = page.locator('[class*="loading"], [class*="spinner"], [role="status"]').first();
    if (await loadingIndicator.isVisible({ timeout: 1000 })) {
      await expect(loadingIndicator).toHaveScreenshot('loading-spinner.png', {
        animations: 'disabled',
      });
    }
  });

  test('Skeleton loader', async ({ page }) => {
    await page.goto('/menu');
    
    // Try to capture skeleton state
    const skeleton = page.locator('[class*="skeleton"]').first();
    if (await skeleton.isVisible({ timeout: 1000 })) {
      await expect(skeleton).toHaveScreenshot('skeleton-loader.png', {
        animations: 'disabled',
      });
    }
  });
});

test.describe('Visual Regression - Responsive Breakpoints', () => {
  const breakpoints = [
    { name: 'mobile-small', width: 320, height: 568 },
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'desktop-large', width: 1920, height: 1080 },
  ];

  for (const breakpoint of breakpoints) {
    test(`Landing page - ${breakpoint.name}`, async ({ page }) => {
      await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      await expect(page).toHaveScreenshot(`landing-${breakpoint.name}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });
  }
});
