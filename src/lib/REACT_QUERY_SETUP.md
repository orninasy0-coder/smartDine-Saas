# React Query Setup Documentation

## Overview

React Query (TanStack Query) has been configured for efficient server state management in the SmartDine SaaS platform.

## Configuration

### Query Client Settings

Located in `src/lib/queryClient.ts`:

- **Stale Time**: 5 minutes - Data is considered fresh for this duration
- **Cache Time (gcTime)**: 10 minutes - Unused data stays in cache
- **Retry**: 3 attempts for queries, 1 for mutations
- **Retry Delay**: Exponential backoff (1s, 2s, 4s, max 30s)
- **Refetch on Window Focus**: Enabled for real-time updates
- **Refetch on Reconnect**: Enabled to sync after network recovery

## Usage

### Basic Query Example

```typescript
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/hooks/useQuery';

function MenuList({ restaurantId }: { restaurantId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.menu.all(restaurantId),
    queryFn: async () => {
      const response = await fetch(`/api/v1/restaurants/${restaurantId}/menu`);
      if (!response.ok) throw new Error('Failed to fetch menu');
      return response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Render menu items */}</div>;
}
```

### Basic Mutation Example

```typescript
import { useMutation, useQueryClient } from '@/hooks/useQuery';
import { queryKeys } from '@/hooks/useQuery';

function AddDishForm({ restaurantId }: { restaurantId: string }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newDish: DishInput) => {
      const response = await fetch(`/api/v1/restaurants/${restaurantId}/menu/dishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDish),
      });
      if (!response.ok) throw new Error('Failed to add dish');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch menu data
      queryClient.invalidateQueries({ queryKey: queryKeys.menu.all(restaurantId) });
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      mutation.mutate(formData);
    }}>
      {/* Form fields */}
    </form>
  );
}
```

## Query Keys

Centralized query keys are defined in `src/hooks/useQuery.ts` for:

- Authentication (`queryKeys.auth`)
- Menu (`queryKeys.menu`)
- Orders (`queryKeys.orders`)
- AI Assistant (`queryKeys.ai`)
- Analytics (`queryKeys.analytics`)
- Feedback (`queryKeys.feedback`)
- Subscriptions (`queryKeys.subscriptions`)
- Admin (`queryKeys.admin`)

### Benefits of Centralized Query Keys

1. **Type Safety**: TypeScript ensures correct key usage
2. **Cache Management**: Easy to invalidate related queries
3. **Consistency**: Same keys used across the application
4. **Refactoring**: Change keys in one place

## DevTools

React Query DevTools are enabled in development mode. Access them via the floating icon in the bottom-left corner of the screen.

Features:

- View all queries and their states
- Inspect query data and errors
- Manually trigger refetches
- Clear cache
- Monitor query performance

## Best Practices

1. **Use Query Keys Factory**: Always use `queryKeys` for consistency
2. **Handle Loading States**: Show appropriate UI during data fetching
3. **Handle Errors**: Display user-friendly error messages
4. **Optimistic Updates**: Use for better UX in mutations
5. **Cache Invalidation**: Invalidate related queries after mutations
6. **Pagination**: Use `useInfiniteQuery` for infinite scroll
7. **Prefetching**: Prefetch data on hover for instant navigation

## Advanced Patterns

### Optimistic Updates

```typescript
const mutation = useMutation({
  mutationFn: updateDish,
  onMutate: async (newDish) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: queryKeys.menu.all(restaurantId) });

    // Snapshot previous value
    const previousMenu = queryClient.getQueryData(queryKeys.menu.all(restaurantId));

    // Optimistically update
    queryClient.setQueryData(queryKeys.menu.all(restaurantId), (old) => ({
      ...old,
      dishes: old.dishes.map((d) => (d.id === newDish.id ? newDish : d)),
    }));

    return { previousMenu };
  },
  onError: (err, newDish, context) => {
    // Rollback on error
    queryClient.setQueryData(queryKeys.menu.all(restaurantId), context.previousMenu);
  },
  onSettled: () => {
    // Refetch after error or success
    queryClient.invalidateQueries({ queryKey: queryKeys.menu.all(restaurantId) });
  },
});
```

### Dependent Queries

```typescript
// First query
const { data: restaurant } = useQuery({
  queryKey: ['restaurant', restaurantId],
  queryFn: fetchRestaurant,
});

// Second query depends on first
const { data: menu } = useQuery({
  queryKey: queryKeys.menu.all(restaurantId),
  queryFn: fetchMenu,
  enabled: !!restaurant, // Only run when restaurant data is available
});
```

## Migration Notes

When migrating existing state management:

1. Replace Redux/Context API calls with React Query hooks
2. Remove manual loading/error state management
3. Use query keys instead of action types
4. Replace manual cache invalidation with `invalidateQueries`
5. Remove manual retry logic (handled by React Query)

## Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/react/guides/query-keys)
- [Mutations Guide](https://tanstack.com/query/latest/docs/react/guides/mutations)
