# Performance Testing - Quick Start Guide

## What is Performance Testing?

Performance testing measures how fast your application loads and responds to user interactions. It helps ensure a smooth user experience by identifying bottlenecks and optimization opportunities.

## Why Performance Testing Matters

- **User Experience**: Faster pages = happier users
- **SEO**: Google ranks faster sites higher
- **Conversions**: Every 100ms delay can reduce conversions by 1%
- **Mobile Users**: Critical for users on slower connections
- **Business Impact**: Performance directly affects revenue

## Quick Start (5 minutes)

### 1. Run All Performance Tests

```bash
npm run test:performance
```

This will test:
- Page load times
- Resource loading
- Core Web Vitals
- Interaction responsiveness
- Memory usage
- Animation performance
- Mobile performance

### 2. View Results

After tests complete, check the console output for:
- ✅ Passed tests (meeting performance thresholds)
- ❌ Failed tests (performance issues detected)
- 📊 Metrics (load times, resource sizes, etc.)

### 3. View Detailed Report

```bash
npm run test:performance:report
```

This opens an HTML report with:
- Test results
- Screenshots
- Performance metrics
- Failure details

## Understanding the Results

### Page Load Times
```
Landing page loaded in 1234ms ✅
```
- **Good**: < 2000ms
- **Needs Work**: > 2000ms

### Resource Sizes
```
JS bundle: main.js - 245.67KB ✅
```
- **Good**: < 500KB per bundle
- **Needs Work**: > 500KB

### Core Web Vitals
```
FCP: 1234.56ms ✅
LCP: 2100.00ms ✅
CLS: 0.05 ✅
```
- **FCP**: First Contentful Paint (< 1.8s is good)
- **LCP**: Largest Contentful Paint (< 2.5s is good)
- **CLS**: Cumulative Layout Shift (< 0.1 is good)

## Common Issues & Fixes

### Issue: Page loads too slowly
**Symptoms**: Load time > 2 seconds

**Fixes**:
1. Enable code splitting
2. Lazy load components
3. Optimize images
4. Minimize bundle size

### Issue: Large JavaScript bundles
**Symptoms**: JS bundle > 500KB

**Fixes**:
1. Remove unused dependencies
2. Use dynamic imports
3. Enable tree shaking
4. Split vendor bundles

### Issue: Large images
**Symptoms**: Image > 500KB

**Fixes**:
1. Compress images
2. Use WebP format
3. Implement lazy loading
4. Use responsive images

### Issue: Poor Core Web Vitals
**Symptoms**: FCP/LCP/CLS above thresholds

**Fixes**:
1. Optimize critical rendering path
2. Preload important resources
3. Reserve space for images/ads
4. Avoid layout shifts

### Issue: Slow interactions
**Symptoms**: Button clicks > 100ms

**Fixes**:
1. Reduce JavaScript execution
2. Optimize event handlers
3. Use debouncing/throttling
4. Minimize re-renders

## Running Specific Tests

### Test only page load times
```bash
npx playwright test performance --grep "Page Load Times"
```

### Test only Core Web Vitals
```bash
npx playwright test performance --grep "Core Web Vitals"
```

### Test only mobile performance
```bash
npx playwright test performance --grep "Mobile Performance"
```

### Test with UI mode (interactive)
```bash
npm run test:performance:ui
```

## Performance Checklist

Before deploying to production, ensure:

- [ ] All pages load in < 2 seconds
- [ ] JavaScript bundles < 500KB each
- [ ] CSS bundles < 200KB each
- [ ] Images < 500KB each
- [ ] FCP < 1.8 seconds
- [ ] LCP < 2.5 seconds
- [ ] CLS < 0.1
- [ ] Button clicks respond in < 100ms
- [ ] Mobile pages load in < 3 seconds
- [ ] No memory leaks detected
- [ ] Animations run at 60fps

## Next Steps

1. **Fix failing tests**: Address performance issues
2. **Set up monitoring**: Track performance in production
3. **Automate testing**: Add to CI/CD pipeline
4. **Regular audits**: Run tests weekly
5. **Read full guide**: See `e2e/performance/README.md`

## Tips for Better Performance

### 1. Images
- Use WebP format
- Compress before upload
- Lazy load below the fold
- Use srcset for responsive images

### 2. JavaScript
- Code split by route
- Lazy load heavy components
- Remove console.log in production
- Use production builds

### 3. CSS
- Remove unused styles
- Use Tailwind's purge
- Minimize critical CSS
- Avoid @import

### 4. Fonts
- Use system fonts when possible
- Preload custom fonts
- Use font-display: swap
- Subset fonts

### 5. Network
- Enable compression
- Use CDN
- Cache static assets
- Minimize HTTP requests

## Getting Help

### Check the logs
```bash
npx playwright test performance --reporter=list
```

### Debug a specific test
```bash
npx playwright test performance --grep "Landing page" --debug
```

### View trace
```bash
npx playwright show-trace trace.zip
```

### Resources
- Full guide: `e2e/performance/README.md`
- Playwright docs: https://playwright.dev
- Web.dev performance: https://web.dev/performance/
- Core Web Vitals: https://web.dev/vitals/

## Performance Goals

### Target Metrics
- **Page Load**: < 2s on desktop, < 3s on mobile
- **Time to Interactive**: < 3.8s
- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Total Bundle Size**: < 2MB
- **API Response Time**: < 1s

### Success Criteria
- ✅ All performance tests passing
- ✅ No performance regressions in CI
- ✅ Real user metrics within targets
- ✅ Lighthouse score > 90
- ✅ PageSpeed Insights score > 90

## Troubleshooting

### Tests are flaky
- Run multiple times to confirm
- Check network conditions
- Close other applications
- Use consistent environment

### Can't reproduce locally
- Test on similar hardware
- Use same browser version
- Check network throttling
- Review CI logs

### Performance varies
- Test at different times
- Check server load
- Verify CDN status
- Monitor third-party services

## Best Practices

1. **Test early and often**: Don't wait until the end
2. **Set realistic goals**: Based on your users
3. **Monitor trends**: Track over time
4. **Test on real devices**: Not just emulators
5. **Consider network**: Test on 3G/4G
6. **Profile first**: Find actual bottlenecks
7. **Measure impact**: Verify optimizations work

---

**Remember**: Performance is a feature, not an afterthought! 🚀
