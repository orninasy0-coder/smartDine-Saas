# Performance Monitoring Guide

This guide explains how to use the performance monitoring system to track Core Web Vitals and page load metrics in the SmartDine platform.

## Overview

The performance monitoring system automatically tracks:

### Core Web Vitals
- **CLS (Cumulative Layout Shift)**: Visual stability metric
- **FID (First Input Delay)**: Interactivity metric
- **FCP (First Contentful Paint)**: Loading metric
- **LCP (Largest Contentful Paint)**: Loading metric
- **TTFB (Time to First Byte)**: Server response metric
- **INP (Interaction to Next Paint)**: Responsiveness metric

### Page Load Metrics
- DOM Content Loaded time
- Page Load Complete time
- First Paint time
- Resource count and size
- Navigation timing breakdown

## Quick Start

### 1. Automatic Tracking

Performance monitoring is automatically initialized when you initialize the analytics system:

```typescript
import { analytics } from '@/utils/analytics';

// Initialize analytics (includes performance monitoring)
analytics.initialize();
```

### 2. Track Page Load Metrics

Use the React hook to automatically track page load metrics:

```typescript
import { usePerformanceMonitoring } from '@/utils/analytics';

function MyPage() {
  // Automatically tracks page load metrics when component mounts
  usePerformanceMonitoring();

  return <div>My Page Content</div>;
}
```

### 3. Manual Tracking

You can also manually trigger page load tracking:

```typescript
import { analytics } from '@/utils/analytics';

// Track page load metrics
analytics.trackPageLoadMetrics();
```

## Core Web Vitals Thresholds

The system uses Google's recommended thresholds:

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| CLS | ≤ 0.1 | ≤ 0.25 | > 0.25 |
| FID | ≤ 100ms | ≤ 300ms | > 300ms |
| FCP | ≤ 1.8s | ≤ 3.0s | > 3.0s |
| LCP | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| TTFB | ≤ 800ms | ≤ 1.8s | > 1.8s |
| INP | ≤ 200ms | ≤ 500ms | > 500ms |

## Usage Examples

### Example 1: Track Performance in App Component

```typescript
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';

function App() {
  useEffect(() => {
    // Initialize analytics with performance monitoring
    analytics.initialize();
    
    // Track page load metrics
    analytics.trackPageLoadMetrics();
  }, []);

  return <div>App Content</div>;
}
```

### Example 2: Get Performance Summary

```typescript
import { usePerformanceSummary } from '@/utils/analytics';

function PerformanceDashboard() {
  const summary = usePerformanceSummary();

  return (
    <div>
      <h2>Performance Metrics</h2>
      
      <h3>Core Web Vitals</h3>
      {Object.entries(summary.webVitals).map(([name, metric]) => (
        <div key={name}>
          <strong>{name}:</strong> {metric.value.toFixed(2)}ms
          <span className={`badge-${metric.rating}`}>
            {metric.rating}
          </span>
        </div>
      ))}

      <h3>Page Load Metrics</h3>
      {summary.pageLoad && (
        <div>
          <p>Load Complete: {summary.pageLoad.loadComplete}ms</p>
          <p>DOM Content Loaded: {summary.pageLoad.domContentLoaded}ms</p>
          <p>Resources: {summary.pageLoad.resourceCount}</p>
        </div>
      )}
    </div>
  );
}
```

### Example 3: Track Performance on Route Changes

```typescript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/utils/analytics';

function RoutePerformanceTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page load metrics on route change
    analytics.trackPageLoadMetrics();
  }, [location.pathname]);

  return null;
}
```

### Example 4: Custom Performance Tracking

```typescript
import { performanceMonitor } from '@/utils/analytics';

function MyComponent() {
  const handleClick = () => {
    // Get current metrics
    const metrics = performanceMonitor.getMetrics();
    
    // Get specific metric
    const lcp = performanceMonitor.getMetric('LCP');
    
    if (lcp && lcp.rating === 'poor') {
      console.warn('LCP is poor:', lcp.value);
    }
  };

  return <button onClick={handleClick}>Check Performance</button>;
}
```

## Integration with Analytics Providers

Performance metrics are automatically sent to your configured analytics provider (Google Analytics or PostHog):

### Google Analytics

