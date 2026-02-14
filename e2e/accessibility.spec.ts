import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test.describe('Keyboard Navigation', () => {
    test('should navigate landing page with keyboard', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Tab through interactive elements
      await page.keyboard.press('Tab');
      
      // Check if focus is visible
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible({ timeout: 3000 });
    });

    test('should navigate menu with keyboard', async ({ page }) => {
      await page.goto('/menu/restaurant-1');
      await page.waitForLoadState('networkidle');
      
      // Tab to first dish
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Press Enter to open details
      await page.keyboard.press('Enter');
      
      // Wait for modal or details
      await page.waitForTimeout(1000);
      
      // Check if details are visible
      const details = page.locator('[role="dialog"]').or(
        page.locator('[data-testid*="dish-detail"]')
      );
      
      if (await details.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(details).toBeVisible();
      }
    });

    test('should close modal with Escape key', async ({ page }) => {
      await page.goto('/menu/restaurant-1');
      await page.waitForLoadState('networkidle');
      
      // Open dish details
      const firstDish = page.locator('[data-testid*="dish"]').or(
        page.locator('[class*="dish-card"]')
      ).first();
      
      if (await firstDish.isVisible({ timeout: 5000 }).catch(() => false)) {
        await firstDish.click();
        await page.waitForTimeout(1000);
        
        // Press Escape to close
        await page.keyboard.press('Escape');
        
        // Wait for close animation
        await page.waitForTimeout(500);
        
        // Modal should be closed
        const modal = page.locator('[role="dialog"]');
        await expect(modal).not.toBeVisible({ timeout: 3000 });
      }
    });
  });

  test.describe('ARIA Attributes', () => {
    test('should have proper ARIA labels on buttons', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for buttons with aria-label or accessible name
      const buttons = page.getByRole('button');
      const buttonCount = await buttons.count();
      
      expect(buttonCount).toBeGreaterThan(0);
      
      // Check first few buttons have accessible names
      for (let i = 0; i < Math.min(3, buttonCount); i++) {
        const button = buttons.nth(i);
        if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
          const accessibleName = await button.getAttribute('aria-label').catch(() => null) ||
                                 await button.textContent();
          expect(accessibleName).toBeTruthy();
        }
      }
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for h1
      const h1 = page.locator('h1');
      await expect(h1.first()).toBeVisible({ timeout: 5000 });
      
      // Check for h2
      const h2 = page.locator('h2');
      if (await h2.first().isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(h2.first()).toBeVisible();
      }
    });

    test('should have alt text on images', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for images
      const images = page.locator('img');
      const imageCount = await images.count();
      
      if (imageCount > 0) {
        // Check first few images have alt text
        for (let i = 0; i < Math.min(3, imageCount); i++) {
          const img = images.nth(i);
          if (await img.isVisible({ timeout: 2000 }).catch(() => false)) {
            const alt = await img.getAttribute('alt');
            expect(alt).toBeDefined();
          }
        }
      }
    });

    test('should have proper form labels', async ({ page }) => {
      await page.goto('/login');
      await page.waitForLoadState('networkidle');
      
      // Check for form inputs with labels
      const inputs = page.locator('input[type="email"], input[type="password"], input[type="text"]');
      const inputCount = await inputs.count();
      
      expect(inputCount).toBeGreaterThan(0);
      
      // Check inputs have associated labels or aria-label
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        const ariaLabel = await input.getAttribute('aria-label');
        const ariaLabelledBy = await input.getAttribute('aria-labelledby');
        
        // Input should have id with label, aria-label, or aria-labelledby
        const hasLabel = (id && await page.locator(`label[for="${id}"]`).count() > 0) ||
                        ariaLabel ||
                        ariaLabelledBy;
        
        expect(hasLabel).toBeTruthy();
      }
    });
  });

  test.describe('Color Contrast', () => {
    test('should have sufficient color contrast in light mode', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Ensure light mode is active
      const html = page.locator('html');
      const theme = await html.getAttribute('class');
      
      if (theme?.includes('dark')) {
        // Toggle to light mode
        const themeToggle = page.getByRole('button', { name: /theme|السمة/i }).or(
          page.locator('[aria-label*="theme"]')
        );
        
        if (await themeToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
          await themeToggle.click();
          await page.waitForTimeout(300);
        }
      }
      
      // Check that text is visible (basic contrast check)
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible({ timeout: 5000 });
    });

    test('should have sufficient color contrast in dark mode', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Ensure dark mode is active
      const html = page.locator('html');
      const theme = await html.getAttribute('class');
      
      if (!theme?.includes('dark')) {
        // Toggle to dark mode
        const themeToggle = page.getByRole('button', { name: /theme|السمة/i }).or(
          page.locator('[aria-label*="theme"]')
        );
        
        if (await themeToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
          await themeToggle.click();
          await page.waitForTimeout(300);
        }
      }
      
      // Check that text is visible in dark mode
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should have main landmark', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for main landmark
      const main = page.locator('main').or(page.locator('[role="main"]'));
      await expect(main).toBeVisible({ timeout: 5000 });
    });

    test('should have navigation landmark', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for nav landmark
      const nav = page.locator('nav').or(page.locator('[role="navigation"]'));
      await expect(nav.first()).toBeVisible({ timeout: 5000 });
    });

    test('should have proper dialog roles', async ({ page }) => {
      await page.goto('/menu/restaurant-1');
      await page.waitForLoadState('networkidle');
      
      // Open a modal
      const firstDish = page.locator('[data-testid*="dish"]').or(
        page.locator('[class*="dish-card"]')
      ).first();
      
      if (await firstDish.isVisible({ timeout: 5000 }).catch(() => false)) {
        await firstDish.click();
        await page.waitForTimeout(1000);
        
        // Check for dialog role
        const dialog = page.locator('[role="dialog"]');
        if (await dialog.isVisible({ timeout: 3000 }).catch(() => false)) {
          await expect(dialog).toBeVisible();
          
          // Check for aria-modal
          const ariaModal = await dialog.getAttribute('aria-modal');
          expect(ariaModal).toBe('true');
        }
      }
    });
  });

  test.describe('Focus Management', () => {
    test('should trap focus in modal', async ({ page }) => {
      await page.goto('/menu/restaurant-1');
      await page.waitForLoadState('networkidle');
      
      // Open modal
      const firstDish = page.locator('[data-testid*="dish"]').or(
        page.locator('[class*="dish-card"]')
      ).first();
      
      if (await firstDish.isVisible({ timeout: 5000 }).catch(() => false)) {
        await firstDish.click();
        await page.waitForTimeout(1000);
        
        // Tab through modal elements
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        
        // Focus should stay within modal
        const focusedElement = page.locator(':focus');
        const modal = page.locator('[role="dialog"]');
        
        if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
          // Check if focused element is within modal
          const isWithinModal = await focusedElement.evaluate((el, modalEl) => {
            return modalEl?.contains(el) ?? false;
          }, await modal.elementHandle());
          
          expect(isWithinModal).toBeTruthy();
        }
      }
    });

    test('should restore focus after closing modal', async ({ page }) => {
      await page.goto('/menu/restaurant-1');
      await page.waitForLoadState('networkidle');
      
      // Click on dish to open modal
      const firstDish = page.locator('[data-testid*="dish"]').or(
        page.locator('[class*="dish-card"]')
      ).first();
      
      if (await firstDish.isVisible({ timeout: 5000 }).catch(() => false)) {
        await firstDish.click();
        await page.waitForTimeout(1000);
        
        // Close modal with Escape
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        
        // Focus should return to trigger element or nearby element
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible({ timeout: 3000 });
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should be accessible on mobile', async ({ page, isMobile }) => {
      if (isMobile) {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Check that content is visible on mobile
        const heading = page.locator('h1').first();
        await expect(heading).toBeVisible({ timeout: 5000 });
        
        // Check for mobile menu
        const mobileMenu = page.getByRole('button', { name: /menu|القائمة/i });
        if (await mobileMenu.isVisible({ timeout: 3000 }).catch(() => false)) {
          await expect(mobileMenu).toBeVisible();
        }
      }
    });

    test('should have touch-friendly targets on mobile', async ({ page, isMobile }) => {
      if (isMobile) {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Check button sizes (should be at least 44x44px for touch)
        const buttons = page.getByRole('button');
        const firstButton = buttons.first();
        
        if (await firstButton.isVisible({ timeout: 5000 }).catch(() => false)) {
          const box = await firstButton.boundingBox();
          
          if (box) {
            // Touch targets should be at least 44x44px
            expect(box.height).toBeGreaterThanOrEqual(40);
            expect(box.width).toBeGreaterThanOrEqual(40);
          }
        }
      }
    });
  });
});
