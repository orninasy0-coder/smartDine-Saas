/**
 * DashboardStats Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardStats } from './DashboardStats';
import { DashboardStats as DashboardStatsType } from '../types';

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

describe('DashboardStats', () => {
  it('renders loading skeletons when isLoading is true', () => {
    const { container } = render(<DashboardStats stats={mockStats} isLoading={true} />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders all stat cards when data is loaded', () => {
    render(<DashboardStats stats={mockStats} isLoading={false} />);
    
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('Average Rating')).toBeInTheDocument();
    expect(screen.getByText('Active Orders')).toBeInTheDocument();
    expect(screen.getByText('This Week')).toBeInTheDocument();
    expect(screen.getByText('This Month')).toBeInTheDocument();
  });

  it('formats currency correctly', () => {
    render(<DashboardStats stats={mockStats} isLoading={false} />);
    
    // Check if currency is formatted (should contain $ and comma for thousands)
    const currencyElements = screen.getAllByText(/\$45,280/);
    expect(currencyElements.length).toBeGreaterThan(0);
  });

  it('displays total orders count', () => {
    render(<DashboardStats stats={mockStats} isLoading={false} />);
    
    expect(screen.getByText('1,247')).toBeInTheDocument();
  });

  it('displays average rating with one decimal place', () => {
    render(<DashboardStats stats={mockStats} isLoading={false} />);
    
    expect(screen.getByText('4.6')).toBeInTheDocument();
  });

  it('displays active orders count', () => {
    render(<DashboardStats stats={mockStats} isLoading={false} />);
    
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('displays today revenue in subtitle', () => {
    render(<DashboardStats stats={mockStats} isLoading={false} />);
    
    expect(screen.getByText(/Today: \$3,420/)).toBeInTheDocument();
  });

  it('displays week orders in subtitle', () => {
    render(<DashboardStats stats={mockStats} isLoading={false} />);
    
    expect(screen.getByText('287 orders')).toBeInTheDocument();
  });

  it('displays month orders in subtitle', () => {
    render(<DashboardStats stats={mockStats} isLoading={false} />);
    
    // Note: The number is not formatted with comma in the subtitle
    expect(screen.getByText('1247 orders')).toBeInTheDocument();
  });

  it('renders correct number of stat cards', () => {
    const { container } = render(<DashboardStats stats={mockStats} isLoading={false} />);
    
    // Should render 6 stat cards
    const cards = container.querySelectorAll('[class*="p-6"]');
    expect(cards.length).toBeGreaterThanOrEqual(6);
  });
});
