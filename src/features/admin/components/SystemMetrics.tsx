/**
 * System Metrics Component
 * Displays real-time system health metrics and performance indicators
 */

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  Server,
  Database,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Cpu,
  HardDrive,
  Network,
} from 'lucide-react';

export interface SystemMetricsData {
  status: 'healthy' | 'degraded' | 'down';
  uptime: number; // in seconds
  apiLatency: number; // in milliseconds
  errorRate: number; // percentage
  activeConnections: number;
  requestsPerMinute: number;
  cpu: {
    usage: number; // percentage
    cores: number;
  };
  memory: {
    used: number; // in MB
    total: number; // in MB
    percentage: number;
  };
  database: {
    connections: number;
    maxConnections: number;
    queryTime: number; // average in ms
    status: 'healthy' | 'degraded' | 'down';
  };
  cache: {
    hitRate: number; // percentage
    memoryUsed: number; // in MB
    status: 'healthy' | 'degraded' | 'down';
  };
  lastUpdated: string;
}

interface SystemMetricsProps {
  data: SystemMetricsData;
  isLoading?: boolean;
}

function StatusBadge({ status }: { status: 'healthy' | 'degraded' | 'down' }) {
  const variants = {
    healthy: {
      variant: 'default' as const,
      className: 'bg-green-500 hover:bg-green-600',
      icon: CheckCircle,
      label: 'Healthy',
    },
    degraded: {
      variant: 'secondary' as const,
      className: 'bg-amber-500 hover:bg-amber-600',
      icon: AlertTriangle,
      label: 'Degraded',
    },
    down: {
      variant: 'destructive' as const,
      className: 'bg-red-500 hover:bg-red-600',
      icon: XCircle,
      label: 'Down',
    },
  };

  const config = variants[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}

function MetricCard({
  title,
  value,
  unit,
  icon,
  status,
  subtitle,
  trend,
}: {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  status?: 'good' | 'warning' | 'critical';
  subtitle?: string;
  trend?: { value: number; isPositive: boolean };
}) {
  const statusColors = {
    good: 'text-green-500',
    warning: 'text-amber-500',
    critical: 'text-red-500',
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
          </div>
          <div className="flex items-baseline gap-1">
            <h3
              className={`text-2xl font-bold ${
                status ? statusColors[status] : ''
              }`}
            >
              {value}
            </h3>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2 text-xs">
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
              )}
              <span
                className={trend.isPositive ? 'text-green-500' : 'text-red-500'}
              >
                {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function ProgressBar({
  value,
  max,
  status,
}: {
  value: number;
  max: number;
  status: 'good' | 'warning' | 'critical';
}) {
  const percentage = (value / max) * 100;
  const colors = {
    good: 'bg-green-500',
    warning: 'bg-amber-500',
    critical: 'bg-red-500',
  };

  return (
    <div className="w-full bg-muted rounded-full h-2">
      <div
        className={`${colors[status]} h-2 rounded-full transition-all`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export function SystemMetrics({ data, isLoading }: SystemMetricsProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const getLatencyStatus = (latency: number): 'good' | 'warning' | 'critical' => {
    if (latency < 200) return 'good';
    if (latency < 500) return 'warning';
    return 'critical';
  };

  const getErrorRateStatus = (rate: number): 'good' | 'warning' | 'critical' => {
    if (rate < 0.1) return 'good';
    if (rate < 1) return 'warning';
    return 'critical';
  };

  const getCpuStatus = (usage: number): 'good' | 'warning' | 'critical' => {
    if (usage < 70) return 'good';
    if (usage < 85) return 'warning';
    return 'critical';
  };

  const getMemoryStatus = (percentage: number): 'good' | 'warning' | 'critical' => {
    if (percentage < 70) return 'good';
    if (percentage < 85) return 'warning';
    return 'critical';
  };

  return (
    <div className="space-y-6">
      {/* Overall System Status */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">System Health Overview</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Last updated: {new Date(data.lastUpdated).toLocaleString()}
            </p>
          </div>
          <StatusBadge status={data.status} />
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="API Uptime"
            value={formatUptime(data.uptime)}
            icon={<Clock className="w-5 h-5 text-primary" />}
            subtitle={`${((data.uptime / (30 * 24 * 3600)) * 100).toFixed(2)}% (30 days)`}
            status="good"
          />
          <MetricCard
            title="Avg Response Time"
            value={data.apiLatency}
            unit="ms"
            icon={<Zap className="w-5 h-5 text-primary" />}
            status={getLatencyStatus(data.apiLatency)}
          />
          <MetricCard
            title="Error Rate"
            value={data.errorRate.toFixed(2)}
            unit="%"
            icon={<AlertTriangle className="w-5 h-5 text-primary" />}
            status={getErrorRateStatus(data.errorRate)}
          />
          <MetricCard
            title="Active Connections"
            value={data.activeConnections.toLocaleString()}
            icon={<Network className="w-5 h-5 text-primary" />}
            subtitle={`${data.requestsPerMinute} req/min`}
            status="good"
          />
        </div>
      </Card>

      {/* Resource Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU & Memory */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Server className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Server Resources</h3>
          </div>
          <div className="space-y-6">
            {/* CPU Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">CPU Usage</span>
                </div>
                <span
                  className={`text-sm font-bold ${
                    getCpuStatus(data.cpu.usage) === 'good'
                      ? 'text-green-500'
                      : getCpuStatus(data.cpu.usage) === 'warning'
                      ? 'text-amber-500'
                      : 'text-red-500'
                  }`}
                >
                  {data.cpu.usage.toFixed(1)}%
                </span>
              </div>
              <ProgressBar
                value={data.cpu.usage}
                max={100}
                status={getCpuStatus(data.cpu.usage)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {data.cpu.cores} cores available
              </p>
            </div>

            {/* Memory Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Memory Usage</span>
                </div>
                <span
                  className={`text-sm font-bold ${
                    getMemoryStatus(data.memory.percentage) === 'good'
                      ? 'text-green-500'
                      : getMemoryStatus(data.memory.percentage) === 'warning'
                      ? 'text-amber-500'
                      : 'text-red-500'
                  }`}
                >
                  {data.memory.percentage.toFixed(1)}%
                </span>
              </div>
              <ProgressBar
                value={data.memory.percentage}
                max={100}
                status={getMemoryStatus(data.memory.percentage)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {data.memory.used.toLocaleString()} MB / {data.memory.total.toLocaleString()} MB
              </p>
            </div>
          </div>
        </Card>

        {/* Database & Cache */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Database className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Data Services</h3>
          </div>
          <div className="space-y-6">
            {/* Database */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Database</span>
                <StatusBadge status={data.database.status} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Connections</span>
                  <span className="font-medium">
                    {data.database.connections} / {data.database.maxConnections}
                  </span>
                </div>
                <ProgressBar
                  value={data.database.connections}
                  max={data.database.maxConnections}
                  status={
                    data.database.connections / data.database.maxConnections < 0.7
                      ? 'good'
                      : data.database.connections / data.database.maxConnections < 0.85
                      ? 'warning'
                      : 'critical'
                  }
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Avg Query Time</span>
                  <span className="font-medium">{data.database.queryTime}ms</span>
                </div>
              </div>
            </div>

            {/* Cache */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Redis Cache</span>
                <StatusBadge status={data.cache.status} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Hit Rate</span>
                  <span className="font-medium text-green-500">
                    {data.cache.hitRate.toFixed(1)}%
                  </span>
                </div>
                <ProgressBar
                  value={data.cache.hitRate}
                  max={100}
                  status={data.cache.hitRate > 80 ? 'good' : data.cache.hitRate > 60 ? 'warning' : 'critical'}
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Memory Used</span>
                  <span className="font-medium">{data.cache.memoryUsed.toLocaleString()} MB</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Indicators */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Performance Indicators</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Request Throughput</p>
            <p className="text-2xl font-bold">{data.requestsPerMinute}</p>
            <p className="text-xs text-muted-foreground">requests per minute</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Active Sessions</p>
            <p className="text-2xl font-bold">{data.activeConnections}</p>
            <p className="text-xs text-muted-foreground">concurrent connections</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">System Uptime</p>
            <p className="text-2xl font-bold">{formatUptime(data.uptime)}</p>
            <p className="text-xs text-muted-foreground">
              {((data.uptime / (30 * 24 * 3600)) * 100).toFixed(2)}% availability
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
