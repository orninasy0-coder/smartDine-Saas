/**
 * Platform Admin Dashboard Feature
 * Exports all admin-related components and pages
 */

// Pages
export { AdminHome } from './pages/AdminHome';
export { Restaurants } from './pages/Restaurants';
export { Subscriptions } from './pages/Subscriptions';
export { Analytics } from './pages/Analytics';
export { SystemHealth } from './pages/SystemHealth';
export { Notifications } from './pages/Notifications';

// Components
export { PlatformStats } from './components/PlatformStats';
export { PlatformAnalytics } from './components/PlatformAnalytics';
export { RestaurantTable } from './components/RestaurantTable';
export { RestaurantDialog } from './components/RestaurantDialog';
export { DeleteRestaurantDialog } from './components/DeleteRestaurantDialog';
export { RestaurantDetailsDialog } from './components/RestaurantDetailsDialog';
export { SubscriptionManager } from './components/SubscriptionManager';
export { SubscriptionDetailsDialog } from './components/SubscriptionDetailsDialog';
export { PlanPricingManager } from './components/PlanPricingManager';
export { PlanPricingDialog } from './components/PlanPricingDialog';
export { SystemMetrics } from './components/SystemMetrics';
export { ErrorLogs } from './components/ErrorLogs';
export { NotificationSender } from './components/NotificationSender';

// Types
export type {
  PlatformStats as PlatformStatsType,
  SubscriptionDistribution,
  SystemHealth,
  Restaurant,
  CreateRestaurantInput,
  UpdateRestaurantInput,
  SubscriptionPlan,
  SubscriptionStatus,
  Subscription,
  PlanPricing,
  PlatformAnalyticsData,
  SystemMetricsData,
  LogLevel,
  ErrorLog,
} from './types';
