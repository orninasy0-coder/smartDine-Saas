/**
 * Analytics Manager
 * Central manager for all analytics providers
 */

import { GoogleAnalyticsProvider } from './providers/googleAnalytics';
import { PostHogProvider } from './providers/postHog';
import { performanceMonitor } from './performance';
import { SessionReplayManager } from './sessionReplay';
import type {
  AnalyticsConfig,
  PageViewEvent,
  CustomEvent,
  UserProperties,
  ConversionEvent,
  FeatureAdoptionEvent,
  UserBehaviorEvent,
  WebVitalsMetric,
} from './types';

export class AnalyticsManager {
  private googleAnalytics?: GoogleAnalyticsProvider;
  private postHog?: PostHogProvider;
  private sessionReplay?: SessionReplayManager;
  private config: AnalyticsConfig;
  private isInitialized = false;

  constructor(config: AnalyticsConfig) {
    this.config = config;
  }

  /**
   * Initialize analytics providers
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }

    // Initialize Google Analytics
    if (
      this.config.provider === 'google-analytics' &&
      this.config.googleAnalytics?.enabled &&
      this.config.googleAnalytics.measurementId
    ) {
      this.googleAnalytics = new GoogleAnalyticsProvider(
        this.config.googleAnalytics.measurementId,
        this.config.debug
      );
      this.googleAnalytics.initialize();
    }

    // Initialize PostHog
    if (
      this.config.provider === 'posthog' &&
      this.config.postHog?.enabled &&
      this.config.postHog.apiKey
    ) {
      this.postHog = new PostHogProvider(
        this.config.postHog.apiKey,
        this.config.postHog.apiHost,
        this.config.debug
      );
      this.postHog.initialize();
    }

    // Initialize Session Replay
    if (this.config.sessionReplay?.enabled) {
      this.sessionReplay = new SessionReplayManager(this.config.sessionReplay);
      this.sessionReplay.initialize();
    }

    // Initialize Performance Monitoring
    performanceMonitor.initialize((metric) => {
      this.trackWebVitals(metric);
    });

    this.isInitialized = true;

    if (this.config.debug) {
      console.log('[Analytics] Manager initialized with provider:', this.config.provider);
    }
  }

  /**
   * Track page view
   */
  trackPageView(event: PageViewEvent): void {
    if (!this.isInitialized) {
      return;
    }

    this.googleAnalytics?.trackPageView(event);
    this.postHog?.trackPageView(event);

    // Track navigation in session replay
    this.sessionReplay?.trackNavigation(event.path, {
      title: event.title,
      referrer: event.referrer,
    });
  }

  /**
   * Track custom event
   */
  trackEvent(event: CustomEvent): void {
    if (!this.isInitialized) {
      return;
    }

    this.googleAnalytics?.trackEvent(event);
    this.postHog?.trackEvent(event);
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: UserProperties): void {
    if (!this.isInitialized) {
      return;
    }

    this.googleAnalytics?.setUserProperties(properties);
    this.postHog?.setUserProperties(properties);

    // Identify user in session replay
    if (properties.userId) {
      this.sessionReplay?.identify(properties.userId, properties);
    }
  }

  /**
   * Track conversion event
   */
  trackConversion(event: ConversionEvent): void {
    if (!this.isInitialized) {
      return;
    }

    this.googleAnalytics?.trackConversion(event);
    this.postHog?.trackConversion(event);
  }

  /**
   * Track feature adoption
   */
  trackFeatureAdoption(event: FeatureAdoptionEvent): void {
    if (!this.isInitialized) {
      return;
    }

    this.googleAnalytics?.trackFeatureAdoption(event);
    this.postHog?.trackFeatureAdoption(event);
  }

  /**
   * Track user behavior
   */
  trackUserBehavior(event: UserBehaviorEvent): void {
    if (!this.isInitialized) {
      return;
    }

    this.googleAnalytics?.trackUserBehavior(event);
    this.postHog?.trackUserBehavior(event);
  }

  /**
   * Reset user identity (on logout)
   */
  reset(): void {
    if (!this.isInitialized) {
      return;
    }

    this.postHog?.reset();
  }

  /**
   * Check if feature flag is enabled (PostHog only)
   */
  isFeatureEnabled(featureName: string): boolean {
    if (!this.isInitialized) {
      return false;
    }

    return this.postHog?.isFeatureEnabled(featureName) || false;
  }

  /**
   * Track Web Vitals metric
   */
  private trackWebVitals(metric: WebVitalsMetric): void {
    if (!this.isInitialized) {
      return;
    }

    // Track as custom event
    this.trackEvent({
      category: 'Web Vitals',
      action: metric.name,
      label: metric.rating,
      value: Math.round(metric.value),
      metadata: {
        id: metric.id,
        delta: metric.delta,
        navigationType: metric.navigationType,
      },
    });

    if (this.config.debug) {
      console.log('[Analytics] Web Vitals tracked:', metric);
    }
  }

  /**
   * Track page load performance metrics
   */
  trackPageLoadMetrics(): void {
    if (!this.isInitialized) {
      return;
    }

    // Wait for page load to complete
    if (document.readyState !== 'complete') {
      window.addEventListener('load', () => {
        setTimeout(() => this.collectAndTrackMetrics(), 0);
      });
    } else {
      setTimeout(() => this.collectAndTrackMetrics(), 0);
    }
  }

  /**
   * Collect and track performance metrics
   */
  private collectAndTrackMetrics(): void {
    const metrics = performanceMonitor.collectPageLoadMetrics();

    if (!metrics) {
      return;
    }

    // Track page load time
    if (metrics.loadComplete) {
      this.trackEvent({
        category: 'Performance',
        action: 'page_load_complete',
        value: Math.round(metrics.loadComplete),
        metadata: {
          domContentLoaded: metrics.domContentLoaded,
          firstPaint: metrics.firstPaint,
          pageUrl: metrics.pageUrl,
        },
      });
    }

    // Track navigation timing
    this.trackEvent({
      category: 'Performance',
      action: 'navigation_timing',
      metadata: {
        redirectTime: metrics.redirectTime,
        dnsTime: metrics.dnsTime,
        tcpTime: metrics.tcpTime,
        requestTime: metrics.requestTime,
        responseTime: metrics.responseTime,
        domProcessingTime: metrics.domProcessingTime,
      },
    });

    // Track resource metrics
    this.trackEvent({
      category: 'Performance',
      action: 'resource_metrics',
      value: metrics.resourceCount,
      metadata: {
        totalResourceSize: metrics.totalResourceSize,
        connectionType: metrics.connectionType,
        deviceMemory: metrics.deviceMemory,
      },
    });

    if (this.config.debug) {
      console.log('[Analytics] Page load metrics tracked:', metrics);
    }
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    return performanceMonitor.getPerformanceSummary();
  }

  /**
   * Get session replay manager
   */
  getSessionReplay(): SessionReplayManager | undefined {
    return this.sessionReplay;
  }

  /**
   * Track error in session replay
   */
  trackError(error: Error, metadata?: Record<string, unknown>): void {
    if (!this.isInitialized) {
      return;
    }

    this.sessionReplay?.trackError(error, metadata);
  }
}
