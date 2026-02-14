# Platform Admin Dashboard Integration Guide

## Quick Start

### 1. Import the Admin Home Page

```tsx
import { AdminHome } from '@/features/admin';
```

### 2. Add to Router

```tsx
import { AdminHome } from '@/features/admin';
import { ProtectedRoute } from '@/components/auth';

// In your router configuration
<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRoles={['PLATFORM_ADMIN']}>
      <AdminHome />
    </ProtectedRoute>
  }
/>
```

### 3. Navigation Link

```tsx
import { Shield } from 'lucide-react';

// In your navigation menu (only show for PLATFORM_ADMIN users)
{user?.role === 'PLATFORM_ADMIN' && (
  <Link to="/admin" className="flex items-center gap-2">
    <Shield className="w-5 h-5" />
    <span>Admin Dashboard</span>
  </Link>
)}
```

## Component Usage

### PlatformStats Component

Display platform-wide statistics:

```tsx
import { PlatformStats, PlatformStatsType } from '@/features/admin';

const stats: PlatformStatsType = {
  totalRestaurants: 156,
  activeRestaurants: 142,
  totalRevenue: 1245680,
  totalOrders: 45892,
  activeSubscriptions: 142,
  trialSubscriptions: 14,
  todayRevenue: 12450,
  todayOrders: 487,
  weekRevenue: 89750,
  weekOrders: 3421,
  monthRevenue: 345280,
  monthOrders: 12847,
};

<PlatformStats stats={stats} isLoading={false} />
```

## Backend Integration

### API Service Setup

Create `src/features/admin/services/adminService.ts`:

```typescript
import { PlatformStats } from '../types';

export async function fetchPlatformStats(): Promise<PlatformStats> {
  const response = await fetch('/api/v1/admin/analytics/platform', {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch platform stats');
  }

  return response.json();
}

export async function fetchSystemHealth() {
  const response = await fetch('/api/v1/admin/system/health', {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch system health');
  }

  return response.json();
}

export async function fetchRecentActivity() {
  const response = await fetch('/api/v1/admin/activity/recent', {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch recent activity');
  }

  return response.json();
}
```

### React Query Integration

Update `AdminHome.tsx` to use React Query:

```tsx
import { useQuery } from '@tanstack/react-query';
import { fetchPlatformStats } from '../services/adminService';

export function AdminHome() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['platform-stats'],
    queryFn: fetchPlatformStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (error) {
    return <ErrorMessage message="Failed to load platform statistics" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Container>
        <Section>
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Platform Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Monitor and manage the entire SmartDine platform.
            </p>
          </div>

          <PlatformStats stats={stats!} isLoading={isLoading} />
          
          {/* Rest of the component */}
        </Section>
      </Container>
    </div>
  );
}
```

## Real-time Updates

### WebSocket Integration

For real-time statistics updates:

```tsx
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function AdminHome() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket('wss://your-api.com/admin/stats');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Update React Query cache
      queryClient.setQueryData(['platform-stats'], data);
    };

    return () => {
      ws.close();
    };
  }, [queryClient]);

  // Rest of component
}
```

## Authentication & Authorization

### Role-Based Access Control

Ensure only PLATFORM_ADMIN users can access:

```tsx
// In your ProtectedRoute component
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';

export function ProtectedRoute({ 
  children, 
  requiredRoles 
}: { 
  children: React.ReactNode;
  requiredRoles: string[];
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}
```

## Styling Customization

### Custom Theme Colors

Override default colors in your Tailwind config:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        admin: {
          primary: '#3b82f6',
          secondary: '#8b5cf6',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
        },
      },
    },
  },
};
```

### Custom Card Styles

```tsx
// Custom stat card with different styling
<Card className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
  {/* Card content */}
</Card>
```

## Error Handling

### Error Boundary

Wrap the admin dashboard with an error boundary:

```tsx
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <button onClick={resetErrorBoundary} className="btn-primary">
        Try again
      </button>
    </div>
  );
}

<ErrorBoundary FallbackComponent={ErrorFallback}>
  <AdminHome />
</ErrorBoundary>
```

## Performance Optimization

### Lazy Loading

```tsx
import { lazy, Suspense } from 'react';

const AdminHome = lazy(() => import('@/features/admin').then(m => ({ default: m.AdminHome })));

<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRoles={['PLATFORM_ADMIN']}>
      <Suspense fallback={<Loading />}>
        <AdminHome />
      </Suspense>
    </ProtectedRoute>
  }
/>
```

### Memoization

```tsx
import { useMemo } from 'react';

const formattedStats = useMemo(() => {
  return {
    ...stats,
    totalRevenue: formatCurrency(stats.totalRevenue),
    totalOrders: formatNumber(stats.totalOrders),
  };
}, [stats]);
```

## Testing

### Component Testing

```tsx
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminHome } from './AdminHome';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

test('renders admin dashboard', () => {
  render(
    <QueryClientProvider client={queryClient}>
      <AdminHome />
    </QueryClientProvider>
  );

  expect(screen.getByText('Platform Admin Dashboard')).toBeInTheDocument();
});
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] API endpoints secured with authentication
- [ ] Role-based access control implemented
- [ ] Error boundaries in place
- [ ] Loading states handled
- [ ] Real-time updates configured (optional)
- [ ] Analytics tracking added
- [ ] Performance monitoring enabled
- [ ] Accessibility tested
- [ ] Mobile responsiveness verified

## Troubleshooting

### Common Issues

**Issue: Stats not loading**
- Check API endpoint URL
- Verify authentication token
- Check network tab for errors
- Ensure CORS is configured

**Issue: Real-time updates not working**
- Verify WebSocket connection
- Check WebSocket URL
- Ensure proper authentication
- Check browser console for errors

**Issue: Unauthorized access**
- Verify user role in token
- Check ProtectedRoute configuration
- Ensure role-based middleware on backend

## Next Steps

1. Implement remaining admin pages (11.2-11.6)
2. Add advanced analytics charts
3. Implement notification system
4. Add export functionality
5. Enhance real-time monitoring
6. Add audit log viewer
