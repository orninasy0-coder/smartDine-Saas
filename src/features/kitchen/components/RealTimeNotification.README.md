# RealTimeNotification Component

A comprehensive real-time notification system for kitchen staff with toast notifications and sound alerts.

## Features

- ✅ **Toast Notifications**: Non-intrusive notifications using Sonner
- ✅ **Sound Alerts**: Customizable audio alerts with different tones for different notification types
- ✅ **Multiple Notification Types**: New order, status update, urgent, success, error
- ✅ **Order Details**: Display order number, table number, and quick actions
- ✅ **Volume Control**: Adjustable sound volume (0-100%)
- ✅ **Click Actions**: Optional callback when notification is clicked
- ✅ **Auto-dismiss**: Notifications auto-dismiss after a set duration
- ✅ **Urgent Priority**: Urgent notifications stay longer and have distinct styling

## Installation

The component uses the following dependencies (already installed):
- `sonner` - Toast notification library
- `lucide-react` - Icons
- `framer-motion` - Animations (optional)

## Usage

### Basic Usage

```tsx
import { RealTimeNotification, useKitchenNotification } from '@/features/kitchen/components/RealTimeNotification';

function KitchenDashboard() {
  const notification = useKitchenNotification();

  return (
    <div>
      <RealTimeNotification
        soundEnabled={true}
        volume={0.5}
      />
      
      <button onClick={() => notification.notifyNewOrder(order)}>
        Test Notification
      </button>
    </div>
  );
}
```

### With Click Handler

```tsx
<RealTimeNotification
  soundEnabled={true}
  volume={0.7}
  onNotificationClick={(notification) => {
    console.log('Notification clicked:', notification);
    // Navigate to order details, etc.
  }}
/>
```

### Using the Hook

```tsx
const notification = useKitchenNotification();

// New order notification
notification.notifyNewOrder(order);

// Status update notification
notification.notifyStatusUpdate(order, 'PREPARING');

// Urgent notification
notification.notifyUrgent('طلب عاجل! العميل ينتظر', order);

// Success notification
notification.notifySuccess('تم تحضير الطلب بنجاح');

// Error notification
notification.notifyError('فشل تحديث حالة الطلب');

// Custom notification
notification.showNotification({
  type: 'new_order',
  title: 'Custom Title',
  message: 'Custom message',
  order: order,
  sound: true,
});
```

## Props

### RealTimeNotification

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `soundEnabled` | `boolean` | `true` | Enable or disable sound alerts |
| `volume` | `number` | `0.5` | Volume level (0-1) |
| `onNotificationClick` | `(notification: KitchenNotification) => void` | - | Callback when notification is clicked |
| `className` | `string` | `''` | Additional CSS classes |

## Notification Types

### NotificationType

- `new_order` - New order received (blue, high pitch sound)
- `status_update` - Order status changed (default, no sound)
- `urgent` - Urgent alert (orange, highest pitch sound)
- `success` - Success message (green, medium pitch sound)
- `error` - Error message (red, low pitch sound)

### KitchenNotification Interface

```typescript
interface KitchenNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  order?: Order;
  timestamp: Date;
  sound?: boolean;
}
```

## Sound System

The component uses the Web Audio API to generate notification sounds:

- **New Order**: 800 Hz (high pitch)
- **Urgent**: 1000 Hz (highest pitch)
- **Success**: 600 Hz (medium pitch)
- **Error**: 400 Hz (low pitch)
- **Default**: 700 Hz

Sounds are short beeps (0.3 seconds) that fade out smoothly.

## Styling

Notifications use different styles based on type:

- **Urgent**: Orange border and background
- **New Order**: Blue border and background
- **Success**: Green icon
- **Error**: Red icon

All notifications support dark mode automatically.

## Integration with Real-Time Updates

To integrate with WebSocket or real-time updates:

```tsx
import { useEffect } from 'react';
import { useKitchenNotification } from '@/features/kitchen/components/RealTimeNotification';

function KitchenDashboard() {
  const notification = useKitchenNotification();

  useEffect(() => {
    // Subscribe to real-time order updates
    const socket = io('your-websocket-url');
    
    socket.on('new_order', (order) => {
      notification.notifyNewOrder(order);
    });
    
    socket.on('order_updated', (order) => {
      notification.notifyStatusUpdate(order, order.status);
    });
    
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <RealTimeNotification soundEnabled={true} volume={0.5} />
      {/* Dashboard content */}
    </div>
  );
}
```

## Accessibility

- Notifications are announced to screen readers via toast library
- Sound alerts can be disabled for users who prefer silent notifications
- Visual indicators (icons, colors) complement audio alerts
- Keyboard accessible (toast library handles this)

## Browser Support

- Modern browsers with Web Audio API support
- Falls back gracefully if audio is not available
- Toast notifications work in all modern browsers

## Performance

- Lightweight component with minimal re-renders
- Audio context is created once and reused
- Notifications are queued and managed efficiently
- No memory leaks (proper cleanup on unmount)

## Testing

Run tests with:

```bash
npm test RealTimeNotification.test.tsx
```

## Example

See `RealTimeNotification.example.tsx` for a complete interactive demo.

## Notes

- The component is designed for kitchen staff dashboards
- Supports Arabic text (RTL) for messages
- Can be easily extended with additional notification types
- Works seamlessly with the existing Sonner toast system

## Future Enhancements

- [ ] Custom sound files (MP3, WAV)
- [ ] Notification history/log
- [ ] Batch notifications for multiple orders
- [ ] Desktop notifications API integration
- [ ] Vibration API for mobile devices
- [ ] Notification preferences per user
