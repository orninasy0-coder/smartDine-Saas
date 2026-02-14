/**
 * Cart Store Tests
 * Tests for cart state management including Property 11: Cart State Consistency
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from './cartStore';
import type { CartItem } from './cartStore';

describe('Cart Store', () => {
  beforeEach(() => {
    // Clear cart before each test
    useCartStore.getState().clearCart();
  });

  describe('Basic Operations', () => {
    it('should start with empty cart', () => {
      const state = useCartStore.getState();
      expect(state.items).toEqual([]);
      expect(state.restaurantId).toBeNull();
      expect(state.tableNumber).toBeNull();
      expect(state.getTotal()).toBe(0);
      expect(state.getItemCount()).toBe(0);
    });

    it('should add item to cart', () => {
      const item: CartItem = {
        dishId: 'dish-1',
        name: 'Test Dish',
        price: 10.5,
        quantity: 2,
      };

      useCartStore.getState().addItem(item, 'restaurant-1');
      const state = useCartStore.getState();

      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(item);
      expect(state.restaurantId).toBe('restaurant-1');
    });

    it('should increment quantity when adding existing item', () => {
      const item: CartItem = {
        dishId: 'dish-1',
        name: 'Test Dish',
        price: 10.5,
        quantity: 2,
      };

      useCartStore.getState().addItem(item, 'restaurant-1');
      useCartStore.getState().addItem({ ...item, quantity: 3 }, 'restaurant-1');
      const state = useCartStore.getState();

      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(5);
    });

    it('should clear cart when adding item from different restaurant', () => {
      const item1: CartItem = {
        dishId: 'dish-1',
        name: 'Test Dish 1',
        price: 10.5,
        quantity: 2,
      };
      const item2: CartItem = {
        dishId: 'dish-2',
        name: 'Test Dish 2',
        price: 15.0,
        quantity: 1,
      };

      useCartStore.getState().addItem(item1, 'restaurant-1');
      useCartStore.getState().addItem(item2, 'restaurant-2');
      const state = useCartStore.getState();

      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(item2);
      expect(state.restaurantId).toBe('restaurant-2');
    });

    it('should remove item from cart', () => {
      const item: CartItem = {
        dishId: 'dish-1',
        name: 'Test Dish',
        price: 10.5,
        quantity: 2,
      };

      useCartStore.getState().addItem(item, 'restaurant-1');
      useCartStore.getState().removeItem('dish-1');
      const state = useCartStore.getState();

      expect(state.items).toHaveLength(0);
    });

    it('should update item quantity', () => {
      const item: CartItem = {
        dishId: 'dish-1',
        name: 'Test Dish',
        price: 10.5,
        quantity: 2,
      };

      useCartStore.getState().addItem(item, 'restaurant-1');
      useCartStore.getState().updateQuantity('dish-1', 5);
      const state = useCartStore.getState();

      expect(state.items[0].quantity).toBe(5);
    });

    it('should update item notes', () => {
      const item: CartItem = {
        dishId: 'dish-1',
        name: 'Test Dish',
        price: 10.5,
        quantity: 2,
      };

      useCartStore.getState().addItem(item, 'restaurant-1');
      useCartStore.getState().updateNotes('dish-1', 'No onions please');
      const state = useCartStore.getState();

      expect(state.items[0].notes).toBe('No onions please');
    });

    it('should clear entire cart', () => {
      const item: CartItem = {
        dishId: 'dish-1',
        name: 'Test Dish',
        price: 10.5,
        quantity: 2,
      };

      useCartStore.getState().addItem(item, 'restaurant-1');
      useCartStore.getState().setTableNumber('5');
      useCartStore.getState().clearCart();
      const state = useCartStore.getState();

      expect(state.items).toHaveLength(0);
      expect(state.restaurantId).toBeNull();
      expect(state.tableNumber).toBeNull();
    });

    it('should set table number', () => {
      useCartStore.getState().setTableNumber('10');
      const state = useCartStore.getState();

      expect(state.tableNumber).toBe('10');
    });
  });

  describe('Total Calculation', () => {
    it('should calculate total for single item', () => {
      const state = useCartStore.getState();
      const item: CartItem = {
        dishId: 'dish-1',
        name: 'Test Dish',
        price: 10.5,
        quantity: 2,
      };

      state.addItem(item, 'restaurant-1');

      expect(state.getTotal()).toBe(21.0);
    });

    it('should calculate total for multiple items', () => {
      const state = useCartStore.getState();
      const items: CartItem[] = [
        { dishId: 'dish-1', name: 'Dish 1', price: 10.5, quantity: 2 },
        { dishId: 'dish-2', name: 'Dish 2', price: 15.0, quantity: 1 },
        { dishId: 'dish-3', name: 'Dish 3', price: 8.25, quantity: 3 },
      ];

      items.forEach((item) => state.addItem(item, 'restaurant-1'));

      const expectedTotal = 10.5 * 2 + 15.0 * 1 + 8.25 * 3;
      expect(state.getTotal()).toBe(expectedTotal);
    });

    it('should update total when quantity changes', () => {
      const state = useCartStore.getState();
      const item: CartItem = {
        dishId: 'dish-1',
        name: 'Test Dish',
        price: 10.5,
        quantity: 2,
      };

      state.addItem(item, 'restaurant-1');
      expect(state.getTotal()).toBe(21.0);

      state.updateQuantity('dish-1', 5);
      expect(state.getTotal()).toBe(52.5);
    });

    it('should update total when item is removed', () => {
      const state = useCartStore.getState();
      const items: CartItem[] = [
        { dishId: 'dish-1', name: 'Dish 1', price: 10.5, quantity: 2 },
        { dishId: 'dish-2', name: 'Dish 2', price: 15.0, quantity: 1 },
      ];

      items.forEach((item) => state.addItem(item, 'restaurant-1'));
      expect(state.getTotal()).toBe(36.0);

      state.removeItem('dish-1');
      expect(state.getTotal()).toBe(15.0);
    });
  });

  describe('Item Count', () => {
    it('should return zero for empty cart', () => {
      const state = useCartStore.getState();
      expect(state.getItemCount()).toBe(0);
    });

    it('should count total items across all dishes', () => {
      const state = useCartStore.getState();
      const items: CartItem[] = [
        { dishId: 'dish-1', name: 'Dish 1', price: 10.5, quantity: 2 },
        { dishId: 'dish-2', name: 'Dish 2', price: 15.0, quantity: 3 },
        { dishId: 'dish-3', name: 'Dish 3', price: 8.25, quantity: 1 },
      ];

      items.forEach((item) => state.addItem(item, 'restaurant-1'));

      expect(state.getItemCount()).toBe(6);
    });

    it('should update count when quantity changes', () => {
      const state = useCartStore.getState();
      const item: CartItem = {
        dishId: 'dish-1',
        name: 'Test Dish',
        price: 10.5,
        quantity: 2,
      };

      state.addItem(item, 'restaurant-1');
      expect(state.getItemCount()).toBe(2);

      state.updateQuantity('dish-1', 5);
      expect(state.getItemCount()).toBe(5);
    });
  });

  describe('Property 11: Cart State Consistency', () => {
    /**
     * Property 11: Cart State Consistency
     * For any cart operation (add, update quantity, remove),
     * the cart total should equal the sum of (item.price × item.quantity) for all items.
     * 
     * **Validates: Requirements 3.5, 3.6, 3.7, 3.8**
     */
    it('should maintain total consistency after adding items', () => {
      const state = useCartStore.getState();
      const items: CartItem[] = [
        { dishId: 'dish-1', name: 'Dish 1', price: 12.99, quantity: 2 },
        { dishId: 'dish-2', name: 'Dish 2', price: 8.50, quantity: 3 },
        { dishId: 'dish-3', name: 'Dish 3', price: 15.75, quantity: 1 },
      ];

      items.forEach((item) => state.addItem(item, 'restaurant-1'));

      const expectedTotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const actualTotal = state.getTotal();

      expect(actualTotal).toBeCloseTo(expectedTotal, 2);
    });

    it('should maintain total consistency after updating quantities', () => {
      const state = useCartStore.getState();
      const items: CartItem[] = [
        { dishId: 'dish-1', name: 'Dish 1', price: 12.99, quantity: 2 },
        { dishId: 'dish-2', name: 'Dish 2', price: 8.50, quantity: 3 },
      ];

      items.forEach((item) => state.addItem(item, 'restaurant-1'));

      // Update quantities
      state.updateQuantity('dish-1', 5);
      state.updateQuantity('dish-2', 1);

      const expectedTotal = 12.99 * 5 + 8.50 * 1;
      const actualTotal = state.getTotal();

      expect(actualTotal).toBeCloseTo(expectedTotal, 2);
    });

    it('should maintain total consistency after removing items', () => {
      const state = useCartStore.getState();
      const items: CartItem[] = [
        { dishId: 'dish-1', name: 'Dish 1', price: 12.99, quantity: 2 },
        { dishId: 'dish-2', name: 'Dish 2', price: 8.50, quantity: 3 },
        { dishId: 'dish-3', name: 'Dish 3', price: 15.75, quantity: 1 },
      ];

      items.forEach((item) => state.addItem(item, 'restaurant-1'));

      // Remove one item
      state.removeItem('dish-2');

      const expectedTotal = 12.99 * 2 + 15.75 * 1;
      const actualTotal = state.getTotal();

      expect(actualTotal).toBeCloseTo(expectedTotal, 2);
    });

    it('should maintain total consistency with decimal prices', () => {
      const state = useCartStore.getState();
      const items: CartItem[] = [
        { dishId: 'dish-1', name: 'Dish 1', price: 9.99, quantity: 3 },
        { dishId: 'dish-2', name: 'Dish 2', price: 12.49, quantity: 2 },
        { dishId: 'dish-3', name: 'Dish 3', price: 7.25, quantity: 4 },
      ];

      items.forEach((item) => state.addItem(item, 'restaurant-1'));

      const expectedTotal = 9.99 * 3 + 12.49 * 2 + 7.25 * 4;
      const actualTotal = state.getTotal();

      expect(actualTotal).toBeCloseTo(expectedTotal, 2);
    });

    it('should maintain total consistency through complex operations', () => {
      const state = useCartStore.getState();

      // Add items
      state.addItem(
        { dishId: 'dish-1', name: 'Dish 1', price: 10.5, quantity: 2 },
        'restaurant-1'
      );
      state.addItem(
        { dishId: 'dish-2', name: 'Dish 2', price: 15.0, quantity: 1 },
        'restaurant-1'
      );
      state.addItem(
        { dishId: 'dish-3', name: 'Dish 3', price: 8.25, quantity: 3 },
        'restaurant-1'
      );

      // Update quantity
      state.updateQuantity('dish-1', 5);

      // Remove item
      state.removeItem('dish-2');

      // Add same item again
      state.addItem(
        { dishId: 'dish-1', name: 'Dish 1', price: 10.5, quantity: 1 },
        'restaurant-1'
      );

      const expectedTotal = 10.5 * 6 + 8.25 * 3;
      const actualTotal = state.getTotal();

      expect(actualTotal).toBeCloseTo(expectedTotal, 2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero quantity items', () => {
      const state = useCartStore.getState();
      const item: CartItem = {
        dishId: 'dish-1',
        name: 'Test Dish',
        price: 10.5,
        quantity: 0,
      };

      state.addItem(item, 'restaurant-1');

      expect(state.getTotal()).toBe(0);
      expect(state.getItemCount()).toBe(0);
    });

    it('should handle items with zero price', () => {
      const state = useCartStore.getState();
      const item: CartItem = {
        dishId: 'dish-1',
        name: 'Free Item',
        price: 0,
        quantity: 5,
      };

      state.addItem(item, 'restaurant-1');

      expect(state.getTotal()).toBe(0);
      expect(state.getItemCount()).toBe(5);
    });

    it('should handle large quantities', () => {
      const state = useCartStore.getState();
      const item: CartItem = {
        dishId: 'dish-1',
        name: 'Test Dish',
        price: 10.5,
        quantity: 100,
      };

      state.addItem(item, 'restaurant-1');

      expect(state.getTotal()).toBe(1050);
      expect(state.getItemCount()).toBe(100);
    });

    it('should handle very small prices', () => {
      const state = useCartStore.getState();
      const item: CartItem = {
        dishId: 'dish-1',
        name: 'Cheap Item',
        price: 0.01,
        quantity: 3,
      };

      state.addItem(item, 'restaurant-1');

      expect(state.getTotal()).toBeCloseTo(0.03, 2);
    });
  });
});
