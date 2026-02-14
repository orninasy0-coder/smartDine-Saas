/**
 * Error Tracking for Session Replay
 * Automatic error capture and session replay integration
 */

import { sessionReplay } from './sessionReplay';

export interface ErrorContext {
  componentStack?: string;
  errorBoundary?: string;
  userAction?: string;
  route?: string;
  [key: string]: unknown;
}

export interface ErrorTrackingConfig {
  captureUnhandledErrors?: boolean;
  captureUnhandledRejections?: boolean;
  captureConsoleErrors?: boolean;
  captureNetworkErrors?: boolean;
  beforeCapture?: (error: Error, context: ErrorContext) => boolean | void;
  afterCapture?: (error: Error, context: ErrorContext) => void;
}

const DEFAULT_CONFIG: Required<Omit<ErrorTrackingConfig, 'beforeCapture' | 'afterCapture'>> = {
  captureUnhandledErrors: true,
  captureUnhandledRejections: true,
  captureConsoleErrors: true,
  captureNetworkErrors: true,
};

export class ErrorTracker {
  private config: ErrorTrackingConfig;
  private isInitialized = false;
  private errorCount = 0;
  private lastErrors: Array<{ error: Error; timestamp: number }> = [];
  private maxErrorHistory = 10;
  private originalConsoleError?: typeof console.error;
  private originalFetch?: typeof fetch;

  constructor(config: ErrorTrackingConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize error tracking
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }

    // Capture unhandled errors
    if (this.config.captureUnhandledErrors) {
      window.addEventListener('error', this.handleError.bind(this));
    }

    // Capture unhandled promise rejections
    if (this.config.captureUnhandledRejections) {
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    }

    // Capture console errors
    if (this.config.captureConsoleErrors) {
      this.interceptConsoleError();
    }

    // Capture network errors
    if (this.config.captureNetworkErrors) {
      this.interceptFetch();
    }

    this.isInitialized = true;
    console.log('[ErrorTracker] Initialized');
  }

  /**
   * Handle error events
   */
  private handleError(event: ErrorEvent): void {
    const error = event.error || new Error(event.message);
    const context: ErrorContext = {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      type: 'unhandled_error',
      route: window.location.pathname,
    };

    this.captureError(error, context);
  }

  /**
   * Handle unhandled promise rejections
   */
  private handleUnhandledRejection(event: PromiseRejectionEvent): void {
    const error =
      event.reason instanceof Error ? event.reason : new Error(String(event.reason));

    const context: ErrorContext = {
      type: 'unhandled_rejection',
      reason: event.reason,
      route: window.location.pathname,
    };

    this.captureError(error, context);
  }

  /**
   * Intercept console.error
   */
  private interceptConsoleError(): void {
    this.originalConsoleError = console.error;

    console.error = (...args: unknown[]) => {
      // Call original console.error
      this.originalConsoleError?.apply(console, args);

      // Extract error from arguments
      const error = args.find((arg) => arg instanceof Error) as Error | undefined;

      if (error) {
        const context: ErrorContext = {
          type: 'console_error',
          arguments: args.map((arg) => String(arg)),
          route: window.location.pathname,
        };

        this.captureError(error, context);
      }
    };
  }

  /**
   * Intercept fetch for network error tracking
   */
  private interceptFetch(): void {
    this.originalFetch = window.fetch;

    window.fetch = async (...args: Parameters<typeof fetch>): Promise<Response> => {
      const startTime = Date.now();
      const url = typeof args[0] === 'string' ? args[0] : args[0].url;

      try {
        const response = await this.originalFetch!.apply(window, args);

        // Track failed HTTP responses
        if (!response.ok) {
          const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
          const context: ErrorContext = {
            type: 'network_error',
            url,
            status: response.status,
            statusText: response.statusText,
            duration: Date.now() - startTime,
            route: window.location.pathname,
          };

          this.captureError(error, context);
        }

        return response;
      } catch (error) {
        // Track network failures
        const networkError = error instanceof Error ? error : new Error(String(error));
        const context: ErrorContext = {
          type: 'network_failure',
          url,
          duration: Date.now() - startTime,
          route: window.location.pathname,
        };

        this.captureError(networkError, context);
        throw error;
      }
    };
  }

  /**
   * Capture and track error
   */
  captureError(error: Error, context: ErrorContext = {}): void {
    // Check if we should capture this error
    if (this.config.beforeCapture) {
      const shouldCapture = this.config.beforeCapture(error, context);
      if (shouldCapture === false) {
        return;
      }
    }

    // Add to error history
    this.errorCount++;
    this.lastErrors.push({ error, timestamp: Date.now() });

    // Keep only recent errors
    if (this.lastErrors.length > this.maxErrorHistory) {
      this.lastErrors.shift();
    }

    // Enrich context with additional info
    const enrichedContext: ErrorContext = {
      ...context,
      errorCount: this.errorCount,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };

    // Track in session replay
    sessionReplay.trackError(error, enrichedContext);

    // Tag recording for easier filtering
    const tags = ['error'];
    if (context.type) {
      tags.push(context.type as string);
    }
    if (this.isErrorStorm()) {
      tags.push('error-storm');
    }
    sessionReplay.tagRecording(tags);

    // Call after capture hook
    if (this.config.afterCapture) {
      this.config.afterCapture(error, enrichedContext);
    }

    console.log('[ErrorTracker] Error captured:', error.message, enrichedContext);
  }

  /**
   * Manually track error from React Error Boundary
   */
  captureReactError(error: Error, errorInfo: { componentStack: string }): void {
    const context: ErrorContext = {
      type: 'react_error_boundary',
      componentStack: errorInfo.componentStack,
      route: window.location.pathname,
    };

    this.captureError(error, context);
  }

  /**
   * Track error with user action context
   */
  captureErrorWithAction(error: Error, userAction: string, metadata?: Record<string, unknown>): void {
    const context: ErrorContext = {
      type: 'user_action_error',
      userAction,
      ...metadata,
      route: window.location.pathname,
    };

    this.captureError(error, context);
  }

  /**
   * Check if we're experiencing an error storm
   */
  private isErrorStorm(): boolean {
    const now = Date.now();
    const recentErrors = this.lastErrors.filter((e) => now - e.timestamp < 10000); // Last 10 seconds
    return recentErrors.length >= 5;
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    totalErrors: number;
    recentErrors: number;
    lastError?: { message: string; timestamp: number };
  } {
    const now = Date.now();
    const recentErrors = this.lastErrors.filter((e) => now - e.timestamp < 60000); // Last minute

    return {
      totalErrors: this.errorCount,
      recentErrors: recentErrors.length,
      lastError: this.lastErrors.length
        ? {
            message: this.lastErrors[this.lastErrors.length - 1].error.message,
            timestamp: this.lastErrors[this.lastErrors.length - 1].timestamp,
          }
        : undefined,
    };
  }

  /**
   * Clear error history
   */
  clearHistory(): void {
    this.lastErrors = [];
    this.errorCount = 0;
  }

  /**
   * Destroy tracker and restore original functions
   */
  destroy(): void {
    if (this.config.captureUnhandledErrors) {
      window.removeEventListener('error', this.handleError.bind(this));
    }

    if (this.config.captureUnhandledRejections) {
      window.removeEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    }

    if (this.originalConsoleError) {
      console.error = this.originalConsoleError;
    }

    if (this.originalFetch) {
      window.fetch = this.originalFetch;
    }

    this.isInitialized = false;
    console.log('[ErrorTracker] Destroyed');
  }
}

// Export singleton instance
export const errorTracker = new ErrorTracker();
