/**
 * Dashboard Stats Component
 * Displays key metrics for restaurant owner dashboard
 */

import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Star, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { DashboardStats as DashboardStatsType } from '../types';

interface DashboardStatsProps {
  stats: DashboardStatsType;
  isLoading?: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

function StatCard({ title, value, icon, trend, subtitle }: StatCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={trend.isPositive ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(trend.value)}%
              </span>
              <span className="text-muted-foreground ml-1">vs last period</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">
          {icon}
        </div>
      </div>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
          <div className="h-4 w-40 bg-muted animate-pulse rounded" />
        </div>
        <div className="w-12 h-12 bg-muted animate-pulse rounded-lg" />
      </div>
    </Card>
  );
}

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(6)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Revenue */}
      <StatCard
        title="Total Revenue"
        value={formatCurrency(stats.totalRevenue)}
        icon={<DollarSign className="w-6 h-6 text-primary" />}
        subtitle={`Today: ${formatCurrency(stats.todayRevenue)}`}
      />

      {/* Total Orders */}
      <StatCard
        title="Total Orders"
        value={stats.totalOrders.toLocaleString()}
        icon={<ShoppingBag className="w-6 h-6 text-primary" />}
        subtitle={`Today: ${stats.todayOrders}`}
      />

      {/* Average Rating */}
      <StatCard
        title="Average Rating"
        value={stats.averageRating.toFixed(1)}
        icon={<Star className="w-6 h-6 text-primary" />}
        subtitle="Based on customer feedback"
      />

      {/* Active Orders */}
      <StatCard
        title="Active Orders"
        value={stats.activeOrders}
        icon={<Clock className="w-6 h-6 text-primary" />}
        subtitle="Currently in progress"
      />

      {/* Week Revenue */}
      <StatCard
        title="This Week"
        value={formatCurrency(stats.weekRevenue)}
        icon={<DollarSign className="w-6 h-6 text-primary" />}
        subtitle={`${stats.weekOrders} orders`}
      />

      {/* Month Revenue */}
      <StatCard
        title="This Month"
        value={formatCurrency(stats.monthRevenue)}
        icon={<DollarSign className="w-6 h-6 text-primary" />}
        subtitle={`${stats.monthOrders} orders`}
      />
    </div>
  );
}
