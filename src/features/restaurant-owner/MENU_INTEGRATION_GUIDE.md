# Menu Management Backend Integration Guide

This guide provides step-by-step instructions for integrating the Menu Management feature with a backend.

## Option 1: InsForge SDK Integration

### Step 1: Install InsForge SDK

```bash
npm install @insforge/sdk@latest
```

### Step 2: Create SDK Client

Create a file `src/lib/insforge.ts`:

```typescript
import { createClient } from '@insforge/sdk';

export const insforge = createClient({
  baseUrl: import.meta.env.VITE_INSFORGE_BASE_URL,
  anonKey: import.meta.env.VITE_INSFORGE_ANON_KEY,
});
```

Add to `.env`:
```
VITE_INSFORGE_BASE_URL=https://your-app.region.insforge.app
VITE_INSFORGE_ANON_KEY=your-anon-key-here
```

### Step 3: Create Database Schema

Use InsForge MCP tools or SQL:

```sql
CREATE TABLE dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  name_ar VARCHAR(100),
  description TEXT NOT NULL,
  description_ar TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  category VARCHAR(50) NOT NULL,
  image_url TEXT,
  model_url TEXT,
  ingredients TEXT[] DEFAULT '{}',
  allergens TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_dishes_restaurant_id ON dishes(restaurant_id);
CREATE INDEX idx_dishes_category ON dishes(category);
CREATE INDEX idx_dishes_is_available ON dishes(is_available);
```

### Step 4: Create Storage Buckets

Using InsForge MCP tools:

```typescript
// Create buckets for images and models
await createBucket('dish-images', { public: true });
await createBucket('dish-models', { public: true });
```

### Step 5: Update dishService.ts

Replace the mock implementations:

```typescript
import { insforge } from '@/lib/insforge';
import type { Dish, DishFormData } from '../types';

export async function fetchDishes(restaurantId: string): Promise<Dish[]> {
  const { data, error } = await insforge
    .from('dishes')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data.map(transformDish);
}

export async function createDish(
  restaurantId: string,
  data: DishFormData
): Promise<Dish> {
  const { data: newDish, error } = await insforge
    .from('dishes')
    .insert([{
      restaurant_id: restaurantId,
      name: data.name,
      name_ar: data.nameAr,
      description: data.description,
      description_ar: data.descriptionAr,
      price: data.price,
      category: data.category,
      image_url: data.imageUrl,
      model_url: data.modelUrl,
      ingredients: data.ingredients,
      allergens: data.allergens,
      is_available: data.isAvailable,
    }])
    .select()
    .single();

  if (error) throw error;
  
  return transformDish(newDish);
}

export async function updateDish(
  dishId: string,
  data: Partial<DishFormData>
): Promise<Dish> {
  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (data.name !== undefined) updateData.name = data.name;
  if (data.nameAr !== undefined) updateData.name_ar = data.nameAr;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.descriptionAr !== undefined) updateData.description_ar = data.descriptionAr;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.imageUrl !== undefined) updateData.image_url = data.imageUrl;
  if (data.modelUrl !== undefined) updateData.model_url = data.modelUrl;
  if (data.ingredients !== undefined) updateData.ingredients = data.ingredients;
  if (data.allergens !== undefined) updateData.allergens = data.allergens;
  if (data.isAvailable !== undefined) updateData.is_available = data.isAvailable;

  const { data: updatedDish, error } = await insforge
    .from('dishes')
    .update(updateData)
    .eq('id', dishId)
    .select()
    .single();

  if (error) throw error;
  
  return transformDish(updatedDish);
}

export async function deleteDish(dishId: string): Promise<void> {
  const { error } = await insforge
    .from('dishes')
    .delete()
    .eq('id', dishId);

  if (error) throw error;
}

export async function uploadDishImage(file: File): Promise<string> {
  const filename = `${Date.now()}-${file.name}`;
  
  const { data, error } = await insforge.storage
    .from('dish-images')
    .upload(filename, file);

  if (error) throw error;

  // Get public URL
  const { data: urlData } = insforge.storage
    .from('dish-images')
    .getPublicUrl(filename);

  return urlData.publicUrl;
}

export async function upload3DModel(file: File): Promise<string> {
  const filename = `${Date.now()}-${file.name}`;
  
  const { data, error } = await insforge.storage
    .from('dish-models')
    .upload(filename, file);

  if (error) throw error;

  // Get public URL
  const { data: urlData } = insforge.storage
    .from('dish-models')
    .getPublicUrl(filename);

  return urlData.publicUrl;
}

export async function searchDishes(
  restaurantId: string,
  query: string
): Promise<Dish[]> {
  const { data, error } = await insforge
    .from('dishes')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

  if (error) throw error;
  
  return data.map(transformDish);
}

// Helper to transform snake_case to camelCase
function transformDish(dish: any): Dish {
  return {
    id: dish.id,
    restaurantId: dish.restaurant_id,
    name: dish.name,
    nameAr: dish.name_ar,
    description: dish.description,
    descriptionAr: dish.description_ar,
    price: parseFloat(dish.price),
    category: dish.category,
    imageUrl: dish.image_url,
    modelUrl: dish.model_url,
    ingredients: dish.ingredients || [],
    allergens: dish.allergens || [],
    isAvailable: dish.is_available,
    createdAt: new Date(dish.created_at),
    updatedAt: new Date(dish.updated_at),
  };
}
```

### Step 6: Add Authentication

Update MenuManagement.tsx to get restaurant ID from auth:

```typescript
import { useAuth } from '@/features/auth'; // Your auth hook

export function MenuManagement() {
  const { user } = useAuth();
  const restaurantId = user?.restaurantId;

  if (!restaurantId) {
    return <div>Please log in to manage your menu</div>;
  }

  // Rest of component...
}
```

