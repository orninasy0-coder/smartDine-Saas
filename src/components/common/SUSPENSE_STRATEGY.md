# Suspense Strategy Documentation

This document outlines the Suspense strategy implemented in the SmartDine SaaS platform for handling loading states and code splitting.

## Overview

React Suspense allows components to "wait" for something before rendering, showing a fallback UI in the meantime. Our implementation includes:

1. **Route-level Suspense** - For lazy-loaded pages
2. **Component-level Suspense** - For async components and data fetching
3. **Specialized Fallback Components** - For different content types

## Architecture

### 1. Route-Level Suspense

All routes in `App.tsx` are lazy-loaded and wrapped in a Suspense boundary:

```tsx
import { lazy, Suspense } from 'react';

// Lazy load pages
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

**Benefits:**
- Automatic code splitting per route
- Smaller initial bundle size
- Faster initial page load
- Better performance on slow connections

### 2. Component-Level Suspense

#### SuspenseWrapper

General-purpose wrapper for any component that needs Suspense:

```tsx
import { SuspenseWrapper } from '@/components/common';

<SuspenseWrapper loadingText="Loading content...">
  <AsyncComponent />
</SuspenseWrapper>
```

**Props:**
- `children` - Component to wrap
- `fallback` - Custom fallback component
- `loadingText` - Text to show in default fallback
- `loadingSize` - Spinner size ('sm' | 'md' | 'lg')
- `fullHeight` - Whether to use full height container
- `fallbackClassName` - Additional CSS classes

#### DataSuspense

Specialized wrapper for data-fetching components, combines Suspense with ErrorBoundary:

```tsx
import { DataSuspense } from '@/components/common';

<DataSuspense
  loadingText="Loading users..."
  errorTitle="Failed to load users"
  onError={(error) => console.error(error)}
>
  <UserList />
</DataSuspense>
```

**Props:**
- All SuspenseWrapper props
- `errorFallback` - Custom error UI
- `errorMessage` - Error message
- `errorTitle` - Error title
- `enableRetry` - Enable retry button
- `onError` - Error callback

**Use cases:**
- Components using React Query
- Components fetching from APIs
- Any component that might throw errors

#### HeavyComponentSuspense

Optimized for computationally expensive or large-bundle components:

```tsx
import { HeavyComponentSuspense } from '@/components/common';

<HeavyComponentSuspense
  componentName="Analytics Chart"
  showSkeleton
  minHeight="400px"
>
  <AnalyticsChart />
</HeavyComponentSuspense>
```

**Props:**
- `componentName` - Name for loading message
- `showSkeleton` - Use skeleton instead of spinner
- `skeleton` - Custom skeleton component
- `minHeight` - Minimum height for container

**Use cases:**
- Chart libraries (Recharts, Chart.js)
- 3D viewers (Three.js, React Three Fiber)
- Rich text editors
- Large UI libraries

### 3. Fallback Components

Specialized skeleton loaders for different content types:

#### PageLoadingFallback

Full-page loading indicator for route-level Suspense:

```tsx
<PageLoadingFallback message="Loading dashboard..." showBranding />
```

#### CardSkeleton

For card-based layouts (product grids, galleries):

```tsx
<CardSkeleton count={6} showImage imageHeight="200px" />
```

#### TableSkeleton

For data tables:

```tsx
<TableSkeleton rows={10} columns={5} showHeader />
```

#### ChartSkeleton

For charts and graphs:

```tsx
<ChartSkeleton type="bar" height="300px" showLegend />
```

**Types:** `'bar' | 'line' | 'pie' | 'area'`

#### ListSkeleton

For list views and feeds:

```tsx
<ListSkeleton count={8} showAvatar showSecondary showAction />
```

#### FormSkeleton

For forms:

```tsx
<FormSkeleton fields={6} showSubmit showTitle />
```

## Best Practices

### When to Use Route-Level Suspense

✅ **Use for:**
- All page components
- Large feature modules
- Admin dashboards
- Separate user flows

❌ **Don't use for:**
- Small utility components
- Components already in the bundle
- Critical above-the-fold content

### When to Use Component-Level Suspense

✅ **Use for:**
- Data-fetching components
- Heavy third-party libraries
- Conditional features
- User-triggered modals/dialogs

❌ **Don't use for:**
- Simple presentational components
- Already-loaded components
- Critical UI elements

### Choosing the Right Fallback

| Content Type | Recommended Fallback | Why |
|--------------|---------------------|-----|
| Full page | `PageLoadingFallback` | Consistent branding, full-screen |
| Data table | `TableSkeleton` | Matches table structure |
| Product grid | `CardSkeleton` | Matches card layout |
| Analytics | `ChartSkeleton` | Matches chart dimensions |
| User list | `ListSkeleton` | Matches list structure |
| Form | `FormSkeleton` | Matches form fields |
| Generic | `Loading` | Simple spinner |

### Performance Tips

1. **Lazy load strategically:**
   ```tsx
   // Good - separate routes
   const Dashboard = lazy(() => import('./pages/Dashboard'));
   
   // Bad - tiny component
   const Button = lazy(() => import('./Button')); // Don't do this!
   ```

2. **Preload on hover:**
   ```tsx
   <Link
     to="/dashboard"
     onMouseEnter={() => import('./pages/Dashboard')}
   >
     Dashboard
   </Link>
   ```

3. **Use appropriate fallbacks:**
   ```tsx
   // Good - matches content
   <HeavyComponentSuspense showSkeleton>
     <Chart />
   </HeavyComponentSuspense>
   
   // Bad - generic spinner for complex content
   <Suspense fallback={<Loading />}>
     <Chart />
   </Suspense>
   ```

4. **Combine with ErrorBoundary:**
   ```tsx
   // Always wrap data-fetching with both
   <DataSuspense>
     <UserList />
   </DataSuspense>
   ```

## Examples

### Example 1: Dashboard with Multiple Sections

```tsx
import { DataSuspense, ChartSkeleton, TableSkeleton } from '@/components/common';

