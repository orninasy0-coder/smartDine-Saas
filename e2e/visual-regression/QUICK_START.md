# Visual Regression Testing - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Run Your First Test

```bash
# Start the dev server (in one terminal)
npm run dev

# Run visual regression tests (in another terminal)
npm run test:visual
```

### Step 2: Generate Baseline Screenshots

On the first run, Playwright will create baseline screenshots:

```bash
npm run test:visual:update
```

This creates baseline images in:
- `e2e/visual-regression.spec.ts-snapshots/`
- `e2e/visual-regression-components.spec.ts-snapshots/`

### Step 3: Commit Baselines

```bash
git add e2e/**/*-snapshots/
git commit -m "Add visual regression baselines"
```

### Step 4: Make Changes & Test

1. Make UI changes to your components
2. Run tests: `npm run test:visual`
3. If tests fail, review the differences
4. Update baselines if changes are intentional: `npm run test:visual:update`

## 📝 Common Commands

```bash
# Run all visual tests
npm run test:visual

# Run specific test file
npm run test:e2e -- visual-regression.spec.ts

# Run in UI mode (interactive)
npm run test:visual:ui

# Run for specific browser
npm run test:visual:chromium

# Update baselines
npm run test:visual:update

# View test report
npm run test:e2e:report
```

## 🎯 Writing Your First Test

Create a new file: `e2e/my-visual-test.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { waitForPageStable, takeFullPageScreenshot } from './helpers/visual-regression-utils';

test('My page looks correct', async ({ page }) => {
  // Navigate to page
  await page.goto('/my-page');
  
  // Wait for page to be stable
  await waitForPageStable(page);
  
  // Take screenshot
  await takeFullPageScreenshot(page, 'my-page.png');
});
```

## 🔧 Using Helper Utilities

### Full Page Screenshot
```typescript
import { takeFullPageScreenshot } from './helpers/visual-regression-utils';

await takeFullPageScreenshot(page, 'page-name.png');
```

### Component Screenshot
```typescript
import { takeComponentScreenshot } from './helpers/visual-regression-utils';

const button = page.locator('button').first();
await takeComponentScreenshot(button, 'button.png');
```

### Test Multiple Viewports
```typescript
import { testAcrossViewports } from './helpers/visual-regression-utils';

await testAcrossViewports(
  page,
  '/pricing',
  'pricing-responsive',
  ['mobile', 'tablet', 'desktop']
);
```

### Test Both Themes
```typescript
import { testBothThemes } from './helpers/visual-regression-utils';

await testBothThemes(page, '/pricing', 'pricing-themes');
```

### Test Both Languages
```typescript
import { testBothLanguages } from './helpers/visual-regression-utils';

await testBothLanguages(page, '/menu', 'menu-i18n');
```

## 🎨 Test Patterns

### Pattern 1: Basic Page Test
```typescript
test('Landing page', async ({ page }) => {
  await page.goto('/');
  await waitForPageStable(page);
  await takeFullPageScreenshot(page, 'landing.png');
});
```

### Pattern 2: Component Test
```typescript
test('Header component', async ({ page }) => {
  await page.goto('/');
  await waitForPageStable(page);
  
  const header = page.locator('header').first();
  await takeComponentScreenshot(header, 'header.png');
});
```

### Pattern 3: Interactive State Test
```typescript
test('Button hover', async ({ page }) => {
  await page.goto('/');
  await waitForPageStable(page);
  
  const button = page.locator('button').first();
  await button.hover();
  await page.waitForTimeout(300);
  
  await takeComponentScreenshot(button, 'button-hover.png');
});
```

### Pattern 4: Form Test
```typescript
test('Login form', async ({ page }) => {
  await page.goto('/login');
  await waitForPageStable(page);
  
  await testFormStates(page, 'form', 'login-form', {
    'input[type="email"]': 'test@example.com',
    'input[type="password"]': 'password123',
  });
});
```

### Pattern 5: Responsive Test
```typescript
test('Pricing - responsive', async ({ page }) => {
  await testAcrossViewports(
    page,
    '/pricing',
    'pricing',
    ['mobile', 'desktop']
  );
});
```

## 🐛 Troubleshooting

### Tests are flaky
```typescript
// Increase wait time
await page.waitForTimeout(1000);

// Wait for network to be idle
await page.waitForLoadState('networkidle');

// Wait for specific element
await page.waitForSelector('img');
```

### Screenshots don't match
```typescript
// Increase threshold (0-1, higher = more tolerant)
await expect(page).toHaveScreenshot('page.png', {
  threshold: 0.3,
  maxDiffPixelRatio: 0.02,
});
```

### Dynamic content causes failures
```typescript
// Mask dynamic regions
await expect(page).toHaveScreenshot('page.png', {
  mask: [page.locator('.timestamp')],
});
```

### Fonts not loading
```typescript
import { waitForFonts } from './helpers/visual-regression-utils';

await waitForFonts(page);
```

### Images not loading
```typescript
import { waitForImages } from './helpers/visual-regression-utils';

await waitForImages(page);
```

## 📊 Reviewing Test Results

### When Tests Pass
✅ No action needed - baselines match current UI

### When Tests Fail
1. Run `npm run test:e2e:report` to view HTML report
2. Review the diff images showing differences
3. Decide if changes are:
   - **Intentional**: Update baselines with `npm run test:visual:update`
   - **Bugs**: Fix the code and re-run tests

### Viewing Diffs
The report shows three images:
- **Expected**: Baseline screenshot
- **Actual**: Current screenshot
- **Diff**: Highlighted differences

## 🔄 CI/CD Integration

Tests run automatically on:
- Pull requests
- Pushes to main/develop

When tests fail in CI:
1. Download the `visual-diffs` artifact
2. Review the differences locally
3. Update baselines if needed
4. Push updated baselines

## 📚 More Examples

See `e2e/visual-regression-example.spec.ts` for 20+ examples of:
- Basic screenshots
- Component screenshots
- Responsive testing
- Theme testing
- Language testing
- Interactive states
- Form testing
- Custom options
- And more!

## 🎓 Best Practices

1. **Always disable animations**
   ```typescript
   animations: 'disabled'
   ```

2. **Wait for page to be stable**
   ```typescript
   await waitForPageStable(page);
   ```

3. **Test critical user flows**
   - Landing page
   - Authentication
   - Main features
   - Checkout/payment

4. **Test responsive designs**
   - Mobile
   - Tablet
   - Desktop

5. **Test theme variations**
   - Light mode
   - Dark mode

6. **Test internationalization**
   - English (LTR)
   - Arabic (RTL)

## 🆘 Need Help?

- Read the full guide: `e2e/visual-regression/README.md`
- Check examples: `e2e/visual-regression-example.spec.ts`
- View implementation docs: `VISUAL_REGRESSION_TESTING.md`
- Playwright docs: https://playwright.dev/docs/test-snapshots

## ✅ Checklist

- [ ] Dev server is running (`npm run dev`)
- [ ] Tests are passing (`npm run test:visual`)
- [ ] Baselines are generated (`npm run test:visual:update`)
- [ ] Baselines are committed to git
- [ ] CI/CD workflow is set up
- [ ] Team knows how to update baselines

## 🎉 You're Ready!

You now have a complete visual regression testing setup. Start writing tests and catch visual bugs before they reach production!
