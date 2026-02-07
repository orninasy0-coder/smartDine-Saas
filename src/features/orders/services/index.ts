/**
 * Order services
 */

import { apiClient } from '@/services/api/client';
import type { Order, OrderStatus } from '@/utils/types';

export interface CreateOrderData {
  restaurantId: string;
  items: Array<{
    dishId: string;
    quantity: number;
    price: number;
  }>;
  tableNumber?: string;
  specialInstructions?: string;
}

export const orderService = {
  /**
   * Create new order
   */
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    return apiClient.post<Order>('/orders', data);
  },

  /**
   * Get order by ID
   */
  getOrder: async (orderId: string): Promise<Order> => {
    return apiClient.get<Order>(`/orders/${orderId}`);
  },

  /**
   * Get orders (filtered by role)
   */
  getOrders: async (filters?: {
    status?: OrderStatus;
    restaurantId?: string;
  }): Promise<Order[]> => {
    return apiClient.get<Order[]>('/orders', { params: filters });
  },

  /**
   * Update order status
   */
  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<Order> => {
    return apiClient.patch<Order>(`/orders/${orderId}/status`, { status });
  },

  /**
   * Cancel order
   */
  cancelOrder: async (orderId: string): Promise<void> => {
    return apiClient.delete<void>(`/orders/${orderId}`);
  },
};
