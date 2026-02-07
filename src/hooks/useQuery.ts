/**
 * Custom React Query Hooks
 *
 * This file contains reusable hooks and utilities for React Query
 */

export { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Query Keys Factory
 *
 * Centralized query keys for better cache management and type safety
 */
export const queryKeys = {
  // Authentication
  auth: {
    me: ['auth', 'me'] as const,
    session: ['auth', 'session'] as const,
  },

  // Menu
  menu: {
    all: (restaurantId: string) => ['menu', restaurantId] as const,
    dish: (restaurantId: string, dishId: string) => ['menu', restaurantId, 'dish', dishId] as const,
    search: (restaurantId: string, query: string) =>
      ['menu', restaurantId, 'search', query] as const,
  },

  // Orders
  orders: {
    all: (filters?: Record<string, unknown>) => ['orders', filters] as const,
    detail: (orderId: string) => ['orders', orderId] as const,
  },

  // AI Assistant
  ai: {
    conversation: (sessionId: string) => ['ai', 'conversation', sessionId] as const,
  },

  // Analytics
  analytics: {
    revenue: (restaurantId: string, period: string) =>
      ['analytics', restaurantId, 'revenue', period] as const,
    orders: (restaurantId: string, period: string) =>
      ['analytics', restaurantId, 'orders', period] as const,
    topDishes: (restaurantId: string, period: string) =>
      ['analytics', restaurantId, 'top-dishes', period] as const,
  },

  // Feedback
  feedback: {
    restaurant: (restaurantId: string) => ['feedback', 'restaurant', restaurantId] as const,
    dish: (dishId: string) => ['feedback', 'dish', dishId] as const,
  },

  // Subscriptions
  subscriptions: {
    plans: ['subscriptions', 'plans'] as const,
    current: ['subscriptions', 'current'] as const,
  },

  // Admin
  admin: {
    restaurants: (filters?: Record<string, unknown>) => ['admin', 'restaurants', filters] as const,
    platformAnalytics: ['admin', 'analytics', 'platform'] as const,
  },
} as const;
