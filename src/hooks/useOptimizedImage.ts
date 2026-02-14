import { useState, useEffect } from 'react';
import { detectImageFormatSupport, getOptimalImageFormat } from '@/utils/imageOptimization';

interface UseOptimizedImageOptions {
  src: string;
  formats?: ('avif' | 'webp' | 'original')[];
  quality?: number;
  widths?: number[];
}

interface UseOptimizedImageReturn {
  optimizedSrc: string;
  srcSet: string;
  formats: {
    avif: boolean;
    webp: boolean;
  };
  isLoading: boolean;
}

/**
 * Hook for optimized image loading with format detection
 * 
 * @example
 * const { optimizedSrc, srcSet, formats } = useOptimizedImage({
 *   src: '/images/dish.jpg',
 *   formats: ['avif', 'webp', 'original'],
 *   quality: 80
 * });
 */
export function useOptimizedImage({
  src,
  formats = ['avif', 'webp', 'original'],
  quality = 75,
  widths = [320, 640, 768, 1024, 1280, 1536, 1920],
}: UseOptimizedImageOptions): UseOptimizedImageReturn {
  const [formatSupport, setFormatSupport] = useState({ avif: false, webp: false });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Detect format support on mount
    const support = detectImageFormatSupport();
    setFormatSupport(support);
    setIsLoading(false);
  }, []);

  // Get optimal format based on browser support
  const optimizedSrc = getOptimalImageFormat(src);

  // Generate srcSet for responsive images
  const srcSet = widths
    .map((w) => `${src}?w=${w}&q=${quality} ${w}w`)
    .join(', ');

  return {
    optimizedSrc,
    srcSet,
    formats: formatSupport,
    isLoading,
  };
}

/**
 * Hook for preloading critical images
 */
export function useImagePreload(sources: string[], priority: 'high' | 'low' = 'low') {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const preloadPromises = sources.map(
      (src) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          if ('fetchPriority' in img) {
            (img as any).fetchPriority = priority;
          }
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to load ${src}`));
          img.src = src;
        })
    );

    Promise.all(preloadPromises)
      .then(() => setLoaded(true))
      .catch((err) => setError(err));
  }, [sources, priority]);

  return { loaded, error };
}
