/**
 * TableSkeleton - Skeleton loader for table content
 */

export interface TableSkeletonProps {
  /**
   * Number of rows to render
   * @default 5
   */
  rows?: number;
  /**
   * Number of columns to render
   * @default 4
   */
  columns?: number;
  /**
   * Whether to show table header
   * @default true
   */
  showHeader?: boolean;
}

/**
 * TableSkeleton component
 * 
 * Skeleton loader that mimics a table structure.
 * Useful for loading states in data tables.
 * 
 * @example Basic usage
 * ```tsx
 * <TableSkeleton />
 * ```
 * 
 * @example Custom dimensions
 * ```tsx
 * <TableSkeleton rows={10} columns={6} />
 * ```
 * 
 * @example Without header
 * ```tsx
 * <TableSkeleton showHeader={false} />
 * ```
 */
export const TableSkeleton = ({
  rows = 5,
  columns = 4,
  showHeader = true,
}: TableSkeletonProps) => {
  return (
    <div className="animate-pulse w-full">
      <div className="border rounded-lg overflow-hidden">
        {showHeader && (
          <div className="bg-muted p-4 border-b">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, index) => (
                <div
                  key={`header-${index}`}
                  className="h-4 bg-gray-300 dark:bg-gray-600 rounded"
                />
              ))}
            </div>
          </div>
        )}
        <div className="divide-y">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="p-4">
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
