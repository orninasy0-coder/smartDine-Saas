/**
 * useCart hook - manages cart state using Zustand store
 * This is a convenience wrapper around the cart store
 */

import { useCartStore } from '@/store/cartStore';
import type { CartItem } from '@/store/cartStore';

export const useCart = () => {
  const items = useCartStore((state) => state.items);
  const restaurantId = useCartStore((state) => state.restaurantId);
  const tableNumber = useCartStore((state) => state.tableNumber);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const updateNotes = useCartStore((state) => state.updateNotes);
  const clearCart = useCartStore((state) => state.clearCart);
  const setTableNumber = useCartStore((state) => state.setTableNumber);
  const getTotal = useCartStore((state) => state.getTotal);
  const getItemCount = useCartStore((state) => state.getItemCount);

  return {
    cart: {
      items,
      total: getTotal(),
      restaurantId: restaurantId || '',
      tableNumber,
    },
    addItem: (item: CartItem, restaurantIdParam: string) => addItem(item, restaurantIdParam),
    updateQuantity,
    updateNotes,
    removeItem,
    clearCart,
    setTableNumber,
    itemCount: getItemCount(),
  };
};
