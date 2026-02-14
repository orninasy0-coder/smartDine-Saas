# Subscriptions Management Integration Guide

This guide explains how to integrate the Subscriptions Management feature (Task 11.3) into your application.

## Overview

The Subscriptions Management feature provides comprehensive tools for platform administrators to:
- View and manage all active subscriptions
- Upgrade, cancel, and renew subscriptions
- Configure pricing plans and features
- Monitor subscription revenue and metrics

## Components

### SubscriptionManager

Main component for displaying and managing subscriptions.

**Features:**
- Searchable subscription table
- Filter by restaurant name, email, or plan
- Action menu for each subscription (View, Upgrade, Cancel, Renew)
- Real-time status badges
- Monthly recurring revenue (MRR) display
- Billing cycle information

**Usage:**
```tsx
import { SubscriptionManager } from '@/features/admin';

<SubscriptionManager
  subscriptions={subscriptions}
  isLoading={false}
  onUpgrade={(id, plan) => handleUpgrade(id, plan)}
  onCancel={(id) => handleCancel(id)}
  onRenew={(id) => handleRenew(id)}
  onView={(subscription) => handleView(subscription)}
/>
```

### SubscriptionDetailsDialog

Modal dialog displaying comprehensive subscription information.

**Features:**
- Restaurant information
- Subscription details (plan, status, billing cycle)
- Important dates (start, current period, expiration)
- Billing information (MRR, total paid, next billing)
- Available features based on plan
- Metadata (ID, created, updated)

**Usage:**
```tsx
import { SubscriptionDetailsDialog } from '@/features/admin';

<SubscriptionDetailsDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  subscription={selectedSubscription}
/>
```

### PlanPricingManager

Component for managing subscription plans and pricing.

**Features:**
- Visual plan cards with features
- Pricing comparison (monthly vs yearly)
- Active subscription count per plan
- MRR calculation per plan
- Edit plan pricing and features
- Popular plan badge

**Usage:**
```tsx
import { PlanPricingManager } from '@/features/admin';

<PlanPricingManager
  plans={plans}
  isLoading={false}
  onEdit={(plan) => handleEditPlan(plan)}
/>
```

### PlanPricingDialog

Modal dialog for editing plan pricing and features.

**Features:**
- Edit plan name and description
- Configure monthly and yearly pricing
- Set limits (max menu items, max tables)
- Toggle features (AI Assistant, AR 3D Models)
- Mark plan as popular
- Automatic savings calculation

**Usage:**
```tsx
import { PlanPricingDialog } from '@/features/admin';

<PlanPricingDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  plan={selectedPlan}
  onSave={async (data) => {
    await updatePlan(data);
  }}
/>
```

## Page

### Subscriptions

Complete subscriptions management page with tabs.

**Route:** `/admin/subscriptions`

**Features:**
- Two tabs: Active Subscriptions and Pricing Plans
- Full CRUD operations for subscriptions
- Plan pricing configuration
- Toast notifications for all actions
- Mock data with TODO comments for backend integration

**Usage:**
```tsx
import { Subscriptions } from '@/features/admin';

// In your router
<Route path="/admin/subscriptions" element={<Subscriptions />} />
```

## Types

### Subscription
```typescript
interface Subscription {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantEmail: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  billingCycle: 'monthly' | 'yearly';
  monthlyRevenue: number;
  totalPaid: number;
  startDate: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  expiresAt: string | null;
  nextBillingDate: string | null;
  cancelledAt: string | null;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### PlanPricing
```typescript
interface PlanPricing {
  id: string;
  plan: SubscriptionPlan;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number | null;
  features: string[];
  maxMenuItems: number;
  maxTables: number;
  hasAI: boolean;
  hasAR: boolean;
  isPopular: boolean;
  activeSubscriptions: number;
  createdAt: string;
  updatedAt: string;
}
```

## Backend Integration

Currently using mock data. When backend is ready:

### 1. Create API Service

```typescript
// services/subscriptionService.ts
export async function fetchSubscriptions() {
  const response = await fetch('/api/v1/admin/subscriptions');
  return response.json();
}

