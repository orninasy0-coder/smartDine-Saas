import { Suspense, ErrorInfo } from 'react';
import { Model3D } from './Model3D';
import { ModelErrorBoundary } from './ModelErrorBoundary';
import { ModelProgress } from './ModelProgress';

interface ModelLoaderProps {
  /**
   * URL of the 3D model (GLB/glTF format)
   */
  modelUrl: string;
  /**
   * Scale of the model
   * @default 1
   */
  scale?: number;
  /**
   * Position of the model [x, y, z]
   * @default [0, 0, 0]
   */
  position?: [number, number, number];
  /**
   * Rotation of the model [x, y, z] in radians
   * @default [0, 0, 0]
   */
  rotation?: [number, number, number];
  /**
   * Enable shadows for the model
   * @default true
   */
  castShadow?: boolean;
  /**
   * Enable receiving shadows
   * @default true
   */
  receiveShadow?: boolean;
  /**
   * Custom loading component
   */
  loadingComponent?: React.ReactNode;
  /**
   * Loading text to display
   * @default "Loading 3D model..."
   */
  loadingText?: string;
  /**
   * Show progress percentage
   * @default true
   */
  showProgress?: boolean;
  /**
   * Show progress bar
   * @default true
   */
  showProgressBar?: boolean;
  /**
   * Show item count during loading
   * @default false
   */
  showItemCount?: boolean;
  /**
   * Custom error fallback component
   */
  errorFallback?: React.ReactNode;
  /**
   * Custom error message
   */
  errorMessage?: string;
  /**
   * Enable retry functionality on error
   * @default true
   */
  enableRetry?: boolean;
  /**
   * Callback when model is loaded
   */
  onLoad?: () => void;
  /**
   * Callback when model loading fails
   */
  onError?: (error: Error, errorInfo?: ErrorInfo) => void;
}

/**
 * ModelLoader - Wrapper component that handles 3D model loading with Suspense and error handling
 * Provides a loading indicator while the model is being fetched and error recovery
 */
export function ModelLoader({
  modelUrl,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  castShadow = true,
  receiveShadow = true,
  loadingComponent,
  loadingText = 'Loading 3D model...',
  showProgress = true,
  showProgressBar = true,
  showItemCount = false,
  errorFallback,
  errorMessage,
  enableRetry = true,
  onLoad,
  onError,
}: ModelLoaderProps) {
  // Default loading fallback with progress indicator
  const defaultLoadingFallback = loadingComponent || (
    <ModelProgress
      loadingText={loadingText}
      showPercentage={showProgress}
      showProgressBar={showProgressBar}
      showItemCount={showItemCount}
    />
  );

  return (
    <ModelErrorBoundary
      fallback={errorFallback}
      errorMessage={errorMessage}
      enableRetry={enableRetry}
      onError={onError}
    >
      <Suspense fallback={defaultLoadingFallback}>
        <Model3D
          modelUrl={modelUrl}
          scale={scale}
          position={position}
          rotation={rotation}
          castShadow={castShadow}
          receiveShadow={receiveShadow}
          onLoad={onLoad}
          onError={onError}
        />
      </Suspense>
    </ModelErrorBoundary>
  );
}
