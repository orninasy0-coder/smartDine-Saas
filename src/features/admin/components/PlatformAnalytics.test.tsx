/**
 * Platform Analytics Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlatformAnalytics, PlatformAnalyticsData } from './PlatformAnalytics';

const mockAnalyticsData: PlatformAnalyticsData = {
  revenue: {
    current: 125000,
    previous: 100000,
    trend: 25,
    daily: [
      { date: '2024-01-01', amount: 15000 },
      { date: '2024-01-02', amount: 18000 },
      { date: '2024-01-03', amount: 17000 },
      { date: '2024-01-04', amount: 19000 },
      { date: '2024-01-05', amount: 20000 },
      { date: '2024-01-06', amount: 18000 },
      { date: '2024-01-07', amount: 18000 },
    ],
    monthly: [
      { month: 'Jan', amount: 100000 },
      { month: 'Feb', amount: 110000 },
      { month: 'Mar', amount: 105000 },
      { month: 'Apr', amount: 115000 },
      { month: 'May', amount: 120000 },
      { month: 'Jun', amount: 125000 },
    ],
  },
  orders: {
    current: 5000,
    previous: 4500,
    trend: 11.1,
    daily: [
      { date: '2024-01-01', count: 650 },
      { date: '2024-01-02', count: 720 },
      { date: '2024-01-03', count: 680 },
      { date: '2024-01-04', count: 750 },
      { date: '2024-01-05', count: 800 },
      { date: '2024-01-06', count: 700 },
      { date: '2024-01-07', count: 700 },
    ],
    byStatus: [
      { status: 'Completed', count: 3500, percentage: 70 },
      { status: 'In Progress', count: 750, percentage: 15 },
      { status: 'Pending', count: 500, percentage: 10 },
      { status: 'Cancelled', count: 250, percentage: 5 },
    ],
  },
  restaurants: {
    total: 150,
    active: 142,
    new: 12,
    churnRate: 2.5,
    growth: [
      { month: 'Jan', count: 120 },
      { month: 'Feb', count: 125 },
      { month: 'Mar', count: 130 },
      { month: 'Apr', count: 135 },
      { month: 'May', count: 142 },
      { month: 'Jun', count: 150 },
    ],
  },
  subscriptions: {
    active: 142,
    trial: 15,
    cancelled: 8,
    mrr: 45000,
    byPlan: [
      { plan: 'Basic', count: 50, revenue: 10000 },
      { plan: 'Pro', count: 70, revenue: 25000 },
      { plan: 'Enterprise', count: 22, revenue: 10000 },
    ],
  },
  topRestaurants: [
    { id: '1', name: 'Restaurant A', revenue: 25000, orders: 500, growth: 15 },
    { id: '2', name: 'Restaurant B', revenue: 22000, orders: 450, growth: 12 },
    { id: '3', name: 'Restaurant C', revenue: 20000, orders: 420, growth: 10 },
    { id: '4', name: 'Restaurant D', revenue: 18000, orders: 380, growth: 8 },
    { id: '5', name: 'Restaurant E', revenue: 15000, orders: 350, growth: -5 },
  ],
};

describe('PlatformAnalytics', () => {
  it('renders loading skeleton when isLoading is true', () => {
    render(<PlatformAnalytics data={mockAnalyticsData} isLoading={true} />);
    
    // Check for loading skeleton elements
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders key metrics correctly', () => {
    render(<PlatformAnalytics data={mockAnalyticsData} isLoading={false} />);
    
    // Check for key metrics
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('$125,000')).toBeInTheDocument();
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('5,000')).toBeInTheDocument();
    expect(screen.getByText('Active Restaurants')).toBeInTheDocument();
    expect(screen.getByText('142')).toBeInTheDocument();
    expect(screen.getByText('Monthly Recurring Revenue')).toBeInTheDocument();
    expect(screen.getByText('$45,000')).toBeInTheDocument();
  });

  it('displays trend indicators correctly', () => {
    render(<PlatformAnalytics data={mockAnalyticsData} isLoading={false} />);
    
    // Check for positive trend
    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(screen.getByText('11.1%')).toBeInTheDocument();
  });

  it('renders all tab triggers', () => {
    render(<PlatformAnalytics data={mockAnalyticsData} isLoading={false} />);
    
    expect(screen.getByRole('tab', { name: /revenue/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /orders/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /restaurants/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /subscriptions/i })).toBeInTheDocument();
  });

  it('displays revenue charts', () => {
    render(<PlatformAnalytics data={mockAnalyticsData} isLoading={false} />);
    
    expect(screen.getByText('Daily Revenue (Last 7 Days)')).toBeInTheDocument();
    expect(screen.getByText('Monthly Revenue Trend')).toBeInTheDocument();
  });

  it('displays top restaurants correctly', async () => {
    const user = userEvent.setup();
    render(<PlatformAnalytics data={mockAnalyticsData} isLoading={false} />);
    
    // Switch to restaurants tab
    const restaurantsTab = screen.getByRole('tab', { name: /restaurants/i });
    await user.click(restaurantsTab);
    
    // Wait for content to appear
    await waitFor(() => {
      expect(screen.getByText('Restaurant A')).toBeInTheDocument();
    });
    
    // Check for top restaurants
    expect(screen.getByText('$25,000')).toBeInTheDocument();
    expect(screen.getByText('500 orders')).toBeInTheDocument();
  });

  it('displays subscription plan distribution', async () => {
    const user = userEvent.setup();
    render(<PlatformAnalytics data={mockAnalyticsData} isLoading={false} />);
    
    // Switch to subscriptions tab
    const subscriptionsTab = screen.getByRole('tab', { name: /subscriptions/i });
    await user.click(subscriptionsTab);
    
    // Wait for content to appear
    await waitFor(() => {
      expect(screen.getByText('Basic')).toBeInTheDocument();
    });
    
    // Check for subscription plans
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
  });

  it('formats currency correctly', () => {
    render(<PlatformAnalytics data={mockAnalyticsData} isLoading={false} />);
    
    // Check currency formatting - use getAllByText for duplicates
    const revenueElements = screen.getAllByText('$125,000');
    expect(revenueElements.length).toBeGreaterThan(0);
    expect(screen.getByText('Previous: $100,000')).toBeInTheDocument();
  });

  it('displays order status breakdown', async () => {
    const user = userEvent.setup();
    render(<PlatformAnalytics data={mockAnalyticsData} isLoading={false} />);
    
    // Switch to orders tab
    const ordersTab = screen.getByRole('tab', { name: /orders/i });
    await user.click(ordersTab);
    
    // Wait for content to appear
    await waitFor(() => {
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
    
    // Check for order statuses
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  it('displays restaurant growth metrics', async () => {
    const user = userEvent.setup();
    render(<PlatformAnalytics data={mockAnalyticsData} isLoading={false} />);
    
    // Switch to restaurants tab
    const restaurantsTab = screen.getByRole('tab', { name: /restaurants/i });
    await user.click(restaurantsTab);
    
    // Wait for content to appear
    await waitFor(() => {
      expect(screen.getByText('150')).toBeInTheDocument();
    });
    
    // Check for growth metrics
    expect(screen.getByText('2.5%')).toBeInTheDocument(); // Churn rate
  });

  it('displays subscription overview', async () => {
    const user = userEvent.setup();
    render(<PlatformAnalytics data={mockAnalyticsData} isLoading={false} />);
    
    // Switch to subscriptions tab
    const subscriptionsTab = screen.getByRole('tab', { name: /subscriptions/i });
    await user.click(subscriptionsTab);
    
    // Wait for content to appear
    await waitFor(() => {
      expect(screen.getByText('Active Subscriptions')).toBeInTheDocument();
    });
    
    // Check for subscription metrics
    expect(screen.getByText('Trial Subscriptions')).toBeInTheDocument();
    expect(screen.getByText('Cancelled This Month')).toBeInTheDocument();
  });
});
