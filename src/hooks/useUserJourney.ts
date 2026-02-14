/**
 * User Journey Hook
 * React hook for tracking user journeys
 */

import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { userJourneyTracker } from '@/utils/analytics/userJourney';
import type { JourneyPath } from '@/utils/analytics/userJourney';

interface UseUserJourneyOptions {
  enabled?: boolean;
  trackPageViews?: boolean;
  sessionId?: string;
  userId?: string;
  onJourneyEnd?: (journey: JourneyPath) => void;
}

export function useUserJourney(options: UseUserJourneyOptions = {}) {
  const {
    enabled = true,
    trackPageViews = true,
    sessionId,
    userId,
    onJourneyEnd,
  } = options;

  const location = useLocation();
  const previousPath = useRef<string>('');

  // Initialize tracker with session and user ID
  useEffect(() => {
    if (!enabled) return;

    if (sessionId) {
      userJourneyTracker['sessionId'] = sessionId;
    }

    if (userId) {
      userJourneyTracker.setUserId(userId);
    }
  }, [enabled, sessionId, userId]);

  // Track page views automatically
  useEffect(() => {
    if (!enabled || !trackPageViews) return;

    const currentPath = location.pathname;

    // Skip if same path
    if (currentPath === previousPath.current) return;

    // Track step
    userJourneyTracker.trackStep(currentPath, {
      search: location.search,
      hash: location.hash,
      state: location.state,
    });

    previousPath.current = currentPath;
  }, [enabled, trackPageViews, location]);

  // Track custom step
  const trackStep = useCallback(
    (path: string, metadata?: Record<string, unknown>) => {
      if (!enabled) return;
      userJourneyTracker.trackStep(path, metadata);
    },
    [enabled]
  );

  // End journey
  const endJourney = useCallback(
    (completed = false, exitPoint?: string) => {
      if (!enabled) return;

      const journey = userJourneyTracker.getCurrentJourney();
      userJourneyTracker.endJourney(completed, exitPoint);

      if (journey && onJourneyEnd) {
        onJourneyEnd(journey);
      }
    },
    [enabled, onJourneyEnd]
  );

  // Start new journey
  const startNewJourney = useCallback(() => {
    if (!enabled) return;
    userJourneyTracker.startNewJourney();
  }, [enabled]);

  // Get current journey
  const getCurrentJourney = useCallback(() => {
    if (!enabled) return null;
    return userJourneyTracker.getCurrentJourney();
  }, [enabled]);

  // Get journey history
  const getJourneyHistory = useCallback(() => {
    if (!enabled) return [];
    return userJourneyTracker.getJourneyHistory();
  }, [enabled]);

  // Analyze journeys
  const analyzeJourneys = useCallback(() => {
    if (!enabled) return null;
    return userJourneyTracker.analyzeJourneys();
  }, [enabled]);

  // Clear data
  const clearData = useCallback(() => {
    if (!enabled) return;
    userJourneyTracker.clearData();
  }, [enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (enabled && onJourneyEnd) {
        const journey = userJourneyTracker.getCurrentJourney();
        if (journey) {
          userJourneyTracker.endJourney(false, 'unmount');
          onJourneyEnd(journey);
        }
      }
    };
  }, [enabled, onJourneyEnd]);

  return {
    trackStep,
    endJourney,
    startNewJourney,
    getCurrentJourney,
    getJourneyHistory,
    analyzeJourneys,
    clearData,
  };
}
