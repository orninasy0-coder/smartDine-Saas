/**
 * ErrorLogs Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorLogs, ErrorLog } from './ErrorLogs';

const mockLogs: ErrorLog[] = [
  {
    id: '1',
    timestamp: '2024-01-15T10:30:00Z',
    level: 'critical',
    message: 'Database connection failed',
    source: 'database',
    stackTrace: 'Error: Connection timeout\n  at Database.connect (db.ts:45)',
    requestId: 'req-123',
    metadata: { host: 'db-primary', port: 5432 },
  },
  {
    id: '2',
    timestamp: '2024-01-15T10:25:00Z',
    level: 'error',
    message: 'API request failed with status 500',
    source: 'api',
    requestId: 'req-124',
    userId: 'user-456',
  },
  {
    id: '3',
    timestamp: '2024-01-15T10:20:00Z',
    level: 'warning',
    message: 'High memory usage detected',
    source: 'system',
  },
  {
    id: '4',
    timestamp: '2024-01-15T10:15:00Z',
    level: 'info',
    message: 'System backup completed successfully',
    source: 'backup',
  },
];

describe('ErrorLogs', () => {
  it('renders logs list', () => {
    render(<ErrorLogs logs={mockLogs} />);

    expect(screen.getByText('System Logs & Errors')).toBeInTheDocument();
    expect(screen.getByText('Database connection failed')).toBeInTheDocument();
    expect(screen.getByText('API request failed with status 500')).toBeInTheDocument();
  });

  it('displays log count correctly', () => {
    render(<ErrorLogs logs={mockLogs} />);

    expect(screen.getByText('4 of 4 logs')).toBeInTheDocument();
  });

  it('shows level badges correctly', () => {
    render(<ErrorLogs logs={mockLogs} />);

    expect(screen.getAllByText('Critical').length).toBeGreaterThan(0);
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getAllByText('Info').length).toBeGreaterThan(0);
  });

  it('displays level statistics', () => {
    render(<ErrorLogs logs={mockLogs} />);

    // Check that statistics are displayed
    expect(screen.getByText('Errors')).toBeInTheDocument();
    expect(screen.getByText('Warnings')).toBeInTheDocument();
    
    // Check that counts are displayed (all should be 1)
    const counts = screen.getAllByText('1');
    expect(counts.length).toBeGreaterThanOrEqual(4); // At least 4 counts for the 4 levels
  });

  it('filters logs by search query', () => {
    render(<ErrorLogs logs={mockLogs} />);

    const searchInput = screen.getByPlaceholderText('Search logs...');
    fireEvent.change(searchInput, { target: { value: 'database' } });

    expect(screen.getByText('Database connection failed')).toBeInTheDocument();
    expect(screen.queryByText('API request failed with status 500')).not.toBeInTheDocument();
  });

  it('expands log entry to show details', () => {
    render(<ErrorLogs logs={mockLogs} />);

    const expandButtons = screen.getAllByRole('button');
    const firstExpandButton = expandButtons.find(
      (btn) => btn.querySelector('svg') !== null
    );

    if (firstExpandButton) {
      fireEvent.click(firstExpandButton);
      expect(screen.getByText('Stack Trace')).toBeInTheDocument();
      expect(screen.getByText(/Connection timeout/)).toBeInTheDocument();
    }
  });

  it('shows request ID when available', () => {
    render(<ErrorLogs logs={mockLogs} />);

    expect(screen.getByText(/Request ID: req-123/)).toBeInTheDocument();
    expect(screen.getByText(/Request ID: req-124/)).toBeInTheDocument();
  });

  it('displays source badges', () => {
    render(<ErrorLogs logs={mockLogs} />);

    expect(screen.getByText('database')).toBeInTheDocument();
    expect(screen.getByText('api')).toBeInTheDocument();
    expect(screen.getByText('system')).toBeInTheDocument();
  });

  it('calls onRefresh when refresh button clicked', () => {
    const onRefresh = vi.fn();
    render(<ErrorLogs logs={mockLogs} onRefresh={onRefresh} />);

    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('calls onExport when export button clicked', () => {
    const onExport = vi.fn();
    render(<ErrorLogs logs={mockLogs} onExport={onExport} />);

    const exportButton = screen.getByText('Export');
    fireEvent.click(exportButton);

    expect(onExport).toHaveBeenCalledTimes(1);
  });

  it('displays loading state', () => {
    render(<ErrorLogs logs={mockLogs} isLoading={true} />);

    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows empty state when no logs', () => {
    render(<ErrorLogs logs={[]} />);

    expect(screen.getByText('No logs found')).toBeInTheDocument();
  });

  it('shows empty state when filtered results are empty', () => {
    render(<ErrorLogs logs={mockLogs} />);

    const searchInput = screen.getByPlaceholderText('Search logs...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    expect(screen.getByText('No logs found')).toBeInTheDocument();
  });

  it('displays metadata when expanded', () => {
    render(<ErrorLogs logs={mockLogs} />);

    const expandButtons = screen.getAllByRole('button');
    const firstExpandButton = expandButtons.find(
      (btn) => btn.querySelector('svg') !== null
    );

    if (firstExpandButton) {
      fireEvent.click(firstExpandButton);
      expect(screen.getByText('Additional Details')).toBeInTheDocument();
      expect(screen.getByText('host:')).toBeInTheDocument();
      expect(screen.getByText('5432')).toBeInTheDocument();
    }
  });

  it('formats timestamp correctly', () => {
    render(<ErrorLogs logs={mockLogs} />);

    // Check that timestamps are displayed (format may vary by locale)
    const timestamps = screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}/);
    expect(timestamps.length).toBeGreaterThan(0);
  });
});
