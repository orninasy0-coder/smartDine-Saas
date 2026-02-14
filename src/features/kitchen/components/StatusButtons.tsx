/**
 * StatusButtons Component
 * Reusable status action buttons for kitchen orders
 * Handles status transitions: PENDING → PREPARING → READY
 */

import React from 'react';
import { ChefHat, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { OrderStatus } from '@/utils/types';

interface StatusButtonsProps {
  /** Current order status */
  status: OrderStatus;
  /** Callback when status should change */
  onStatusChange: (newStatus: 'PREPARING' | 'READY') => void;
  /** Whether the status update is in progress */
  isUpdating?: boolean;
  /** Button size variant */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** Additional CSS classes */
  className?: string;
  /** Whether to show buttons in full width */
  fullWidth?: boolean;
}

export const StatusButtons: React.FC<StatusButtonsProps> = ({
  status,
  onStatusChange,
  isUpdating = false,
  size = 'lg',
  className = '',
  fullWidth = true,
}) => {
  const isPending = status === 'PENDING';
  const isPreparing = status === 'PREPARING';
  const isReady = status === 'READY';
  const isDelivered = status === 'DELIVERED';
  const isCancelled = status === 'CANCELLED';

  // Don't show buttons for completed or cancelled orders
  if (isReady || isDelivered || isCancelled) {
    return null;
  }

  const handleMarkPreparing = () => {
    onStatusChange('PREPARING');
  };

  const handleMarkReady = () => {
    onStatusChange('READY');
  };

  return (
    <div className={`flex gap-3 ${className}`}>
      {isPending && (
        <Button
          onClick={handleMarkPreparing}
          disabled={isUpdating}
          className={fullWidth ? 'flex-1' : ''}
          size={size}
        >
          <ChefHat className="w-4 h-4 mr-2" />
          بدء التحضير
        </Button>
      )}

      {isPreparing && (
        <Button
          onClick={handleMarkReady}
          disabled={isUpdating}
          className={fullWidth ? 'flex-1' : ''}
          size={size}
          variant="default"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          جاهز للتقديم
        </Button>
      )}
    </div>
  );
};
