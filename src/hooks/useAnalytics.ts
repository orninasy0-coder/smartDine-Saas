/**
 * useAnalytics Hook
 * React hook for analytics tracking
 */

import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/utils/analytics';
import type {
  CustomEvent,
  UserProperties,
  ConversionEvent,
  FeatureAdoptionEvent,
  UserBehaviorEvent,
} from '@/utils/analytics';

/**
 * Hook to initialize and use analytics
 */
export function useAnalytics() {
  const location = useLocation();

  // Initialize analytics on mount
  useEffect(() => {
    analytics.initialize();
  }, []);

  // Track page views on route change
  useEffect(() => {
    analytics.trackPageView({
      path: location.pathname,
      title: document.title,
      referrer: document.referrer,
    });
  }, [location.pathname]);

  // Track custom event
  const trackEvent = useCallback((event: CustomEvent) => {
    analytics.trackEvent(event);
  }, []);

  // Set user properties
  const setUserProperties = useCallback((properties: UserProperties) => {
    analytics.setUserProperties(properties);
  }, []);

  // Track conversion
  const trackConversion = useCallback((event: ConversionEvent) => {
    analytics.trackConversion(event);
  }, []);

  // Track feature adoption
  const trackFeatureAdoption = useCallback((event: FeatureAdoptionEvent) => {
    analytics.trackFeatureAdoption(event);
  }, []);

  // Track user behavior
  const trackUserBehavior = useCallback((event: UserBehaviorEvent) => {
    analytics.trackUserBehavior(event);
  }, []);

  // Reset analytics (on logout)
  const reset = useCallback(() => {
    analytics.reset();
  }, []);

  // Check feature flag
  const isFeatureEnabled = useCallback((featureName: string) => {
    return analytics.isFeatureEnabled(featureName);
  }, []);

  return {
    trackEvent,
    setUserProperties,
    trackConversion,
    trackFeatureAdoption,
    trackUserBehavior,
    reset,
    isFeatureEnabled,
  };
}
