import { usePWA } from '@/hooks/usePWA';
import { Smartphone, Monitor, Wifi, WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface PWAStatusProps {
  showDisplayMode?: boolean;
  showOnlineStatus?: boolean;
  className?: string;
}

/**
 * PWA Status Indicator Component
 * Shows PWA installation status and online/offline state
 */
export const PWAStatus = ({
  showDisplayMode = true,
  showOnlineStatus = true,
  className = '',
}: PWAStatusProps) => {
  const { isInstalled, displayMode, isOnline } = usePWA();

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      {/* Display Mode Indicator */}
      {showDisplayMode && isInstalled && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
        >
          {displayMode === 'standalone' || displayMode === 'fullscreen' ? (
            <Smartphone className="h-3 w-3" />
          ) : (
            <Monitor className="h-3 w-3" />
          )}
          <span className="text-xs font-medium">
            {displayMode === 'standalone' ? 'App' : 'Browser'}
          </span>
        </motion.div>
      )}

      {/* Online/Offline Indicator */}
      {showOnlineStatus && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`flex items-center gap-1 px-2 py-1 rounded-full ${
            isOnline
              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
              : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
          }`}
        >
          {isOnline ? (
            <Wifi className="h-3 w-3" />
          ) : (
            <WifiOff className="h-3 w-3" />
          )}
          <span className="text-xs font-medium">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </motion.div>
      )}
    </div>
  );
};
