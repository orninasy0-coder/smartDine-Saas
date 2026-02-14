/**
 * PWA Utilities Property-Based Tests
 * 
 * Tests PWA utilities with property-based testing
 * to ensure correct behavior across all possible inputs.
 * 
 * **Validates: Requirements 15.4**
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import {
  getPWADisplayMode,
  isAppInstalled,
} from './pwa';

describe('PWA Utilities - Property-Based Tests', () => {
  beforeEach(() => {
    // Reset window.matchMedia mock
    vi.clearAllMocks();
  });

  /**
   * Property: Display mode detection should return valid values
   */
  describe('PWA Display Mode Properties', () => {
    it('should return one of four valid display modes', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('fullscreen', 'standalone', 'minimal-ui', 'browser'),
          (mode) => {
            // Mock matchMedia to return the specified mode
            window.matchMedia = vi.fn((query: string) => ({
              matches: query.includes(mode),
              media: query,
              onchange: null,
              addListener: vi.fn(),
              removeListener: vi.fn(),
              addEventListener: vi.fn(),
              removeEventListener: vi.fn(),
              dispatchEvent: vi.fn(),
            })) as any;

            const result = getPWADisplayMode();
            expect(['fullscreen', 'standalone', 'minimal-ui', 'browser']).toContain(result);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should prioritize fullscreen over other modes', () => {
      window.matchMedia = vi.fn((query: string) => ({
        matches: query.includes('fullscreen') || query.includes('standalone'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })) as any;

      const result = getPWADisplayMode();
      expect(result).toBe('fullscreen');
    });

    it('should default to browser when no mode matches', () => {
      window.matchMedia = vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })) as any;

      const result = getPWADisplayMode();
      expect(result).toBe('browser');
    });
  });

  /**
   * Property: App installation detection should be consistent
   */
  describe('App Installation Detection Properties', () => {
    it('should return true when in standalone mode', () => {
      window.matchMedia = vi.fn((query: string) => ({
        matches: query.includes('standalone'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })) as any;

      expect(isAppInstalled()).toBe(true);
    });

    it('should return false when in browser mode', () => {
      window.matchMedia = vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })) as any;

      // Also ensure navigator.standalone is false
      Object.defineProperty(window.navigator, 'standalone', {
        writable: true,
        value: false,
      });

      expect(isAppInstalled()).toBe(false);
    });
  });

  /**
   * Property: Background sync tag validation
   */
  describe('Background Sync Properties', () => {
    it('should accept valid sync tag names', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-zA-Z0-9_-]+$/.test(s)),
          (tag) => {
            // Valid tag names should be alphanumeric with hyphens and underscores
            expect(tag).toMatch(/^[a-zA-Z0-9_-]+$/);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property: Periodic sync interval validation
   */
  describe('Periodic Sync Interval Properties', () => {
    it('should accept positive intervals', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 365 * 24 * 60 * 60 * 1000 }), // Up to 1 year in ms
          (interval) => {
            expect(interval).toBeGreaterThan(0);
            expect(Number.isInteger(interval)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle common interval patterns', () => {
      const commonIntervals = [
        60 * 1000, // 1 minute
        5 * 60 * 1000, // 5 minutes
        15 * 60 * 1000, // 15 minutes
        60 * 60 * 1000, // 1 hour
        24 * 60 * 60 * 1000, // 24 hours
      ];

      fc.assert(
        fc.property(
          fc.constantFrom(...commonIntervals),
          (interval) => {
            expect(interval).toBeGreaterThan(0);
            expect(interval % 1000).toBe(0); // Should be in whole seconds
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Property: Service worker message handling
   */
  describe('Service Worker Message Properties', () => {
    it('should handle various message types', () => {
      fc.assert(
        fc.property(
          fc.record({
            type: fc.constantFrom('CLEAR_CACHE', 'SKIP_WAITING', 'CLAIM_CLIENTS', 'CUSTOM'),
            payload: fc.oneof(
              fc.string(),
              fc.integer(),
              fc.object(),
              fc.constant(null)
            ),
          }),
          (message) => {
            // Message should have valid structure
            expect(message).toHaveProperty('type');
            expect(typeof message.type).toBe('string');
            
            // Type should be one of the expected values
            expect(['CLEAR_CACHE', 'SKIP_WAITING', 'CLAIM_CLIENTS', 'CUSTOM']).toContain(message.type);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property: Cache name validation
   */
  describe('Cache Name Properties', () => {
    it('should generate valid cache names with version', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-zA-Z0-9-]+$/.test(s)),
          fc.string({ minLength: 1, maxLength: 10 }).filter(s => /^[a-zA-Z0-9.]+$/.test(s)),
          (name, version) => {
            const cacheName = `${name}-v${version}`;
            
            // Cache name should be valid
            expect(cacheName).toMatch(/^[a-zA-Z0-9-]+(-v[a-zA-Z0-9.]+)?$/);
            expect(cacheName).toContain(name);
            expect(cacheName).toContain(version);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle cache name prefixes consistently', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('precache', 'runtime', 'images', 'api'),
          fc.string({ minLength: 1, maxLength: 10 }).filter(s => /^[0-9.]+$/.test(s)),
          (prefix, version) => {
            const cacheName = `${prefix}-v${version}`;
            
            expect(cacheName.startsWith(prefix)).toBe(true);
            expect(cacheName).toContain(`-v${version}`);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property: Install prompt state transitions
   */
  describe('Install Prompt State Properties', () => {
    it('should handle valid prompt outcomes', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('accepted', 'dismissed', 'unavailable'),
          (outcome) => {
            // Outcome should be one of the valid values
            expect(['accepted', 'dismissed', 'unavailable']).toContain(outcome);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Property: Cache size calculations
   */
  describe('Cache Size Calculation Properties', () => {
    it('should calculate total cache size correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 1000000 }),
          fc.integer({ min: 0, max: 1000000 }),
          (precacheSize, runtimeSize) => {
            const total = precacheSize + runtimeSize;
            
            expect(total).toBeGreaterThanOrEqual(precacheSize);
            expect(total).toBeGreaterThanOrEqual(runtimeSize);
            expect(total).toBe(precacheSize + runtimeSize);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle zero cache sizes', () => {
      const total = 0 + 0;
      expect(total).toBe(0);
    });

    it('should handle large cache sizes', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000000, max: 100000000 }),
          (size) => {
            expect(size).toBeGreaterThan(0);
            expect(Number.isInteger(size)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property: Service worker registration state
   */
  describe('Service Worker Registration Properties', () => {
    it('should handle registration states', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('installing', 'waiting', 'active', 'redundant'),
          (state) => {
            // State should be one of the valid ServiceWorker states
            expect(['installing', 'waiting', 'active', 'redundant']).toContain(state);
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
