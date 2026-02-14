# UX Friction Detection

Comprehensive UX friction detection system that automatically identifies and tracks user experience pain points.

## Overview

The friction detection system monitors user interactions to identify three critical UX friction types:

1. **Form Abandonment** - Users start filling forms but don't complete them
2. **Rage Clicks** - Users rapidly click elements indicating frustration
3. **Dead Clicks** - Users click elements that appear interactive but aren't

## Features

### 1. Form Abandonment Tracking

Automatically detects when users abandon forms before submission.

**Detection Criteria:**
- User has interacted with at least one form field
- Minimum interaction time threshold met (default: 5 seconds)
- 30 seconds of inactivity after last interaction
- Form not submitted

**Tracked Metrics:**
- Total form fields
- Fields interacted with
- Fields filled (with values)
- Completion rate percentage
- Time spent on form
- Last field interacted with

**Severity Levels:**
- **High**: >75% completion (user was almost done)
- **Medium**: 25-75% completion
- **Low**: <25% completion

### 2. Rage Click Detection

Detects rapid repeated clicks on the same element, indicating user frustration.

**Detection Criteria:**
- 3+ clicks on same element (configurable)
- Within 1 second time window (configurable)
- Tracks click coordinates

**Use Cases:**
- Unresponsive buttons
- Slow loading interactions
- Broken click handlers
- Unclear UI feedback

### 3. Dead Click Detection

Identifies elements that look clickable but have no functionality.

**Detection Criteria:**
- Element has cursor: pointer style
- Element has "clickable" related classes
- Element has no actual click handler
- Not a standard interactive element (button, link)

**Common Issues:**
- Styled divs that look like buttons
- Decorative elements with pointer cursor
- Incomplete implementations

## Installation

The friction detector is automatically initialized when session replay is enabled:

```typescript
import { initializeAnalytics } from '@/utils/analytics';

initializeAnalytics({
  sessionReplay: {
    enabled: true,
    provider: 'hotjar', // or 'fullstory'
  },
});
```

## Usage

### Basic Usage with React Hook

```typescript
import { useFrictionDetection } from '@/hooks/useFrictionDetection';

function MyComponent() {
  const { 
    frictionEvents, 
    summary, 
    getHighSeverityEvents,
    clearEvents 
  } = useFrictionDetection({
    enabled: true,
    autoInitialize: true,
  });

  return (
    <div>
      <h2>Friction Events: {summary.total}</h2>
      <p>Form Abandonments: {summary.byType.form_abandonment || 0}</p>
      <p>Rage Clicks: {summary.byType.rage_click || 0}</p>
      <p>Dead Clicks: {summary.byType.dead_click || 0}</p>
      
      {getHighSeverityEvents().length > 0 && (
        <Alert>High severity issues detected!</Alert>
      )}
    </div>
  );
}
```

### Direct API Usage

```typescript
import { frictionDetector } from '@/utils/analytics/frictionDetection';

// Initialize with custom config
frictionDetector.initialize();

// Get all friction events
const events = frictionDetector.getFrictionEvents();

// Get events by type
const formAbandonments = frictionDetector.getFrictionEvents('form_abandonment');
const rageClicks = frictionDetector.getFrictionEvents('rage_click');
const deadClicks = frictionDetector.getFrictionEvents('dead_click');

// Get summary
const summary = frictionDetector.getFrictionSummary();
console.log(summary);
// {
//   total: 5,
//   byType: { form_abandonment: 2, rage_click: 2, dead_click: 1 },
//   bySeverity: { high: 2, medium: 2, low: 1 }
// }

// Clear events
frictionDetector.clearEvents();

// Cleanup
frictionDetector.destroy();
```

## Configuration

### Custom Configuration

```typescript
import { FrictionDetector } from '@/utils/analytics/frictionDetection';

const detector = new FrictionDetector({
  // Form abandonment config
  formAbandonment: {
    enabled: true,
    minInteractionTime: 3000, // 3 seconds
    trackPartialFills: true,
    excludeForms: ['newsletter-form', 'search-form'],
  },
  
  // Rage click config
  rageClick: {
    enabled: true,
    threshold: 5, // 5 clicks
    timeWindow: 2000, // 2 seconds
    excludeElements: ['.carousel-button', '.slider-control'],
  },
  
  // Dead click config
  deadClick: {
    enabled: true,
    excludeElements: ['.decorative-element'],
  },
  
  // Custom event handler
  onFrictionDetected: (event) => {
    console.log('Friction detected:', event);
    
    // Send to your analytics service
    if (event.severity === 'high') {
      sendAlert(event);
    }
  },
});

detector.initialize();
```

## Event Structure

### FrictionEvent Type

