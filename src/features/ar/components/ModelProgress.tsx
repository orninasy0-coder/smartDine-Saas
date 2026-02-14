import { useProgress, Html } from '@react-three/drei';
import { ARLoading } from './ARLoading';

interface ModelProgressProps {
  /**
   * Custom loading text
   * @default "Loading 3D model..."
   */
  loadingText?: string;
  /**
   * Show percentage progress
   * @default true
   */
  showPercentage?: boolean;
  /**
   * Show progress bar
   * @default true
   */
  showProgressBar?: boolean;
  /**
   * Show item count (loaded/total)
   * @default false
   */
  showItemCount?: boolean;
  /**
   * Custom className for styling
   */
  className?: string;
}

/**
 * ModelProgress - Progress indicator for 3D model loading
 * Uses @react-three/drei's useProgress hook to track loading progress
 */
export function ModelProgress({
  loadingText = 'Loading 3D model...',
  showPercentage = true,
  showProgressBar = true,
  showItemCount = false,
  className = '',
}: ModelProgressProps) {
  const { active, progress, errors, item, loaded, total } = useProgress();

  // Don't render if not actively loading
  if (!active) return null;

  return (
    <Html center>
      <div
        className={`flex flex-col items-center justify-center gap-3 p-6 bg-background/95 backdrop-blur-sm rounded-lg border shadow-lg min-w-[280px] ${className}`}
      >
        {/* Loading spinner */}
        <ARLoading />

        {/* Loading text */}
        <p className="text-sm font-medium text-foreground">{loadingText}</p>

        {/* Progress percentage */}
        {showPercentage && (
          <p className="text-2xl font-bold text-primary">
            {Math.round(progress)}%
          </p>
        )}

        {/* Progress bar */}
        {showProgressBar && (
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Item count */}
        {showItemCount && (
          <p className="text-xs text-muted-foreground">
            {loaded} / {total} items loaded
          </p>
        )}

        {/* Current item being loaded */}
        {item && (
          <p className="text-xs text-muted-foreground truncate max-w-[250px]">
            Loading: {item}
          </p>
        )}

        {/* Error count */}
        {errors.length > 0 && (
          <p className="text-xs text-destructive">
            {errors.length} error{errors.length > 1 ? 's' : ''} occurred
          </p>
        )}
      </div>
    </Html>
  );
}

/**
 * SimpleModelProgress - Minimal progress indicator
 */
export function SimpleModelProgress() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <ARLoading />
        <p className="text-sm text-muted-foreground">
          {Math.round(progress)}%
        </p>
      </div>
    </Html>
  );
}
