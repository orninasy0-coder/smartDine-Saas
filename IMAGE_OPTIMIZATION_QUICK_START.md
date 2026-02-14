# Image Optimization - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Import the Component

```tsx
import { OptimizedImage } from '@/components/common/OptimizedImage';
```

### Step 2: Replace Your Images

**Before:**
```tsx
<img src="/images/dish.jpg" alt="Dish" className="w-full h-64" />
```

**After:**
```tsx
<OptimizedImage 
  src="/images/dish.jpg" 
  alt="Dish" 
  className="w-full h-64" 
/>
```

That's it! You now have:
- ✅ Lazy loading
- ✅ WebP/AVIF support
- ✅ Responsive images
- ✅ Blur placeholder

## 📦 Common Use Cases

### Hero Image (Above the Fold)

```tsx
import { HeroImage } from '@/components/common/ResponsiveImage';

<HeroImage 
  src="/images/hero.jpg" 
  alt="Hero" 
  className="w-full h-96"
/>
```

### Product Card

```tsx
import { CardImage } from '@/components/common/ResponsiveImage';

<CardImage 
  src="/images/product.jpg" 
  alt="Product" 
  className="rounded-lg"
/>
```

### Avatar

```tsx
import { AvatarImage } from '@/components/common/ResponsiveImage';

<AvatarImage 
  src="/images/avatar.jpg" 
  alt="User" 
  className="w-12 h-12 rounded-full"
/>
```

### Thumbnail

```tsx
import { ThumbnailImage } from '@/components/common/ResponsiveImage';

<ThumbnailImage 
  src="/images/thumb.jpg" 
  alt="Thumbnail"
/>
```

## 🎨 Add Blur Placeholder

```tsx
import { OptimizedImage } from '@/components/common/OptimizedImage';
import { blurPlaceholders } from '@/utils/blurPlaceholder';

<OptimizedImage 
  src="/images/dish.jpg" 
  alt="Dish"
  blurDataURL={blurPlaceholders.gradient}
/>
```

## ⚡ Priority Loading

For critical images (above the fold):

```tsx
<OptimizedImage 
  src="/images/hero.jpg" 
  alt="Hero"
  priority={true}
  loading="eager"
/>
```

## 📱 Custom Responsive Sizes

```tsx
import { ResponsiveImage } from '@/components/common/ResponsiveImage';

<ResponsiveImage 
  src="/images/banner.jpg" 
  alt="Banner"
  sizes={{
    mobile: '100vw',
    tablet: '80vw',
    desktop: '60vw'
  }}
/>
```

## 🎯 Aspect Ratios

```tsx
<ResponsiveImage 
  src="/images/product.jpg" 
  alt="Product"
  aspectRatio="square"  // or "video", "portrait", "landscape"
/>
```

## 🔧 Advanced Options

```tsx
<OptimizedImage 
  src="/images/dish.jpg" 
  alt="Dish"
  width={1920}
  height={1080}
  quality={85}
  formats={['avif', 'webp', 'original']}
  objectFit="cover"
  fallbackSrc="/images/placeholder.jpg"
  onLoad={() => console.log('Loaded!')}
  onError={() => console.log('Error!')}
/>
```

## 📊 Performance Tips

1. **Use priority loading** for above-the-fold images
2. **Add blur placeholders** for better perceived performance
3. **Specify dimensions** to prevent layout shift
4. **Use appropriate aspect ratios** for your content
5. **Let lazy loading handle** below-the-fold images

## 🧪 Testing

Open DevTools → Network tab and:
1. Scroll the page to see lazy loading
2. Check image formats (AVIF/WebP)
3. Resize viewport to see responsive images
4. Throttle network to see blur placeholders

## 📚 Full Documentation

See [IMAGE_OPTIMIZATION.md](./IMAGE_OPTIMIZATION.md) for complete documentation.

## 🎉 You're Done!

Your images are now optimized for performance and user experience!
