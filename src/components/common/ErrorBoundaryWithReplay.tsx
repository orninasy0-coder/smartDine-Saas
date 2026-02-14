/**
 * Error Boundary with Session Replay Integration
 * Catches React errors and sends them to session replay
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { errorTracker } from '@/utils/analytics/errorTracking';
import { sessionReplay } from '@/utils/analytics/sessionReplay';

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showSessionUrl?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  sessionUrl?: string | null;
}

export class ErrorBoundaryWithReplay extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Track error in session replay
    errorTracker.captureReactError(error, errorInfo);

    // Get session URL if available
    const sessionUrl = sessionReplay.getSessionURL();

    this.setState({
      error,
      errorInfo,
      sessionUrl,
    });

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, sessionUrl: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Custom fallback
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback(this.state.error, this.state.errorInfo!);
        }
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="w-full max-w-md rounded-lg border border-destructive/50 bg-card p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-2 text-destructive">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h2 className="text-lg font-semibold">Something went wrong</h2>
            </div>

            <p className="mb-4 text-sm text-muted-foreground">
              We've encountered an unexpected error. Our team has been notified and will look into it.
            </p>

            <details className="mb-4 rounded border border-border bg-muted p-3">
              <summary className="cursor-pointer text-sm font-medium">Error Details</summary>
              <div className="mt-2 space-y-2 text-xs">
                <div>
                  <strong>Error:</strong>
                  <pre className="mt-1 overflow-auto rounded bg-background p-2">
                    {this.state.error.message}
                  </pre>
                </div>
                {this.state.errorInfo?.componentStack && (
                  <div>
                    <strong>Component Stack:</strong>
                    <pre className="mt-1 max-h-32 overflow-auto rounded bg-background p-2">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>

            {this.props.showSessionUrl && this.state.sessionUrl && (
              <div className="mb-4 rounded border border-border bg-muted p-3">
                <p className="mb-2 text-xs font-medium">Session Recording:</p>
                <a
                  href={this.state.sessionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  View Session Replay
                </a>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={this.handleReset}
                className="flex-1 rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 rounded border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
