# Platform Analytics Integration Guide

## Overview
This guide explains how to integrate the Platform Analytics feature into your SmartDine admin dashboard.

## Quick Start

### 1. Import the Analytics Page
```tsx
import { Analytics } from '@/features/admin';
```

### 2. Add Route to Your Router
```tsx
import { Analytics } from '@/features/admin';
import { ProtectedRoute } from '@/components/auth';

// In your router configuration
<Route
  path="/admin/analytics"
  element={
    <ProtectedRoute requiredRoles={['PLATFORM_ADMIN']}>
      <Analytics />
    </ProtectedRoute>
  }
/>
```

### 3. Add Navigation Link
Add a link to the analytics page in your admin navigation:

```tsx
<nav>
  <Link to="/admin">Dashboard</Link>
  <Link to="/admin/restaurants">Restaurants</Link>
  <Link to="/admin/subscriptions">Subscriptions</Link>
  <Link to="/admin/analytics">Analytics</Link>
</nav>
```

## Using the PlatformAnalytics Component Directly

If you want to embed the analytics component in another page:

```tsx
import { PlatformAnalytics, PlatformAnalyticsData } from '@/features/admin';
import { useState, useEffect } from 'react';

function MyCustomPage() {
  const [data, setData] = useState<PlatformAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch your analytics data
    fetchAnalyticsData()
      .then(setData)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <h1>My Custom Analytics</h1>
      <PlatformAnalytics data={data!} isLoading={isLoading} />
    </div>
  );
}
```

## Backend Integration

### API Endpoint
Create the following endpoint in your backend:

```
GET /api/v1/admin/analytics/platform
```

### Expected Response Format
```json
{
  "revenue": {
    "current": 1245680,
    "previous": 1089450,
    "trend": 14.3,
    "daily": [
      { "date": "2024-01-01", "amount": 165000 },
      { "date": "2024-01-02", "amount": 178000 }
    ],
    "monthly": [
      { "month": "Jan", "amount": 980000 },
      { "month": "Feb", "amount": 1050000 }
    ]
  },
  "orders": {
    "current": 45892,
    "previous": 41250,
    "trend": 11.3,
    "daily": [
      { "date": "2024-01-01", "count": 6200 },
      { "date": "2024-01-02", "count": 6800 }
    ],
    "byStatus": [
      { "status": "Completed", "count": 32124, "percentage": 70 },
      { "status": "In Progress", "count": 6884, "percentage": 15 }
    ]
  },
  "restaurants": {
    "total": 156,
    "active": 142,
    "new": 14,
    "churnRate": 2.8,
    "growth": [
      { "month": "Jan", "count": 120 },
      { "month": "Feb", "count": 128 }
    ]
  },
  "subscriptions": {
    "active": 142,
    "trial": 14,
    "cancelled": 8,
    "mrr": 456780,
    "byPlan": [
      { "plan": "Basic", "count": 45, "revenue": 89550 },
      { "plan": "Pro", "count": 78, "revenue": 273780 }
    ]
  },
  "topRestaurants": [
    {
      "id": "1",
      "name": "The Golden Fork",
      "revenue": 125000,
      "orders": 2450,
      "growth": 18.5
    }
  ]
}
```

### Replace Mock Data in Analytics.tsx

In `src/features/admin/pages/Analytics.tsx`, replace the mock data fetch:

