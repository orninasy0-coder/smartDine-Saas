# Session Replay Tools Implementation

## Overview

This document describes the implementation of session replay tools for the SmartDine SaaS platform. Session replay allows you to record and replay user sessions to understand user behavior, debug issues, and improve UX.

## Features Implemented

### 1. Session Recording Integration (Task 20.1.1)

Integrated support for two major session replay providers:

#### Hotjar Integration
- **Features**: Session recording, heatmaps, feedback polls
- **Configuration**: Site ID and version
- **API Methods**:
  - `identify()` - Identify users
  - `event()` - Track custom events
  - `tagRecording()` - Tag sessions for filtering
  - `stateChange()` - Track SPA navigation

#### FullStory Integration
- **Features**: Session recording, advanced analytics, search
- **Configuration**: Organization ID
- **API Methods**:
  - `identify()` - Identify users
  - `event()` - Track custom events
  - `setUserVars()` - Set user properties
  - `log()` - Custom logging
  - `getCurrentSessionURL()` - Get session replay URL

### 2. User Interaction Tracking (Task 20.1.2)

Automatic tracking of user interactions:

#### Click Tracking
- All click events with element information
- XPath generation for precise element identification
- Element attributes and text content

#### Form Interaction Tracking
- Form submissions with action and method
- Form field focus/blur events
- Field value presence (without capturing actual values)

#### Scroll Depth Tracking
- Configurable thresholds (default: 25%, 50%, 75%, 100%)
- Automatic tracking of scroll milestones
- Per-page scroll depth tracking

#### UX Friction Detection
- **Rage Clicks**: Multiple rapid clicks on same element (indicates frustration)
- **Dead Clicks**: Clicks on non-interactive elements that appear clickable
- Automatic tagging of sessions with friction events

### 3. Error Session Replay (Task 20.1.3)

Comprehensive error tracking integrated with session replay:

#### Error Capture
- Unhandled JavaScript errors
- Unhandled promise rejections
- Console errors
- Network errors (failed HTTP requests)
- React Error Boundary errors

#### Error Context
- Component stack traces
- User actions leading to error
- Current route and URL
- Viewport dimensions
- User agent information
- Error count and history

#### Error Storm Detection
- Detects when multiple errors occur rapidly
- Automatically tags sessions experiencing error storms
- Helps identify critical issues

## File Structure

```
src/
├── utils/
│   └── analytics/
│       ├── providers/
│       │   ├── hotjar.ts              # Hotjar provider implementation
│       │   └── fullstory.ts           # FullStory provider implementation
│       ├── sessionReplay.ts           # Session replay manager
│       ├── interactionTracking.ts     # User interaction tracker
│       ├── errorTracking.ts           # Error tracker
│       ├── types.ts                   # TypeScript types
│       └── index.ts                   # Main export
└── components/
    └── common/
        └── ErrorBoundaryWithReplay.tsx # React Error Boundary
```

## Configuration

### Environment Variables

Add to your `.env` file:

```env
# Session Replay - Hotjar
VITE_HOTJAR_SITE_ID=your_site_id
VITE_HOTJAR_VERSION=6

# Session Replay - FullStory
VITE_FULLSTORY_ORG_ID=your_org_id

# Analytics (existing)
VITE_POSTHOG_API_KEY=your_api_key
VITE_GA_MEASUREMENT_ID=your_measurement_id
```

### Analytics Configuration

```typescript
import { initializeAnalytics } from '@/utils/analytics';

initializeAnalytics({
  provider: 'posthog',
  debug: true,
  sessionReplay: {
    enabled: true,
    provider: 'hotjar', // or 'fullstory'
    hotjar: {
      siteId: 123456,
      version: 6,
    },
    maskAllInputs: true,      // Mask sensitive input fields
    maskAllText: false,        // Don't mask all text
    recordCrossOriginIframes: false,
  },
});
```

