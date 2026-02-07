/**
 * useCreateOrder hook - handles order creation
 */

import { useMutation } from '@tanstack/react-query';
import { orderService, type CreateOrderData } from '../services';

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (data: CreateOrderData) => orderService.createOrder(data),
  });
};
