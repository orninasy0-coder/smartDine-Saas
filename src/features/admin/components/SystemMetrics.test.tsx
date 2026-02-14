/**
 * SystemMetrics Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SystemMetrics, SystemMetricsData } from './SystemMetrics';

const mockSystemMetrics: SystemMetricsData = {
  status: 'healthy',
  uptime: 2592000, // 30 days in seconds
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
  lastUpdated: '2024-01-15T10:30:00Z',
};

describe('SystemMetrics', () => {
  it('renders system health overview', () => {
    render(<SystemMetrics data={mockSystemMetrics} />);

    expect(screen.getByText('System Health Overview')).toBeInTheDocument();
    expect(screen.getAllByText('Healthy').length).toBeGreaterThan(0);
  });

  it('displays key metrics correctly', () => {
    render(<SystemMetrics data={mockSystemMetrics} />);

    expect(screen.getByText('API Uptime')).toBeInTheDocument();
    expect(screen.getByText('Avg Response Time')).toBeInTheDocument();
    expect(screen.getByText('Error Rate')).toBeInTheDocument();
    expect(screen.getByText('Active Connections')).toBeInTheDocument();
  });

  it('shows correct uptime format', () => {
    render(<SystemMetrics data={mockSystemMetrics} />);

    // 30 days = 30d 0h (appears in multiple places)
    expect(screen.getAllByText('30d 0h').length).toBeGreaterThan(0);
  });

  it('displays API latency with correct unit', () => {
    render(<SystemMetrics data={mockSystemMetrics} />);

    expect(screen.getByText('124')).toBeInTheDocument();
    expect(screen.getByText('ms')).toBeInTheDocument();
  });

  it('shows error rate as percentage', () => {
    render(<SystemMetrics data={mockSystemMetrics} />);

    expect(screen.getByText('0.02')).toBeInTheDocument();
  });

  it('displays server resources section', () => {
    render(<SystemMetrics data={mockSystemMetrics} />);

    expect(screen.getByText('Server Resources')).toBeInTheDocument();
    expect(screen.getByText('CPU Usage')).toBeInTheDocument();
    expect(screen.getByText('Memory Usage')).toBeInTheDocument();
  });

  it('shows CPU usage with correct percentage', () => {
    render(<SystemMetrics data={mockSystemMetrics} />);

    expect(screen.getByText('45.5%')).toBeInTheDocument();
    expect(screen.getByText('8 cores available')).toBeInTheDocument();
  });

  it('displays memory usage correctly', () => {
    render(<SystemMetrics data={mockSystemMetrics} />);

    expect(screen.getByText('39.1%')).toBeInTheDocument();
    expect(screen.getByText(/12,800 MB \/ 32,768 MB/)).toBeInTheDocument();
  });

  it('shows database metrics', () => {
    render(<SystemMetrics data={mockSystemMetrics} />);

    expect(screen.getByText('Data Services')).toBeInTheDocument();
    expect(screen.getByText('Database')).toBeInTheDocument();
    expect(screen.getByText('45 / 100')).toBeInTheDocument();
    expect(screen.getByText('15ms')).toBeInTheDocument();
  });

  it('displays cache metrics', () => {
    render(<SystemMetrics data={mockSystemMetrics} />);

    expect(screen.getByText('Redis Cache')).toBeInTheDocument();
    expect(screen.getByText('94.5%')).toBeInTheDocument();
    expect(screen.getByText('2,048 MB')).toBeInTheDocument();
  });

  it('shows performance indicators', () => {
    render(<SystemMetrics data={mockSystemMetrics} />);

    expect(screen.getByText('Performance Indicators')).toBeInTheDocument();
    expect(screen.getByText('Request Throughput')).toBeInTheDocument();
    expect(screen.getByText('3450')).toBeInTheDocument();
    expect(screen.getByText('requests per minute')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    render(<SystemMetrics data={mockSystemMetrics} isLoading={true} />);

    // Should show skeleton loaders
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows degraded status correctly', () => {
    const degradedData = {
      ...mockSystemMetrics,
      status: 'degraded' as const,
    };

    render(<SystemMetrics data={degradedData} />);

    expect(screen.getByText('Degraded')).toBeInTheDocument();
  });

  it('shows down status correctly', () => {
    const downData = {
      ...mockSystemMetrics,
      status: 'down' as const,
    };

    render(<SystemMetrics data={downData} />);

    expect(screen.getByText('Down')).toBeInTheDocument();
  });

  it('formats uptime for hours correctly', () => {
    const hourData = {
      ...mockSystemMetrics,
      uptime: 7200, // 2 hours
    };

    render(<SystemMetrics data={hourData} />);

    expect(screen.getAllByText('2h 0m').length).toBeGreaterThan(0);
  });

  it('formats uptime for minutes correctly', () => {
    const minuteData = {
      ...mockSystemMetrics,
      uptime: 300, // 5 minutes
    };

    render(<SystemMetrics data={minuteData} />);

    expect(screen.getAllByText('5m').length).toBeGreaterThan(0);
  });
});
