/**
 * Query Key Factories
 * 
 * Centralized query key management for React Query
 * Provides type-safe, hierarchical query keys
 */

export const queryKeys = {
  // Authentication
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },

  // Menu
  menu: {
    all: ['menu'] as const,
    restaurant: (restaurantId: string) => [...queryKeys.menu.all, restaurantId] as const,
    dishes: (restaurantId: string) => [...queryKeys.menu.restaurant(restaurantId), 'dishes'] as const,
    dish: (restaurantId: string, dishId: string) => 
      [...queryKeys.menu.dishes(restaurantId), dishId] as const,
    categories: (restaurantId: string) => 
      [...queryKeys.menu.restaurant(restaurantId), 'categories'] as const,
    search: (restaurantId: string, query: string) => 
      [...queryKeys.menu.restaurant(restaurantId), 'search', query] as const,
  },

  // Orders
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => 
      [...queryKeys.orders.lists(), filters] as const,
    detail: (orderId: string) => [...queryKeys.orders.all, orderId] as const,
    byStatus: (status: string) => [...queryKeys.orders.all, { status }] as const,
    byRestaurant: (restaurantId: string) => 
      [...queryKeys.orders.all, { restaurantId }] as const,
  },

  // Cart (rarely used with React Query, mostly Zustand)
  cart: {
    all: ['cart'] as const,
    validation: (restaurantId: string) => 
      [...queryKeys.cart.all, 'validation', restaurantId] as const,
  },

  // AI Assistant
  ai: {
    all: ['ai'] as const,
    conversation: (sessionId: string) => [...queryKeys.ai.all, 'conversation', sessionId] as const,
    recommendations: (restaurantId: string, context?: Record<string, unknown>) => 
      [...queryKeys.ai.all, 'recommendations', restaurantId, context] as const,
  },

  // Analytics
  analytics: {
    all: ['analytics'] as const,
    revenue: (restaurantId: string, period: string) => 
      [...queryKeys.analytics.all, 'revenue', restaurantId, { period }] as const,
    orders: (restaurantId: string, period: string) => 
      [...queryKeys.analytics.all, 'orders', restaurantId, { period }] as const,
    topDishes: (restaurantId: string, period: string) => 
      [...queryKeys.analytics.all, 'top-dishes', restaurantId, { period }] as const,
    insights: (restaurantId: string) => 
      [...queryKeys.analytics.all, 'insights', restaurantId] as const,
  },

  // Feedback
  feedback: {
    all: ['feedback'] as const,
    restaurant: (restaurantId: string) => 
      [...queryKeys.feedback.all, 'restaurant', restaurantId] as const,
    dish: (dishId: string) => [...queryKeys.feedback.all, 'dish', dishId] as const,
  },

  // Subscriptions
  subscriptions: {
    all: ['subscriptions'] as const,
    plans: () => [...queryKeys.subscriptions.all, 'plans'] as const,
    current: () => [...queryKeys.subscriptions.all, 'current'] as const,
  },

  // Restaurant Management
  restaurants: {
    all: ['restaurants'] as const,
    lists: () => [...queryKeys.restaurants.all, 'list'] as const,
    detail: (restaurantId: string) => [...queryKeys.restaurants.all, restaurantId] as const,
    settings: (restaurantId: string) => 
      [...queryKeys.restaurants.detail(restaurantId), 'settings'] as const,
    staff: (restaurantId: string) => 
      [...queryKeys.restaurants.detail(restaurantId), 'staff'] as const,
    qrCodes: (restaurantId: string) => 
      [...queryKeys.restaurants.detail(restaurantId), 'qr-codes'] as const,
  },

  // Admin
  admin: {
    all: ['admin'] as const,
    restaurants: () => [...queryKeys.admin.all, 'restaurants'] as const,
    analytics: () => [...queryKeys.admin.all, 'analytics'] as const,
    systemHealth: () => [...queryKeys.admin.all, 'system-health'] as const,
  },
} as const;

/**
 * Helper function to invalidate all queries for a specific feature
 */
export const invalidateFeature = (feature: keyof typeof queryKeys) => {
  return { queryKey: queryKeys[feature].all };
};
