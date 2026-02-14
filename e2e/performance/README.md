# Performance Testing Guide

## Overview

This guide covers performance testing for the SmartDine SaaS platform. Performance tests ensure that pages load quickly, resources are optimized, and the user experience remains smooth.

## Test Categories

### 1. Page Load Times
Tests that measure how quickly pages load and become interactive.

**Thresholds:**
- Landing page: < 2 seconds (DOM content loaded)
- Login/Register: < 1.5 seconds
- Menu page: < 2.5 seconds
- Dashboard: < 2 seconds
- Network idle: < 3-4 seconds

### 2. Resource Loading
Tests that verify resources (JS, CSS, images) are optimized and reasonably sized.

**Thresholds:**
- Total resources: < 50 per page
- JavaScript bundles: < 500KB each
- CSS bundles: < 200KB each
- Images: < 500KB each

### 3. Core Web Vitals
Tests that measure Google's Core Web Vitals metrics.

**Metrics:**
- **FCP (First Contentful Paint)**: < 1.8s (good)
- **LCP (Largest Contentful Paint)**: < 2.5s (good)
- **CLS (Cumulative Layout Shift)**: < 0.1 (good)
- **TTI (Time to Interactive)**: < 3.8s (good)

### 4. Interaction Responsiveness
Tests that measure how quickly the UI responds to user interactions.

**Thresholds:**
- Button clicks: < 100ms
- Navigation: < 2 seconds
- Form inputs: < 50ms

### 5. Memory Usage
Tests that verify the application doesn't leak memory over time.

**Thresholds:**
- Memory increase after 5 reloads: < 50%

### 6. Animation Performance
Tests that verify animations run smoothly at 60fps.

**Thresholds:**
- Frame rate: > 50fps
- Scroll performance: < 1.5s

### 7. Mobile Performance
Tests that verify performance on mobile devices.

**Thresholds:**
- Mobile landing page: < 3 seconds
- Mobile menu page: < 3.5 seconds

## Running Performance Tests

### Run all performance tests
```bash
npm run test:performance
```

### Run specific test suite
```bash
npx playwright test e2e/performance.spec.ts --grep "Page Load Times"
```

### Run with UI mode
```bash
npx playwright test e2e/performance.spec.ts --ui
```

### Run on specific browser
```bash
npx playwright test e2e/performance.spec.ts --project=chromium
```

### Run mobile performance tests
```bash
npx playwright test e2e/performance.spec.ts --grep "Mobile Performance"
```

## Performance Optimization Tips

### 1. Code Splitting
- Use dynamic imports for routes
- Lazy load components that aren't immediately visible
- Split vendor bundles from application code

### 2. Image Optimization
- Use WebP format with fallbacks
- Implement lazy loading for images
- Use responsive images with srcset
- Compress images before upload

### 3. CSS Optimization
- Remove unused CSS
- Use CSS-in-JS with code splitting
- Minimize critical CSS
- Use Tailwind's purge feature

### 4. JavaScript Optimization
- Minimize bundle size
- Use tree shaking
- Remove console.log statements in production
- Use production builds

### 5. Caching Strategy
- Implement service workers
- Use browser caching headers
- Cache API responses
- Use CDN for static assets

### 6. Animation Performance
- Use CSS transforms instead of position changes
- Use will-change property sparingly
- Avoid animating expensive properties
- Use requestAnimationFrame for JS animations

### 7. Network Optimization
- Enable HTTP/2
- Use compression (gzip/brotli)
- Minimize HTTP requests
- Use resource hints (preload, prefetch)

## Monitoring Performance

### Browser DevTools
1. Open Chrome DevTools
2. Go to Performance tab
3. Record page load
4. Analyze metrics and bottlenecks

### Lighthouse
```bash
npx lighthouse http://localhost:5173 --view
```

### WebPageTest
Visit https://www.webpagetest.org/ and test your deployed site

### Real User Monitoring (RUM)
Consider implementing:
- Google Analytics with Web Vitals
- Sentry Performance Monitoring
- New Relic Browser
- DataDog RUM

## Performance Budget

Set performance budgets to prevent regression:

```json
{
  "budgets": [
    {
      "resourceSizes": [
        { "resourceType": "script", "budget": 500 },
        { "resourceType": "stylesheet", "budget": 200 },
        { "resourceType": "image", "budget": 500 },
        { "resourceType": "total", "budget": 2000 }
      ],
      "timings": [
        { "metric": "interactive", "budget": 3800 },
        { "metric": "first-contentful-paint", "budget": 1800 },
        { "metric": "largest-contentful-paint", "budget": 2500 }
      ]
    }
  ]
}
```

## CI/CD Integration

Add performance tests to your CI/CD pipeline:

```yaml
# .github/workflows/performance.yml
name: Performance Tests

on:
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: '0 0 * * 0' # Weekly

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npx playwright install --with-deps
      - run: npx playwright test e2e/performance.spec.ts
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: performance-report
          path: playwright-report/
```

## Troubleshooting

### Tests are failing
1. Check if dev server is running
2. Verify network conditions
3. Check browser console for errors
4. Review performance metrics in test output

### Inconsistent results
1. Run tests multiple times
2. Close other applications
3. Use consistent network conditions
4. Consider using CI environment

### Performance regression
1. Compare with baseline metrics
2. Check recent code changes
3. Review bundle sizes
4. Analyze network waterfall

## Best Practices

1. **Run tests regularly**: Include in CI/CD pipeline
2. **Set realistic thresholds**: Based on target devices and networks
3. **Monitor trends**: Track performance over time
4. **Test on real devices**: Don't rely only on emulation
5. **Consider network conditions**: Test on 3G/4G/5G
6. **Profile before optimizing**: Identify actual bottlenecks
7. **Measure impact**: Verify optimizations actually help

## Resources

- [Web.dev Performance](https://web.dev/performance/)
- [Playwright Performance Testing](https://playwright.dev/docs/test-performance)
- [Core Web Vitals](https://web.dev/vitals/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)

## Metrics Reference

### First Contentful Paint (FCP)
Time until first text or image is painted.
- Good: < 1.8s
- Needs Improvement: 1.8s - 3s
- Poor: > 3s

### Largest Contentful Paint (LCP)
Time until largest content element is painted.
- Good: < 2.5s
- Needs Improvement: 2.5s - 4s
- Poor: > 4s

### Cumulative Layout Shift (CLS)
Measures visual stability.
- Good: < 0.1
- Needs Improvement: 0.1 - 0.25
- Poor: > 0.25

### Time to Interactive (TTI)
Time until page is fully interactive.
- Good: < 3.8s
- Needs Improvement: 3.8s - 7.3s
- Poor: > 7.3s

### First Input Delay (FID)
Time from first interaction to browser response.
- Good: < 100ms
- Needs Improvement: 100ms - 300ms
- Poor: > 300ms

### Total Blocking Time (TBT)
Sum of blocking time between FCP and TTI.
- Good: < 200ms
- Needs Improvement: 200ms - 600ms
- Poor: > 600ms
