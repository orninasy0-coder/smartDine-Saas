/**
 * OrderTracker Component
 * Displays real-time order status tracking with visual timeline
 * Shows current status and progress through order lifecycle
 */

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, ChefHat, Package, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { OrderStatus } from '@/utils/types';

interface OrderTrackerProps {
  status: OrderStatus;
  createdAt: string;
  className?: string;
}

interface StatusStep {
  status: OrderStatus;
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
}

const statusSteps: StatusStep[] = [
  {
    status: 'PENDING',
    icon: Clock,
    label: 'قيد الانتظار',
    description: 'تم استلام طلبك',
    color: 'text-yellow-500',
  },
  {
    status: 'PREPARING',
    icon: ChefHat,
    label: 'قيد التحضير',
    description: 'يتم تحضير طلبك',
    color: 'text-blue-500',
  },
  {
    status: 'READY',
    icon: Package,
    label: 'جاهز',
    description: 'طلبك جاهز',
    color: 'text-green-500',
  },
  {
    status: 'DELIVERED',
    icon: CheckCircle,
    label: 'تم التوصيل',
    description: 'تم توصيل طلبك',
    color: 'text-green-600',
  },
];

const getStatusIndex = (status: OrderStatus): number => {
  if (status === 'CANCELLED') return -1;
  return statusSteps.findIndex((step) => step.status === status);
};

const isStepCompleted = (stepIndex: number, currentStatus: OrderStatus): boolean => {
  if (currentStatus === 'CANCELLED') return false;
  const currentIndex = getStatusIndex(currentStatus);
  return stepIndex <= currentIndex;
};

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  status,
  createdAt,
  className = '',
}) => {
  const currentStatusIndex = getStatusIndex(status);
  const isCancelled = status === 'CANCELLED';

  // Get current status info
  const currentStatusInfo = isCancelled
    ? {
        icon: XCircle,
        label: 'ملغي',
        description: 'تم إلغاء الطلب',
        color: 'text-red-500',
      }
    : statusSteps[currentStatusIndex];

  return (
    <Card className={`p-6 ${className}`}>
      {/* Current Status Header */}
      <div className="flex items-center gap-4 mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className={`p-3 rounded-full bg-muted ${currentStatusInfo.color}`}
        >
          <currentStatusInfo.icon className="w-6 h-6" />
        </motion.div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-1">{currentStatusInfo.label}</h2>
          <p className="text-muted-foreground">{currentStatusInfo.description}</p>
        </div>
      </div>

      {/* Status Timeline */}
      {!isCancelled && (
        <div className="space-y-4">
          {statusSteps.map((step, index) => {
            const isCompleted = isStepCompleted(index, status);
            const isCurrent = index === currentStatusIndex;

            return (
              <motion.div
                key={step.status}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                {/* Status Indicator */}
                <div className="relative flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className={`w-3 h-3 rounded-full ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                  {index < statusSteps.length - 1 && (
                    <div
                      className={`w-0.5 h-12 mt-1 ${
                        isCompleted && index < currentStatusIndex
                          ? 'bg-green-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  )}
                </div>

                {/* Status Info */}
                <div className="flex-1 pb-4">
                  <p
                    className={`font-medium ${
                      isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isCompleted
                      ? index === 0
                        ? new Date(createdAt).toLocaleString('ar-SA')
                        : isCurrent
                          ? 'جاري التنفيذ'
                          : 'مكتمل'
                      : 'في انتظار التنفيذ'}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Cancelled Status */}
      {isCancelled && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">
            تم إلغاء هذا الطلب. إذا كان لديك أي استفسار، يرجى التواصل مع المطعم.
          </p>
        </div>
      )}

      {/* Estimated Time (for non-completed orders) */}
      {!isCancelled && status !== 'DELIVERED' && (
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium">الوقت المتوقع</p>
          </div>
          <p className="text-2xl font-bold">
            {status === 'PENDING' && '20-30 دقيقة'}
            {status === 'PREPARING' && '15-20 دقيقة'}
            {status === 'READY' && '5-10 دقائق'}
          </p>
        </div>
      )}
    </Card>
  );
};
