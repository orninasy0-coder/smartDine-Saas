import { describe, it, expect, vi } from 'vitest';
import {
  generateSrcSet,
  generateSizes,
  calculateAspectRatio,
  getOptimalDimensions,
  toWebP,
  toAVIF,
  getImageSizeCategory,
  validateImageFile,
  createResponsiveConfig,
  estimateLoadTime,
  RESPONSIVE_BREAKPOINTS,
} from './imageOptimization';

describe('imageOptimization utilities', () => {
  describe('generateSrcSet', () => {
    it('should generate srcset string with default breakpoints', () => {
      const srcSet = generateSrcSet('/image.jpg');
      
      expect(srcSet).toContain('/image.jpg 320w');
      expect(srcSet).toContain('/image.jpg 640w');
      expect(srcSet).toContain('/image.jpg 768w');
      expect(srcSet).toContain('/image.jpg 1024w');
      expect(srcSet).toContain('/image.jpg 1280w');
      expect(srcSet).toContain('/image.jpg 1536w');
    });

    it('should generate srcset with custom breakpoints', () => {
      const srcSet = generateSrcSet('/image.jpg', [400, 800]);
      
      expect(srcSet).toBe('/image.jpg 400w, /image.jpg 800w');
    });
  });

  describe('generateSizes', () => {
    it('should generate sizes attribute string', () => {
      const sizes = generateSizes([
        { breakpoint: '768px', size: '100vw' },
        { breakpoint: '1024px', size: '50vw' },
        { breakpoint: 'default', size: '33vw' },
      ]);

      expect(sizes).toBe('(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw');
    });

    it('should handle default breakpoint correctly', () => {
      const sizes = generateSizes([
        { breakpoint: 'default', size: '100vw' },
      ]);

      expect(sizes).toBe('100vw');
    });
  });

  describe('calculateAspectRatio', () => {
    it('should calculate aspect ratio for 16:9', () => {
      const ratio = calculateAspectRatio(1920, 1080);
      expect(ratio).toBe('16 / 9');
    });

    it('should calculate aspect ratio for 4:3', () => {
      const ratio = calculateAspectRatio(800, 600);
      expect(ratio).toBe('4 / 3');
    });

    it('should calculate aspect ratio for 1:1', () => {
      const ratio = calculateAspectRatio(500, 500);
      expect(ratio).toBe('1 / 1');
    });

    it('should calculate aspect ratio for 21:9', () => {
      const ratio = calculateAspectRatio(2560, 1080);
      expect(ratio).toBe('64 / 27');
    });
  });

  describe('getOptimalDimensions', () => {
    it('should calculate dimensions for cover fit with wider image', () => {
      const dims = getOptimalDimensions(800, 600, 1920, 1080, 'cover');
      
      expect(dims.width).toBeGreaterThan(800);
      expect(dims.height).toBe(600);
    });

    it('should calculate dimensions for cover fit with taller image', () => {
      const dims = getOptimalDimensions(800, 600, 600, 800, 'cover');
      
      expect(dims.width).toBe(800);
      expect(dims.height).toBeGreaterThan(600);
    });

    it('should calculate dimensions for contain fit', () => {
      const dims = getOptimalDimensions(800, 600, 1920, 1080, 'contain');
      
      expect(dims.width).toBe(800);
      expect(dims.height).toBeLessThanOrEqual(600);
    });
  });

  describe('toWebP', () => {
    it('should convert jpg to webp', () => {
      expect(toWebP('/image.jpg')).toBe('/image.webp');
    });

    it('should convert jpeg to webp', () => {
      expect(toWebP('/image.jpeg')).toBe('/image.webp');
    });

    it('should convert png to webp', () => {
      expect(toWebP('/image.png')).toBe('/image.webp');
    });

    it('should not convert if already webp', () => {
      expect(toWebP('/image.webp')).toBe('/image.webp');
    });

    it('should handle uppercase extensions', () => {
      expect(toWebP('/image.JPG')).toBe('/image.webp');
    });
  });

  describe('toAVIF', () => {
    it('should convert jpg to avif', () => {
      expect(toAVIF('/image.jpg')).toBe('/image.avif');
    });

    it('should convert webp to avif', () => {
      expect(toAVIF('/image.webp')).toBe('/image.avif');
    });

    it('should not convert if already avif', () => {
      expect(toAVIF('/image.avif')).toBe('/image.avif');
    });
  });

  describe('getImageSizeCategory', () => {
    it('should categorize small images', () => {
      expect(getImageSizeCategory(50 * 1024)).toBe('small'); // 50KB
    });

    it('should categorize medium images', () => {
      expect(getImageSizeCategory(300 * 1024)).toBe('medium'); // 300KB
    });

    it('should categorize large images', () => {
      expect(getImageSizeCategory(1000 * 1024)).toBe('large'); // 1MB
    });

    it('should categorize xlarge images', () => {
      expect(getImageSizeCategory(3000 * 1024)).toBe('xlarge'); // 3MB
    });
  });

  describe('validateImageFile', () => {
    it('should validate correct image file', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB

      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject file with invalid format', () => {
      const file = new File([''], 'test.gif', { type: 'image/gif' });
      
      const result = validateImageFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid format');
    });

    it('should reject file that is too large', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: 10 * 1024 * 1024 }); // 10MB

      const result = validateImageFile(file, 5 * 1024 * 1024); // 5MB max
      expect(result.valid).toBe(false);
      expect(result.error).toContain('File too large');
    });

    it('should accept webp format', () => {
      const file = new File([''], 'test.webp', { type: 'image/webp' });
      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      const result = validateImageFile(file);
      expect(result.valid).toBe(true);
    });
  });

  describe('createResponsiveConfig', () => {
    it('should create complete responsive configuration', () => {
      const config = createResponsiveConfig('/image.jpg');

      expect(config.src).toBe('/image.jpg');
      expect(config.srcSet).toContain('/image.jpg');
      expect(config.sizes).toContain('100vw');
      expect(config.sizes).toContain('50vw');
    });

    it('should use custom breakpoints', () => {
      const config = createResponsiveConfig('/image.jpg', [400, 800]);

      expect(config.srcSet).toBe('/image.jpg 400w, /image.jpg 800w');
    });
  });

  describe('estimateLoadTime', () => {
    it('should estimate load time for 4g connection', () => {
      const sizeBytes = 1024 * 1024; // 1MB
      const time = estimateLoadTime(sizeBytes, '4g');

      expect(time).toBeGreaterThan(0);
      expect(time).toBeLessThan(1000); // Should be less than 1 second on 4g
    });

    it('should estimate longer time for slow-2g', () => {
      const sizeBytes = 1024 * 1024; // 1MB
      const time = estimateLoadTime(sizeBytes, 'slow-2g');

      expect(time).toBeGreaterThan(10000); // Should be more than 10 seconds
    });

    it('should estimate fastest time for wifi', () => {
      const sizeBytes = 1024 * 1024; // 1MB
      const timeWifi = estimateLoadTime(sizeBytes, 'wifi');
      const time4g = estimateLoadTime(sizeBytes, '4g');

      expect(timeWifi).toBeLessThan(time4g);
    });
  });

  describe('RESPONSIVE_BREAKPOINTS', () => {
    it('should have all standard breakpoints', () => {
      expect(RESPONSIVE_BREAKPOINTS.xs).toBe(320);
      expect(RESPONSIVE_BREAKPOINTS.sm).toBe(640);
      expect(RESPONSIVE_BREAKPOINTS.md).toBe(768);
      expect(RESPONSIVE_BREAKPOINTS.lg).toBe(1024);
      expect(RESPONSIVE_BREAKPOINTS.xl).toBe(1280);
      expect(RESPONSIVE_BREAKPOINTS['2xl']).toBe(1536);
    });
  });
});
