# Delivery Dashboard Feature

This feature provides the delivery personnel interface for managing order deliveries in real-time.

## Components

### DeliveryQueue
Main component that displays the list of orders ready for delivery (READY and DELIVERING status).

**Features:**
- Real-time updates via WebSocket
- Sorted by ready time (oldest first)
- Status summary cards (Ready, Delivering)
- Status filter tabs
- Manual refresh button
- Empty state when no orders
- WebSocket connection status indicator

**Usage:**
```tsx
import { DeliveryQueue } from '@/features/delivery';

<DeliveryQueue restaurantId={restaurantId} />
```

### DeliveryCard
Displays individual delivery order details with action buttons.

**Features:**
- Order number and table number
- Time since order was ready
- List of order items with quantities
- Delivery address (placeholder for future enhancement)
- Total price
- Special instructions/notes
- Status-specific action buttons (Start Delivery / Mark Delivered)
- Loading state during status updates

**Usage:**
```tsx
import { DeliveryCard } from '@/features/delivery';

<DeliveryCard
  order={order}
  onStatusChange={handleStatusChange}
  isUpdating={isUpdating}
/>
```

## Data Flow

1. **Fetching Orders:**
   - Uses `useOrders` hook with restaurant filter
   - Filters to show only READY and DELIVERING orders
   - Real-time updates via WebSocket

2. **Updating Status:**
   - Uses mutation to update order status
   - Toast notifications for success/error
   - Invalidates query cache on success

3. **Real-time Updates:**
   - WebSocket integration for instant updates
   - Automatic notification when orders become ready

## Status Flow

```
READY → DELIVERING → DELIVERED
```

Delivery personnel can:
- Mark READY orders as DELIVERING (start delivery)
- Mark DELIVERING orders as DELIVERED (complete delivery)

## Styling

- Uses Tailwind CSS for styling
- Framer Motion for animations
- shadcn/ui components (Card, Button, Badge, Tabs)
- Responsive design
- Dark mode support
- Arabic RTL support

## Future Enhancements

1. **Map Integration:**
   - Display delivery location on map
   - Route optimization
   - Real-time location tracking

2. **Delivery Timer:**
   - Estimated delivery time
   - Countdown timer
   - Time tracking per delivery

3. **Customer Contact:**
   - Customer phone number
   - Call customer button
   - SMS notifications

4. **Delivery History:**
   - Completed deliveries list
   - Delivery statistics
   - Performance metrics

5. **Multi-Order Delivery:**
   - Batch multiple orders
   - Optimize delivery route
   - Delivery sequence planning

6. **Photo Proof:**
   - Take photo on delivery
   - Signature capture
   - Delivery confirmation

## Testing

To test the delivery dashboard:

1. Login as a user with DELIVERY_PERSONNEL role
2. Navigate to `/delivery/orders`
3. Create test orders and mark them as READY from kitchen
4. Verify orders appear in the delivery queue
5. Test status transitions (Ready → Delivering → Delivered)
6. Verify real-time updates work
7. Test refresh functionality
8. Test error handling

## Dependencies

- React Query for data fetching
- Framer Motion for animations
- Lucide React for icons
- Sonner for toast notifications
- shadcn/ui components
- WebSocket service for real-time updates

## Notes

- Delivery address is currently a placeholder and will be enhanced in future tasks (Task 9.2)
- Map integration will be added in Task 9.2
- Route optimization will be added in Task 9.2.2
- Delivery timer will be added in Task 9.3
