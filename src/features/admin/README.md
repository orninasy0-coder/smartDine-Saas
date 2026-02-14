# Platform Admin Dashboard Feature

This feature provides the platform administrator dashboard with comprehensive platform management capabilities.

## Overview

The Platform Admin Dashboard is the central hub for platform administrators to monitor all restaurants, manage subscriptions, view platform-wide analytics, and oversee system health.

## Components

### PlatformStats

Displays key platform-wide metrics in a grid layout:
- Total Restaurants (with active count)
- Platform Revenue (with today's revenue)
- Total Orders (with today's orders)
- Active Subscriptions (with trial count)
- Weekly Revenue & Orders
- Monthly Revenue & Orders

**Usage:**
```tsx
import { PlatformStats } from '@/features/admin';

<PlatformStats stats={platformStats} isLoading={false} />
```

**Props:**
```typescript
interface PlatformStatsProps {
  stats: PlatformStats;
  isLoading?: boolean;
}
```

### RestaurantTable

Displays all restaurants in a searchable, sortable table with action menu for each restaurant.

**Features:**
- Search by name, email, or slug
- Subscription plan and status badges
- Action menu (View, Edit, Suspend/Activate, Delete)
- Loading skeleton
- Empty states
- Results count

**Usage:**
```tsx
import { RestaurantTable } from '@/features/admin';

<RestaurantTable
  restaurants={restaurants}
  isLoading={false}
  onCreate={() => {}}
  onEdit={(restaurant) => {}}
  onDelete={(id) => {}}
  onView={(restaurant) => {}}
  onStatusChange={(id, status) => {}}
/>
```

**Props:**
```typescript
interface RestaurantTableProps {
  restaurants: Restaurant[];
  isLoading?: boolean;
  onEdit: (restaurant: Restaurant) => void;
  onCreate: () => void;
  onDelete: (restaurantId: string) => void;
  onView: (restaurant: Restaurant) => void;
  onStatusChange: (restaurantId: string, status: SubscriptionStatus) => void;
}
```

### RestaurantDialog

Modal dialog for creating new restaurants or editing existing ones.

**Features:**
- Form validation with error messages
- Auto-generate slug from restaurant name
- Subscription plan selector
- Required field indicators
- Disabled slug editing for existing restaurants

**Usage:**
```tsx
import { RestaurantDialog } from '@/features/admin';

<RestaurantDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  restaurant={selectedRestaurant}
  onSave={async (data) => {
    // Save restaurant
  }}
/>
```

**Props:**
```typescript
interface RestaurantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant?: Restaurant | null;
  onSave: (data: CreateRestaurantInput) => Promise<void>;
}
```

### DeleteRestaurantDialog

Confirmation dialog for deleting restaurants with warning about data loss.

**Features:**
- Warning message about permanent deletion
- List of data that will be deleted
- Restaurant details display
- Confirmation button with loading state

**Usage:**
```tsx
import { DeleteRestaurantDialog } from '@/features/admin';

<DeleteRestaurantDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  restaurant={restaurantToDelete}
  onConfirm={async () => {
    // Delete restaurant
  }}
/>
```

### RestaurantDetailsDialog

Displays comprehensive information about a restaurant.

**Features:**
- Basic information (address, email, phone, URL)
- Subscription details (plan, status, expiration)
- Account information (created, updated, ID)
- Available features based on plan
- Formatted dates and badges

**Usage:**
```tsx
import { RestaurantDetailsDialog } from '@/features/admin';

<RestaurantDetailsDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  restaurant={selectedRestaurant}
/>
```

### SubscriptionManager

Displays and manages all subscriptions across the platform.

**Features:**
- Searchable subscription table
- Filter by restaurant name, email, or plan
- Action menu (View, Upgrade, Cancel, Renew)
- Status and plan badges
- MRR display with currency formatting
- Billing cycle information
- Loading skeleton and empty states

**Usage:**
```tsx
import { SubscriptionManager } from '@/features/admin';

<SubscriptionManager
  subscriptions={subscriptions}
  isLoading={false}
  onUpgrade={(id, plan) => {}}
  onCancel={(id) => {}}
  onRenew={(id) => {}}
  onView={(subscription) => {}}
/>
```

**Props:**
```typescript
interface SubscriptionManagerProps {
  subscriptions: Subscription[];
  isLoading?: boolean;
  onUpgrade: (subscriptionId: string, newPlan: SubscriptionPlan) => void;
  onCancel: (subscriptionId: string) => void;
  onRenew: (subscriptionId: string) => void;
  onView: (subscription: Subscription) => void;
}
```

### SubscriptionDetailsDialog

Displays comprehensive subscription information.

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

Manages subscription plans and their pricing.

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
  onEdit={(plan) => {}}
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
    // Save plan updates
  }}
