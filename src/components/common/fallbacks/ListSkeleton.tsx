/**
 * ListSkeleton - Skeleton loader for list content
 */

export interface ListSkeletonProps {
  /**
   * Number of list items to render
   * @default 5
   */
  count?: number;
  /**
   * Whether to show avatar/icon
   * @default true
   */
  showAvatar?: boolean;
  /**
   * Whether to show secondary text
   * @default true
   */
  showSecondary?: boolean;
  /**
   * Whether to show action button
   * @default false
   */
  showAction?: boolean;
}

/**
 * ListSkeleton component
 * 
 * Skeleton loader that mimics a list structure.
 * Useful for loading states in list views, feeds, etc.
 * 
 * @example Basic usage
 * ```tsx
 * <ListSkeleton />
 * ```
 * 
 * @example With actions
 * ```tsx
 * <ListSkeleton count={10} showAction />
 * ```
 * 
 * @example Simple list
 * ```tsx
 * <ListSkeleton showAvatar={false} showSecondary={false} />
 * ```
 */
export const ListSkeleton = ({
  count = 5,
  showAvatar = true,
  showSecondary = true,
  showAction = false,
}: ListSkeletonProps) => {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-4 border rounded-lg bg-card"
        >
          {showAvatar && (
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0" />
          )}
          
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            {showSecondary && (
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            )}
          </div>

          {showAction && (
            <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
};