```tsx
const fetchAnalytics = async () => {
  setIsLoading(true);
  try {
    // Replace this with actual API call
    const response = await fetch('/api/v1/admin/analytics/platform', {
      headers: {
        'Authorization': `Bearer ${yourAuthToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }
    
    const data = await response.json();
    setAnalyticsData(data);
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    toast.error('Failed to load analytics data');
  } finally {
    setIsLoading(false);
  }
};
```

## Data Requirements

### Revenue Data
- **current**: Total revenue for current period (number)
- **previous**: Total revenue for previous period (number)
- **trend**: Percentage change (positive or negative number)
- **daily**: Array of last 7 days with date and amount
- **monthly**: Array of last 6 months with month name and amount

### Orders Data
- **current**: Total orders for current period (number)
- **previous**: Total orders for previous period (number)
- **trend**: Percentage change (positive or negative number)
- **daily**: Array of last 7 days with date and count
- **byStatus**: Array of order statuses with count and percentage

### Restaurants Data
- **total**: Total number of restaurants (number)
- **active**: Number of active restaurants (number)
- **new**: Number of new restaurants this month (number)
- **churnRate**: Churn rate percentage (number)
- **growth**: Array of last 6 months with month name and count

### Subscriptions Data
- **active**: Number of active subscriptions (number)
- **trial**: Number of trial subscriptions (number)
- **cancelled**: Number of cancelled subscriptions this month (number)
- **mrr**: Monthly recurring revenue (number)
- **byPlan**: Array of plans with name, count, and revenue

### Top Restaurants
Array of top 5 restaurants with:
- **id**: Restaurant ID (string)
- **name**: Restaurant name (string)
- **revenue**: Total revenue (number)
- **orders**: Total orders (number)
- **growth**: Growth percentage (number, can be negative)

## Customization

### Change Number of Days/Months
To change the number of days or months displayed in charts, modify the data structure in your backend to return more or fewer data points.

### Add More Metrics
To add additional metrics:

1. Update the `PlatformAnalyticsData` type in `src/features/admin/types/index.ts`
2. Add new metric cards or charts in `PlatformAnalytics.tsx`
3. Update your backend to return the new data

### Custom Colors
To customize chart colors, modify the color classes in `PlatformAnalytics.tsx`:

```tsx
// Revenue chart
className="w-full bg-primary rounded-t-md"

// Orders chart
className="w-full bg-blue-500 rounded-t-md"

// Restaurant growth chart
className="w-full bg-emerald-500 rounded-t-md"
```

### Export Functionality
To implement the export feature:

```tsx
const handleExport = async () => {
  try {
    const response = await fetch('/api/v1/admin/analytics/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${yourAuthToken}`,
      },
      body: JSON.stringify({
        format: 'pdf', // or 'csv'
        dateRange: 'last30days',
      }),
    });
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString()}.pdf`;
    a.click();
    
    toast.success('Report exported successfully');
  } catch (error) {
    toast.error('Failed to export report');
  }
};
```

## Real-time Updates

To add real-time updates using WebSocket:

```tsx
useEffect(() => {
  // Initial fetch
  fetchAnalytics();
  
  // Set up WebSocket connection
  const ws = new WebSocket('wss://your-api.com/admin/analytics');
  
  ws.onmessage = (event) => {
    const updatedData = JSON.parse(event.data);
    setAnalyticsData(updatedData);
  };
  
  // Cleanup
  return () => {
    ws.close();
  };
}, []);
```

## Performance Optimization

### Caching
Implement caching to reduce API calls:

```tsx
import { useQuery } from '@tanstack/react-query';

function Analytics() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['platform-analytics'],
    queryFn: fetchAnalytics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  return (
    <PlatformAnalytics 
      data={data} 
      isLoading={isLoading}
    />
  );
}
```

### Lazy Loading
For better performance, consider lazy loading the analytics page:

```tsx
import { lazy, Suspense } from 'react';

const Analytics = lazy(() => import('@/features/admin/pages/Analytics'));

// In your router
<Route
  path="/admin/analytics"
  element={
    <Suspense fallback={<LoadingSpinner />}>
      <Analytics />
    </Suspense>
  }
/>
```

## Troubleshooting

### Charts Not Displaying
- Ensure data arrays are not empty
- Check that date/month strings are properly formatted
- Verify numeric values are valid numbers (not strings)

### Loading State Stuck
- Check network requests in browser DevTools
- Verify API endpoint is accessible
- Check for CORS issues

### Incorrect Calculations
- Verify trend calculations: `((current - previous) / previous) * 100`
- Ensure percentages in byStatus sum to 100
- Check that all numeric fields are numbers, not strings

## Testing

Run the analytics component tests:

```bash
npm test -- src/features/admin/components/PlatformAnalytics.test.tsx --run
```

## Security Considerations

1. **Authentication**: Ensure only platform admins can access analytics
2. **Rate Limiting**: Implement rate limiting on the analytics endpoint
3. **Data Sanitization**: Sanitize all data before displaying
4. **HTTPS**: Always use HTTPS for API calls
5. **Token Validation**: Validate JWT tokens on the backend

## Support

For issues or questions:
1. Check the implementation summary: `TASK_11.4_IMPLEMENTATION_SUMMARY.md`
2. Review the main README: `README.md`
3. Check component tests for usage examples

## Next Steps

After integrating analytics:
1. Set up monitoring for the analytics endpoint
2. Configure alerts for anomalies
3. Implement data retention policies
4. Add more advanced analytics features
5. Create scheduled reports
