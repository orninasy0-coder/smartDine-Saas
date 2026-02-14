import { RestaurantInfoForm } from './RestaurantInfoForm';
import type { RestaurantInfo, RestaurantInfoFormData } from '../types';

/**
 * Example: Restaurant Info Form
 * 
 * Demonstrates the restaurant information form component
 */

const mockRestaurantInfo: RestaurantInfo = {
  id: 'restaurant-1',
  name: 'The Golden Fork',
  nameAr: 'الشوكة الذهبية',
  description: 'Fine dining experience with authentic flavors',
  descriptionAr: 'تجربة طعام فاخرة مع نكهات أصيلة',
  phone: '+966 50 123 4567',
  email: 'info@goldenfork.com',
  address: '123 King Fahd Road',
  addressAr: 'شارع الملك فهد 123',
  city: 'Riyadh',
  country: 'Saudi Arabia',
  logoUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200',
  coverImageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
  cuisineType: ['Italian', 'Mediterranean', 'Arabic'],
  priceRange: 'fine-dining',
  capacity: 80,
  updatedAt: new Date(),
};

export function RestaurantInfoFormExample() {
  const handleSubmit = async (data: RestaurantInfoFormData) => {
    console.log('Submitting restaurant info:', data);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert('Restaurant info updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Restaurant Information Form</h1>
        <p className="text-muted-foreground">
          Example of the restaurant information form component
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <RestaurantInfoForm
          restaurantInfo={mockRestaurantInfo}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default RestaurantInfoFormExample;