function Dashboard() {
  return (
    <div className="space-y-6">
      <DataSuspense
        loadingText="Loading analytics..."
        fallback={<ChartSkeleton type="bar" height="300px" />}
      >
        <AnalyticsChart />
      </DataSuspense>

      <DataSuspense
        loadingText="Loading orders..."
        fallback={<TableSkeleton rows={10} columns={5} />}
      >
        <OrdersTable />
      </DataSuspense>
    </div>
  );
}
```

### Example 2: Product Grid

```tsx
import { SuspenseWrapper, CardSkeleton } from '@/components/common';

function ProductGrid() {
  return (
    <SuspenseWrapper fallback={<CardSkeleton count={8} />}>
      <div className="grid grid-cols-4 gap-4">
        <ProductList />
      </div>
    </SuspenseWrapper>
  );
}
```

### Example 3: Heavy 3D Viewer

```tsx
import { HeavyComponentSuspense } from '@/components/common';

function DishViewer({ modelUrl }) {
  return (
    <HeavyComponentSuspense
      componentName="3D Model"
      showSkeleton
      minHeight="500px"
    >
      <Model3DViewer url={modelUrl} />
    </HeavyComponentSuspense>
  );
}
```

### Example 4: Nested Suspense Boundaries

```tsx
function RestaurantPage() {
  return (
    <SuspenseWrapper fullHeight>
      <RestaurantLayout>
        {/* Header loads first */}
        <RestaurantHeader />
        
        {/* Menu can load independently */}
        <DataSuspense fallback={<CardSkeleton count={6} />}>
          <MenuGrid />
        </DataSuspense>
        
        {/* Reviews load separately */}
        <DataSuspense fallback={<ListSkeleton count={5} />}>
          <ReviewsList />
        </DataSuspense>
      </RestaurantLayout>
    </SuspenseWrapper>
  );
}
```

## Testing

### Testing Suspense Boundaries

```tsx
import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';

test('shows loading state', () => {
  render(
    <Suspense fallback={<div>Loading...</div>}>
      <AsyncComponent />
    </Suspense>
  );
  
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});
```

### Testing with React Query

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true, // Enable Suspense mode
    },
  },
});

test('data component with suspense', async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <DataSuspense>
        <UserList />
      </DataSuspense>
    </QueryClientProvider>
  );
  
  // Loading state
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  // Wait for data
  await waitFor(() => {
    expect(screen.getByText('User 1')).toBeInTheDocument();
  });
});
```

## Migration Guide

### Migrating Existing Components

**Before:**
```tsx
function MyPage() {
  const { data, isLoading } = useQuery('users', fetchUsers);
  
  if (isLoading) return <Loading />;
  
  return <UserList users={data} />;
}
```

**After:**
```tsx
import { DataSuspense } from '@/components/common';

// Enable suspense in React Query
const { data } = useQuery('users', fetchUsers, {
  suspense: true,
});

function MyPage() {
  return (
    <DataSuspense loadingText="Loading users...">
      <UserList />
    </DataSuspense>
  );
}

function UserList() {
  const { data } = useQuery('users', fetchUsers, {
    suspense: true,
  });
  
  return <div>{/* render users */}</div>;
}
```

## Troubleshooting

### Common Issues

1. **"A component suspended while responding to synchronous input"**
   - Don't trigger Suspense from user events
   - Use `startTransition` for user-triggered updates

2. **Suspense boundary not catching loading state**
   - Ensure component actually suspends (throws promise)
   - Check React Query `suspense: true` option

3. **Flickering loading states**
   - Use `useDeferredValue` for less critical updates
   - Increase minimum loading time

4. **Nested Suspense boundaries not working**
   - Each boundary needs its own fallback
   - Check component hierarchy

## Future Enhancements

- [ ] Streaming SSR with Suspense
- [ ] Prefetching strategies
- [ ] Progressive hydration
- [ ] Suspense for images
- [ ] Custom transition animations

## Resources

- [React Suspense Documentation](https://react.dev/reference/react/Suspense)
- [React Query Suspense](https://tanstack.com/query/latest/docs/react/guides/suspense)
- [Code Splitting Guide](https://react.dev/learn/code-splitting)
