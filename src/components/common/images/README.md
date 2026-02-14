# Image Optimization Components

This directory provides a centralized export point for all image optimization components, utilities, and hooks.

## Quick Import

```tsx
import {
  // Components
  OptimizedImage,
  ResponsiveImage,
  HeroImage,
  CardImage,
  ThumbnailImage,
  BannerImage,
  AvatarImage,
  
  // Utilities
  blurPlaceholders,
  getBlurPlaceholderForCategory,
  preloadImage,
  
  // Hooks
  useOptimizedImage,
  useImagePreload,
  
  // Types
  type OptimizedImageProps,
  type ResponsiveImageProps,
} from '@/components/common/images';
```

## Features

- ✅ Lazy loading with Intersection Observer
- ✅ AVIF and WebP format support
- ✅ Responsive images with srcset
- ✅ Blur placeholder effects
- ✅ Priority loading for critical images
- ✅ Error handling with fallbacks
- ✅ TypeScript support

## Documentation

See the root-level documentation files:
- [IMAGE_OPTIMIZATION.md](../../../../IMAGE_OPTIMIZATION.md) - Complete guide
- [IMAGE_OPTIMIZATION_QUICK_START.md](../../../../IMAGE_OPTIMIZATION_QUICK_START.md) - Quick start
- [IMAGE_OPTIMIZATION_SUMMARY.md](../../../../IMAGE_OPTIMIZATION_SUMMARY.md) - Implementation summary

## Examples

See [OptimizedImage.example.tsx](../OptimizedImage.example.tsx) for comprehensive usage examples.
