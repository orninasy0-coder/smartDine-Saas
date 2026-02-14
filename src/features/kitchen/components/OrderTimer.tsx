/**
 * OrderTimer Component
 * Displays elapsed time since order was placed
 * Updates every second to show real-time duration
 */

import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface OrderTimerProps {
  createdAt: string;
  className?: string;
}

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const getTimerColor = (seconds: number): string => {
  if (seconds < 600) return 'text-green-600 dark:text-green-400'; // < 10 min
  if (seconds < 1200) return 'text-yellow-600 dark:text-yellow-400'; // < 20 min
  return 'text-red-600 dark:text-red-400'; // >= 20 min
};

export const OrderTimer: React.FC<OrderTimerProps> = ({ createdAt, className = '' }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const calculateElapsed = () => {
      const now = new Date().getTime();
      const created = new Date(createdAt).getTime();
      const diff = Math.floor((now - created) / 1000);
      setElapsedSeconds(diff);
    };

    // Calculate immediately
    calculateElapsed();

    // Update every second
    const interval = setInterval(calculateElapsed, 1000);

    return () => clearInterval(interval);
  }, [createdAt]);

  const timerColor = getTimerColor(elapsedSeconds);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Clock className={`w-4 h-4 ${timerColor}`} />
      <span className={`font-mono text-sm font-medium ${timerColor}`}>
        {formatDuration(elapsedSeconds)}
      </span>
    </div>
  );
};
