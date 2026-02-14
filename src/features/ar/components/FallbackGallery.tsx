/**
 * FallbackGallery Component
 * 
 * A fallback image gallery for devices that don't support WebGL/3D rendering.
 * Displays dish images in an interactive gallery with zoom and navigation.
 */

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FallbackGalleryProps {
  /**
   * Array of image URLs to display
   */
  images: string[];
  /**
   * Dish name for alt text and title
   */
  dishName: string;
  /**
   * Optional description to show
   */
  description?: string;
  /**
   * Initial image index
   * @default 0
   */
  initialIndex?: number;
  /**
   * Show navigation arrows
   * @default true
   */
  showNavigation?: boolean;
  /**
   * Show zoom controls
   * @default true
   */
  showZoomControls?: boolean;
  /**
   * Show image counter
   * @default true
   */
  showCounter?: boolean;
  /**
   * Show info button
   * @default true
   */
  showInfo?: boolean;
  /**
   * Custom className for the container
   */
  className?: string;
  /**
   * Callback when gallery is closed
   */
  onClose?: () => void;
}

export function FallbackGallery({
  images,
  dishName,
  description,
  initialIndex = 0,
  showNavigation = true,
  showZoomControls = true,
  showCounter = true,
  showInfo = true,
  className,
  onClose,
}: FallbackGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [showDescription, setShowDescription] = useState(false);

  // Handle navigation
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setZoom(1); // Reset zoom when changing images
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setZoom(1); // Reset zoom when changing images
  };

  // Handle zoom
  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 1));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    } else if (e.key === 'Escape' && onClose) {
      onClose();
    } else if (e.key === '+' || e.key === '=') {
      zoomIn();
    } else if (e.key === '-') {
      zoomOut();
    } else if (e.key === '0') {
      resetZoom();
    }
  };

  const currentImage = images[currentIndex];
  const hasMultipleImages = images.length > 1;

  return (
    <div
      className={cn(
        'relative w-full h-full bg-background flex flex-col',
        className
      )}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Image gallery"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{dishName}</h3>
          {showCounter && hasMultipleImages && (
            <p className="text-sm text-muted-foreground">
              {currentIndex + 1} / {images.length}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Info button */}
          {showInfo && description && (
            <button
              onClick={() => setShowDescription(!showDescription)}
              className={cn(
                'p-2 rounded-md hover:bg-accent transition-colors',
                showDescription && 'bg-accent'
              )}
              aria-label="Toggle description"
            >
              <Info className="w-5 h-5" />
            </button>
          )}

          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-accent transition-colors"
              aria-label="Close gallery"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Description panel */}
      {showDescription && description && (
        <div className="p-4 bg-muted/50 border-b">
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      )}

      {/* Main image area */}
      <div className="flex-1 relative overflow-hidden bg-muted/20">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <img
            src={currentImage}
            alt={`${dishName} - Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain transition-transform duration-300 ease-out"
            style={{
              transform: `scale(${zoom})`,
              cursor: zoom > 1 ? 'grab' : 'default',
            }}
            draggable={false}
          />
        </div>

        {/* Navigation arrows */}
        {showNavigation && hasMultipleImages && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 hover:bg-background shadow-lg transition-all hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 hover:bg-background shadow-lg transition-all hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Zoom controls */}
        {showZoomControls && (
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button
              onClick={zoomIn}
              disabled={zoom >= 3}
              className="p-2 rounded-md bg-background/80 hover:bg-background shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5" />
            </button>

            <button
              onClick={zoomOut}
              disabled={zoom <= 1}
              className="p-2 rounded-md bg-background/80 hover:bg-background shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>

            {zoom !== 1 && (
              <button
                onClick={resetZoom}
                className="p-2 rounded-md bg-background/80 hover:bg-background shadow-lg transition-all text-xs font-medium"
                aria-label="Reset zoom"
              >
                1:1
              </button>
            )}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {hasMultipleImages && (
        <div className="p-4 border-t bg-background/95 backdrop-blur-sm">
          <div className="flex gap-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setZoom(1);
                }}
                className={cn(
                  'flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all',
                  index === currentIndex
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-transparent hover:border-muted-foreground/20'
                )}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`${dishName} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground text-center">
        Use arrow keys to navigate • +/- to zoom • 0 to reset • ESC to close
      </div>
    </div>
  );
}
