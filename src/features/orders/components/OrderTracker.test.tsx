/**
 * OrderTracker Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrderTracker } from './OrderTracker';
import type { OrderStatus } from '@/utils/types';

describe('OrderTracker', () => {
  const mockCreatedAt = '2024-01-15T10:00:00Z';

  it('renders pending status correctly', () => {
    render(<OrderTracker status="PENDING" createdAt={mockCreatedAt} />);

    expect(screen.getByRole('heading', { name: 'قيد الانتظار' })).toBeInTheDocument();
    expect(screen.getByText('تم استلام طلبك')).toBeInTheDocument();
    expect(screen.getByText('20-30 دقيقة')).toBeInTheDocument();
  });

  it('renders preparing status correctly', () => {
    render(<OrderTracker status="PREPARING" createdAt={mockCreatedAt} />);

    expect(screen.getByRole('heading', { name: 'قيد التحضير' })).toBeInTheDocument();
    expect(screen.getByText('يتم تحضير طلبك')).toBeInTheDocument();
    expect(screen.getByText('15-20 دقيقة')).toBeInTheDocument();
  });

  it('renders ready status correctly', () => {
    render(<OrderTracker status="READY" createdAt={mockCreatedAt} />);

    expect(screen.getByRole('heading', { name: 'جاهز' })).toBeInTheDocument();
    expect(screen.getByText('طلبك جاهز')).toBeInTheDocument();
    expect(screen.getByText('5-10 دقائق')).toBeInTheDocument();
  });

  it('renders delivered status correctly', () => {
    render(<OrderTracker status="DELIVERED" createdAt={mockCreatedAt} />);

    expect(screen.getByRole('heading', { name: 'تم التوصيل' })).toBeInTheDocument();
    expect(screen.getByText('تم توصيل طلبك')).toBeInTheDocument();
    expect(screen.queryByText(/دقيقة/)).not.toBeInTheDocument();
  });

  it('renders cancelled status correctly', () => {
    render(<OrderTracker status="CANCELLED" createdAt={mockCreatedAt} />);

    expect(screen.getByText('ملغي')).toBeInTheDocument();
    expect(screen.getByText('تم إلغاء الطلب')).toBeInTheDocument();
    expect(
      screen.getByText(/تم إلغاء هذا الطلب. إذا كان لديك أي استفسار/)
    ).toBeInTheDocument();
  });

  it('shows all status steps for non-cancelled orders', () => {
    render(<OrderTracker status="PREPARING" createdAt={mockCreatedAt} />);

    expect(screen.getAllByText('قيد الانتظار')).toHaveLength(1);
    expect(screen.getAllByText('قيد التحضير')).toHaveLength(2); // Header + timeline
    expect(screen.getAllByText('جاهز')).toHaveLength(1);
    expect(screen.getAllByText('تم التوصيل')).toHaveLength(1);
  });

  it('does not show timeline for cancelled orders', () => {
    render(<OrderTracker status="CANCELLED" createdAt={mockCreatedAt} />);

    // Should only show the cancelled status, not the timeline
    const statusLabels = screen.queryAllByText(/قيد الانتظار|قيد التحضير|جاهز/);
    expect(statusLabels).toHaveLength(0);
  });

  it('applies custom className', () => {
    const { container } = render(
      <OrderTracker status="PENDING" createdAt={mockCreatedAt} className="custom-class" />
    );

    const card = container.querySelector('.custom-class');
    expect(card).toBeInTheDocument();
  });

  it('shows completed status for past steps', () => {
    render(<OrderTracker status="READY" createdAt={mockCreatedAt} />);

    // All steps up to READY should show as completed
    const completedSteps = screen.getAllByText('مكتمل');
    expect(completedSteps.length).toBeGreaterThan(0);
  });

  it('shows current execution status for current step', () => {
    render(<OrderTracker status="PREPARING" createdAt={mockCreatedAt} />);

    expect(screen.getByText('جاري التنفيذ')).toBeInTheDocument();
  });

  it('shows waiting status for future steps', () => {
    render(<OrderTracker status="PENDING" createdAt={mockCreatedAt} />);

    const waitingSteps = screen.getAllByText('في انتظار التنفيذ');
    expect(waitingSteps.length).toBeGreaterThan(0);
  });
});
