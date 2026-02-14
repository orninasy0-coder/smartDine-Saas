/**
 * Analytics Page
 * Displays comprehensive analytics for restaurant owners
 */

import { useState } from 'react';
import { Container } from '@/components/common';
import { AnalyticsCharts } from '../components/AnalyticsCharts';
import type { AnalyticsData, AnalyticsPeriodOption } from '../types';

// Mock data generator for development
function generateMockAnalyticsData(period: AnalyticsPeriodOption['value']): AnalyticsData {
  const days = period === 'week' ? 7 : period === 'month' ? 30 : 365;
  const dataPoints = period === 'year' ? 12 : days;

  const revenueData = Array.from({ length: dataPoints }, (_, i) => {
    const date = new Date();
    if (period === 'year') {
      date.setMonth(date.getMonth() - (dataPoints - 1 - i));
    } else {
      date.setDate(date.getDate() - (dataPoints - 1 - i));
    }
    return {
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 5000) + 1000,
    };
  });

  const orderVolumeData = Array.from({ length: dataPoints }, (_, i) => {
    const date = new Date();
    if (period === 'year') {
      date.setMonth(date.getMonth() - (dataPoints - 1 - i));
    } else {
      date.setDate(date.getDate() - (dataPoints - 1 - i));
    }
    return {
      date: date.toISOString().split('T')[0],
      orders: Math.floor(Math.random() * 50) + 10,
    };
  });

  const topDishes = [
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
      imageUrl: '/images/CHEF.png',
    },
    {
      id: '3',
      name: 'Caesar Salad',
      orders: 98,
      revenue: 882,
      imageUrl: '/images/CHEF.png',
    },
    {
      id: '4',
      name: 'Beef Burger',
      orders: 87,
      revenue: 1131,
      imageUrl: '/images/CHEF.png',
    },
    {
      id: '5',
      name: 'Chocolate Cake',
      orders: 76,
      revenue: 532,
      imageUrl: '/images/CHEF.png',
    },
  ];

  return {
    revenueData,
    orderVolumeData,
    topDishes,
    period,
  };
}

export function Analytics() {
  const [period, setPeriod] = useState<AnalyticsPeriodOption['value']>('week');
  const [isLoading, setIsLoading] = useState(false);

  // Generate mock data based on selected period
  const analyticsData = generateMockAnalyticsData(period);

  const handlePeriodChange = (newPeriod: AnalyticsPeriodOption['value']) => {
    setIsLoading(true);
    setPeriod(newPeriod);
    // Simulate API call delay
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <Container>
      <div className="space-y-6 py-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Track your restaurant's performance with detailed insights
          </p>
        </div>

        {/* Analytics Charts */}
        <AnalyticsCharts
          data={analyticsData}
          isLoading={isLoading}
          onPeriodChange={handlePeriodChange}
        />
      </div>
    </Container>
  );
}
