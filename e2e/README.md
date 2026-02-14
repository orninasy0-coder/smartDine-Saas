# E2E Testing with Playwright

This directory contains end-to-end (E2E) tests for the SmartDine SaaS platform using Playwright.

## Overview

Playwright is a modern E2E testing framework that provides:
- Cross-browser testing (Chromium, Firefox, WebKit)
- Mobile device emulation
- Auto-waiting for elements
- Network interception
- Screenshot and video recording
- Parallel test execution

## Test Structure

```
e2e/
├── landing.spec.ts          # Landing page tests
├── auth.spec.ts             # Authentication flow tests
├── menu.spec.ts             # Menu browsing and ordering tests
├── pricing.spec.ts          # Pricing page tests
├── dashboard.spec.ts        # Dashboard tests (Kitchen, Owner, Admin)
├── ai-assistant.spec.ts     # AI assistant tests
├── accessibility.spec.ts    # Accessibility tests
├── helpers/
│   └── test-utils.ts        # Common test utilities
└── README.md                # This file
```

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests with UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:e2e:headed
```

### Run tests in debug mode
```bash
npm run test:e2e:debug
```

### Run tests for specific browser
```bash
npm run test:e2e:chromium
npm run test:e2e:firefox
npm run test:e2e:webkit
```

### Run mobile tests only
```bash
npm run test:e2e:mobile
```

### View test report
```bash
npm run test:e2e:report
```

## Test Configuration

The Playwright configuration is in `playwright.config.ts` at the root of the project.

Key configuration options:
- **testDir**: `./e2e` - Location of test files
- **baseURL**: `http://localhost:5173` - Base URL for tests
- **webServer**: Automatically starts dev server before tests
- **projects**: Configured for multiple browsers and devices
- **reporter**: HTML, JSON, and list reporters

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/path');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    const element = page.getByRole('button', { name: /click me/i });
    
    // Act
    await element.click();
    
    // Assert
    await expect(page).toHaveURL(/.*success/);
  });
});
```

### Using Test Utilities

```typescript
import { login, addItemToCart, openCart } from './helpers/test-utils';

test('should complete checkout', async ({ page }) => {
  // Login
  await login(page, 'user@example.com', 'password');
  
  // Add item to cart
  await page.goto('/menu/restaurant-1');
  await addItemToCart(page);
  
  // Open cart and checkout
  await openCart(page);
  // ... rest of test
});
```

## Best Practices

### 1. Use Semantic Locators
Prefer role-based and accessible locators:
```typescript
// Good
page.getByRole('button', { name: /submit/i })
page.getByLabel(/email/i)
page.getByPlaceholder(/search/i)

// Avoid
page.locator('#submit-btn')
page.locator('.button-class')
```

### 2. Wait for Network Idle
```typescript
await page.waitForLoadState('networkidle');
```

### 3. Handle Bilingual Content
Use regex with case-insensitive flag for English/Arabic:
```typescript
page.getByRole('button', { name: /login|تسجيل الدخول/i })
```

### 4. Use Auto-Waiting
Playwright automatically waits for elements to be actionable:
```typescript
// No need for manual waits
await page.getByRole('button').click();
```

### 5. Handle Optional Elements
```typescript
if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
  await element.click();
}
```

### 6. Test Isolation
Each test should be independent and not rely on other tests:
```typescript
test.beforeEach(async ({ page }) => {
  // Reset state before each test
  await page.goto('/');
});
```

## Debugging Tests

### 1. Use Playwright Inspector
```bash
npm run test:e2e:debug
```

### 2. Add Breakpoints
```typescript
await page.pause(); // Pauses test execution
```

### 3. Take Screenshots
```typescript
await page.screenshot({ path: 'screenshot.png' });
```

### 4. View Trace
```typescript
// Traces are automatically recorded on first retry
// View with: npx playwright show-trace trace.zip
```

## CI/CD Integration

Tests are configured to run in CI with:
- Retry on failure (2 retries)
- Single worker (no parallel execution)
- HTML and JSON reports
- Screenshots and videos on failure

## Accessibility Testing

The `accessibility.spec.ts` file includes tests for:
- Keyboard navigation
- ARIA attributes
- Color contrast
- Screen reader support
- Focus management
- Responsive design

## Mobile Testing

Mobile tests run on:
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

Test mobile-specific features:
```typescript
test('should work on mobile', async ({ page, isMobile }) => {
  if (isMobile) {
    // Mobile-specific test logic
  }
});
```

## Network Mocking

Mock API responses for testing:
```typescript
import { mockAPIResponse } from './helpers/test-utils';

test('should handle API error', async ({ page }) => {
  await mockAPIResponse(page, /api\/menu/, { error: 'Not found' });
  await page.goto('/menu/restaurant-1');
  // Test error handling
});
```

## Test Coverage

E2E tests cover:
- ✅ Landing page and navigation
- ✅ Authentication (login, register, protected routes)
- ✅ Menu browsing and filtering
- ✅ Shopping cart operations
- ✅ AR viewer functionality
- ✅ Pricing page and plan selection
- ✅ Dashboard features (Kitchen, Owner, Admin)
- ✅ AI assistant interactions
- ✅ Accessibility compliance
- ✅ Responsive design
- ✅ Bilingual support (EN/AR)
- ✅ Theme switching (dark/light mode)

## Troubleshooting

### Tests Failing Locally
1. Ensure dev server is running: `npm run dev`
2. Clear browser cache: `npx playwright clean`
3. Update browsers: `npx playwright install`

### Timeout Errors
Increase timeout in test:
```typescript
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ... test code
});
```

### Flaky Tests
- Add explicit waits: `await page.waitForLoadState('networkidle')`
- Use `waitFor` with conditions
- Increase timeout for specific actions

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Accessibility Testing Guide](https://playwright.dev/docs/accessibility-testing)
