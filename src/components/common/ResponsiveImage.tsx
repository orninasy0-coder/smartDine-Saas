import { OptimizedImage } from './OptimizedImage';
import { calculateImageSizes } from '@/utils/imageOptimization';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' | 'auto';
  sizes?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    default?: string;
  };
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  blurDataURL?: string;
  quality?: number;
}

export type { ResponsiveImageProps };

/**
 * ResponsiveImage Component
 * 
 * A wrapper around OptimizedImage with predefined responsive breakpoints
 * and aspect ratios for common use cases.
 * 
 * @example
 * // Hero image (full width on mobile, 50% on tablet, 33% on desktop)
 * <ResponsiveImage
 *   src="/images/hero.jpg"
 *   alt="Hero"
 *   aspectRatio="video"
 *   priority
 * />
 * 
 * @example
 * // Product card image
 * <ResponsiveImage
 *   src="/images/product.jpg"
 *   alt="Product"
 *   aspectRatio="square"
 *   sizes={{ mobile: '50vw', tablet: '33vw', desktop: '25vw' }}
 * />
 */
export function ResponsiveImage({
  src,
  alt,
  className,
  priority = false,
  aspectRatio = 'auto',
  sizes,
  objectFit = 'cover',
  blurDataURL,
  quality = 75,
}: ResponsiveImageProps) {
  // Predefined aspect ratios
  const aspectRatioMap = {
    square: { width: 1, height: 1 },
    video: { width: 16, height: 9 },
    portrait: { width: 3, height: 4 },
    landscape: { width: 4, height: 3 },
    auto: undefined,
  };

  const dimensions = aspectRatioMap[aspectRatio];

  // Calculate responsive sizes
  const responsiveSizes = sizes
    ? calculateImageSizes(sizes)
    : calculateImageSizes({
        mobile: '100vw',
        tablet: '50vw',
        desktop: '33vw',
        default: '100vw',
      });

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={className}
      width={dimensions?.width}
      height={dimensions?.height}
      priority={priority}
      sizes={responsiveSizes}
      objectFit={objectFit}
      blurDataURL={blurDataURL}
      quality={quality}
      loading={priority ? 'eager' : 'lazy'}
      formats={['avif', 'webp', 'original']}
    />
  );
}

/**
 * Predefined responsive image components for common use cases
 */

export function HeroImage(props: Omit<ResponsiveImageProps, 'aspectRatio' | 'sizes' | 'priority'>) {
  return (
    <ResponsiveImage
      {...props}
      aspectRatio="video"
      priority
      sizes={{
        mobile: '100vw',
        tablet: '100vw',
        desktop: '100vw',
        default: '100vw',
      }}
    />
  );
}

export function CardImage(props: Omit<ResponsiveImageProps, 'aspectRatio' | 'sizes'>) {
  return (
    <ResponsiveImage
      {...props}
      aspectRatio="square"
      sizes={{
        mobile: '50vw',
        tablet: '33vw',
        desktop: '25vw',
        default: '300px',
      }}
    />
  );
}

export function ThumbnailImage(props: Omit<ResponsiveImageProps, 'aspectRatio' | 'sizes'>) {
  return (
    <ResponsiveImage
      {...props}
      aspectRatio="square"
      sizes={{
        mobile: '80px',
        tablet: '100px',
        desktop: '120px',
        default: '100px',
      }}
    />
  );
}

export function BannerImage(props: Omit<ResponsiveImageProps, 'aspectRatio' | 'sizes'>) {
  return (
    <ResponsiveImage
      {...props}
      aspectRatio="landscape"
      sizes={{
        mobile: '100vw',
        tablet: '100vw',
        desktop: '100vw',
        default: '100vw',
      }}
    />
  );
}

export function AvatarImage(props: Omit<ResponsiveImageProps, 'aspectRatio' | 'sizes' | 'objectFit'>) {
  return (
    <ResponsiveImage
      {...props}
      aspectRatio="square"
      objectFit="cover"
      sizes={{
        mobile: '40px',
        tablet: '48px',
        desktop: '56px',
        default: '48px',
      }}
    />
  );
}