/>
```

### PlatformAnalytics

Displays comprehensive platform-wide analytics with interactive charts and visualizations.

**Features:**
- Key metrics cards with trend indicators
- Tabbed interface for different analytics views
- Interactive bar charts with hover tooltips
- Revenue, orders, restaurants, and subscriptions analytics
- Top performing restaurants ranking
- Subscription distribution by plan
- Loading skeleton states
- Responsive design

**Usage:**
```tsx
import { PlatformAnalytics } from '@/features/admin';

<PlatformAnalytics
  data={analyticsData}
  isLoading={false}
/>
```

**Props:**
```typescript
interface PlatformAnalyticsProps {
  data: PlatformAnalyticsData;
  isLoading?: boolean;
}
```

**Analytics Tabs:**
1. **Revenue**: Daily and monthly revenue charts
2. **Orders**: Daily orders and status breakdown
3. **Restaurants**: Growth chart and top performers
4. **Subscriptions**: Revenue by plan and overview

### SystemMetrics

Displays comprehensive system health metrics and performance indicators.

**Features:**
- Overall system status badge (healthy/degraded/down)
- Key metrics cards (uptime, API latency, error rate, active connections)
- Detailed metrics sections:
  - CPU usage with core count
  - Memory usage with percentage
  - Database connection pool and query time
  - Cache hit rate and memory usage
- Status indicators for each subsystem
- Loading skeleton states
- Responsive design

**Usage:**
```tsx
import { SystemMetrics } from '@/features/admin';

<SystemMetrics
  data={systemMetricsData}
  isLoading={false}
/>
```

### ErrorLogs

Displays system error logs with filtering and search capabilities.

**Features:**
- Searchable error log table
- Filter by log level (error, warning, info, critical)
- Color-coded severity badges
- Expandable stack traces
- Timestamp display
- Source and request ID tracking
- Loading skeleton
- Empty states

**Usage:**
```tsx
import { ErrorLogs } from '@/features/admin';

<ErrorLogs
  logs={errorLogs}
  isLoading={false}
/>
```

### NotificationSender

Allows platform admins to send broadcast notifications to restaurants.

**Features:**
- Notification type selector (Info, Success, Warning, Critical)
- Target audience selector with recipient counts
- Title and message inputs with character counters
- Live preview of notification appearance
- Form validation (title max 100, message max 500 chars)
- Recipient count display
- Loading states during send
- Success/error toast notifications
- Automatic form reset after send

**Usage:**
```tsx
import { NotificationSender } from '@/features/admin';

<NotificationSender
  onSend={async (data) => {
    // Send notification via API
  }}
  restaurantCount={{
    all: 156,
    active: 142,
    trial: 14,
    suspended: 0,
  }}
/>
```

**Props:**
```typescript
interface NotificationSenderProps {
  onSend: (data: NotificationData) => Promise<void>;
  restaurantCount?: {
    all: number;
    active: number;
    trial: number;
    suspended: number;
  };
}

