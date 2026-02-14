/**
 * Platform Analytics Component
 * Displays comprehensive analytics and charts for platform-wide metrics
 */

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Activity,
  Calendar,
  BarChart3,
} from 'lucide-react';

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

interface PlatformAnalyticsProps {
  data: PlatformAnalyticsData;
  isLoading?: boolean;
}

function MetricCard({
  title,
  value,
  subtitle,
  trend,
  icon,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; isPositive: boolean };
  icon: React.ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
              )}
              <span
                className={trend.isPositive ? 'text-green-500' : 'text-red-500'}
              >
                {Math.abs(trend.value)}%
              </span>
              <span className="text-muted-foreground ml-1">vs last period</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">{icon}</div>
      </div>
    </Card>
  );
}

function RevenueChart({ data }: { data: Array<{ date: string; amount: number }> }) {
  const maxAmount = Math.max(...data.map((d) => d.amount));

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between h-64 gap-2">
        {data.map((item, index) => {
          const height = (item.amount / maxAmount) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center h-full">
                <div
                  className="w-full bg-primary rounded-t-md hover:bg-primary/80 transition-colors cursor-pointer relative group"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover border rounded px-2 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${item.amount.toLocaleString()}
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(item.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MonthlyRevenueChart({
  data,
}: {
  data: Array<{ month: string; amount: number }>;
}) {
  const maxAmount = Math.max(...data.map((d) => d.amount));

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between h-64 gap-3">
        {data.map((item, index) => {
          const height = (item.amount / maxAmount) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center h-full">
                <div
                  className="w-full bg-purple-500 rounded-t-md hover:bg-purple-400 transition-colors cursor-pointer relative group"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover border rounded px-2 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${item.amount.toLocaleString()}
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrdersChart({ data }: { data: Array<{ date: string; count: number }> }) {
  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between h-64 gap-2">
        {data.map((item, index) => {
          const height = (item.count / maxCount) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center h-full">
                <div
                  className="w-full bg-blue-500 rounded-t-md hover:bg-blue-400 transition-colors cursor-pointer relative group"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover border rounded px-2 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.count.toLocaleString()} orders
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(item.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderStatusChart({
  data,
}: {
  data: Array<{ status: string; count: number; percentage: number }>;
}) {
  const colors = [
    'bg-green-500',
    'bg-blue-500',
    'bg-amber-500',
    'bg-purple-500',
    'bg-red-500',
  ];

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={item.status} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{item.status}</span>
            <span className="text-muted-foreground">
              {item.count.toLocaleString()} ({item.percentage}%)
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className={`${colors[index % colors.length]} h-3 rounded-full transition-all`}
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function RestaurantGrowthChart({
  data,
}: {
  data: Array<{ month: string; count: number }>;
}) {
  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between h-64 gap-3">
        {data.map((item, index) => {
          const height = (item.count / maxCount) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center h-full">
                <div
                  className="w-full bg-emerald-500 rounded-t-md hover:bg-emerald-400 transition-colors cursor-pointer relative group"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover border rounded px-2 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.count} restaurants
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SubscriptionPlanChart({
  data,
}: {
  data: Array<{ plan: string; count: number; revenue: number }>;
}) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const percentage = (item.revenue / totalRevenue) * 100;
        return (
          <div key={item.plan} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.plan}</p>
                <p className="text-xs text-muted-foreground">
                  {item.count} subscriptions
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">
                  ${item.revenue.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {percentage.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-primary/60 h-2 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TopRestaurantsTable({
  data,
}: {
  data: Array<{
    id: string;
    name: string;
    revenue: number;
    orders: number;
    growth: number;
  }>;
}) {
  return (
    <div className="space-y-3">
      {data.map((restaurant, index) => (
        <div
          key={restaurant.id}
          className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
              {index + 1}
            </div>
            <div>
              <p className="font-medium">{restaurant.name}</p>
              <p className="text-sm text-muted-foreground">
                {restaurant.orders.toLocaleString()} orders
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold">${restaurant.revenue.toLocaleString()}</p>
            <div className="flex items-center justify-end gap-1 text-sm">
              {restaurant.growth >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500" />
              )}
              <span
                className={
                  restaurant.growth >= 0 ? 'text-green-500' : 'text-red-500'
                }
              >
                {Math.abs(restaurant.growth)}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-3">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-8 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-40 bg-muted animate-pulse rounded" />
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <div className="h-64 bg-muted animate-pulse rounded" />
      </Card>
    </div>
  );
}

export function PlatformAnalytics({ data, isLoading }: PlatformAnalyticsProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const revenueTrend = {
    value: data.revenue.trend,
    isPositive: data.revenue.trend >= 0,
  };

  const ordersTrend = {
    value: data.orders.trend,
    isPositive: data.orders.trend >= 0,
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(data.revenue.current)}
          subtitle={`Previous: ${formatCurrency(data.revenue.previous)}`}
          trend={revenueTrend}
          icon={<DollarSign className="w-6 h-6 text-primary" />}
        />
        <MetricCard
          title="Total Orders"
          value={data.orders.current.toLocaleString()}
          subtitle={`Previous: ${data.orders.previous.toLocaleString()}`}
          trend={ordersTrend}
          icon={<ShoppingBag className="w-6 h-6 text-primary" />}
        />
        <MetricCard
          title="Active Restaurants"
          value={data.restaurants.active}
          subtitle={`${data.restaurants.new} new this month`}
          icon={<Users className="w-6 h-6 text-primary" />}
        />
        <MetricCard
          title="Monthly Recurring Revenue"
          value={formatCurrency(data.subscriptions.mrr)}
          subtitle={`${data.subscriptions.active} active subscriptions`}
          icon={<Activity className="w-6 h-6 text-primary" />}
        />
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">
            <DollarSign className="w-4 h-4 mr-2" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="orders">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="restaurants">
            <Users className="w-4 h-4 mr-2" />
            Restaurants
          </TabsTrigger>
          <TabsTrigger value="subscriptions">
            <BarChart3 className="w-4 h-4 mr-2" />
            Subscriptions
          </TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Daily Revenue (Last 7 Days)</h3>
                <Calendar className="w-5 h-5 text-muted-foreground" />
              </div>
              <RevenueChart data={data.revenue.daily} />
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Monthly Revenue Trend</h3>
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
              </div>
              <MonthlyRevenueChart data={data.revenue.monthly} />
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Daily Orders (Last 7 Days)</h3>
                <Calendar className="w-5 h-5 text-muted-foreground" />
              </div>
              <OrdersChart data={data.orders.daily} />
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Orders by Status</h3>
                <Activity className="w-5 h-5 text-muted-foreground" />
              </div>
              <OrderStatusChart data={data.orders.byStatus} />
            </Card>
          </div>
        </TabsContent>

        {/* Restaurants Tab */}
        <TabsContent value="restaurants" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Restaurant Growth</h3>
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
              </div>
              <RestaurantGrowthChart data={data.restaurants.growth} />
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{data.restaurants.total}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">Churn Rate</p>
                  <p className="text-2xl font-bold">{data.restaurants.churnRate}%</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Top Performing Restaurants</h3>
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
              </div>
              <TopRestaurantsTable data={data.topRestaurants} />
            </Card>
          </div>
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Revenue by Plan</h3>
                <DollarSign className="w-5 h-5 text-muted-foreground" />
              </div>
              <SubscriptionPlanChart data={data.subscriptions.byPlan} />
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Subscription Overview</h3>
                <Activity className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                  <p className="text-3xl font-bold mt-1">
                    {data.subscriptions.active}
                  </p>
                </div>
                <div className="p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground">Trial Subscriptions</p>
                  <p className="text-3xl font-bold mt-1">
                    {data.subscriptions.trial}
                  </p>
                </div>
                <div className="p-4 rounded-lg border">
                  <p className="text-sm text-muted-foreground">
                    Cancelled This Month
                  </p>
                  <p className="text-3xl font-bold mt-1">
                    {data.subscriptions.cancelled}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
