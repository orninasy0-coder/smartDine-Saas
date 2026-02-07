/**
 * Shared TypeScript types and interfaces
 */

import {
  ORDER_STATUS,
  USER_ROLES,
  SUBSCRIPTION_PLANS,
  SUBSCRIPTION_STATUS,
  LANGUAGES,
  THEMES,
} from '../constants';

// Extract types from constants
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[keyof typeof SUBSCRIPTION_PLANS];
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];
export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];
export type Theme = (typeof THEMES)[keyof typeof THEMES];

// User types
export interface User {
  id: string;
  email: string;
  role: UserRole;
  restaurantId?: string;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
}

// Restaurant types
export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  email: string;
  hours: Record<string, { open: string; close: string }>;
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Dish types
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
  modelUrl?: string;
  ingredients: string[];
  allergens: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

// Cart types
export interface CartItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  restaurantId: string;
}

// Order types
export interface OrderItem {
  id: string;
  orderId: string;
  dishId: string;
  quantity: number;
  price: number;
  dish?: Dish;
}

export interface Order {
  id: string;
  orderNumber: string;
  restaurantId: string;
  customerId?: string;
  status: OrderStatus;
  totalPrice: number;
  tableNumber?: string;
  specialInstructions?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// Feedback types
export interface Feedback {
  id: string;
  restaurantId: string;
  orderId: string;
  customerId: string;
  dishId?: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

// AI Assistant types
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: DishSuggestion[];
}

export interface DishSuggestion {
  dishId: string;
  name: string;
  reason: string;
  price: number;
}

export interface ChatContext {
  restaurantName: string;
  menu: Dish[];
  history: AIMessage[];
}

// Analytics types
export interface AnalyticsMetrics {
  revenue: number;
  orderCount: number;
  averageOrderValue: number;
  topDishes: Array<{ dishId: string; name: string; count: number }>;
  period: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
  meta?: {
    timestamp: string;
    version: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface DishFormData {
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  price: number;
  category: string;
  ingredients: string[];
  allergens: string[];
  isAvailable: boolean;
}

// Notification types
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// WebSocket types
export interface WebSocketMessage {
  event: string;
  data: unknown;
  timestamp: string;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncResult<T> = Promise<T>;
