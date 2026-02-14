/**
 * SuspenseWrapper - Reusable component-level Suspense wrapper
 * 
 * Provides a consistent way to wrap components with Suspense boundaries
 * and custom fallback UI at the component level.
 */

import { Suspense, ReactNode } from 'react';
import { Loading } from './Loading';

export interface SuspenseWrapperProps {
  /**
   * Children to render inside Suspense boundary
   */
  children: ReactNode;
  /**
   * Custom fallback component to show while loading
   */
  fallback?: ReactNode;
  /**
   * Loading text to display (only used if no custom fallback provided)
   */
  loadingText?: string;
  /**
   * Loading spinner size (only used if no custom fallback provided)
   */
  loadingSize?: 'sm' | 'md' | 'lg';
  /**
   * Whether to show a full-height container for the fallback
   * @default false
   */
  fullHeight?: boolean;
  /**
   * Additional CSS classes for the fallback container
   */
  fallbackClassName?: string;
}

/**
 * SuspenseWrapper component
 * 
 * @example Basic usage
 * ```tsx
 * <SuspenseWrapper>
 *   <LazyComponent />
 * </SuspenseWrapper>
 * ```
 * 
 * @example With custom loading text
 * ```tsx
 * <SuspenseWrapper loadingText="Loading data..." loadingSize="lg">
 *   <DataComponent />
 * </SuspenseWrapper>
 * ```
 * 
 * @example With custom fallback
 * ```tsx
 * <SuspenseWrapper fallback={<CustomLoader />}>
 *   <HeavyComponent />
 * </SuspenseWrapper>
 * ```
 * 
 * @example Full height loading
 * ```tsx
 * <SuspenseWrapper fullHeight loadingText="Loading dashboard...">
 *   <Dashboard />
 * </SuspenseWrapper>
 * ```
 */
export const SuspenseWrapper = ({
  children,
  fallback,
  loadingText,
  loadingSize = 'md',
  fullHeight = false,
  fallbackClassName = '',
}: SuspenseWrapperProps) => {
  // Use custom fallback if provided, otherwise use default Loading component
  const defaultFallback = (
    <div
      className={`flex items-center justify-center ${
        fullHeight ? 'min-h-[400px]' : 'p-8'
      } ${fallbackClassName}`}
    >
      <Loading size={loadingSize} text={loadingText} />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};
