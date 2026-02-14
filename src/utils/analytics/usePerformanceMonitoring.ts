/**
 * usePerformanceMonitoring Hook
 * React hook for tracking performance metrics
 */

import { useEffect } from 'react';
import { analytics } from './index';

/**
 * Hook to automatically track page load performance
 */
export function usePerformanceMonitoring() {
  useEffect(() => {
    // Track page load metrics when component mounts
    analytics.trackPageLoadMetrics();
  }, []);
}

/**
 * Hook to get performance summary
 */
export function usePerformanceSummary() {
  return analytics.getPerformanceSummary();
}
