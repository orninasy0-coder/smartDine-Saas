/**
 * Settings Service
 * 
 * Mock service for restaurant settings management.
 * Replace with actual API calls when backend is ready.
 */

import type {
  RestaurantInfo,
  RestaurantInfoFormData,
  DaySchedule,
} from '../types';

// Mock data
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

const mockWorkingHours: DaySchedule[] = [
  {
    day: 'Sunday',
    dayAr: 'الأحد',
    dayOfWeek: 0,
    isOpen: true,
    openTime: '12:00',
    closeTime: '23:00',
    breakStartTime: '15:00',
    breakEndTime: '17:00',
  },
  {
    day: 'Monday',
    dayAr: 'الإثنين',
    dayOfWeek: 1,
    isOpen: true,
    openTime: '12:00',
    closeTime: '23:00',
    breakStartTime: '15:00',
    breakEndTime: '17:00',
  },
  {
    day: 'Tuesday',
    dayAr: 'الثلاثاء',
    dayOfWeek: 2,
    isOpen: true,
    openTime: '12:00',
    closeTime: '23:00',
    breakStartTime: '15:00',
    breakEndTime: '17:00',
  },
  {
    day: 'Wednesday',
    dayAr: 'الأربعاء',
    dayOfWeek: 3,
    isOpen: true,
    openTime: '12:00',
    closeTime: '23:00',
    breakStartTime: '15:00',
    breakEndTime: '17:00',
  },
  {
    day: 'Thursday',
    dayAr: 'الخميس',
    dayOfWeek: 4,
    isOpen: true,
    openTime: '12:00',
    closeTime: '23:00',
    breakStartTime: '15:00',
    breakEndTime: '17:00',
  },
  {
    day: 'Friday',
    dayAr: 'الجمعة',
    dayOfWeek: 5,
    isOpen: true,
    openTime: '13:00',
    closeTime: '00:00',
  },
  {
    day: 'Saturday',
    dayAr: 'السبت',
    dayOfWeek: 6,
    isOpen: true,
    openTime: '12:00',
    closeTime: '23:00',
    breakStartTime: '15:00',
    breakEndTime: '17:00',
  },
];

/**
 * Fetch restaurant information
 */
export async function fetchRestaurantInfo(
  restaurantId: string
): Promise<RestaurantInfo> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In production, replace with actual API call:
  // const response = await fetch(`/api/v1/restaurants/${restaurantId}`);
  // return response.json();

  return mockRestaurantInfo;
}

/**
 * Update restaurant information
 */
export async function updateRestaurantInfo(
  restaurantId: string,
  data: RestaurantInfoFormData
): Promise<RestaurantInfo> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // In production, replace with actual API call:
  // const response = await fetch(`/api/v1/restaurants/${restaurantId}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // return response.json();

  return {
    ...mockRestaurantInfo,
    ...data,
    updatedAt: new Date(),
  };
}

/**
 * Fetch working hours
 */
export async function fetchWorkingHours(
  restaurantId: string
): Promise<DaySchedule[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In production, replace with actual API call:
  // const response = await fetch(`/api/v1/restaurants/${restaurantId}/working-hours`);
  // return response.json();

  return mockWorkingHours;
}

/**
 * Update working hours
 */
export async function updateWorkingHours(
  restaurantId: string,
  schedule: DaySchedule[]
): Promise<DaySchedule[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // In production, replace with actual API call:
  // const response = await fetch(`/api/v1/restaurants/${restaurantId}/working-hours`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(schedule),
  // });
  // return response.json();

  return schedule;
}
