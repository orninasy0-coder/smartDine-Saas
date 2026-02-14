/**
 * Funnel Tracking Hook
 * React hook for tracking conversion funnels
 */

import { useCallback, useEffect, useRef } from 'react';
import { trackFunnelStage } from '@/utils/analytics/funnels';
import { analyzeFunnel, type FunnelStageData } from '@/utils/analytics/funnelAnalysis';

export interface UseFunnelTrackingOptions {
  funnelName: string;
  autoTrack?: boolean;
  metadata?: Record<string, unknown>;
}

export function useFunnelTracking(options: UseFunnelTrackingOptions) {
  const { funnelName, autoTrack = false, metadata } = options;
  const trackedStages = useRef<Set<string>>(new Set());

  /**
   * Track a funnel stage
   */
  const trackStage = useCallback(
    (stage: string, stageMetadata?: Record<string, unknown>) => {
      trackFunnelStage(funnelName, stage, {
        ...metadata,
        ...stageMetadata,
      });
      trackedStages.current.add(stage);
    },
    [funnelName, metadata]
  );

  /**
   * Check if a stage has been tracked
   */
  const hasTrackedStage = useCallback((stage: string): boolean => {
    return trackedStages.current.has(stage);
  }, []);

  /**
   * Reset tracked stages
   */
  const resetTracking = useCallback(() => {
    trackedStages.current.clear();
  }, []);

  /**
   * Get all tracked stages
   */
  const getTrackedStages = useCallback((): string[] => {
    return Array.from(trackedStages.current);
  }, []);

  return {
    trackStage,
    hasTrackedStage,
    resetTracking,
    getTrackedStages,
  };
}

/**
 * Hook for analyzing funnel data
 */
export function useFunnelAnalysis(stages: FunnelStageData[]) {
  const analysis = analyzeFunnel(stages);

  return {
    analysis,
    stages: analysis.stages,
    dropOffPoints: analysis.dropOffPoints,
    criticalDropOffs: analysis.criticalDropOffs,
    conversionRate: analysis.overallConversionRate,
    totalUsers: analysis.totalUsers,
  };
}
