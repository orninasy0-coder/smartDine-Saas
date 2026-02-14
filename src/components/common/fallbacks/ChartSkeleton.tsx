/**
 * ChartSkeleton - Skeleton loader for chart/graph content
 */

export interface ChartSkeletonProps {
  /**
   * Height of the chart skeleton
   * @default '300px'
   */
  height?: string;
  /**
   * Chart type for different skeleton styles
   * @default 'bar'
   */
  type?: 'bar' | 'line' | 'pie' | 'area';
  /**
   * Whether to show legend
   * @default true
   */
  showLegend?: boolean;
  /**
   * Whether to show title
   * @default true
   */
  showTitle?: boolean;
}

/**
 * ChartSkeleton component
 * 
 * Skeleton loader that mimics chart/graph visualizations.
 * Useful for loading states in analytics dashboards.
 * 
 * @example Bar chart
 * ```tsx
 * <ChartSkeleton type="bar" />
 * ```
 * 
 * @example Line chart
 * ```tsx
 * <ChartSkeleton type="line" height="400px" />
 * ```
 * 
 * @example Without legend
 * ```tsx
 * <ChartSkeleton showLegend={false} />
 * ```
 */
export const ChartSkeleton = ({
  height = '300px',
  type = 'bar',
  showLegend = true,
  showTitle = true,
}: ChartSkeletonProps) => {
  return (
    <div className="animate-pulse w-full">
      {showTitle && (
        <div className="mb-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        </div>
      )}
      
      <div
        className="border rounded-lg p-4 bg-card"
        style={{ height }}
      >
        {type === 'bar' && (
          <div className="h-full flex items-end justify-around gap-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 dark:bg-gray-700 rounded-t w-full"
                style={{
                  height: `${Math.random() * 60 + 40}%`,
                }}
              />
            ))}
          </div>
        )}

        {type === 'line' && (
          <div className="h-full relative">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <path
                d="M 0 150 Q 50 100, 100 120 T 200 100 T 300 130 T 400 110"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-gray-200 dark:text-gray-700"
              />
              <path
                d="M 0 180 Q 50 140, 100 160 T 200 150 T 300 170 T 400 160"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-gray-300 dark:text-gray-600"
              />
            </svg>
          </div>
        )}

        {type === 'pie' && (
          <div className="h-full flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
        )}

        {type === 'area' && (
          <div className="h-full relative">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <path
                d="M 0 150 Q 50 100, 100 120 T 200 100 T 300 130 T 400 110 L 400 200 L 0 200 Z"
                fill="currentColor"
                className="text-gray-200 dark:text-gray-700 opacity-50"
              />
            </svg>
          </div>
        )}
      </div>

      {showLegend && (
        <div className="mt-4 flex gap-4 justify-center">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
