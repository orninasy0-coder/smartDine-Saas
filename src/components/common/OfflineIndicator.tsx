/**
 * OfflineIndicator Component - Network status indicator
 *
 * Displays a banner when the user loses internet connectivity.
 * Automatically detects online/offline status and shows/hides accordingly.
 */

import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OfflineIndicatorProps {
  /**
   * Position of the indicator
   * @default 'top'
   */
  position?: 'top' | 'bottom';
  /**
   * Custom className for styling
   */
  className?: string;
  /**
   * Show reconnection message when coming back online
   * @default true
   */
  showReconnected?: boolean;
  /**
   * Duration to show reconnected message (ms)
   * @default 3000
   */
  reconnectedDuration?: number;
}

/**
 * OfflineIndicator - Shows a banner when user is offline
 *
 * @example
 * ```tsx
 * import { OfflineIndicator } from '@/components/common';
 *
 * // Basic usage
 * <OfflineIndicator />
 *
 * // Bottom position
 * <OfflineIndicator position="bottom" />
 *
 * // Without reconnected message
 * <OfflineIndicator showReconnected={false} />
 * ```
 */
export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  position = 'top',
  className,
  showReconnected = true,
  reconnectedDuration = 3000,
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnectedMsg, setShowReconnectedMsg] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (showReconnected) {
        setShowReconnectedMsg(true);
        setTimeout(() => {
          setShowReconnectedMsg(false);
        }, reconnectedDuration);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnectedMsg(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showReconnected, reconnectedDuration]);

  // Don't render anything if online and not showing reconnected message
  if (isOnline && !showReconnectedMsg) {
    return null;
  }

  const positionClasses = {
    top: 'top-0',
    bottom: 'bottom-0',
  };

  const isOffline = !isOnline;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'fixed left-0 right-0 z-50 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium shadow-lg transition-all duration-300',
        positionClasses[position],
        isOffline
          ? 'bg-red-600 text-white'
          : 'bg-green-600 text-white',
        className
      )}
    >
      {isOffline ? (
        <>
          <WifiOff className="h-4 w-4" aria-hidden="true" />
          <span>You are currently offline. Some features may be unavailable.</span>
        </>
      ) : (
        <>
          <Wifi className="h-4 w-4" aria-hidden="true" />
          <span>Connection restored. You are back online.</span>
        </>
      )}
    </div>
  );
};
