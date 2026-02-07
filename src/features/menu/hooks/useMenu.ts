/**
 * useMenu hook - manages menu data
 */

import { useQuery } from '@tanstack/react-query';
import { menuService } from '../services';

export const useMenu = (restaurantId: string) => {
  return useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: () => menuService.getMenu(restaurantId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
