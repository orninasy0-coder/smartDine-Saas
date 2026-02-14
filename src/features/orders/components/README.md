# Order Components

This directory contains components related to order management and tracking.

## OrderTracker

A visual component that displays real-time order status tracking with a timeline interface.

### Features

- **Visual Timeline**: Shows order progress through different stages (Pending → Preparing → Ready → Delivered)
- **Status Indicators**: Color-coded status dots and icons for each stage
- **Estimated Time**: Displays estimated time remaining for non-completed orders
- **Cancelled Orders**: Special handling for cancelled orders with appropriate messaging
- **Animations**: Smooth Framer Motion animations for status transitions
- **Responsive**: Works on all screen sizes

### Usage

```tsx
import { OrderTracker } from '@/features/orders';

function OrderPage() {
  return (
    <OrderTracker
      status="PREPARING"
      createdAt="2024-01-15T10:00:00Z"
      className="mt-4"
    />
  );
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `status` | `OrderStatus` | Yes | Current order status (PENDING, PREPARING, READY, DELIVERED, CANCELLED) |
| `createdAt` | `string` | Yes | ISO timestamp of when the order was created |
| `className` | `string` | No | Additional CSS classes to apply to the component |

### Order Status Flow

1. **PENDING** (قيد الانتظار) - Order received, waiting to be prepared
2. **PREPARING** (قيد التحضير) - Order is being prepared in the kitchen
3. **READY** (جاهز) - Order is ready for delivery
4. **DELIVERED** (تم التوصيل) - Order has been delivered
5. **CANCELLED** (ملغي) - Order was cancelled

### Estimated Times

- **PENDING**: 20-30 minutes
- **PREPARING**: 15-20 minutes
- **READY**: 5-10 minutes
- **DELIVERED**: No time shown (completed)
- **CANCELLED**: No time shown

### Styling

The component uses Tailwind CSS classes and respects the application's theme (dark/light mode). Status colors:

- Pending: Yellow (`text-yellow-500`)
- Preparing: Blue (`text-blue-500`)
- Ready: Green (`text-green-500`)
- Delivered: Dark Green (`text-green-600`)
- Cancelled: Red (`text-red-500`)

### Testing

The component includes comprehensive unit tests covering:
- All order statuses
- Timeline rendering
- Status transitions
- Estimated time display
- Custom className application
- Cancelled order handling

Run tests with:
```bash
npm test -- OrderTracker.test.tsx
```
