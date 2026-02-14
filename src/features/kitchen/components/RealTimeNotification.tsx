/**
 * RealTimeNotification Component
 * Displays real-time notifications for kitchen staff
 * Shows toast notifications for new orders and status updates
 * Plays sound alerts for urgent notifications
 */

import React, { useEffect, useRef, useState } from 'react';
import { Bell, ChefHat, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Order } from '@/utils/types';

export type NotificationType = 'new_order' | 'status_update' | 'urgent' | 'success' | 'error';

export interface KitchenNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  order?: Order;
  timestamp: Date;
  sound?: boolean;
}

interface RealTimeNotificationProps {
  /** Enable sound alerts */
  soundEnabled?: boolean;
  /** Volume level (0-1) */
  volume?: number;
  /** Callback when notification is clicked */
  onNotificationClick?: (notification: KitchenNotification) => void;
  /** Additional CSS classes */
  className?: string;
}

export const RealTimeNotification: React.FC<RealTimeNotificationProps> = ({
  soundEnabled = true,
  volume = 0.5,
  onNotificationClick,
  className = '',
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [notificationQueue, setNotificationQueue] = useState<KitchenNotification[]>([]);

  // Initialize audio element
  useEffect(() => {
    // Create audio element for notification sounds
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [volume]);

  // Play notification sound
  const playSound = (type: NotificationType) => {
    if (!soundEnabled || !audioRef.current) return;

    try {
      // Use different frequencies for different notification types
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      // Set frequency based on notification type
      switch (type) {
        case 'new_order':
          oscillator.frequency.value = 800; // High pitch for new orders
          break;
        case 'urgent':
          oscillator.frequency.value = 1000; // Higher pitch for urgent
          break;
        case 'success':
          oscillator.frequency.value = 600; // Medium pitch for success
          break;
        case 'error':
          oscillator.frequency.value = 400; // Lower pitch for errors
          break;
        default:
          oscillator.frequency.value = 700;
      }

      gainNode.gain.setValueAtTime(volume, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.3);
    } catch (error) {
      console.error('Failed to play notification sound:', error);
    }
  };

  // Show notification
  const showNotification = (notification: KitchenNotification) => {
    const { type, title, message, order, sound = true } = notification;

    // Play sound if enabled
    if (sound && soundEnabled) {
      playSound(type);
    }

    // Get icon based on type
    const getIcon = () => {
      switch (type) {
        case 'new_order':
          return <ChefHat className="w-5 h-5" />;
        case 'urgent':
          return <AlertCircle className="w-5 h-5" />;
        case 'success':
          return <CheckCircle className="w-5 h-5" />;
        case 'error':
          return <XCircle className="w-5 h-5" />;
        default:
          return <Bell className="w-5 h-5" />;
      }
    };

    // Show toast notification
    const toastId = toast[type === 'error' ? 'error' : type === 'success' ? 'success' : 'info'](
      title,
      {
        description: (
          <div className="space-y-2">
            <p>{message}</p>
            {order && (
              <div className="text-xs text-muted-foreground">
                <p>طلب رقم: {order.orderNumber}</p>
                {order.tableNumber && <p>طاولة: {order.tableNumber}</p>}
              </div>
            )}
          </div>
        ),
        icon: getIcon(),
        duration: type === 'urgent' ? 10000 : 5000,
        action: order
          ? {
              label: 'عرض',
              onClick: () => {
                if (onNotificationClick) {
                  onNotificationClick(notification);
                }
              },
            }
          : undefined,
        className:
          type === 'urgent'
            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
            : type === 'new_order'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : '',
      }
    );

    // Add to notification queue
    setNotificationQueue((prev) => [...prev, notification]);

    return toastId;
  };

  // Expose showNotification method via ref
  useEffect(() => {
    // Store reference to showNotification in window for external access
    (window as any).__kitchenNotification = showNotification;

    return () => {
      delete (window as any).__kitchenNotification;
    };
  }, [soundEnabled, volume, onNotificationClick]);

  return (
    <div className={className}>
      {/* Hidden component - notifications are shown via toast */}
    </div>
  );
};

// Hook for using notifications
export const useKitchenNotification = () => {
  const showNotification = (notification: Omit<KitchenNotification, 'id' | 'timestamp'>) => {
    const fullNotification: KitchenNotification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    };

    // Call the global notification function if available
    if ((window as any).__kitchenNotification) {
      (window as any).__kitchenNotification(fullNotification);
    } else {
      // Fallback to simple toast
      toast.info(notification.title, {
        description: notification.message,
      });
    }
  };

  const notifyNewOrder = (order: Order) => {
    showNotification({
      type: 'new_order',
      title: 'طلب جديد!',
      message: `تم استلام طلب جديد رقم ${order.orderNumber}`,
      order,
      sound: true,
    });
  };

  const notifyStatusUpdate = (order: Order, newStatus: string) => {
    showNotification({
      type: 'status_update',
      title: 'تحديث حالة الطلب',
      message: `تم تحديث حالة الطلب ${order.orderNumber} إلى ${newStatus}`,
      order,
      sound: false,
    });
  };

  const notifyUrgent = (message: string, order?: Order) => {
    showNotification({
      type: 'urgent',
      title: 'تنبيه عاجل!',
      message,
      order,
      sound: true,
    });
  };

  const notifySuccess = (message: string) => {
    showNotification({
      type: 'success',
      title: 'نجح',
      message,
      sound: false,
    });
  };

  const notifyError = (message: string) => {
    showNotification({
      type: 'error',
      title: 'خطأ',
      message,
      sound: false,
    });
  };

  return {
    showNotification,
    notifyNewOrder,
    notifyStatusUpdate,
    notifyUrgent,
    notifySuccess,
    notifyError,
  };
};
