/**
 * React Query Usage Examples
 *
 * This file demonstrates proper React Query patterns
 * Use these as templates for creating feature-specific hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';

// Example: Basic Query Hook
export const useMenuExample = (restaurantId: string) => {
  return useQuery({
    queryKey: queryKeys.menu.restaurant(restaurantId),
    queryFn: async () => {
      // Replace with actual API call
      const response = await fetch(`/api/v1/restaurants/${restaurantId}/menu`);
      if (!response.ok) throw new Error('Failed to fetch menu');
      return response.json();
    },
    enabled: !!restaurantId, // Only run if restaurantId exists
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Example: Mutation Hook with Cache Invalidation
export const useCreateDishExample = (restaurantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dishData: unknown) => {
      // Replace with actual API call
      const response = await fetch(`/api/v1/restaurants/${restaurantId}/menu/dishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dishData),
      });
      if (!response.ok) throw new Error('Failed to create dish');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate menu queries to refetch fresh data
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.restaurant(restaurantId),
      });
    },
  });
};

// Example: Mutation with Optimistic Update
export const useUpdateDishExample = (restaurantId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dishId, data }: { dishId: string; data: unknown }) => {
      const response = await fetch(`/api/v1/restaurants/${restaurantId}/menu/dishes/${dishId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update dish');
      return response.json();
    },
    onMutate: async ({ dishId, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.menu.dish(restaurantId, dishId),
      });

      // Snapshot previous value
      const previousDish = queryClient.getQueryData(queryKeys.menu.dish(restaurantId, dishId));

      // Optimistically update
      queryClient.setQueryData(queryKeys.menu.dish(restaurantId, dishId), data);

      return { previousDish };
    },
    onError: (_err, { dishId }, context) => {
      // Rollback on error
      if (context?.previousDish) {
        queryClient.setQueryData(queryKeys.menu.dish(restaurantId, dishId), context.previousDish);
      }
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.restaurant(restaurantId),
      });
    },
  });
};

// Example: Paginated Query
export const useOrdersExample = (page: number, pageSize: number) => {
  return useQuery({
    queryKey: queryKeys.orders.list({ page, pageSize }),
    queryFn: async () => {
      const response = await fetch(`/api/v1/orders?page=${page}&pageSize=${pageSize}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });
};

// Example: Dependent Query
export const useDishDetailsExample = (restaurantId: string, dishId: string | null) => {
  return useQuery({
    queryKey: queryKeys.menu.dish(restaurantId, dishId!),
    queryFn: async () => {
      const response = await fetch(`/api/v1/restaurants/${restaurantId}/menu/dishes/${dishId}`);
      if (!response.ok) throw new Error('Failed to fetch dish');
      return response.json();
    },
    enabled: !!restaurantId && !!dishId, // Only run if both IDs exist
  });
};

// Example: Prefetching
export const usePrefetchDish = () => {
  const queryClient = useQueryClient();

  return (restaurantId: string, dishId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.menu.dish(restaurantId, dishId),
      queryFn: async () => {
        const response = await fetch(`/api/v1/restaurants/${restaurantId}/menu/dishes/${dishId}`);
        if (!response.ok) throw new Error('Failed to fetch dish');
        return response.json();
      },
    });
  };
};
