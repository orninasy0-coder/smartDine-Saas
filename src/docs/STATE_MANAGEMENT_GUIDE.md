# State Management Guide

## Overview

SmartDine uses a **three-tier state management strategy**:

1. **Local State** (useState, useReducer) - Component-specific UI state
2. **Global State** (Zustand) - Cross-component application state
3. **Server State** (React Query) - Data from APIs

## Decision Tree: Which State Management to Use?

```
Is the data from a server/API?
├─ YES → Use React Query
└─ NO → Does the state need to be shared across multiple components?
    ├─ YES → Use Zustand (Global State)
    └─ NO → Use Local State (useState/useReducer)
```

---

## 1. Local State (useState, useReducer)

### When to Use

Use local state for:
- Form input values
- UI toggles (modals, dropdowns, tooltips)
- Component-specific visibility states
- Temporary data that doesn't need persistence
- Animation states
- Focus/hover states

### Examples

#### Simple Toggle State
```typescript
const [isOpen, setIsOpen] = useState(false);
```

#### Form State
```typescript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
});

const handleChange = (field: string, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};
```

#### Complex State with useReducer
```typescript
type State = {
  step: number;
  data: Record<string, unknown>;
  errors: Record<string, string>;
};

type Action =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_DATA'; payload: Record<string, unknown> }
  | { type: 'SET_ERROR'; payload: { field: string; error: string } };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, step: state.step + 1 };
    case 'PREV_STEP':
      return { ...state, step: state.step - 1 };
    case 'UPDATE_DATA':
      return { ...state, data: { ...state.data, ...action.payload } };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload.field]: action.payload.error },
      };
    default:
      return state;
  }
};

const [state, dispatch] = useReducer(reducer, {
  step: 1,
  data: {},
  errors: {},
});
```

### Best Practices

1. **Keep it simple** - Don't over-engineer local state
2. **Colocate state** - Keep state as close to where it's used as possible
3. **Use useReducer for complex state** - When state has multiple sub-values or complex update logic
4. **Avoid prop drilling** - If passing state through 3+ levels, consider global state
5. **Initialize properly** - Use lazy initialization for expensive computations

```typescript
// Lazy initialization
const [state, setState] = useState(() => {
  const initialState = expensiveComputation();
  return initialState;
});
```

---

## 2. Global State (Zustand)

### When to Use

Use Zustand for:
- Authentication state (user, token)
- UI preferences (theme, language)
- Shopping cart
- Sidebar/modal visibility across pages
- Notifications/toasts
- Any state shared across multiple unrelated components

### Available Stores

#### Auth Store (`useAuthStore`)
```typescript
import { useAuthStore } from '@/store';

// In component
const { user, isAuthenticated, login, logout } = useAuthStore();

// Login
login(userData, token);

// Logout
logout();

// Check auth status
if (isAuthenticated) {
  // User is logged in
}
```

#### UI Store (`useUIStore`)
```typescript
import { useUIStore } from '@/store';

// Theme management
const { theme, setTheme } = useUIStore();
setTheme('dark');

// Language
const { language, setLanguage } = useUIStore();
setLanguage('ar');

// Sidebar
const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();

// Cart sidebar
const { cartSidebarOpen, toggleCartSidebar } = useUIStore();

// Chat widget
const { chatWidgetOpen, toggleChatWidget } = useUIStore();

// Notifications
const { notifications, addNotification, removeNotification } = useUIStore();
addNotification({
  type: 'success',
  message: 'Order placed successfully!',
  duration: 3000,
});
```

#### Cart Store (`useCartStore`)
```typescript
import { useCartStore } from '@/store';

// Add item
const { addItem } = useCartStore();
addItem({
  dishId: '123',
  name: 'Pizza',
  price: 15.99,
  quantity: 1,
}, restaurantId);

// Get cart info
const { items, getTotal, getItemCount } = useCartStore();
const total = getTotal();
const itemCount = getItemCount();

// Update quantity
const { updateQuantity } = useCartStore();
updateQuantity('123', 2);

// Remove item
const { removeItem } = useCartStore();
removeItem('123');

// Clear cart
const { clearCart } = useCartStore();
clearCart();
```

### Best Practices

1. **Use selectors** - Only subscribe to what you need
```typescript
// Bad - re-renders on any auth state change
const authStore = useAuthStore();

// Good - only re-renders when user changes
const user = useAuthStore(state => state.user);
```

2. **Don't store derived state** - Use getters instead
```typescript
// Good - computed on demand
const total = useCartStore(state => state.getTotal());
```

