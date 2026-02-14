# Accessibility Testing Guide

## Overview

This document describes the automated accessibility testing setup for the SmartDine SaaS platform. We use axe-core with Playwright to automatically detect WCAG 2.1 Level A and AA violations.

## Testing Tools

- **@axe-core/playwright**: Automated accessibility testing engine
- **Playwright**: E2E testing framework
- **Custom utilities**: Helper functions for advanced accessibility checks

## Test Files

### 1. `e2e/accessibility.spec.ts`
Manual accessibility tests covering:
- Keyboard navigation
- ARIA attributes
- Color contrast
- Screen reader support
- Focus management
- Responsive design

### 2. `e2e/accessibility-automated.spec.ts`
Automated axe-core scans for:
- Public pages (landing, pricing, contact, guide)
- Authentication pages (login, register, password reset)
- Menu and ordering pages
- Dashboards (kitchen, delivery, restaurant owner)
- Dark mode support
- Mobile viewports
- RTL (Arabic) support
- Component-specific scans (modals, forms, navigation)

### 3. `e2e/accessibility-advanced.spec.ts`
Advanced accessibility tests using custom utilities:
- Critical and serious violation detection
- Color contrast analysis (light/dark mode)
- ARIA attribute validation
- Semantic HTML checks
- Keyboard navigation verification
- Focus visibility checks
- Multi-language support testing
- Component-specific testing
- Accessibility report generation
- Responsive design testing

### 4. `e2e/helpers/accessibility-utils.ts`
Reusable utility functions:
- `runAccessibilityScan()` - Run axe-core scans with options
- `formatViolations()` - Format violations for readable output
- `hasCriticalViolations()` - Check for critical issues
- `getViolationsByImpact()` - Filter violations by severity
- `toggleDarkMode()` - Switch between light/dark themes
- `switchLanguage()` - Change language (EN/AR)
- `checkKeyboardNavigation()` - Verify tab order
- `isFocusVisible()` - Check focus indicators
- `checkColorContrast()` - Analyze color contrast
- `checkAriaAttributes()` - Validate ARIA usage
- `checkSemanticHTML()` - Check semantic structure
- `generateAccessibilityReport()` - Create detailed reports

## Running Tests

### Run all accessibility tests
```bash
npm run test:e2e -- accessibility
```

### Run automated accessibility tests only
```bash
npm run test:e2e -- accessibility-automated
```

### Run advanced accessibility tests only
```bash
npm run test:e2e -- accessibility-advanced
```

### Run accessibility tests in UI mode
```bash
npm run test:e2e:ui -- accessibility
```

### Run accessibility tests in headed mode
```bash
npm run test:e2e:headed -- accessibility
```

### Run accessibility tests on specific browser
```bash
npm run test:e2e:chromium -- accessibility
npm run test:e2e:firefox -- accessibility
npm run test:e2e:webkit -- accessibility
```

### Run accessibility tests on mobile
```bash
npm run test:e2e:mobile -- accessibility
```

## WCAG Standards Tested

Our tests check for compliance with:
- **WCAG 2.0 Level A** (wcag2a)
- **WCAG 2.0 Level AA** (wcag2aa)
- **WCAG 2.1 Level A** (wcag21a)
- **WCAG 2.1 Level AA** (wcag21aa)
- **Best Practices** (best-practice)

## Common Accessibility Issues Detected

### 1. Color Contrast
- Text must have sufficient contrast ratio (4.5:1 for normal text, 3:1 for large text)
- Tested in both light and dark modes

### 2. ARIA Attributes
- Buttons must have accessible names
- Form inputs must have labels
- Links must have descriptive text
- Dialogs must have proper roles and aria-modal

### 3. Keyboard Navigation
- All interactive elements must be keyboard accessible
- Focus indicators must be visible
- Tab order must be logical
- Modals must trap focus

### 4. Semantic HTML
- Pages must have proper heading hierarchy (h1, h2, h3...)
- Main content must be in `<main>` landmark
- Navigation must be in `<nav>` landmark
- Images must have alt text

### 5. Form Accessibility
- Inputs must have associated labels
- Error messages must be accessible
- Required fields must be indicated
- Form validation must be accessible

### 6. Screen Reader Support
- Proper landmark regions
- Descriptive link text
- Alternative text for images
- ARIA live regions for dynamic content

## Violation Severity Levels

Axe-core categorizes violations by impact:

1. **Critical**: Must be fixed immediately
   - Blocks users from accessing content
   - Example: Missing form labels, insufficient color contrast

2. **Serious**: Should be fixed soon
   - Significantly impacts user experience
   - Example: Missing ARIA attributes, improper heading hierarchy

3. **Moderate**: Should be addressed
   - Impacts some users
   - Example: Missing alt text, suboptimal focus indicators

4. **Minor**: Nice to fix
   - Minor improvements
   - Example: Best practice recommendations

## Interpreting Test Results

### Successful Test
```
✓ Landing page should have no accessibility violations
```
No violations found - page is accessible!

### Failed Test
```
✗ Login page should have no accessibility violations

Expected: []
Received: [
  {
    id: 'color-contrast',
    impact: 'serious',
    description: 'Elements must have sufficient color contrast',
    nodes: [...]
  }
]
```

The test output shows:
- **id**: The specific rule that failed
- **impact**: Severity level
- **description**: What the issue is
- **nodes**: Which elements have the issue

## Fixing Accessibility Issues

### Color Contrast Issues
```tsx
// ❌ Bad - insufficient contrast
<p className="text-gray-400">Important text</p>

// ✅ Good - sufficient contrast
<p className="text-gray-900 dark:text-gray-100">Important text</p>
```

### Missing ARIA Labels
```tsx
// ❌ Bad - no accessible name
<button onClick={handleClick}>
  <Icon />
</button>

// ✅ Good - has aria-label
<button onClick={handleClick} aria-label="Close dialog">
  <Icon />
</button>
```

### Missing Form Labels
```tsx
// ❌ Bad - no label
<input type="email" placeholder="Email" />

// ✅ Good - has label
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

### Improper Heading Hierarchy
```tsx
// ❌ Bad - skips heading levels
<h1>Page Title</h1>
<h3>Section Title</h3>

// ✅ Good - proper hierarchy
<h1>Page Title</h1>
<h2>Section Title</h2>
```

## Best Practices

1. **Run tests frequently**: Run accessibility tests on every PR
2. **Fix critical issues first**: Prioritize by severity
3. **Test in multiple modes**: Check light/dark themes, EN/AR languages
4. **Test on multiple devices**: Desktop, tablet, mobile
5. **Use semantic HTML**: Proper landmarks and heading structure
6. **Provide keyboard access**: All features must work with keyboard
7. **Include ARIA when needed**: But prefer semantic HTML first
8. **Test with real users**: Automated tests catch ~30-40% of issues

## Continuous Integration

Add to your CI pipeline:

```yaml
- name: Run Accessibility Tests
  run: npm run test:e2e -- accessibility
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

## Limitations

Automated accessibility testing can only detect ~30-40% of accessibility issues. Manual testing is still required for:
- Logical tab order
- Screen reader experience
- Keyboard-only navigation
- Content clarity and readability
- User experience with assistive technologies

## Support

For questions or issues with accessibility testing, please contact the development team or refer to the project documentation.
