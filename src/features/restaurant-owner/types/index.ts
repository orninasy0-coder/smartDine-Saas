/**
 * Restaurant Owner Dashboard Types
 */

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  averageRating: number;
  activeOrders: number;
  todayRevenue: number;
  todayOrders: number;
  weekRevenue: number;
  weekOrders: number;
  monthRevenue: number;
  monthOrders: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface OrderVolumeData {
  date: string;
  orders: number;
}

export interface TopDish {
  id: string;
  name: string;
  orders: number;
  revenue: number;
  imageUrl?: string;
}

export interface DashboardPeriod {
  label: string;
  value: 'today' | 'week' | 'month' | 'year';
}

/**
 * Analytics Types
 */

export interface AnalyticsData {
  revenueData: RevenueData[];
  orderVolumeData: OrderVolumeData[];
  topDishes: TopDish[];
  period: DashboardPeriod['value'];
}

export interface AnalyticsPeriodOption {
  label: string;
  value: 'week' | 'month' | 'year';
}

/**
 * Menu Management Types
 */

export interface Dish {
  id: string;
  restaurantId: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  price: number;
  category: string;
  imageUrl?: string;
  modelUrl?: string; // 3D model for AR
  ingredients: string[];
  allergens: string[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DishFormData {
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

export interface DishCategory {
  id: string;
  name: string;
  nameAr?: string;
  icon?: string;
}

export const DISH_CATEGORIES: DishCategory[] = [
  { id: 'appetizers', name: 'Appetizers', nameAr: 'المقبلات' },
  { id: 'mains', name: 'Main Courses', nameAr: 'الأطباق الرئيسية' },
  { id: 'desserts', name: 'Desserts', nameAr: 'الحلويات' },
  { id: 'beverages', name: 'Beverages', nameAr: 'المشروبات' },
  { id: 'salads', name: 'Salads', nameAr: 'السلطات' },
  { id: 'soups', name: 'Soups', nameAr: 'الشوربات' },
];

/**
 * Staff Management Types
 */

export type StaffRole = 'kitchen' | 'delivery';

export interface StaffMember {
  id: string;
  restaurantId: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StaffFormData {
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  isActive: boolean;
}

export interface StaffRoleOption {
  value: StaffRole;
  label: string;
  labelAr: string;
}

/**
 * Settings Types
 */

export interface RestaurantInfo {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  phone: string;
  email: string;
  address: string;
  addressAr?: string;
  city: string;
  country: string;
  logoUrl?: string;
  coverImageUrl?: string;
  cuisineType: string[];
  priceRange: 'budget' | 'moderate' | 'fine-dining';
  capacity: number;
  updatedAt: Date;
}

export interface RestaurantInfoFormData {
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  phone: string;
  email: string;
  address: string;
  addressAr?: string;
  city: string;
  country: string;
  logoUrl?: string;
  coverImageUrl?: string;
  cuisineType: string[];
  priceRange: 'budget' | 'moderate' | 'fine-dining';
  capacity: number;
}

export interface WorkingHours {
  id: string;
  restaurantId: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 6 = Saturday
  isOpen: boolean;
  openTime: string; // HH:mm format
  closeTime: string; // HH:mm format
  breakStartTime?: string;
  breakEndTime?: string;
}

export interface WorkingHoursFormData {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breakStartTime?: string;
  breakEndTime?: string;
}

export interface DaySchedule {
  day: string;
  dayAr: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breakStartTime?: string;
  breakEndTime?: string;
}

export const DAYS_OF_WEEK: Array<{ day: string; dayAr: string; dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 }> = [
  { day: 'Sunday', dayAr: 'الأحد', dayOfWeek: 0 },
  { day: 'Monday', dayAr: 'الإثنين', dayOfWeek: 1 },
  { day: 'Tuesday', dayAr: 'الثلاثاء', dayOfWeek: 2 },
  { day: 'Wednesday', dayAr: 'الأربعاء', dayOfWeek: 3 },
  { day: 'Thursday', dayAr: 'الخميس', dayOfWeek: 4 },
  { day: 'Friday', dayAr: 'الجمعة', dayOfWeek: 5 },
  { day: 'Saturday', dayAr: 'السبت', dayOfWeek: 6 },
];

export const CUISINE_TYPES = [
  'Italian',
  'Chinese',
  'Japanese',
  'Indian',
  'Mexican',
  'Mediterranean',
  'American',
  'French',
  'Thai',
  'Arabic',
  'Fast Food',
  'Seafood',
  'Vegetarian',
  'Vegan',
];

export const PRICE_RANGES = [
  { value: 'budget', label: 'Budget', labelAr: 'اقتصادي' },
  { value: 'moderate', label: 'Moderate', labelAr: 'متوسط' },
  { value: 'fine-dining', label: 'Fine Dining', labelAr: 'فاخر' },
] as const;

/**
 * QR Code Types
 */

export interface QRCodeData {
  id: string;
  restaurantId: string;
  tableNumber: string;
  qrCodeUrl: string; // Data URL or hosted URL of the QR code image
  createdAt: Date;
}

export interface QRCodeFormData {
  tableNumber: string;
}
