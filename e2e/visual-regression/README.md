# Visual Regression Testing Guide

## Overview

Visual regression testing helps detect unintended visual changes in the UI by comparing screenshots of the application against baseline images. This ensures that code changes don't accidentally break the visual appearance of the application.

## How It Works

1. **Baseline Creation**: First run creates baseline screenshots
2. **Comparison**: Subsequent runs compare new screenshots against baselines
3. **Failure Detection**: Tests fail if differences exceed the configured threshold
4. **Review & Update**: Developers review differences and update baselines if changes are intentional

## Running Visual Regression Tests

### Run all visual regression tests
```bash
npm run test:e2e -- visual-regression
```

### Run specific test file
```bash
npm run test:e2e -- visual-regression.spec.ts
npm run test:e2e -- visual-regression-components.spec.ts
```

### Run tests for specific browser
```bash
npm run test:e2e:chromium -- visual-regression
npm run test:e2e:firefox -- visual-regression
npm run test:e2e:webkit -- visual-regression
```

### Update baseline screenshots
When visual changes are intentional, update the baselines:
```bash
npm run test:e2e -- visual-regression --update-snapshots
```

### Run in headed mode (see browser)
```bash
npm run test:e2e:headed -- visual-regression
```

### Run in debug mode
```bash
npm run test:e2e:debug -- visual-regression
```

## Test Coverage

### Page-Level Tests (`visual-regression.spec.ts`)
- **Public Pages**: Landing, Pricing, Contact, User Guide
- **Authentication Pages**: Login, Register, Reset Password
- **Menu & Cart**: Menu Browse, Dish Detail, Cart
- **Error Pages**: 404 Not Found
- **Theme Variations**: Light mode, Dark mode
- **RTL Support**: Arabic language layout

### Component-Level Tests (`visual-regression-components.spec.ts`)
- **Navigation**: Header, Footer, Mobile Menu
- **Forms**: Login, Register, Contact forms
- **Cards**: Pricing cards, Feature cards, Dish cards
- **Buttons**: Primary, Secondary, Hover states
- **Interactive States**: Search, Dropdowns, Modals
- **Loading States**: Spinners, Skeletons
- **Responsive Breakpoints**: Mobile, Tablet, Desktop

## Configuration

Visual regression settings are defined in `visual-regression.config.ts`:

- **Threshold**: Acceptable difference level (0-1)
- **Max Diff Pixel Ratio**: Maximum allowed pixel difference
- **Screenshot Options**: Animation handling, fonts, full page capture
- **Viewports**: Predefined viewport sizes for responsive testing
- **Wait Times**: Delays for animations and interactions

## Best Practices

### 1. Disable Animations
Always disable animations to ensure consistent screenshots:
```typescript
await expect(page).toHaveScreenshot('page.png', {
  animations: 'disabled',
});
```

### 2. Wait for Content to Load
Ensure all content is loaded before taking screenshots:
```typescript
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1000); // Additional wait for animations
```

### 3. Handle Dynamic Content
For pages with dynamic content (dates, random data):
- Mock the data
- Use fixed test data
- Mask dynamic regions

### 4. Test Multiple Viewports
Test responsive designs across different screen sizes:
```typescript
await page.setViewportSize({ width: 375, height: 667 });
```

### 5. Test Theme Variations
Test both light and dark modes:
```typescript
await page.click('[aria-label*="theme"]');
await page.waitForTimeout(500);
```

### 6. Test RTL Layouts
Test right-to-left layouts for internationalization:
```typescript
// Switch to Arabic
await page.click('[aria-label*="language"]');
await page.click('text=/AR|Arabic/i');
```

## Troubleshooting

### Tests Failing on CI
- Ensure consistent environment (fonts, browser versions)
- Increase threshold if minor differences are acceptable
- Use Docker for consistent rendering environment

### Flaky Tests
- Increase wait times for animations
- Ensure network requests are complete
- Disable animations and transitions
- Use `waitForLoadState('networkidle')`

### Large Baseline Files
- Use PNG compression
- Consider testing specific components instead of full pages
- Store baselines in Git LFS if needed

### Font Rendering Differences
- Ensure fonts are loaded: `fonts: 'ready'`
- Use system fonts or web-safe fonts
- Consider font rendering differences across OS

## Screenshot Storage

Baseline screenshots are stored in:
```
e2e/visual-regression.spec.ts-snapshots/
e2e/visual-regression-components.spec.ts-snapshots/
```

Each browser has its own snapshot directory:
```
visual-regression.spec.ts-snapshots/
  chromium/
    landing-desktop.png
    pricing-mobile.png
  firefox/
    landing-desktop.png
  webkit/
    landing-desktop.png
```

## Reviewing Differences

When tests fail, Playwright generates:
1. **Actual**: Current screenshot
2. **Expected**: Baseline screenshot
3. **Diff**: Visual difference highlighting

View the HTML report:
```bash
npm run test:e2e:report
```

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run visual regression tests
  run: npm run test:e2e -- visual-regression

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

### Updating Baselines in CI
```yaml
- name: Update baselines
  if: github.event_name == 'workflow_dispatch'
  run: npm run test:e2e -- visual-regression --update-snapshots
```

## Adding New Visual Tests

### 1. Identify What to Test
- New pages or components
- Critical user flows
- Complex layouts
- Responsive designs

### 2. Write the Test
```typescript
test('New feature - desktop', async ({ page }) => {
  await page.goto('/new-feature');
  await page.waitForLoadState('networkidle');
  
  await expect(page).toHaveScreenshot('new-feature-desktop.png', {
    fullPage: true,
    animations: 'disabled',
  });
});
```

### 3. Generate Baseline
```bash
npm run test:e2e -- visual-regression --update-snapshots
```

### 4. Commit Baselines
```bash
git add e2e/**/*-snapshots/
git commit -m "Add visual regression baselines for new feature"
```

## Maintenance

### Regular Updates
- Review and update baselines when designs change intentionally
- Keep tests in sync with UI changes
- Remove tests for deprecated features

### Performance
- Limit full-page screenshots to critical pages
- Use component-level screenshots for detailed testing
- Run visual tests separately from functional tests

### Documentation
- Document intentional visual changes
- Keep this README updated
- Add comments for complex test scenarios

## Resources

- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [Best Practices for Visual Testing](https://playwright.dev/docs/best-practices)
- [CI/CD Integration](https://playwright.dev/docs/ci)
