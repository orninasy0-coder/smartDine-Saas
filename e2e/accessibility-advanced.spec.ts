import { test, expect } from '@playwright/test';
import {
  runAccessibilityScan,
  formatViolations,
  hasCriticalViolations,
  getViolationsByImpact,
  toggleDarkMode,
  switchLanguage,
  checkKeyboardNavigation,
  isFocusVisible,
  checkColorContrast,
  checkAriaAttributes,
  checkSemanticHTML,
  generateAccessibilityReport,
} from './helpers/accessibility-utils';

/**
 * Advanced Accessibility Tests
 * 
 * These tests use custom utilities to perform more detailed
 * accessibility checks beyond basic axe-core scans
 */

test.describe('Advanced Accessibility Tests - Critical Issues', () => {
  test('No pages should have critical accessibility violations', async ({ page }) => {
    const pages = [
      '/',
      '/pricing',
      '/contact',
      '/login',
      '/register',
      '/menu/restaurant-1',
      '/cart',
    ];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');

      const hasCritical = await hasCriticalViolations(page);
      
      if (hasCritical) {
        const criticalViolations = await getViolationsByImpact(page, 'critical');
        console.error(`Critical violations on ${pagePath}:`, formatViolations(criticalViolations));
      }

      expect(hasCritical).toBe(false);
    }
  });

  test('No pages should have serious accessibility violations', async ({ page }) => {
    const pages = [
      '/',
      '/pricing',
      '/login',
      '/menu/restaurant-1',
    ];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');

      const seriousViolations = await getViolationsByImpact(page, 'serious');
      
      if (seriousViolations.length > 0) {
        console.error(`Serious violations on ${pagePath}:`, formatViolations(seriousViolations));
      }

      expect(seriousViolations.length).toBe(0);
    }
  });
});

test.describe('Advanced Accessibility Tests - Color Contrast', () => {
  test('Landing page should have proper color contrast in light mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await toggleDarkMode(page, false);

    const contrastViolations = await checkColorContrast(page);
    
    if (contrastViolations.length > 0) {
      console.error('Contrast violations in light mode:', formatViolations(contrastViolations));
    }

    expect(contrastViolations.length).toBe(0);
  });

  test('Landing page should have proper color contrast in dark mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await toggleDarkMode(page, true);

    const contrastViolations = await checkColorContrast(page);
    
    if (contrastViolations.length > 0) {
      console.error('Contrast violations in dark mode:', formatViolations(contrastViolations));
    }

    expect(contrastViolations.length).toBe(0);
  });

  test('Menu page should have proper color contrast', async ({ page }) => {
    await page.goto('/menu/restaurant-1');
    await page.waitForLoadState('networkidle');

    const contrastViolations = await checkColorContrast(page);
    
    if (contrastViolations.length > 0) {
      console.error('Contrast violations on menu page:', formatViolations(contrastViolations));
    }

    expect(contrastViolations.length).toBe(0);
  });

  test('Forms should have proper color contrast', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    const contrastViolations = await checkColorContrast(page);
    
    if (contrastViolations.length > 0) {
      console.error('Contrast violations on login form:', formatViolations(contrastViolations));
    }

    expect(contrastViolations.length).toBe(0);
  });
});

test.describe('Advanced Accessibility Tests - ARIA Attributes', () => {
  test('Landing page should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const ariaViolations = await checkAriaAttributes(page);
    
    if (ariaViolations.length > 0) {
      console.error('ARIA violations on landing page:', formatViolations(ariaViolations));
    }

    expect(ariaViolations.length).toBe(0);
  });

  test('Menu page should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/menu/restaurant-1');
    await page.waitForLoadState('networkidle');

    const ariaViolations = await checkAriaAttributes(page);
    
    if (ariaViolations.length > 0) {
      console.error('ARIA violations on menu page:', formatViolations(ariaViolations));
    }

    expect(ariaViolations.length).toBe(0);
  });

  test('Forms should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    const ariaViolations = await checkAriaAttributes(page);
    
    if (ariaViolations.length > 0) {
      console.error('ARIA violations on login form:', formatViolations(ariaViolations));
    }

    expect(ariaViolations.length).toBe(0);
  });

  test('Dashboard should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const ariaViolations = await checkAriaAttributes(page);
    
    if (ariaViolations.length > 0) {
      console.error('ARIA violations on dashboard:', formatViolations(ariaViolations));
    }

    expect(ariaViolations.length).toBe(0);
  });
});

test.describe('Advanced Accessibility Tests - Semantic HTML', () => {
  test('Landing page should use semantic HTML', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const semanticViolations = await checkSemanticHTML(page);
    
    if (semanticViolations.length > 0) {
      console.log('Semantic HTML recommendations:', formatViolations(semanticViolations));
    }

    // Semantic HTML is a best practice, not a strict requirement
    // We allow some violations but log them for improvement
    expect(semanticViolations.length).toBeLessThan(5);
  });

  test('Menu page should use semantic HTML', async ({ page }) => {
    await page.goto('/menu/restaurant-1');
    await page.waitForLoadState('networkidle');

    const semanticViolations = await checkSemanticHTML(page);
    
    if (semanticViolations.length > 0) {
      console.log('Semantic HTML recommendations:', formatViolations(semanticViolations));
    }

    expect(semanticViolations.length).toBeLessThan(5);
  });
});

