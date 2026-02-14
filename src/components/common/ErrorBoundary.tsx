import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorBoundaryProps {
  children: ReactNode;
  /**
   * Fallback component to render on error
   */
  fallback?: ReactNode;
  /**
   * Callback when an error occurs
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /**
   * Enable retry functionality
   * @default true
   */
  enableRetry?: boolean;
  /**
   * Enable home navigation button
   * @default true
   */
  enableHomeButton?: boolean;
  /**
   * Custom error message
   */
  errorMessage?: string;
  /**
   * Custom error title
   */
  errorTitle?: string;
  /**
   * Maximum retry attempts before disabling retry button
   * @default 3
   */
  maxRetries?: number;
  /**
   * Reset error boundary when children change
   * @default false
   */
  resetOnPropsChange?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

/**
 * ErrorBoundary - General-purpose error boundary component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 * 
 * @example With custom error handling
 * ```tsx
 * <ErrorBoundary
 *   onError={(error, errorInfo) => {
 *     logErrorToService(error, errorInfo);
 *   }}
 *   errorTitle="Oops! Something went wrong"
 *   errorMessage="We're working on fixing this issue."
 * >
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorBoundary:', error);
      console.error('Error info:', errorInfo);
      console.error('Component stack:', errorInfo.componentStack);
    }

    // In production, you might want to log to an error tracking service
    // Example: logErrorToService(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset error boundary when children change (if enabled)
    if (
      this.props.resetOnPropsChange &&
      this.state.hasError &&
      prevProps.children !== this.props.children
    ) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
      });
    }
  }

  handleRetry = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    const { hasError, error, retryCount } = this.state;
    const {
      children,
      fallback,
      enableRetry = true,
      enableHomeButton = true,
      errorMessage,
      errorTitle,
      maxRetries = 3,
    } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      const defaultErrorTitle = errorTitle || 'Something went wrong';
      const defaultErrorMessage =
        errorMessage ||
        error?.message ||
        'An unexpected error occurred. Please try again or return to the home page.';

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-md border-destructive/20">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-destructive/10 rounded-full">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <CardTitle className="text-xl">{defaultErrorTitle}</CardTitle>
              </div>
              <CardDescription className="text-base">
                {defaultErrorMessage}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {process.env.NODE_ENV === 'development' && error && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm font-semibold text-muted-foreground mb-2">
                    Error Details (Development Only):
                  </p>
                  <pre className="text-xs text-destructive overflow-auto max-h-32">
                    {error.toString()}
                  </pre>
                </div>
              )}

              {retryCount > 0 && (
                <p className="text-sm text-muted-foreground mt-4">
                  Retry attempt: {retryCount} of {maxRetries}
                </p>
              )}

              {retryCount >= maxRetries && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">
                    Maximum retry attempts reached. Please try again later or contact support if
                    the problem persists.
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex gap-2">
              {enableRetry && retryCount < maxRetries && (
                <Button onClick={this.handleRetry} variant="default" className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              )}

              {enableHomeButton && (
                <Button
                  onClick={this.handleGoHome}
                  variant={enableRetry && retryCount < maxRetries ? 'outline' : 'default'}
                  className="flex-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      );
    }

    return children;
  }
}
