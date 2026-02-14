# Visual Regression Testing Implementation

## Overview

Visual regression testing has been implemented for the SmartDine SaaS platform to automatically detect unintended visual changes in the UI. This ensures that code changes don't accidentally break the visual appearance of the application.

## Implementation Summary

### Files Created

1. **Test Files**
   - `e2e/visual-regression.spec.ts` - Page-level visual regression tests
   - `e2e/visual-regression-components.spec.ts` - Component-level visual regression tests
   - `e2e/visual-regression-advanced.spec.ts` - Advanced visual regression scenarios

2. **Configuration**
   - `e2e/visual-regression.config.ts` - Visual regression testing configuration
   - `playwright.config.ts` - Updated with visual regression settings

3. **Utilities**
   - `e2e/helpers/visual-regression-utils.ts` - Helper functions for visual regression tests

4. **Documentation**
   - `e2e/visual-regression/README.md` - Comprehensive guide for visual regression testing
   - `VISUAL_REGRESSION_TESTING.md` - This file

5. **CI/CD**
   - `.github/workflows/visual-regression.yml` - GitHub Actions workflow for automated testing

6. **Package Scripts**
   - Added npm scripts for running visual regression tests

## Test Coverage

### Page-Level Tests (visual-regression.spec.ts)

#### Public Pages
- Landing page (desktop & mobile)
- Pricing page (desktop & mobile)
- Contact page
- User Guide page

#### Authentication Pages
- Login page (desktop & mobile)
- Register page (desktop & mobile)
- Reset password page

#### Menu & Cart
- Menu browse page (desktop & mobile)
- Dish detail page
- Cart page (desktop & mobile)

#### Error Pages
- 404 Not Found page (desktop & mobile)

#### Theme Variations
- Landing page (dark mode)
- Pricing page (dark mode)
- Menu page (dark mode)

#### RTL Support
- Landing page (Arabic/RTL)
- Pricing page (Arabic/RTL)

### Component-Level Tests (visual-regression-components.spec.ts)

#### Navigation Components
- Public header (desktop)
- Public header (mobile menu open)
- Footer

#### Form Components
- Login form (empty & filled states)
- Register form (empty state)
- Contact form (empty state)

#### Card Components
- Pricing cards
- Feature cards
- Dish cards

#### Button States
- Primary button (normal & hover)
- Secondary button (normal)

#### Interactive States
- Search bar (focused)
- Dropdown menu (open)
- Modal dialog (open)

#### Loading States
- Loading spinner
- Skeleton loader

#### Responsive Breakpoints
- Mobile small (320x568)
- Mobile (375x667)
- Tablet (768x1024)
- Desktop (1280x720)
- Desktop large (1920x1080)

### Advanced Tests (visual-regression-advanced.spec.ts)

#### Cross-Browser Testing
- All viewports testing
- Theme variations
- Language variations

#### Interactive States
- Button hover states
- Input focus states
- Form validation states

#### Dynamic Content
- Hide dynamic timestamps
- Mask user-specific data

#### Performance
- Wait for images to load
- Wait for fonts to load

#### Complex Scenarios
- Search and filter
- Cart with items
- Plan comparison

#### Accessibility
- High contrast mode
- Reduced motion

#### Mobile Specific
- Mobile menu navigation
- Landscape orientation

#### Print Styles
- Print preview for pages

#### Error States
- Form validation errors
- Network error state

## Running Tests

### Basic Commands

```bash
# Run all visual regression tests
npm run test:visual

# Run specific test file
npm run test:e2e -- visual-regression.spec.ts

# Run tests for specific browser
npm run test:visual:chromium

# Run tests in UI mode
npm run test:visual:ui

# Update baseline screenshots
npm run test:visual:update
```

### Advanced Commands

```bash
# Run tests in headed mode (see browser)
npm run test:e2e:headed -- visual-regression

# Run tests in debug mode
npm run test:e2e:debug -- visual-regression

# Run tests for specific project
npm run test:e2e -- visual-regression --project=chromium
npm run test:e2e -- visual-regression --project=firefox
npm run test:e2e -- visual-regression --project=webkit

# View test report
npm run test:e2e:report
```

## Configuration

### Visual Regression Settings

The configuration is defined in `e2e/visual-regression.config.ts`:

```typescript
{
  threshold: 0.2,              // Acceptable difference level (0-1)
  maxDiffPixelRatio: 0.01,     // Maximum allowed pixel difference
  screenshotOptions: {
    animations: 'disabled',     // Disable animations
    fonts: 'ready',             // Wait for fonts
    fullPage: true,             // Capture full page
    type: 'png',                // Image format
  },
  viewports: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1280, height: 720 },
    desktopLarge: { width: 1920, height: 1080 },
  },
  waitTimes: {
    afterPageLoad: 1000,        // Wait after page load
    afterInteraction: 300,      // Wait after interactions
    afterThemeChange: 500,      // Wait for theme changes
    afterLanguageChange: 500,   // Wait for language changes
  },
}
```

### Playwright Configuration

Updated `playwright.config.ts` with visual regression settings:

