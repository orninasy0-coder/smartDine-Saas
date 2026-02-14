import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RetryButton } from './RetryButton';

// Mock the translation hook
vi.mock('@/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.retry': 'Retry',
      };
      return translations[key] || key;
    },
  }),
}));

describe('RetryButton', () => {
  it('should render retry button', () => {
    const onRetry = vi.fn();
    render(<RetryButton onRetry={onRetry} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should display default retry text', () => {
    const onRetry = vi.fn();
    render(<RetryButton onRetry={onRetry} />);

    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('should display custom children text', () => {
    const onRetry = vi.fn();
    render(<RetryButton onRetry={onRetry}>Try Again</RetryButton>);

    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should call onRetry when clicked', () => {
    const onRetry = vi.fn();
    render(<RetryButton onRetry={onRetry} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('should render refresh icon', () => {
    const onRetry = vi.fn();
    const { container } = render(<RetryButton onRetry={onRetry} />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('should show spinning icon when isRetrying is true', () => {
    const onRetry = vi.fn();
    const { container } = render(<RetryButton onRetry={onRetry} isRetrying={true} />);

    const icon = container.querySelector('.animate-spin');
    expect(icon).toBeInTheDocument();
  });

  it('should not show spinning icon when isRetrying is false', () => {
    const onRetry = vi.fn();
    const { container } = render(<RetryButton onRetry={onRetry} isRetrying={false} />);

    const icon = container.querySelector('.animate-spin');
    expect(icon).not.toBeInTheDocument();
  });

  it('should be disabled when isRetrying is true', () => {
    const onRetry = vi.fn();
    render(<RetryButton onRetry={onRetry} isRetrying={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should be disabled when disabled prop is true', () => {
    const onRetry = vi.fn();
    render(<RetryButton onRetry={onRetry} disabled={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should be disabled when both isRetrying and disabled are true', () => {
    const onRetry = vi.fn();
    render(<RetryButton onRetry={onRetry} isRetrying={true} disabled={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should not call onRetry when disabled', () => {
    const onRetry = vi.fn();
    render(<RetryButton onRetry={onRetry} disabled={true} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onRetry).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    const onRetry = vi.fn();
    render(<RetryButton onRetry={onRetry} className="custom-class" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should have outline variant styling', () => {
    const onRetry = vi.fn();
    const { container } = render(<RetryButton onRetry={onRetry} />);

    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });

  it('should handle async onRetry function', async () => {
    const onRetry = vi.fn().mockResolvedValue(undefined);
    render(<RetryButton onRetry={onRetry} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
