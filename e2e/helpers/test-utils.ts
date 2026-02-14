import { Page, expect } from '@playwright/test';

/**
 * Common test utilities for E2E tests
 */

/**
 * Wait for page to be fully loaded
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Login helper for authenticated tests
 */
export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await waitForPageLoad(page);
  
  // Fill login form
  const emailInput = page.getByLabel(/email|البريد الإلكتروني/i).or(
    page.getByPlaceholder(/email|البريد الإلكتروني/i)
  );
  await emailInput.fill(email);
  
  const passwordInput = page.getByLabel(/password|كلمة المرور/i).or(
    page.getByPlaceholder(/password|كلمة المرور/i)
  );
  await passwordInput.fill(password);
  
  // Submit form
  const submitButton = page.getByRole('button', { name: /login|sign in|تسجيل الدخول/i });
  await submitButton.click();
  
  // Wait for navigation
  await page.waitForURL(/.*dashboard|menu/, { timeout: 10000 });
}

/**
 * Logout helper
 */
export async function logout(page: Page) {
  // Find logout button (usually in header or menu)
  const logoutButton = page.getByRole('button', { name: /logout|sign out|تسجيل الخروج/i }).or(
    page.getByRole('link', { name: /logout|sign out|تسجيل الخروج/i })
  );
  
  if (await logoutButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await logoutButton.click();
    await page.waitForURL(/.*login|home/, { timeout: 5000 });
  }
}

/**
 * Add item to cart helper
 */
export async function addItemToCart(page: Page) {
  // Click on first dish
  const firstDish = page.locator('[data-testid*="dish"]').or(
    page.locator('[class*="dish-card"]')
  ).first();
  
  await firstDish.click();
  await page.waitForTimeout(1000);
  
  // Click add to cart
  const addToCartButton = page.getByRole('button', { name: /add to cart|أضف إلى السلة/i });
  
  if (await addToCartButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await addToCartButton.click();
    await page.waitForTimeout(1000);
  }
}

/**
 * Open cart helper
 */
export async function openCart(page: Page) {
  const cartButton = page.getByRole('button', { name: /cart|السلة/i }).or(
    page.locator('[data-testid*="cart"]')
  );
  
  if (await cartButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await cartButton.click();
    await page.waitForTimeout(1000);
  }
}

/**
 * Change language helper
 */
export async function changeLanguage(page: Page, language: 'en' | 'ar') {
  const languageSelector = page.getByRole('button', { name: /language|اللغة/i }).or(
    page.locator('[aria-label*="language"]')
  );
  
  if (await languageSelector.isVisible({ timeout: 5000 }).catch(() => false)) {
    await languageSelector.click();
    
    // Select language option
    const languageOption = page.getByRole('menuitem', { name: language === 'en' ? /english/i : /arabic|عربي/i }).or(
      page.locator(`[data-value="${language}"]`)
    );
    
    if (await languageOption.isVisible({ timeout: 3000 }).catch(() => false)) {
      await languageOption.click();
      await page.waitForTimeout(500);
    }
  }
}

/**
 * Toggle theme helper
 */
export async function toggleTheme(page: Page) {
  const themeToggle = page.getByRole('button', { name: /theme|السمة/i }).or(
    page.locator('[aria-label*="theme"]')
  );
  
  if (await themeToggle.isVisible({ timeout: 5000 }).catch(() => false)) {
    await themeToggle.click();
    await page.waitForTimeout(300);
  }
}

/**
 * Check if element is visible with timeout
 */
export async function isVisible(page: Page, selector: string, timeout = 5000): Promise<boolean> {
  try {
    await page.locator(selector).waitFor({ state: 'visible', timeout });
    return true;
  } catch {
    return false;
  }
}

/**
 * Scroll to element
 */
export async function scrollToElement(page: Page, selector: string) {
  const element = page.locator(selector);
  if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
    await element.scrollIntoViewIfNeeded();
  }
}

/**
 * Take screenshot with name
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
}

/**
 * Wait for API response
 */
export async function waitForAPIResponse(page: Page, urlPattern: string | RegExp, timeout = 10000) {
  return await page.waitForResponse(
    (response) => {
      const url = response.url();
      if (typeof urlPattern === 'string') {
        return url.includes(urlPattern);
      }
      return urlPattern.test(url);
    },
    { timeout }
  );
}

/**
 * Mock API response
 */
export async function mockAPIResponse(page: Page, urlPattern: string | RegExp, response: any) {
  await page.route(urlPattern, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

/**
 * Fill form helper
 */
export async function fillForm(page: Page, formData: Record<string, string>) {
  for (const [label, value] of Object.entries(formData)) {
    const input = page.getByLabel(new RegExp(label, 'i')).or(
      page.getByPlaceholder(new RegExp(label, 'i'))
    );
    
    if (await input.isVisible({ timeout: 3000 }).catch(() => false)) {
      await input.fill(value);
    }
  }
}

/**
 * Check for error message
 */
export async function expectErrorMessage(page: Page, message?: string) {
  const errorLocator = message
    ? page.locator(`text=/${message}/i`)
    : page.locator('text=/error|خطأ|invalid|غير صالح/i');
  
  await expect(errorLocator.first()).toBeVisible({ timeout: 5000 });
}

/**
 * Check for success message
 */
export async function expectSuccessMessage(page: Page, message?: string) {
  const successLocator = message
    ? page.locator(`text=/${message}/i`)
    : page.locator('text=/success|نجح|completed|تم/i');
  
  await expect(successLocator.first()).toBeVisible({ timeout: 5000 });
}

/**
 * Wait for navigation
 */
export async function waitForNavigation(page: Page, urlPattern: string | RegExp, timeout = 5000) {
  await page.waitForURL(urlPattern, { timeout });
}

/**
 * Check accessibility
 */
export async function checkAccessibility(page: Page) {
  // Check for basic accessibility attributes
  const mainContent = page.locator('main').or(page.locator('[role="main"]'));
  await expect(mainContent).toBeVisible({ timeout: 5000 });
  
  // Check for skip link
  const skipLink = page.locator('a[href="#main-content"]').or(
    page.locator('text=/skip to content/i')
  );
  
  // Skip link is optional but good to have
  if (await skipLink.isVisible({ timeout: 2000 }).catch(() => false)) {
    await expect(skipLink).toBeVisible();
  }
}