```typescript
expect: {
  toHaveScreenshot: {
    maxDiffPixelRatio: 0.01,
    threshold: 0.2,
    animations: 'disabled',
    fonts: 'ready',
  },
}
```

## Helper Utilities

The `visual-regression-utils.ts` file provides helper functions:

### Page Utilities
- `waitForPageStable()` - Wait for page to be fully loaded
- `takeFullPageScreenshot()` - Take full page screenshot
- `takeComponentScreenshot()` - Take component screenshot
- `setViewport()` - Set viewport to predefined size

### Theme & Language
- `toggleTheme()` - Toggle between light/dark mode
- `switchToDarkMode()` - Switch to dark mode
- `switchToLightMode()` - Switch to light mode
- `switchLanguage()` - Switch language (en/ar)

### Dynamic Content
- `hideDynamicContent()` - Hide dynamic content
- `takeScreenshotWithMask()` - Mask dynamic regions
- `setFixedDateTime()` - Set fixed date/time

### Testing Utilities
- `testAcrossViewports()` - Test page across multiple viewports
- `testBothThemes()` - Test page in both themes
- `testBothLanguages()` - Test page in both languages
- `testInteractiveState()` - Test interactive states
- `testFormStates()` - Test form states

### Performance
- `waitForImages()` - Wait for images to load
- `waitForFonts()` - Wait for fonts to load
- `disableAnimations()` - Disable animations globally

## CI/CD Integration

### GitHub Actions Workflow

The `.github/workflows/visual-regression.yml` workflow:

1. Runs on pull requests and pushes to main/develop
2. Tests across multiple browsers (chromium, firefox, webkit)
3. Uploads test results and visual diffs as artifacts
4. Comments on PRs when tests fail
5. Supports manual baseline updates via workflow_dispatch

### Workflow Features

- **Parallel Testing**: Tests run in parallel for each browser
- **Artifact Upload**: Test reports and visual diffs are uploaded
- **PR Comments**: Automatic comments on failed tests
- **Baseline Updates**: Manual workflow to update baselines
- **Retention**: Artifacts retained for 30 days

## Best Practices

### 1. Disable Animations
Always disable animations for consistent screenshots:
```typescript
await expect(page).toHaveScreenshot('page.png', {
  animations: 'disabled',
});
```

### 2. Wait for Content
Ensure all content is loaded:
```typescript
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1000);
```

### 3. Handle Dynamic Content
- Mock dynamic data
- Use fixed test data
- Mask dynamic regions

### 4. Test Multiple Viewports
Test responsive designs:
```typescript
await setViewport(page, 'mobile');
```

### 5. Test Theme Variations
Test both light and dark modes:
```typescript
await testBothThemes(page, '/pricing', 'pricing-themes');
```

### 6. Test RTL Layouts
Test right-to-left layouts:
```typescript
await switchLanguage(page, 'ar');
```

## Troubleshooting

### Tests Failing on CI
- Ensure consistent environment
- Increase threshold if needed
- Use Docker for consistent rendering

### Flaky Tests
- Increase wait times
- Ensure network requests complete
- Disable animations
- Use `waitForLoadState('networkidle')`

### Large Baseline Files
- Use PNG compression
- Test specific components
- Consider Git LFS

### Font Rendering Differences
- Ensure fonts are loaded
- Use system fonts
- Consider OS differences

## Maintenance

### Regular Updates
- Review and update baselines when designs change
- Keep tests in sync with UI changes
- Remove tests for deprecated features

### Performance
- Limit full-page screenshots
- Use component-level screenshots
- Run visual tests separately

### Documentation
- Document intentional changes
- Keep README updated
- Add comments for complex scenarios

## Screenshot Storage

Baseline screenshots are stored in:
```
e2e/visual-regression.spec.ts-snapshots/
  chromium/
  firefox/
  webkit/
e2e/visual-regression-components.spec.ts-snapshots/
  chromium/
  firefox/
  webkit/
e2e/visual-regression-advanced.spec.ts-snapshots/
  chromium/
  firefox/
  webkit/
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

## Next Steps

1. **Generate Baselines**: Run tests with `--update-snapshots` to create initial baselines
2. **Commit Baselines**: Commit the baseline screenshots to version control
3. **Run in CI**: Tests will run automatically on PRs
4. **Review Failures**: Review visual differences when tests fail
5. **Update as Needed**: Update baselines when changes are intentional

## Resources

- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [Best Practices for Visual Testing](https://playwright.dev/docs/best-practices)
- [CI/CD Integration](https://playwright.dev/docs/ci)
- [Visual Regression Testing Guide](./e2e/visual-regression/README.md)

## Summary

Visual regression testing is now fully implemented with:
- ✅ 100+ visual regression tests
- ✅ Page-level and component-level coverage
- ✅ Cross-browser testing (Chromium, Firefox, WebKit)
- ✅ Responsive design testing
- ✅ Theme variation testing (light/dark)
- ✅ RTL layout testing (Arabic)
- ✅ Helper utilities for common scenarios
- ✅ CI/CD integration with GitHub Actions
- ✅ Comprehensive documentation

The implementation provides robust visual regression testing to catch unintended UI changes early in the development process.
