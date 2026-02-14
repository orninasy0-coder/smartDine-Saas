# Image Optimization Implementation Guide

## Overview

This document describes the comprehensive image optimization system implemented in the SmartDine platform. The system provides lazy loading, modern format support (WebP/AVIF), responsive images, and blur placeholders for optimal performance and user experience.

## Features Implemented

### 1. Lazy Loading ✅
- **Intersection Observer API** for efficient lazy loading
- Configurable viewport margin (100px default)
- Priority loading for above-the-fold images
- Native `loading="lazy"` attribute as fallback
- Automatic unobserve after image loads

### 2. WebP/AVIF Format Support ✅
- **AVIF format** for maximum compression (up to 50% smaller than JPEG)
- **WebP format** as fallback for broader browser support
- Automatic format detection and selection
- Progressive enhancement with `<picture>` element
- Original format fallback for older browsers

### 3. Responsive Images ✅
- **srcset** with multiple image widths (320px to 1920px)
- **sizes** attribute for optimal image selection
- Predefined breakpoints for mobile, tablet, desktop
- Aspect ratio preservation
- Quality control (default 75%)

### 4. Blur Placeholder Effect ✅
- **LQIP (Low Quality Image Placeholder)** support
- SVG-based placeholders for zero network cost
- Canvas-based blur generation
- Shimmer effect option
- Smooth fade-in transition (500ms)

## Components

### OptimizedImage

The main component for optimized image rendering.

```tsx
import { OptimizedImage } from '@/components/common/OptimizedImage';

// Basic usage
<OptimizedImage
  src="/images/dish.jpg"
  alt="Delicious dish"
  className="w-full h-64"
/>

// With all options
<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero image"
  width={1920}
  height={1080}
  priority={true}
  loading="eager"
  objectFit="cover"
  quality={85}
  formats={['avif', 'webp', 'original']}
  blurDataURL={blurPlaceholders.gradient}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  onLoad={() => console.log('Image loaded')}
  onError={() => console.log('Image failed')}
/>
```

### ResponsiveImage

Wrapper with predefined responsive breakpoints.

```tsx
import { ResponsiveImage } from '@/components/common/ResponsiveImage';

// Automatic responsive sizing
<ResponsiveImage
  src="/images/product.jpg"
  alt="Product"
  aspectRatio="square"
/>

// Custom breakpoints
<ResponsiveImage
  src="/images/banner.jpg"
  alt="Banner"
  aspectRatio="video"
  sizes={{
    mobile: '100vw',
    tablet: '80vw',
    desktop: '60vw',
    default: '1200px'
  }}
/>
```

### Predefined Components

```tsx
import {
  HeroImage,
  CardImage,
  ThumbnailImage,
  BannerImage,
  AvatarImage
} from '@/components/common/ResponsiveImage';

// Hero image (full width, priority loading)
<HeroImage src="/hero.jpg" alt="Hero" />

// Card image (responsive grid sizing)
<CardImage src="/product.jpg" alt="Product" />

// Thumbnail (fixed small sizes)
<ThumbnailImage src="/thumb.jpg" alt="Thumbnail" />

// Banner (landscape aspect ratio)
<BannerImage src="/banner.jpg" alt="Banner" />

// Avatar (square, small sizes)
<AvatarImage src="/avatar.jpg" alt="User" />
```

## Utilities

### Image Optimization Utils

```tsx
import {
  generateResponsiveSrcSet,
  calculateImageSizes,
  detectImageFormatSupport,
  preloadImage,
  getOptimalImageFormat,
  extractDominantColor,
  getImageLoadingPriority
} from '@/utils/imageOptimization';

// Generate srcset
const srcSet = generateResponsiveSrcSet('/image.jpg', [640, 1024, 1920], 80);

// Calculate sizes attribute
const sizes = calculateImageSizes({
  mobile: '100vw',
  tablet: '50vw',
  desktop: '33vw'
});

// Detect format support
const { avif, webp } = detectImageFormatSupport();

// Preload critical images
await preloadImage('/hero.jpg', 'high');

// Get optimal format
const optimized = getOptimalImageFormat('/image.jpg'); // Returns .avif or .webp

// Extract dominant color
const color = await extractDominantColor('/image.jpg');

// Get loading priority
const { loading, fetchpriority, priority } = getImageLoadingPriority(
  'above-fold',
  'high'
);
```

### Blur Placeholder Utils

```tsx
import {
  generateSimpleBlurDataURL,
  generateGradientBlurDataURL,
  generateShimmerBlurDataURL,
  generateBlurDataURLFromImage,
  extractAverageColor,
  blurPlaceholders,
  getBlurPlaceholderForCategory
} from '@/utils/blurPlaceholder';

// Simple solid color
const blur = generateSimpleBlurDataURL('#e5e7eb');

// Gradient
const gradient = generateGradientBlurDataURL('#e5e7eb', '#d1d5db');

// Shimmer effect
const shimmer = generateShimmerBlurDataURL('#e5e7eb');

// From actual image (requires CORS)
const imageBlur = await generateBlurDataURLFromImage('/image.jpg', 0.1);

// Extract average color
const avgColor = await extractAverageColor('/image.jpg');

// Predefined placeholders
<OptimizedImage blurDataURL={blurPlaceholders.gray} />
<OptimizedImage blurDataURL={blurPlaceholders.gradient} />
<OptimizedImage blurDataURL={blurPlaceholders.shimmer} />

// Category-based
const foodBlur = getBlurPlaceholderForCategory('food');
```