Metrics are tracked as custom events:
- Event Category: `Web Vitals` or `Performance`
- Event Action: Metric name (e.g., `LCP`, `page_load_complete`)
- Event Label: Rating (e.g., `good`, `needs-improvement`, `poor`)
- Event Value: Metric value in milliseconds

### PostHog

Metrics are captured as events with full metadata:
```javascript
{
  event: 'LCP',
  properties: {
    category: 'Web Vitals',
    label: 'good',
    value: 2300,
    id: 'v3-1234567890-0.123',
    delta: 2300,
    navigationType: 'navigate'
  }
}
```

## Performance Metrics Details

### Navigation Timing Breakdown

The system tracks detailed navigation timing:

```typescript
{
  redirectTime: number;      // Time spent in redirects
  dnsTime: number;          // DNS lookup time
  tcpTime: number;          // TCP connection time
  requestTime: number;      // Request time
  responseTime: number;     // Response time
  domProcessingTime: number; // DOM processing time
}
```

### Resource Metrics

Track resource loading:

```typescript
{
  resourceCount: number;      // Total number of resources
  totalResourceSize: number;  // Total size in bytes
}
```

### Connection Information

Capture connection details:

```typescript
{
  connectionType: string;  // e.g., '4g', 'wifi'
  deviceMemory: number;    // Device memory in GB
  userAgent: string;       // Browser user agent
}
```

## Best Practices

### 1. Initialize Early

Initialize analytics and performance monitoring as early as possible in your app:

```typescript
// In main.tsx or App.tsx
import { analytics } from '@/utils/analytics';

analytics.initialize();
```

### 2. Track on Every Page

Use the hook in your layout or route components:

```typescript
function Layout() {
  usePerformanceMonitoring();
  
  return <Outlet />;
}
```

### 3. Monitor in Production

Enable performance monitoring in production to get real user metrics:

```typescript
// .env.production
VITE_FEATURE_ANALYTICS=true
VITE_POSTHOG_API_KEY=your-key
```

### 4. Set Performance Budgets

Monitor metrics and set alerts for poor performance:

```typescript
const summary = analytics.getPerformanceSummary();

Object.values(summary.webVitals).forEach(metric => {
  if (metric.rating === 'poor') {
    // Send alert or log warning
    console.warn(`Poor ${metric.name}: ${metric.value}ms`);
  }
});
```

### 5. Optimize Based on Data

Use the collected metrics to identify and fix performance issues:

- High LCP? Optimize images and critical resources
- High CLS? Fix layout shifts and reserve space for dynamic content
- High FID/INP? Reduce JavaScript execution time
- High TTFB? Optimize server response time

## Debugging

Enable debug mode to see performance metrics in the console:

```typescript
// .env.development
VITE_APP_ENV=development
```

This will log all tracked metrics:

```
[Analytics] Web Vitals tracked: { name: 'LCP', value: 2300, rating: 'good' }
[Analytics] Page load metrics tracked: { loadComplete: 1500, ... }
```

## Browser Support

Performance monitoring uses the following APIs:
- Performance Observer API
- Navigation Timing API
- Resource Timing API
- Paint Timing API

These are supported in all modern browsers. The system gracefully degrades in older browsers.

## Troubleshooting

### Metrics Not Being Tracked

1. Check that analytics is initialized:
   ```typescript
   analytics.initialize();
   ```

2. Verify analytics is enabled:
   ```typescript
   // Check .env file
   VITE_FEATURE_ANALYTICS=true
   ```

3. Check browser console for errors

### Metrics Show as Undefined

Some metrics are only available after certain events:
- CLS, LCP, INP: Reported when page visibility changes
- FID: Reported after first user interaction
- Page load metrics: Available after page load completes

### High Metric Values

If you see consistently high values:
1. Check network conditions
2. Optimize images and resources
3. Reduce JavaScript bundle size
4. Enable code splitting
5. Use lazy loading for non-critical content

## Related Documentation

- [Analytics Integration Guide](./ANALYTICS_QUICK_START.md)
- [Analytics Implementation Summary](./ANALYTICS_IMPLEMENTATION_SUMMARY.md)
- [Performance Testing Guide](./PERFORMANCE_TESTING.md)

## References

- [Web Vitals](https://web.dev/vitals/)
- [Core Web Vitals](https://web.dev/vitals/#core-web-vitals)
- [Performance Observer API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)
- [Navigation Timing API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_timing_API)
