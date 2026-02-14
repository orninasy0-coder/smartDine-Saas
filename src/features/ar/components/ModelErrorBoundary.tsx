import { Component, ErrorInfo, ReactNode } from 'react';
import { Html } from '@react-three/drei';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ModelErrorBoundaryProps {
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
   * Custom error message
   */
  errorMessage?: string;
}

interface ModelErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

/**
 * ModelErrorBoundary - Error boundary specifically for 3D model loading
 * Catches errors during model loading and provides user-friendly error messages
 */
export class ModelErrorBoundary extends Component<
  ModelErrorBoundaryProps,
  ModelErrorBoundaryState
> {
  constructor(props: ModelErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ModelErrorBoundaryState> {
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
      console.error('Model loading error:', error);
      console.error('Error info:', errorInfo);
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

  render() {
    const { hasError, error, retryCount } = this.state;
    const { children, fallback, enableRetry = true, errorMessage } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default error UI
      const defaultErrorMessage =
        errorMessage ||
        error?.message ||
        'Failed to load 3D model. Please try again.';

      return (
        <Html center>
          <div className="flex flex-col items-center justify-center gap-4 p-6 bg-background/95 backdrop-blur-sm rounded-lg border border-destructive/20 shadow-lg max-w-sm">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-semibold text-lg">Model Load Error</h3>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              {defaultErrorMessage}
            </p>

            {retryCount > 0 && (
              <p className="text-xs text-muted-foreground">
                Retry attempt: {retryCount}
              </p>
            )}

            {enableRetry && retryCount < 3 && (
              <button
                onClick={this.handleRetry}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Loading
              </button>
            )}

            {retryCount >= 3 && (
              <p className="text-xs text-destructive">
                Maximum retry attempts reached. Please check the model URL or try
                again later.
              </p>
            )}
          </div>
        </Html>
      );
    }

    return children;
  }
}
