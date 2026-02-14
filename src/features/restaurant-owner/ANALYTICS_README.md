# Analytics Feature - Restaurant Owner Dashboard

## Overview

The Analytics feature provides comprehensive data visualization for restaurant owners to track business performance, including revenue trends, order volumes, and top-performing dishes.

## Components

### AnalyticsCharts

Main container component that orchestrates all analytics visualizations with tabbed navigation.

**Features:**
- Period selector (Last 7 Days, Last 30 Days, Last 12 Months)
- Tabbed interface for different analytics views
- Responsive layout
- Loading states

**Usage:**
```tsx
import { AnalyticsCharts } from '@/features/restaurant-owner';

<AnalyticsCharts
  data={analyticsData}
  isLoading={false}
  onPeriodChange={(period) => console.log(period)}
/>
```

### RevenueChart

Line chart displaying revenue trends over time.

**Features:**
- Interactive line chart with hover tooltips
- Total and average revenue display
- Currency formatting
- Date formatting
- Empty state handling
- Loading skeleton

**Data Format:**
```typescript
interface RevenueData {
  date: string; // ISO date string
  revenue: number;
}
```

### OrderVolumeChart

Bar chart showing order volume trends.

**Features:**
- Interactive bar chart with hover tooltips
- Total, average, and peak order statistics
- Rounded bar corners for modern look
- Empty state handling
- Loading skeleton

**Data Format:**
```typescript
interface OrderVolumeData {
  date: string; // ISO date string
  orders: number;
}
```

### TopDishesDisplay

List view of top-performing dishes ranked by orders and revenue.

**Features:**
- Ranked list with visual badges (gold, silver, bronze for top 3)
- Dish images with fallback
- Order count and revenue display
- Trophy icons for top performers
- Empty state handling
- Loading skeleton

**Data Format:**
```typescript
interface TopDish {
  id: string;
  name: string;
  orders: number;
  revenue: number;
  imageUrl?: string;
}
```

## Pages

### Analytics

Full analytics page with mock data generator for development.

**Route:** `/dashboard/analytics`

**Features:**
- Page header with description
- Period selection with automatic data refresh
- Mock data generation for all periods
- Loading state simulation

## Types

### AnalyticsData
```typescript
interface AnalyticsData {
  revenueData: RevenueData[];
  orderVolumeData: OrderVolumeData[];
  topDishes: TopDish[];
  period: 'week' | 'month' | 'year';
}
```

### AnalyticsPeriodOption
```typescript
interface AnalyticsPeriodOption {
  label: string;
  value: 'week' | 'month' | 'year';
}
```

## Dependencies

### Recharts
The analytics feature uses [Recharts](https://recharts.org/) for data visualization.

**Installed version:** Latest
**Components used:**
- LineChart (revenue trends)
- BarChart (order volume)
- CartesianGrid, XAxis, YAxis, Tooltip, Legend
- ResponsiveContainer

## Styling

- Uses shadcn/ui Card component for containers
- Responsive design with proper spacing
- Loading skeletons for better UX
- Consistent color scheme using CSS variables
- Lucide icons for visual indicators
- Hover effects on interactive elements

## Backend Integration

Currently using mock data. When backend is ready:

### 1. Create Analytics Service

```typescript
// services/analyticsService.ts
export async function fetchAnalytics(
  restaurantId: string,
  period: 'week' | 'month' | 'year'
): Promise<AnalyticsData> {
  const response = await fetch(
    `/api/v1/analytics?restaurantId=${restaurantId}&period=${period}`
  );
  return response.json();
}
```

### 2. Use React Query

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchAnalytics } from '../services/analyticsService';

const { data, isLoading } = useQuery({
  queryKey: ['analytics', restaurantId, period],
  queryFn: () => fetchAnalytics(restaurantId, period),
});
```

### 3. Expected API Response

```json
{
  "status": "success",
  "data": {
    "revenueData": [
      { "date": "2024-01-01", "revenue": 1200 }
    ],
    "orderVolumeData": [
      { "date": "2024-01-01", "orders": 25 }
    ],
    "topDishes": [
      {
        "id": "1",
        "name": "Grilled Salmon",
        "orders": 145,
        "revenue": 2175,
        "imageUrl": "https://..."
      }
    ]
  }
}
```

## Routing

Add to your router configuration:

```tsx
import { Analytics } from '@/features/restaurant-owner';

<Route path="/dashboard/analytics" element={<Analytics />} />
```

## Authentication

Ensure the analytics route is protected and only accessible to users with `RESTAURANT_OWNER` role.

## Performance Considerations

1. **Data Caching**: Use React Query to cache analytics data
2. **Lazy Loading**: Charts are only rendered when their tab is active
3. **Responsive Charts**: ResponsiveContainer ensures charts adapt to screen size
4. **Optimized Re-renders**: Period changes trigger loading state to prevent UI jank

## Accessibility

- Proper ARIA labels on interactive elements
- Keyboard navigation support in tabs and selects
- Color contrast meets WCAG 2.1 AA standards
- Screen reader friendly chart descriptions

## Future Enhancements

1. **Export Functionality**: Download charts as images or data as CSV
2. **Date Range Picker**: Custom date range selection
3. **Comparison Mode**: Compare current period with previous period
4. **Real-time Updates**: WebSocket integration for live data
5. **Advanced Filters**: Filter by category, time of day, day of week
6. **Predictive Analytics**: AI-powered insights and forecasts
7. **Custom Metrics**: Allow owners to define custom KPIs
8. **Drill-down Views**: Click on data points for detailed breakdowns

## Testing

### Unit Tests
```typescript
// Test data formatting
describe('RevenueChart', () => {
  it('formats currency correctly', () => {
    // Test implementation
  });
});
```

### Integration Tests
```typescript
// Test period changes
describe('Analytics Page', () => {
  it('updates data when period changes', () => {
    // Test implementation
  });
});
```

## Troubleshooting

### Charts not rendering
- Ensure Recharts is installed: `npm install recharts`
- Check that data arrays are not empty
- Verify ResponsiveContainer has a defined height

### Type errors
- Use type-only imports for TypeScript types
- Ensure all required fields are present in data objects

### Performance issues
- Limit data points (max 365 for year view)
- Use React.memo for chart components if needed
- Implement virtualization for large top dishes lists

## Related Documentation

- [Dashboard Stats Component](./README.md)
- [Menu Management](./MENU_MANAGEMENT_README.md)
- [Recharts Documentation](https://recharts.org/)
- [shadcn/ui Components](https://ui.shadcn.com/)
