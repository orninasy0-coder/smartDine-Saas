# User Journey Mapping Implementation

## Overview

This document describes the implementation of user journey mapping functionality for the SmartDine SaaS platform. The feature tracks and analyzes user paths through the application, providing insights into user behavior patterns, common flows, and optimization opportunities.

## Features Implemented

### 1. Path Analysis (`userJourney.ts`)

**Core Functionality:**
- Track user navigation paths through the application
- Record step-by-step journey with timestamps and metadata
- Calculate duration between steps
- Identify entry and exit points
- Detect drop-off points for incomplete journeys
- Analyze common path patterns
- Store journey data in localStorage for persistence

**Key Classes:**
- `UserJourneyTracker`: Main class for tracking user journeys
- `PathAnalyzer`: Utility class for analyzing journey patterns
- `JourneySegmentation`: Utility class for segmenting journeys by various criteria

**Features:**
- Session-based journey tracking
- Automatic step duration calculation
- Journey completion tracking
- Path pattern analysis
- Entry/exit point tracking
- Drop-off point identification
- Journey history management
- LocalStorage persistence

### 2. User Flow Visualization (`UserFlowVisualization.tsx`)

**Component Features:**
- Visual representation of user flows
- Top user paths display with completion rates
- Entry point analysis with percentage bars
- Transition tracking between pages
- Flow statistics (total journeys, unique pages, transitions)
- Path completion rate indicators
- Average duration display

**Visualization Elements:**
- Flow statistics cards
- Top paths with step-by-step visualization
- Entry points with progress bars
- Transition flows with percentages
- Color-coded completion rates (green/yellow/red)

### 3. Cohort Behavior Analysis (`cohortAnalysis.ts`)

**Core Functionality:**
- Create and manage user cohorts
- Define cohort criteria (signup date, user properties, behavior patterns, custom filters)
- Auto-assign users to cohorts based on criteria
- Track user journeys per cohort
- Calculate cohort metrics (retention, completion, conversion rates)
- Compare cohorts side-by-side
- Track cohort retention over time

**Cohort Types:**
- Signup date cohorts
- User property cohorts (plan, age, etc.)
- Behavior pattern cohorts (action frequency)
- Custom filter cohorts

**Metrics Tracked:**
- Total users
- Active users
- Retention rate
- Average session duration
- Average journeys per user
- Completion rate
- Conversion rate
- Common paths
- Top features used

### 4. React Hook (`useUserJourney.ts`)

**Hook Features:**
- Automatic page view tracking with React Router
- Manual step tracking
- Journey start/end management
- Journey history access
- Analytics data retrieval
- Cleanup on unmount

**API:**
```typescript
const {
  trackStep,           // Track custom step
  endJourney,          // End current journey
  startNewJourney,     // Start new journey
  getCurrentJourney,   // Get active journey
  getJourneyHistory,   // Get all journeys
  analyzeJourneys,     // Get analytics
  clearData,           // Clear all data
} = useUserJourney(options);
```

### 5. Demo Page (`UserJourneyDemo.tsx`)

**Features:**
- Journey simulation
- Real-time journey tracking display
- Flow visualization
- Cohort management interface
- Cohort metrics display
- Journey insights
- Bottleneck identification
- Drop-off point analysis

**Tabs:**
- Overview: Current journey and statistics
- User Flows: Visual flow representation
- Cohorts: Cohort management and metrics
- Insights: Drop-off points and bottlenecks

## Usage Examples

### Basic Journey Tracking

```typescript
import { userJourneyTracker } from '@/utils/analytics/userJourney';

// Track a step
userJourneyTracker.trackStep('/products', {
  category: 'electronics',
  source: 'search',
});

// End journey
userJourneyTracker.endJourney(true, '/checkout');

// Get analytics
const analytics = userJourneyTracker.analyzeJourneys();
console.log('Total journeys:', analytics.totalJourneys);
console.log('Completion rate:', analytics.completedJourneys / analytics.totalJourneys);
```

### Using the React Hook

```typescript
import { useUserJourney } from '@/hooks/useUserJourney';

function MyComponent() {
  const { trackStep, getCurrentJourney, analyzeJourneys } = useUserJourney({
    enabled: true,
    trackPageViews: true, // Auto-track with React Router
    userId: 'user123',
  });

  const handleAction = () => {
    trackStep('/custom-action', { action: 'button_click' });
  };

  return <button onClick={handleAction}>Track Action</button>;
}
```

### Creating Cohorts

```typescript
import { cohortAnalyzer, CohortBuilders } from '@/utils/analytics/cohortAnalysis';

// Create cohort by signup date
const newUsers = CohortBuilders.bySignupDate(
  cohortAnalyzer,
  'New Users',
  Date.now() - 7 * 24 * 60 * 60 * 1000,
  Date.now()
);

// Create cohort by user property
const premiumUsers = CohortBuilders.byUserProperty(
  cohortAnalyzer,
  'Premium Users',
  'plan',
  'premium'
);

// Create cohort by behavior
const activeUsers = CohortBuilders.byBehavior(
  cohortAnalyzer,
  'Active Users',
  'page_view',
  10
);

// Auto-assign users
const userMetadata = new Map([
  ['user1', { signupDate: Date.now(), plan: 'premium' }],
  ['user2', { signupDate: Date.now() - 10 * 24 * 60 * 60 * 1000, plan: 'basic' }],
]);
cohortAnalyzer.autoAssignUsers(userMetadata);

// Get cohort metrics
const metrics = cohortAnalyzer.calculateCohortMetrics(newUsers.id);
console.log('Retention rate:', metrics?.retentionRate);
```

### Path Analysis

