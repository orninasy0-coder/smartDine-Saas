/**
 * Order Volume Chart Component
 * Displays order volume trends over time using a bar chart
 */

import { Card } from '@/components/ui/card';
import type { OrderVolumeData } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ShoppingBag } from 'lucide-react';

interface OrderVolumeChartProps {
  data: OrderVolumeData[];
  isLoading?: boolean;
}

function ChartSkeleton() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-[300px] bg-muted animate-pulse rounded" />
      </div>
    </Card>
  );
}

export function OrderVolumeChart({ data, isLoading }: OrderVolumeChartProps) {
  if (isLoading) {
    return <ChartSkeleton />;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);
  const averageOrders = data.length > 0 ? Math.round(totalOrders / data.length) : 0;
  const peakOrders = data.length > 0 ? Math.max(...data.map((d) => d.orders)) : 0;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Order Volume</h3>
              <p className="text-sm text-muted-foreground">
                Total: {totalOrders.toLocaleString()} | Avg: {averageOrders} | Peak: {peakOrders}
              </p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[300px] w-full">
          {data.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No order data available for this period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  className="text-xs"
                />
                <YAxis
                  className="text-xs"
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(value: number | undefined) => value !== undefined ? [value, 'Orders'] : ['', '']}
                  labelFormatter={(label: any) => typeof label === 'string' ? formatDate(label) : String(label)}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="orders"
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                  name="Orders"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </Card>
  );
}
