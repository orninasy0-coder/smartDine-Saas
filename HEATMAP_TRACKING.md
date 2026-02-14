# Heatmap & Click Tracking Implementation

## Overview

This document describes the heatmap and click tracking system implemented for SmartDine SaaS platform. The system provides three types of heatmap tracking:

1. **Click Heatmaps** - Track all user clicks with position data
2. **Scroll Depth Tracking** - Monitor how far users scroll on pages
3. **Attention Heatmaps** - Measure time spent viewing specific elements

## Features

### 1. Click Heatmaps

Tracks every click on the page with detailed information:

- **Position Data**: X/Y coordinates (absolute position on page)
- **Element Information**: Tag name, ID, class name, text content
- **Viewport Context**: Window dimensions at time of click
- **Page Context**: URL and path information
- **Timestamp**: When the click occurred

**Use Cases:**
- Identify most-clicked areas on pages
- Optimize button and CTA placement
- Discover unexpected click patterns
- Validate design assumptions

### 2. Scroll Depth Tracking

Monitors user scrolling behavior:

- **Continuous Tracking**: Records scroll position over time
- **Milestone Detection**: Tracks 25%, 50%, 75%, 100% thresholds
- **Throttled Updates**: Performance-optimized (100ms throttle)
- **Per-Page Analysis**: Separate tracking for each page

**Use Cases:**
- Identify content engagement levels
- Optimize page length and content placement
- Detect where users lose interest
- Measure content effectiveness

### 3. Attention Heatmaps

Tracks time spent viewing elements:

- **Mouse Tracking**: Monitors which elements receive attention
- **Duration Measurement**: Records time spent on each element
- **Minimum Threshold**: Only counts attention > 1 second
- **Aggregated Data**: Combines attention across sessions

**Use Cases:**
- Identify most engaging content
- Optimize content hierarchy
- Detect confusing or ignored elements
- Improve information architecture

## Implementation

### Installation

The heatmap system is already integrated into the analytics framework. No additional installation required.

### Basic Usage

```typescript
import {
  initializeHeatmaps,
  stopHeatmaps,
  clearHeatmapData,
  exportAllHeatmapData,
} from '@/utils/analytics/heatmaps';

// Start tracking all heatmaps
initializeHeatmaps();

// Stop tracking
stopHeatmaps();

// Clear all data
clearHeatmapData();

// Export data for analysis
const data = exportAllHeatmapData();
console.log(data);
```

### Individual Tracker Usage

```typescript
import {
  clickHeatmapTracker,
  scrollDepthTracker,
  attentionHeatmapTracker,
} from '@/utils/analytics/heatmaps';

// Click Heatmap
clickHeatmapTracker.start();
const clicks = clickHeatmapTracker.getClickData();
const pageClicks = clickHeatmapTracker.getClickDataForPage('/menu');
clickHeatmapTracker.stop();

// Scroll Depth
scrollDepthTracker.start();
const scrolls = scrollDepthTracker.getScrollData();
const maxDepth = scrollDepthTracker.getMaxScrollDepth();
scrollDepthTracker.stop();

// Attention Heatmap
attentionHeatmapTracker.start();
const attention = attentionHeatmapTracker.getAttentionData();
const aggregated = attentionHeatmapTracker.getAggregatedAttention();
attentionHeatmapTracker.stop();
```

## Data Structure

### Click Heatmap Data

```typescript
interface ClickHeatmapData {
  x: number;                    // X coordinate (absolute)
  y: number;                    // Y coordinate (absolute)
  timestamp: number;            // Unix timestamp
  elementInfo: {
    tagName: string;            // HTML tag name
    id?: string;                // Element ID
    className?: string;         // CSS classes
    text?: string;              // Text content (truncated)
  };
  viewport: {
    width: number;              // Window width
    height: number;             // Window height
  };
  page: {
    url: string;                // Full URL
    path: string;               // Path only
  };
}
```

### Scroll Heatmap Data

```typescript
interface ScrollHeatmapData {
  depth: number;                // Scroll position in pixels
  percentage: number;           // Scroll percentage (0-100)
  timestamp: number;            // Unix timestamp
  viewport: {
    width: number;              // Window width
    height: number;             // Window height
  };
  page: {
    url: string;                // Full URL
    path: string;               // Path only
  };
}
```

### Attention Heatmap Data

```typescript
interface AttentionHeatmapData {
  elementId: string;            // Element identifier
  duration: number;             // Time in milliseconds
  timestamp: number;            // Unix timestamp
  elementInfo: {
    tagName: string;            // HTML tag name
    id?: string;                // Element ID
    className?: string;         // CSS classes
  };
  viewport: {
    width: number;              // Window width
    height: number;             // Window height
  };
  page: {
    url: string;                // Full URL
    path: string;               // Path only
  };
}
```

## Configuration

### Click Heatmap Tracker

```typescript
const tracker = new ClickHeatmapTracker();
// Default max data points: 1000
```

### Scroll Depth Tracker

```typescript
const tracker = new ScrollDepthTracker();
// Default throttle delay: 100ms
// Default max data points: 500
```

### Attention Heatmap Tracker

```typescript
const tracker = new AttentionHeatmapTracker();
// Default min duration: 1000ms (1 second)
// Default max data points: 500
```

## Performance Considerations

### Memory Management

- **Data Point Limits**: Each tracker has a maximum number of data points
- **Automatic Cleanup**: Old data is removed when limits are reached
- **Efficient Storage**: Only essential data is stored

### Event Throttling

- **Scroll Events**: Throttled to 100ms intervals
- **Mouse Events**: Passive listeners for better performance
- **Attention Tracking**: Only records when duration threshold is met

### Best Practices

