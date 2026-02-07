/**
 * Application-wide constants
 */

import { env } from '../env';

export const APP_NAME = env.APP_NAME;

export const API_VERSION = 'v1';

export const API_BASE_URL = env.API_BASE_URL;

export const ROUTES = {
  HOME: '/',
  PRICING: '/pricing',
  DEMO: '/demo',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  RESET_PASSWORD: '/reset-password',
  TWO_FACTOR: '/2fa-setup',
  MENU: '/:restaurantSlug/menu',
  DISH_DETAIL: '/:restaurantSlug/menu/dish/:dishId',
  CART: '/:restaurantSlug/cart',
  ORDER_CONFIRMATION: '/:restaurantSlug/order/:orderId',
  KITCHEN: '/kitchen/orders',
  DELIVERY: '/delivery/orders',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
} as const;

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PREPARING: 'PREPARING',
  READY: 'READY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  RESTAURANT_OWNER: 'RESTAURANT_OWNER',
  KITCHEN_STAFF: 'KITCHEN_STAFF',
  DELIVERY_PERSONNEL: 'DELIVERY_PERSONNEL',
  PLATFORM_ADMIN: 'PLATFORM_ADMIN',
} as const;

export const SUBSCRIPTION_PLANS = {
  BASIC: 'BASIC',
  PRO: 'PRO',
  ENTERPRISE: 'ENTERPRISE',
} as const;

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  CANCELLED: 'CANCELLED',
  GRACE_PERIOD: 'GRACE_PERIOD',
} as const;

export const DISH_CATEGORIES = [
  'appetizers',
  'mains',
  'desserts',
  'beverages',
  'sides',
  'specials',
] as const;

export const LANGUAGES = {
  EN: 'en',
  AR: 'ar',
} as const;

export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
} as const;

export const MAX_FILE_SIZES = {
  IMAGE: env.MAX_UPLOAD_SIZE,
  MODEL_3D: env.MAX_MODEL_SIZE,
} as const;

export const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

export const SUPPORTED_MODEL_FORMATS = ['model/gltf-binary', 'model/gltf+json'];

export const CACHE_KEYS = {
  MENU: 'menu',
  CART: 'cart',
  USER: 'user',
  TENANT: 'tenant',
  LANGUAGE: 'language',
  THEME: 'theme',
} as const;

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: env.AUTH_TOKEN_KEY,
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  CART: 'cart',
  LANGUAGE: 'language',
  THEME: 'theme',
} as const;

export const NOTIFICATION_TYPES = {
  ORDER_CREATED: 'ORDER_CREATED',
  ORDER_STATUS_CHANGED: 'ORDER_STATUS_CHANGED',
  ORDER_READY: 'ORDER_READY',
  ORDER_DELIVERED: 'ORDER_DELIVERED',
  SUBSCRIPTION_EXPIRING: 'SUBSCRIPTION_EXPIRING',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
} as const;

export const WEBSOCKET_EVENTS = {
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  ORDER_STATUS_CHANGED: 'order.status.changed',
  KITCHEN_NOTIFICATION: 'kitchen.notification',
  DELIVERY_NOTIFICATION: 'delivery.notification',
} as const;

export const AI_QUOTA = {
  BASIC: 100,
  PRO: 1000,
  ENTERPRISE: -1, // unlimited
} as const;

export const PERFORMANCE_TARGETS = {
  MENU_LOAD_TIME: 2000, // 2 seconds
  ORDER_SUBMIT_TIME: 1000, // 1 second
  API_RESPONSE_TIME: 500, // 500ms
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL: true,
} as const;

export const RATE_LIMITS = {
  AUTH_ATTEMPTS: 5,
  AUTH_WINDOW: 15 * 60 * 1000, // 15 minutes
  API_REQUESTS: 100,
  API_WINDOW: 15 * 60 * 1000, // 15 minutes
} as const;
