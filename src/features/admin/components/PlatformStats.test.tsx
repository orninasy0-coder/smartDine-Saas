/**
 * Platform Stats Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlatformStats } from './PlatformStats';
import { PlatformStats as PlatformStatsType } from '../types';

describe('PlatformStats', () => {
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

  it('renders loading skeletons when isLoading is true', () => {
    const { container } = render(<PlatformStats stats={mockStats} isLoading={true} />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders all stat cards when data is loaded', () => {
    render(<PlatformStats stats={mockStats} isLoading={false} />);

    expect(screen.getByText('Total Restaurants')).toBeInTheDocument();
    expect(screen.getByText('Platform Revenue')).toBeInTheDocument();
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('Active Subscriptions')).toBeInTheDocument();
    expect(screen.getByText('This Week')).toBeInTheDocument();
    expect(screen.getByText('This Month')).toBeInTheDocument();
  });

  it('displays correct restaurant counts', () => {
    render(<PlatformStats stats={mockStats} isLoading={false} />);

    expect(screen.getByText('156')).toBeInTheDocument();
    expect(screen.getByText('142 active')).toBeInTheDocument();
  });

  it('formats currency values correctly', () => {
    render(<PlatformStats stats={mockStats} isLoading={false} />);

    expect(screen.getByText('$1,245,680')).toBeInTheDocument();
    expect(screen.getByText('Today: $12,450')).toBeInTheDocument();
  });

  it('displays order counts with proper formatting', () => {
    render(<PlatformStats stats={mockStats} isLoading={false} />);

    expect(screen.getByText('45,892')).toBeInTheDocument();
    expect(screen.getByText('Today: 487')).toBeInTheDocument();
  });

  it('shows subscription information', () => {
    render(<PlatformStats stats={mockStats} isLoading={false} />);

    expect(screen.getByText('142')).toBeInTheDocument();
    expect(screen.getByText('14 trials')).toBeInTheDocument();
  });

  it('displays weekly and monthly metrics', () => {
    render(<PlatformStats stats={mockStats} isLoading={false} />);

    expect(screen.getByText('$89,750')).toBeInTheDocument();
    expect(screen.getByText('3421 orders')).toBeInTheDocument();
    expect(screen.getByText('$345,280')).toBeInTheDocument();
    expect(screen.getByText('12847 orders')).toBeInTheDocument();
  });

  it('renders all icons', () => {
    const { container } = render(<PlatformStats stats={mockStats} isLoading={false} />);
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('applies hover effects to stat cards', () => {
    const { container } = render(<PlatformStats stats={mockStats} isLoading={false} />);
    const cards = container.querySelectorAll('.hover\\:shadow-lg');
    expect(cards.length).toBe(6);
  });
});
