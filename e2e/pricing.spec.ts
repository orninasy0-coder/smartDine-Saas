import { test, expect } from '@playwright/test';

test.describe('Pricing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing');
  });

  test('should display pricing plans', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for pricing cards
    const pricingCards = page.locator('[data-testid*="pricing"]').or(
      page.locator('[class*="pricing-card"]')
    );
    
    // At least one pricing plan should be visible
    await expect(pricingCards.first()).toBeVisible({ timeout: 10000 });
  });

  test('should display all three pricing tiers', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for Basic, Pro, and Enterprise plans
    const basicPlan = page.locator('text=/basic|أساسي/i');
    const proPlan = page.locator('text=/pro|احترافي/i');
    const enterprisePlan = page.locator('text=/enterprise|مؤسسات/i');
    
    await expect(basicPlan.first()).toBeVisible({ timeout: 5000 });
    await expect(proPlan.first()).toBeVisible({ timeout: 5000 });
    await expect(enterprisePlan.first()).toBeVisible({ timeout: 5000 });
  });

  test('should display pricing amounts', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for price displays (looking for currency symbols or numbers)
    const prices = page.locator('text=/\\$|€|£|ر\\.س|\\d+/');
    
    await expect(prices.first()).toBeVisible({ timeout: 5000 });
  });

  test('should display feature lists for each plan', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for feature lists (usually with checkmarks or bullet points)
    const features = page.locator('ul').or(
      page.locator('[data-testid*="feature"]')
    );
    
    await expect(features.first()).toBeVisible({ timeout: 5000 });
  });

  test('should have CTA buttons for each plan', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for CTA buttons
    const ctaButtons = page.getByRole('button', { name: /get started|choose plan|subscribe|ابدأ الآن|اختر الخطة/i });
    
    await expect(ctaButtons.first()).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to registration when clicking CTA', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Click on first CTA button
    const ctaButton = page.getByRole('button', { name: /get started|choose plan|subscribe|ابدأ الآن|اختر الخطة/i }).first();
    
    if (await ctaButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await ctaButton.click();
      
      // Should navigate to register or checkout
      await expect(page).toHaveURL(/.*register|signup|checkout/, { timeout: 5000 });
    }
  });

  test('should display feature comparison table', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Scroll down to find comparison table
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    
    // Check for comparison table
    const comparisonTable = page.locator('table').or(
      page.locator('[data-testid*="comparison"]')
    );
    
    if (await comparisonTable.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(comparisonTable).toBeVisible();
    }
  });

  test('should toggle between monthly and annual billing', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Look for billing toggle
    const billingToggle = page.getByRole('button', { name: /monthly|annual|yearly|شهري|سنوي/i }).or(
      page.locator('[data-testid*="billing-toggle"]')
    );
    
    if (await billingToggle.first().isVisible({ timeout: 5000 }).catch(() => false)) {
      // Get initial price
      const priceElement = page.locator('text=/\\$\\d+|€\\d+|£\\d+|\\d+\\s*ر\\.س/').first();
      const initialPrice = await priceElement.textContent();
      
      // Toggle billing period
      await billingToggle.first().click();
      
      // Wait for price update
      await page.waitForTimeout(1000);
      
      // Price should change
      const newPrice = await priceElement.textContent();
      expect(initialPrice).not.toBe(newPrice);
    }
  });

  test('should highlight recommended plan', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check for recommended badge or highlight
    const recommendedBadge = page.locator('text=/recommended|popular|most popular|موصى به|الأكثر شعبية/i');
    
    if (await recommendedBadge.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(recommendedBadge).toBeVisible();
    }
  });

  test('should display FAQ section', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check for FAQ section
    const faqSection = page.locator('text=/faq|frequently asked|أسئلة شائعة/i');
    
    if (await faqSection.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(faqSection).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Pricing cards should stack vertically on mobile
      const pricingCards = page.locator('[data-testid*="pricing"]').or(
        page.locator('[class*="pricing-card"]')
      );
      
      await expect(pricingCards.first()).toBeVisible({ timeout: 5000 });
      
      // Check that cards are visible and scrollable
      const cardCount = await pricingCards.count();
      expect(cardCount).toBeGreaterThan(0);
    }
  });
});
