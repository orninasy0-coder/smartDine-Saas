/**
 * SubscriptionManager Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SubscriptionManager } from './SubscriptionManager';
import { Subscription } from '../types';

const mockSubscriptions: Subscription[] = [
  {
    id: 'sub_1',
    restaurantId: '1',
    restaurantName: 'Test Restaurant',
    restaurantEmail: 'test@restaurant.com',
    plan: 'PRO',
    status: 'ACTIVE',
    billingCycle: 'monthly',
    monthlyRevenue: 99,
    totalPaid: 1188,
    startDate: '2024-01-15T10:00:00Z',
    currentPeriodStart: '2025-01-15T10:00:00Z',
    currentPeriodEnd: '2025-02-15T10:00:00Z',
    expiresAt: '2025-12-31T23:59:59Z',
    nextBillingDate: '2025-02-15T10:00:00Z',
    cancelledAt: null,
    autoRenew: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
];

describe('SubscriptionManager', () => {
  it('renders subscription table with data', () => {
    render(
      <SubscriptionManager
        subscriptions={mockSubscriptions}
        isLoading={false}
        onUpgrade={vi.fn()}
        onCancel={vi.fn()}
        onRenew={vi.fn()}
        onView={vi.fn()}
      />
    );

    expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
    expect(screen.getByText('test@restaurant.com')).toBeInTheDocument();
    expect(screen.getByText('PRO')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <SubscriptionManager
        subscriptions={[]}
        isLoading={true}
        onUpgrade={vi.fn()}
        onCancel={vi.fn()}
        onRenew={vi.fn()}
        onView={vi.fn()}
      />
    );

    const loadingElements = screen.getAllByRole('generic');
    const hasLoadingAnimation = loadingElements.some((el) =>
      el.className.includes('animate-pulse')
    );
    expect(hasLoadingAnimation).toBe(true);
  });

  it('filters subscriptions by search query', () => {
    render(
      <SubscriptionManager
        subscriptions={mockSubscriptions}
        isLoading={false}
        onUpgrade={vi.fn()}
        onCancel={vi.fn()}
        onRenew={vi.fn()}
        onView={vi.fn()}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search by restaurant name/i);
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
  });

  it('shows empty state when no subscriptions', () => {
    render(
      <SubscriptionManager
        subscriptions={[]}
        isLoading={false}
        onUpgrade={vi.fn()}
        onCancel={vi.fn()}
        onRenew={vi.fn()}
        onView={vi.fn()}
      />
    );

    expect(screen.getByText('No subscriptions found')).toBeInTheDocument();
  });

  it('renders action dropdown button', () => {
    render(
      <SubscriptionManager
        subscriptions={mockSubscriptions}
        isLoading={false}
        onUpgrade={vi.fn()}
        onCancel={vi.fn()}
        onRenew={vi.fn()}
        onView={vi.fn()}
      />
    );

    // Verify action button exists
    const actionButtons = screen.getAllByRole('button');
    const actionButton = actionButtons.find((btn) => btn.getAttribute('aria-haspopup') === 'menu');
    
    expect(actionButton).toBeDefined();
  });

  it('formats currency correctly', () => {
    render(
      <SubscriptionManager
        subscriptions={mockSubscriptions}
        isLoading={false}
        onUpgrade={vi.fn()}
        onCancel={vi.fn()}
        onRenew={vi.fn()}
        onView={vi.fn()}
      />
    );

    expect(screen.getByText('$99.00')).toBeInTheDocument();
  });

  it('displays correct status badge', () => {
    render(
      <SubscriptionManager
        subscriptions={mockSubscriptions}
        isLoading={false}
        onUpgrade={vi.fn()}
        onCancel={vi.fn()}
        onRenew={vi.fn()}
        onView={vi.fn()}
      />
    );

    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });
});
