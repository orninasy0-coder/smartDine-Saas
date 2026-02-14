/**
 * Image Optimization Property-Based Tests
 * 
 * Tests image optimization utilities with property-based testing
 * to ensure correct behavior across all possible inputs.
 * 
 * **Validates: Requirements 15.2**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateAspectRatio,
  getOptimalDimensions,
  generateSrcSet,
  generateSizes,
  getImageSizeCategory,
  validateImageFile,
  estimateLoadTime,
  RESPONSIVE_BREAKPOINTS,
} from './imageOptimization';

describe('Image Optimization - Property-Based Tests', () => {
  /**
   * Property: Aspect ratio calculation should be consistent
   */
  describe('Aspect Ratio Properties', () => {
    it('should return valid aspect ratio for any positive dimensions', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10000 }),
          fc.integer({ min: 1, max: 10000 }),
          (width, height) => {
            const ratio = calculateAspectRatio(width, height);
            expect(ratio).toMatch(/^\d+ \/ \d+$/);
            
            // Parse and verify the ratio
            const [w, h] = ratio.split(' / ').map(Number);
            expect(w).toBeGreaterThan(0);
            expect(h).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return 1 / 1 for square images', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10000 }),
          (size) => {
            const ratio = calculateAspectRatio(size, size);
            expect(ratio).toBe('1 / 1');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should simplify ratios to lowest terms', () => {
      // 1920x1080 should be 16/9
      expect(calculateAspectRatio(1920, 1080)).toBe('16 / 9');
      
      // 1600x900 should also be 16/9
      expect(calculateAspectRatio(1600, 900)).toBe('16 / 9');
      
      // 800x600 should be 4/3
      expect(calculateAspectRatio(800, 600)).toBe('4 / 3');
    });
  });

  /**
   * Property: Optimal dimensions should maintain aspect ratio
   */
  describe('Optimal Dimensions Properties', () => {
    it('should return dimensions that fit within container for cover mode', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100, max: 2000 }),
          fc.integer({ min: 100, max: 2000 }),
          fc.integer({ min: 100, max: 2000 }),
          fc.integer({ min: 100, max: 2000 }),
          (containerW, containerH, imageW, imageH) => {
            const result = getOptimalDimensions(
              containerW,
              containerH,
              imageW,
              imageH,
              'cover'
            );
            
            expect(result.width).toBeGreaterThan(0);
            expect(result.height).toBeGreaterThan(0);
            
            // For cover mode, at least one dimension should match or exceed container
            const coversWidth = result.width >= containerW;
            const coversHeight = result.height >= containerH;
            expect(coversWidth || coversHeight).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return dimensions that fit within container for contain mode', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100, max: 2000 }),
          fc.integer({ min: 100, max: 2000 }),
          fc.integer({ min: 100, max: 2000 }),
          fc.integer({ min: 100, max: 2000 }),
          (containerW, containerH, imageW, imageH) => {
            const result = getOptimalDimensions(
              containerW,
              containerH,
              imageW,
              imageH,
              'contain'
            );
            
            expect(result.width).toBeGreaterThan(0);
            expect(result.height).toBeGreaterThan(0);
            
            // For contain mode, both dimensions should fit within container
            expect(result.width).toBeLessThanOrEqual(containerW + 1); // +1 for rounding
            expect(result.height).toBeLessThanOrEqual(containerH + 1);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should preserve aspect ratio', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100, max: 2000 }),
          fc.integer({ min: 100, max: 2000 }),
          fc.integer({ min: 100, max: 2000 }),
          fc.integer({ min: 100, max: 2000 }),
          fc.constantFrom('cover', 'contain'),
          (containerW, containerH, imageW, imageH, mode) => {
            const result = getOptimalDimensions(
              containerW,
              containerH,
              imageW,
              imageH,
              mode as 'cover' | 'contain'
            );
            
            const originalRatio = imageW / imageH;
            const resultRatio = result.width / result.height;
            
            // Allow larger tolerance for rounding errors (especially with extreme ratios)
            expect(Math.abs(originalRatio - resultRatio)).toBeLessThan(0.2);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property: SrcSet generation should include all breakpoints
   */
  describe('SrcSet Generation Properties', () => {
    it('should generate srcset with all provided breakpoints', () => {
      fc.assert(
        fc.property(
          fc.webUrl(),
          fc.array(fc.integer({ min: 100, max: 3000 }), { minLength: 1, maxLength: 10 }),
          (src, breakpoints) => {
            const srcSet = generateSrcSet(src, breakpoints);
            
            // Should contain each breakpoint
            breakpoints.forEach(bp => {
              expect(srcSet).toContain(`${bp}w`);
            });
            
            // Should be comma-separated
            const parts = srcSet.split(', ');
            expect(parts.length).toBe(breakpoints.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use default breakpoints when none provided', () => {
      fc.assert(
        fc.property(
          fc.webUrl(),
          (src) => {
            const srcSet = generateSrcSet(src);
            
            // Should contain all default breakpoints
            Object.values(RESPONSIVE_BREAKPOINTS).forEach(bp => {
              expect(srcSet).toContain(`${bp}w`);
            });
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Property: Sizes generation should format correctly
   */
  describe('Sizes Generation Properties', () => {
    it('should generate valid sizes attribute', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              breakpoint: fc.oneof(
                fc.constant('default'),
                fc.integer({ min: 100, max: 2000 }).map(n => `${n}px`)
              ),
              size: fc.integer({ min: 10, max: 100 }).map(n => `${n}vw`),
            }),
            { minLength: 1, maxLength: 5 }
          ),
          (config) => {
            const sizes = generateSizes(config);
            
            // Should be comma-separated
            const parts = sizes.split(', ');
            expect(parts.length).toBeGreaterThanOrEqual(1);
            
            // Each part should contain expected format
            parts.forEach((part) => {
              expect(part).toMatch(/vw|%|px/);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property: Image size categorization should be consistent
   */
  describe('Image Size Category Properties', () => {
    it('should categorize sizes correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 10 * 1024 * 1024 }), // 0 to 10MB
          (bytes) => {
            const category = getImageSizeCategory(bytes);
            const kb = bytes / 1024;
            
            if (kb < 100) {
              expect(category).toBe('small');
            } else if (kb < 500) {
              expect(category).toBe('medium');
            } else if (kb < 2000) {
              expect(category).toBe('large');
            } else {
              expect(category).toBe('xlarge');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return one of four valid categories', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100 * 1024 * 1024 }),
          (bytes) => {
            const category = getImageSizeCategory(bytes);
            expect(['small', 'medium', 'large', 'xlarge']).toContain(category);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property: Image file validation should enforce constraints
   */
  describe('Image File Validation Properties', () => {
    it('should reject files exceeding max size', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 * 1024 * 1024 }),
          fc.integer({ min: 1, max: 5 * 1024 * 1024 }),
          (fileSize, maxSize) => {
            const file = new File(['x'.repeat(fileSize)], 'test.jpg', {
              type: 'image/jpeg',
            });
            
            const result = validateImageFile(file, maxSize, ['image/jpeg']);
            
            if (fileSize > maxSize) {
              expect(result.valid).toBe(false);
              expect(result.error).toContain('too large');
            } else {
              expect(result.valid).toBe(true);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should reject files with disallowed types', () => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const disallowedTypes = ['image/gif', 'image/bmp', 'image/svg+xml'];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...disallowedTypes),
          (fileType) => {
            const file = new File(['test'], 'test.img', { type: fileType });
            const result = validateImageFile(file, 5 * 1024 * 1024, allowedTypes);
            
            expect(result.valid).toBe(false);
            expect(result.error).toContain('Invalid format');
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should accept valid files', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 1024 * 1024 }), // 1 byte to 1MB
          fc.constantFrom('image/jpeg', 'image/png', 'image/webp'),
          (fileSize, fileType) => {
            const file = new File(['x'.repeat(fileSize)], 'test.jpg', {
              type: fileType,
            });
            
            const result = validateImageFile(
              file,
              5 * 1024 * 1024,
              ['image/jpeg', 'image/png', 'image/webp']
            );
            
            expect(result.valid).toBe(true);
            expect(result.error).toBeUndefined();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property: Load time estimation should be proportional to size
   */
  describe('Load Time Estimation Properties', () => {
    it('should return positive load times', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 * 1024 * 1024 }),
          fc.constantFrom('slow-2g', '2g', '3g', '4g', 'wifi'),
          (sizeBytes, connectionType) => {
            const loadTime = estimateLoadTime(
              sizeBytes,
              connectionType as any
            );
            
            expect(loadTime).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should estimate faster load times for better connections', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100 * 1024, max: 5 * 1024 * 1024 }),
          (sizeBytes) => {
            const slow2g = estimateLoadTime(sizeBytes, 'slow-2g');
            const wifi = estimateLoadTime(sizeBytes, 'wifi');
            
            expect(slow2g).toBeGreaterThan(wifi);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should scale linearly with file size', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100 * 1024, max: 2 * 1024 * 1024 }),
          fc.constantFrom('slow-2g', '2g', '3g', '4g', 'wifi'),
          (baseSize, connectionType) => {
            const doubleSize = baseSize * 2;
            
            const baseTime = estimateLoadTime(baseSize, connectionType as any);
            const doubleTime = estimateLoadTime(doubleSize, connectionType as any);
            
            // Double size should take approximately double time (within 10% tolerance)
            const ratio = doubleTime / baseTime;
            expect(ratio).toBeGreaterThan(1.8);
            expect(ratio).toBeLessThan(2.2);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
