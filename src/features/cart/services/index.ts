/**
 * Cart services
 * 
 * Note: Cart state is now managed by Zustand store (src/store/cartStore.ts)
 * This file is kept for backward compatibility but should not be used directly.
 * Use the useCart hook or useCartStore instead.
 */

// Re-export the cart store for backward compatibility
export { useCartStore as cartStore } from '@/store/cartStore';
