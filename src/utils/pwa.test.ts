import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  registerServiceWorker,
  isAppInstalled,
  getPWADisplayMode,
  isPWASupported,
} from './pwa';

describe('PWA Utilities', () => {
  describe('isPWASupported', () => {
    it('should return true when service worker and push manager are supported', () => {
      // Mock navigator
      Object.defineProperty(global.navigator, 'serviceWorker', {
        value: {},
        writable: true,
        configurable: true,
      });
      Object.defineProperty(global.window, 'PushManager', {
        value: {},
        writable: true,
        configurable: true,
      });

      expect(isPWASupported()).toBe(true);
    });

    it('should return false when service worker is not supported', () => {
      // Store original values
      const originalServiceWorker = (navigator as any).serviceWorker;
      const originalPushManager = (window as any).PushManager;

      // Remove service worker
      delete (navigator as any).serviceWorker;
      delete (window as any).PushManager;

      expect(isPWASupported()).toBe(false);

      // Restore original values
      if (originalServiceWorker !== undefined) {
        Object.defineProperty(navigator, 'serviceWorker', {
          value: originalServiceWorker,
          writable: true,
          configurable: true,
        });
      }
      if (originalPushManager !== undefined) {
        Object.defineProperty(window, 'PushManager', {
          value: originalPushManager,
          writable: true,
          configurable: true,
        });
      }
    });
  });

  describe('isAppInstalled', () => {
    beforeEach(() => {
      // Reset matchMedia mock
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
    });

    it('should return true when running in standalone mode', () => {
      // Mock standalone mode
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(display-mode: standalone)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      expect(isAppInstalled()).toBe(true);
    });

    it('should return false when running in browser mode', () => {
      expect(isAppInstalled()).toBe(false);
    });

    it('should return true for iOS standalone mode', () => {
      // Mock iOS standalone
      Object.defineProperty(navigator, 'standalone', {
        value: true,
        writable: true,
        configurable: true,
      });

      expect(isAppInstalled()).toBe(true);

      // Cleanup
      delete (navigator as any).standalone;
    });
  });

  describe('getPWADisplayMode', () => {
    beforeEach(() => {
      // Reset matchMedia mock
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query) => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
    });

    it('should return "fullscreen" when in fullscreen mode', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(display-mode: fullscreen)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      expect(getPWADisplayMode()).toBe('fullscreen');
    });

    it('should return "standalone" when in standalone mode', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(display-mode: standalone)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      expect(getPWADisplayMode()).toBe('standalone');
    });

    it('should return "minimal-ui" when in minimal-ui mode', () => {
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(display-mode: minimal-ui)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      expect(getPWADisplayMode()).toBe('minimal-ui');
    });

    it('should return "browser" as default', () => {
      expect(getPWADisplayMode()).toBe('browser');
    });
  });

  describe('registerServiceWorker', () => {
    beforeEach(() => {
      // Mock service worker
      Object.defineProperty(global.navigator, 'serviceWorker', {
        value: {
          register: vi.fn(),
          getRegistration: vi.fn(),
        },
        writable: true,
        configurable: true,
      });
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it('should register service worker successfully', async () => {
      const mockRegistration = {
        scope: '/',
        addEventListener: vi.fn(),
      };

      (navigator.serviceWorker.register as any).mockResolvedValue(mockRegistration);

      const result = await registerServiceWorker();

      expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js', {
        scope: '/',
      });
      expect(result).toBe(mockRegistration);
    });

    it('should return null when service worker is not supported', async () => {
      // Remove service worker support
      Object.defineProperty(global.navigator, 'serviceWorker', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const result = await registerServiceWorker();

      expect(result).toBeNull();
    });

    it('should handle registration errors', async () => {
      const error = new Error('Registration failed');
      (navigator.serviceWorker.register as any).mockRejectedValue(error);

      const result = await registerServiceWorker();

      expect(result).toBeNull();
    });
  });
});
