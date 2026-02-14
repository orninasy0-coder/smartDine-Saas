import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Automated Accessibility Tests using axe-core
 * 
 * These tests automatically scan pages for WCAG 2.1 Level A and AA violations
 * including:
 * - Color contrast issues
 * - Missing ARIA labels
 * - Keyboard navigation problems
 * - Form accessibility issues
 * - Semantic HTML violations
 * - Focus management issues
 */

test.describe('Automated Accessibility Tests - Public Pages', () => {
  test('Landing page should have no accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Pricing page should have no accessibility violations', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Contact page should have no accessibility violations', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('User guide page should have no accessibility violations', async ({ page }) => {
    await page.goto('/guide');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Automated Accessibility Tests - Authentication', () => {
  test('Login page should have no accessibility violations', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Register page should have no accessibility violations', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Password reset page should have no accessibility violations', async ({ page }) => {
    await page.goto('/reset-password');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Automated Accessibility Tests - Menu & Ordering', () => {
  test('Menu page should have no accessibility violations', async ({ page }) => {
    await page.goto('/menu/restaurant-1');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Cart page should have no accessibility violations', async ({ page }) => {
    await page.goto('/cart');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Automated Accessibility Tests - Dashboards', () => {
  test('Kitchen dashboard should have no accessibility violations', async ({ page }) => {
    // Note: This test assumes you can access the kitchen dashboard
    // You may need to add authentication or mock data
    await page.goto('/kitchen');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Delivery dashboard should have no accessibility violations', async ({ page }) => {
    await page.goto('/delivery');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Restaurant owner dashboard should have no accessibility violations', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Automated Accessibility Tests - Dark Mode', () => {
  test('Landing page in dark mode should have no accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Toggle to dark mode
    const html = page.locator('html');
    await html.evaluate((el) => el.classList.add('dark'));
    await page.waitForTimeout(300);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Menu page in dark mode should have no accessibility violations', async ({ page }) => {
    await page.goto('/menu/restaurant-1');
    await page.waitForLoadState('networkidle');

    // Toggle to dark mode
    const html = page.locator('html');
    await html.evaluate((el) => el.classList.add('dark'));
    await page.waitForTimeout(300);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Automated Accessibility Tests - Specific Components', () => {
  test('Modal dialogs should have no accessibility violations', async ({ page }) => {
    await page.goto('/menu/restaurant-1');
    await page.waitForLoadState('networkidle');

    // Try to open a modal
    const firstDish = page.locator('[data-testid*="dish"]').or(
      page.locator('[class*="dish-card"]')
    ).first();

    if (await firstDish.isVisible({ timeout: 5000 }).catch(() => false)) {
      await firstDish.click();
      await page.waitForTimeout(1000);

      // Scan the modal
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('[role="dialog"]')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });

  test('Forms should have no accessibility violations', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Scan the form
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('form')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Navigation should have no accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scan the navigation
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('nav')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Automated Accessibility Tests - Mobile Viewports', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('Landing page on mobile should have no accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Menu page on mobile should have no accessibility violations', async ({ page }) => {
    await page.goto('/menu/restaurant-1');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Automated Accessibility Tests - RTL Support', () => {
  test('Landing page in Arabic (RTL) should have no accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Switch to Arabic if language selector exists
    const langSelector = page.getByRole('button', { name: /language|اللغة/i }).or(
      page.locator('[aria-label*="language"]')
    );

    if (await langSelector.isVisible({ timeout: 3000 }).catch(() => false)) {
      await langSelector.click();
      await page.waitForTimeout(300);

      // Click Arabic option
      const arabicOption = page.getByText(/العربية|Arabic/i);
      if (await arabicOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await arabicOption.click();
        await page.waitForTimeout(500);
      }
    }

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Automated Accessibility Tests - Best Practices', () => {
  test('Landing page should follow accessibility best practices', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['best-practice'])
      .analyze();

    // Best practices are recommendations, not strict requirements
    // Log violations but don't fail the test
    if (accessibilityScanResults.violations.length > 0) {
      console.log('Best practice violations found:', 
        accessibilityScanResults.violations.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.length
        }))
      );
    }

    // We can be more lenient with best practices
    expect(accessibilityScanResults.violations.length).toBeLessThan(10);
  });
});
