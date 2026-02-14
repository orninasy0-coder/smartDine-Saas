# Accessibility Testing Quick Start

## Quick Commands

```bash
# Run all accessibility tests
npm run test:a11y

# Run only automated axe-core tests
npm run test:a11y:automated

# Run advanced accessibility tests
npm run test:a11y:advanced

# Run with UI mode (interactive)
npm run test:a11y:ui

# Generate HTML report
npm run test:a11y:report
```

## What Gets Tested?

### ✅ Automated Checks (axe-core)
- Color contrast ratios (WCAG AA)
- Missing ARIA labels
- Form accessibility
- Heading hierarchy
- Image alt text
- Keyboard accessibility
- Focus management
- Semantic HTML structure

### 📱 Tested Scenarios
- Light and dark modes
- English and Arabic (RTL)
- Desktop, tablet, and mobile viewports
- All major pages and components
- Modal dialogs and forms
- Navigation and interactive elements

## Common Issues & Fixes

### 1. Color Contrast
```tsx
// ❌ Fails
<p className="text-gray-400">Text</p>

// ✅ Passes
<p className="text-gray-900 dark:text-gray-100">Text</p>
```

### 2. Button Labels
```tsx
// ❌ Fails
<button><Icon /></button>

// ✅ Passes
<button aria-label="Close"><Icon /></button>
```

### 3. Form Labels
```tsx
// ❌ Fails
<input type="email" />

// ✅ Passes
<label htmlFor="email">Email</label>
<input id="email" type="email" />
```

### 4. Images
```tsx
// ❌ Fails
<img src="dish.jpg" />

// ✅ Passes
<img src="dish.jpg" alt="Grilled salmon with vegetables" />
```

## Understanding Test Results

### ✓ Pass
```
✓ Landing page should have no accessibility violations
```
Great! No issues found.

### ✗ Fail
```
✗ Login page should have no accessibility violations

Violations:
1. color-contrast (serious)
   - 3 elements affected
   - Fix: Increase contrast ratio to 4.5:1
```

Fix the issues and re-run the tests.

## Integration with CI/CD

Add to `.github/workflows/test.yml`:

```yaml
- name: Accessibility Tests
  run: npm run test:a11y
```

## Need Help?

- See `ACCESSIBILITY_TESTING.md` for detailed documentation
- Check `e2e/helpers/accessibility-utils.ts` for utility functions
- Review test examples in `e2e/accessibility-automated.spec.ts`

## Resources

- [WCAG Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
