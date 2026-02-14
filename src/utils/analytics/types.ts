/**
 * Analytics Types
 * Type definitions for analytics events and configuration
 */

export interface AnalyticsConfig {
  provider: 'google-analytics' | 'posthog';
  debug?: boolean;
  googleAnalytics?: {
    enabled: boolean;
    measurementId: string;
  };
  postHog?: {
    enabled: boolean;
    apiKey: string;
    apiHost?: string;
  };
  sessionReplay?: {
    enabled: boolean;
    provider: 'hotjar' | 'fullstory';
    hotjar?: {
      siteId: number;
      version: number;
    };
    fullstory?: {
      orgId: string;
    };
    maskAllInputs?: boolean;
    maskAllText?: boolean;
    recordCrossOriginIframes?: boolean;
  };
}

export interface PageViewEvent {
  path: string;
  title?: string;
  referrer?: string;
}

export interface CustomEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

export interface UserProperties {
  userId?: string;
  email?: string;
  name?: string;
  role?: string;
  plan?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface ConversionEvent {
  eventName: string;
  value?: number;
  currency?: string;
  transactionId?: string;
  items?: Array<{
    id: string;
    name: string;
    category?: string;
    price?: number;
    quantity?: number;
  }>;
}

export interface FeatureAdoptionEvent {
  featureName: string;
  action: 'discovered' | 'activated' | 'used' | 'abandoned';
  metadata?: Record<string, unknown>;
}

export interface UserBehaviorEvent {
  action: string;
  category: string;
  label?: string;
  duration?: number;
  metadata?: Record<string, unknown>;
}

export interface WebVitalsMetric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: 'navigate' | 'reload' | 'back-forward' | 'prerender';
}

export interface SessionReplayEvent {
  type: 'error' | 'interaction' | 'navigation' | 'custom';
  message: string;
  metadata?: Record<string, unknown>;
}
