# E2E Testing Guide - SmartDine SaaS Platform

## Overview

This guide provides comprehensive information about end-to-end (E2E) testing for the SmartDine SaaS platform using Playwright.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Test Structure](#test-structure)
3. [Running Tests](#running-tests)
4. [Writing Tests](#writing-tests)
5. [Best Practices](#best-practices)
6. [Debugging](#debugging)
7. [CI/CD Integration](#cicd-integration)
8. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Project dependencies installed (`npm install`)
- Playwright browsers installed (`npx playwright install`)

### Installation

Playwright is already configured in this project. To install browsers:

```bash
npx playwright install
```

To install specific browsers:

```bash
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

## Test Structure

### Directory Layout

```
e2e/
├── landing.spec.ts          # Landing page tests
├── auth.spec.ts             # Authentication tests
├── menu.spec.ts             # Menu and ordering tests
├── pricing.spec.ts          # Pricing page tests
├── dashboard.spec.ts        # Dashboard tests
├── ai-assistant.spec.ts     # AI assistant tests
├── accessibility.spec.ts    # Accessibility tests
├── user-journey.spec.ts     # Complete user journeys
├── helpers/
│   └── test-utils.ts        # Shared utilities
└── README.md
```

### Test Categories

1. **Functional Tests**: Core functionality (auth, menu, cart, etc.)
2. **Accessibility Tests**: WCAG compliance, keyboard navigation, ARIA
3. **User Journey Tests**: End-to-end user flows
4. **Responsive Tests**: Mobile and tablet layouts
5. **Internationalization Tests**: Multi-language support

## Running Tests

### Basic Commands

```bash
# Run all tests
npm run test:e2e

# Run with UI mode (recommended for development)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run in debug mode
npm run test:e2e:debug
```

### Browser-Specific Tests

```bash
# Run on Chromium only
npm run test:e2e:chromium

# Run on Firefox only
npm run test:e2e:firefox

# Run on WebKit only
npm run test:e2e:webkit

# Run on mobile browsers
npm run test:e2e:mobile
```

### Specific Test Files

```bash
# Run specific test file
npx playwright test e2e/landing.spec.ts

# Run specific test by name
npx playwright test -g "should display hero section"

# Run tests in specific project
npx playwright test --project=chromium
```

### View Reports

```bash
# Open HTML report
npm run test:e2e:report

# Or manually
npx playwright show-report
```

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/path');
    await page.waitForLoadState('networkidle');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    const button = page.getByRole('button', { name: /click me/i });
    
    // Act
    await button.click();
    
    // Assert
    await expect(page).toHaveURL(/.*success/);
  });
});
```

### Locator Strategies

#### 1. Role-Based Locators (Preferred)

```typescript
// Buttons
page.getByRole('button', { name: /submit/i })

// Links
page.getByRole('link', { name: /home/i })

// Headings
page.getByRole('heading', { level: 1 })

// Text inputs
page.getByRole('textbox', { name: /email/i })
```

#### 2. Label-Based Locators

```typescript
// By label text
page.getByLabel(/email|البريد الإلكتروني/i)

// By placeholder
page.getByPlaceholder(/search|بحث/i)
```

#### 3. Test ID Locators (When Necessary)

```typescript
page.locator('[data-testid="dish-card"]')
```

#### 4. CSS/XPath Locators (Last Resort)

```typescript
page.locator('.dish-card')
page.locator('//button[@type="submit"]')
```

### Handling Bilingual Content

Since SmartDine supports English and Arabic, use regex patterns:

```typescript
// Match both English and Arabic
page.getByRole('button', { name: /login|تسجيل الدخول/i })
page.getByLabel(/email|البريد الإلكتروني/i)
page.locator('text=/cart|السلة/i')
```

### Waiting Strategies

#### Auto-Waiting (Built-in)

Playwright automatically waits for elements to be actionable:

```typescript
// No manual wait needed
await page.getByRole('button').click();
```

#### Explicit Waits

```typescript
// Wait for load state
await page.waitForLoadState('networkidle');
await page.waitForLoadState('domcontentloaded');

// Wait for URL
await page.waitForURL(/.*dashboard/);

// Wait for selector
await page.waitForSelector('[data-testid="menu"]');

// Wait for timeout (use sparingly)
await page.waitForTimeout(1000);
```

### Handling Optional Elements

```typescript
// Check if element exists before interacting
if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
  await element.click();
}

// Or use conditional logic
const isVisible = await page.locator('.modal').isVisible({ timeout: 2000 }).catch(() => false);
if (isVisible) {
  // Handle modal
}
```

### Using Test Utilities

```typescript
import { login, addItemToCart, openCart } from './helpers/test-utils';

test('should checkout', async ({ page }) => {
  await login(page, 'user@example.com', 'password');
  await page.goto('/menu/restaurant-1');
  await addItemToCart(page);
  await openCart(page);
  // Continue with checkout
});
```

## Best Practices

### 1. Test Independence

Each test should be independent and not rely on other tests:

```typescript
test.beforeEach(async ({ page }) => {
  // Reset state before each test
  await page.goto('/');
});
```

### 2. Use Semantic Locators

Prefer accessible locators that reflect how users interact:

```typescript
// Good
page.getByRole('button', { name: /submit/i })
page.getByLabel(/email/i)

// Avoid
page.locator('#submit-btn')
page.locator('.button-class')
```

### 3. Avoid Hard-Coded Waits

Use Playwright's auto-waiting instead of `waitForTimeout`:

```typescript
// Good
await page.waitForLoadState('networkidle');
await page.waitForSelector('[data-testid="content"]');

// Avoid
await page.waitForTimeout(5000);
```

### 4. Test User Behavior, Not Implementation

Focus on what users see and do:

```typescript
// Good
await page.getByRole('button', { name: /add to cart/i }).click();
await expect(page.locator('text=/item added/i')).toBeVisible();

// Avoid
await page.locator('.cart-button').click();
await expect(page.locator('.cart-count')).toHaveText('1');
```

### 5. Handle Flaky Tests

Make tests more reliable:

```typescript
// Wait for network idle
await page.waitForLoadState('networkidle');

// Use explicit waits for dynamic content
await page.waitForSelector('[data-testid="loaded"]');

// Increase timeout for slow operations
await expect(element).toBeVisible({ timeout: 10000 });
```

### 6. Group Related Tests

Use `test.describe` to organize tests:

```typescript
test.describe('Authentication', () => {
  test.describe('Login', () => {
    // Login tests
  });
  
  test.describe('Register', () => {
    // Register tests
  });
});
```

### 7. Use Page Object Model (Optional)

For complex pages, consider using page objects:

```typescript
class LoginPage {
  constructor(private page: Page) {}
  
  async login(email: string, password: string) {
    await this.page.getByLabel(/email/i).fill(email);
    await this.page.getByLabel(/password/i).fill(password);
    await this.page.getByRole('button', { name: /login/i }).click();
  }
}
```

## Debugging

### 1. Playwright Inspector

```bash
npm run test:e2e:debug
```

Features:
- Step through tests
- Inspect locators
- View console logs
- Take screenshots

### 2. Pause Test Execution

```typescript
await page.pause(); // Opens Playwright Inspector
```

### 3. Screenshots

```typescript
// Take screenshot
await page.screenshot({ path: 'screenshot.png' });

// Full page screenshot
await page.screenshot({ path: 'screenshot.png', fullPage: true });
```

### 4. Console Logs

```typescript
// Listen to console messages
page.on('console', msg => console.log(msg.text()));

// Listen to page errors
page.on('pageerror', error => console.log(error.message));
```

### 5. Trace Viewer

Traces are automatically recorded on first retry. View with:

```bash
npx playwright show-trace trace.zip
```

### 6. Headed Mode

See the browser while tests run:

```bash
npm run test:e2e:headed
```

### 7. Slow Motion

Slow down test execution:

```typescript
test.use({ launchOptions: { slowMo: 1000 } });
```

## CI/CD Integration

### GitHub Actions

The project includes a GitHub Actions workflow (`.github/workflows/e2e-tests.yml`) that:

- Runs tests on push and pull requests
- Tests across multiple browsers
- Uploads test reports and videos
- Retries failed tests

### Running in CI

Tests are configured for CI with:

```typescript
// playwright.config.ts
forbidOnly: !!process.env.CI,
retries: process.env.CI ? 2 : 0,
workers: process.env.CI ? 1 : undefined,
```

### Environment Variables

Set in CI:

```bash
CI=true
VITE_E2E_BASE_URL=http://localhost:5173
```

## Troubleshooting

### Tests Failing Locally

1. **Ensure dev server is running**
   ```bash
   npm run dev
   ```

2. **Clear browser cache**
   ```bash
   npx playwright clean
   ```

3. **Update browsers**
   ```bash
   npx playwright install
   ```

4. **Check for port conflicts**
   - Default port is 5173
   - Change in `playwright.config.ts` if needed

### Timeout Errors

Increase timeout for specific tests:

```typescript
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ... test code
});
```

Or globally in config:

```typescript
// playwright.config.ts
use: {
  actionTimeout: 10000,
},
```

### Flaky Tests

1. **Add explicit waits**
   ```typescript
   await page.waitForLoadState('networkidle');
   ```

2. **Increase timeout**
   ```typescript
   await expect(element).toBeVisible({ timeout: 10000 });
   ```

3. **Use retry logic**
   ```typescript
   // playwright.config.ts
   retries: 2,
   ```

### Element Not Found

1. **Check locator**
   ```bash
   npx playwright codegen http://localhost:5173
   ```

2. **Wait for element**
   ```typescript
   await page.waitForSelector('[data-testid="element"]');
   ```

3. **Check for dynamic content**
   ```typescript
   await page.waitForLoadState('networkidle');
   ```

### Browser Not Launching

1. **Install dependencies**
   ```bash
   npx playwright install-deps
   ```

2. **Check system requirements**
   - Ensure sufficient disk space
   - Check for antivirus interference

## Performance Tips

1. **Use parallel execution**
   ```typescript
   // playwright.config.ts
   fullyParallel: true,
   workers: 4,
   ```

2. **Reuse browser contexts**
   ```typescript
   test.use({ storageState: 'auth.json' });
   ```

3. **Skip unnecessary waits**
   ```typescript
   // Don't wait for fonts, images, etc. if not needed
   await page.goto('/', { waitUntil: 'domcontentloaded' });
   ```

4. **Use test fixtures**
   ```typescript
   const test = base.extend({
     authenticatedPage: async ({ page }, use) => {
       await login(page);
       await use(page);
     },
   });
   ```

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Testing Library Principles](https://testing-library.com/docs/guiding-principles/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Contributing

When adding new E2E tests:

1. Follow the existing test structure
2. Use semantic locators
3. Handle bilingual content (EN/AR)
4. Add tests to appropriate spec file
5. Update this guide if needed
6. Ensure tests pass locally before committing

## Support

For issues or questions:

1. Check this guide
2. Review Playwright documentation
3. Check existing tests for examples
4. Ask the team