interface NotificationData {
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'critical';
  target: 'all' | 'active' | 'trial' | 'suspended' | 'specific';
  specificRestaurantIds?: string[];
}
```

## Pages

### AdminHome

Main platform admin dashboard page that displays:
- Welcome header with platform overview
- Platform-wide statistics grid
- System Health card with uptime, response time, error rate
- Subscription Distribution chart (Basic, Pro, Enterprise)
- Recent Activity feed
- Alerts & Notifications panel

**Route:** `/admin`

**Features:**
- Real-time system health monitoring
- Subscription tier distribution visualization
- Activity timeline with color-coded events
- Alert system with severity indicators
- Responsive grid layout

### Restaurants

Restaurants management page for CRUD operations on restaurant accounts.

**Route:** `/admin/restaurants`

**Features:**
- Complete restaurant listing with search
- Create new restaurant accounts
- Edit existing restaurant information
- View detailed restaurant information
- Suspend/activate restaurant accounts
- Delete restaurants with confirmation
- Toast notifications for all actions
- Mock data with TODO comments for backend integration

**State Management:**
- Local state for restaurants list
- Dialog state management
- Loading states
- Error handling with toast notifications

**Integration Points:**
```typescript
// TODO: Replace with actual API calls
// - fetchRestaurants()
// - handleSave() - Create/Update
// - handleConfirmDelete() - Delete
// - handleStatusChange() - Update status
```

### Subscriptions

Subscriptions management page for managing all subscriptions and pricing plans.

**Route:** `/admin/subscriptions`

**Features:**
- Two-tab layout (Active Subscriptions and Pricing Plans)
- Complete subscription management
- Upgrade, cancel, and renew subscriptions
- View detailed subscription information
- Configure plan pricing and features
- Track MRR and billing information
- Toast notifications for all actions
- Mock data with TODO comments for backend integration

**State Management:**
- Local state for subscriptions and plans
- Dialog state management
- Loading states
- Error handling with toast notifications

**Integration Points:**
```typescript
// TODO: Replace with actual API calls
// - fetchSubscriptions()
// - handleUpgrade() - Upgrade subscription
// - handleCancel() - Cancel subscription
// - handleRenew() - Renew subscription
// - fetchPlans() - Get pricing plans
// - handleSavePlan() - Update plan pricing
```

### Analytics

Platform analytics page displaying comprehensive insights and metrics.

**Route:** `/admin/analytics`

**Features:**
- Comprehensive platform-wide analytics
- Interactive charts and visualizations
- Revenue trends (daily and monthly)
- Order volume and status distribution
- Restaurant growth and top performers
- Subscription metrics and MRR
- Refresh button to reload data
- Export button (placeholder for future)
- Toast notifications
- Mock data with TODO comments for backend integration

**State Management:**
- Local state for analytics data
- Loading and refreshing states
- Error handling with toast notifications

**Integration Points:**
```typescript
// TODO: Replace with actual API call
// GET /api/v1/admin/analytics/platform
```

### SystemHealth

System health monitoring page displaying real-time metrics and error logs.

**Route:** `/admin/system-health`

**Features:**
- Real-time system metrics display
- CPU, memory, database, and cache monitoring
- Error logs with filtering and search
- System status indicators
- Refresh functionality
- Mock data with TODO comments for backend integration

**State Management:**
- Local state for metrics and logs
- Loading states
- Error handling with toast notifications

**Integration Points:**
```typescript
// TODO: Replace with actual API calls
// GET /api/v1/admin/system/metrics
// GET /api/v1/admin/system/logs
```

### Notifications

Broadcast notification management page for sending notifications to restaurants.

**Route:** `/admin/notifications`

**Features:**
- Notification sender component
- Target audience selection (all, active, trial, suspended)
- Notification type selection (info, success, warning, critical)
- Live preview of notifications
- Quick stats sidebar
- Best practices guide
- Recent notifications history
- Time ago formatting
- Mock data with TODO comments for backend integration

**State Management:**
- Local state for restaurant counts and recent notifications
- Loading states
- Error handling with toast notifications

**Integration Points:**
```typescript
// TODO: Replace with actual API calls
// GET /api/v1/admin/restaurants/count
// POST /api/v1/admin/notifications/broadcast
// GET /api/v1/admin/notifications/recent
```

## Types

### PlatformStats
```typescript
interface PlatformStats {
  totalRestaurants: number;
  activeRestaurants: number;
  totalRevenue: number;
  totalOrders: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  todayRevenue: number;
  todayOrders: number;
  weekRevenue: number;
  weekOrders: number;
  monthRevenue: number;
  monthOrders: number;
}
```

### SubscriptionDistribution
```typescript
interface SubscriptionDistribution {
  basic: number;
  pro: number;
  enterprise: number;
}
```

### SystemHealth
```typescript
interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  apiLatency: number;
  errorRate: number;
}
```

### Restaurant
```typescript
interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  email: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### CreateRestaurantInput
```typescript
interface CreateRestaurantInput {
  name: string;
  slug: string;
  address: string;
  phone: string;
  email: string;
  subscriptionPlan: SubscriptionPlan;
}
```