3. **Keep actions simple** - Complex logic should be in services
4. **Use middleware wisely** - Persist only what's necessary

---

## 3. Server State (React Query)

### When to Use

Use React Query for:
- All API data fetching
- Caching server responses
- Background synchronization
- Optimistic updates
- Pagination
- Real-time data

### Examples

See `src/lib/REACT_QUERY_GUIDELINES.md` for detailed documentation.

```typescript
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';

// Fetch menu
const { data, isLoading, error } = useQuery({
  queryKey: queryKeys.menu.restaurant(restaurantId),
  queryFn: () => menuService.getMenu(restaurantId),
});
```

---

## State Management Patterns

### Pattern 1: Form with Local State + Server Mutation

```typescript
const CreateDishForm = () => {
  // Local state for form
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
  });

  // Server mutation
  const createDish = useCreateDish(restaurantId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createDish.mutateAsync(formData);
    setFormData({ name: '', price: 0, description: '' }); // Reset
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

### Pattern 2: Global UI State + Local Component State

```typescript
const CartSidebar = () => {
  // Global state for visibility
  const { cartSidebarOpen, setCartSidebarOpen } = useUIStore();
  
  // Global state for cart data
  const { items, removeItem } = useCartStore();
  
  // Local state for confirmation dialog
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  return (
    <Sidebar open={cartSidebarOpen} onClose={() => setCartSidebarOpen(false)}>
      {/* Cart content */}
    </Sidebar>
  );
};
```

### Pattern 3: Server State + Optimistic Updates

```typescript
const DishCard = ({ dish }: { dish: Dish }) => {
  const updateDish = useUpdateDish(restaurantId);
  
  const handleToggleAvailability = () => {
    updateDish.mutate({
      dishId: dish.id,
      data: { available: !dish.available },
    });
  };

  return (
    <Card>
      <Switch 
        checked={dish.available} 
        onCheckedChange={handleToggleAvailability}
      />
    </Card>
  );
};
```

---

## Common Mistakes to Avoid

### ❌ Don't: Store server data in Zustand
```typescript
// Bad
const useMenuStore = create((set) => ({
  menu: null,
  fetchMenu: async () => {
    const data = await api.getMenu();
    set({ menu: data });
  },
}));
```

### ✅ Do: Use React Query for server data
```typescript
// Good
const { data: menu } = useQuery({
  queryKey: queryKeys.menu.restaurant(restaurantId),
  queryFn: () => menuService.getMenu(restaurantId),
});
```

### ❌ Don't: Lift state unnecessarily
```typescript
// Bad - lifting state to parent when not needed
const Parent = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return <Child modalOpen={modalOpen} setModalOpen={setModalOpen} />;
};
```

### ✅ Do: Keep state local when possible
```typescript
// Good - state stays in component that uses it
const Child = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return <Modal open={modalOpen} />;
};
```

### ❌ Don't: Duplicate state
```typescript
// Bad - duplicating server state
const [user, setUser] = useState(null);
const { data: userData } = useQuery(/* ... */);

useEffect(() => {
  setUser(userData);
}, [userData]);
```

### ✅ Do: Use single source of truth
```typescript
// Good - use server state directly
const { data: user } = useQuery(/* ... */);
```

---

## Testing State

### Local State
```typescript
import { render, screen, fireEvent } from '@testing-library/react';

test('toggles modal', () => {
  render(<Component />);
  const button = screen.getByRole('button');
  fireEvent.click(button);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
```

### Zustand Store
```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/store';

test('logs in user', () => {
  const { result } = renderHook(() => useAuthStore());
  
  act(() => {
    result.current.login(mockUser, mockToken);
  });
  
  expect(result.current.isAuthenticated).toBe(true);
  expect(result.current.user).toEqual(mockUser);
});
```

### React Query
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

test('fetches menu', async () => {
  const queryClient = createTestQueryClient();
  
  render(
    <QueryClientProvider client={queryClient}>
      <MenuComponent />
    </QueryClientProvider>
  );
  
  await waitFor(() => {
    expect(screen.getByText('Pizza')).toBeInTheDocument();
  });
});
```

---

## Summary

| State Type | Tool | Use Case | Persistence |
|------------|------|----------|-------------|
| Local | useState/useReducer | Component UI state | No |
| Global | Zustand | Shared app state | Optional (localStorage) |
| Server | React Query | API data | Cache (memory) |

**Remember**: Choose the simplest solution that works. Start with local state, move to global only when needed, and always use React Query for server data.
