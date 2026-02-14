/**
 * Analytics Module
 * Central export for all analytics functionality
 */

import { AnalyticsManager } from './analyticsManager';
import { sessionReplay } from './sessionReplay';
import { interactionTracker } from './interactionTracking';
import { errorTracker } from './errorTracking';
import { frictionDetector } from './frictionDetection';
import type { AnalyticsConfig } from './types';

// Default configuration
const defaultConfig: AnalyticsConfig = {
  provider: 'posthog',
  debug: import.meta.env.DEV,
  postHog: {
    enabled: false,
    apiKey: import.meta.env.VITE_POSTHOG_API_KEY || '',
    apiHost: import.meta.env.VITE_POSTHOG_API_HOST,
  },
  googleAnalytics: {
    enabled: false,
    measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
  },
  sessionReplay: {
    enabled: false,
    provider: 'hotjar',
    hotjar: {
      siteId: parseInt(import.meta.env.VITE_HOTJAR_SITE_ID || '0'),
      version: 6,
    },
    fullstory: {
      orgId: import.meta.env.VITE_FULLSTORY_ORG_ID || '',
    },
    maskAllInputs: true,
    maskAllText: false,
    recordCrossOriginIframes: false,
  },
};

// Create analytics manager instance
export const analytics = new AnalyticsManager(defaultConfig);

// Initialize analytics with custom config
export function initializeAnalytics(config?: Partial<AnalyticsConfig>): void {
  const mergedConfig = {
    ...defaultConfig,
    ...config,
    postHog: { ...defaultConfig.postHog, ...config?.postHog },
    googleAnalytics: { ...defaultConfig.googleAnalytics, ...config?.googleAnalytics },
    sessionReplay: { ...defaultConfig.sessionReplay, ...config?.sessionReplay },
  };

  const manager = new AnalyticsManager(mergedConfig);
  manager.initialize();

  // Initialize interaction tracking if session replay is enabled
  if (mergedConfig.sessionReplay?.enabled) {
    interactionTracker.initialize();
    errorTracker.initialize();
    frictionDetector.initialize();
  }

  return;
}

// Re-export utilities
export { sessionReplay, interactionTracker, errorTracker, frictionDetector };

// Re-export types
export type * from './types';

// Re-export behavior tracking
export * from './behavior';

// Re-export funnel tracking
export * from './funnels';

// Re-export feature tracking
export * from './features';

// Re-export performance monitoring
export { performanceMonitor } from './performance';

// Re-export heatmap tracking
export * from './heatmaps';

// Re-export friction detection
export * from './frictionDetection';

// Re-export funnel analysis
export * from './funnelAnalysis';

// Re-export A/B testing
export * from './abTesting';

// Re-export user journey mapping
export * from './userJourney';

// Re-export cohort analysis
export * from './cohortAnalysis';