### UpdateRestaurantInput
```typescript
interface UpdateRestaurantInput {
  name?: string;
  slug?: string;
  address?: string;
  phone?: string;
  email?: string;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionStatus?: SubscriptionStatus;
}
```

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

### SubscriptionPlan
```typescript
type SubscriptionPlan = 'BASIC' | 'PRO' | 'ENTERPRISE';
```

### SubscriptionStatus
```typescript
type SubscriptionStatus = 'ACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'GRACE_PERIOD';
```

## Implementation Status

### Completed (Task 11.1)
- ✅ Admin Home Page
- ✅ Platform Stats Component
- ✅ System Health Display
- ✅ Subscription Distribution Chart
- ✅ Recent Activity Feed
- ✅ Alerts & Notifications Panel

### Completed (Task 11.2)
- ✅ Restaurant Table Component
- ✅ Restaurant Dialog (Create/Edit)
- ✅ Delete Restaurant Dialog
- ✅ Restaurant Details Dialog
- ✅ Restaurants Management Page
- ✅ CRUD Operations for Restaurants

### Completed (Task 11.3)
- ✅ Subscription Manager Component
- ✅ Subscription Details Dialog
- ✅ Plan Pricing Manager Component
- ✅ Plan Pricing Dialog
- ✅ Subscriptions Management Page
- ✅ Plan Configuration and Pricing

### Completed (Task 11.4)
- ✅ Platform Analytics Component
- ✅ Analytics Page with Comprehensive Statistics
- ✅ Interactive Charts and Visualizations
- ✅ Revenue, Orders, Restaurants, and Subscriptions Analytics

### Completed (Task 11.5)
- ✅ System Metrics Component
- ✅ Error Logs Component
- ✅ System Health Page

### Completed (Task 11.6)
- ✅ Notification Sender Component
- ✅ Notifications Page
- ✅ Broadcast Notification System

## Integration Notes

### Backend Integration
Currently using mock data. When backend is ready:

1. Create API service in `src/features/admin/services/`
2. Replace mock data in `AdminHome.tsx` with actual API calls
3. Use React Query for data fetching and caching

Example:
```typescript
// services/adminService.ts
export async function fetchPlatformStats() {
  const response = await fetch('/api/v1/admin/analytics/platform');
  return response.json();
}

// In component
const { data: stats, isLoading } = useQuery({
  queryKey: ['platform-stats'],
  queryFn: fetchPlatformStats,
  refetchInterval: 30000, // Refresh every 30 seconds
});
```

