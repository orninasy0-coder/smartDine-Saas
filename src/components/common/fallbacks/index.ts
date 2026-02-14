/**
 * Fallback components for Suspense boundaries
 * 
 * These components provide loading states for different content types
 * while async components are being loaded.
 */

export { PageLoadingFallback } from './PageLoadingFallback';
export type { PageLoadingFallbackProps } from './PageLoadingFallback';

export { CardSkeleton } from './CardSkeleton';
export type { CardSkeletonProps } from './CardSkeleton';

export { TableSkeleton } from './TableSkeleton';
export type { TableSkeletonProps } from './TableSkeleton';

export { ChartSkeleton } from './ChartSkeleton';
export type { ChartSkeletonProps } from './ChartSkeleton';

export { ListSkeleton } from './ListSkeleton';
export type { ListSkeletonProps } from './ListSkeleton';

export { FormSkeleton } from './FormSkeleton';
export type { FormSkeletonProps } from './FormSkeleton';
