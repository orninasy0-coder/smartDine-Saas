import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Cart State Types
 */
export interface CartItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  notes?: string;
}

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  tableNumber: string | null;
}

interface CartActions {
  addItem: (item: CartItem, restaurantId: string) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  updateNotes: (dishId: string, notes: string) => void;
  clearCart: () => void;
  setTableNumber: (tableNumber: string) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

type CartStore = CartState & CartActions;

/**
 * Cart Store
 *
 * Manages shopping cart state
 * Persisted to localStorage
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      restaurantId: null,
      tableNumber: null,

      // Actions
      addItem: (item, restaurantId) =>
        set((state) => {
          // If cart has items from different restaurant, clear it
          if (state.restaurantId && state.restaurantId !== restaurantId) {
            return {
              items: [item],
              restaurantId,
            };
          }

          // Check if item already exists
          const existingItemIndex = state.items.findIndex((i) => i.dishId === item.dishId);

          if (existingItemIndex > -1) {
            // Update quantity if item exists
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += item.quantity;
            return {
              items: newItems,
              restaurantId,
            };
          }

          // Add new item
          return {
            items: [...state.items, item],
            restaurantId,
          };
        }),

      removeItem: (dishId) =>
        set((state) => ({
          items: state.items.filter((item) => item.dishId !== dishId),
        })),

      updateQuantity: (dishId, quantity) =>
        set((state) => ({
          items: state.items.map((item) => (item.dishId === dishId ? { ...item, quantity } : item)),
        })),

      updateNotes: (dishId, notes) =>
        set((state) => ({
          items: state.items.map((item) => (item.dishId === dishId ? { ...item, notes } : item)),
        })),

      clearCart: () =>
        set({
          items: [],
          restaurantId: null,
          tableNumber: null,
        }),

      setTableNumber: (tableNumber) =>
        set({
          tableNumber,
        }),

      getTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
