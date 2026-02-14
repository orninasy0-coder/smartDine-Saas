/**
 * System Health Page
 * Displays system metrics and error logs for platform monitoring
 */

import { useEffect, useState } from 'react';
import { Container } from '@/components/common/Container';
import { Section } from '@/components/common/Section';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SystemMetrics, SystemMetricsData } from '../components/SystemMetrics';
import { ErrorLogs, ErrorLog } from '../components/ErrorLogs';
import { Activity, AlertCircle } from 'lucide-react';

export function SystemHealth() {
  const [metricsData, setMetricsData] = useState<SystemMetricsData | null>(null);
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  useEffect(() => {
    fetchSystemMetrics();
    fetchErrorLogs();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchSystemMetrics();
      fetchErrorLogs();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchSystemMetrics = async () => {
    setIsLoadingMetrics(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data for demonstration
      const mockMetrics: SystemMetricsData = {
        status: 'healthy',
        uptime: 2592000, // 30 days
        apiLatency: 124,
        errorRate: 0.02,
        activeConnections: 1247,
        requestsPerMinute: 3450,
        cpu: {
          usage: 45.5,
          cores: 8,
        },
        memory: {
          used: 12800,
          total: 32768,
          percentage: 39.1,
        },
        database: {
          connections: 45,
          maxConnections: 100,
          queryTime: 15,
          status: 'healthy',
        },
        cache: {
          hitRate: 94.5,
          memoryUsed: 2048,
          status: 'healthy',
        },
        lastUpdated: new Date().toISOString(),
      };

      setMetricsData(mockMetrics);
    } catch (error) {
      console.error('Failed to fetch system metrics:', error);
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  const fetchErrorLogs = async () => {
    setIsLoadingLogs(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data for demonstration
      const mockLogs: ErrorLog[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          level: 'critical',
          message: 'Database connection pool exhausted',
          source: 'database',
          stackTrace:
            'Error: Connection pool exhausted\n  at Pool.acquire (pool.ts:123)\n  at Database.query (db.ts:45)',
          requestId: 'req-abc123',
          metadata: {
            poolSize: 100,
            activeConnections: 100,
            waitingRequests: 25,
          },
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          level: 'error',
          message: 'Payment gateway timeout',
          source: 'payment',
          requestId: 'req-def456',
          userId: 'user-789',
          metadata: {
            gateway: 'stripe',
            amount: 99.99,
            currency: 'USD',
          },
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          level: 'warning',
          message: 'High memory usage detected on server-02',
          source: 'monitoring',
          metadata: {
            server: 'server-02',
            memoryUsage: 87.5,
            threshold: 85,
          },
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          level: 'error',
          message: 'Failed to send email notification',
          source: 'email',
          stackTrace:
            'Error: SMTP connection failed\n  at EmailService.send (email.ts:67)',
          requestId: 'req-ghi789',
          metadata: {
            recipient: 'user@example.com',
            template: 'subscription-renewal',
          },
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          level: 'warning',
          message: 'API rate limit exceeded for tenant',
          source: 'api-gateway',
          requestId: 'req-jkl012',
          metadata: {
            tenantId: 'tenant-123',
            endpoint: '/api/v1/orders',
            limit: 1000,
            requests: 1247,
          },
        },
        {
          id: '6',
          timestamp: new Date(Date.now() - 2400000).toISOString(),
          level: 'info',
          message: 'Database backup completed successfully',
          source: 'backup',
          metadata: {
            backupSize: '2.4 GB',
            duration: '12 minutes',
            location: 's3://backups/2024-01-15',
          },
        },
        {
          id: '7',
          timestamp: new Date(Date.now() - 3000000).toISOString(),
          level: 'error',
          message: 'Redis cache connection lost',
          source: 'cache',
          stackTrace:
            'Error: Connection refused\n  at Redis.connect (redis.ts:89)',
          metadata: {
            host: 'redis-primary',
            port: 6379,
            retryAttempt: 3,
          },
        },
        {
          id: '8',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          level: 'warning',
          message: 'Slow query detected',
          source: 'database',
          requestId: 'req-mno345',
          metadata: {
            query: 'SELECT * FROM orders WHERE...',
            executionTime: 5420,
            threshold: 1000,
          },
        },
      ];

      setLogs(mockLogs);
    } catch (error) {
      console.error('Failed to fetch error logs:', error);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleExportLogs = () => {
    // TODO: Implement log export functionality
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-logs-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Container>
        <Section>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">System Health</h1>
            <p className="text-muted-foreground mt-2">
              Monitor system performance, metrics, and error logs.
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="metrics" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="metrics">
                <Activity className="w-4 h-4 mr-2" />
                System Metrics
              </TabsTrigger>
              <TabsTrigger value="logs">
                <AlertCircle className="w-4 h-4 mr-2" />
                Error Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="metrics">
              {metricsData && (
                <SystemMetrics data={metricsData} isLoading={isLoadingMetrics} />
              )}
            </TabsContent>

            <TabsContent value="logs">
              <ErrorLogs
                logs={logs}
                isLoading={isLoadingLogs}
                onRefresh={fetchErrorLogs}
                onExport={handleExportLogs}
              />
            </TabsContent>
          </Tabs>
        </Section>
      </Container>
    </div>
  );
}
