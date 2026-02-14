/**
 * Analytics Charts Example
 * Demonstrates usage of the analytics components
 */

import { AnalyticsCharts } from './AnalyticsCharts';
import { AnalyticsData } from '../types';

// Example data
const exampleAnalyticsData: AnalyticsData = {
  revenueData: [
    { date: '2024-01-01', revenue: 1200 },
    { date: '2024-01-02', revenue: 1500 },
    { date: '2024-01-03', revenue: 1800 },
    { date: '2024-01-04', revenue: 1400 },
    { date: '2024-01-05', revenue: 2100 },
    { date: '2024-01-06', revenue: 2400 },
    { date: '2024-01-07', revenue: 1900 },
  ],
  orderVolumeData: [
    { date: '2024-01-01', orders: 25 },
    { date: '2024-01-02', orders: 32 },
    { date: '2024-01-03', orders: 38 },
    { date: '2024-01-04', orders: 28 },
    { date: '2024-01-05', orders: 45 },
    { date: '2024-01-06', orders: 52 },
    { date: '2024-01-07', orders: 41 },
  ],
  topDishes: [
    {
      id: '1',
      name: 'Grilled Salmon',
      orders: 145,
      revenue: 2175,
      imageUrl: '/images/CHEF.png',
    },
    {
      id: '2',
      name: 'Margherita Pizza',
      orders: 132,
      revenue: 1584,
    },
    {
      id: '3',
      name: 'Caesar Salad',
      orders: 98,
      revenue: 882,
    },
  ],
  period: 'week',
};

export function AnalyticsChartsExample() {
  const handlePeriodChange = (period: 'week' | 'month' | 'year') => {
    console.log('Period changed to:', period);
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Analytics Charts Example</h2>
        <p className="text-muted-foreground">
          Interactive analytics dashboard with revenue, orders, and top dishes
        </p>
      </div>

      <AnalyticsCharts
        data={exampleAnalyticsData}
        onPeriodChange={handlePeriodChange}
      />

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Loading State</h3>
        <AnalyticsCharts
          data={exampleAnalyticsData}
          isLoading={true}
        />
      </div>
    </div>
  );
}

export default AnalyticsChartsExample;
