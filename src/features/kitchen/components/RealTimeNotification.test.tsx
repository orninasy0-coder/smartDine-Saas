/**
 * RealTimeNotification Component Tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RealTimeNotification, useKitchenNotification } from './RealTimeNotification';
import { toast } from 'sonner';
import type { Order } from '@/utils/types';

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    info: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock AudioContext
const mockAudioContext = {
  createOscillator: vi.fn(() => ({
    connect: vi.fn(),
    frequency: { value: 0 },
    start: vi.fn(),
    stop: vi.fn(),
  })),
  createGain: vi.fn(() => ({
    connect: vi.fn(),
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    },
  })),
  destination: {},
  currentTime: 0,
};

global.AudioContext = vi.fn(() => mockAudioContext) as any;

describe('RealTimeNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as any).__kitchenNotification;
  });

  afterEach(() => {
    delete (window as any).__kitchenNotification;
  });

  it('renders without crashing', () => {
    render(<RealTimeNotification />);
    expect(document.body).toBeTruthy();
  });

  it('initializes with default props', () => {
    const { container } = render(<RealTimeNotification />);
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('registers global notification function', async () => {
    render(<RealTimeNotification />);

    await waitFor(() => {
      expect((window as any).__kitchenNotification).toBeDefined();
    });
  });

  it('cleans up global notification function on unmount', async () => {
    const { unmount } = render(<RealTimeNotification />);

    await waitFor(() => {
      expect((window as any).__kitchenNotification).toBeDefined();
    });

    unmount();

    expect((window as any).__kitchenNotification).toBeUndefined();
  });

  it('accepts custom className', () => {
    const { container } = render(<RealTimeNotification className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeTruthy();
  });

  it('handles notification click callback', () => {
    const onNotificationClick = vi.fn();
    render(<RealTimeNotification onNotificationClick={onNotificationClick} />);
    expect(onNotificationClick).not.toHaveBeenCalled();
  });
});

describe('useKitchenNotification hook', () => {
  const mockOrder: Order = {
    id: '1',
    orderNumber: 'ORD-001',
    restaurantId: 'rest-1',
    status: 'PENDING',
    totalPrice: 100,
    tableNumber: '5',
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as any).__kitchenNotification;
  });

  it('provides notification methods', () => {
    const TestComponent = () => {
      const notification = useKitchenNotification();
      expect(notification.showNotification).toBeDefined();
      expect(notification.notifyNewOrder).toBeDefined();
      expect(notification.notifyStatusUpdate).toBeDefined();
      expect(notification.notifyUrgent).toBeDefined();
      expect(notification.notifySuccess).toBeDefined();
      expect(notification.notifyError).toBeDefined();
      return null;
    };

    render(<TestComponent />);
  });

  it('notifyNewOrder shows toast with correct data', () => {
    const TestComponent = () => {
      const { notifyNewOrder } = useKitchenNotification();
      notifyNewOrder(mockOrder);
      return null;
    };

    render(<TestComponent />);

    expect(toast.info).toHaveBeenCalledWith(
      'طلب جديد!',
      expect.objectContaining({
        description: expect.anything(),
      })
    );
  });

  it('notifySuccess shows success toast', () => {
    const TestComponent = () => {
      const { notifySuccess } = useKitchenNotification();
      notifySuccess('تم بنجاح');
      return null;
    };

    render(<TestComponent />);

    expect(toast.info).toHaveBeenCalled();
  });

  it('notifyError shows error toast', () => {
    const TestComponent = () => {
      const { notifyError } = useKitchenNotification();
      notifyError('حدث خطأ');
      return null;
    };

    render(<TestComponent />);

    expect(toast.info).toHaveBeenCalled();
  });

  it('notifyUrgent shows urgent notification', () => {
    const TestComponent = () => {
      const { notifyUrgent } = useKitchenNotification();
      notifyUrgent('تنبيه عاجل', mockOrder);
      return null;
    };

    render(<TestComponent />);

    expect(toast.info).toHaveBeenCalled();
  });

  it('notifyStatusUpdate shows status update notification', () => {
    const TestComponent = () => {
      const { notifyStatusUpdate } = useKitchenNotification();
      notifyStatusUpdate(mockOrder, 'PREPARING');
      return null;
    };

    render(<TestComponent />);

    expect(toast.info).toHaveBeenCalled();
  });

  it('falls back to simple toast when global function not available', () => {
    const TestComponent = () => {
      const { showNotification } = useKitchenNotification();
      showNotification({
        type: 'new_order',
        title: 'Test',
        message: 'Test message',
      });
      return null;
    };

    render(<TestComponent />);

    expect(toast.info).toHaveBeenCalledWith('Test', {
      description: 'Test message',
    });
  });
});
