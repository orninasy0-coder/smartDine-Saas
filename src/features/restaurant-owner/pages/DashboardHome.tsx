/**
 * Restaurant Owner Dashboard Home Page
 * Main dashboard view with key statistics and metrics
 */

import { useEffect, useState } from 'react';
import { DashboardStats } from '../components/DashboardStats';
import { DashboardStats as DashboardStatsType } from '../types';
import { Container } from '@/components/common/Container';
import { Section } from '@/components/common/Section';

export function DashboardHome() {
  const [stats, setStats] = useState<DashboardStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats
    // TODO: Replace with actual API call when backend is ready
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Simulated API call - replace with actual implementation
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        const mockStats: DashboardStatsType = {
          totalRevenue: 45280,
          totalOrders: 1247,
          averageRating: 4.6,
          activeOrders: 12,
          todayRevenue: 3420,
          todayOrders: 45,
          weekRevenue: 18950,
          weekOrders: 287,
          monthRevenue: 45280,
          monthOrders: 1247,
        };

        setStats(mockStats);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Container>
        <Section>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back! Here's an overview of your restaurant's performance.
            </p>
          </div>

          {/* Stats Grid */}
          <DashboardStats stats={stats!} isLoading={isLoading} />

          {/* Additional sections can be added here */}
          {!isLoading && stats && (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Placeholder for future charts/widgets */}
              <div className="p-6 border rounded-lg bg-card">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <p className="text-sm text-muted-foreground">
                  Charts and recent orders will be displayed here.
                </p>
              </div>

              <div className="p-6 border rounded-lg bg-card">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <p className="text-sm text-muted-foreground">
                  Quick action buttons will be displayed here.
                </p>
              </div>
            </div>
          )}
        </Section>
      </Container>
    </div>
  );
}
