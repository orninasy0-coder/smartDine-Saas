/**
 * State Management Example Component
 *
 * Demonstrates the three-tier state management strategy:
 * 1. Local State (useState) - for component-specific UI
 * 2. Global State (Zustand) - for shared application state
 * 3. Server State (React Query) - for API data
 */

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore, useUIStore, useCartStore } from '@/store';
import { queryKeys } from '@/lib/queryKeys';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Mock API service (replace with actual service)
const mockMenuService = {
  getMenu: async (_restaurantId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      dishes: [
        { id: '1', name: 'Pizza Margherita', price: 12.99, available: true },
        { id: '2', name: 'Pasta Carbonara', price: 14.99, available: true },
        { id: '3', name: 'Caesar Salad', price: 8.99, available: false },
      ],
    };
  },
  updateDish: async (dishId: string, data: Record<string, unknown>) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { id: dishId, ...data };
  },
};

export const StateManagementExample = () => {
  // ============================================
  // 1. LOCAL STATE - Component-specific UI state
  // ============================================

  // Modal visibility (only this component cares)
  const [showDetails, setShowDetails] = useState(false);

  // Selected dish for details modal
  const [selectedDish, setSelectedDish] = useState<string | null>(null);

  // Search input (temporary, not shared)
  const [searchQuery, setSearchQuery] = useState('');

  // ============================================
  // 2. GLOBAL STATE - Shared across components
  // ============================================

  // Authentication state (shared across entire app)
  const { user, isAuthenticated } = useAuthStore();

  // UI preferences (shared across app)
  const { theme, addNotification } = useUIStore();

  // Shopping cart (shared across app)
  const { addItem, items, getTotal } = useCartStore();

  // ============================================
  // 3. SERVER STATE - Data from API
  // ============================================

  const restaurantId = 'restaurant-123';

  // Fetch menu data from server
  const {
    data: menuData,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.menu.restaurant(restaurantId),
    queryFn: () => mockMenuService.getMenu(restaurantId),
    enabled: !!restaurantId,
  });

  // Mutation for updating dish availability
  const queryClient = useQueryClient();
  const updateDish = useMutation({
    mutationFn: ({ dishId, data }: { dishId: string; data: Record<string, unknown> }) =>
      mockMenuService.updateDish(dishId, data),
    onSuccess: () => {
      // Invalidate and refetch menu
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.restaurant(restaurantId),
      });

      // Show success notification (global state)
      addNotification({
        type: 'success',
        message: 'Dish updated successfully!',
        duration: 3000,
      });
    },
  });

  // ============================================
  // Event Handlers
  // ============================================

  const handleAddToCart = (dish: { id: string; name: string; price: number }) => {
    // Update global cart state
    addItem(
      {
        dishId: dish.id,
        name: dish.name,
        price: dish.price,
        quantity: 1,
      },
      restaurantId
    );

    // Show notification (global state)
    addNotification({
      type: 'success',
      message: `${dish.name} added to cart!`,
      duration: 2000,
    });
  };

  const handleToggleAvailability = (dishId: string, currentAvailability: boolean) => {
    // Optimistic update via React Query mutation
    updateDish.mutate({
      dishId,
      data: { available: !currentAvailability } as Record<string, unknown>,
    });
  };

  const handleShowDetails = (dishId: string) => {
    // Update local state
    setSelectedDish(dishId);
    setShowDetails(true);
  };

  // ============================================
  // Render
  // ============================================

  if (isLoading) {
    return <div>Loading menu...</div>;
  }

  if (error) {
    return <div>Error loading menu: {error.message}</div>;
  }

  // Filter dishes based on local search state
  const filteredDishes = menuData?.dishes.filter((dish: { name: string }) =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">State Management Example</h1>

      {/* Display global auth state */}
      <Card className="p-4">
        <h2 className="font-semibold mb-2">Global State (Zustand)</h2>
        <div className="space-y-1 text-sm">
          <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          <p>User: {user?.name || 'Not logged in'}</p>
          <p>Theme: {theme}</p>
          <p>Cart Items: {items.length}</p>
          <p>Cart Total: ${getTotal().toFixed(2)}</p>
        </div>
      </Card>

      {/* Local state: Search input */}
      <div>
        <input
          type="text"
          placeholder="Search dishes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
        <p className="text-sm text-gray-500 mt-1">Local State: Search query = "{searchQuery}"</p>
      </div>

      {/* Server state: Menu dishes */}
      <div className="space-y-4">
        <h2 className="font-semibold">Server State (React Query)</h2>
        {filteredDishes?.map(
          (dish: { id: string; name: string; price: number; available: boolean }) => (
            <Card key={dish.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{dish.name}</h3>
                  <p className="text-sm text-gray-600">${dish.price}</p>
                  <p className="text-xs">
                    Status: {dish.available ? '✅ Available' : '❌ Unavailable'}
                  </p>
                </div>
                <div className="space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(dish)}
                    disabled={!dish.available}
                  >
                    Add to Cart
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleShowDetails(dish.id)}>
                    Details
                  </Button>
                  {user?.role === 'owner' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleToggleAvailability(dish.id, dish.available)}
                    >
                      Toggle
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )
        )}
      </div>

      {/* Local state: Details modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Card className="p-6 max-w-md">
            <h3 className="font-semibold mb-4">Dish Details</h3>
            <p className="text-sm mb-4">Local State: Selected dish ID = {selectedDish}</p>
            <Button onClick={() => setShowDetails(false)}>Close</Button>
          </Card>
        </div>
      )}

      {/* State Summary */}
      <Card className="p-4 bg-blue-50">
        <h3 className="font-semibold mb-2">State Management Summary</h3>
        <ul className="text-sm space-y-1">
          <li>
            <strong>Local State:</strong> searchQuery, showDetails, selectedDish
          </li>
          <li>
            <strong>Global State (Zustand):</strong> user, theme, cart, notifications
          </li>
          <li>
            <strong>Server State (React Query):</strong> menuData, updateDish mutation
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default StateManagementExample;
