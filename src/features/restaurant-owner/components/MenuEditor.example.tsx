import { MenuEditor } from './MenuEditor';
import { Dish } from '../types';

/**
 * Example usage of MenuEditor component
 */

const mockDishes: Dish[] = [
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

export function MenuEditorExample() {
  const handleAddDish = () => {
    console.log('Add dish clicked');
  };

  const handleEditDish = (dish: Dish) => {
    console.log('Edit dish:', dish);
  };

  const handleDeleteDish = (dishId: string) => {
    console.log('Delete dish:', dishId);
  };

  return (
    <div className="p-8">
      <MenuEditor
        dishes={mockDishes}
        onAddDish={handleAddDish}
        onEditDish={handleEditDish}
        onDeleteDish={handleDeleteDish}
        isLoading={false}
      />
    </div>
  );
}
