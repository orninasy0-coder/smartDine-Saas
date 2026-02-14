# Menu Management Feature

This document describes the Menu Management feature implementation for the Restaurant Owner Dashboard.

## Overview

The Menu Management feature allows restaurant owners to:
- View all menu items in a grid layout
- Search and filter dishes by category and availability
- Add new dishes with complete information
- Edit existing dishes
- Delete dishes
- Upload dish images and 3D models for AR viewing

## Components

### 1. MenuEditor

The main component that displays the menu items grid with search and filter capabilities.

**Props:**
- `dishes: Dish[]` - Array of dishes to display
- `onAddDish: () => void` - Callback when "Add Dish" button is clicked
- `onEditDish: (dish: Dish) => void` - Callback when a dish is edited
- `onDeleteDish: (dishId: string) => void` - Callback when a dish is deleted
- `isLoading?: boolean` - Loading state

**Features:**
- Search by dish name or description
- Filter by category (Appetizers, Mains, Desserts, etc.)
- Filter by availability (Available/Unavailable)
- Responsive grid layout
- Visual indicators for unavailable items
- Summary statistics

**Usage:**
```tsx
import { MenuEditor } from '@/features/restaurant-owner';

<MenuEditor
  dishes={dishes}
  onAddDish={handleAddDish}
  onEditDish={handleEditDish}
  onDeleteDish={handleDeleteDish}
  isLoading={isLoading}
/>
```

### 2. DishForm

A comprehensive form dialog for creating and editing dishes.

**Props:**
- `dish?: Dish | null` - Dish to edit (null for new dish)
- `open: boolean` - Dialog open state
- `onClose: () => void` - Callback when dialog is closed
- `onSubmit: (data: DishFormData) => Promise<void>` - Callback when form is submitted
- `onUploadImage?: (file: File) => Promise<string>` - Optional image upload handler
- `onUploadModel?: (file: File) => Promise<string>` - Optional 3D model upload handler

**Features:**
- Bilingual support (English and Arabic)
- Price and category selection
- Ingredients and allergens management (add/remove tags)
- Image and 3D model upload with tabs
- Availability toggle
- Form validation
- Loading states

**Validation Rules:**
- Name: Required, max 100 characters
- Description: Required, max 500 characters
- Price: Must be greater than 0
- Category: Required

**Usage:**
```tsx
import { DishForm } from '@/features/restaurant-owner';

<DishForm
  dish={selectedDish}
  open={isFormOpen}
  onClose={() => setIsFormOpen(false)}
  onSubmit={handleSubmit}
  onUploadImage={handleUploadImage}
  onUploadModel={handleUploadModel}
/>
```

### 3. FileUpload

A reusable file upload component for images and 3D models.

**Props:**
- `label: string` - Label for the upload field
- `accept: string` - Accepted file types
- `maxSize: number` - Maximum file size in MB
- `currentUrl?: string` - Current file URL (for editing)
- `onUpload: (file: File) => Promise<string>` - Upload handler
- `onRemove?: () => void` - Remove handler
- `type: 'image' | 'model'` - Type of file
- `disabled?: boolean` - Disabled state

**Features:**
- Drag and drop support
- File validation (type and size)
- Image preview
- Upload progress indication
- Error handling

**Usage:**
```tsx
import { FileUpload } from '@/features/restaurant-owner';

<FileUpload
  label="Dish Image"
  accept="image/jpeg,image/png,image/webp"
  maxSize={5}
  currentUrl={imageUrl}
  onUpload={handleUpload}
  onRemove={handleRemove}
  type="image"
/>
```

## Services

### dishService.ts

Provides CRUD operations for dishes.

**Functions:**

1. `fetchDishes(restaurantId: string): Promise<Dish[]>`
   - Fetches all dishes for a restaurant

2. `fetchDish(dishId: string): Promise<Dish | null>`
   - Fetches a single dish by ID

3. `createDish(restaurantId: string, data: DishFormData): Promise<Dish>`
   - Creates a new dish

4. `updateDish(dishId: string, data: Partial<DishFormData>): Promise<Dish>`
   - Updates an existing dish

5. `deleteDish(dishId: string): Promise<void>`
   - Deletes a dish

6. `uploadDishImage(file: File): Promise<string>`
   - Uploads a dish image and returns the URL

