/**
 * OfflineIndicator Component Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { OfflineIndicator } from './OfflineIndicator';

describe('OfflineIndicator', () => {
  let onlineGetter: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Mock navigator.onLine
    onlineGetter = vi.spyOn(navigator, 'onLine', 'get');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not render when online initially', () => {
    onlineGetter.mockReturnValue(true);
    const { container } = render(<OfflineIndicator />);
    expect(container.firstChild).toBeNull();
  });

  it('should render offline message when offline', () => {
    onlineGetter.mockReturnValue(false);
    render(<OfflineIndicator />);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/you are currently offline/i)).toBeInTheDocument();
  });

  it('should show offline message when going offline', () => {
    onlineGetter.mockReturnValue(true);
    render(<OfflineIndicator />);
    
    // Initially should not show
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    
    // Simulate going offline
    onlineGetter.mockReturnValue(false);
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/you are currently offline/i)).toBeInTheDocument();
  });

  it('should show reconnected message when coming back online', () => {
    onlineGetter.mockReturnValue(false);
    render(<OfflineIndicator />);
    
    // Should show offline message
    expect(screen.getByText(/you are currently offline/i)).toBeInTheDocument();
    
    // Simulate coming back online
    onlineGetter.mockReturnValue(true);
    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    
    expect(screen.getByText(/connection restored/i)).toBeInTheDocument();
  });

  it('should hide reconnected message after duration', () => {
    vi.useFakeTimers();
    onlineGetter.mockReturnValue(false);
    render(<OfflineIndicator reconnectedDuration={1000} />);
    
    // Simulate coming back online
    onlineGetter.mockReturnValue(true);
    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    
    expect(screen.getByText(/connection restored/i)).toBeInTheDocument();
    
    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    
    vi.useRealTimers();
  });

  it('should not show reconnected message when showReconnected is false', () => {
    onlineGetter.mockReturnValue(false);
    render(<OfflineIndicator showReconnected={false} />);
    
    // Should show offline message
    expect(screen.getByText(/you are currently offline/i)).toBeInTheDocument();
    
    // Simulate coming back online
    onlineGetter.mockReturnValue(true);
    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should render at top position by default', () => {
    onlineGetter.mockReturnValue(false);
    render(<OfflineIndicator />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('top-0');
  });

  it('should render at bottom position when specified', () => {
    onlineGetter.mockReturnValue(false);
    render(<OfflineIndicator position="bottom" />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bottom-0');
  });

  it('should apply custom className', () => {
    onlineGetter.mockReturnValue(false);
    render(<OfflineIndicator className="custom-class" />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('custom-class');
  });

  it('should have proper accessibility attributes', () => {
    onlineGetter.mockReturnValue(false);
    render(<OfflineIndicator />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'polite');
  });

  it('should show red background when offline', () => {
    onlineGetter.mockReturnValue(false);
    render(<OfflineIndicator />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-red-600');
  });

  it('should show green background when reconnected', () => {
    onlineGetter.mockReturnValue(false);
    render(<OfflineIndicator />);
    
    // Simulate coming back online
    onlineGetter.mockReturnValue(true);
    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-green-600');
  });
});
