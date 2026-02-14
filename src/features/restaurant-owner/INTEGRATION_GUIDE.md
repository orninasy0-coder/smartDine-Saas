# Restaurant Owner Dashboard - Integration Guide

## Quick Start

### 1. Add Route to Your Application

In your main router file (e.g., `App.tsx` or `router.tsx`):

```tsx
import RestaurantDashboard from '@/pages/RestaurantDashboard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Add to your routes
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute requiredRole="RESTAURANT_OWNER">
      <RestaurantDashboard />
    </ProtectedRoute>
  } 
/>
```

### 2. Backend Integration

#### Step 1: Create API Service

Create `src/features/restaurant-owner/services/dashboardService.ts`:

```typescript
import { DashboardStats } from '../types';

export async function fetchDashboardStats(
  restaurantId: string
): Promise<DashboardStats> {
  const response = await fetch(
    `/api/v1/analytics/dashboard/${restaurantId}`,
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }

  return response.json();
}
```

#### Step 2: Update DashboardHome Component

Replace the mock data in `src/features/restaurant-owner/pages/DashboardHome.tsx`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats } from '../services/dashboardService';
import { useAuth } from '@/features/auth';

export function DashboardHome() {
  const { user } = useAuth();
  
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats', user?.restaurantId],
    queryFn: () => fetchDashboardStats(user!.restaurantId),
    enabled: !!user?.restaurantId,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (error) {
    return <ErrorMessage message="Failed to load dashboard statistics" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Container>
        <Section>
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back! Here's an overview of your restaurant's performance.
            </p>
          </div>

          <DashboardStats stats={stats!} isLoading={isLoading} />
        </Section>
      </Container>
    </div>
  );
}
```

### 3. Backend API Endpoint

Your backend should provide an endpoint that returns dashboard statistics:

**Endpoint:** `GET /api/v1/analytics/dashboard/:restaurantId`

**Response Format:**
```json
{
  "status": "success",
  "data": {
    "totalRevenue": 45280,
    "totalOrders": 1247,
    "averageRating": 4.6,
    "activeOrders": 12,
    "todayRevenue": 3420,
    "todayOrders": 45,
    "weekRevenue": 18950,
    "weekOrders": 287,
    "monthRevenue": 45280,
    "monthOrders": 1247
  }
}
```

**Backend Implementation Example (Node.js/Express):**

```typescript
// routes/analytics.ts
router.get('/dashboard/:restaurantId', 
  authMiddleware,
  requireRole('RESTAURANT_OWNER'),
  async (req, res) => {
    const { restaurantId } = req.params;
    
    // Verify user owns this restaurant
    if (req.user.restaurantId !== restaurantId) {
      return res.status(403).json({
        status: 'error',
        error: { code: 'FORBIDDEN', message: 'Access denied' }
      });
    }

    const stats = await analyticsService.getDashboardStats(restaurantId);
    
    res.json({
      status: 'success',
      data: stats
    });
  }
);
```

### 4. Real-Time Updates (Optional)

For real-time statistics updates, integrate WebSocket:

```typescript
import { useEffect } from 'react';
import { useWebSocket } from '@/services/websocket';

export function DashboardHome() {
  const { user } = useAuth();
  const socket = useWebSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !user?.restaurantId) return;

    // Listen for order events
    socket.on('order.created', () => {
      queryClient.invalidateQueries(['dashboard-stats', user.restaurantId]);
    });

    socket.on('order.updated', () => {
      queryClient.invalidateQueries(['dashboard-stats', user.restaurantId]);
    });

    return () => {
      socket.off('order.created');
      socket.off('order.updated');
    };
  }, [socket, user?.restaurantId, queryClient]);

  // ... rest of component
}
```

## Navigation Integration

Add a link to the dashboard in your navigation:

```tsx
// In your Navbar or Sidebar component
import { LayoutDashboard } from 'lucide-react';

