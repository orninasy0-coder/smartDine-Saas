/**
 * Google Analytics Provider
 * Integration with Google Analytics 4 (GA4)
 */

import type {
  PageViewEvent,
  CustomEvent,
  UserProperties,
  ConversionEvent,
  FeatureAdoptionEvent,
  UserBehaviorEvent,
} from '../types';

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

export class GoogleAnalyticsProvider {
  private measurementId: string;
  private isInitialized = false;
  private debug: boolean;

  constructor(measurementId: string, debug = false) {
    this.measurementId = measurementId;
    this.debug = debug;
  }

  /**
   * Initialize Google Analytics
   */
  initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      // Create gtag script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      document.head.appendChild(script);

      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer?.push(arguments);
      };

      window.gtag('js', new Date());
      window.gtag('config', this.measurementId, {
        send_page_view: false, // We'll handle page views manually
      });

      this.isInitialized = true;

      if (this.debug) {
        console.log('[Analytics] Google Analytics initialized:', this.measurementId);
      }
    } catch (error) {
      console.error('[Analytics] Failed to initialize Google Analytics:', error);
    }
  }

  /**
   * Track page view
   */
  trackPageView(event: PageViewEvent): void {
    if (!this.isInitialized || !window.gtag) {
      return;
    }

    try {
      window.gtag('event', 'page_view', {
        page_path: event.path,
        page_title: event.title,
        page_referrer: event.referrer,
      });

      if (this.debug) {
        console.log('[Analytics] Page view tracked:', event);
      }
    } catch (error) {
      console.error('[Analytics] Failed to track page view:', error);
    }
  }

  /**
   * Track custom event
   */
  trackEvent(event: CustomEvent): void {
    if (!this.isInitialized || !window.gtag) {
      return;
    }

    try {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.metadata,
      });

      if (this.debug) {
        console.log('[Analytics] Event tracked:', event);
      }
    } catch (error) {
      console.error('[Analytics] Failed to track event:', error);
    }
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: UserProperties): void {
    if (!this.isInitialized || !window.gtag) {
      return;
    }

    try {
      if (properties.userId) {
        window.gtag('config', this.measurementId, {
          user_id: properties.userId,
        });
      }

      window.gtag('set', 'user_properties', properties);

      if (this.debug) {
        console.log('[Analytics] User properties set:', properties);
      }
    } catch (error) {
      console.error('[Analytics] Failed to set user properties:', error);
    }
  }

  /**
   * Track conversion event
   */
  trackConversion(event: ConversionEvent): void {
    if (!this.isInitialized || !window.gtag) {
      return;
    }

    try {
      window.gtag('event', event.eventName, {
        value: event.value,
        currency: event.currency || 'USD',
        transaction_id: event.transactionId,
        items: event.items,
      });

      if (this.debug) {
        console.log('[Analytics] Conversion tracked:', event);
      }
    } catch (error) {
      console.error('[Analytics] Failed to track conversion:', error);
    }
  }

  /**
   * Track feature adoption
   */
  trackFeatureAdoption(event: FeatureAdoptionEvent): void {
    if (!this.isInitialized || !window.gtag) {
      return;
    }

    try {
      window.gtag('event', 'feature_adoption', {
        feature_name: event.featureName,
        action: event.action,
        ...event.metadata,
      });

      if (this.debug) {
        console.log('[Analytics] Feature adoption tracked:', event);
      }
    } catch (error) {
      console.error('[Analytics] Failed to track feature adoption:', error);
    }
  }

  /**
   * Track user behavior
   */
  trackUserBehavior(event: UserBehaviorEvent): void {
    if (!this.isInitialized || !window.gtag) {
      return;
    }

    try {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        duration: event.duration,
        ...event.metadata,
      });

      if (this.debug) {
        console.log('[Analytics] User behavior tracked:', event);
      }
    } catch (error) {
      console.error('[Analytics] Failed to track user behavior:', error);
    }
  }
}
