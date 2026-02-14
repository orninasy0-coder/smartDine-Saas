/**
 * PageLoadingFallback - Full-page loading fallback for route-level Suspense
 */

import { Loading } from '../Loading';

export interface PageLoadingFallbackProps {
  /**
   * Loading message to display
   */
  message?: string;
  /**
   * Whether to show the app logo/branding
   * @default false
   */
  showBranding?: boolean;
}

/**
 * PageLoadingFallback component
 * 
 * Full-screen loading indicator for page-level loading states.
 * Used primarily with route-level Suspense boundaries.
 * 
 * @example
 * ```tsx
 * <Suspense fallback={<PageLoadingFallback message="Loading dashboard..." />}>
 *   <Dashboard />
 * </Suspense>
 * ```
 */
export const PageLoadingFallback = ({
  message = 'Loading page...',
  showBranding = false,
}: PageLoadingFallbackProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      {showBranding && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">SmartDine</h1>
        </div>
      )}
      <Loading size="lg" text={message} />
    </div>
  );
};
