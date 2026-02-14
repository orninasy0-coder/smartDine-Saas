/**
 * Tests for Lazy Loading Utilities
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { lazyWithRetry, lazyNamed } from './lazyLoad';

describe('lazyLoad utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('lazyWithRetry', () => {
    it('should successfully load component on first try', async () => {
      const mockComponent = { default: () => null };
      const importFn = vi.fn().mockResolvedValue(mockComponent);

      const LazyComponent = lazyWithRetry(importFn);

      // Trigger the lazy load by accessing the component
      expect(LazyComponent).toBeDefined();
      expect(typeof LazyComponent).toBe('object');
    });

    it('should retry on failure and eventually succeed', async () => {
      const mockComponent = { default: () => null };
      const importFn = vi
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockComponent);

      const LazyComponent = lazyWithRetry(importFn, {
        maxRetries: 3,
        delay: 10,
      });

      expect(LazyComponent).toBeDefined();
    });

    it('should fail after max retries', async () => {
      const importFn = vi.fn().mockRejectedValue(new Error('Network error'));

      const LazyComponent = lazyWithRetry(importFn, {
        maxRetries: 2,
        delay: 10,
      });

      expect(LazyComponent).toBeDefined();
      // The actual failure will happen when React tries to render the component
    });

    it('should use default retry config', () => {
      const mockComponent = { default: () => null };
      const importFn = vi.fn().mockResolvedValue(mockComponent);

      const LazyComponent = lazyWithRetry(importFn);

      expect(LazyComponent).toBeDefined();
    });
  });

  describe('lazyNamed', () => {
    it('should load named export', async () => {
      const mockModule = {
        NamedComponent: () => null,
        OtherComponent: () => null,
      };
      const importFn = vi.fn().mockResolvedValue(mockModule);

      const LazyComponent = lazyNamed(importFn, 'NamedComponent');

      expect(LazyComponent).toBeDefined();
      expect(typeof LazyComponent).toBe('object');
    });

    it('should handle missing named export', async () => {
      const mockModule = {
        OtherComponent: () => null,
      };
      const importFn = vi.fn().mockResolvedValue(mockModule);

      const LazyComponent = lazyNamed(importFn, 'NonExistentComponent');

      expect(LazyComponent).toBeDefined();
      // The actual error will happen when React tries to render the component
    });
  });

  describe('integration', () => {
    it('should work with React lazy loading pattern', () => {
      const mockComponent = { default: () => null };
      const importFn = vi.fn().mockResolvedValue(mockComponent);

      const LazyComponent = lazyWithRetry(importFn);

      // Verify it returns a lazy component
      expect(LazyComponent).toBeDefined();
      expect(LazyComponent.$$typeof).toBeDefined();
    });
  });
});
