/**
 * CardSkeleton - Skeleton loader for card-based content
 */

export interface CardSkeletonProps {
  /**
   * Number of skeleton cards to render
   * @default 1
   */
  count?: number;
  /**
   * Whether to show an image placeholder
   * @default true
   */
  showImage?: boolean;
  /**
   * Height of the image placeholder
   * @default '200px'
   */
  imageHeight?: string;
  /**
   * Whether to show action buttons
   * @default true
   */
  showActions?: boolean;
}

/**
 * CardSkeleton component
 * 
 * Skeleton loader that mimics the structure of a card component.
 * Useful for loading states in grid/list views.
 * 
 * @example Single card
 * ```tsx
 * <CardSkeleton />
 * ```
 * 
 * @example Multiple cards
 * ```tsx
 * <CardSkeleton count={3} />
 * ```
 * 
 * @example Without image
 * ```tsx
 * <CardSkeleton showImage={false} />
 * ```
 */
export const CardSkeleton = ({
  count = 1,
  showImage = true,
  imageHeight = '200px',
  showActions = true,
}: CardSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse border rounded-lg overflow-hidden bg-card"
        >
          {showImage && (
            <div
              className="bg-gray-200 dark:bg-gray-700"
              style={{ height: imageHeight }}
            />
          )}
          <div className="p-4 space-y-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            </div>
            {showActions && (
              <div className="flex gap-2 pt-2">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-20" />
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};
