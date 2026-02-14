/**
 * OptimizedImage Component Examples
 * 
 * This file demonstrates various use cases for the OptimizedImage component
 * and related utilities.
 */

import { OptimizedImage } from './OptimizedImage';
import {
  ResponsiveImage,
  HeroImage,
  CardImage,
  ThumbnailImage,
  BannerImage,
  AvatarImage,
} from './ResponsiveImage';
import { blurPlaceholders, getBlurPlaceholderForCategory } from '@/utils/blurPlaceholder';
import { useOptimizedImage, useImagePreload } from '@/hooks/useOptimizedImage';

/**
 * Example 1: Basic Usage
 */
export function BasicImageExample() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Basic Image</h2>
      <OptimizedImage
        src="/images/dish.jpg"
        alt="Delicious dish"
        className="w-full h-64 rounded-lg"
      />
    </div>
  );
}

/**
 * Example 2: Hero Image with Priority Loading
 */
export function HeroImageExample() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Hero Image (Priority Loading)</h2>
      <HeroImage
        src="/images/hero.jpg"
        alt="Restaurant hero"
        className="w-full h-96 rounded-lg"
        blurDataURL={blurPlaceholders.gradient}
      />
    </div>
  );
}

/**
 * Example 3: Product Grid with Lazy Loading
 */
