/**
 * React Query Usage Example
 *
 * This component demonstrates basic React Query patterns
 * for fetching and mutating data in the SmartDine platform.
 */

import { useQuery, useMutation, useQueryClient } from '@/hooks/useQuery';
import { queryKeys } from '@/hooks/useQuery';

// Example: Fetching menu data
export function MenuExample({ restaurantId }: { restaurantId: string }) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.menu.all(restaurantId),
    queryFn: async () => {
      // Replace with actual API call
      const response = await fetch(`/api/v1/restaurants/${restaurantId}/menu`);
      if (!response.ok) throw new Error('Failed to fetch menu');
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Loading menu...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Menu Items</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

// Example: Creating a new dish with mutation
export function AddDishExample({ restaurantId }: { restaurantId: string }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newDish: { name: string; price: number }) => {
      const response = await fetch(`/api/v1/restaurants/${restaurantId}/menu/dishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDish),
      });
      if (!response.ok) throw new Error('Failed to add dish');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate menu query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.all(restaurantId),
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutation.mutate({
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
    });
  };

  return (
    <div>
      <h2>Add New Dish</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Dish name" required />
        <input name="price" type="number" placeholder="Price" required />
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Adding...' : 'Add Dish'}
        </button>
      </form>

      {mutation.isError && <p style={{ color: 'red' }}>Error: {mutation.error.message}</p>}

      {mutation.isSuccess && <p style={{ color: 'green' }}>Dish added successfully!</p>}
    </div>
  );
}

// Example: Dependent queries
export function DishDetailsExample({
  restaurantId,
  dishId,
}: {
  restaurantId: string;
  dishId: string;
}) {
  // First query: Get restaurant info
  const { data: restaurant } = useQuery({
    queryKey: ['restaurant', restaurantId],
    queryFn: async () => {
      const response = await fetch(`/api/v1/restaurants/${restaurantId}`);
      if (!response.ok) throw new Error('Failed to fetch restaurant');
      return response.json();
    },
  });

  // Second query: Get dish details (only runs when restaurant is loaded)
  const { data: dish, isLoading } = useQuery({
    queryKey: queryKeys.menu.dish(restaurantId, dishId),
    queryFn: async () => {
      const response = await fetch(`/api/v1/restaurants/${restaurantId}/menu/dishes/${dishId}`);
      if (!response.ok) throw new Error('Failed to fetch dish');
      return response.json();
    },
    enabled: !!restaurant, // Only run when restaurant data is available
  });

  if (!restaurant) {
    return <div>Loading restaurant...</div>;
  }

  if (isLoading) {
    return <div>Loading dish details...</div>;
  }

  return (
    <div>
      <h2>
        {dish?.name} at {restaurant.name}
      </h2>
      <pre>{JSON.stringify(dish, null, 2)}</pre>
    </div>
  );
}

// Example: Optimistic updates
export function UpdateDishExample({
  restaurantId,
  dishId,
}: {
  restaurantId: string;
  dishId: string;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (updatedDish: { name: string; price: number }) => {
      const response = await fetch(`/api/v1/restaurants/${restaurantId}/menu/dishes/${dishId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDish),
      });
      if (!response.ok) throw new Error('Failed to update dish');
      return response.json();
    },
    // Optimistic update
    onMutate: async (newDish) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.menu.dish(restaurantId, dishId),
      });

      // Snapshot the previous value
      const previousDish = queryClient.getQueryData(queryKeys.menu.dish(restaurantId, dishId));

      // Optimistically update to the new value
      queryClient.setQueryData(queryKeys.menu.dish(restaurantId, dishId), newDish);

      // Return context with the previous value
      return { previousDish };
    },
    // Rollback on error
    onError: (_err, _newDish, context) => {
      queryClient.setQueryData(queryKeys.menu.dish(restaurantId, dishId), context?.previousDish);
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.dish(restaurantId, dishId),
      });
    },
  });

  return (
    <div>
      <h2>Update Dish (with Optimistic Updates)</h2>
      <button
        onClick={() => mutation.mutate({ name: 'Updated Dish', price: 29.99 })}
        disabled={mutation.isPending}
      >
        Update Dish
      </button>
    </div>
  );
}
