import { useEffect, useState, useCallback } from 'react';
import {
  prefersReducedMotion,
  getOptimizedVariants,
  animationVariants,
  reducedMotionVariants,
  optimizedTransition,
} from '@/utils/animationOptimization';

/**
 * Hook for optimized animations with reduced motion support
 * 
 * @param variantName - Name of the animation variant to use
 * @returns Animation props for Framer Motion components
 */
export function useOptimizedAnimation(
  variantName: keyof typeof animationVariants = 'fadeIn'
) {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(prefersReducedMotion());

  useEffect(() => {
    // Listen for changes in motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setShouldReduceMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const variants = shouldReduceMotion
    ? reducedMotionVariants[variantName] || reducedMotionVariants.fadeIn
    : animationVariants[variantName] || animationVariants.fadeIn;

  return {
    variants,
    transition: optimizedTransition.medium,
    shouldReduceMotion,
  };
}

/**
 * Hook for performance monitoring
 * Useful for debugging animation performance issues
 */
export function useAnimationPerformance() {
  const [fps, setFps] = useState(60);
  const [isGood, setIsGood] = useState(true);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let rafId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      const elapsed = currentTime - lastTime;

      if (elapsed >= 1000) {
        const currentFps = Math.round((frameCount * 1000) / elapsed);
        setFps(currentFps);
        setIsGood(currentFps >= 55);
        frameCount = 0;
        lastTime = currentTime;
      }

      rafId = requestAnimationFrame(measureFPS);
    };

    rafId = requestAnimationFrame(measureFPS);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return { fps, isGood };
}

/**
 * Hook for intersection-based animations
 * Only animates when element is visible in viewport
 */
export function useInViewAnimation(
  variantName: keyof typeof animationVariants = 'fadeIn',
  options: IntersectionObserverInit = {}
) {
  const [isInView, setIsInView] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  const { variants, transition, shouldReduceMotion } = useOptimizedAnimation(variantName);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return {
    ref: setRef,
    variants,
    transition,
    animate: isInView ? 'animate' : 'initial',
    shouldReduceMotion,
  };
}

/**
 * Hook for scroll-based animations with throttling
 */
export function useScrollAnimation() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;

        setScrollY(currentScrollY);
        setScrollProgress(Math.min(progress, 1));
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return { scrollY, scrollProgress };
}

/**
 * Hook for gesture-based animations with performance optimization
 */
export function useGestureAnimation() {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrag = useCallback((_: any, info: { offset: { x: number; y: number } }) => {
    setPosition(info.offset);
  }, []);

  return {
    isDragging,
    position,
    dragHandlers: {
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      onDrag: handleDrag,
    },
    dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
  };
}
