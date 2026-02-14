import type { Dish, DishFormData } from '../types';

/**
 * Dish Service
 * Handles CRUD operations for restaurant dishes
 * 
 * Note: This is a mock implementation. In production, replace with actual API calls
 * using InsForge SDK or your backend API.
 */

// Mock data store (replace with actual API calls)
let mockDishes: Dish[] = [];

/**
 * Fetch all dishes for a restaurant
 */
export async function fetchDishes(restaurantId: string): Promise<Dish[]> {
  // TODO: Replace with actual API call
  // Example with InsForge SDK:
  // const { data, error } = await client.from('dishes')
  //   .select('*')
  //   .eq('restaurantId', restaurantId)
  //   .order('createdAt', { ascending: false });
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDishes.filter((d) => d.restaurantId === restaurantId));
    }, 500);
  });
}

/**
 * Fetch a single dish by ID
 */
export async function fetchDish(dishId: string): Promise<Dish | null> {
  // TODO: Replace with actual API call
  // Example with InsForge SDK:
  // const { data, error } = await client.from('dishes')
  //   .select('*')
  //   .eq('id', dishId)
  //   .single();
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const dish = mockDishes.find((d) => d.id === dishId);
      resolve(dish || null);
    }, 300);
  });
}

/**
 * Create a new dish
 */
export async function createDish(
  restaurantId: string,
  data: DishFormData
): Promise<Dish> {
  // TODO: Replace with actual API call
  // Example with InsForge SDK:
  // const { data: newDish, error } = await client.from('dishes')
  //   .insert([{ ...data, restaurantId }])
  //   .select()
  //   .single();
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const newDish: Dish = {
        id: `dish-${Date.now()}`,
        restaurantId,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockDishes.push(newDish);
      resolve(newDish);
    }, 500);
  });
}

/**
 * Update an existing dish
 */
export async function updateDish(
  dishId: string,
  data: Partial<DishFormData>
): Promise<Dish> {
  // TODO: Replace with actual API call
  // Example with InsForge SDK:
  // const { data: updatedDish, error } = await client.from('dishes')
  //   .update({ ...data, updatedAt: new Date() })
  //   .eq('id', dishId)
  //   .select()
  //   .single();
  
  // Mock implementation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockDishes.findIndex((d) => d.id === dishId);
      if (index === -1) {
        reject(new Error('Dish not found'));
        return;
      }
      
      mockDishes[index] = {
        ...mockDishes[index],
        ...data,
        updatedAt: new Date(),
      };
      resolve(mockDishes[index]);
    }, 500);
  });
}

/**
 * Delete a dish
 */
export async function deleteDish(dishId: string): Promise<void> {
  // TODO: Replace with actual API call
  // Example with InsForge SDK:
  // const { error } = await client.from('dishes')
  //   .delete()
  //   .eq('id', dishId);
  
  // Mock implementation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockDishes.findIndex((d) => d.id === dishId);
      if (index === -1) {
        reject(new Error('Dish not found'));
        return;
      }
      
      mockDishes.splice(index, 1);
      resolve();
    }, 500);
  });
}

/**
 * Upload dish image
 */
export async function uploadDishImage(file: File): Promise<string> {
  // TODO: Replace with actual storage upload
  // Example with InsForge SDK:
  // const { data, error } = await client.storage
  //   .from('dish-images')
  //   .upload(`${Date.now()}-${file.name}`, file);
  // return data.publicUrl;
  
  // Mock implementation - returns a data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Upload 3D model
 */
export async function upload3DModel(file: File): Promise<string> {
  // TODO: Replace with actual storage upload
  // Example with InsForge SDK:
  // const { data, error } = await client.storage
  //   .from('dish-models')
  //   .upload(`${Date.now()}-${file.name}`, file);
  // return data.publicUrl;
  
  // Mock implementation - returns a mock URL
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`https://example.com/models/${file.name}`);
    }, 1000);
  });
}

/**
 * Search dishes
 */
export async function searchDishes(
  restaurantId: string,
  query: string
): Promise<Dish[]> {
  // TODO: Replace with actual API call with search
  // Example with InsForge SDK:
  // const { data, error } = await client.from('dishes')
  //   .select('*')
  //   .eq('restaurantId', restaurantId)
  //   .or(`name.ilike.%${query}%,description.ilike.%${query}%`);
  
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = mockDishes.filter(
        (d) =>
          d.restaurantId === restaurantId &&
          (d.name.toLowerCase().includes(query.toLowerCase()) ||
            d.description.toLowerCase().includes(query.toLowerCase()))
      );
      resolve(results);
    }, 300);
  });
}

// Initialize with some mock data for development
if (mockDishes.length === 0) {
  mockDishes = [
    {
      id: 'dish-1',
      restaurantId: 'restaurant-1',
      name: 'Grilled Chicken',
      nameAr: 'دجاج مشوي',
      description: 'Tender grilled chicken with herbs and spices',
      descriptionAr: 'دجاج مشوي طري مع الأعشاب والتوابل',
      price: 15.99,
      category: 'mains',
      imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6',
      ingredients: ['Chicken', 'Herbs', 'Olive Oil', 'Garlic'],
      allergens: [],
      isAvailable: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: 'dish-2',
      restaurantId: 'restaurant-1',
      name: 'Caesar Salad',
      nameAr: 'سلطة سيزر',
      description: 'Fresh romaine lettuce with Caesar dressing',
      descriptionAr: 'خس روماني طازج مع صلصة سيزر',
      price: 8.99,
      category: 'salads',
      imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1',
      ingredients: ['Romaine Lettuce', 'Parmesan', 'Croutons', 'Caesar Dressing'],
      allergens: ['Dairy', 'Gluten'],
      isAvailable: true,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
    {
      id: 'dish-3',
      restaurantId: 'restaurant-1',
      name: 'Chocolate Cake',
      nameAr: 'كيك الشوكولاتة',
      description: 'Rich chocolate cake with ganache',
      descriptionAr: 'كيك شوكولاتة غني مع الجاناش',
      price: 6.99,
      category: 'desserts',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
      ingredients: ['Chocolate', 'Flour', 'Sugar', 'Eggs', 'Butter'],
      allergens: ['Dairy', 'Eggs', 'Gluten'],
      isAvailable: false,
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
    },
  ];
}
