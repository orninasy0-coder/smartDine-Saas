/**
 * DataSuspense - Specialized Suspense wrapper for data-fetching components
 * 
 * Combines Suspense with ErrorBoundary for robust data loading handling.
 * Ideal for components that fetch data using React Query or similar libraries.
 */

import { Suspense, ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { Loading } from './Loading';

export interface DataSuspenseProps {
  /**
   * Children to render inside Suspense boundary
   */
  children: ReactNode;
  /**
   * Custom loading fallback
   */
  loadingFallback?: ReactNode;
  /**
   * Custom error fallback
   */
  errorFallback?: ReactNode;
  /**
   * Loading text to display
   */
  loadingText?: string;
  /**
   * Error message to display
   */
  errorMessage?: string;
  /**
   * Error title to display
   */
  errorTitle?: string;
  /**
   * Enable retry functionality on error
   * @default true
   */
  enableRetry?: boolean;
  /**
   * Callback when an error occurs
   */
  onError?: (error: Error) => void;
  /**
   * Whether to show a full-height container
   * @default false
   */
  fullHeight?: boolean;
}

/**
 * DataSuspense component
 * 
 * Wraps children with both Suspense (for loading states) and ErrorBoundary
 * (for error handling), providing a complete solution for async data components.
 * 
 * @example Basic usage
 * ```tsx
 * <DataSuspense loadingText="Loading users...">
 *   <UserList />
 * </DataSuspense>
 * ```
 * 
 * @example With error handling
 * ```tsx
 * <DataSuspense
 *   loadingText="Loading dashboard..."
 *   errorTitle="Failed to load dashboard"
 *   errorMessage="Please check your connection and try again"
 *   onError={(error) => console.error('Dashboard error:', error)}
 * >
 *   <Dashboard />
 * </DataSuspense>
 * ```
 * 
 * @example With custom fallbacks
 * ```tsx
 * <DataSuspense
 *   loadingFallback={<CustomLoader />}
 *   errorFallback={<CustomError />}
 * >
 *   <ComplexComponent />
 * </DataSuspense>
 * ```
 */
export const DataSuspense = ({
  children,
  loadingFallback,
  errorFallback,
  loadingText = 'Loading...',
  errorMessage,
  errorTitle,
  enableRetry = true,
  onError,
  fullHeight = false,
}: DataSuspenseProps) => {
  const defaultLoadingFallback = (
    <div
      className={`flex items-center justify-center ${
        fullHeight ? 'min-h-[400px]' : 'p-8'
      }`}
    >
      <Loading size="md" text={loadingText} />
    </div>
  );

  return (
    <ErrorBoundary
      fallback={errorFallback}
      errorMessage={errorMessage}
      errorTitle={errorTitle}
      enableRetry={enableRetry}
      onError={onError ? (error) => onError(error) : undefined}
    >
      <Suspense fallback={loadingFallback || defaultLoadingFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};
