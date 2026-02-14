# Performance Monitoring - Quick Start

Get started with performance monitoring in 5 minutes.

## Step 1: Initialize Analytics

Performance monitoring is automatically included when you initialize analytics:

```typescript
import { analytics } from '@/utils/analytics';

// In your App.tsx or main.tsx
analytics.initialize();
```

## Step 2: Add to Your Pages

Use the `usePerformanceMonitoring` hook in your page components:

```typescript
import { usePerformanceMonitoring } from '@/utils/analytics';

function LandingPage() {
  // Automatically tracks page load metrics
  usePerformanceMonitoring();

  return (
    <div>
      <h1>Welcome to SmartDine</h1>
      {/* Your page content */}
    </div>
  );
}
```

## Step 3: View Metrics

Metrics are automatically sent to your analytics provider (Google Analytics or PostHog).

### In Google Analytics:
- Go to Events → All Events
- Look for "Web Vitals" and "Performance" categories

### In PostHog:
- Go to Events
- Filter by event names: `LCP`, `FID`, `CLS`, `FCP`, `TTFB`, `INP`

## What Gets Tracked?

### Core Web Vitals (Automatic)
- ✅ **LCP** - Largest Contentful Paint
- ✅ **FID** - First Input Delay
- ✅ **CLS** - Cumulative Layout Shift
- ✅ **FCP** - First Contentful Paint
- ✅ **TTFB** - Time to First Byte
- ✅ **INP** - Interaction to Next Paint

### Page Load Metrics (Automatic)
- ✅ DOM Content Loaded time
- ✅ Page Load Complete time
- ✅ Resource count and size
- ✅ Navigation timing breakdown

## Example: Add to All Pages

Add to your root layout or router:

```typescript
import { Outlet } from 'react-router-dom';
import { usePerformanceMonitoring } from '@/utils/analytics';

function RootLayout() {
  usePerformanceMonitoring();

  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
```

## Example: Track on Route Changes

```typescript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/utils/analytics';

function App() {
  const location = useLocation();

  useEffect(() => {
    analytics.trackPageLoadMetrics();
  }, [location.pathname]);

  return <Routes>{/* Your routes */}</Routes>;
}
```

## Thresholds

The system automatically rates metrics as:
- 🟢 **Good** - Optimal performance
- 🟡 **Needs Improvement** - Acceptable but could be better
- 🔴 **Poor** - Needs attention

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| FID | ≤ 100ms | ≤ 300ms | > 300ms |
| CLS | ≤ 0.1 | ≤ 0.25 | > 0.25 |

## Debug Mode

Enable debug mode to see metrics in the console:

```bash
# .env.development
VITE_APP_ENV=development
```

You'll see logs like:
```
[Analytics] Web Vitals tracked: { name: 'LCP', value: 2300, rating: 'good' }
```

## Next Steps

- 📖 Read the [Full Performance Monitoring Guide](./PERFORMANCE_MONITORING.md)
- 📊 Set up [Performance Testing](./PERFORMANCE_TESTING.md)
- 🎯 Learn about [Analytics Integration](./ANALYTICS_QUICK_START.md)

## Need Help?

- Check the [Troubleshooting section](./PERFORMANCE_MONITORING.md#troubleshooting)
- Review [Best Practices](./PERFORMANCE_MONITORING.md#best-practices)
- See [Usage Examples](./PERFORMANCE_MONITORING.md#usage-examples)
