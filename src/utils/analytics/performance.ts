/**
 * Performance Monitoring
 * Track Core Web Vitals and page load performance metrics
 */

import type { WebVitalsMetric, PerformanceMetrics } from './types';

/**
 * Core Web Vitals thresholds (in milliseconds)
 * Based on Google's recommendations
 */
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
} as const;

/**
 * Get rating for a metric value
 */
function getRating(
  name: WebVitalsMetric['name'],
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Track Core Web Vitals using web-vitals library pattern
 */
export class PerformanceMonitor {
  private metrics: Map<string, WebVitalsMetric> = new Map();
  private onMetricCallback?: (metric: WebVitalsMetric) => void;
  private isInitialized = false;

  /**
   * Initialize performance monitoring
   */
  initialize(onMetric?: (metric: WebVitalsMetric) => void): void {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    this.onMetricCallback = onMetric;
    this.isInitialized = true;

    // Track Core Web Vitals
    this.trackCLS();
    this.trackFID();
    this.trackFCP();
    this.trackLCP();
    this.trackTTFB();
    this.trackINP();
  }

  /**
   * Track Cumulative Layout Shift (CLS)
   */
  private trackCLS(): void {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    let clsEntries: PerformanceEntry[] = [];

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Only count layout shifts without recent user input
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          clsEntries.push(entry);
        }
      }
    });

    observer.observe({ type: 'layout-shift', buffered: true });

    // Report CLS on page hide
    const reportCLS = () => {
      const metric: WebVitalsMetric = {
        name: 'CLS',
        value: clsValue,
        rating: getRating('CLS', clsValue),
        delta: clsValue,
        id: `v3-${Date.now()}-${Math.random()}`,
      };

      this.reportMetric(metric);
      observer.disconnect();
    };

    // Report on visibility change or page unload
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        reportCLS();
      }
    });

    window.addEventListener('pagehide', reportCLS);
  }

  /**
   * Track First Input Delay (FID)
   */
  private trackFID(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fidEntry = entry as PerformanceEventTiming;
        const value = fidEntry.processingStart - fidEntry.startTime;

        const metric: WebVitalsMetric = {
          name: 'FID',
          value,
          rating: getRating('FID', value),
          delta: value,
          id: `v3-${Date.now()}-${Math.random()}`,
        };

        this.reportMetric(metric);
        observer.disconnect();
      }
    });

    observer.observe({ type: 'first-input', buffered: true });
  }

  /**
   * Track First Contentful Paint (FCP)
   */
  private trackFCP(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          const value = entry.startTime;

          const metric: WebVitalsMetric = {
            name: 'FCP',
            value,
            rating: getRating('FCP', value),
            delta: value,
            id: `v3-${Date.now()}-${Math.random()}`,
          };

          this.reportMetric(metric);
          observer.disconnect();
        }
      }
    });

    observer.observe({ type: 'paint', buffered: true });
  }

  /**
   * Track Largest Contentful Paint (LCP)
   */
  private trackLCP(): void {
    if (!('PerformanceObserver' in window)) return;

    let lcpValue = 0;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      lcpValue = lastEntry.startTime;
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });

    // Report LCP on page hide
    const reportLCP = () => {
      if (lcpValue > 0) {
        const metric: WebVitalsMetric = {
          name: 'LCP',
          value: lcpValue,
          rating: getRating('LCP', lcpValue),
          delta: lcpValue,
          id: `v3-${Date.now()}-${Math.random()}`,
        };

        this.reportMetric(metric);
        observer.disconnect();
      }
    };

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        reportLCP();
      }
    });

    window.addEventListener('pagehide', reportLCP);
  }

  /**
   * Track Time to First Byte (TTFB)
   */
  private trackTTFB(): void {
    if (!('performance' in window) || !performance.getEntriesByType) return;

    const navigationEntry = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;

    if (navigationEntry) {
      const value = navigationEntry.responseStart - navigationEntry.requestStart;

      const metric: WebVitalsMetric = {
        name: 'TTFB',
        value,
        rating: getRating('TTFB', value),
        delta: value,
        id: `v3-${Date.now()}-${Math.random()}`,
        navigationType: navigationEntry.type,
      };

      this.reportMetric(metric);
    }
  }

  /**
   * Track Interaction to Next Paint (INP)
   */
  private trackINP(): void {
    if (!('PerformanceObserver' in window)) return;

    let maxDuration = 0;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const eventEntry = entry as PerformanceEventTiming;
        if (eventEntry.duration > maxDuration) {
          maxDuration = eventEntry.duration;
        }
      }
    });

    // Use event timing without durationThreshold for better compatibility
    try {
      observer.observe({ type: 'event', buffered: true });
    } catch (e) {
      // Fallback if event timing is not supported
      console.warn('[Performance] INP tracking not supported in this browser');
      return;
    }

    // Report INP on page hide
    const reportINP = () => {
      if (maxDuration > 0) {
        const metric: WebVitalsMetric = {
          name: 'INP',
          value: maxDuration,
          rating: getRating('INP', maxDuration),
          delta: maxDuration,
          id: `v3-${Date.now()}-${Math.random()}`,
        };

        this.reportMetric(metric);
        observer.disconnect();
      }
    };

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        reportINP();
      }
    });

    window.addEventListener('pagehide', reportINP);
  }

  /**
   * Report metric to callback
   */
  private reportMetric(metric: WebVitalsMetric): void {
    this.metrics.set(metric.name, metric);

    if (this.onMetricCallback) {
      this.onMetricCallback(metric);
    }
  }

  /**
   * Get all collected metrics
   */
  getMetrics(): Map<string, WebVitalsMetric> {
    return this.metrics;
  }

  /**
   * Get specific metric
   */
  getMetric(name: WebVitalsMetric['name']): WebVitalsMetric | undefined {
    return this.metrics.get(name);
  }

  /**
   * Collect page load performance metrics
   */
  collectPageLoadMetrics(): PerformanceMetrics | null {
    if (typeof window === 'undefined' || !performance.getEntriesByType) {
      return null;
    }

    const navigationEntry = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;

    if (!navigationEntry) {
      return null;
    }

    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find((entry) => entry.name === 'first-paint');

    const resourceEntries = performance.getEntriesByType('resource');
    const totalResourceSize = resourceEntries.reduce(
      (total, entry) => total + (entry as PerformanceResourceTiming).transferSize,
      0
    );

    // Get connection info if available
    const connection = (navigator as any).connection;

    const metrics: PerformanceMetrics = {
      // Core Web Vitals (from collected metrics)
      cls: this.metrics.get('CLS')?.value,
      fid: this.metrics.get('FID')?.value,
      fcp: this.metrics.get('FCP')?.value,
      lcp: this.metrics.get('LCP')?.value,
      ttfb: this.metrics.get('TTFB')?.value,
      inp: this.metrics.get('INP')?.value,

      // Page Load Metrics
      domContentLoaded: navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart,
      loadComplete: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
      firstPaint: firstPaint?.startTime,

      // Resource Timing
      resourceCount: resourceEntries.length,
      totalResourceSize,

      // Navigation Timing
      redirectTime: navigationEntry.redirectEnd - navigationEntry.redirectStart,
      dnsTime: navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
      tcpTime: navigationEntry.connectEnd - navigationEntry.connectStart,
      requestTime: navigationEntry.responseStart - navigationEntry.requestStart,
      responseTime: navigationEntry.responseEnd - navigationEntry.responseStart,
      domProcessingTime: navigationEntry.domComplete - navigationEntry.domInteractive,

      // Custom Metrics
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
      connectionType: connection?.effectiveType,
      deviceMemory: (navigator as any).deviceMemory,
    };

    return metrics;
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    webVitals: Record<string, WebVitalsMetric>;
    pageLoad: PerformanceMetrics | null;
  } {
    const webVitals: Record<string, WebVitalsMetric> = {};
    this.metrics.forEach((metric, name) => {
      webVitals[name] = metric;
    });

    return {
      webVitals,
      pageLoad: this.collectPageLoadMetrics(),
    };
  }
}

/**
 * Create a singleton instance
 */
export const performanceMonitor = new PerformanceMonitor();
