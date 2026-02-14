# StatusButtons Component

## Overview

The `StatusButtons` component is a reusable UI component that provides status action buttons for kitchen orders. It handles the order status transitions from PENDING → PREPARING → READY, displaying the appropriate action button based on the current order status.

## Features

- **Status-aware rendering**: Automatically shows the correct button based on order status
- **Flexible sizing**: Supports multiple button size variants (sm, default, lg, icon)
- **Loading states**: Disables buttons during status updates
- **Customizable layout**: Supports full-width or auto-width buttons
- **Type-safe**: Full TypeScript support with proper type definitions
- **Accessible**: Built on shadcn/ui Button component with ARIA support
- **Internationalized**: Arabic language support (RTL)

## Usage

### Basic Usage

```tsx
import { StatusButtons } from '@/features/kitchen/components';

function OrderCard({ order, onStatusChange, isUpdating }) {
  const handleStatusChange = (newStatus: 'PREPARING' | 'READY') => {
    onStatusChange(order.id, newStatus);
  };

  return (
    <div>
      <StatusButtons
        status={order.status}
        onStatusChange={handleStatusChange}
        isUpdating={isUpdating}
      />
    </div>
  );
}
```

### With Custom Styling

```tsx
<StatusButtons
  status={order.status}
  onStatusChange={handleStatusChange}
  isUpdating={isUpdating}
  size="sm"
  fullWidth={false}
  className="mt-4"
/>
```

### In a Card Layout

```tsx
<Card className="p-6">
  <h2 className="text-lg font-bold mb-4">إجراءات</h2>
  <StatusButtons
    status={order.status}
    onStatusChange={handleStatusChange}
    isUpdating={isUpdating}
    size="lg"
    fullWidth={true}
  />
</Card>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `OrderStatus` | Required | Current order status (PENDING, PREPARING, READY, DELIVERED, CANCELLED) |
| `onStatusChange` | `(newStatus: 'PREPARING' \| 'READY') => void` | Required | Callback function when status should change |
| `isUpdating` | `boolean` | `false` | Whether the status update is in progress (disables buttons) |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'lg'` | Button size variant |
| `className` | `string` | `''` | Additional CSS classes for the wrapper div |
| `fullWidth` | `boolean` | `true` | Whether buttons should take full width (flex-1) |

## Status Transitions

The component handles the following status transitions:

1. **PENDING → PREPARING**: Shows "بدء التحضير" (Start Preparing) button
2. **PREPARING → READY**: Shows "جاهز للتقديم" (Mark Ready) button
3. **READY, DELIVERED, CANCELLED**: No buttons shown (terminal states)

## Button States

### PENDING Status
- **Button Text**: "بدء التحضير" (Start Preparing)
- **Icon**: ChefHat
- **Action**: Calls `onStatusChange('PREPARING')`

### PREPARING Status
- **Button Text**: "جاهز للتقديم" (Mark Ready)
- **Icon**: CheckCircle
- **Action**: Calls `onStatusChange('READY')`

### Terminal States (READY, DELIVERED, CANCELLED)
- **Rendering**: Component returns `null` (no buttons shown)

## Examples

### Example 1: Order Card Integration

```tsx
import { OrderCard } from '@/features/kitchen/components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/features/orders/services';

function KitchenOrders() {
  const queryClient = useQueryClient();
  
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) =>
      orderService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const handleStatusChange = (orderId: string, newStatus: 'PREPARING' | 'READY') => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  return (
    <div>
      {orders.map(order => (
        <OrderCard
          key={order.id}
          order={order}
          onStatusChange={handleStatusChange}
          isUpdating={updateStatusMutation.isPending}
        />
      ))}
    </div>
  );
}
```

### Example 2: Order Detail Page

```tsx
import { StatusButtons } from '@/features/kitchen/components';
import { Card } from '@/components/ui/card';

function OrderDetailPage({ order }) {
  const handleStatusChange = (newStatus: 'PREPARING' | 'READY') => {
    // Update order status
    updateOrder(order.id, newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Order details */}
      
      {/* Action buttons */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">إجراءات</h2>
        <StatusButtons
          status={order.status}
          onStatusChange={handleStatusChange}
          isUpdating={isUpdating}
          size="lg"
          fullWidth={true}
        />
      </Card>
    </div>
  );
}
```