<NavLink to="/dashboard">
  <LayoutDashboard className="w-5 h-5" />
  <span>Dashboard</span>
</NavLink>
```

## Testing the Integration

### 1. Manual Testing Checklist

- [ ] Dashboard loads without errors
- [ ] All 6 stat cards are displayed
- [ ] Loading skeletons appear while fetching data
- [ ] Currency is formatted correctly
- [ ] Numbers are formatted with commas
- [ ] Rating displays with 1 decimal place
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] Dark/Light mode works correctly

### 2. Integration Test Example

```typescript
// src/features/restaurant-owner/pages/DashboardHome.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardHome } from './DashboardHome';
import { fetchDashboardStats } from '../services/dashboardService';

jest.mock('../services/dashboardService');

describe('DashboardHome Integration', () => {
  it('fetches and displays dashboard stats', async () => {
    const mockStats = {
      totalRevenue: 45280,
      totalOrders: 1247,
      averageRating: 4.6,
      activeOrders: 12,
      todayRevenue: 3420,
      todayOrders: 45,
      weekRevenue: 18950,
      weekOrders: 287,
      monthRevenue: 45280,
      monthOrders: 1247,
    };

    (fetchDashboardStats as jest.Mock).mockResolvedValue(mockStats);

    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardHome />
      </QueryClientProvider>
    );

    // Should show loading state initially
    expect(screen.getAllByRole('status')).toHaveLength(6);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('$45,280')).toBeInTheDocument();
    });

    expect(screen.getByText('1,247')).toBeInTheDocument();
    expect(screen.getByText('4.6')).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Issue: Stats not loading

**Solution:**
1. Check browser console for errors
2. Verify API endpoint is correct
3. Check authentication token is valid
4. Verify user has RESTAURANT_OWNER role
5. Check backend logs for errors

### Issue: Currency not formatting correctly

**Solution:**
The component uses `Intl.NumberFormat` with 'en-US' locale. To change:

```typescript
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA', { // Change locale
    style: 'currency',
    currency: 'SAR', // Change currency
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
```

### Issue: Real-time updates not working

**Solution:**
1. Verify WebSocket connection is established
2. Check event names match backend
3. Ensure queryClient.invalidateQueries is called
4. Check React Query devtools for cache updates

## Performance Optimization

### 1. Caching Strategy

```typescript
const { data: stats } = useQuery({
  queryKey: ['dashboard-stats', restaurantId],
  queryFn: () => fetchDashboardStats(restaurantId),
  staleTime: 30000, // Consider data fresh for 30 seconds
  cacheTime: 300000, // Keep in cache for 5 minutes
  refetchOnWindowFocus: true, // Refetch when user returns to tab
});
```

### 2. Prefetching

Prefetch dashboard data when user navigates to dashboard:

```typescript
// In your navigation component
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

const handleDashboardHover = () => {
  queryClient.prefetchQuery({
    queryKey: ['dashboard-stats', user.restaurantId],
    queryFn: () => fetchDashboardStats(user.restaurantId),
  });
};

<NavLink 
  to="/dashboard" 
  onMouseEnter={handleDashboardHover}
>
  Dashboard
</NavLink>
```

## Security Considerations

1. **Authentication**: Always verify user is authenticated
2. **Authorization**: Ensure user owns the restaurant they're viewing
3. **Rate Limiting**: Implement rate limiting on the backend
4. **Data Validation**: Validate all data from backend
5. **Error Handling**: Don't expose sensitive error details to users

## Next Steps

After integrating the dashboard home:

1. Implement Menu Management (Task 10.2)
2. Add Analytics Charts (Task 10.3)
3. Implement Staff Management (Task 10.4)
4. Add Settings page (Task 10.5)
5. Implement QR Code generation (Task 10.6)
6. Add Feedback management (Task 10.7)

## Support

For issues or questions:
- Check the README.md in this feature directory
- Review the implementation summary
- Check the example file for usage patterns
- Review test files for expected behavior