## Usage Examples

### Basic Setup

```typescript
// In your main App.tsx or index.tsx
import { initializeAnalytics, interactionTracker, errorTracker } from '@/utils/analytics';

// Initialize analytics with session replay
initializeAnalytics({
  sessionReplay: {
    enabled: true,
    provider: 'hotjar',
    hotjar: {
      siteId: parseInt(import.meta.env.VITE_HOTJAR_SITE_ID),
      version: 6,
    },
  },
});

// Initialize interaction tracking
interactionTracker.initialize();

// Initialize error tracking
errorTracker.initialize();
```

### Identify Users

```typescript
import { analytics } from '@/utils/analytics';

// After user logs in
analytics.setUserProperties({
  userId: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
  plan: user.subscription.plan,
});
```

### Track Custom Events

```typescript
import { sessionReplay } from '@/utils/analytics';

// Track important user actions
sessionReplay.trackInteraction('checkout_started', {
  cartValue: 99.99,
  itemCount: 3,
});

// Track navigation
sessionReplay.trackNavigation('/checkout', {
  previousPage: '/cart',
});
```

### Tag Sessions

```typescript
import { sessionReplay } from '@/utils/analytics';

// Tag sessions for easier filtering
sessionReplay.tagRecording(['premium-user', 'checkout-flow']);

// Tag sessions with issues
sessionReplay.tagRecording(['payment-failed', 'needs-review']);
```

### Error Boundary Integration

```typescript
import { ErrorBoundaryWithReplay } from '@/components/common/ErrorBoundaryWithReplay';

function App() {
  return (
    <ErrorBoundaryWithReplay
      showSessionUrl={true}
      onError={(error, errorInfo) => {
        console.error('App error:', error, errorInfo);
      }}
    >
      <YourApp />
    </ErrorBoundaryWithReplay>
  );
}
```

### Manual Error Tracking

```typescript
import { errorTracker } from '@/utils/analytics';

try {
  // Your code
  processPayment();
} catch (error) {
  errorTracker.captureErrorWithAction(
    error as Error,
    'process_payment',
    {
      amount: 99.99,
      paymentMethod: 'credit_card',
    }
  );
}
```

### Get Session URL (FullStory only)

```typescript
import { sessionReplay } from '@/utils/analytics';

// Get current session URL for support tickets
const sessionUrl = sessionReplay.getSessionURL();
if (sessionUrl) {
  console.log('Session replay:', sessionUrl);
  // Include in support ticket
}
```

## Advanced Features

### Custom Interaction Tracking

```typescript
import { InteractionTracker } from '@/utils/analytics/interactionTracking';

const tracker = new InteractionTracker({
  trackClicks: true,
  trackFormSubmissions: true,
  trackScrollDepth: true,
  trackRageClicks: true,
  trackDeadClicks: true,
  scrollDepthThresholds: [10, 25, 50, 75, 90, 100],
  rageClickThreshold: 3,
  rageClickTimeWindow: 1000,
});

tracker.initialize();
```

### Custom Error Tracking

```typescript
import { ErrorTracker } from '@/utils/analytics/errorTracking';

const tracker = new ErrorTracker({
  captureUnhandledErrors: true,
  captureUnhandledRejections: true,
  captureConsoleErrors: true,
  captureNetworkErrors: true,
  beforeCapture: (error, context) => {
    // Filter out certain errors
    if (error.message.includes('ResizeObserver')) {
      return false; // Don't capture
    }
    return true; // Capture
  },
  afterCapture: (error, context) => {
    // Send to external service
    console.log('Error captured:', error, context);
  },
});

tracker.initialize();
```

### Error Statistics

```typescript
import { errorTracker } from '@/utils/analytics';

const stats = errorTracker.getErrorStats();
console.log('Total errors:', stats.totalErrors);
console.log('Recent errors:', stats.recentErrors);
console.log('Last error:', stats.lastError);
```

