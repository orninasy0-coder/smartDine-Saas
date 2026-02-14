/**
 * Platform Analytics Page
 * Displays comprehensive platform-wide analytics and insights
 */

import { useEffect, useState } from 'react';
import { Container } from '@/components/common/Container';
import { Section } from '@/components/common/Section';
import { PlatformAnalytics } from '../components/PlatformAnalytics';
import { PlatformAnalyticsData } from '../types';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<PlatformAnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch('/api/v1/admin/analytics/platform');
      // const data = await response.json();

      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data for demonstration
      const mockData: PlatformAnalyticsData = {
        revenue: {
          current: 1245680,
          previous: 1089450,
          trend: 14.3,
          daily: [
            { date: '2024-01-01', amount: 165000 },
            { date: '2024-01-02', amount: 178000 },
            { date: '2024-01-03', amount: 172000 },
            { date: '2024-01-04', amount: 185000 },
            { date: '2024-01-05', amount: 195000 },
            { date: '2024-01-06', amount: 182000 },
            { date: '2024-01-07', amount: 168680 },
          ],
          monthly: [
            { month: 'Jan', amount: 980000 },
            { month: 'Feb', amount: 1050000 },
            { month: 'Mar', amount: 1020000 },
            { month: 'Apr', amount: 1120000 },
            { month: 'May', amount: 1180000 },
            { month: 'Jun', amount: 1245680 },
          ],
        },
        orders: {
          current: 45892,
          previous: 41250,
          trend: 11.3,
          daily: [
            { date: '2024-01-01', count: 6200 },
            { date: '2024-01-02', count: 6800 },
            { date: '2024-01-03', count: 6500 },
            { date: '2024-01-04', count: 7100 },
            { date: '2024-01-05', count: 7500 },
            { date: '2024-01-06', count: 6900 },
            { date: '2024-01-07', count: 4892 },
          ],
          byStatus: [
            { status: 'Completed', count: 32124, percentage: 70 },
            { status: 'In Progress', count: 6884, percentage: 15 },
            { status: 'Pending', count: 4589, percentage: 10 },
            { status: 'Cancelled', count: 2295, percentage: 5 },
          ],
        },
        restaurants: {
          total: 156,
          active: 142,
          new: 14,
          churnRate: 2.8,
          growth: [
            { month: 'Jan', count: 120 },
            { month: 'Feb', count: 128 },
            { month: 'Mar', count: 135 },
            { month: 'Apr', count: 142 },
            { month: 'May', count: 149 },
            { month: 'Jun', count: 156 },
          ],
        },
        subscriptions: {
          active: 142,
          trial: 14,
          cancelled: 8,
          mrr: 456780,
          byPlan: [
            { plan: 'Basic', count: 45, revenue: 89550 },
            { plan: 'Pro', count: 78, revenue: 273780 },
            { plan: 'Enterprise', count: 19, revenue: 93450 },
          ],
        },
        topRestaurants: [
          {
            id: '1',
            name: 'The Golden Fork',
            revenue: 125000,
            orders: 2450,
            growth: 18.5,
          },
          {
            id: '2',
            name: 'Bella Italia',
            revenue: 112000,
            orders: 2280,
            growth: 15.2,
          },
          {
            id: '3',
            name: 'Sushi Master',
            revenue: 98000,
            orders: 1950,
            growth: 12.8,
          },
          {
            id: '4',
            name: 'Burger Palace',
            revenue: 87000,
            orders: 1820,
            growth: 10.5,
          },
          {
            id: '5',
            name: 'Spice Garden',
            revenue: 76000,
            orders: 1650,
            growth: -3.2,
          },
        ],
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchAnalytics();
      toast.success('Analytics data refreshed');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    toast.info('Export functionality coming soon');
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Container>
        <Section>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Platform Analytics</h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive insights and metrics across the entire platform.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Analytics Component */}
          <PlatformAnalytics data={analyticsData!} isLoading={isLoading} />
        </Section>
      </Container>
    </div>
  );
}
