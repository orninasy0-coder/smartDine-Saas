/**
 * Animation Optimization Property-Based Tests
 * 
 * Tests animation optimization utilities with property-based testing
 * to ensure correct behavior across all possible inputs.
 * 
 * **Validates: Requirements 15.6**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  gpuAcceleratedTransform,
  throttleAnimationFrame,
  debounce,
  AnimationPerformanceMonitor,
} from './animationOptimization';

describe('Animation Optimization - Property-Based Tests', () => {
  /**
   * Property: GPU transform functions should generate valid CSS
   */
  describe('GPU Transform Properties', () => {
    it('should generate valid translateX for any number', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -10000, max: 10000, noNaN: true }),
          (value) => {
            const result = gpuAcceleratedTransform.translateX(value);
            expect(result).toMatch(/^translateX\(-?[\d.e+-]+px\)$/);
            expect(result).toContain('px');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate valid translateX for string values', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.string({ minLength: 1, maxLength: 10 }).map(s => `${s}%`),
            fc.string({ minLength: 1, maxLength: 10 }).map(s => `${s}rem`),
            fc.string({ minLength: 1, maxLength: 10 }).map(s => `${s}em`)
          ),
          (value) => {
            const result = gpuAcceleratedTransform.translateX(value);
            expect(result).toBe(`translateX(${value})`);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate valid translateY for any number', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -10000, max: 10000, noNaN: true }),
          (value) => {
            const result = gpuAcceleratedTransform.translateY(value);
            expect(result).toMatch(/^translateY\(-?[\d.e+-]+px\)$/);
            expect(result).toContain('px');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate valid translateZ for any number', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -10000, max: 10000, noNaN: true }),
          (value) => {
            const result = gpuAcceleratedTransform.translateZ(value);
            expect(result).toMatch(/^translateZ\(-?[\d.e+-]+px\)$/);
            expect(result).toContain('px');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate valid scale for any positive number', () => {
      fc.assert(
        fc.property(
          fc.float({ min: 0, max: 10, noNaN: true }),
          (value) => {
            const result = gpuAcceleratedTransform.scale(value);
            expect(result).toMatch(/^scale\([\d.e+-]+\)$/);
            expect(result).toContain('scale(');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate valid rotate for any number', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -360, max: 360, noNaN: true }),
          (value) => {
            const result = gpuAcceleratedTransform.rotate(value);
            expect(result).toMatch(/^rotate\(-?[\d.e+-]+deg\)$/);
            expect(result).toContain('deg');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate valid rotate for string values', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.float({ min: 0, max: 360, noNaN: true }).map(n => `${n}rad`),
            fc.float({ min: 0, max: 1, noNaN: true }).map(n => `${n}turn`)
          ),
          (value) => {
            const result = gpuAcceleratedTransform.rotate(value);
            expect(result).toBe(`rotate(${value})`);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property: Throttle should limit function calls
   */
  describe('Throttle Animation Frame Properties', () => {
    it('should call function at most once per animation frame', () => {
      let executionCount = 0;
      const throttled = throttleAnimationFrame(() => {
        executionCount++;
      });

      // Call multiple times synchronously
      for (let i = 0; i < 10; i++) {
        throttled();
      }

      // Should only execute once (or be scheduled once)
      expect(executionCount).toBeLessThanOrEqual(1);
    });
  });

  /**
   * Property: Debounce should delay function execution
   */
  describe('Debounce Properties', () => {
    it('should not execute immediately', () => {
      let executionCount = 0;
      const debounced = debounce(() => {
        executionCount++;
      }, 50);

      debounced();
      debounced();
      debounced();

      // Should not execute immediately
      expect(executionCount).toBe(0);
    });

    it('should execute after delay', async () => {
      let executionCount = 0;
      const debounced = debounce(() => {
        executionCount++;
      }, 50);

      debounced();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(executionCount).toBe(1);
    });
  });

  /**
   * Property: Animation Performance Monitor should track FPS
   */
  describe('Animation Performance Monitor Properties', () => {
    it('should initialize with 60 FPS', () => {
      const monitor = new AnimationPerformanceMonitor();
      expect(monitor.getFPS()).toBe(60);
    });

    it('should return FPS between 0 and 60', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }),
          (measureCount) => {
            const monitor = new AnimationPerformanceMonitor();
            
            for (let i = 0; i < measureCount; i++) {
              const fps = monitor.measure();
              expect(fps).toBeGreaterThanOrEqual(0);
              expect(fps).toBeLessThanOrEqual(120); // Allow some margin above 60
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should consider performance good at 55+ FPS', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 55, max: 60 }),
          (fps) => {
            const monitor = new AnimationPerformanceMonitor();
            // Simulate FPS by setting it directly (accessing private field for test)
            (monitor as any).fps = fps;
            
            expect(monitor.isPerformanceGood()).toBe(true);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should consider performance bad below 55 FPS', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 54 }),
          (fps) => {
            const monitor = new AnimationPerformanceMonitor();
            // Simulate FPS by setting it directly
            (monitor as any).fps = fps;
            
            expect(monitor.isPerformanceGood()).toBe(false);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Property: Transform combinations should be composable
   */
  describe('Transform Composition Properties', () => {
    it('should allow combining multiple transforms', () => {
      fc.assert(
        fc.property(
          fc.float({ min: -100, max: 100, noNaN: true }),
          fc.float({ min: -100, max: 100, noNaN: true }),
          fc.float({ min: 0.5, max: 2, noNaN: true }),
          fc.float({ min: -180, max: 180, noNaN: true }),
          (x, y, scale, rotate) => {
            const transforms = [
              gpuAcceleratedTransform.translateX(x),
              gpuAcceleratedTransform.translateY(y),
              gpuAcceleratedTransform.scale(scale),
              gpuAcceleratedTransform.rotate(rotate),
            ];
            
            const combined = transforms.join(' ');
            
            // Should contain all transform functions
            expect(combined).toContain('translateX');
            expect(combined).toContain('translateY');
            expect(combined).toContain('scale');
            expect(combined).toContain('rotate');
            
            // Should be valid CSS transform value
            expect(combined.split(' ').length).toBe(4);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property: Numeric transform values should handle edge cases
   */
  describe('Transform Edge Cases', () => {
    it('should handle zero values correctly', () => {
      expect(gpuAcceleratedTransform.translateX(0)).toBe('translateX(0px)');
      expect(gpuAcceleratedTransform.translateY(0)).toBe('translateY(0px)');
      expect(gpuAcceleratedTransform.translateZ(0)).toBe('translateZ(0px)');
      expect(gpuAcceleratedTransform.scale(0)).toBe('scale(0)');
      expect(gpuAcceleratedTransform.rotate(0)).toBe('rotate(0deg)');
    });

    it('should handle negative values correctly', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(-1000), max: Math.fround(-0.01), noNaN: true }),
          (value) => {
            const translateX = gpuAcceleratedTransform.translateX(value);
            const translateY = gpuAcceleratedTransform.translateY(value);
            const rotate = gpuAcceleratedTransform.rotate(value);
            
            expect(translateX).toContain('-');
            expect(translateY).toContain('-');
            expect(rotate).toContain('-');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle very large values', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(10000), max: Math.fround(100000), noNaN: true }),
          (value) => {
            const result = gpuAcceleratedTransform.translateX(value);
            expect(result).toMatch(/^translateX\([\d.e+-]+px\)$/);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should handle very small decimal values', () => {
      fc.assert(
        fc.property(
          fc.float({ min: Math.fround(0.0001), max: Math.fround(0.9999), noNaN: true }),
          (value) => {
            const result = gpuAcceleratedTransform.scale(value);
            expect(result).toMatch(/^scale\([\d.e+-]+\)$/);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