7. `upload3DModel(file: File): Promise<string>`
   - Uploads a 3D model and returns the URL

8. `searchDishes(restaurantId: string, query: string): Promise<Dish[]>`
   - Searches dishes by name or description

**Current Implementation:**
The service currently uses mock data for development. To integrate with a real backend:

1. **Using InsForge SDK:**
```typescript
import { createClient } from '@insforge/sdk';

const client = createClient({
  baseUrl: 'https://your-app.region.insforge.app',
  anonKey: 'your-anon-key',
});

// Fetch dishes
const { data, error } = await client.from('dishes')
  .select('*')
  .eq('restaurantId', restaurantId)
  .order('createdAt', { ascending: false });

// Create dish
const { data, error } = await client.from('dishes')
  .insert([{ ...data, restaurantId }])
  .select()
  .single();

// Upload image
const { data, error } = await client.storage
  .from('dish-images')
  .upload(`${Date.now()}-${file.name}`, file);
```

2. **Using REST API:**
```typescript
// Fetch dishes
const response = await fetch(`/api/v1/restaurants/${restaurantId}/menu`);
const dishes = await response.json();

// Create dish
const response = await fetch(`/api/v1/restaurants/${restaurantId}/menu/dishes`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

## Pages

### MenuManagement

The main page that integrates all menu management components.

**Features:**
- Loads dishes on mount
- Handles all CRUD operations
- Manages form dialog state
- Shows toast notifications for success/error
- Integrates file upload handlers

**Usage:**
```tsx
import { MenuManagement } from '@/features/restaurant-owner';

// In your router
<Route path="/dashboard/menu" element={<MenuManagement />} />
```

## Types

### Dish
```typescript
interface Dish {
  id: string;
  restaurantId: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  price: number;
  category: string;
  imageUrl?: string;
  modelUrl?: string;
  ingredients: string[];
  allergens: string[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### DishFormData
```typescript
interface DishFormData {
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  price: number;
  category: string;
  imageUrl?: string;
  modelUrl?: string;
  ingredients: string[];
  allergens: string[];
  isAvailable: boolean;
}
```

### DishCategory
```typescript
interface DishCategory {
  id: string;
  name: string;
  nameAr?: string;
  icon?: string;
}
```

## Categories

The following dish categories are available:
- Appetizers (المقبلات)
- Main Courses (الأطباق الرئيسية)
- Desserts (الحلويات)
- Beverages (المشروبات)
- Salads (السلطات)
- Soups (الشوربات)

## File Constraints

### Images
- Max size: 5MB
- Formats: JPG, PNG, WebP
- Recommended dimensions: 1200x800px

### 3D Models
- Max size: 10MB
- Formats: GLB, glTF
- Optimized for mobile AR viewing

## Integration Steps

1. **Set up InsForge Backend:**
   - Create `dishes` table with the schema
   - Create storage buckets: `dish-images` and `dish-models`
   - Set up appropriate permissions

2. **Update dishService.ts:**
   - Replace mock implementations with actual API calls
   - Use InsForge SDK or REST API
   - Handle authentication tokens

3. **Add to Router:**
   - Add MenuManagement page to your router
   - Protect route with authentication

4. **Configure Storage:**
   - Set up CDN for images and models
   - Configure CORS for file uploads
   - Implement image optimization

## Testing

Example files are provided for testing:
- `MenuEditor.example.tsx` - Example usage of MenuEditor component

To test the components:
```bash
npm run dev
# Navigate to the example page
```

## Future Enhancements

- Bulk import/export of dishes
- Duplicate dish functionality
- Dish templates
- Advanced image editing
- Automatic image optimization
- Batch operations (enable/disable multiple dishes)
- Dish analytics (views, orders)
- Seasonal availability scheduling
- Multi-language support for more languages
- Integration with POS systems

## Related Requirements

This implementation satisfies:
- Requirement 9.1: Menu CRUD operations
- Requirement 9.2: Image and 3D model upload
- Property 12: Menu updates invalidate cache
- Property 9: Category filtering accuracy
- Property 10: Search results match query

## Notes

- All components use shadcn/ui for consistent styling
- Forms include comprehensive validation
- File uploads support drag and drop
- Components are fully responsive
- Mock data is provided for development
- Ready for InsForge SDK integration
