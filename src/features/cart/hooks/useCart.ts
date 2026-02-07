/**
 * useCart hook - manages cart state
 */

import { useState, useEffect } from 'react';
import { cartService } from '../services';
import type { CartItem, CartState } from '@/utils/types';

export const useCart = () => {
  const [cart, setCart] = useState<CartState>(cartService.getCart());

  useEffect(() => {
    // Load cart from storage on mount
    setCart(cartService.getCart());
  }, []);

  const addItem = (item: CartItem) => {
    const newCart = cartService.addItem(cart, item);
    setCart(newCart);
  };

  const updateQuantity = (dishId: string, quantity: number) => {
    const newCart = cartService.updateQuantity(cart, dishId, quantity);
    setCart(newCart);
  };

  const removeItem = (dishId: string) => {
    const newCart = cartService.removeItem(cart, dishId);
    setCart(newCart);
  };

  const clearCart = () => {
    cartService.clearCart();
    setCart({ items: [], total: 0, restaurantId: '' });
  };

  return {
    cart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    itemCount: cart.items.length,
  };
};
