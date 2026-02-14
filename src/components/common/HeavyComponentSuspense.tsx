/**
 * HeavyComponentSuspense - Suspense wrapper for heavy/expensive components
 * 
 * Optimized for components that are computationally expensive or have large bundles,
 * such as charts, 3D viewers, rich text editors, etc.
 */

import { Suspense, ReactNode } from 'react';
import { Loading } from './Loading';

export interface HeavyComponentSuspenseProps {
  /**
   * Children to render inside Suspense boundary
   */
  children: ReactNode;
  /**
   * Custom fallback component
   */
  fallback?: ReactNode;
  /**
   * Component name for better loading messages
   */
  componentName?: string;
  /**
   * Whether to show a skeleton loader instead of spinner
   * @default false
   */
  showSkeleton?: boolean;
  /**
   * Skeleton component to render
   */
  skeleton?: ReactNode;
  /**
   * Minimum height for the loading container
   */
  minHeight?: string;
}

/**
 * Default skeleton loader for heavy components
 */
const DefaultSkeleton = ({ minHeight }: { minHeight?: string }) => (
  <div
    className="animate-pulse space-y-4 p-4"
    style={{ minHeight: minHeight || '300px' }}
  >
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
    </div>
    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
  </div>
);

/**
 * HeavyComponentSuspense component
 * 
 * Use this for components that:
 * - Have large bundle sizes (charts, editors, 3D libraries)
 * - Perform expensive computations
 * - Take time to initialize
 * 
 * @example For a chart component
 * ```tsx
 * <HeavyComponentSuspense componentName="Analytics Chart">
 *   <AnalyticsChart data={data} />
 * </HeavyComponentSuspense>
 * ```
 * 
 * @example With skeleton loader
 * ```tsx
 * <HeavyComponentSuspense
 *   componentName="Dashboard"
 *   showSkeleton
 *   minHeight="500px"
 * >
 *   <DashboardCharts />
 * </HeavyComponentSuspense>
 * ```
 * 
 * @example With custom skeleton
 * ```tsx
 * <HeavyComponentSuspense
 *   skeleton={<CustomChartSkeleton />}
 * >
 *   <ComplexChart />
 * </HeavyComponentSuspense>
 * ```
 */
export const HeavyComponentSuspense = ({
  children,
  fallback,
  componentName,
  showSkeleton = false,
  skeleton,
  minHeight,
}: HeavyComponentSuspenseProps) => {
  // Determine which fallback to use
  let suspenseFallback: ReactNode;

  if (fallback) {
    suspenseFallback = fallback;
  } else if (showSkeleton) {
    suspenseFallback = skeleton || <DefaultSkeleton minHeight={minHeight} />;
  } else {
    const loadingText = componentName
      ? `Loading ${componentName}...`
      : 'Loading component...';
    suspenseFallback = (
      <div
        className="flex items-center justify-center p-8"
        style={{ minHeight: minHeight || '300px' }}
      >
        <Loading size="lg" text={loadingText} />
      </div>
    );
  }

  return <Suspense fallback={suspenseFallback}>{children}</Suspense>;
};
