# WebSocket Integration for Kitchen Dashboard

## Overview

The Kitchen Dashboard now includes real-time WebSocket integration for instant order updates without manual page refreshes.

## Implementation

### Components Updated

1. **OrderQueue Component** (`src/features/kitchen/components/OrderQueue.tsx`)
   - Integrated `useKitchenWebSocket` hook for real-time updates
   - Added WebSocket connection status indicator
   - Automatic order list refresh on new orders
   - Real-time notifications for order status changes

### Features

#### 1. Real-Time Order Updates
- New orders appear instantly without page refresh
- Order status changes are reflected immediately
- Automatic query invalidation triggers data refetch

#### 2. Connection Status Indicator
- Visual badge showing connection status (Connected/Connecting/Disconnected)
- Color-coded status: Green (connected), Gray (disconnected)
- Animated spinner during connection attempts

#### 3. Notifications
- Toast notifications for new orders
- Sound and visual notifications via `useKitchenNotification` hook
- Status change notifications

#### 4. Error Handling
- Warning banner when WebSocket connection fails
- Graceful degradation to manual refresh
- User-friendly error messages

## WebSocket Events

The Kitchen Dashboard subscribes to the following events:

### `order.created`
Triggered when a new order is placed
```typescript
onOrderCreated: (order: Order) => {
  // Show notification
  notification.notifyNewOrder(order);
  // Refresh order list
  queryClient.invalidateQueries({ queryKey: ['orders'] });
  // Show toast
  toast.success('طلب جديد!');
}
```

### `order.updated`
Triggered when order details are modified
```typescript
onOrderUpdated: () => {
  // Refresh order list
  queryClient.invalidateQueries({ queryKey: ['orders'] });
}
```

### `order.status.changed`
Triggered when order status changes
```typescript
onOrderStatusChanged: ({ order, status }) => {
  // Show notification
  notification.notifyStatusUpdate(order, status);
  // Refresh order list
  queryClient.invalidateQueries({ queryKey: ['orders'] });
}
```

## Usage

The WebSocket integration is automatic when the OrderQueue component is rendered:

```tsx
<OrderQueue restaurantId={restaurantId} />
```

### Configuration

The WebSocket hook is configured with:
- `autoConnect: true` - Connects automatically on mount
- `debug: false` - Disables debug logging in production
- `callbacks` - Event handlers for order events

### Connection Management

- **Auto-connect**: Connects automatically when component mounts
- **Auto-reconnect**: Attempts to reconnect on connection loss
- **Cleanup**: Disconnects when component unmounts

## UI Components

### Connection Status Badge
```tsx
<Badge variant={isConnected ? 'default' : 'secondary'}>
  {isConnected ? (
    <>
      <Wifi className="w-3 h-3" />
      <span>متصل</span>
    </>
  ) : (
    <>
      <WifiOff className="w-3 h-3" />
      <span>غير متصل</span>
    </>
  )}
</Badge>
```

### Error Warning
Displayed when WebSocket connection fails:
```tsx
{wsError && (
  <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200">
    <AlertCircle className="w-4 h-4" />
    <span>تحذير: التحديثات الفورية غير متاحة</span>
  </div>
)}
```

## Testing

### Manual Testing
1. Open Kitchen Dashboard
2. Verify connection status shows "متصل" (Connected)
3. Create a new order from another device/tab
4. Verify order appears instantly in the kitchen dashboard
5. Update order status
6. Verify status change is reflected immediately

### Demo Component
Use `KitchenWebSocketDemo` component for testing:
```tsx
import { KitchenWebSocketDemo } from '@/features/kitchen/components';

<KitchenWebSocketDemo restaurantId="test-restaurant-id" />
```

## Dependencies

- `@/services/websocket` - WebSocket service and hooks
- `@/features/kitchen/components/RealTimeNotification` - Notification system
- `@tanstack/react-query` - Query invalidation
- `sonner` - Toast notifications

## Environment Variables

WebSocket configuration is managed in `src/utils/env.ts`:
- `WS_URL` - WebSocket server URL
- `WS_RECONNECT_ATTEMPTS` - Maximum reconnection attempts
- `WS_RECONNECT_DELAY` - Delay between reconnection attempts
- `DEBUG_MODE` - Enable debug logging

## Future Enhancements

1. **Offline Support**: Queue updates when offline and sync when reconnected
2. **Optimistic Updates**: Update UI immediately before server confirmation
3. **Presence Indicators**: Show which kitchen staff are online
4. **Order Assignment**: Real-time assignment of orders to specific staff
5. **Performance Metrics**: Track WebSocket latency and connection quality

## Troubleshooting

### Connection Issues
- Check WebSocket server URL in environment variables
- Verify network connectivity
- Check browser console for WebSocket errors
- Ensure WebSocket server is running

### Missing Updates
- Verify restaurant ID is correct
- Check WebSocket event subscriptions
- Ensure query keys match between components
- Check React Query cache configuration

### Performance Issues
- Monitor WebSocket message frequency
- Check for memory leaks in event handlers
- Verify cleanup on component unmount
- Consider throttling frequent updates
