/**
 * Image Optimization Utilities
 * 
 * Provides helper functions for image optimization including:
 * - Blur data URL generation (LQIP)
 * - Responsive image size calculation
 * - Format detection and conversion
 * - Image preloading
 */

/**
 * Generate a blur data URL for use as a placeholder
 * This creates a tiny base64-encoded image for the blur effect
 */
export function generateBlurDataURL(
  width: number = 10,
  height: number = 10,
  color: string = '#e5e7eb'
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL('image/jpeg', 0.1);
}

/**
 * Calculate responsive image sizes based on breakpoints
 */
export function calculateImageSizes(config: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  default?: string;
}): string {
  const {
    mobile = '100vw',
    tablet = '50vw',
    desktop = '33vw',
    default: defaultSize = '100vw',
  } = config;

  return `(max-width: 640px) ${mobile}, (max-width: 1024px) ${tablet}, (max-width: 1536px) ${desktop}, ${defaultSize}`;
}

/**
 * Detect if browser supports modern image formats
 */
export function detectImageFormatSupport(): {
  avif: boolean;
  webp: boolean;
} {
  if (typeof window === 'undefined') {
    return { avif: false, webp: false };
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  // Check WebP support
  const webp = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;

  // Check AVIF support (more complex, using feature detection)
  const avif = (() => {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
      return elem.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    }
    return false;
  })();

  return { avif, webp };
}

/**
 * Preload critical images for better performance
 */
export function preloadImage(src: string, priority: 'high' | 'low' = 'low'): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    // Set fetchpriority for modern browsers
    if ('fetchPriority' in img) {
      (img as any).fetchPriority = priority;
    }
    
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload multiple images
 */
export function preloadImages(sources: string[], priority: 'high' | 'low' = 'low'): Promise<void[]> {
  return Promise.all(sources.map(src => preloadImage(src, priority)));
}

/**
 * Get optimal image format based on browser support
 */
export function getOptimalImageFormat(originalSrc: string): string {
  const support = detectImageFormatSupport();
  
  if (support.avif && !originalSrc.endsWith('.avif')) {
    return originalSrc.replace(/\.(jpg|jpeg|png|webp)$/i, '.avif');
  }
  
  if (support.webp && !originalSrc.endsWith('.webp') && !originalSrc.endsWith('.avif')) {
    return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }
  
  return originalSrc;
}

/**
 * Generate srcset string for responsive images
 */
export function generateResponsiveSrcSet(
  baseSrc: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1536, 1920],
  quality: number = 75
): string {
  return widths
    .map((w) => `${baseSrc}?w=${w}&q=${quality} ${w}w`)
    .join(', ');
}

/**
 * Extract dominant color from image (for placeholder background)
 * Note: This requires the image to be loaded and CORS-enabled
 */
export async function extractDominantColor(imageSrc: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve('#e5e7eb');
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Sample center pixel
        const centerX = Math.floor(img.width / 2);
        const centerY = Math.floor(img.height / 2);
        const pixel = ctx.getImageData(centerX, centerY, 1, 1).data;
        
        const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        resolve(color);
      } catch (error) {
        // CORS error or other issue
        resolve('#e5e7eb');
      }
    };
    
    img.onerror = () => resolve('#e5e7eb');
    img.src = imageSrc;
  });
}

/**
 * Check if image is in viewport
 */
export function isImageInViewport(element: HTMLElement, threshold: number = 0): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + threshold &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + threshold
  );
}

/**
 * Image loading priority helper
 */
export function getImageLoadingPriority(
  position: 'above-fold' | 'below-fold',
  importance: 'high' | 'medium' | 'low' = 'medium'
): {
  loading: 'eager' | 'lazy';
  fetchpriority: 'high' | 'low' | 'auto';
  priority: boolean;
} {
  if (position === 'above-fold' && importance === 'high') {
    return { loading: 'eager', fetchpriority: 'high', priority: true };
  }
  
  if (position === 'above-fold') {
    return { loading: 'eager', fetchpriority: 'auto', priority: false };
  }
  
  return { loading: 'lazy', fetchpriority: 'low', priority: false };
}

/**
 * Convert image to WebP format (client-side)
 * Note: This requires canvas support and CORS-enabled images
 */
export async function convertToWebP(
  imageSrc: string,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        const webpDataUrl = canvas.toDataURL('image/webp', quality);
        resolve(webpDataUrl);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = reject;
    img.src = imageSrc;
  });
}
