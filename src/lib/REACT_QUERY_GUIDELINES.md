# React Query Guidelines

## Overview

React Query is used for **server state management** in SmartDine. It handles data fetching, caching, synchronization, and updates for all server-side data.

## When to Use React Query

Use React Query for:

- Fetching data from APIs
- Caching server responses
- Background data synchronization
- Optimistic updates
- Pagination and infinite scroll
- Real-time data that needs periodic refetching

## Query Keys Convention

Query keys should be structured hierarchically for better cache management:

```typescript
// Feature-based structure
['menu', restaurantId][('menu', restaurantId, 'dishes')][('menu', restaurantId, 'dishes', dishId)][ // All menu data for a restaurant // All dishes // Specific dish
  ('menu', restaurantId, 'categories')
]['orders'][('orders', orderId)][('orders', { status: 'pending' })][('auth', 'user')][ // All categories // All orders // Specific order // Filtered orders // Current user
  ('analytics', restaurantId, { period: 'week' })
]; // Analytics data
```

## Custom Hooks Pattern

Create custom hooks for each API endpoint in the feature's `hooks` directory:

```typescript
// src/features/menu/hooks/useMenu.ts
import { useQuery } from '@tanstack/react-query';
import { menuService } from '../services';

export const useMenu = (restaurantId: string) => {
  return useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: () => menuService.getMenu(restaurantId),
    enabled: !!restaurantId, // Only fetch if restaurantId exists
  });
};
```

## Mutations Pattern

Use mutations for data modifications:

```typescript
// src/features/menu/hooks/useCreateDish.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { menuService } from '../services';

export const useCreateDish = (restaurantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: menuService.createDish,
    onSuccess: () => {
      // Invalidate and refetch menu data
      queryClient.invalidateQueries({ queryKey: ['menu', restaurantId] });
    },
  });
};
```

## Optimistic Updates

For better UX, implement optimistic updates:

```typescript
export const useUpdateDish = (restaurantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: menuService.updateDish,
    onMutate: async (updatedDish) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['menu', restaurantId, 'dishes', updatedDish.id],
      });

      // Snapshot previous value
      const previousDish = queryClient.getQueryData([
        'menu',
        restaurantId,
        'dishes',
        updatedDish.id,
      ]);

      // Optimistically update
      queryClient.setQueryData(['menu', restaurantId, 'dishes', updatedDish.id], updatedDish);

      return { previousDish };
    },
    onError: (err, updatedDish, context) => {
      // Rollback on error
      queryClient.setQueryData(
        ['menu', restaurantId, 'dishes', updatedDish.id],
        context?.previousDish
      );
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['menu', restaurantId] });
    },
  });
};
```

## Error Handling

Handle errors gracefully in components:

```typescript
const { data, error, isLoading, isError } = useMenu(restaurantId);

if (isLoading) return <Loading />;
if (isError) return <ErrorMessage error={error} />;
```

## Pagination

Use pagination helpers for large datasets:

```typescript
export const useOrders = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: ['orders', { page, pageSize }],
    queryFn: () => orderService.getOrders({ page, pageSize }),
    keepPreviousData: true, // Keep previous data while fetching new page
  });
};
```

## Infinite Queries

For infinite scroll:

```typescript
export const useInfiniteMenu = (restaurantId: string) => {
  return useInfiniteQuery({
    queryKey: ['menu', restaurantId, 'infinite'],
    queryFn: ({ pageParam = 0 }) => menuService.getMenu(restaurantId, { page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};
```

## Prefetching

Prefetch data for better UX:

```typescript
const queryClient = useQueryClient();

// Prefetch on hover
const handleMouseEnter = () => {
  queryClient.prefetchQuery({
    queryKey: ['menu', restaurantId, 'dishes', dishId],
    queryFn: () => menuService.getDish(dishId),
  });
};
```

## Cache Invalidation

Invalidate cache strategically:

```typescript
// Invalidate all menu queries
queryClient.invalidateQueries({ queryKey: ['menu'] });

// Invalidate specific restaurant menu
queryClient.invalidateQueries({ queryKey: ['menu', restaurantId] });

// Invalidate with exact match
queryClient.invalidateQueries({
  queryKey: ['menu', restaurantId],
  exact: true,
});
```

## Best Practices

1. **Always use custom hooks** - Don't use `useQuery` directly in components
2. **Consistent query keys** - Follow the hierarchical structure
3. **Enable conditionally** - Use `enabled` option to prevent unnecessary requests
4. **Handle loading and error states** - Always provide feedback to users
5. **Invalidate wisely** - Don't over-invalidate, be specific
6. **Use optimistic updates** - For better perceived performance
7. **Implement retry logic** - Already configured globally in queryClient
8. **Use staleTime appropriately** - Balance freshness vs performance

## Configuration

Global configuration is in `src/lib/queryClient.ts`:

- `staleTime`: 5 minutes (data freshness)
- `gcTime`: 10 minutes (cache retention)
- `retry`: 3 attempts with exponential backoff
- `refetchOnWindowFocus`: true (real-time updates)

## Testing

Mock React Query in tests:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

// Wrap component in test
<QueryClientProvider client={createTestQueryClient()}>
  <ComponentUnderTest />
</QueryClientProvider>
```

## Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Query Keys Best Practices](https://tkdodo.eu/blog/effective-react-query-keys)
- [Optimistic Updates Guide](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
