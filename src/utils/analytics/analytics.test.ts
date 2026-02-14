/**
 * Analytics Tests
 * Basic tests for analytics functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AnalyticsManager } from './analyticsManager';
import type { AnalyticsConfig } from './types';

// Mock window object for tests
global.window = global.window || ({} as Window & typeof globalThis);

describe('Analytics Manager', () => {
  let analyticsManager: AnalyticsManager;
  let mockConfig: AnalyticsConfig;

  beforeEach(() => {
    mockConfig = {
      provider: 'google-analytics',
      googleAnalytics: {
        measurementId: 'G-TEST123',
        enabled: true,
      },
      debug: true,
    };

    analyticsManager = new AnalyticsManager(mockConfig);
  });

  it('should create analytics manager instance', () => {
    expect(analyticsManager).toBeDefined();
    expect(analyticsManager).toBeInstanceOf(AnalyticsManager);
  });

  it('should track page view without errors', () => {
    expect(() => {
      analyticsManager.trackPageView({
        path: '/test',
        title: 'Test Page',
      });
    }).not.toThrow();
  });

  it('should track custom event without errors', () => {
    expect(() => {
      analyticsManager.trackEvent({
        category: 'test',
        action: 'test_action',
        label: 'test_label',
      });
    }).not.toThrow();
  });

  it('should set user properties without errors', () => {
    expect(() => {
      analyticsManager.setUserProperties({
        userId: 'test-user-123',
        userRole: 'restaurant_owner',
      });
    }).not.toThrow();
  });

  it('should track conversion without errors', () => {
    expect(() => {
      analyticsManager.trackConversion({
        eventName: 'purchase',
        value: 99.99,
        currency: 'USD',
        transactionId: 'test-order-123',
      });
    }).not.toThrow();
  });

  it('should track feature adoption without errors', () => {
    expect(() => {
      analyticsManager.trackFeatureAdoption({
        featureName: 'ai_assistant',
        action: 'used',
      });
    }).not.toThrow();
  });

  it('should track user behavior without errors', () => {
    expect(() => {
      analyticsManager.trackUserBehavior({
        action: 'button_click',
        category: 'interaction',
        label: 'signup_button',
      });
    }).not.toThrow();
  });

  it('should handle PostHog configuration', () => {
    const postHogConfig: AnalyticsConfig = {
      provider: 'posthog',
      postHog: {
        apiKey: 'phc_test123',
        apiHost: 'https://app.posthog.com',
        enabled: true,
      },
      debug: true,
    };

    const postHogManager = new AnalyticsManager(postHogConfig);
    expect(postHogManager).toBeDefined();
  });

  it('should handle disabled analytics', () => {
    const disabledConfig: AnalyticsConfig = {
      provider: 'none',
      debug: false,
    };

    const disabledManager = new AnalyticsManager(disabledConfig);
    
    // Should not throw even when tracking
    expect(() => {
      disabledManager.trackPageView({ path: '/test', title: 'Test' });
      disabledManager.trackEvent({ category: 'test', action: 'test' });
    }).not.toThrow();
  });
});

describe('Analytics Types', () => {
  it('should have correct type definitions', () => {
    const pageViewEvent = {
      path: '/test',
      title: 'Test Page',
      referrer: 'https://example.com',
    };

    expect(pageViewEvent).toHaveProperty('path');
    expect(pageViewEvent).toHaveProperty('title');
    expect(pageViewEvent).toHaveProperty('referrer');
  });

  it('should have correct custom event structure', () => {
    const customEvent = {
      category: 'button',
      action: 'click',
      label: 'signup',
      value: 1,
      metadata: { location: 'header' },
    };

    expect(customEvent).toHaveProperty('category');
    expect(customEvent).toHaveProperty('action');
    expect(customEvent).toHaveProperty('label');
    expect(customEvent).toHaveProperty('value');
    expect(customEvent).toHaveProperty('metadata');
  });
});