test.describe('Advanced Accessibility Tests - Keyboard Navigation', () => {
  test('Landing page should have visible focus indicators', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const focusVisible = await isFocusVisible(page);
    expect(focusVisible).toBe(true);
  });

  test('Menu page should have visible focus indicators', async ({ page }) => {
    await page.goto('/menu/restaurant-1');
    await page.waitForLoadState('networkidle');

    const focusVisible = await isFocusVisible(page);
    expect(focusVisible).toBe(true);
  });

  test('Landing page should have logical tab order', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const focusedElements = await checkKeyboardNavigation(page, 10);
    
    // Should have at least some focusable elements
    expect(focusedElements.length).toBeGreaterThan(0);
    
    // Log the tab order for manual review
    console.log('Tab order on landing page:', focusedElements);
  });

  test('Menu page should have logical tab order', async ({ page }) => {
    await page.goto('/menu/restaurant-1');
    await page.waitForLoadState('networkidle');

    const focusedElements = await checkKeyboardNavigation(page, 10);
    
    expect(focusedElements.length).toBeGreaterThan(0);
    console.log('Tab order on menu page:', focusedElements);
  });

  test('Forms should have logical tab order', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    const focusedElements = await checkKeyboardNavigation(page, 5);
    
    expect(focusedElements.length).toBeGreaterThan(0);
    console.log('Tab order on login form:', focusedElements);
  });
});

test.describe('Advanced Accessibility Tests - Multi-language Support', () => {
  test('Landing page in English should be accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await switchLanguage(page, 'en');

    const results = await runAccessibilityScan(page);
    expect(results.violations.length).toBe(0);
  });

  test('Landing page in Arabic should be accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await switchLanguage(page, 'ar');

    const results = await runAccessibilityScan(page);
    expect(results.violations.length).toBe(0);
  });

  test('Menu page in Arabic (RTL) should be accessible', async ({ page }) => {
    await page.goto('/menu/restaurant-1');
    await page.waitForLoadState('networkidle');

    await switchLanguage(page, 'ar');

    const results = await runAccessibilityScan(page);
    expect(results.violations.length).toBe(0);
  });
});

test.describe('Advanced Accessibility Tests - Component-Specific', () => {
  test('Navigation component should be accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await runAccessibilityScan(page, {
      include: 'nav',
    });

    if (results.violations.length > 0) {
      console.error('Navigation violations:', formatViolations(results.violations));
    }

    expect(results.violations.length).toBe(0);
  });

  test('Footer component should be accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await runAccessibilityScan(page, {
      include: 'footer',
    });

    if (results.violations.length > 0) {
      console.error('Footer violations:', formatViolations(results.violations));
    }

    expect(results.violations.length).toBe(0);
  });

  test('Form components should be accessible', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    const results = await runAccessibilityScan(page, {
      include: 'form',
    });

    if (results.violations.length > 0) {
      console.error('Form violations:', formatViolations(results.violations));
    }

    expect(results.violations.length).toBe(0);
  });

  test('Card components should be accessible', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');

    const results = await runAccessibilityScan(page, {
      include: '[class*="card"]',
    });

    if (results.violations.length > 0) {
      console.error('Card violations:', formatViolations(results.violations));
    }

    expect(results.violations.length).toBe(0);
  });
});

test.describe('Advanced Accessibility Tests - Reports', () => {
  test('Generate accessibility report for landing page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const report = await generateAccessibilityReport(page, 'Landing Page');
    console.log(report);

    // Report is for informational purposes
    expect(report).toContain('Accessibility Report');
  });

  test('Generate accessibility report for menu page', async ({ page }) => {
    await page.goto('/menu/restaurant-1');
    await page.waitForLoadState('networkidle');

    const report = await generateAccessibilityReport(page, 'Menu Page');
    console.log(report);

    expect(report).toContain('Accessibility Report');
  });

  test('Generate accessibility report for dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const report = await generateAccessibilityReport(page, 'Dashboard');
    console.log(report);

    expect(report).toContain('Accessibility Report');
  });
});

test.describe('Advanced Accessibility Tests - Responsive Design', () => {
  test('Landing page should be accessible on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await runAccessibilityScan(page);
    expect(results.violations.length).toBe(0);
  });

  test('Menu page should be accessible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/menu/restaurant-1');
    await page.waitForLoadState('networkidle');

    const results = await runAccessibilityScan(page);
    expect(results.violations.length).toBe(0);
  });

  test('Dashboard should be accessible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const results = await runAccessibilityScan(page);
    expect(results.violations.length).toBe(0);
  });
});