```typescript
import { PathAnalyzer } from '@/utils/analytics/userJourney';

const journeys = userJourneyTracker.getJourneyHistory();

// Find common paths between two points
const paths = PathAnalyzer.findCommonPaths(journeys, '/home', '/checkout');

// Identify bottlenecks
const bottlenecks = PathAnalyzer.identifyBottlenecks(journeys);
bottlenecks.forEach((duration, path) => {
  console.log(`${path}: ${duration}ms average`);
});

// Find alternative paths
const alternatives = PathAnalyzer.findAlternativePaths(journeys, '/checkout');
```

### Journey Segmentation

```typescript
import { JourneySegmentation } from '@/utils/analytics/userJourney';

const journeys = userJourneyTracker.getJourneyHistory();

// Segment by completion status
const { completed, abandoned } = JourneySegmentation.byCompletionStatus(journeys);

// Segment by duration
const byDuration = JourneySegmentation.byDuration(journeys, {
  fast: 30000,  // 30 seconds
  slow: 120000, // 2 minutes
});

// Segment by path length
const byLength = JourneySegmentation.byPathLength(journeys, {
  short: 3,
  long: 10,
});

// Segment by entry point
const byEntry = JourneySegmentation.byEntryPoint(journeys);
```

## Data Structures

### JourneyStep
```typescript
interface JourneyStep {
  path: string;
  timestamp: number;
  duration?: number;
  metadata?: Record<string, unknown>;
}
```

### JourneyPath
```typescript
interface JourneyPath {
  sessionId: string;
  userId?: string;
  steps: JourneyStep[];
  startTime: number;
  endTime?: number;
  totalDuration?: number;
  completed: boolean;
  exitPoint?: string;
}
```

### JourneyAnalytics
```typescript
interface JourneyAnalytics {
  totalJourneys: number;
  completedJourneys: number;
  averageDuration: number;
  commonPaths: PathPattern[];
  dropOffPoints: Map<string, number>;
  entryPoints: Map<string, number>;
  exitPoints: Map<string, number>;
}
```

### Cohort
```typescript
interface Cohort {
  id: string;
  name: string;
  description?: string;
  criteria: CohortCriteria;
  users: Set<string>;
  createdAt: number;
}
```

### CohortMetrics
```typescript
interface CohortMetrics {
  cohortId: string;
  totalUsers: number;
  activeUsers: number;
  retentionRate: number;
  avgSessionDuration: number;
  avgJourneysPerUser: number;
  completionRate: number;
  commonPaths: string[];
  topFeatures: Map<string, number>;
  conversionRate: number;
}
```

## Testing

All functionality is thoroughly tested with 36 passing tests:

### UserJourneyTracker Tests (10 tests)
- Journey initialization
- Step tracking
- Duration calculation
- Journey completion
- Path string generation
- Pattern analysis
- Entry/exit point tracking
- Drop-off point tracking
- User ID management
- Data clearing

### PathAnalyzer Tests (4 tests)
- Common path finding
- Path efficiency calculation
- Bottleneck identification
- Alternative path discovery

### JourneySegmentation Tests (4 tests)
- Completion status segmentation
- Duration-based segmentation
- Path length segmentation
- Entry point segmentation

### CohortAnalyzer Tests (14 tests)
- Cohort creation
- User management
- Criteria matching (signup date, properties, behavior, custom)
- Auto-assignment
- Metrics calculation
- Cohort comparison
- Retention tracking
- Cohort CRUD operations

### CohortBuilders Tests (4 tests)
- Signup date cohorts
- Property-based cohorts
- Behavior-based cohorts
- Custom filter cohorts

## Performance Considerations

1. **LocalStorage Limits**: Journey history is limited to 100 entries to prevent storage overflow
2. **Memory Management**: Old journeys are automatically removed when limit is reached
3. **Analytics Caching**: Analytics calculations are performed on-demand, not continuously
4. **Efficient Data Structures**: Uses Maps for O(1) lookups in path analysis
5. **Optional Analytics**: Analytics tracking is optional and fails silently if unavailable

## Integration Points

1. **React Router**: Automatic page view tracking via `useLocation` hook
2. **Analytics Manager**: Optional integration with existing analytics system
3. **LocalStorage**: Persistent storage for journey data
4. **UI Components**: shadcn/ui components for visualization

## Future Enhancements

1. **Backend Integration**: Store journey data in database for cross-device tracking
2. **Real-time Updates**: WebSocket integration for live journey monitoring
3. **Advanced Visualizations**: Sankey diagrams, funnel charts, heatmaps
4. **Machine Learning**: Predictive analytics for user behavior
5. **A/B Testing Integration**: Journey comparison across test variants
6. **Export Functionality**: CSV/JSON export for external analysis
7. **Custom Dashboards**: Configurable dashboard widgets
8. **Alerts**: Automated alerts for unusual patterns or drop-offs

## Files Created

1. `src/utils/analytics/userJourney.ts` - Core journey tracking logic
2. `src/utils/analytics/cohortAnalysis.ts` - Cohort analysis functionality
3. `src/components/analytics/UserFlowVisualization.tsx` - Flow visualization component
4. `src/hooks/useUserJourney.ts` - React hook for journey tracking
5. `src/pages/UserJourneyDemo.tsx` - Demo page showcasing all features
6. `src/utils/analytics/userJourney.test.ts` - Journey tracking tests
7. `src/utils/analytics/cohortAnalysis.test.ts` - Cohort analysis tests

## Dependencies

- React 18+
- React Router
- TypeScript
- shadcn/ui components (Card, Button, Tabs)
- Lucide React icons
- Vitest (testing)

## Conclusion

The user journey mapping implementation provides comprehensive tools for tracking, analyzing, and visualizing user behavior patterns. It enables data-driven decision making for UX improvements, conversion optimization, and user retention strategies.
