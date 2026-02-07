/**
 * useOrder hook - fetches single order
 */

import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services';

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrder(orderId),
    enabled: !!orderId,
    refetchInterval: 3000, // Refetch every 3 seconds for status updates
  });
};
