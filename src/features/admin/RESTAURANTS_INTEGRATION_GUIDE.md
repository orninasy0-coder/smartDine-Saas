# Restaurant Management Integration Guide

## Quick Start

### 1. Add Route to Your Application

```tsx
// In your main router file (e.g., App.tsx or routes.tsx)
import { Restaurants } from '@/features/admin';
import { ProtectedRoute } from '@/components/auth';

<Route
  path="/admin/restaurants"
  element={
    <ProtectedRoute requiredRoles={['PLATFORM_ADMIN']}>
      <Restaurants />
    </ProtectedRoute>
  }
/>
```

### 2. Add Navigation Link

```tsx
// In your admin navigation/sidebar
<Link to="/admin/restaurants">
  <Store className="w-4 h-4 mr-2" />
  Restaurants
</Link>
```

## Backend Integration

### Step 1: Create API Service

Create a new file `src/features/admin/services/restaurantService.ts`:

```typescript
import { Restaurant, CreateRestaurantInput, UpdateRestaurantInput, SubscriptionStatus } from '../types';

const API_BASE = '/api/v1/admin';

export const restaurantService = {
  // Fetch all restaurants
  async getAll(): Promise<Restaurant[]> {
    const response = await fetch(`${API_BASE}/restaurants`);
    const { data, error } = await response.json();
    
    if (error) throw new Error(error.message);
    return data;
  },

  // Create new restaurant
  async create(input: CreateRestaurantInput): Promise<Restaurant> {
    const response = await fetch(`${API_BASE}/restaurants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    
    const { data, error } = await response.json();
    if (error) throw new Error(error.message);
    return data;
  },

  // Update restaurant
  async update(id: string, input: UpdateRestaurantInput): Promise<Restaurant> {
    const response = await fetch(`${API_BASE}/restaurants/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    
    const { data, error } = await response.json();
    if (error) throw new Error(error.message);
    return data;
  },

  // Delete restaurant
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/restaurants/${id}`, {
      method: 'DELETE',
    });
    
    const { error } = await response.json();
    if (error) throw new Error(error.message);
  },

  // Update restaurant status
  async updateStatus(id: string, status: SubscriptionStatus): Promise<Restaurant> {
    const response = await fetch(`${API_BASE}/restaurants/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    
    const { data, error } = await response.json();
    if (error) throw new Error(error.message);
    return data;
  },
};
```

### Step 2: Update Restaurants Page

Replace the mock implementations in `src/features/admin/pages/Restaurants.tsx`:

```typescript
import { restaurantService } from '../services/restaurantService';

// Replace fetchRestaurants
const fetchRestaurants = async () => {
  setIsLoading(true);
  try {
    const data = await restaurantService.getAll();
    setRestaurants(data);
  } catch (error) {
    console.error('Failed to fetch restaurants:', error);
    toast.error('Failed to load restaurants');
  } finally {
    setIsLoading(false);
  }
};

// Replace handleSave
const handleSave = async (data: CreateRestaurantInput) => {
  try {
    if (selectedRestaurant) {
      const updated = await restaurantService.update(selectedRestaurant.id, data);
      setRestaurants((prev) =>
        prev.map((r) => (r.id === selectedRestaurant.id ? updated : r))
      );
      toast.success('Restaurant updated successfully');
    } else {
      const newRestaurant = await restaurantService.create(data);
      setRestaurants((prev) => [newRestaurant, ...prev]);
      toast.success('Restaurant created successfully');
    }
  } catch (error) {
    console.error('Failed to save restaurant:', error);
    toast.error('Failed to save restaurant');
    throw error;
  }
};

// Replace handleConfirmDelete
const handleConfirmDelete = async () => {
  if (!restaurantToDelete) return;

  try {
    await restaurantService.delete(restaurantToDelete.id);
    setRestaurants((prev) => prev.filter((r) => r.id !== restaurantToDelete.id));
    toast.success('Restaurant deleted successfully');
  } catch (error) {
    console.error('Failed to delete restaurant:', error);
    toast.error('Failed to delete restaurant');
    throw error;
  }
};

// Replace handleStatusChange
const handleStatusChange = async (restaurantId: string, status: SubscriptionStatus) => {
  try {
    const updated = await restaurantService.updateStatus(restaurantId, status);
    setRestaurants((prev) =>
      prev.map((r) => (r.id === restaurantId ? updated : r))
    );
    
    const action = status === 'ACTIVE' ? 'activated' : 'suspended';
    toast.success(`Restaurant ${action} successfully`);
  } catch (error) {
    console.error('Failed to update restaurant status:', error);
    toast.error('Failed to update restaurant status');
  }
};
```

### Step 3: Add React Query (Optional but Recommended)

For better data management, use React Query:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { restaurantService } from '../services/restaurantService';

export function Restaurants() {
  const queryClient = useQueryClient();

  // Fetch restaurants
  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ['admin', 'restaurants'],
    queryFn: restaurantService.getAll,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: restaurantService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'restaurants'] });
      toast.success('Restaurant created successfully');
    },
    onError: () => {
      toast.error('Failed to create restaurant');
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRestaurantInput }) =>
      restaurantService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'restaurants'] });
      toast.success('Restaurant updated successfully');
    },
    onError: () => {
      toast.error('Failed to update restaurant');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: restaurantService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'restaurants'] });
      toast.success('Restaurant deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete restaurant');
    },
  });

  // Status change mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: SubscriptionStatus }) =>
      restaurantService.updateStatus(id, status),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'restaurants'] });
      const action = status === 'ACTIVE' ? 'activated' : 'suspended';
      toast.success(`Restaurant ${action} successfully`);
    },
    onError: () => {
      toast.error('Failed to update restaurant status');
    },
  });

  // Handler functions
  const handleSave = async (data: CreateRestaurantInput) => {
    if (selectedRestaurant) {
      await updateMutation.mutateAsync({ id: selectedRestaurant.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleConfirmDelete = async () => {
    if (!restaurantToDelete) return;
    await deleteMutation.mutateAsync(restaurantToDelete.id);
  };

  const handleStatusChange = async (restaurantId: string, status: SubscriptionStatus) => {
    await statusMutation.mutateAsync({ id: restaurantId, status });
  };

  // ... rest of component
}
```

## Backend API Requirements

### Database Schema

Ensure your database has a `restaurants` table with these columns:

```sql
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subscription_plan VARCHAR(50) NOT NULL CHECK (subscription_plan IN ('BASIC', 'PRO', 'ENTERPRISE')),
  subscription_status VARCHAR(50) NOT NULL CHECK (subscription_status IN ('ACTIVE', 'SUSPENDED', 'CANCELLED', 'GRACE_PERIOD')),
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_restaurants_slug ON restaurants(slug);
CREATE INDEX idx_restaurants_status ON restaurants(subscription_status);
```

### API Endpoints

Implement these endpoints in your backend:

```
GET    /api/v1/admin/restaurants
POST   /api/v1/admin/restaurants
PATCH  /api/v1/admin/restaurants/:id
DELETE /api/v1/admin/restaurants/:id
PATCH  /api/v1/admin/restaurants/:id/status
```

### Response Format

All endpoints should return:

```typescript
{
  status: 'success' | 'error',
  data: Restaurant | Restaurant[] | null,
  error: {
    code: string,
    message: string,
    details?: any
  } | null
}
```

## Authentication

Ensure all admin endpoints require authentication and PLATFORM_ADMIN role:

```typescript
// Middleware example
async function requirePlatformAdmin(req, res, next) {
  const user = req.user; // From auth middleware
  
  if (!user || user.role !== 'PLATFORM_ADMIN') {
    return res.status(403).json({
      status: 'error',
      error: {
        code: 'FORBIDDEN',
        message: 'Platform admin access required'
      }
    });
  }
  
  next();
}

// Apply to routes
router.use('/api/v1/admin/*', requireAuth, requirePlatformAdmin);
```

## Testing the Integration

1. **Manual Testing:**
   - Navigate to `/admin/restaurants`
   - Try creating a new restaurant
   - Edit an existing restaurant
   - View restaurant details
   - Suspend/activate a restaurant
   - Delete a restaurant
   - Test search functionality

2. **API Testing:**
   ```bash
   # Get all restaurants
   curl -X GET http://localhost:3000/api/v1/admin/restaurants \
     -H "Authorization: Bearer YOUR_TOKEN"

   # Create restaurant
   curl -X POST http://localhost:3000/api/v1/admin/restaurants \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Restaurant",
       "slug": "test-restaurant",
       "address": "123 Main St",
       "phone": "+1234567890",
       "email": "test@example.com",
       "subscriptionPlan": "PRO"
     }'
   ```

## Troubleshooting

### Issue: "Failed to load restaurants"
- Check API endpoint is correct
- Verify authentication token is valid
- Check CORS settings
- Verify user has PLATFORM_ADMIN role

### Issue: "Failed to create restaurant"
- Check all required fields are provided
- Verify slug is unique
- Check validation rules match backend
- Verify email format is correct

### Issue: Components not rendering
- Ensure all shadcn/ui components are installed
- Check import paths are correct
- Verify TypeScript types are properly exported

## Next Steps

1. Add pagination for large datasets
2. Implement advanced filtering
3. Add export functionality
4. Add bulk operations
5. Implement real-time updates via WebSocket
6. Add audit logging
7. Add restaurant analytics

## Support

For issues or questions:
- Check the main README: `src/features/admin/README.md`
- Review implementation summary: `src/features/admin/TASK_11.2_IMPLEMENTATION_SUMMARY.md`
- Check component tests: `src/features/admin/components/RestaurantTable.test.tsx`