export async function upgradeSubscription(id: string, plan: SubscriptionPlan) {
  const response = await fetch(`/api/v1/admin/subscriptions/${id}/upgrade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan }),
  });
  return response.json();
}

export async function cancelSubscription(id: string) {
  const response = await fetch(`/api/v1/admin/subscriptions/${id}/cancel`, {
    method: 'POST',
  });
  return response.json();
}

export async function renewSubscription(id: string) {
  const response = await fetch(`/api/v1/admin/subscriptions/${id}/renew`, {
    method: 'POST',
  });
  return response.json();
}

export async function fetchPlans() {
  const response = await fetch('/api/v1/admin/subscriptions/plans');
  return response.json();
}

export async function updatePlan(id: string, data: Partial<PlanPricing>) {
  const response = await fetch(`/api/v1/admin/subscriptions/plans/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

### 2. Use React Query

```typescript
// In Subscriptions.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// Fetch subscriptions
const { data: subscriptions, isLoading } = useQuery({
  queryKey: ['admin-subscriptions'],
  queryFn: fetchSubscriptions,
  refetchInterval: 30000, // Refresh every 30 seconds
});

// Upgrade subscription
const upgradeMutation = useMutation({
  mutationFn: ({ id, plan }: { id: string; plan: SubscriptionPlan }) =>
    upgradeSubscription(id, plan),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
    toast.success('Subscription upgraded successfully');
  },
  onError: () => {
    toast.error('Failed to upgrade subscription');
  },
});

// Cancel subscription
const cancelMutation = useMutation({
  mutationFn: (id: string) => cancelSubscription(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
    toast.success('Subscription cancelled successfully');
  },
});
```

## API Endpoints (Future)

```
# Subscriptions
GET    /api/v1/admin/subscriptions
GET    /api/v1/admin/subscriptions/:id
POST   /api/v1/admin/subscriptions/:id/upgrade
POST   /api/v1/admin/subscriptions/:id/cancel
POST   /api/v1/admin/subscriptions/:id/renew
PATCH  /api/v1/admin/subscriptions/:id

# Plans
GET    /api/v1/admin/subscriptions/plans
GET    /api/v1/admin/subscriptions/plans/:id
PATCH  /api/v1/admin/subscriptions/plans/:id
```

## Routing

Add to your router configuration:

```tsx
import { Subscriptions } from '@/features/admin';
import { ProtectedRoute } from '@/components/auth';

<Route
  path="/admin/subscriptions"
  element={
    <ProtectedRoute requiredRoles={['PLATFORM_ADMIN']}>
      <Subscriptions />
    </ProtectedRoute>
  }
/>
```

## Navigation

Update your admin navigation to include the subscriptions link:

```tsx
// In AdminLayout or Navigation component
<nav>
  <Link to="/admin">Dashboard</Link>
  <Link to="/admin/restaurants">Restaurants</Link>
  <Link to="/admin/subscriptions">Subscriptions</Link>
</nav>
```

## Styling

- Uses shadcn/ui components (Card, Badge, Table, Tabs)
- Responsive layout (mobile-first design)
- Loading skeletons for better UX
- Color-coded status and plan badges
- Dark mode support
- Lucide icons for visual indicators

## Key Features

### Subscription Management
- Search and filter subscriptions
- View detailed subscription information
- Upgrade subscriptions to higher plans
- Cancel active subscriptions
- Renew cancelled/suspended subscriptions
- Track billing cycles and revenue

### Plan Pricing Management
- Visual plan comparison
- Edit plan pricing (monthly/yearly)
- Configure plan features and limits
- Set popular plan badge
- Track active subscriptions per plan
- Calculate MRR per plan

### Business Metrics
- Monthly Recurring Revenue (MRR)
- Total revenue per subscription
- Active subscription count
- Plan distribution
- Billing cycle tracking

## Testing

Run tests with:
```bash
npm run test
```

Test coverage includes:
- Component rendering
- Loading states
- Search functionality
- Empty states
- User interactions
- Currency formatting
- Status badges

## Accessibility

- Proper heading hierarchy
- ARIA labels for icons and buttons
- Keyboard navigation support
- Color contrast compliance (WCAG 2.1 AA)
- Screen reader friendly
- Focus management in dialogs

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live subscription changes
2. **Advanced Filtering**: Filter by status, plan, billing cycle, date range
3. **Bulk Operations**: Upgrade/cancel multiple subscriptions at once
4. **Revenue Analytics**: Charts showing revenue trends over time
5. **Export Reports**: Download subscription reports as PDF/CSV
6. **Email Notifications**: Automated emails for subscription events
7. **Payment Integration**: Direct payment processing and refunds
8. **Subscription History**: View complete subscription lifecycle
9. **Custom Plans**: Create custom plans for specific restaurants
10. **Trial Management**: Manage trial periods and conversions

## Notes

- All components use TypeScript for type safety
- Mock data is provided for development
- TODO comments indicate where backend integration is needed
- Toast notifications provide user feedback
- Error handling is implemented throughout
- Components are fully tested

## Related Tasks

- Task 11.1: Admin Home Page ✅
- Task 11.2: Restaurants Management ✅
- Task 11.3: Subscriptions Management ✅ (Current)
- Task 11.4: Platform Analytics (Pending)
- Task 11.5: System Health Monitoring (Pending)
- Task 11.6: Notification Sender (Pending)
