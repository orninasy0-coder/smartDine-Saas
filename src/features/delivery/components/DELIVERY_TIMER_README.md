# DeliveryTimer Component

## Overview

The `DeliveryTimer` component displays elapsed time since an order became ready for delivery and provides visual urgency indicators based on the estimated delivery time. It updates in real-time every second and helps delivery personnel prioritize orders.

## Features

- ⏱️ **Real-time Updates**: Automatically updates every second
- 🚨 **Urgency Indicators**: Three levels (Normal, Warning, Critical) with visual feedback
- 📊 **Progress Bar**: Visual representation of elapsed time vs estimated time
- 🎨 **Theme Support**: Works seamlessly in both light and dark modes
- 📱 **Responsive Design**: Adapts to different screen sizes
- 🔄 **Compact Mode**: Minimal display for inline usage
- ♿ **Accessible**: Proper color contrast and semantic HTML

## Installation

The component is part of the delivery feature module:

```typescript
import { DeliveryTimer } from '@/features/delivery';
```

## Basic Usage

### Full Version

```tsx
import { DeliveryTimer } from '@/features/delivery';

function DeliveryCard({ order }) {
  return (
    <div>
      <h3>Order #{order.orderNumber}</h3>
      <DeliveryTimer
        readyAt={order.updatedAt}
        estimatedDeliveryMinutes={30}
      />
    </div>
  );
}
```

### Compact Version

```tsx
<DeliveryTimer
  readyAt={order.updatedAt}
  estimatedDeliveryMinutes={30}
  compact
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `readyAt` | `string \| Date` | Required | Timestamp when order became ready (ISO string or Date object) |
| `estimatedDeliveryMinutes` | `number` | `30` | Estimated delivery time in minutes |
| `compact` | `boolean` | `false` | Show compact version without labels |
| `className` | `string` | `''` | Additional CSS classes |

## Urgency Levels

The component automatically determines urgency based on elapsed time vs estimated time:

### Normal (0-74%)
- **Color**: Green
- **Indicator**: ✓ في الوقت المحدد
- **Behavior**: Standard display

### Warning (75-99%)
- **Color**: Orange
- **Indicator**: ⚠ يقترب الموعد
- **Behavior**: Warning colors and icon

### Critical (100%+)
- **Color**: Red
- **Indicator**: ⚠ متأخر (animated)
- **Behavior**: Critical colors, animated icon, shows delay amount

## Display Modes

### Full Mode (Default)

Shows complete information:
- Elapsed time with hours, minutes, seconds
- Urgency badge
- Estimated delivery time
- Remaining time (or delay amount)
- Progress bar

```tsx
<DeliveryTimer
  readyAt={orderReadyTime}
  estimatedDeliveryMinutes={30}
/>
```

### Compact Mode

Minimal display for inline usage:
- Timer in MM:SS or H:MM:SS format
- Clock icon
- Alert icon for critical status

```tsx
<DeliveryTimer
  readyAt={orderReadyTime}
  estimatedDeliveryMinutes={30}
  compact
/>
```

## Examples

### Example 1: In Delivery Card

```tsx
import { DeliveryTimer } from '@/features/delivery';
import { Card } from '@/components/ui/card';

function DeliveryOrderCard({ order }) {
  return (
    <Card className="p-6">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-bold">طلب #{order.orderNumber}</h3>
        <Badge>قيد التوصيل</Badge>
      </div>
      
      <DeliveryTimer
        readyAt={order.updatedAt}
        estimatedDeliveryMinutes={30}
        className="mb-4"
      />
      
      <div className="text-sm text-muted-foreground">
        {order.items.length} أصناف • {order.totalPrice} ر.س
      </div>
    </Card>
  );
}
```

### Example 2: In List View (Compact)

```tsx
function DeliveryListItem({ order }) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div>
        <p className="font-semibold">طلب #{order.orderNumber}</p>
        <p className="text-sm text-muted-foreground">طاولة {order.tableNumber}</p>
      </div>
      
      <DeliveryTimer
        readyAt={order.updatedAt}
        estimatedDeliveryMinutes={30}
        compact
      />
    </div>
  );
}
```

### Example 3: With Custom Estimated Time

```tsx
// Express delivery (15 minutes)
<DeliveryTimer
  readyAt={order.updatedAt}
  estimatedDeliveryMinutes={15}
/>

// Standard delivery (30 minutes)
<DeliveryTimer
  readyAt={order.updatedAt}
  estimatedDeliveryMinutes={30}
/>

// Long distance (60 minutes)
<DeliveryTimer
  readyAt={order.updatedAt}
  estimatedDeliveryMinutes={60}
