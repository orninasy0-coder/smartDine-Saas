/**
 * PostHog Provider
 * Integration with PostHog analytics platform
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
    posthog?: {
      init: (apiKey: string, config: Record<string, unknown>) => void;
      capture: (eventName: string, properties?: Record<string, unknown>) => void;
      identify: (userId: string, properties?: Record<string, unknown>) => void;
      reset: () => void;
      register: (properties: Record<string, unknown>) => void;
      isFeatureEnabled: (featureName: string) => boolean;
    };
  }
}

export class PostHogProvider {
  private apiKey: string;
  private apiHost: string;
  private isInitialized = false;
  private debug: boolean;

  constructor(apiKey: string, apiHost = 'https://app.posthog.com', debug = false) {
    this.apiKey = apiKey;
    this.apiHost = apiHost;
    this.debug = debug;
  }

  /**
   * Initialize PostHog
   */
  initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      // Load PostHog script
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://cdn.posthog.com/array.js';
      
      script.onload = () => {
        if (window.posthog) {
          window.posthog.init(this.apiKey, {
            api_host: this.apiHost,
            capture_pageview: false, // We'll handle page views manually
            capture_pageleave: true,
            autocapture: false, // Disable automatic event capture
            disable_session_recording: false,
            enable_recording_console_log: this.debug,
          });

          this.isInitialized = true;

          if (this.debug) {
            console.log('[Analytics] PostHog initialized:', this.apiKey);
          }
        }
      };

      document.head.appendChild(script);
    } catch (error) {
      console.error('[Analytics] Failed to initialize PostHog:', error);
    }
  }

  /**
   * Track page view
   */
  trackPageView(event: PageViewEvent): void {
    if (!this.isInitialized || !window.posthog) {
      return;
    }

    try {
      window.posthog.capture('$pageview', {
        $current_url: window.location.href,
        $pathname: event.path,
        $title: event.title,
        $referrer: event.referrer,
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
    if (!this.isInitialized || !window.posthog) {
      return;
    }

    try {
      window.posthog.capture(event.action, {
        category: event.category,
        label: event.label,
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
    if (!this.isInitialized || !window.posthog) {
      return;
    }

    try {
      if (properties.userId) {
        window.posthog.identify(properties.userId, properties);
      } else {
        window.posthog.register(properties);
      }

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
    if (!this.isInitialized || !window.posthog) {
      return;
    }

    try {
      window.posthog.capture(event.eventName, {
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
    if (!this.isInitialized || !window.posthog) {
      return;
    }

    try {
      window.posthog.capture('feature_adoption', {
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
    if (!this.isInitialized || !window.posthog) {
      return;
    }

    try {
      window.posthog.capture(event.action, {
        category: event.category,
        label: event.label,
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

  /**
   * Reset user identity (on logout)
   */
  reset(): void {
    if (!this.isInitialized || !window.posthog) {
      return;
    }

    try {
      window.posthog.reset();

      if (this.debug) {
        console.log('[Analytics] User identity reset');
      }
    } catch (error) {
      console.error('[Analytics] Failed to reset user identity:', error);
    }
  }

  /**
   * Check if feature flag is enabled
   */
  isFeatureEnabled(featureName: string): boolean {
    if (!this.isInitialized || !window.posthog) {
      return false;
    }

    try {
      return window.posthog.isFeatureEnabled(featureName);
    } catch (error) {
      console.error('[Analytics] Failed to check feature flag:', error);
      return false;
    }
  }
}
