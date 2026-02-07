/**
 * Menu services
 */

import { apiClient } from '@/services/api/client';
import type { Dish } from '@/utils/types';

export const menuService = {
  /**
   * Get restaurant menu
   */
  getMenu: async (restaurantId: string): Promise<Dish[]> => {
    return apiClient.get<Dish[]>(`/restaurants/${restaurantId}/menu`);
  },

  /**
   * Get dish details
   */
  getDish: async (restaurantId: string, dishId: string): Promise<Dish> => {
    return apiClient.get<Dish>(`/restaurants/${restaurantId}/menu/dishes/${dishId}`);
  },

  /**
   * Search menu
   */
  searchMenu: async (restaurantId: string, query: string): Promise<Dish[]> => {
    return apiClient.get<Dish[]>(`/restaurants/${restaurantId}/menu/search`, {
      params: { q: query },
    });
  },

  /**
   * Create dish (owner only)
   */
  createDish: async (restaurantId: string, data: Partial<Dish>): Promise<Dish> => {
    return apiClient.post<Dish>(`/restaurants/${restaurantId}/menu/dishes`, data);
  },

  /**
   * Update dish (owner only)
   */
  updateDish: async (restaurantId: string, dishId: string, data: Partial<Dish>): Promise<Dish> => {
    return apiClient.put<Dish>(`/restaurants/${restaurantId}/menu/dishes/${dishId}`, data);
  },

  /**
   * Delete dish (owner only)
   */
  deleteDish: async (restaurantId: string, dishId: string): Promise<void> => {
    return apiClient.delete<void>(`/restaurants/${restaurantId}/menu/dishes/${dishId}`);
  },
};
