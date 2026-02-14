# Cart Feature

## Overview
The cart feature manages the shopping cart state for the SmartDine SaaS platform. It provides a centralized state management solution using Zustand with localStorage persistence.

## Architecture

### State Management
The cart uses **Zustand** as the single source of truth for cart state, with automatic persistence to localStorage.

```
┌─────────────────────────────────────────┐
│         Cart State (Zustand)            │
│  - items: CartItem[]                    │
│  - restaurantId: string | null          │
│  - tableNumber: string | null           │
│  - Persisted to localStorage            │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         useCart Hook                    │
│  Convenience wrapper around store       │
│  - Provides cart data and actions       │
│  - Used by components                   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Components                      │
│  - CartSidebar                          │
│  - Cart Page                            │
│  - DishDetail (add to cart)             │
└─────────────────────────────────────────┘
```

## Files

### Core Files
- `src/store/cartStore.ts` - Zustand store with cart state and actions
- `src/features/cart/hooks/useCart.ts` - Convenience hook wrapper
- `src/features/cart/components/CartSidebar.tsx` - Sidebar cart component
- `src/pages/Cart.tsx` - Full cart page

### Test Files
- `src/store/cartStore.test.ts` - Unit tests (25 tests)
- `src/store/cartStore.property.test.ts` - Property-based tests (Property 11)
- `src/store/CART_PBT_FINDINGS.md` - PBT findings and recommendations

## Usage

### Adding Items to Cart

```typescript
import { useCart } from '@/features/cart/hooks/useCart';

function DishCard({ dish, restaurantId }) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: 1,
      image: dish.image,
    }, restaurantId);
  };

  return (
    <button onClick={handleAddToCart}>Add to Cart</button>
  );
}
```

### Displaying Cart

```typescript
import { useCart } from '@/features/cart/hooks/useCart';

function CartDisplay() {
  const { cart, updateQuantity, removeItem } = useCart();

  return (
    <div>
      <h2>Cart ({cart.items.length} items)</h2>
      <p>Total: ${cart.total.toFixed(2)}</p>
      
      {cart.items.map(item => (
        <div key={item.dishId}>
          <span>{item.name}</span>
          <span>${item.price}</span>
          <input 
            type="number" 
            value={item.quantity}
            onChange={(e) => updateQuantity(item.dishId, parseInt(e.target.value))}
          />
          <button onClick={() => removeItem(item.dishId)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
```

## API

### Cart Store

#### State
```typescript
interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  tableNumber: string | null;
}

interface CartItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  notes?: string;
}
```

#### Actions
- `addItem(item: CartItem, restaurantId: string)` - Add item to cart
- `removeItem(dishId: string)` - Remove item from cart
- `updateQuantity(dishId: string, quantity: number)` - Update item quantity
- `updateNotes(dishId: string, notes: string)` - Update item notes
- `clearCart()` - Clear entire cart
- `setTableNumber(tableNumber: string)` - Set table number
- `getTotal()` - Calculate cart total
- `getItemCount()` - Get total item count

### useCart Hook

Returns:
```typescript
{
  cart: {
    items: CartItem[];
    total: number;
    restaurantId: string;
    tableNumber: string | null;
  };
  addItem: (item: CartItem, restaurantId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  updateNotes: (dishId: string, notes: string) => void;
  removeItem: (dishId: string) => void;
  clearCart: () => void;
  setTableNumber: (tableNumber: string) => void;
  itemCount: number;
}
```

## Features

### ✅ Implemented
- Add items to cart
- Update item quantities
- Remove items from cart
- Calculate cart total
- Count total items
- Persist cart to localStorage
- Restaurant isolation (cart clears when switching restaurants)
- Table number tracking
- Item notes support

### 🔄 Business Rules
1. **Restaurant Isolation**: When adding an item from a different restaurant, the cart is automatically cleared
2. **Quantity Merging**: Adding an existing item increases its quantity instead of creating a duplicate
3. **Persistence**: Cart state is automatically saved to localStorage and restored on page reload
4. **Total Calculation**: Cart total is calculated dynamically based on item prices and quantities

## Property 11: Cart State Consistency

**Validates: Requirements 3.5, 3.6, 3.7, 3.8**

> For any cart operation (add, update quantity, remove), the cart total should equal the sum of (item.price × item.quantity) for all items.

This property is validated through:
- 25 unit tests covering all cart operations
- 6 property-based tests with 100+ random test cases each
- Edge case testing for floating-point precision, duplicate IDs, and restaurant switching

See `CART_PBT_FINDINGS.md` for detailed test results and recommendations.

## Testing

### Run Unit Tests
```bash
npm test -- src/store/cartStore.test.ts --run
```

### Run Property-Based Tests
```bash
npm test -- src/store/cartStore.property.test.ts --run
```

### Test Coverage
- Unit Tests: 25 tests, 100% pass rate
- Property-Based Tests: 6 properties, 600+ generated test cases
- Code Coverage: Store actions, getters, and business logic

## Migration Notes

### Previous Implementation
The cart previously used a dual state management approach:
1. React state in `useCart` hook
2. Service layer in `src/features/cart/services/index.ts`

### Current Implementation
Now uses a single source of truth:
1. Zustand store in `src/store/cartStore.ts`
2. `useCart` hook is a thin wrapper around the store
3. Service layer deprecated (kept for backward compatibility)

### Breaking Changes
None - the `useCart` hook API remains the same.

## Future Enhancements

### Recommended Improvements
1. **Input Validation**: Add validation for prices, quantities, and IDs
2. **Decimal Precision**: Consider using decimal.js for monetary calculations
3. **Cart Limits**: Implement max items and max quantity per item
4. **Server Sync**: Sync cart with backend for logged-in users
5. **Cart Expiry**: Add expiration for abandoned carts

### Potential Features
- Save cart for later
- Cart sharing (for group orders)
- Promo code support
- Gift wrapping options
- Delivery instructions

## Related Documentation
- [Design Document](../../docs/design.md) - Property 11 specification
- [Requirements](../../docs/requirements.md) - Cart requirements (3.5-3.8)
- [PBT Findings](../../store/CART_PBT_FINDINGS.md) - Property test results
- [State Management Guide](../../docs/STATE_MANAGEMENT_GUIDE.md) - Zustand usage

## Support
For issues or questions about the cart feature, please refer to:
- Unit tests for usage examples
- PBT findings for edge cases
- Design document for requirements
