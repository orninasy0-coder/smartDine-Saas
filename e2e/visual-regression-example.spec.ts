/**
 * Visual Regression Testing - Example Test
 * 
 * This file demonstrates how to use the visual regression testing utilities.
 * Use this as a reference when writing new visual regression tests.
 */

import { test, expect } from '@playwright/test';
import {
  waitForPageStable,
  takeFullPageScreenshot,
  takeComponentScreenshot,
  setViewport,
  testAcrossViewports,
  testBothThemes,
  testBothLanguages,
  testInteractiveState,
  testFormStates,
  switchToDarkMode,
  switchLanguage,
  waitForImages,
  waitForFonts,
} from './helpers/visual-regression-utils';

/**
 * Example 1: Basic full page screenshot
 */
test('Example: Basic full page screenshot', async ({ page }) => {
  await page.goto('/');
  await waitForPageStable(page);
  
  await takeFullPageScreenshot(page, 'example-basic.png');
});

/**
 * Example 2: Component screenshot
 */
test('Example: Component screenshot', async ({ page }) => {
  await page.goto('/');
  await waitForPageStable(page);
  
  const header = page.locator('header').first();
  await takeComponentScreenshot(header, 'example-header.png');
});

/**
 * Example 3: Multiple viewports
 */
test('Example: Test across viewports', async ({ page }) => {
  await testAcrossViewports(
    page,
    '/pricing',
    'example-responsive',
    ['mobile', 'tablet', 'desktop']
  );
});

/**
 * Example 4: Theme variations
 */
test('Example: Test both themes', async ({ page }) => {
  await testBothThemes(page, '/pricing', 'example-themes');
});

/**
 * Example 5: Language variations
 */
test('Example: Test both languages', async ({ page }) => {
  await testBothLanguages(page, '/menu', 'example-i18n');
});

/**
 * Example 6: Interactive states
 */
test('Example: Button hover state', async ({ page }) => {
  await page.goto('/');
  await waitForPageStable(page);
  
  await testInteractiveState(
    page,
    'button:first-of-type',
    'hover',
    'example-button-hover.png'
  );
});

/**
 * Example 7: Form states
 */
test('Example: Form with data', async ({ page }) => {
  await page.goto('/login');
  await waitForPageStable(page);
  
  await testFormStates(page, 'form', 'example-form', {
    'input[type="email"]': 'test@example.com',
    'input[type="password"]': 'password123',
  });
});

/**
 * Example 8: Custom viewport
 */
test('Example: Custom viewport', async ({ page }) => {
  await setViewport(page, 'tablet');
  await page.goto('/');
  await waitForPageStable(page);
  
  await takeFullPageScreenshot(page, 'example-tablet.png');
});

/**
 * Example 9: Dark mode specific
 */
test('Example: Dark mode only', async ({ page }) => {
  await page.goto('/');
  await waitForPageStable(page);
  
  await switchToDarkMode(page);
  await takeFullPageScreenshot(page, 'example-dark-only.png');
});

/**
 * Example 10: Arabic/RTL specific
 */
test('Example: Arabic language only', async ({ page }) => {
  await page.goto('/');
  await waitForPageStable(page);
  
  await switchLanguage(page, 'ar');
  await takeFullPageScreenshot(page, 'example-arabic-only.png');
});

/**
 * Example 11: Wait for images
 */
test('Example: Ensure images loaded', async ({ page }) => {
  await page.goto('/menu');
  await waitForPageStable(page);
  await waitForImages(page);
  
  await takeFullPageScreenshot(page, 'example-images-loaded.png');
});

/**
 * Example 12: Wait for fonts
 */
test('Example: Ensure fonts loaded', async ({ page }) => {
  await page.goto('/');
  await waitForPageStable(page);
  await waitForFonts(page);
  
  await takeFullPageScreenshot(page, 'example-fonts-loaded.png');
});

/**
 * Example 13: Custom threshold
 */
test('Example: Custom threshold', async ({ page }) => {
  await page.goto('/');
  await waitForPageStable(page);
  
  await expect(page).toHaveScreenshot('example-custom-threshold.png', {
    fullPage: true,
    animations: 'disabled',
    threshold: 0.3, // Higher threshold = more tolerant to differences
    maxDiffPixelRatio: 0.02,
  });
});

/**
 * Example 14: Specific element with custom options
 */
test('Example: Element with options', async ({ page }) => {
  await page.goto('/pricing');
  await waitForPageStable(page);
  
  const pricingCard = page.locator('[class*="pricing"]').first();
  
  await expect(pricingCard).toHaveScreenshot('example-pricing-card.png', {
    animations: 'disabled',
    threshold: 0.2,
  });
});

/**
 * Example 15: Scroll to element
 */
test('Example: Scroll and screenshot', async ({ page }) => {
  await page.goto('/');
  await waitForPageStable(page);
  
  // Scroll to features section
  const featuresSection = page.locator('[class*="feature"]').first();
  await featuresSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  
  await takeComponentScreenshot(featuresSection, 'example-features.png');
});

/**
 * Example 16: Multiple screenshots in one test
 */
test('Example: Multiple screenshots', async ({ page }) => {
  await page.goto('/');
  await waitForPageStable(page);
  
  // Screenshot 1: Full page
  await takeFullPageScreenshot(page, 'example-multi-1-full.png');
  
  // Screenshot 2: Header
  const header = page.locator('header').first();
  await takeComponentScreenshot(header, 'example-multi-2-header.png');
  
  // Screenshot 3: Footer
  const footer = page.locator('footer').first();
  await takeComponentScreenshot(footer, 'example-multi-3-footer.png');
});

/**
 * Example 17: Before and after interaction
 */
test('Example: Before and after', async ({ page }) => {
  await page.goto('/menu');
  await waitForPageStable(page);
  
  // Before
  await takeFullPageScreenshot(page, 'example-before.png');
  
  // Interact (e.g., search)
  const searchInput = page.locator('input[type="search"]').first();
  if (await searchInput.isVisible()) {
    await searchInput.fill('pizza');
    await page.waitForTimeout(500);
  }
  
  // After
  await takeFullPageScreenshot(page, 'example-after.png');
});

/**
 * Example 18: Conditional screenshot
 */
test('Example: Conditional screenshot', async ({ page }) => {
  await page.goto('/');
  await waitForPageStable(page);
  
  // Only screenshot if element exists
  const modal = page.locator('[role="dialog"]').first();
  if (await modal.isVisible()) {
    await takeComponentScreenshot(modal, 'example-modal.png');
  }
});

/**
 * Example 19: Mobile landscape
 */
test('Example: Mobile landscape', async ({ page }) => {
  await page.setViewportSize({ width: 667, height: 375 });
  await page.goto('/');
  await waitForPageStable(page);
  
  await takeFullPageScreenshot(page, 'example-mobile-landscape.png');
});

/**
 * Example 20: Print media emulation
 */
test('Example: Print preview', async ({ page }) => {
  await page.goto('/guide');
  await waitForPageStable(page);
  
  await page.emulateMedia({ media: 'print' });
  await page.waitForTimeout(500);
  
  await takeFullPageScreenshot(page, 'example-print.png');
});