### Routing
Add to your router configuration:
```tsx
import { 
  AdminHome, 
  Restaurants, 
  Subscriptions, 
  Analytics, 
  SystemHealth, 
  Notifications 
} from '@/features/admin';
import { ProtectedRoute } from '@/components/auth';

<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRoles={['PLATFORM_ADMIN']}>
      <AdminHome />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/restaurants"
  element={
    <ProtectedRoute requiredRoles={['PLATFORM_ADMIN']}>
      <Restaurants />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/subscriptions"
  element={
    <ProtectedRoute requiredRoles={['PLATFORM_ADMIN']}>
      <Subscriptions />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/analytics"
  element={
    <ProtectedRoute requiredRoles={['PLATFORM_ADMIN']}>
      <Analytics />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/system-health"
  element={
    <ProtectedRoute requiredRoles={['PLATFORM_ADMIN']}>
      <SystemHealth />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/notifications"
  element={
    <ProtectedRoute requiredRoles={['PLATFORM_ADMIN']}>
      <Notifications />
    </ProtectedRoute>
  }
/>
```

### Authentication
Ensure the admin routes are protected and only accessible to users with `PLATFORM_ADMIN` role.

## Styling

- Uses shadcn/ui components (Card, Badge)
- Responsive grid layout (1 col mobile, 2 cols tablet, 4 cols desktop)
- Lucide icons for visual indicators
- Loading skeletons for better UX
- Color-coded status indicators (green=healthy, amber=warning, red=error)
- Dark mode support

## Key Features

### System Health Monitoring
- Real-time uptime tracking
- API response time monitoring
- Error rate tracking
- Active connections count

### Subscription Distribution
- Visual representation of plan distribution
- Progress bars showing percentage breakdown
- Restaurant count per plan tier

### Recent Activity
- Chronological activity feed
- Color-coded event types
- Timestamp display
- Auto-refresh capability

### Alerts & Notifications
- Severity-based color coding
- Actionable alert messages
- Badge showing active alert count
- Dismissible notifications

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live metrics
2. **Advanced Charts**: Revenue trends, growth charts, user acquisition
3. **Drill-down Analytics**: Click stats to view detailed breakdowns
4. **Export Reports**: Download platform reports as PDF/CSV
5. **Custom Dashboards**: Allow admins to customize dashboard layout
6. **Alert Management**: Configure alert thresholds and notification channels
7. **Audit Logs**: View all admin actions and system changes
8. **Performance Metrics**: Detailed performance monitoring and optimization suggestions

## API Endpoints (Future)

```
GET    /api/v1/admin/analytics/platform
GET    /api/v1/admin/system/health
GET    /api/v1/admin/subscriptions/distribution
GET    /api/v1/admin/activity/recent
GET    /api/v1/admin/alerts
POST   /api/v1/admin/alerts/:id/dismiss

# Restaurant Management
GET    /api/v1/admin/restaurants
POST   /api/v1/admin/restaurants
GET    /api/v1/admin/restaurants/:id
PATCH  /api/v1/admin/restaurants/:id
DELETE /api/v1/admin/restaurants/:id
PATCH  /api/v1/admin/restaurants/:id/status
GET    /api/v1/admin/restaurants/count

# Subscription Management
GET    /api/v1/admin/subscriptions
GET    /api/v1/admin/subscriptions/:id
POST   /api/v1/admin/subscriptions/:id/upgrade
POST   /api/v1/admin/subscriptions/:id/cancel
POST   /api/v1/admin/subscriptions/:id/renew
PATCH  /api/v1/admin/subscriptions/:id

# Plan Management
GET    /api/v1/admin/subscriptions/plans
GET    /api/v1/admin/subscriptions/plans/:id
PATCH  /api/v1/admin/subscriptions/plans/:id

# System Health
GET    /api/v1/admin/system/metrics
GET    /api/v1/admin/system/logs

# Notifications
POST   /api/v1/admin/notifications/broadcast
GET    /api/v1/admin/notifications/recent
```

## Testing

When implementing tests:
- Test loading states
- Test error handling
- Test data formatting (currency, numbers)
- Test responsive layout
- Test accessibility (ARIA labels, keyboard navigation)

## Accessibility

- Proper heading hierarchy (h1, h2, h3)
- ARIA labels for icons
- Keyboard navigation support
- Color contrast compliance (WCAG 2.1 AA)
- Screen reader friendly
