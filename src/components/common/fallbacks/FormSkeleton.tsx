/**
 * FormSkeleton - Skeleton loader for form content
 */

export interface FormSkeletonProps {
  /**
   * Number of form fields to render
   * @default 4
   */
  fields?: number;
  /**
   * Whether to show submit button
   * @default true
   */
  showSubmit?: boolean;
  /**
   * Whether to show form title
   * @default true
   */
  showTitle?: boolean;
}

/**
 * FormSkeleton component
 * 
 * Skeleton loader that mimics a form structure.
 * Useful for loading states in forms and input-heavy pages.
 * 
 * @example Basic usage
 * ```tsx
 * <FormSkeleton />
 * ```
 * 
 * @example Large form
 * ```tsx
 * <FormSkeleton fields={8} />
 * ```
 * 
 * @example Without title
 * ```tsx
 * <FormSkeleton showTitle={false} />
 * ```
 */
export const FormSkeleton = ({
  fields = 4,
  showSubmit = true,
  showTitle = true,
}: FormSkeletonProps) => {
  return (
    <div className="animate-pulse w-full max-w-2xl">
      {showTitle && (
        <div className="mb-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        </div>
      )}

      <div className="space-y-6">
        {Array.from({ length: fields }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          </div>
        ))}

        {showSubmit && (
          <div className="flex gap-3 pt-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          </div>
        )}
      </div>
    </div>
  );
};
