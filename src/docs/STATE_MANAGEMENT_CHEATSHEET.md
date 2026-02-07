# State Management Cheat Sheet

## Quick Decision Guide

```
┌─────────────────────────────────────────────────────────────┐
│ Is this data from an API/server?                           │
├─────────────────────────────────────────────────────────────┤
│ YES → Use React Query                                       │
│ NO  → Continue below ↓                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Does this state need to be shared across multiple          │
│ unrelated components or pages?                             │
├─────────────────────────────────────────────────────────────┤
│ YES → Use Zustand (Global State)                           │
│ NO  → Use useState/useReducer (Local State)                │
└─────────────────────────────────────────────────────────────┘
```

---

## Local State (useState/useReducer)

### When to Use
- ✅ Form inputs
- ✅ Modal/dropdown visibility
- ✅ Temporary UI state
- ✅ Component-specific toggles

### Quick Examples

```typescript
// Simple state
const [isOpen, setIsOpen] = useState(false);

// Object state
const [form, setForm] = useState({ name: '', email: '' });

// Complex state
const [state, dispatch] = useReducer(reducer, initialState);
```

---

## Global State (Zustand)

### Available Stores

#### 🔐 Auth Store
```typescript
import { useAuthStore } from '@/store';

const { user, isAuthenticated, login, logout } = useAuthStore();
```

#### 🎨 UI Store
```typescript
import { useUIStore } from '@/store';

const { theme, setTheme } = useUIStore();
const { language, setLanguage } = useUIStore();
const { sidebarOpen, toggleSidebar } = useUIStore();
const { addNotification } = useUIStore();
```

#### 🛒 Cart Store
```typescript
import { useCartStore } from '@/store';

const { items, addItem, removeItem, getTotal } = useCartStore();
```

### Selector Pattern (Performance)
```typescript
// ❌ Bad - re-renders on any change
const store = useAuthStore();

// ✅ Good - only re-renders when user changes
const user = useAuthStore(state => state.user);
```

---

## Server State (React Query)

### Query Keys
```typescript
import { queryKeys } from '@/lib/queryKeys';

// Menu
queryKeys.menu.restaurant(restaurantId)
queryKeys.menu.dish(restaurantId, dishId)

// Orders
queryKeys.orders.detail(orderId)
queryKeys.orders.byStatus('pending')

// Analytics
queryKeys.analytics.revenue(restaurantId, 'week')
```

### Basic Query
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: queryKeys.menu.restaurant(restaurantId),
  queryFn: () => menuService.getMenu(restaurantId),
  enabled: !!restaurantId,
});
```

### Mutation
```typescript
const mutation = useMutation({
  mutationFn: menuService.createDish,
  onSuccess: () => {
    queryClient.invalidateQueries({ 
      queryKey: queryKeys.menu.restaurant(restaurantId) 
    });
  },
});

mutation.mutate(dishData);
```

### Optimistic Update
```typescript
const mutation = useMutation({
  mutationFn: updateDish,
  onMutate: async (newData) => {
    await queryClient.cancelQueries({ queryKey });
    const previous = queryClient.getQueryData(queryKey);
    queryClient.setQueryData(queryKey, newData);
    return { previous };
  },
  onError: (err, newData, context) => {
    queryClient.setQueryData(queryKey, context?.previous);
  },
});
```

---

## Common Patterns

### Pattern 1: Form with Server Mutation
```typescript
const [formData, setFormData] = useState(initialData); // Local
const mutation = useMutation({ /* ... */ }); // Server

const handleSubmit = () => {
  mutation.mutate(formData);
};
```

### Pattern 2: Global UI + Local Component State
```typescript
const { cartOpen, setCartOpen } = useUIStore(); // Global
const [selectedItem, setSelectedItem] = useState(null); // Local
```

### Pattern 3: Server Data + Global Cart
```typescript
const { data: dish } = useQuery({ /* ... */ }); // Server
const { addItem } = useCartStore(); // Global

const handleAddToCart = () => {
  addItem(dish, restaurantId);
};
```

---

## Common Mistakes

### ❌ Don't Store Server Data in Zustand
```typescript
// Bad
const useMenuStore = create((set) => ({
  menu: null,
  fetchMenu: async () => { /* ... */ },
}));
```

### ✅ Use React Query Instead
```typescript
// Good
const { data: menu } = useQuery({
  queryKey: queryKeys.menu.restaurant(restaurantId),
  queryFn: () => menuService.getMenu(restaurantId),
});
```

### ❌ Don't Duplicate State
```typescript
// Bad
const [user, setUser] = useState(null);
const { data } = useQuery(/* ... */);
useEffect(() => setUser(data), [data]);
```

### ✅ Use Single Source
```typescript
// Good
const { data: user } = useQuery(/* ... */);
```

---

## Import Paths

```typescript
// Stores
import { useAuthStore, useUIStore, useCartStore } from '@/store';

// Query Keys
import { queryKeys } from '@/lib/queryKeys';

// React Query
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
```

---

## File Locations

```
src/
├── store/
│   ├── index.ts              # Store exports
│   ├── authStore.ts          # Auth state
│   ├── uiStore.ts            # UI state
│   └── cartStore.ts          # Cart state
├── lib/
│   ├── queryClient.ts        # React Query config
│   ├── queryKeys.ts          # Query key factories
│   └── REACT_QUERY_GUIDELINES.md
├── docs/
│   ├── STATE_MANAGEMENT_GUIDE.md
│   └── STATE_MANAGEMENT_CHEATSHEET.md
└── examples/
    └── StateManagementExample.tsx
```

---

## Testing

### Local State
```typescript
import { render, fireEvent } from '@testing-library/react';
```

### Zustand
```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/store';
```

### React Query
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const testClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});
```

---

## Summary Table

| Type | Tool | Persistence | Use Case |
|------|------|-------------|----------|
| Local | useState | No | Component UI |
| Global | Zustand | Optional | Shared state |
| Server | React Query | Cache | API data |

**Rule of Thumb**: Start simple (local state), escalate only when needed.
