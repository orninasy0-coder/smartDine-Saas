# Delivery Feature Integration Guide

## Quick Start

### 1. Import the Component

```typescript
import { DeliveryQueue } from '@/features/delivery';
```

### 2. Use in Your Page

```typescript
import React from 'react';
import { DeliveryQueue } from '@/features/delivery';
import { useAuth } from '@/features/auth';

const DeliveryPage: React.FC = () => {
  const { user } = useAuth();

  if (!user?.restaurantId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <DeliveryQueue restaurantId={user.restaurantId} />
    </div>
  );
};

export default DeliveryPage;
```

### 3. Add Route

```typescript
// In your router configuration
import { DeliveryPage } from '@/pages/delivery';
import { ProtectedRoute } from '@/components/auth';
import { USER_ROLES } from '@/utils/constants';

<Route
  path="/delivery/orders"
  element={
    <ProtectedRoute allowedRoles={[USER_ROLES.DELIVERY_PERSONNEL]}>
      <DeliveryPage />
    </ProtectedRoute>
  }
/>
```

## Component API

### DeliveryQueue

Main component for displaying delivery orders.

**Props:**
```typescript
interface DeliveryQueueProps {
  restaurantId: string;  // Required: Restaurant ID to fetch orders for
  className?: string;    // Optional: Additional CSS classes
}
```

**Example:**
```typescript
<DeliveryQueue 
  restaurantId="restaurant-123"
  className="max-w-6xl mx-auto"
/>
```

### DeliveryCard

Individual order card component (used internally by DeliveryQueue).

**Props:**
```typescript
interface DeliveryCardProps {
  order: Order;                                                    // Required: Order object
  onStatusChange: (orderId: string, status: 'DELIVERING' | 'DELIVERED') => void;  // Required: Status change handler
  isUpdating?: boolean;                                           // Optional: Loading state
  className?: string;                                             // Optional: Additional CSS classes
}
```

**Example:**
```typescript
<DeliveryCard
  order={order}
  onStatusChange={handleStatusChange}
  isUpdating={isUpdating}
/>
```

## Features

### Real-time Updates

The component automatically connects to WebSocket for real-time order updates:

```typescript
// Automatic WebSocket connection
// No additional setup required
// Updates happen automatically when orders become READY
```

### Status Management

Orders flow through these statuses:
```
READY → DELIVERING → DELIVERED
```

The component handles status transitions automatically:
- READY orders show "بدء التوصيل" (Start Delivery) button
- DELIVERING orders show "تم التسليم" (Mark Delivered) button

### Filtering

Built-in status filters:
- All orders (READY + DELIVERING)
- Ready orders only
- Delivering orders only

### Error Handling

Automatic error handling with retry functionality:
- Network errors
- WebSocket disconnections
- API failures

## Styling

### Theme Support

The component supports both light and dark modes automatically:

```typescript
// No additional configuration needed
// Uses Tailwind CSS dark: variants
```

### RTL Support

Full Arabic RTL support:

```typescript
// Automatic RTL layout
// Arabic text rendering
// Right-to-left animations
```

### Customization

You can customize the appearance using the `className` prop:

```typescript
<DeliveryQueue 
  restaurantId={restaurantId}
  className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-xl"
/>
```

## Data Requirements

### Order Object Structure

```typescript
interface Order {
  id: string;
  orderNumber: string;
  restaurantId: string;
  status: OrderStatus;
  totalPrice: number;
  tableNumber?: string;
  specialInstructions?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  id: string;
  orderId: string;
  dishId: string;
  quantity: number;
  price: number;
  dish?: Dish;
}
```

### Required Backend Endpoints

The component expects these endpoints to be available:

1. **GET /api/orders**
   - Query params: `restaurantId`, `status`
   - Returns: Array of orders

2. **PATCH /api/orders/:orderId/status**
   - Body: `{ status: 'DELIVERING' | 'DELIVERED' }`
   - Returns: Updated order

