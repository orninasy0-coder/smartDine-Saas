# Cart Components

## CartSidebar

A fully-featured cart sidebar component that displays cart items with quantity controls, item removal, and total calculation.

### Features

- ✅ **Display Cart Items** - Shows all items in the cart with images, names, and prices
- ✅ **Quantity Controls** - Increment/decrement quantity with + and - buttons
- ✅ **Remove Items** - Delete items from cart with trash icon
- ✅ **Total Calculation** - Automatically calculates and displays cart total
- ✅ **Empty State** - Shows friendly message when cart is empty
- ✅ **Smooth Animations** - Uses Framer Motion for smooth transitions
- ✅ **Responsive Design** - Works on mobile and desktop
- ✅ **RTL Support** - Supports Arabic text direction

### Usage

```tsx
import { useState } from 'react';
import { CartSidebar } from '@/features/cart';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

function MyComponent() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsCartOpen(true)}>
        <ShoppingCart />
        Open Cart
      </Button>

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | Yes | Controls sidebar visibility |
| `onClose` | `() => void` | Yes | Callback when sidebar should close |

### Integration with useCart Hook

The CartSidebar component automatically integrates with the `useCart` hook to:
- Display current cart items
- Update item quantities
- Remove items from cart
- Calculate totals

```tsx
// The hook is used internally by CartSidebar
const { cart, updateQuantity, removeItem } = useCart();
```

### Styling

The component uses:
- Tailwind CSS for styling
- shadcn/ui components (Button, Card)
- Lucide React icons
- Framer Motion for animations

### Accessibility

- Keyboard navigation support
- ARIA labels for screen readers
- Focus management
- Semantic HTML structure

### Testing

The component includes comprehensive tests covering:
- Empty cart state
- Displaying cart items
- Quantity updates
- Item removal
- Total calculation
- Open/close functionality

Run tests:
```bash
npm test -- CartSidebar.test.tsx --run
```

### Example Implementation

See `CartSidebar.example.tsx` for a complete implementation example with a cart button in the header.