### Example 3: Compact Layout

```tsx
<div className="flex items-center gap-3">
  <span className="text-sm text-muted-foreground">حالة الطلب:</span>
  <StatusButtons
    status={order.status}
    onStatusChange={handleStatusChange}
    size="sm"
    fullWidth={false}
  />
</div>
```

## Styling

The component uses Tailwind CSS classes and can be customized:

```tsx
// Custom wrapper styling
<StatusButtons
  status={order.status}
  onStatusChange={handleStatusChange}
  className="mt-4 border-t pt-4"
/>

// Custom button width
<StatusButtons
  status={order.status}
  onStatusChange={handleStatusChange}
  fullWidth={false}  // Buttons will be auto-width
/>
```

## Accessibility

- Built on shadcn/ui Button component with proper ARIA attributes
- Keyboard navigation support (Tab, Enter, Space)
- Disabled state properly communicated to screen readers
- High contrast colors for visibility
- Icons with proper semantic meaning

## Testing

The component includes comprehensive unit tests covering:

- Rendering correct buttons for each status
- Not rendering buttons for terminal states
- Calling onStatusChange with correct parameters
- Disabling buttons when isUpdating is true
- Applying custom classes and styles
- Different size variants
- Full-width vs auto-width layouts

Run tests:
```bash
npm test -- StatusButtons.test.tsx --run
```

## Dependencies

- **React**: Core library
- **Lucide React**: Icons (ChefHat, CheckCircle)
- **shadcn/ui Button**: Base button component
- **Tailwind CSS**: Styling

## Related Components

- **OrderCard**: Uses StatusButtons for order actions
- **OrderQueue**: Displays multiple OrderCards
- **OrderTimer**: Shows elapsed time for orders
- **KitchenOrderDetail**: Uses StatusButtons in detail view

## Best Practices

1. **Always handle loading states**: Pass `isUpdating` prop to prevent duplicate submissions
2. **Invalidate queries**: Refresh order data after status changes
3. **Show feedback**: Use toast notifications for success/error states
4. **Optimize updates**: Use React Query mutations for efficient updates
5. **Type safety**: Use TypeScript types for status values

## Migration Guide

If you have existing status buttons in your components, migrate to StatusButtons:

### Before
```tsx
{isPending && (
  <Button onClick={handleMarkPreparing} disabled={isUpdating}>
    <ChefHat className="w-4 h-4 mr-2" />
    بدء التحضير
  </Button>
)}

{isPreparing && (
  <Button onClick={handleMarkReady} disabled={isUpdating}>
    <CheckCircle className="w-4 h-4 mr-2" />
    جاهز للتقديم
  </Button>
)}
```

### After
```tsx
<StatusButtons
  status={order.status}
  onStatusChange={handleStatusChange}
  isUpdating={isUpdating}
/>
```

## Performance

- **Lightweight**: Minimal component with no heavy dependencies
- **Memoization**: Consider wrapping in React.memo if needed
- **No re-renders**: Only re-renders when props change
- **Efficient**: Uses conditional rendering (returns null for terminal states)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive touch interactions
- RTL support for Arabic

## Future Enhancements

Potential improvements for future versions:

1. **Confirmation dialogs**: Add optional confirmation before status change
2. **Undo functionality**: Allow reverting status changes
3. **Custom button text**: Support custom labels via props
4. **Animation**: Add transition animations between states
5. **Batch operations**: Support multiple order status updates
6. **Keyboard shortcuts**: Add hotkeys for quick actions
7. **Sound feedback**: Optional audio cues for status changes
8. **Haptic feedback**: Vibration on mobile devices

## Troubleshooting

### Buttons not showing
- Check that status is PENDING or PREPARING
- Verify status prop is correctly passed
- Ensure component is not hidden by CSS

### onStatusChange not called
- Check that button is not disabled (isUpdating)
- Verify callback function is properly defined
- Check for JavaScript errors in console

### Styling issues
- Ensure Tailwind CSS is properly configured
- Check that shadcn/ui Button is installed
- Verify className prop is applied correctly

## License

Part of the SmartDine SaaS Platform - Kitchen Dashboard Module

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Component Type**: Presentational  
**Status**: ✅ Complete
