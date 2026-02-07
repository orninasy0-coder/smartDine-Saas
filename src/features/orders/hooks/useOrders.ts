/**
 * useOrders hook - fetches orders list
 */

import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services';
import type { OrderStatus } from '@/utils/types';

export const useOrders = (filters?: { status?: OrderStatus; restaurantId?: string }) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => orderService.getOrders(filters),
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });
};
