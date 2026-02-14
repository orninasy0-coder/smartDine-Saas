# Restaurant Owner Dashboard Feature

This feature provides the restaurant owner dashboard with comprehensive management capabilities.

## Overview

The Restaurant Owner Dashboard is the central hub for restaurant owners to manage their business operations, view analytics, and configure settings.

## Components

### DashboardStats

Displays key performance metrics in a grid layout:
- Total Revenue
- Total Orders
- Average Rating
- Active Orders
- Weekly Revenue & Orders
- Monthly Revenue & Orders

**Usage:**
```tsx
import { DashboardStats } from '@/features/restaurant-owner';

<DashboardStats stats={dashboardStats} isLoading={false} />
```

### MenuEditor

Comprehensive menu management interface with:
- Dish list with search and filter
- Add/Edit/Delete operations
- Image and 3D model upload
- Category management
- Availability toggle

**Usage:**
```tsx
import { MenuEditor } from '@/features/restaurant-owner';

<MenuEditor restaurantId={restaurantId} />
```

### AnalyticsCharts

Visual analytics dashboard with:
- Revenue trends over time
- Order volume charts
- Top performing dishes
- Period selection (week/month/year)

**Usage:**
```tsx
import { AnalyticsCharts } from '@/features/restaurant-owner';

<AnalyticsCharts restaurantId={restaurantId} />
```

### StaffTable

Staff management table with:
- Staff list with role badges
- Active/Inactive status
- Edit and delete actions
- Status toggle functionality

**Usage:**
```tsx
import { StaffTable } from '@/features/restaurant-owner';

<StaffTable
  staff={staffMembers}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onToggleStatus={handleToggleStatus}
/>
```

### StaffForm

Form for adding/editing staff members:
- Name, email, phone validation
- Role selection (Kitchen/Delivery)
- Active status toggle
- Inline error messages

**Usage:**
```tsx
import { StaffForm } from '@/features/restaurant-owner';

<StaffForm
  staff={existingStaff} // null for add mode
  onSubmit={handleSubmit}
  onCancel={handleCancel}
/>
```

## Pages

### DashboardHome

Main dashboard page that displays:
- Welcome header
- Statistics grid
- Placeholder sections for future features (charts, quick actions)

**Route:** `/dashboard`

## Types

### DashboardStats
```typescript
interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  averageRating: number;
  activeOrders: number;
  todayRevenue: number;
  todayOrders: number;
  weekRevenue: number;
  weekOrders: number;
  monthRevenue: number;
  monthOrders: number;
}
```

## Implementation Status

### Completed (Task 10.1)
- ✅ Dashboard Stats Component (10.1.1)
- ✅ Main Statistics Display (10.1.2)

### Completed (Task 10.2)
- ✅ Menu Editor Component (10.2.1)
- ✅ Dish Form Component (10.2.2)
- ✅ File Upload (Images & 3D Models) (10.2.3)
- ✅ CRUD Operations for Dishes (10.2.4)

### Completed (Task 10.3)
- ✅ Analytics Charts Component (10.3.1)
- ✅ Revenue Charts (10.3.2)
- ✅ Order Volume Charts (10.3.3)
- ✅ Top Dishes Display (10.3.4)

### Completed (Task 10.4)
- ✅ Staff Table Component (10.4.1)
- ✅ Add/Edit/Delete Staff (10.4.2)

### Pending
- Settings (10.5)
- QR Code Generation (10.6)
- Feedback Management (10.7)

## Integration Notes

### Backend Integration
Currently using mock data. When backend is ready:

1. Create API service in `src/features/restaurant-owner/services/`
2. Replace mock data in `DashboardHome.tsx` with actual API calls
3. Use React Query for data fetching and caching

Example:
```typescript
// services/dashboardService.ts
export async function fetchDashboardStats(restaurantId: string) {
  const response = await fetch(`/api/v1/analytics/dashboard/${restaurantId}`);
  return response.json();
}

// In component
const { data: stats, isLoading } = useQuery({
  queryKey: ['dashboard-stats', restaurantId],
  queryFn: () => fetchDashboardStats(restaurantId),
});
```

### Routing
Add to your router configuration:
```tsx
import { DashboardHome } from '@/features/restaurant-owner';

<Route path="/dashboard" element={<DashboardHome />} />
```

### Authentication
Ensure the dashboard route is protected and only accessible to users with `RESTAURANT_OWNER` role.

## Styling

- Uses shadcn/ui Card component
- Responsive grid layout (1 col mobile, 2 cols tablet, 4 cols desktop)
- Lucide icons for visual indicators
- Loading skeletons for better UX
- Hover effects on stat cards

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live order counts
2. **Charts**: Revenue trends, order volume graphs
3. **Quick Actions**: Shortcuts to common tasks
4. **Notifications**: Alert badges for pending actions
5. **Customization**: Allow owners to customize dashboard layout
6. **Export**: Download reports as PDF/CSV