## Privacy Considerations

### Data Masking

Both providers support data masking to protect sensitive information:

```typescript
sessionReplay: {
  enabled: true,
  maskAllInputs: true,        // Mask all input fields
  maskAllText: false,          // Don't mask regular text
  recordCrossOriginIframes: false, // Don't record iframes
}
```

### User Consent

Ensure you have user consent before enabling session replay:

```typescript
import { sessionReplay } from '@/utils/analytics';

// Check cookie consent
if (cookieConsent.analytics) {
  sessionReplay.startRecording();
} else {
  sessionReplay.stopRecording();
}

// Anonymize on logout
sessionReplay.anonymize();
```

### GDPR Compliance

- Always inform users about session recording in your privacy policy
- Provide opt-out mechanism
- Mask sensitive data (passwords, credit cards, etc.)
- Delete recordings upon user request

## Performance Impact

Session replay tools have minimal performance impact:

- **Hotjar**: ~50KB initial load, minimal runtime overhead
- **FullStory**: ~100KB initial load, slightly higher runtime overhead
- **Interaction Tracking**: Negligible overhead (event delegation)
- **Error Tracking**: Only active when errors occur

## Debugging

Enable debug mode to see what's being tracked:

```typescript
initializeAnalytics({
  debug: true,
  sessionReplay: {
    enabled: true,
    provider: 'hotjar',
  },
});
```

Check console for debug messages:
```
[SessionReplay] Initialized with provider: hotjar
[InteractionTracker] Initialized
[ErrorTracker] Initialized
[Hotjar] User identified: user123
[InteractionTracker] Click tracked: button.primary
```

## Best Practices

1. **Tag Important Sessions**: Tag sessions with user segments, features used, or issues encountered
2. **Track Key Interactions**: Focus on critical user flows (checkout, signup, etc.)
3. **Monitor Error Rates**: Set up alerts for error storms
4. **Review Rage Clicks**: Identify UX friction points
5. **Respect Privacy**: Always mask sensitive data
6. **Optimize Performance**: Load session replay scripts asynchronously
7. **Use Error Context**: Include relevant context when tracking errors

## Troubleshooting

### Session Replay Not Working

1. Check if provider is initialized:
```typescript
console.log(sessionReplay.isActive()); // Should be true
```

2. Verify configuration:
```typescript
console.log(sessionReplay.getProvider()); // 'hotjar' or 'fullstory'
```

3. Check browser console for errors

### Interactions Not Being Tracked

1. Ensure tracker is initialized:
```typescript
interactionTracker.initialize();
```

2. Check if session replay is enabled
3. Verify event listeners are attached

### Errors Not Being Captured

1. Ensure error tracker is initialized:
```typescript
errorTracker.initialize();
```

2. Check if errors are being filtered by `beforeCapture`
3. Verify error tracking is enabled in config

## Integration with Existing Analytics

Session replay integrates seamlessly with existing analytics:

```typescript
import { analytics, sessionReplay } from '@/utils/analytics';

// Track event in both analytics and session replay
analytics.trackEvent({
  category: 'Checkout',
  action: 'payment_completed',
  value: 99.99,
});

sessionReplay.trackInteraction('payment_completed', {
  amount: 99.99,
});
```

## Next Steps

1. **Configure Provider**: Choose Hotjar or FullStory and add credentials
2. **Enable in Production**: Test in staging first
3. **Set Up Alerts**: Configure alerts for error storms
4. **Review Sessions**: Regularly review sessions with errors or friction
5. **Optimize UX**: Use insights to improve user experience

## Resources

- [Hotjar Documentation](https://help.hotjar.com/)
- [FullStory Documentation](https://help.fullstory.com/)
- [Session Replay Best Practices](https://www.hotjar.com/session-recordings/best-practices/)
- [Privacy and GDPR Compliance](https://www.hotjar.com/privacy/)