## Option 2: Custom REST API Integration

### Step 1: Define API Client

Create `src/lib/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

export const api = {
  get: (endpoint: string) => fetchAPI(endpoint),
  post: (endpoint: string, data: any) =>
    fetchAPI(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: (endpoint: string, data: any) =>
    fetchAPI(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (endpoint: string) =>
    fetchAPI(endpoint, { method: 'DELETE' }),
};
```

### Step 2: Update dishService.ts

```typescript
import { api } from '@/lib/api';
import type { Dish, DishFormData } from '../types';

export async function fetchDishes(restaurantId: string): Promise<Dish[]> {
  const response = await api.get(`/restaurants/${restaurantId}/menu`);
  return response.data;
}

export async function createDish(
  restaurantId: string,
  data: DishFormData
): Promise<Dish> {
  const response = await api.post(
    `/restaurants/${restaurantId}/menu/dishes`,
    data
  );
  return response.data;
}

export async function updateDish(
  dishId: string,
  data: Partial<DishFormData>
): Promise<Dish> {
  const response = await api.put(`/dishes/${dishId}`, data);
  return response.data;
}

export async function deleteDish(dishId: string): Promise<void> {
  await api.delete(`/dishes/${dishId}`);
}

export async function uploadDishImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload/image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    },
    body: formData,
  });

  if (!response.ok) throw new Error('Upload failed');

  const data = await response.json();
  return data.url;
}

export async function upload3DModel(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload/model`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    },
    body: formData,
  });

  if (!response.ok) throw new Error('Upload failed');

  const data = await response.json();
  return data.url;
}
```

## Testing the Integration

### 1. Test Database Connection

```typescript
// Test fetching dishes
const dishes = await fetchDishes('test-restaurant-id');
console.log('Dishes:', dishes);
```

### 2. Test File Upload

```typescript
// Test image upload
const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
const url = await uploadDishImage(file);
console.log('Uploaded URL:', url);
```

### 3. Test CRUD Operations

```typescript
// Create
const newDish = await createDish('restaurant-id', {
  name: 'Test Dish',
  description: 'Test description',
  price: 9.99,
  category: 'mains',
  ingredients: ['ingredient1'],
  allergens: [],
  isAvailable: true,
});

// Update
const updated = await updateDish(newDish.id, {
  price: 12.99,
});

// Delete
await deleteDish(newDish.id);
```

## Error Handling

Add proper error handling in MenuManagement.tsx:

```typescript
const handleSubmitDish = async (data: DishFormData) => {
  try {
    if (selectedDish) {
      const updatedDish = await updateDish(selectedDish.id, data);
      setDishes(dishes.map((d) => (d.id === updatedDish.id ? updatedDish : d)));
      toast.success('Dish updated successfully');
    } else {
      const newDish = await createDish(restaurantId, data);
      setDishes([newDish, ...dishes]);
      toast.success('Dish added successfully');
    }
    setIsFormOpen(false);
    setSelectedDish(null);
  } catch (error) {
    console.error('Error saving dish:', error);
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('Failed to save dish');
    }
    throw error; // Keep form open
  }
};
```

## Performance Optimization

### 1. Add Caching

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function MenuManagement() {
  const queryClient = useQueryClient();
  
  const { data: dishes = [], isLoading } = useQuery({
    queryKey: ['dishes', restaurantId],
    queryFn: () => fetchDishes(restaurantId),
  });

  const createMutation = useMutation({
    mutationFn: (data: DishFormData) => createDish(restaurantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes', restaurantId] });
      toast.success('Dish added successfully');
    },
  });

  // Use mutations for create/update/delete
}
```

### 2. Add Debounced Search

```typescript
import { useMemo } from 'react';
import { debounce } from 'lodash';

const debouncedSearch = useMemo(
  () =>
    debounce(async (query: string) => {
      const results = await searchDishes(restaurantId, query);
      setSearchResults(results);
    }, 300),
  [restaurantId]
);
```

## Security Considerations

1. **Authentication:** Ensure all requests include valid auth tokens
2. **Authorization:** Verify restaurant ownership on backend
3. **File Upload:** Validate file types and sizes on backend
4. **SQL Injection:** Use parameterized queries
5. **XSS:** Sanitize user input
6. **CORS:** Configure properly for your domain

## Monitoring

Add logging for production:

```typescript
export async function createDish(
  restaurantId: string,
  data: DishFormData
): Promise<Dish> {
  console.log('[dishService] Creating dish:', { restaurantId, data });
  
  try {
    const dish = await insforge.from('dishes').insert([...]);
    console.log('[dishService] Dish created:', dish.id);
    return dish;
  } catch (error) {
    console.error('[dishService] Error creating dish:', error);
    throw error;
  }
}
```

## Troubleshooting

### Issue: CORS errors
**Solution:** Configure CORS on backend to allow your frontend domain

### Issue: 401 Unauthorized
**Solution:** Check auth token is being sent correctly

### Issue: File upload fails
**Solution:** Check file size limits and bucket permissions

### Issue: Slow queries
**Solution:** Add database indexes on frequently queried columns

## Next Steps

1. Set up backend (InsForge or custom)
2. Update dishService.ts with real implementations
3. Test all CRUD operations
4. Add error handling and logging
5. Optimize with caching
6. Deploy and monitor

## Support

For InsForge-specific issues, refer to:
- InsForge documentation
- InsForge MCP tools
- InsForge SDK documentation

For custom backend issues:
- Check your API documentation
- Review backend logs
- Test endpoints with Postman/curl
