/**
 * Platform Admin Dashboard Types
 */

export interface PlatformStats {
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

export interface SubscriptionDistribution {
  basic: number;
  pro: number;
  enterprise: number;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  apiLatency: number;
  errorRate: number;
}

export type SubscriptionPlan = 'BASIC' | 'PRO' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'GRACE_PERIOD';

export interface Restaurant {
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

export interface CreateRestaurantInput {
  name: string;
  slug: string;
  address: string;
  phone: string;
  email: string;
  subscriptionPlan: SubscriptionPlan;
}

export interface UpdateRestaurantInput {
  name?: string;
  slug?: string;
  address?: string;
  phone?: string;
  email?: string;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionStatus?: SubscriptionStatus;
}

export interface Subscription {
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

export interface PlanPricing {
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

export interface PlatformAnalyticsData {
  revenue: {
    current: number;
    previous: number;
    trend: number;
    daily: Array<{ date: string; amount: number }>;
    monthly: Array<{ month: string; amount: number }>;
  };
  orders: {
    current: number;
    previous: number;
    trend: number;
    daily: Array<{ date: string; count: number }>;
    byStatus: Array<{ status: string; count: number; percentage: number }>;
  };
  restaurants: {
    total: number;
    active: number;
    new: number;
    churnRate: number;
    growth: Array<{ month: string; count: number }>;
  };
  subscriptions: {
    active: number;
    trial: number;
    cancelled: number;
    mrr: number;
    byPlan: Array<{ plan: string; count: number; revenue: number }>;
  };
  topRestaurants: Array<{
    id: string;
    name: string;
    revenue: number;
    orders: number;
    growth: number;
  }>;
}

export interface SystemMetricsData {
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  apiLatency: number;
  errorRate: number;
  activeConnections: number;
  requestsPerMinute: number;
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  database: {
    connections: number;
    maxConnections: number;
    queryTime: number;
    status: 'healthy' | 'degraded' | 'down';
  };
  cache: {
    hitRate: number;
    memoryUsed: number;
    status: 'healthy' | 'degraded' | 'down';
  };
  lastUpdated: string;
}

export type LogLevel = 'error' | 'warning' | 'info' | 'critical';

export interface ErrorLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  source: string;
  stackTrace?: string;
  userId?: string;
  requestId?: string;
  metadata?: Record<string, any>;
}
