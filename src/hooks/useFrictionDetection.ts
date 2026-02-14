/**
 * useFrictionDetection Hook
 * React hook for UX friction detection
 */

import { useEffect, useCallback, useState } from 'react';
import { frictionDetector, type FrictionEvent, type FrictionDetectionConfig } from '@/utils/analytics/frictionDetection';

export interface UseFrictionDetectionOptions extends FrictionDetectionConfig {
  enabled?: boolean;
  autoInitialize?: boolean;
}

export interface FrictionSummary {
  total: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
}

export function useFrictionDetection(options: UseFrictionDetectionOptions = {}) {
  const {
    enabled = true,
    autoInitialize = true,
    ...config
  } = options;

  const [frictionEvents, setFrictionEvents] = useState<FrictionEvent[]>([]);
  const [summary, setSummary] = useState<FrictionSummary>({
    total: 0,
    byType: {},
    bySeverity: {},
  });

  // Initialize friction detector
  useEffect(() => {
    if (!enabled || !autoInitialize) {
      return;
    }

    // Configure friction detector
    const detector = new (frictionDetector.constructor as any)({
      ...config,
      onFrictionDetected: (event: FrictionEvent) => {
        setFrictionEvents(prev => [...prev, event]);
        
        // Call custom handler if provided
        if (config.onFrictionDetected) {
          config.onFrictionDetected(event);
        }
      },
    });

    detector.initialize();

    return () => {
      detector.destroy();
    };
  }, [enabled, autoInitialize, config]);

  // Update summary when events change
  useEffect(() => {
    const newSummary = {
      total: frictionEvents.length,
      byType: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>,
    };

    frictionEvents.forEach(event => {
      newSummary.byType[event.type] = (newSummary.byType[event.type] || 0) + 1;
      newSummary.bySeverity[event.severity] = (newSummary.bySeverity[event.severity] || 0) + 1;
    });

    setSummary(newSummary);
  }, [frictionEvents]);

  // Get events by type
  const getEventsByType = useCallback((type: FrictionEvent['type']) => {
    return frictionEvents.filter(e => e.type === type);
  }, [frictionEvents]);

  // Get events by severity
  const getEventsBySeverity = useCallback((severity: FrictionEvent['severity']) => {
    return frictionEvents.filter(e => e.severity === severity);
  }, [frictionEvents]);

  // Clear events
  const clearEvents = useCallback(() => {
    setFrictionEvents([]);
    frictionDetector.clearEvents();
  }, []);

  // Get high severity events
  const getHighSeverityEvents = useCallback(() => {
    return frictionEvents.filter(e => e.severity === 'high');
  }, [frictionEvents]);

  return {
    frictionEvents,
    summary,
    getEventsByType,
    getEventsBySeverity,
    getHighSeverityEvents,
    clearEvents,
  };
}
