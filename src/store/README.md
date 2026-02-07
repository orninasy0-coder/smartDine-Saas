# Global State Management (Zustand)

This directory contains all Zustand stores for global state management in SmartDine.

## Available Stores

### 1. Auth Store (`authStore.ts`)
Manages user authentication state.

**State:**
- `user`: Current user object
- `token`: JWT authentication token
- `isAuthenticated`: Boolean authentication status
- `isLoading`: Loading state for auth operations

**Actions:**
- `login(user, token)`: Log in user
- `logout()`: Log out user
- `setUser(user)`: Update user data
- `setToken(token)`: Update token
- `setLoading(isLoading)`: Set loading state

**Persistence:** Yes (localStorage via `auth-storage`)

### 2. UI Store (`uiStore.ts`)
Manages global UI state and preferences.

**State:**
- `theme`: Current theme ('light' | 'dark' | 'system')
- `language`: Current language ('en' | 'ar')
- `sidebarOpen`: Main sidebar visibility
- `cartSidebarOpen`: Cart sidebar visibility
- `chatWidgetOpen`: AI chat widget visibility
- `notifications`: Array of notification objects

**Actions:**
- `setTheme(theme)`: Change theme
- `setLanguage(language)`: Change language
- `toggleSidebar()`: Toggle main sidebar
- `setSidebarOpen(open)`: Set sidebar state
- `toggleCartSidebar()`: Toggle cart sidebar
- `setCartSidebarOpen(open)`: Set cart sidebar state
- `toggleChatWidget()`: Toggle chat widget
- `setChatWidgetOpen(open)`: Set chat widget state
- `addNotification(notification)`: Add notification
- `removeNotification(id)`: Remove notification
- `clearNotifications()`: Clear all notifications

**Persistence:** No (session-only)

### 3. Cart Store (`cartStore.ts`)
Manages shopping cart state.

**State:**
- `items`: Array of cart items
- `restaurantId`: Current restaurant ID
- `tableNumber`: Table number for dine-in

**Actions:**
- `addItem(item, restaurantId)`: Add item to cart
- `removeItem(dishId)`: Remove item from cart
- `updateQuantity(dishId, quantity)`: Update item quantity
- `updateNotes(dishId, notes)`: Update item notes
- `clearCart()`: Clear entire cart
- `setTableNumber(tableNumber)`: Set table number
- `getTotal()`: Calculate cart total
- `getItemCount()`: Get total item count

**Persistence:** Yes (localStorage via `cart-storage`)

## Usage

### Basic Usage
```typescript
import { useAuthStore, useUIStore, useCartStore } from '@/store';

function MyComponent() {
  const { user, login, logout } = useAuthStore();
  const { theme, setTheme } = useUIStore();
  const { items, addItem } = useCartStore();
  
  // Use state and actions...
}
```

### Selector Pattern (Recommended for Performance)
```typescript
// Only re-renders when user changes
const user = useAuthStore(state => state.user);

// Only re-renders when theme changes
const theme = useUIStore(state => state.theme);

// Only re-renders when cart items change
const items = useCartStore(state => state.items);
```

### Multiple Selectors
```typescript
const { user, isAuthenticated } = useAuthStore(state => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
}));
```

## Best Practices

1. **Use selectors** - Only subscribe to the state you need
2. **Don't store server data** - Use React Query for API data
3. **Keep actions simple** - Complex logic belongs in services
4. **Persist wisely** - Only persist what's necessary
5. **Type everything** - Use TypeScript for type safety

## Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/store';

test('logs in user', () => {
  const { result } = renderHook(() => useAuthStore());
  
  act(() => {
    result.current.login(mockUser, mockToken);
  });
  
  expect(result.current.isAuthenticated).toBe(true);
});
```

## Related Documentation

- [State Management Guide](../docs/STATE_MANAGEMENT_GUIDE.md) - Complete guide
- [State Management Cheat Sheet](../docs/STATE_MANAGEMENT_CHEATSHEET.md) - Quick reference
- [React Query Guidelines](../lib/REACT_QUERY_GUIDELINES.md) - Server state management
