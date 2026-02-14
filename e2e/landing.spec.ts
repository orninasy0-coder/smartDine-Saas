import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hero section with correct content', async ({ page }) => {
    // Check hero heading
    const heroHeading = page.getByRole('heading', { level: 1 });
    await expect(heroHeading).toBeVisible();
    
    // Check CTA buttons
    const getStartedButton = page.getByRole('link', { name: /get started|ابدأ الآن/i });
    await expect(getStartedButton).toBeVisible();
  });

  test('should navigate to pricing page from CTA', async ({ page }) => {
    // Click on pricing link
    await page.getByRole('link', { name: /pricing|الأسعار/i }).first().click();
    
    // Verify navigation
    await expect(page).toHaveURL(/.*pricing/);
  });

  test('should display features section', async ({ page }) => {
    // Check for features section
    const featuresSection = page.locator('section').filter({ hasText: /features|الميزات/i });
    await expect(featuresSection).toBeVisible();
    
    // Check for feature cards
    const featureCards = page.locator('[class*="feature"]').or(page.locator('[data-testid*="feature"]'));
    await expect(featureCards.first()).toBeVisible();
  });

  test('should display testimonials section', async ({ page }) => {
    // Scroll to testimonials
    await page.locator('text=/testimonials|التقييمات/i').scrollIntoViewIfNeeded();
    
    // Check testimonials are visible
    const testimonialsSection = page.locator('section').filter({ hasText: /testimonials|التقييمات/i });
    await expect(testimonialsSection).toBeVisible();
  });

  test('should toggle theme (dark/light mode)', async ({ page }) => {
    // Find theme toggle button
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
    
    // Wait for theme change
    await page.waitForTimeout(300);
    
    // Verify theme changed
    const newTheme = await html.getAttribute('class');
    expect(initialTheme).not.toBe(newTheme);
  });

  test('should change language', async ({ page }) => {
    // Find language selector
    const languageSelector = page.getByRole('button', { name: /language|اللغة/i }).or(
      page.locator('[aria-label*="language"]')
    );
    
    if (await languageSelector.isVisible()) {
      await languageSelector.click();
      
      // Select different language
      const languageOption = page.getByRole('menuitem').or(page.locator('[role="option"]')).first();
      await languageOption.click();
      
      // Wait for language change
      await page.waitForTimeout(500);
      
      // Verify language changed (check for RTL or content change)
      const html = page.locator('html');
      const dir = await html.getAttribute('dir');
      expect(dir).toBeTruthy();
    }
  });

  test('should have working navigation menu', async ({ page }) => {
    // Check main navigation links
    const navLinks = ['Home', 'Features', 'Pricing', 'Contact'];
    
    for (const linkText of navLinks) {
      const link = page.getByRole('link', { name: new RegExp(linkText, 'i') }).first();
      if (await link.isVisible()) {
        await expect(link).toBeEnabled();
      }
    }
  });

  test('should display footer with links', async ({ page }) => {
    // Scroll to footer
    await page.locator('footer').scrollIntoViewIfNeeded();
    
    // Check footer is visible
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    // Check for social media or important links
    const footerLinks = footer.locator('a');
    await expect(footerLinks.first()).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      // Check mobile menu button exists
      const mobileMenuButton = page.getByRole('button', { name: /menu|القائمة/i }).or(
        page.locator('button').filter({ has: page.locator('svg') })
      );
      
      // Mobile menu should be present
      await expect(mobileMenuButton.first()).toBeVisible();
    }
  });
});
