/**
 * Cart services
 */

import { storage } from '@/services/storage';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants';
import type { CartItem, CartState } from '@/utils/types';

export const cartService = {
  /**
   * Get cart from storage
   */
  getCart: (): CartState => {
    return storage.get<CartState>(LOCAL_STORAGE_KEYS.CART, {
      items: [],
      total: 0,
      restaurantId: '',
    });
  },

  /**
   * Save cart to storage
   */
  saveCart: (cart: CartState): void => {
    storage.set(LOCAL_STORAGE_KEYS.CART, cart);
  },

  /**
   * Clear cart
   */
  clearCart: (): void => {
    storage.remove(LOCAL_STORAGE_KEYS.CART);
  },

  /**
   * Calculate cart total
   */
  calculateTotal: (items: CartItem[]): number => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  /**
   * Add item to cart
   */
  addItem: (cart: CartState, item: CartItem): CartState => {
    const existingItem = cart.items.find((i) => i.dishId === item.dishId);

    let newItems: CartItem[];
    if (existingItem) {
      newItems = cart.items.map((i) =>
        i.dishId === item.dishId ? { ...i, quantity: i.quantity + item.quantity } : i
      );
    } else {
      newItems = [...cart.items, item];
    }

    const newCart = {
      ...cart,
      items: newItems,
      total: cartService.calculateTotal(newItems),
    };

    cartService.saveCart(newCart);
    return newCart;
  },

  /**
   * Update item quantity
   */
  updateQuantity: (cart: CartState, dishId: string, quantity: number): CartState => {
    const newItems = cart.items.map((item) =>
      item.dishId === dishId ? { ...item, quantity } : item
    );

    const newCart = {
      ...cart,
      items: newItems,
      total: cartService.calculateTotal(newItems),
    };

    cartService.saveCart(newCart);
    return newCart;
  },

  /**
   * Remove item from cart
   */
  removeItem: (cart: CartState, dishId: string): CartState => {
    const newItems = cart.items.filter((item) => item.dishId !== dishId);

    const newCart = {
      ...cart,
      items: newItems,
      total: cartService.calculateTotal(newItems),
    };

    cartService.saveCart(newCart);
    return newCart;
  },
};
