import { useState, useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  sizes?: string;
  blurDataURL?: string;
  quality?: number;
  formats?: ('webp' | 'avif' | 'original')[];
}

export type { OptimizedImageProps };

/**
 * OptimizedImage Component
 * 
 * Features:
 * - Lazy loading with Intersection Observer
 * - Responsive image loading with srcset
 * - WebP and AVIF format support with fallback
 * - Blur placeholder effect (LQIP - Low Quality Image Placeholder)
 * - Error handling with fallback image
 * - Proper aspect ratio maintenance
 * - Native lazy loading as fallback
 * - Configurable quality and formats
 */
export function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  loading = 'lazy',
  objectFit = 'cover',
  fallbackSrc = '/images/placeholder.jpg',
  onLoad,
  onError,
  priority = false,
  sizes,
  blurDataURL,
  quality = 75,
  formats = ['avif', 'webp', 'original'],
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(priority ? src : '');
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority || loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate AVIF source if original is not AVIF
  const getAVIFSource = (originalSrc: string): string => {
    if (originalSrc.endsWith('.avif')) return originalSrc;
    return originalSrc.replace(/\.(jpg|jpeg|png|webp)$/i, '.avif');
  };

  // Generate WebP source if original is not WebP
  const getWebPSource = (originalSrc: string): string => {
    if (originalSrc.endsWith('.webp') || originalSrc.endsWith('.avif')) return originalSrc;
    return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  };

  // Generate srcset for responsive images
  const generateSrcSet = (baseSrc: string): string => {
    if (!baseSrc) return '';
    const widths = [320, 640, 768, 1024, 1280, 1536, 1920];
    return widths
      .map((w) => {
        // In production, this would call an image optimization service
        // For now, we'll use the original image with width descriptor
        return `${baseSrc}?w=${w}&q=${quality} ${w}w`;
      })
      .join(', ');
  };

  // Memoize srcsets to avoid recalculation
  const srcSets = useMemo(() => {
    if (!imageSrc || imageError) return null;
    
    return {
      avif: formats.includes('avif') ? generateSrcSet(getAVIFSource(imageSrc)) : null,
      webp: formats.includes('webp') ? generateSrcSet(getWebPSource(imageSrc)) : null,
      original: formats.includes('original') ? generateSrcSet(imageSrc) : null,
    };
  }, [imageSrc, imageError, quality, formats]);

  useEffect(() => {
    // Skip lazy loading if priority is set or loading is eager
    if (priority || loading === 'eager') {
      setImageSrc(src);
      setIsInView(true);
      return;
    }

    // Set up Intersection Observer for lazy loading
    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            setImageSrc(src);
            if (observerRef.current && imgRef.current) {
              observerRef.current.unobserve(imgRef.current);
            }
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before image enters viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, priority, loading]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc(fallbackSrc);
      onError?.();
    }
  };

  const objectFitClass = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  }[objectFit];

  const defaultSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  return (
    <div
      className={cn('relative overflow-hidden bg-muted', className)}
      style={
        width && height
          ? { aspectRatio: `${width} / ${height}` }
          : undefined
      }
    >
      {/* Blur placeholder while loading */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 animate-pulse bg-muted"
          style={
            blurDataURL
              ? {
                  backgroundImage: `url(${blurDataURL})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(20px)',
                  transform: 'scale(1.1)',
                }
              : undefined
          }
        />
      )}

      {/* Main image with picture element for modern format support */}
      <picture>
        {/* AVIF source for maximum compression (modern browsers) */}
        {isInView && srcSets?.avif && (
          <source
            type="image/avif"
            srcSet={srcSets.avif}
            sizes={defaultSizes}
          />
        )}

        {/* WebP source for modern browsers */}
        {isInView && srcSets?.webp && (
          <source
            type="image/webp"
            srcSet={srcSets.webp}
            sizes={defaultSizes}
          />
        )}

        {/* Original format fallback */}
        {isInView && srcSets?.original && (
          <source
            srcSet={srcSets.original}
            sizes={defaultSizes}
          />
        )}

        {/* Fallback img element */}
        <img
          ref={imgRef}
          src={isInView ? imageSrc : undefined}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full transition-opacity duration-500',
            objectFitClass,
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
        />
      </picture>

      {/* Loading state */}
      {!isInView && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
