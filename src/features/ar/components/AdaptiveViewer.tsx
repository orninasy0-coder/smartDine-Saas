/**
 * AdaptiveViewer Component
 * 
 * Automatically detects device capabilities and renders either:
 * - 3D AR viewer for supported devices
 * - Fallback image gallery for unsupported devices
 */

import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { detectDeviceSupport, getDeviceSupportMessage } from '../utils/deviceDetection';
import { FallbackGallery } from './FallbackGallery';

export interface AdaptiveViewerProps {
  /**
   * Dish name
   */
  dishName: string;
  /**
   * Dish description
   */
  description?: string;
  /**
   * 3D model URL (for AR viewer)
   */
  modelUrl?: string;
  /**
   * Array of image URLs (for fallback gallery)
   */
  images: string[];
  /**
   * Component to render for 3D view
   * Should be the AR viewer component
   */
  arViewerComponent?: React.ReactNode;
  /**
   * Force fallback mode (useful for testing)
   * @default false
   */
  forceFallback?: boolean;
  /**
   * Show device support message
   * @default true
   */
  showSupportMessage?: boolean;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Callback when viewer is closed
   */
  onClose?: () => void;
}

export function AdaptiveViewer({
  dishName,
  description,
  modelUrl,
  images,
  arViewerComponent,
  forceFallback = false,
  showSupportMessage = true,
  className,
  onClose,
}: AdaptiveViewerProps) {
  const [deviceSupport, setDeviceSupport] = useState<ReturnType<typeof detectDeviceSupport> | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Detect device support on mount
    const support = detectDeviceSupport();
    setDeviceSupport(support);
    setIsChecking(false);
  }, []);

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Checking device capabilities...</p>
          </div>
        </div>
      </div>
    );
  }

  // Determine if we should use fallback
  const shouldUseFallback = forceFallback || !deviceSupport?.canRender3D || !modelUrl;
  const hasImages = images.length > 0;

  // If we need fallback but have no images, show error
  if (shouldUseFallback && !hasImages) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center h-full min-h-[400px] p-8">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Images Available</h3>
            <p className="text-sm text-muted-foreground">
              This dish doesn't have any images to display.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show fallback gallery
  if (shouldUseFallback) {
    return (
      <div className={className}>
        {showSupportMessage && deviceSupport && !deviceSupport.canRender3D && (
          <div className="bg-muted/50 border-b p-3">
            <div className="flex items-start gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">3D View Not Available</p>
                <p className="text-muted-foreground text-xs">
                  {getDeviceSupportMessage(deviceSupport)}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <FallbackGallery
          images={images}
          dishName={dishName}
          description={description}
          onClose={onClose}
        />
      </div>
    );
  }

  // Show AR viewer for supported devices
  return (
    <div className={className}>
      {arViewerComponent}
    </div>
  );
}