3. **WebSocket Events**
   - `order.status.changed` - When order status changes
   - `order.updated` - When order is updated

## WebSocket Integration

### Automatic Connection

The component automatically connects to WebSocket:

```typescript
// Uses existing useKitchenWebSocket hook
// Connects on mount
// Disconnects on unmount
```

### Event Handling

Listens for these events:
- `onOrderStatusChanged` - Order status changes
- `onOrderUpdated` - Order updates

### Connection Status

Shows connection status indicator:
- Green badge: Connected
- Gray badge: Disconnected
- Spinning icon: Connecting

## Performance

### Optimizations

- Automatic query caching with React Query
- Optimistic UI updates
- Efficient filtering and sorting
- Lazy loading support (can be added)

### Best Practices

1. **Use with React Query DevTools** for debugging:
```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<ReactQueryDevtools initialIsOpen={false} />
```

2. **Monitor WebSocket connection**:
```typescript
// Connection status is shown in the UI
// Check the badge in the header
```

3. **Handle errors gracefully**:
```typescript
// Component shows error messages with retry button
// No additional error handling needed
```

## Testing

### Unit Tests

```typescript
import { render, screen } from '@testing-library/react';
import { DeliveryQueue } from '@/features/delivery';

test('renders delivery queue', () => {
  render(<DeliveryQueue restaurantId="test-123" />);
  expect(screen.getByText('طلبات التوصيل')).toBeInTheDocument();
});
```

### Integration Tests

```typescript
import { renderWithProviders } from '@/test-utils';
import { DeliveryQueue } from '@/features/delivery';

test('updates order status', async () => {
  const { user } = renderWithProviders(
    <DeliveryQueue restaurantId="test-123" />
  );
  
  const startButton = screen.getByText('بدء التوصيل');
  await user.click(startButton);
  
  expect(screen.getByText('قيد التوصيل')).toBeInTheDocument();
});
```

## Troubleshooting

### Orders Not Showing

1. Check restaurant ID is correct
2. Verify orders exist with READY or DELIVERING status
3. Check network tab for API errors
4. Verify user has DELIVERY_PERSONNEL role

### WebSocket Not Connecting

1. Check WebSocket URL in environment variables
2. Verify WebSocket service is running
3. Check browser console for connection errors
4. Try manual refresh

### Status Updates Failing

1. Check API endpoint is accessible
2. Verify user has permission to update orders
3. Check network tab for error responses
4. Verify order ID is correct

## Migration from Kitchen Dashboard

If you're familiar with the kitchen dashboard, the delivery dashboard follows the same patterns:

```typescript
// Kitchen Dashboard
<OrderQueue restaurantId={restaurantId} />

// Delivery Dashboard
<DeliveryQueue restaurantId={restaurantId} />
```

Key differences:
- Shows READY and DELIVERING orders (vs PENDING and PREPARING)
- Different action buttons (Start Delivery vs Start Preparing)
- Delivery-specific information (address, ETA)

## Future Enhancements

### Coming Soon

1. **Map Integration** (Task 9.2)
   - Display delivery location
   - Route optimization
   - Real-time tracking

2. **Delivery Timer** (Task 9.3)
   - Estimated delivery time
   - Countdown timer
   - Time tracking

3. **Customer Contact** (Future)
   - Phone number display
   - Call customer button
   - SMS notifications

4. **Delivery Proof** (Future)
   - Photo capture
   - Signature capture
   - Delivery confirmation

## Support

For issues or questions:
1. Check the README.md in the delivery feature folder
2. Review the implementation summary
3. Check the example components
4. Consult the main documentation

## Related Documentation

- [Kitchen Dashboard](../kitchen/README.md) - Similar patterns
- [Orders Feature](../orders/README.md) - Order data structure
- [WebSocket Service](../../services/websocket/README.md) - Real-time updates
- [Authentication](../auth/README.md) - User roles and permissions

---

**Last Updated:** 2026-02-08
**Version:** 1.0.0
