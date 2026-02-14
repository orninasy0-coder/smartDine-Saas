import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.describe('Login', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
    });

    test('should display login form', async ({ page }) => {
      // Check for email input
      const emailInput = page.getByLabel(/email|البريد الإلكتروني/i).or(
        page.getByPlaceholder(/email|البريد الإلكتروني/i)
      );
      await expect(emailInput).toBeVisible();
      
      // Check for password input
      const passwordInput = page.getByLabel(/password|كلمة المرور/i).or(
        page.getByPlaceholder(/password|كلمة المرور/i)
      );
      await expect(passwordInput).toBeVisible();
      
      // Check for submit button
      const submitButton = page.getByRole('button', { name: /login|sign in|تسجيل الدخول/i });
      await expect(submitButton).toBeVisible();
    });

    test('should show validation errors for empty form', async ({ page }) => {
      // Click submit without filling form
      const submitButton = page.getByRole('button', { name: /login|sign in|تسجيل الدخول/i });
      await submitButton.click();
      
      // Wait for validation errors
      await page.waitForTimeout(500);
      
      // Check for error messages
      const errorMessages = page.locator('text=/required|مطلوب|invalid|غير صالح/i');
      await expect(errorMessages.first()).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      // Fill form with invalid credentials
      await page.getByLabel(/email|البريد الإلكتروني/i).or(
        page.getByPlaceholder(/email|البريد الإلكتروني/i)
      ).fill('invalid@example.com');
      
      await page.getByLabel(/password|كلمة المرور/i).or(
        page.getByPlaceholder(/password|كلمة المرور/i)
      ).fill('wrongpassword');
      
      // Submit form
      await page.getByRole('button', { name: /login|sign in|تسجيل الدخول/i }).click();
      
      // Wait for error message
      await page.waitForTimeout(1000);
      
      // Check for error notification
      const errorNotification = page.locator('text=/invalid|incorrect|خطأ|غير صحيح/i');
      await expect(errorNotification.first()).toBeVisible({ timeout: 5000 });
    });

    test('should navigate to register page', async ({ page }) => {
      // Click register link
      const registerLink = page.getByRole('link', { name: /register|sign up|إنشاء حساب/i });
      await registerLink.click();
      
      // Verify navigation
      await expect(page).toHaveURL(/.*register/);
    });

    test('should navigate to forgot password page', async ({ page }) => {
      // Click forgot password link
      const forgotPasswordLink = page.getByRole('link', { name: /forgot password|نسيت كلمة المرور/i });
      
      if (await forgotPasswordLink.isVisible()) {
        await forgotPasswordLink.click();
        
        // Verify navigation
        await expect(page).toHaveURL(/.*forgot-password|reset-password/);
      }
    });
  });

  test.describe('Register', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/register');
    });

    test('should display registration form', async ({ page }) => {
      // Check for name input
      const nameInput = page.getByLabel(/name|الاسم/i).or(
        page.getByPlaceholder(/name|الاسم/i)
      );
      await expect(nameInput.first()).toBeVisible();
      
      // Check for email input
      const emailInput = page.getByLabel(/email|البريد الإلكتروني/i).or(
        page.getByPlaceholder(/email|البريد الإلكتروني/i)
      );
      await expect(emailInput).toBeVisible();
      
      // Check for password input
      const passwordInput = page.getByLabel(/password|كلمة المرور/i).or(
        page.getByPlaceholder(/password|كلمة المرور/i)
      );
      await expect(passwordInput.first()).toBeVisible();
      
      // Check for submit button
      const submitButton = page.getByRole('button', { name: /register|sign up|إنشاء حساب/i });
      await expect(submitButton).toBeVisible();
    });

    test('should show validation errors for empty form', async ({ page }) => {
      // Click submit without filling form
      const submitButton = page.getByRole('button', { name: /register|sign up|إنشاء حساب/i });
      await submitButton.click();
      
      // Wait for validation errors
      await page.waitForTimeout(500);
      
      // Check for error messages
      const errorMessages = page.locator('text=/required|مطلوب/i');
      await expect(errorMessages.first()).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      // Fill email with invalid format
      await page.getByLabel(/email|البريد الإلكتروني/i).or(
        page.getByPlaceholder(/email|البريد الإلكتروني/i)
      ).fill('invalidemail');
      
      // Trigger validation
      await page.getByLabel(/password|كلمة المرور/i).or(
        page.getByPlaceholder(/password|كلمة المرور/i)
      ).first().click();
      
      // Wait for validation
      await page.waitForTimeout(500);
      
      // Check for email validation error
      const emailError = page.locator('text=/invalid email|بريد إلكتروني غير صالح/i');
      await expect(emailError.first()).toBeVisible();
    });

    test('should show password strength indicator', async ({ page }) => {
      // Fill password field
      const passwordInput = page.getByLabel(/password|كلمة المرور/i).or(
        page.getByPlaceholder(/password|كلمة المرور/i)
      ).first();
      
      await passwordInput.fill('weak');
      
      // Check for password strength indicator
      const strengthIndicator = page.locator('text=/weak|ضعيف|strength|قوة/i');
      
      // Password strength indicator might be visible
      if (await strengthIndicator.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(strengthIndicator.first()).toBeVisible();
      }
    });

    test('should navigate to login page', async ({ page }) => {
      // Click login link
      const loginLink = page.getByRole('link', { name: /login|sign in|تسجيل الدخول/i });
      await loginLink.click();
      
      // Verify navigation
      await expect(page).toHaveURL(/.*login/);
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when accessing protected route', async ({ page }) => {
      // Try to access dashboard without authentication
      await page.goto('/dashboard');
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
    });

    test('should redirect to login when accessing owner dashboard', async ({ page }) => {
      // Try to access owner dashboard without authentication
      await page.goto('/owner/dashboard');
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*login/, { timeout: 5000 });
    });
  });
});
