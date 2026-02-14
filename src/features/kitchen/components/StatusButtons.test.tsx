/**
 * StatusButtons Component Tests
 * Tests for the reusable status action buttons
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatusButtons } from './StatusButtons';
import type { OrderStatus } from '@/utils/types';

describe('StatusButtons', () => {
  const mockOnStatusChange = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render "بدء التحضير" button for PENDING status', () => {
    render(
      <StatusButtons
        status="PENDING"
        onStatusChange={mockOnStatusChange}
      />
    );

    const button = screen.getByRole('button', { name: /بدء التحضير/i });
    expect(button).toBeInTheDocument();
  });

  it('should render "جاهز للتقديم" button for PREPARING status', () => {
    render(
      <StatusButtons
        status="PREPARING"
        onStatusChange={mockOnStatusChange}
      />
    );

    const button = screen.getByRole('button', { name: /جاهز للتقديم/i });
    expect(button).toBeInTheDocument();
  });

  it('should not render any buttons for READY status', () => {
    const { container } = render(
      <StatusButtons
        status="READY"
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should not render any buttons for DELIVERED status', () => {
    const { container } = render(
      <StatusButtons
        status="DELIVERED"
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should not render any buttons for CANCELLED status', () => {
    const { container } = render(
      <StatusButtons
        status="CANCELLED"
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should call onStatusChange with PREPARING when "بدء التحضير" is clicked', () => {
    render(
      <StatusButtons
        status="PENDING"
        onStatusChange={mockOnStatusChange}
      />
    );

    const button = screen.getByRole('button', { name: /بدء التحضير/i });
    fireEvent.click(button);

    expect(mockOnStatusChange).toHaveBeenCalledWith('PREPARING');
    expect(mockOnStatusChange).toHaveBeenCalledTimes(1);
  });

  it('should call onStatusChange with READY when "جاهز للتقديم" is clicked', () => {
    render(
      <StatusButtons
        status="PREPARING"
        onStatusChange={mockOnStatusChange}
      />
    );

    const button = screen.getByRole('button', { name: /جاهز للتقديم/i });
    fireEvent.click(button);

    expect(mockOnStatusChange).toHaveBeenCalledWith('READY');
    expect(mockOnStatusChange).toHaveBeenCalledTimes(1);
  });

  it('should disable button when isUpdating is true', () => {
    render(
      <StatusButtons
        status="PENDING"
        onStatusChange={mockOnStatusChange}
        isUpdating={true}
      />
    );

    const button = screen.getByRole('button', { name: /بدء التحضير/i });
    expect(button).toBeDisabled();
  });

  it('should not call onStatusChange when button is disabled', () => {
    render(
      <StatusButtons
        status="PENDING"
        onStatusChange={mockOnStatusChange}
        isUpdating={true}
      />
    );

    const button = screen.getByRole('button', { name: /بدء التحضير/i });
    fireEvent.click(button);

    expect(mockOnStatusChange).not.toHaveBeenCalled();
  });

  it('should apply fullWidth class when fullWidth is true', () => {
    render(
      <StatusButtons
        status="PENDING"
        onStatusChange={mockOnStatusChange}
        fullWidth={true}
      />
    );

    const button = screen.getByRole('button', { name: /بدء التحضير/i });
    expect(button).toHaveClass('flex-1');
  });

  it('should not apply fullWidth class when fullWidth is false', () => {
    render(
      <StatusButtons
        status="PENDING"
        onStatusChange={mockOnStatusChange}
        fullWidth={false}
      />
    );

    const button = screen.getByRole('button', { name: /بدء التحضير/i });
    expect(button).not.toHaveClass('flex-1');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <StatusButtons
        status="PENDING"
        onStatusChange={mockOnStatusChange}
        className="custom-class"
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('should render with different size variants', () => {
    const { rerender } = render(
      <StatusButtons
        status="PENDING"
        onStatusChange={mockOnStatusChange}
        size="sm"
      />
    );

    let button = screen.getByRole('button', { name: /بدء التحضير/i });
    expect(button).toBeInTheDocument();

    rerender(
      <StatusButtons
        status="PENDING"
        onStatusChange={mockOnStatusChange}
        size="lg"
      />
    );

    button = screen.getByRole('button', { name: /بدء التحضير/i });
    expect(button).toBeInTheDocument();
  });

  it('should render ChefHat icon for PENDING status', () => {
    render(
      <StatusButtons
        status="PENDING"
        onStatusChange={mockOnStatusChange}
      />
    );

    const button = screen.getByRole('button', { name: /بدء التحضير/i });
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should render CheckCircle icon for PREPARING status', () => {
    render(
      <StatusButtons
        status="PREPARING"
        onStatusChange={mockOnStatusChange}
      />
    );

    const button = screen.getByRole('button', { name: /جاهز للتقديم/i });
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
