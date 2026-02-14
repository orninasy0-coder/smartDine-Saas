/**
 * Platform Admin Dashboard Home Page
 * Main dashboard view with platform-wide statistics and metrics
 */

import { useEffect, useState } from 'react';
import { PlatformStats } from '../components/PlatformStats';
import { PlatformStats as PlatformStatsType } from '../types';
import { Container } from '@/components/common/Container';
import { Section } from '@/components/common/Section';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';

export function AdminHome() {
  const [stats, setStats] = useState<PlatformStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch platform stats
    // TODO: Replace with actual API call when backend is ready
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Simulated API call - replace with actual implementation
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data for demonstration
        const mockStats: PlatformStatsType = {
          totalRestaurants: 156,
          activeRestaurants: 142,
          totalRevenue: 1245680,
          totalOrders: 45892,
          activeSubscriptions: 142,
          trialSubscriptions: 14,
          todayRevenue: 12450,
          todayOrders: 487,
          weekRevenue: 89750,
          weekOrders: 3421,
          monthRevenue: 345280,
          monthOrders: 12847,
        };

        setStats(mockStats);
      } catch (error) {
        console.error('Failed to fetch platform stats:', error);
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
            <h1 className="text-3xl font-bold">Platform Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Monitor and manage the entire SmartDine platform.
            </p>
          </div>

          {/* Stats Grid */}
          <PlatformStats stats={stats!} isLoading={isLoading} />

          {/* Additional sections */}
          {!isLoading && stats && (
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Health */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">System Health</h3>
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Healthy
                  </Badge>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">API Uptime</span>
                    <span className="text-sm font-medium">99.98%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg Response Time</span>
                    <span className="text-sm font-medium">124ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Error Rate</span>
                    <span className="text-sm font-medium">0.02%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Connections</span>
                    <span className="text-sm font-medium">1,247</span>
                  </div>
                </div>
              </Card>

              {/* Subscription Distribution */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Subscription Distribution</h3>
                  <Activity className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Basic Plan</span>
                      <span className="text-sm font-medium">45 restaurants</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: '32%' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Pro Plan</span>
                      <span className="text-sm font-medium">78 restaurants</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: '55%' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Enterprise Plan</span>
                      <span className="text-sm font-medium">19 restaurants</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: '13%' }}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                    <div className="flex-1">
                      <p className="text-sm">New restaurant registered</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    <div className="flex-1">
                      <p className="text-sm">Subscription upgraded to Pro</p>
                      <p className="text-xs text-muted-foreground">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
                    <div className="flex-1">
                      <p className="text-sm">Payment failed - retry scheduled</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                    <div className="flex-1">
                      <p className="text-sm">System backup completed</p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Alerts & Notifications */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Alerts & Notifications</h3>
                  <Badge variant="secondary">3 Active</Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">High API latency detected</p>
                      <p className="text-xs text-muted-foreground">
                        Response time increased by 45% in the last hour
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">5 subscriptions expiring soon</p>
                      <p className="text-xs text-muted-foreground">
                        Renewal reminders sent automatically
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Database backup successful</p>
                      <p className="text-xs text-muted-foreground">
                        All data backed up to secure storage
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </Section>
      </Container>
    </div>
  );
}