## Hooks

### useOptimizedImage

```tsx
import { useOptimizedImage } from '@/hooks/useOptimizedImage';

function MyComponent() {
  const { optimizedSrc, srcSet, formats, isLoading } = useOptimizedImage({
    src: '/images/dish.jpg',
    formats: ['avif', 'webp', 'original'],
    quality: 80,
    widths: [320, 640, 1024, 1920]
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <img
      src={optimizedSrc}
      srcSet={srcSet}
      alt="Dish"
    />
  );
}
```

### useImagePreload

```tsx
import { useImagePreload } from '@/hooks/useOptimizedImage';

function MyComponent() {
  const { loaded, error } = useImagePreload(
    ['/hero.jpg', '/banner.jpg'],
    'high'
  );

  if (error) return <div>Failed to preload images</div>;
  if (!loaded) return <div>Preloading...</div>;

  return <div>Images ready!</div>;
}
```

## Best Practices

### 1. Priority Loading

Use `priority={true}` for above-the-fold images:

```tsx
// Hero section
<OptimizedImage
  src="/hero.jpg"
  alt="Hero"
  priority={true}
  loading="eager"
/>
```

### 2. Lazy Loading

Default behavior for below-the-fold images:

```tsx
// Product grid
<OptimizedImage
  src="/product.jpg"
  alt="Product"
  loading="lazy"
/>
```

### 3. Responsive Sizing

Always provide appropriate `sizes` attribute:

```tsx
<OptimizedImage
  src="/image.jpg"
  alt="Image"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

### 4. Aspect Ratios

Specify dimensions to prevent layout shift:

```tsx
<OptimizedImage
  src="/image.jpg"
  alt="Image"
  width={1920}
  height={1080}
/>
```

### 5. Blur Placeholders

Use blur placeholders for better perceived performance:

```tsx
<OptimizedImage
  src="/image.jpg"
  alt="Image"
  blurDataURL={blurPlaceholders.gradient}
/>
```

### 6. Format Selection

Let the component handle format selection automatically:

```tsx
<OptimizedImage
  src="/image.jpg"
  alt="Image"
  formats={['avif', 'webp', 'original']}
/>
```

## Performance Metrics

### Expected Improvements

- **Load Time**: 40-60% reduction with lazy loading
- **Bandwidth**: 30-50% reduction with AVIF/WebP
- **LCP (Largest Contentful Paint)**: Improved with priority loading
- **CLS (Cumulative Layout Shift)**: Eliminated with aspect ratios
- **Perceived Performance**: Enhanced with blur placeholders

### Monitoring

Track image performance with:

```tsx
<OptimizedImage
  src="/image.jpg"
  alt="Image"
  onLoad={() => {
    // Track load time
    performance.mark('image-loaded');
  }}
/>
```

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| AVIF | 85+ | 93+ | 16+ | 85+ |
| WebP | 23+ | 65+ | 14+ | 18+ |
| Lazy Loading | 77+ | 75+ | 15.4+ | 79+ |
| Intersection Observer | 51+ | 55+ | 12.1+ | 15+ |

## Migration Guide

### Replacing Standard `<img>` Tags

**Before:**
```tsx
<img src="/image.jpg" alt="Image" className="w-full" />
```

**After:**
```tsx
<OptimizedImage src="/image.jpg" alt="Image" className="w-full" />
```

### Replacing with Responsive Variants

**Before:**
```tsx
<img src="/hero.jpg" alt="Hero" className="w-full h-96" />
```

**After:**
```tsx
<HeroImage src="/hero.jpg" alt="Hero" className="h-96" />
```

## Testing

### Manual Testing

1. **Lazy Loading**: Scroll page and check Network tab
2. **Format Support**: Check Sources in DevTools
3. **Responsive Images**: Resize viewport and check loaded image
4. **Blur Effect**: Throttle network and observe placeholder

### Automated Testing

```tsx
import { render, screen } from '@testing-library/react';
import { OptimizedImage } from '@/components/common/OptimizedImage';

test('renders optimized image', () => {
  render(<OptimizedImage src="/test.jpg" alt="Test" />);
  const img = screen.getByAltText('Test');
  expect(img).toHaveAttribute('loading', 'lazy');
});
```

## Troubleshooting

### Images Not Loading

- Check CORS headers for cross-origin images
- Verify image URLs are accessible
- Check browser console for errors

### Blur Placeholder Not Showing

- Ensure `blurDataURL` is provided
- Check if image loads too quickly (throttle network)
- Verify CSS transitions are not disabled

### Format Not Switching

- Check browser support for AVIF/WebP
- Verify `<picture>` element is rendered
- Check Network tab for actual format loaded

## Future Enhancements

- [ ] Integration with CDN for automatic optimization
- [ ] Server-side image optimization
- [ ] Automatic blur placeholder generation
- [ ] Art direction support
- [ ] Progressive JPEG support
- [ ] Image sprite generation
- [ ] Automatic format conversion pipeline

## Resources

- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)
- [MDN Picture Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture)
- [AVIF Format](https://avif.io/)
- [WebP Format](https://developers.google.com/speed/webp)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

## Summary

The image optimization system provides a comprehensive solution for efficient image delivery with:

✅ Lazy loading with Intersection Observer  
✅ AVIF and WebP format support  
✅ Responsive images with srcset  
✅ Blur placeholder effects  
✅ Easy-to-use components and utilities  
✅ Excellent browser support  
✅ Significant performance improvements  

All components are production-ready and follow modern web performance best practices.
