/**
 * Image Optimization Components and Utilities
 * 
 * Centralized exports for all image optimization features
 */

// Main components
export { OptimizedImage } from '../OptimizedImage';
export {
  ResponsiveImage,
  HeroImage,
  CardImage,
  ThumbnailImage,
  BannerImage,
  AvatarImage,
} from '../ResponsiveImage';

// Utilities
export {
  generateBlurDataURL,
  calculateImageSizes,
  detectImageFormatSupport,
  preloadImage,
  preloadImages,
  getOptimalImageFormat,
  generateResponsiveSrcSet,
  extractDominantColor,
  isImageInViewport,
  getImageLoadingPriority,
  convertToWebP,
} from '@/utils/imageOptimization';

export {
  generateSimpleBlurDataURL,
  generateGradientBlurDataURL,
  generateShimmerBlurDataURL,
  generateCanvasBlurDataURL,
  extractAverageColor,
  generateBlurDataURLFromImage,
  blurPlaceholders,
  getBlurPlaceholderForCategory,
} from '@/utils/blurPlaceholder';

// Hooks
export { useOptimizedImage, useImagePreload } from '@/hooks/useOptimizedImage';

// Types
export type { OptimizedImageProps } from '../OptimizedImage';
export type { ResponsiveImageProps } from '../ResponsiveImage';