1. **Start/Stop Tracking**: Only track when needed
2. **Clear Data Regularly**: Export and clear data periodically
3. **Monitor Memory**: Check data point counts in production
4. **Use Sampling**: Consider sampling for high-traffic pages

## Analytics Integration

All heatmap events are automatically tracked in the analytics system:

```typescript
// Click events
analytics.trackEvent({
  category: 'Heatmap',
  action: 'click',
  label: '/menu',
  metadata: { x, y, element, elementId }
});

// Scroll depth milestones
analytics.trackEvent({
  category: 'Heatmap',
  action: 'scroll_depth',
  label: '/menu',
  value: 75,
  metadata: { depth }
});

// Attention events
analytics.trackEvent({
  category: 'Heatmap',
  action: 'attention',
  label: '/menu',
  value: 5000,
  metadata: { element, elementId }
});
```

## Visualization

### Export Data

```typescript
// Export all data as JSON
const data = exportAllHeatmapData();
const json = JSON.stringify(data, null, 2);

// Download as file
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'heatmap-data.json';
a.click();
```

### Visualization Tools

The exported data can be used with:

- **Hotjar**: Import click and scroll data
- **Crazy Egg**: Visualize heatmaps
- **Custom Tools**: Build your own visualization
- **D3.js**: Create interactive heatmaps
- **Canvas API**: Render heatmap overlays

## Demo Page

Visit `/heatmap-demo` to see the heatmap system in action:

- Real-time tracking statistics
- Interactive demo areas
- Data export functionality
- Visual feedback for all tracking types

## Use Cases by Role

### Product Managers
- Identify feature adoption patterns
- Validate design decisions with data
- Prioritize UI improvements
- Measure content engagement

### UX Designers
- Optimize layout and hierarchy
- Identify usability issues
- Test design hypotheses
- Improve user flows

### Developers
- Debug interaction issues
- Optimize performance
- Validate implementations
- Monitor user behavior

### Marketing
- Optimize landing pages
- Improve conversion rates
- Test CTA placement
- Measure content effectiveness

## Privacy Considerations

### Data Collection

- **No PII**: No personally identifiable information is collected
- **Anonymized**: All data is anonymous by default
- **Opt-out**: Users can disable tracking via cookie preferences
- **Transparent**: Clear disclosure in privacy policy

### Data Storage

- **Client-side**: Data stored in memory only
- **Export Only**: No automatic server transmission
- **Manual Control**: Explicit export required
- **Temporary**: Data cleared on page refresh (unless exported)

### Compliance

- **GDPR**: Compliant with consent requirements
- **CCPA**: Respects user privacy rights
- **Cookie Law**: Disclosed in cookie policy
- **Opt-out**: Respects Do Not Track signals

## Troubleshooting

### No Data Collected

**Problem**: Trackers running but no data collected

**Solutions**:
1. Check if tracking is initialized: `initializeHeatmaps()`
2. Verify analytics is initialized
3. Check browser console for errors
4. Ensure page has scrollable content (for scroll tracking)

### High Memory Usage

**Problem**: Browser using too much memory

**Solutions**:
1. Reduce max data points in tracker configuration
2. Export and clear data more frequently
3. Stop tracking when not needed
4. Use sampling for high-traffic pages

### Inaccurate Scroll Depth

**Problem**: Scroll depth not reaching 100%

**Solutions**:
1. Check page has sufficient content to scroll
2. Verify scroll container is correct
3. Test with different viewport sizes
4. Check for fixed/sticky elements affecting scroll height

## Future Enhancements

### Planned Features

1. **Server-side Storage**: Automatic data persistence
2. **Real-time Visualization**: Live heatmap overlays
3. **A/B Testing Integration**: Compare heatmaps across variants
4. **Funnel Analysis**: Track heatmaps through user journeys
5. **Mobile Gestures**: Track swipes, pinches, and taps
6. **Video Playback**: Replay user sessions with heatmap overlay

### Integration Opportunities

1. **Session Replay**: Combine with session recordings
2. **Error Tracking**: Correlate errors with click patterns
3. **Performance Monitoring**: Link slow interactions to heatmaps
4. **Feature Flags**: A/B test with heatmap comparison

## API Reference

### Functions

#### `initializeHeatmaps()`
Start all heatmap trackers

#### `stopHeatmaps()`
Stop all heatmap trackers

#### `clearHeatmapData()`
Clear all collected data

#### `exportAllHeatmapData()`
Export all data as JSON object

### Classes

#### `ClickHeatmapTracker`
- `start()` - Start tracking clicks
- `stop()` - Stop tracking clicks
- `getClickData()` - Get all click data
- `getClickDataForPage(path)` - Get clicks for specific page
- `clear()` - Clear click data
- `exportData()` - Export as JSON string

#### `ScrollDepthTracker`
- `start()` - Start tracking scroll
- `stop()` - Stop tracking scroll
- `getScrollData()` - Get all scroll data
- `getScrollDataForPage(path)` - Get scrolls for specific page
- `getMaxScrollDepth()` - Get maximum scroll depth reached
- `clear()` - Clear scroll data
- `exportData()` - Export as JSON string

#### `AttentionHeatmapTracker`
- `start()` - Start tracking attention
- `stop()` - Stop tracking attention
- `getAttentionData()` - Get all attention data
- `getAttentionDataForPage(path)` - Get attention for specific page
- `getAggregatedAttention()` - Get aggregated attention by element
- `clear()` - Clear attention data
- `exportData()` - Export as JSON string

## Support

For issues or questions:
1. Check this documentation
2. Review demo page at `/heatmap-demo`
3. Check browser console for errors
4. Contact development team

## License

Part of SmartDine SaaS Platform - Internal Use Only
