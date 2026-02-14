/**
 * Animation Performance Optimization Utilities
 * 
 * This module provides utilities for optimizing animation performance:
 * - Reduced motion detection
 * - GPU acceleration helpers
 * - Animation frame throttling
 * - Performance-optimized animation variants
 */

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
}

/**
 * Get optimized animation variants based on user preferences
 */
export function getOptimizedVariants<T extends Record<string, any>>(
  variants: T,
  reducedVariants?: Partial<T>
): T {
  if (prefersReducedMotion() && reducedVariants) {
    return { ...variants, ...reducedVariants } as T;
  }
  return variants;
}

/**
 * GPU-accelerated transform properties
 * Use these instead of top/left for better performance
 */
export const gpuAcceleratedTransform = {
  translateX: (value: number | string) => `translateX(${typeof value === 'number' ? `${value}px` : value})`,
  translateY: (value: number | string) => `translateY(${typeof value === 'number' ? `${value}px` : value})`,
  translateZ: (value: number | string) => `translateZ(${typeof value === 'number' ? `${value}px` : value})`,
  scale: (value: number) => `scale(${value})`,
  rotate: (value: number | string) => `rotate(${typeof value === 'number' ? `${value}deg` : value})`,
};

/**
 * Optimized transition settings for smooth 60fps animations
 */
export const optimizedTransition = {
  // Fast transitions for UI feedback
  fast: {
    type: 'tween' as const,
    duration: 0.15,
    ease: 'easeOut' as const,
  },
  // Medium transitions for most animations
  medium: {
    type: 'tween' as const,
    duration: 0.3,
    ease: 'easeInOut' as const,
  },
  // Slow transitions for dramatic effects
  slow: {
    type: 'tween' as const,
    duration: 0.5,
    ease: 'easeInOut' as const,
  },
  // Spring animations (use sparingly, can be CPU intensive)
  spring: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },
  // Gentle spring for subtle effects
  gentleSpring: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 25,
  },
};

/**
 * Common animation variants optimized for performance
 */
export const animationVariants = {
  // Fade animations
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  // Slide animations (GPU accelerated)
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  
  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  
  // Scale animations
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  
  scaleUp: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 },
  },
  
  // Stagger children animations
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
};

/**
 * Reduced motion variants (simpler animations)
 */
export const reducedMotionVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  // All slide animations become simple fades
  slideUp: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  slideDown: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  slideLeft: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  slideRight: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  // Scale animations become simple fades
  scaleIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  scaleUp: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
};

/**
 * Throttle animation frame updates
 * Useful for scroll-based animations or high-frequency updates
 */
export function throttleAnimationFrame<T extends (...args: any[]) => void>(
  callback: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  
  return (...args: Parameters<T>) => {
    if (rafId !== null) return;
    
    rafId = requestAnimationFrame(() => {
      callback(...args);
      rafId = null;
    });
  };
}

/**
 * Debounce for resize/scroll events
 */
export function debounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
}

/**
 * Check if device supports GPU acceleration
 */
export function supportsGPUAcceleration(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  return !!gl;
}

/**
 * Apply will-change CSS property for performance
 * Use sparingly and remove after animation completes
 */
export function applyWillChange(element: HTMLElement, properties: string[]): () => void {
  element.style.willChange = properties.join(', ');
  
  // Return cleanup function
  return () => {
    element.style.willChange = 'auto';
  };
}

/**
 * Performance monitoring for animations
 */
export class AnimationPerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  
  measure(): number {
    this.frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - this.lastTime;
    
    if (elapsed >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / elapsed);
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
    
    return this.fps;
  }
  
  getFPS(): number {
    return this.fps;
  }
  
  isPerformanceGood(): boolean {
    return this.fps >= 55; // Allow some margin below 60fps
  }
}
