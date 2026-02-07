/**
 * useMenuSearch hook - searches menu items
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { menuService } from '../services';

export const useMenuSearch = (restaurantId: string) => {
  const [query, setQuery] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['menu-search', restaurantId, query],
    queryFn: () => menuService.searchMenu(restaurantId, query),
    enabled: query.length > 0,
  });

  return {
    results: data || [],
    isLoading,
    error,
    query,
    setQuery,
  };
};
