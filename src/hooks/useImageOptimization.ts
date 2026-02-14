import { useState, useEffect } from 'react';
import { supportsWebP, supportsAVIF } from '@/utils/imageOptimization';

interface ImageOptimizationState {
  supportsWebP: boolean;
  supportsAVIF: boolean;
  isLoading: boolean;
}

/**
 * Hook to detect browser image format support
 * 
 * Returns information about which modern image formats
 * the browser supports (WebP, AVIF)
 */
export function useImageOptimization(): ImageOptimizationState {
  const [state, setState] = useState<ImageOptimizationState>({
    supportsWebP: false,
    supportsAVIF: false,
    isLoading: true,
  });

  useEffect(() => {
    let mounted = true;

    async function detectFormats() {
      try {
        const [webp, avif] = await Promise.all([
          supportsWebP(),
          supportsAVIF(),
        ]);

        if (mounted) {
          setState({
            supportsWebP: webp,
            supportsAVIF: avif,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error detecting image format support:', error);
        if (mounted) {
          setState({
            supportsWebP: false,
            supportsAVIF: false,
            isLoading: false,
          });
        }
      }
    }

    detectFormats();

    return () => {
      mounted = false;
    };
  }, []);

  return state;
}

interface LazyImageState {
  isInView: boolean;
  hasLoaded: boolean;
}

/**
 * Hook for lazy loading images with Intersection Observer
 * 
 * @param ref - Reference to the image element
 * @param options - Intersection Observer options
 */
export function useLazyImage(
  ref: React.RefObject<HTMLElement>,
  options?: IntersectionObserverInit
): LazyImageState {
  const [state, setState] = useState<LazyImageState>({
    isInView: false,
    hasLoaded: false,
  });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState((prev) => ({ ...prev, isInView: true }));
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
        ...options,
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return state;
}

interface ImageLoadState {
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;
  error?: Error;
}

/**
 * Hook to track image loading state
 * 
 * @param src - Image source URL
 */
export function useImageLoad(src: string): ImageLoadState {
  const [state, setState] = useState<ImageLoadState>({
    isLoading: true,
    isLoaded: false,
    hasError: false,
  });

  useEffect(() => {
    if (!src) {
      setState({
        isLoading: false,
        isLoaded: false,
        hasError: true,
        error: new Error('No image source provided'),
      });
      return;
    }

    setState({
      isLoading: true,
      isLoaded: false,
      hasError: false,
    });

    const img = new Image();

    img.onload = () => {
      setState({
        isLoading: false,
        isLoaded: true,
        hasError: false,
      });
    };

    img.onerror = () => {
      setState({
        isLoading: false,
        isLoaded: false,
        hasError: true,
        error: new Error(`Failed to load image: ${src}`),
      });
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return state;
}

/**
 * Hook to preload images
 * 
 * @param sources - Array of image URLs to preload
 */
export function useImagePreload(sources: string[]): {
  isPreloading: boolean;
  preloadedCount: number;
  totalCount: number;
} {
  const [preloadedCount, setPreloadedCount] = useState(0);
  const [isPreloading, setIsPreloading] = useState(true);

  useEffect(() => {
    if (sources.length === 0) {
      setIsPreloading(false);
      return;
    }

    setIsPreloading(true);
    setPreloadedCount(0);

    const promises = sources.map((src) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          setPreloadedCount((count) => count + 1);
          resolve();
        };
        img.onerror = () => {
          setPreloadedCount((count) => count + 1);
          resolve();
        };
        img.src = src;
      });
    });

    Promise.all(promises).then(() => {
      setIsPreloading(false);
    });
  }, [sources]);

  return {
    isPreloading,
    preloadedCount,
    totalCount: sources.length,
  };
}
