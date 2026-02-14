import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  prefersReducedMotion,
  getOptimizedVariants,
  gpuAcceleratedTransform,
  optimizedTransition,
  animationVariants,
  reducedMotionVariants,
  throttleAnimationFrame,
  debounce,
  supportsGPUAcceleration,
  AnimationPerformanceMonitor,
} from './animationOptimization';

describe('animationOptimization', () => {
  describe('prefersReducedMotion', () => {
    it('should return false when user does not prefer reduced motion', () => {
      // Mock matchMedia to return false
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });

      expect(prefersReducedMotion()).toBe(false);
    });

    it('should return true when user prefers reduced motion', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: true,
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });

      expect(prefersReducedMotion()).toBe(true);
    });
  });

  describe('getOptimizedVariants', () => {
    it('should return original variants when reduced motion is not preferred', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(() => ({
          matches: false,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });

      const variants = { initial: { opacity: 0 }, animate: { opacity: 1 } };
      const result = getOptimizedVariants(variants);

      expect(result).toEqual(variants);
    });

    it('should merge reduced variants when reduced motion is preferred', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(() => ({
          matches: true,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });

      const variants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
      const reducedVariants = { initial: { opacity: 0 }, animate: { opacity: 1 } };
      const result = getOptimizedVariants(variants, reducedVariants);

      expect(result).toEqual(reducedVariants);
    });
  });

  describe('gpuAcceleratedTransform', () => {
    it('should generate translateX with number', () => {
      expect(gpuAcceleratedTransform.translateX(100)).toBe('translateX(100px)');
    });

    it('should generate translateX with string', () => {
      expect(gpuAcceleratedTransform.translateX('50%')).toBe('translateX(50%)');
    });

    it('should generate translateY with number', () => {
      expect(gpuAcceleratedTransform.translateY(50)).toBe('translateY(50px)');
    });

    it('should generate scale', () => {
      expect(gpuAcceleratedTransform.scale(1.5)).toBe('scale(1.5)');
    });

    it('should generate rotate with number', () => {
      expect(gpuAcceleratedTransform.rotate(45)).toBe('rotate(45deg)');
    });

    it('should generate rotate with string', () => {
      expect(gpuAcceleratedTransform.rotate('90deg')).toBe('rotate(90deg)');
    });
  });

  describe('optimizedTransition', () => {
    it('should have fast transition', () => {
      expect(optimizedTransition.fast).toEqual({
        type: 'tween',
        duration: 0.15,
        ease: 'easeOut',
      });
    });

    it('should have medium transition', () => {
      expect(optimizedTransition.medium).toEqual({
        type: 'tween',
        duration: 0.3,
        ease: 'easeInOut',
      });
    });

    it('should have spring transition', () => {
      expect(optimizedTransition.spring).toEqual({
        type: 'spring',
        stiffness: 300,
        damping: 30,
      });
    });
  });

  describe('animationVariants', () => {
    it('should have fadeIn variant', () => {
      expect(animationVariants.fadeIn).toEqual({
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      });
    });

    it('should have slideUp variant', () => {
      expect(animationVariants.slideUp).toEqual({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      });
    });

    it('should have scaleIn variant', () => {
      expect(animationVariants.scaleIn).toEqual({
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
      });
    });
  });

  describe('reducedMotionVariants', () => {
    it('should simplify slideUp to fadeIn', () => {
      expect(reducedMotionVariants.slideUp).toEqual({
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      });
    });

    it('should simplify scaleIn to fadeIn', () => {
      expect(reducedMotionVariants.scaleIn).toEqual({
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      });
    });
  });

  describe('throttleAnimationFrame', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should throttle function calls using requestAnimationFrame', () => {
      const callback = vi.fn();
      const throttled = throttleAnimationFrame(callback);

      throttled();
      throttled();
      throttled();

      expect(callback).not.toHaveBeenCalled();

      // Simulate RAF callback
      vi.advanceTimersByTime(16);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should debounce function calls', () => {
      const callback = vi.fn();
      const debounced = debounce(callback, 100);

      debounced();
      debounced();
      debounced();

      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should reset timer on subsequent calls', () => {
      const callback = vi.fn();
      const debounced = debounce(callback, 100);

      debounced();
      vi.advanceTimersByTime(50);
      debounced();
      vi.advanceTimersByTime(50);

      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('supportsGPUAcceleration', () => {
    it('should return true when WebGL is supported', () => {
      const mockCanvas = {
        getContext: vi.fn().mockReturnValue({}),
      };

      vi.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

      expect(supportsGPUAcceleration()).toBe(true);
    });

    it('should return false when WebGL is not supported', () => {
      const mockCanvas = {
        getContext: vi.fn().mockReturnValue(null),
      };

      vi.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

      expect(supportsGPUAcceleration()).toBe(false);
    });
  });

  describe('AnimationPerformanceMonitor', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should initialize with 60 FPS', () => {
      const monitor = new AnimationPerformanceMonitor();
      expect(monitor.getFPS()).toBe(60);
    });

    it('should calculate FPS correctly', () => {
      const monitor = new AnimationPerformanceMonitor();

      // Just verify the monitor can measure
      const fps = monitor.measure();
      
      expect(fps).toBeGreaterThanOrEqual(1);
      expect(fps).toBeLessThanOrEqual(60);
    });

    it('should report good performance at 60 FPS', () => {
      const monitor = new AnimationPerformanceMonitor();
      expect(monitor.isPerformanceGood()).toBe(true);
    });
  });
});
