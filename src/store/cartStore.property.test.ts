/**
 * Cart Store Property-Based Tests
 * Property 11: Cart State Consistency
 * 
 * For any cart operation (add, update quantity, remove),
 * the cart total should equal the sum of (item.price × item.quantity) for all items.
 * 
 * **Validates: Requirements 3.5, 3.6, 3.7, 3.8**
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { useCartStore } from './cartStore';
import type { CartItem } from './cartStore';

describe('Cart Store - Property-Based Tests', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  /**
   * Property 11: Cart State Consistency
   * The cart total must always equal the sum of (item.price × item.quantity)
   */
  describe('Property 11: Cart State Consistency', () => {
    it('should maintain total consistency for any sequence of add operations', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              dishId: fc.string({ minLength: 1, maxLength: 20 }),
              name: fc.string({ minLength: 1, maxLength: 50 }),
              price: fc.float({ min: 0, max: 1000, noNaN: true }),
              quantity: fc.integer({ min: 1, max: 100 }),
            }),
            { minLength: 1, maxLength: 20 }
          ),
          (items) => {
            // Clear cart before test
            useCartStore.getState().clearCart();

            const state = useCartStore.getState();
            const restaurantId = 'test-restaurant';

            // Add all items
            items.forEach((item) => {
              state.addItem(item as CartItem, restaurantId);
            });

            // Calculate expected total manually
            const cartItems = state.items;
            const expectedTotal = cartItems.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );

            const actualTotal = state.getTotal();

            // Allow small floating point differences
            expect(Math.abs(actualTotal - expectedTotal)).toBeLessThan(0.02);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain total consistency after quantity updates', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              dishId: fc.string({ minLength: 1, maxLength: 20 }),
              name: fc.string({ minLength: 1, maxLength: 50 }),
              price: fc.float({ min: 0, max: 1000, noNaN: true }),
              quantity: fc.integer({ min: 1, max: 100 }),
            }),
            { minLength: 1, maxLength: 10 }
          ),
          fc.array(
            fc.record({
              index: fc.integer({ min: 0, max: 9 }),
              newQuantity: fc.integer({ min: 1, max: 100 }),
            }),
            { minLength: 1, maxLength: 5 }
          ),
          (items, updates) => {
            // Clear cart before test
            useCartStore.getState().clearCart();

            const state = useCartStore.getState();
            const restaurantId = 'test-restaurant';

            // Add all items
            items.forEach((item) => {
              state.addItem(item as CartItem, restaurantId);
            });

            // Apply quantity updates
            updates.forEach((update) => {
              const itemIndex = update.index % state.items.length;
              if (itemIndex < state.items.length) {
                const dishId = state.items[itemIndex].dishId;
                state.updateQuantity(dishId, update.newQuantity);
              }
            });

            // Calculate expected total
            const expectedTotal = state.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );

            const actualTotal = state.getTotal();

            expect(Math.abs(actualTotal - expectedTotal)).toBeLessThan(0.02);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain total consistency after remove operations', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              dishId: fc.string({ minLength: 1, maxLength: 20 }),
              name: fc.string({ minLength: 1, maxLength: 50 }),
              price: fc.float({ min: 0, max: 1000, noNaN: true }),
              quantity: fc.integer({ min: 1, max: 100 }),
            }),
            { minLength: 2, maxLength: 10 }
          ),
          fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 1, maxLength: 5 }),
          (items, removeIndices) => {
            // Clear cart before test
            useCartStore.getState().clearCart();

            const state = useCartStore.getState();
            const restaurantId = 'test-restaurant';

            // Add all items
            items.forEach((item) => {
              state.addItem(item as CartItem, restaurantId);
            });

            // Remove items
            removeIndices.forEach((index) => {
              const itemIndex = index % state.items.length;
              if (itemIndex < state.items.length && state.items.length > 0) {
                const dishId = state.items[itemIndex].dishId;
                state.removeItem(dishId);
              }
            });

            // Calculate expected total
            const expectedTotal = state.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );

            const actualTotal = state.getTotal();

            expect(Math.abs(actualTotal - expectedTotal)).toBeLessThan(0.02);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain total consistency through mixed operations', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              dishId: fc.string({ minLength: 1, maxLength: 20 }),
              name: fc.string({ minLength: 1, maxLength: 50 }),
              price: fc.float({ min: 0, max: 1000, noNaN: true }),
              quantity: fc.integer({ min: 1, max: 100 }),
            }),
            { minLength: 1, maxLength: 10 }
          ),
          fc.array(
            fc.oneof(
              fc.record({
                type: fc.constant('add' as const),
                item: fc.record({
                  dishId: fc.string({ minLength: 1, maxLength: 20 }),
                  name: fc.string({ minLength: 1, maxLength: 50 }),
                  price: fc.float({ min: 0, max: 1000, noNaN: true }),
                  quantity: fc.integer({ min: 1, max: 100 }),
                }),
              }),
              fc.record({
                type: fc.constant('update' as const),
                index: fc.integer({ min: 0, max: 9 }),
                quantity: fc.integer({ min: 1, max: 100 }),
              }),
              fc.record({
                type: fc.constant('remove' as const),
                index: fc.integer({ min: 0, max: 9 }),
              })
            ),
            { minLength: 1, maxLength: 20 }
          ),
          (initialItems, operations) => {
            // Clear cart before test
            useCartStore.getState().clearCart();

            const state = useCartStore.getState();
            const restaurantId = 'test-restaurant';

            // Add initial items
            initialItems.forEach((item) => {
              state.addItem(item as CartItem, restaurantId);
            });

            // Apply operations
            operations.forEach((op) => {
              if (op.type === 'add') {
                state.addItem(op.item as CartItem, restaurantId);
              } else if (op.type === 'update' && state.items.length > 0) {
                const itemIndex = op.index % state.items.length;
                const dishId = state.items[itemIndex].dishId;
                state.updateQuantity(dishId, op.quantity);
              } else if (op.type === 'remove' && state.items.length > 0) {
                const itemIndex = op.index % state.items.length;
                const dishId = state.items[itemIndex].dishId;
                state.removeItem(dishId);
              }
            });

            // Calculate expected total
            const expectedTotal = state.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );

            const actualTotal = state.getTotal();

            expect(Math.abs(actualTotal - expectedTotal)).toBeLessThan(0.02);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain item count consistency', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              dishId: fc.string({ minLength: 1, maxLength: 20 }),
              name: fc.string({ minLength: 1, maxLength: 50 }),
              price: fc.float({ min: 0, max: 1000, noNaN: true }),
              quantity: fc.integer({ min: 1, max: 100 }),
            }),
            { minLength: 1, maxLength: 20 }
          ),
          (items) => {
            // Clear cart before test
            useCartStore.getState().clearCart();

            const state = useCartStore.getState();
            const restaurantId = 'test-restaurant';

            // Add all items
            items.forEach((item) => {
              state.addItem(item as CartItem, restaurantId);
            });

            // Calculate expected count
            const expectedCount = state.items.reduce(
              (sum, item) => sum + item.quantity,
              0
            );

            const actualCount = state.getItemCount();

            expect(actualCount).toBe(expectedCount);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle restaurant switching correctly', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              dishId: fc.string({ minLength: 1, maxLength: 20 }),
              name: fc.string({ minLength: 1, maxLength: 50 }),
              price: fc.float({ min: 0, max: 1000, noNaN: true }),
              quantity: fc.integer({ min: 1, max: 100 }),
            }),
            { minLength: 1, maxLength: 5 }
          ),
          fc.string({ minLength: 1, maxLength: 20 }),
          fc.array(
            fc.record({
              dishId: fc.string({ minLength: 1, maxLength: 20 }),
              name: fc.string({ minLength: 1, maxLength: 50 }),
              price: fc.float({ min: 0, max: 1000, noNaN: true }),
              quantity: fc.integer({ min: 1, max: 100 }),
            }),
            { minLength: 1, maxLength: 5 }
          ),
          fc.string({ minLength: 1, maxLength: 20 }),
          (items1, restaurant1, items2, restaurant2) => {
            // Ensure different restaurants
            if (restaurant1 === restaurant2) return;

            // Clear cart before test
            useCartStore.getState().clearCart();

            const state = useCartStore.getState();

            // Add items from restaurant 1
            items1.forEach((item) => {
              state.addItem(item as CartItem, restaurant1);
            });

            // Add items from restaurant 2 (should clear cart)
            items2.forEach((item) => {
              state.addItem(item as CartItem, restaurant2);
            });

            // Cart should only contain items from restaurant 2
            expect(state.restaurantId).toBe(restaurant2);

            // Calculate expected total for restaurant 2 items only
            const expectedTotal = state.items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            );

            const actualTotal = state.getTotal();

            expect(Math.abs(actualTotal - expectedTotal)).toBeLessThan(0.02);
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
