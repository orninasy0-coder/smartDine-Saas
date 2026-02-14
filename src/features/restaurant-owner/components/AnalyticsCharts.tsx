/**
 * Analytics Charts Component
 * Container component for all analytics visualizations
 */

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnalyticsData, AnalyticsPeriodOption } from '../types';
import { RevenueChart } from './RevenueChart';
import { OrderVolumeChart } from './OrderVolumeChart';
import { TopDishesDisplay } from './TopDishesDisplay';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AnalyticsChartsProps {
  data: AnalyticsData;
  isLoading?: boolean;
  onPeriodChange?: (period: AnalyticsPeriodOption['value']) => void;
}

const PERIOD_OPTIONS: AnalyticsPeriodOption[] = [
  { label: 'Last 7 Days', value: 'week' },
  { label: 'Last 30 Days', value: 'month' },
  { label: 'Last 12 Months', value: 'year' },
];

export function AnalyticsCharts({ data, isLoading, onPeriodChange }: AnalyticsChartsProps) {
  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <Select
          value={data.period}
          onValueChange={(value) => onPeriodChange?.(value as AnalyticsPeriodOption['value'])}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="dishes">Top Dishes</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <RevenueChart data={data.revenueData} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <OrderVolumeChart data={data.orderVolumeData} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="dishes" className="space-y-4">
          <TopDishesDisplay dishes={data.topDishes} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
