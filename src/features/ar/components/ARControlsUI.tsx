import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ARControlsRef } from './ARControls';

interface ARControlsUIProps {
  /**
   * Reference to ARControls for programmatic control
   */
  controlsRef: React.RefObject<ARControlsRef>;
  
  /**
   * Show zoom in/out buttons
   * @default true
   */
  showZoomControls?: boolean;
  
  /**
   * Show reset view button
   * @default true
   */
  showResetButton?: boolean;
  
  /**
   * Position of the controls
   * @default 'bottom-right'
   */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  
  /**
   * Zoom step amount
   * @default 1
   */
  zoomStep?: number;
  
  /**
   * Custom className for the container
   */
  className?: string;
}

/**
 * ARControlsUI - UI controls for AR viewer
 * Provides buttons for zoom in/out and reset view
 */
export function ARControlsUI({
  controlsRef,
  showZoomControls = true,
  showResetButton = true,
  position = 'bottom-right',
  zoomStep = 1,
  className = '',
}: ARControlsUIProps) {
  const handleZoomIn = () => {
    controlsRef.current?.zoomIn(zoomStep);
  };

  const handleZoomOut = () => {
    controlsRef.current?.zoomOut(zoomStep);
  };

  const handleReset = () => {
    controlsRef.current?.reset();
  };

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} flex flex-col gap-2 z-10 ${className}`}
    >
      {showZoomControls && (
        <>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleZoomIn}
            title="Zoom In"
            className="bg-white/90 hover:bg-white shadow-lg"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="bg-white/90 hover:bg-white shadow-lg"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </>
      )}
      {showResetButton && (
        <Button
          variant="secondary"
          size="icon"
          onClick={handleReset}
          title="Reset View"
          className="bg-white/90 hover:bg-white shadow-lg"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
