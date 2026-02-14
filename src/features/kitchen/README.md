# Kitchen Dashboard Feature

This feature provides the kitchen staff interface for managing orders in real-time.

## Components

### OrderQueue
Main component that displays the list of active orders (PENDING and PREPARING status).

**Features:**
- Real-time updates every 5 seconds
- Sorted by creation time (oldest first)
- Status summary cards
- Manual refresh button
- Empty state when no orders

**Usage:**
```tsx
import { OrderQueue } from '@/features/kitchen';

<OrderQueue restaurantId={restaurantId} />
```

### OrderCard
Displays individual order details with action buttons.

**Features:**
- Order number and table number
- Elapsed time timer
- List of order items with quantities
- Special instructions highlight
- Total price
- Status-specific action buttons (Start Preparing / Mark Ready)
- Loading state during status updates

**Usage:**
```tsx
import { OrderCard } from '@/features/kitchen';

<OrderCard
  order={order}
  onStatusChange={handleStatusChange}
  isUpdating={isUpdating}
/>
```

**Navigation:**
- Clicking "التفاصيل" (Details) button navigates to `/kitchen/orders/:orderId`

### OrderTimer
Real-time timer showing elapsed time since order creation.

**Features:**
- Updates every second
- Color-coded based on duration:
  - Green: < 10 minutes
  - Yellow: 10-20 minutes
  - Red: >= 20 minutes
- Formatted as MM:SS or HH:MM:SS

**Usage:**
```tsx
import { OrderTimer } from '@/features/kitchen';

<OrderTimer createdAt={order.createdAt} />
```

### StatusButtons
Reusable status action buttons for order status transitions.

**Features:**
- Status-aware rendering (shows appropriate button based on order status)
- Handles PENDING → PREPARING → READY transitions
- Loading state support (disables during updates)
- Flexible sizing (sm, default, lg, icon)
- Customizable layout (full-width or auto-width)
- Type-safe with TypeScript
- Accessible with ARIA support
- Arabic language support (RTL)

**Usage:**
```tsx
import { StatusButtons } from '@/features/kitchen';

<StatusButtons
  status={order.status}
  onStatusChange={handleStatusChange}
  isUpdating={isUpdating}
  size="lg"
  fullWidth={true}
/>
```

**Props:**
- `status`: Current order status (PENDING, PREPARING, READY, etc.)
- `onStatusChange`: Callback function `(newStatus: 'PREPARING' | 'READY') => void`
- `isUpdating`: Boolean to disable buttons during updates
- `size`: Button size variant ('sm', 'default', 'lg', 'icon')
- `className`: Additional CSS classes
- `fullWidth`: Whether buttons should take full width

**Status Transitions:**
- PENDING: Shows "بدء التحضير" (Start Preparing) button
- PREPARING: Shows "جاهز للتقديم" (Mark Ready) button
- READY/DELIVERED/CANCELLED: No buttons shown (terminal states)

## Page

### KitchenOrders
Main page for kitchen staff accessible at `/kitchen/orders`.

**Features:**
- Protected route (KITCHEN_STAFF role only)
- Automatic restaurant ID detection from user
- Full-screen order queue display

### KitchenOrderDetail
Detailed view page for individual orders accessible at `/kitchen/orders/:orderId`.

**Features:**
- Protected route (KITCHEN_STAFF role only)
- Complete order information display
- Order items with ingredients and quantities
- Special instructions highlighting
- Order status timeline
- Status management buttons
- Back navigation to order queue
- Real-time timer display
- Order metadata (order number, table number, timestamps)

## Data Flow

1. **Fetching Orders:**
   - Uses `useOrders` hook with restaurant filter
   - Automatically refetches every 5 seconds
   - Filters to show only PENDING and PREPARING orders

2. **Updating Status:**
   - Uses mutation to update order status
   - Optimistic UI updates
   - Toast notifications for success/error
   - Invalidates query cache on success

3. **Real-time Updates:**
   - Polling-based (5-second interval)
   - Can be enhanced with WebSocket for instant updates

## Status Flow

```
PENDING → PREPARING → READY
```

Kitchen staff can:
- Mark PENDING orders as PREPARING
- Mark PREPARING orders as READY

## Styling

- Uses Tailwind CSS for styling
- Framer Motion for animations
- shadcn/ui components (Card, Button)
- Responsive design
- Dark mode support
- Arabic RTL support

## Future Enhancements

1. **WebSocket Integration:**
   - Replace polling with real-time WebSocket updates
   - Instant notification when new orders arrive

2. **Sound Notifications:**
   - Audio alert for new orders
   - Different sounds for different priorities

3. **Order Filtering:**
   - Filter by table number
   - Filter by order time range
   - Search by order number

4. **Batch Operations:**
   - Mark multiple orders as preparing
   - Bulk status updates

5. **Order Details Modal:**
   - Detailed view with customer info
   - Order history
   - Modification requests

6. **Performance Metrics:**
   - Average preparation time
   - Orders completed per hour
   - Staff performance tracking

## Testing

To test the kitchen dashboard:

1. Login as a user with KITCHEN_STAFF role
2. Navigate to `/kitchen/orders`
3. Create test orders from the customer menu
4. Verify orders appear in the queue
5. Test status transitions (Pending → Preparing → Ready)
6. Verify timer updates in real-time
7. Test refresh functionality
8. Test error handling (network errors, etc.)

## Dependencies

- React Query for data fetching
- Framer Motion for animations
- Lucide React for icons
- Sonner for toast notifications
- shadcn/ui components
