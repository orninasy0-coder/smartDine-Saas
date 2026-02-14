/**
 * DeliveryTimer Component
 * Displays elapsed time since order was ready and estimated delivery time
 * Provides visual urgency indicators based on elapsed time
 * Updates in real-time every second
 */

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DeliveryTimerProps {
  /** Timestamp when order became ready (ISO string or Date) */
  readyAt: string | Date;
  /** Estimated delivery time in minutes (default: 30) */
  estimatedDeliveryMinutes?: number;
  /** Show compact version without labels */
  compact?: boolean;
  /** Additional CSS classes */
  className?: string;
}

interface TimeDisplay {
  hours: number;
  minutes: number;
  seconds: number;
  totalMinutes: number;
}

/**
 * Calculate elapsed time from ready timestamp
 */
const calculateElapsedTime = (readyAt: string | Date): TimeDisplay => {
  const now = new Date();
  const readyTime = new Date(readyAt);
  const diffMs = now.getTime() - readyTime.getTime();
  
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  return {
    hours,
    minutes,
    seconds,
    totalMinutes,
  };
};

/**
 * Format time display string
 */
const formatTimeDisplay = (time: TimeDisplay, compact: boolean = false): string => {
  const { hours, minutes, seconds } = time;

  if (compact) {
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  if (hours > 0) {
    return `${hours} ساعة و ${minutes} دقيقة`;
  }
  if (minutes > 0) {
    return `${minutes} دقيقة و ${seconds} ثانية`;
  }
  return `${seconds} ثانية`;
};

/**
 * Get urgency level based on elapsed time vs estimated delivery time
 */
const getUrgencyLevel = (
  elapsedMinutes: number,
  estimatedMinutes: number
): 'normal' | 'warning' | 'critical' => {
  const percentage = (elapsedMinutes / estimatedMinutes) * 100;

  if (percentage >= 100) return 'critical'; // Over estimated time
  if (percentage >= 75) return 'warning'; // 75% of estimated time
  return 'normal';
};

export const DeliveryTimer: React.FC<DeliveryTimerProps> = ({
  readyAt,
  estimatedDeliveryMinutes = 30,
  compact = false,
  className = '',
}) => {
  const [elapsedTime, setElapsedTime] = useState<TimeDisplay>(
    calculateElapsedTime(readyAt)
  );

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(calculateElapsedTime(readyAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [readyAt]);

  const urgencyLevel = getUrgencyLevel(
    elapsedTime.totalMinutes,
    estimatedDeliveryMinutes
  );

  // Calculate remaining time
  const remainingMinutes = Math.max(
    0,
    estimatedDeliveryMinutes - elapsedTime.totalMinutes
  );

  // Urgency styling
  const urgencyStyles = {
    normal: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-900 dark:text-green-100',
      icon: 'text-green-600 dark:text-green-400',
      badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    },
    warning: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      text: 'text-orange-900 dark:text-orange-100',
      icon: 'text-orange-600 dark:text-orange-400',
      badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    },
    critical: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-900 dark:text-red-100',
      icon: 'text-red-600 dark:text-red-400',
      badge: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    },
  };

  const styles = urgencyStyles[urgencyLevel];

  // Compact version
  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Clock className={cn('w-4 h-4', styles.icon)} />
        <span className={cn('text-sm font-mono font-semibold', styles.text)}>
          {formatTimeDisplay(elapsedTime, true)}
        </span>
        {urgencyLevel === 'critical' && (
          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 animate-pulse" />
        )}
      </div>
    );
  }

  // Full version
  return (
    <div
      className={cn(
        'p-4 rounded-lg border transition-colors',
        styles.bg,
        styles.border,
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Elapsed Time */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Clock className={cn('w-5 h-5', styles.icon)} />
            <span className={cn('text-sm font-medium', styles.text)}>
              الوقت المنقضي
            </span>
          </div>
          <p className={cn('text-2xl font-bold font-mono', styles.text)}>
            {formatTimeDisplay(elapsedTime)}
          </p>
        </div>

        {/* Urgency Badge */}
        <Badge className={styles.badge}>
          {urgencyLevel === 'normal' && (
            <>
              <CheckCircle className="w-3 h-3 mr-1" />
              في الوقت المحدد
            </>
          )}
          {urgencyLevel === 'warning' && (
            <>
              <AlertTriangle className="w-3 h-3 mr-1" />
              يقترب الموعد
            </>
          )}
          {urgencyLevel === 'critical' && (
            <>
              <AlertTriangle className="w-3 h-3 mr-1 animate-pulse" />
              متأخر
            </>
          )}
        </Badge>
      </div>

      {/* Estimated Time Info */}
      <div className="mt-3 pt-3 border-t border-current/10">
        <div className="flex items-center justify-between text-sm">
          <span className={cn('opacity-80', styles.text)}>
            الوقت المتوقع للتوصيل:
          </span>
          <span className={cn('font-semibold', styles.text)}>
            {estimatedDeliveryMinutes} دقيقة
          </span>
        </div>
        {remainingMinutes > 0 ? (
          <div className="flex items-center justify-between text-sm mt-1">
            <span className={cn('opacity-80', styles.text)}>
              الوقت المتبقي:
            </span>
            <span className={cn('font-semibold', styles.text)}>
              {remainingMinutes} دقيقة
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-2">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-semibold text-red-600 dark:text-red-400">
              تجاوز الوقت المتوقع بـ {Math.abs(remainingMinutes)} دقيقة
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-3">
        <div className="h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-1000',
              urgencyLevel === 'normal' && 'bg-green-600 dark:bg-green-400',
              urgencyLevel === 'warning' && 'bg-orange-600 dark:bg-orange-400',
              urgencyLevel === 'critical' && 'bg-red-600 dark:bg-red-400'
            )}
            style={{
              width: `${Math.min(
                100,
                (elapsedTime.totalMinutes / estimatedDeliveryMinutes) * 100
              )}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