export function ProductGridExample() {
  const products = [
    { id: 1, name: 'Burger', image: '/images/burger.jpg' },
    { id: 2, name: 'Pizza', image: '/images/pizza.jpg' },
    { id: 3, name: 'Pasta', image: '/images/pasta.jpg' },
    { id: 4, name: 'Salad', image: '/images/salad.jpg' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Product Grid (Lazy Loading)</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="space-y-2">
            <CardImage
              src={product.image}
              alt={product.name}
              className="rounded-lg"
              blurDataURL={getBlurPlaceholderForCategory('food')}
            />
            <p className="text-center font-medium">{product.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Example 4: Responsive Image with Custom Breakpoints
 */
export function ResponsiveImageExample() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Responsive Image</h2>
      <ResponsiveImage
        src="/images/banner.jpg"
        alt="Restaurant banner"
        aspectRatio="video"
        sizes={{
          mobile: '100vw',
          tablet: '80vw',
          desktop: '60vw',
          default: '1200px',
        }}
        className="rounded-lg"
        blurDataURL={blurPlaceholders.shimmer}
      />
    </div>
  );
}

/**
 * Example 5: Avatar Images
 */
export function AvatarExample() {
  const users = [
    { id: 1, name: 'John Doe', avatar: '/images/avatar1.jpg' },
    { id: 2, name: 'Jane Smith', avatar: '/images/avatar2.jpg' },
    { id: 3, name: 'Bob Johnson', avatar: '/images/avatar3.jpg' },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Avatar Images</h2>
      <div className="flex gap-4">
        {users.map((user) => (
          <div key={user.id} className="flex flex-col items-center gap-2">
            <AvatarImage
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full"
              blurDataURL={getBlurPlaceholderForCategory('user')}
            />
            <p className="text-sm">{user.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Example 6: Thumbnail Gallery
 */
export function ThumbnailGalleryExample() {
  const images = [
    '/images/thumb1.jpg',
    '/images/thumb2.jpg',
    '/images/thumb3.jpg',
    '/images/thumb4.jpg',
    '/images/thumb5.jpg',
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Thumbnail Gallery</h2>
      <div className="flex gap-2 overflow-x-auto">
        {images.map((image, index) => (
          <ThumbnailImage
            key={index}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            className="w-20 h-20 rounded-lg flex-shrink-0"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Example 7: Banner with Blur Placeholder
 */
export function BannerExample() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Banner with Blur Effect</h2>
      <BannerImage
        src="/images/promo-banner.jpg"
        alt="Promotional banner"
        className="w-full rounded-lg"
        blurDataURL={blurPlaceholders.gradient}
      />
    </div>
  );
}

/**
 * Example 8: Using the Hook
 */
export function HookExample() {
  const { optimizedSrc, srcSet, formats, isLoading } = useOptimizedImage({
    src: '/images/dish.jpg',
    formats: ['avif', 'webp', 'original'],
    quality: 80,
  });

  if (isLoading) {
    return <div className="animate-pulse bg-muted h-64 rounded-lg" />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Using Hook</h2>
      <div className="space-y-2">
        <img
          src={optimizedSrc}
          srcSet={srcSet}
          alt="Dish"
          className="w-full h-64 object-cover rounded-lg"
        />
        <div className="text-sm text-muted-foreground">
          <p>AVIF Support: {formats.avif ? '✅' : '❌'}</p>
          <p>WebP Support: {formats.webp ? '✅' : '❌'}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Example 9: Preloading Critical Images
 */
export function PreloadExample() {
  const { loaded, error } = useImagePreload(
    ['/images/hero.jpg', '/images/banner.jpg'],
    'high'
  );

  if (error) {
    return <div className="text-red-500">Failed to preload images</div>;
  }

  if (!loaded) {
    return <div className="animate-pulse">Preloading critical images...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Preloaded Images</h2>
      <p className="text-green-600">✅ Critical images preloaded successfully</p>
      <div className="grid grid-cols-2 gap-4">
        <OptimizedImage
          src="/images/hero.jpg"
          alt="Hero"
          className="w-full h-48 rounded-lg"
          priority
        />
        <OptimizedImage
          src="/images/banner.jpg"
          alt="Banner"
          className="w-full h-48 rounded-lg"
          priority
        />
      </div>
    </div>
  );
}

/**
 * Example 10: Different Aspect Ratios
 */
export function AspectRatioExample() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Different Aspect Ratios</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <ResponsiveImage
            src="/images/square.jpg"
            alt="Square"
            aspectRatio="square"
            className="rounded-lg"
          />
          <p className="text-sm text-center">Square (1:1)</p>
        </div>
        <div className="space-y-2">
          <ResponsiveImage
            src="/images/video.jpg"
            alt="Video"
            aspectRatio="video"
            className="rounded-lg"
          />
          <p className="text-sm text-center">Video (16:9)</p>
        </div>
        <div className="space-y-2">
          <ResponsiveImage
            src="/images/portrait.jpg"
            alt="Portrait"
            aspectRatio="portrait"
            className="rounded-lg"
          />
          <p className="text-sm text-center">Portrait (3:4)</p>
        </div>
        <div className="space-y-2">
          <ResponsiveImage
            src="/images/landscape.jpg"
            alt="Landscape"
            aspectRatio="landscape"
            className="rounded-lg"
          />
          <p className="text-sm text-center">Landscape (4:3)</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Example 11: Error Handling with Fallback
 */
export function ErrorHandlingExample() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Error Handling</h2>
      <OptimizedImage
        src="/images/non-existent.jpg"
        alt="This will fail"
        fallbackSrc="/images/placeholder.jpg"
        className="w-full h-64 rounded-lg"
        onError={() => console.log('Image failed to load, using fallback')}
      />
    </div>
  );
}

/**
 * Example 12: Complete Demo Page
 */
export function ImageOptimizationDemo() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Image Optimization Demo</h1>
        <p className="text-muted-foreground">
          Showcasing lazy loading, modern formats, responsive images, and blur placeholders
        </p>
      </div>

      <BasicImageExample />
      <HeroImageExample />
      <ProductGridExample />
      <ResponsiveImageExample />
      <AvatarExample />
      <ThumbnailGalleryExample />
      <BannerExample />
      <HookExample />
      <PreloadExample />
      <AspectRatioExample />
      <ErrorHandlingExample />

      <div className="text-center text-sm text-muted-foreground">
        <p>Open DevTools Network tab to see lazy loading and format selection in action</p>
      </div>
    </div>
  );
}