/>
```

### Example 4: Multiple Timers

```tsx
function DeliveryDashboard({ orders }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {orders.map((order) => (
        <Card key={order.id} className="p-6">
          <h3 className="font-bold mb-4">طلب #{order.orderNumber}</h3>
          <DeliveryTimer
            readyAt={order.updatedAt}
            estimatedDeliveryMinutes={30}
          />
        </Card>
      ))}
    </div>
  );
}
```

## Time Formatting

The component automatically formats time based on duration:

- **< 1 minute**: Shows seconds only (e.g., "45 ثانية")
- **< 1 hour**: Shows minutes and seconds (e.g., "15 دقيقة و 30 ثانية")
- **≥ 1 hour**: Shows hours and minutes (e.g., "1 ساعة و 25 دقيقة")

In compact mode:
- **< 1 hour**: MM:SS format (e.g., "15:30")
- **≥ 1 hour**: H:MM:SS format (e.g., "1:25:30")

## Styling

### Custom Styling

You can add custom classes via the `className` prop:

```tsx
<DeliveryTimer
  readyAt={order.updatedAt}
  estimatedDeliveryMinutes={30}
  className="shadow-lg"
/>
```

### Theme Colors

The component uses semantic color tokens that adapt to light/dark mode:

- **Normal**: Green shades
- **Warning**: Orange shades
- **Critical**: Red shades

All colors are defined using Tailwind CSS utility classes with dark mode variants.

## Performance

- **Updates**: Timer updates every 1 second using `setInterval`
- **Cleanup**: Automatically cleans up interval on unmount
- **Re-renders**: Minimal re-renders, only when time changes
- **Memory**: Lightweight, no heavy computations

## Accessibility

- Semantic HTML structure
- Proper color contrast ratios (WCAG AA compliant)
- Icon + text for status indicators
- Readable font sizes
- Screen reader friendly

## Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript
- CSS Grid and Flexbox
- CSS Custom Properties
- React 18+

## Integration with Delivery System

### With DeliveryCard

```tsx
import { DeliveryCard, DeliveryTimer } from '@/features/delivery';

// DeliveryCard already includes timer functionality
<DeliveryCard
  order={order}
  onStatusChange={handleStatusChange}
/>
```

### With DeliveryQueue

```tsx
import { DeliveryQueue } from '@/features/delivery';

// DeliveryQueue uses DeliveryCard which includes timers
<DeliveryQueue restaurantId={restaurantId} />
```

### Standalone Usage

```tsx
import { DeliveryTimer } from '@/features/delivery';

// Use independently in custom components
<DeliveryTimer
  readyAt={order.updatedAt}
  estimatedDeliveryMinutes={30}
/>
```

## Testing

### Unit Tests

```typescript
import { render, screen } from '@testing-library/react';
import { DeliveryTimer } from './DeliveryTimer';

test('displays elapsed time', () => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  
  render(
    <DeliveryTimer
      readyAt={fiveMinutesAgo}
      estimatedDeliveryMinutes={30}
    />
  );
  
  expect(screen.getByText(/5 دقيقة/)).toBeInTheDocument();
});

test('shows critical status when over time', () => {
  const thirtyFiveMinutesAgo = new Date(Date.now() - 35 * 60 * 1000);
  
  render(
    <DeliveryTimer
      readyAt={thirtyFiveMinutesAgo}
      estimatedDeliveryMinutes={30}
    />
  );
  
  expect(screen.getByText(/متأخر/)).toBeInTheDocument();
});
```

## Troubleshooting

### Timer not updating

**Problem**: Timer shows static time
**Solution**: Ensure `readyAt` is a valid Date or ISO string

```tsx
// ✅ Correct
<DeliveryTimer readyAt={new Date()} />
<DeliveryTimer readyAt="2024-01-01T12:00:00Z" />

// ❌ Incorrect
<DeliveryTimer readyAt="invalid date" />
```

### Wrong urgency level

**Problem**: Shows wrong color/status
**Solution**: Check `estimatedDeliveryMinutes` value

```tsx
// Ensure estimated time is reasonable
<DeliveryTimer
  readyAt={order.updatedAt}
  estimatedDeliveryMinutes={30} // Should match your delivery SLA
/>
```

### Performance issues with many timers

**Problem**: Page slows down with multiple timers
**Solution**: Use compact mode or consider virtualization

```tsx
// Use compact mode for lists
{orders.map(order => (
  <DeliveryTimer
    key={order.id}
    readyAt={order.updatedAt}
    estimatedDeliveryMinutes={30}
    compact // Lighter rendering
  />
))}
```

## Related Components

- **DeliveryCard**: Displays full order details with integrated timer
- **DeliveryQueue**: Shows list of orders with timers
- **MapView**: Delivery map with route information
- **RouteOptimizer**: Optimizes delivery routes

## Future Enhancements

Potential improvements for future versions:

- [ ] Sound alerts for critical status
- [ ] Customizable urgency thresholds
- [ ] Pause/resume functionality
- [ ] Historical time tracking
- [ ] Average delivery time calculation
- [ ] Predicted completion time based on traffic
- [ ] Integration with GPS tracking

## Support

For issues or questions:
1. Check this README
2. Review example files
3. Check component source code
4. Contact development team

## License

Part of the SmartDine SaaS platform.
