/**
 * useDish hook - fetches single dish details
 */

import { useQuery } from '@tanstack/react-query';
import { menuService } from '../services';

export const useDish = (restaurantId: string, dishId: string) => {
  return useQuery({
    queryKey: ['dish', restaurantId, dishId],
    queryFn: () => menuService.getDish(restaurantId, dishId),
    enabled: !!restaurantId && !!dishId,
  });
};