```typescript
interface FrictionEvent {
  type: 'form_abandonment' | 'rage_click' | 'dead_click';
  severity: 'low' | 'medium' | 'high';
  element?: string;
  metadata?: Record<string, unknown>;
  timestamp: number;
}
```

### Form Abandonment Event

```typescript
{
  type: 'form_abandonment',
  severity: 'high',
  element: 'checkout-form',
  metadata: {
    form_id: 'checkout-form',
    total_fields: 8,
    fields_interacted: 7,
    filled_fields: 6,
    completion_rate: 75,
    duration_seconds: 45,
    last_field: 'credit-card-number'
  },
  timestamp: 1234567890
}
```

### Rage Click Event

```typescript
{
  type: 'rage_click',
  severity: 'high',
  element: 'submit-button',
  metadata: {
    identifier: 'submit-button',
    tagName: 'button',
    id: 'submit-btn',
    className: 'btn btn-primary',
    text: 'Submit Order',
    click_count: 5,
    time_window_ms: 1000,
    coordinates: [
      { x: 100, y: 200 },
      { x: 101, y: 201 },
      // ...
    ]
  },
  timestamp: 1234567890
}
```

### Dead Click Event

```typescript
{
  type: 'dead_click',
  severity: 'medium',
  element: 'clickable-div',
  metadata: {
    identifier: 'clickable-div',
    tagName: 'div',
    className: 'clickable card',
    text: 'Click here for more info',
    warning: 'Element appears clickable but has no handler'
  },
  timestamp: 1234567890
}
```

## Integration with Analytics

Friction events are automatically tracked in your analytics platform:

```typescript
// Events are sent to PostHog/Google Analytics
analytics.trackCustomEvent({
  category: 'ux_friction',
  action: 'form_abandonment',
  label: 'checkout-form',
  value: 75, // completion rate
  metadata: { /* event details */ }
});
```

## Integration with Session Replay

Friction events are automatically tagged in session replay tools:

```typescript
// Hotjar/FullStory tags
sessionReplay.tagRecording([
  'form-abandonment',
  'ux-friction',
  'severity-high'
]);

// Track interaction
sessionReplay.trackInteraction('form_abandonment', metadata);
```

## Best Practices

### 1. Exclude Expected Behaviors

```typescript
formAbandonment: {
  excludeForms: [
    'search-form',      // Users often don't submit search
    'newsletter-popup', // High abandonment is normal
  ]
}
```

### 2. Adjust Thresholds for Your App

```typescript
rageClick: {
  threshold: 5,  // Increase for games/interactive apps
  timeWindow: 2000, // Longer window for slower interactions
}
```

### 3. Monitor High Severity Events

```typescript
onFrictionDetected: (event) => {
  if (event.severity === 'high') {
    // Send immediate alert
    sendSlackNotification(event);
    
    // Log for review
    logToErrorTracking(event);
  }
}
```

### 4. Review Friction Patterns

```typescript
// Analyze friction by page
const checkoutFriction = events.filter(e => 
  e.metadata?.form_id?.includes('checkout')
);

// Identify problematic elements
const frequentRageClicks = events
  .filter(e => e.type === 'rage_click')
  .reduce((acc, e) => {
    const el = e.element || 'unknown';
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {});
```

## Demo Page

Visit `/friction-detection-demo` to see the friction detection in action with interactive examples.

## Testing

Run the test suite:

```bash
npm run test -- src/utils/analytics/frictionDetection.test.ts
```

## Performance Considerations

- **Minimal Overhead**: Event listeners use passive mode where possible
- **Efficient Cleanup**: Automatic cleanup of old click history
- **Throttled Checks**: Form abandonment checks run every 10 seconds
- **Memory Management**: Events are stored in memory; clear periodically

## Browser Support

- Modern browsers with ES6+ support
- Requires DOM event listeners
- Works with all major frameworks (React, Vue, Angular)

## Troubleshooting

### Forms Not Being Tracked

1. Ensure form has an ID or name attribute
2. Check if form is in excludeForms list
3. Verify minInteractionTime threshold is appropriate

### False Positive Rage Clicks

1. Increase threshold for interactive elements
2. Add elements to excludeElements list
3. Adjust timeWindow for slower interactions

### Dead Clicks Not Detected

1. Verify element has cursor: pointer or clickable class
2. Check if element is properly styled
3. Ensure element is not a child of interactive element

## Related Documentation

- [Session Replay](./sessionReplay.ts)
- [Interaction Tracking](./interactionTracking.ts)
- [Analytics Manager](./analyticsManager.ts)
- [Behavior Tracking](./behavior.ts)

## Support

For issues or questions, please refer to the main analytics documentation or create an issue in the project repository.
