import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  isWebGLSupported,
  isWebGL2Supported,
  detectDeviceSupport,
  getWebGLCapabilities,
  isMobileDevice,
  isIOSDevice,
  isAndroidDevice,
  getDeviceSupportMessage,
} from './deviceDetection';

describe('deviceDetection', () => {
  describe('isWebGLSupported', () => {
    it('should return true when WebGL is supported', () => {
      // Mock canvas and WebGL context
      const mockCanvas = {
        getContext: vi.fn().mockReturnValue({}),
      };
      vi.spyOn(document, 'createElement').mockReturnValue(
        mockCanvas as unknown as HTMLCanvasElement
      );

      const result = isWebGLSupported();
      expect(result).toBe(true);
      expect(mockCanvas.getContext).toHaveBeenCalledWith('webgl');
    });

    it('should return false when WebGL is not supported', () => {
      const mockCanvas = {
        getContext: vi.fn().mockReturnValue(null),
      };
      vi.spyOn(document, 'createElement').mockReturnValue(
        mockCanvas as unknown as HTMLCanvasElement
      );

      const result = isWebGLSupported();
      expect(result).toBe(false);
    });

    it('should return false when an error occurs', () => {
      vi.spyOn(document, 'createElement').mockImplementation(() => {
        throw new Error('Canvas creation failed');
      });

      const result = isWebGLSupported();
      expect(result).toBe(false);
    });
  });

  describe('isWebGL2Supported', () => {
    it('should return true when WebGL2 is supported', () => {
      const mockCanvas = {
        getContext: vi.fn().mockReturnValue({}),
      };
      vi.spyOn(document, 'createElement').mockReturnValue(
        mockCanvas as unknown as HTMLCanvasElement
      );

      const result = isWebGL2Supported();
      expect(result).toBe(true);
      expect(mockCanvas.getContext).toHaveBeenCalledWith('webgl2');
    });

    it('should return false when WebGL2 is not supported', () => {
      const mockCanvas = {
        getContext: vi.fn().mockReturnValue(null),
      };
      vi.spyOn(document, 'createElement').mockReturnValue(
        mockCanvas as unknown as HTMLCanvasElement
      );

      const result = isWebGL2Supported();
      expect(result).toBe(false);
    });
  });

  describe('getWebGLCapabilities', () => {
    it('should return capabilities when WebGL is supported', () => {
      const mockExtension = {
        UNMASKED_RENDERER_WEBGL: 0x9246,
        UNMASKED_VENDOR_WEBGL: 0x9245,
      };

      const mockGl = {
        getParameter: vi.fn((param) => {
          if (param === 0x0D33) return 4096; // MAX_TEXTURE_SIZE
          if (param === 0x8869) return 16; // MAX_VERTEX_ATTRIBS
          if (param === 0x8DFD) return 256; // MAX_FRAGMENT_UNIFORM_VECTORS
          if (param === 0x9246) return 'Test Renderer';
          if (param === 0x9245) return 'Test Vendor';
          return null;
        }),
        getExtension: vi.fn().mockReturnValue(mockExtension),
        MAX_TEXTURE_SIZE: 0x0D33,
        MAX_VERTEX_ATTRIBS: 0x8869,
        MAX_FRAGMENT_UNIFORM_VECTORS: 0x8DFD,
      };

      const mockCanvas = {
        getContext: vi.fn().mockReturnValue(mockGl),
      };

      vi.spyOn(document, 'createElement').mockReturnValue(
        mockCanvas as unknown as HTMLCanvasElement
      );

      const result = getWebGLCapabilities();
      expect(result).toBeDefined();
      expect(result?.maxTextureSize).toBe(4096);
      expect(result?.maxVertexAttributes).toBe(16);
      expect(result?.maxFragmentUniforms).toBe(256);
      expect(result?.renderer).toBe('Test Renderer');
      expect(result?.vendor).toBe('Test Vendor');
    });

    it('should return null when WebGL is not supported', () => {
      const mockCanvas = {
        getContext: vi.fn().mockReturnValue(null),
      };
      vi.spyOn(document, 'createElement').mockReturnValue(
        mockCanvas as unknown as HTMLCanvasElement
      );

      const result = getWebGLCapabilities();
      expect(result).toBeNull();
    });

    it('should handle missing debug extension gracefully', () => {
      const mockGl = {
        getParameter: vi.fn((param) => {
          if (param === 0x0D33) return 2048;
          if (param === 0x8869) return 8;
          if (param === 0x8DFD) return 128;
          return null;
        }),
        getExtension: vi.fn().mockReturnValue(null),
        MAX_TEXTURE_SIZE: 0x0D33,
        MAX_VERTEX_ATTRIBS: 0x8869,
        MAX_FRAGMENT_UNIFORM_VECTORS: 0x8DFD,
      };

      const mockCanvas = {
        getContext: vi.fn().mockReturnValue(mockGl),
      };

      vi.spyOn(document, 'createElement').mockReturnValue(
        mockCanvas as unknown as HTMLCanvasElement
      );

      const result = getWebGLCapabilities();
      expect(result).toBeDefined();
      expect(result?.renderer).toBe('Unknown');
      expect(result?.vendor).toBe('Unknown');
    });

    it('should return null when an error occurs', () => {
      vi.spyOn(document, 'createElement').mockImplementation(() => {
        throw new Error('Canvas creation failed');
      });

      const result = getWebGLCapabilities();
      expect(result).toBeNull();
    });
  });

  describe('detectDeviceSupport', () => {
    it('should return full support when WebGL is available', () => {
      const mockCanvas = {
        getContext: vi.fn().mockReturnValue({}),
      };
      vi.spyOn(document, 'createElement').mockReturnValue(
        mockCanvas as unknown as HTMLCanvasElement
      );

      const result = detectDeviceSupport();
      expect(result.webgl).toBe(true);
      expect(result.canRender3D).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('should return no support when WebGL is not available', () => {
      const mockCanvas = {
        getContext: vi.fn().mockReturnValue(null),
      };
      vi.spyOn(document, 'createElement').mockReturnValue(
        mockCanvas as unknown as HTMLCanvasElement
      );

      const result = detectDeviceSupport();
      expect(result.webgl).toBe(false);
      expect(result.canRender3D).toBe(false);
      expect(result.reason).toBe('WebGL is not supported on this device');
    });
  });

  describe('isMobileDevice', () => {
    beforeEach(() => {
      // Reset navigator.userAgent
      Object.defineProperty(window.navigator, 'userAgent', {
        writable: true,
        configurable: true,
        value: '',
      });
    });

    it('should return true for Android devices', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36',
      });
      expect(isMobileDevice()).toBe(true);
    });

    it('should return true for iPhone devices', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      });
      expect(isMobileDevice()).toBe(true);
    });

    it('should return false for desktop devices', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      });
      expect(isMobileDevice()).toBe(false);
    });
  });

  describe('isIOSDevice', () => {
    it('should return true for iPhone', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      });
      expect(isIOSDevice()).toBe(true);
    });

    it('should return true for iPad', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
      });
      expect(isIOSDevice()).toBe(true);
    });

    it('should return false for Android', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 10)',
      });
      expect(isIOSDevice()).toBe(false);
    });
  });

  describe('isAndroidDevice', () => {
    it('should return true for Android devices', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 10)',
      });
      expect(isAndroidDevice()).toBe(true);
    });

    it('should return false for iOS devices', () => {
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      });
      expect(isAndroidDevice()).toBe(false);
    });
  });

  describe('getDeviceSupportMessage', () => {
    it('should return positive message when 3D is supported', () => {
      const support = {
        webgl: true,
        webgl2: true,
        canRender3D: true,
      };
      const message = getDeviceSupportMessage(support);
      expect(message).toBe('3D rendering is supported on your device');
    });

    it('should return reason when provided', () => {
      const support = {
        webgl: false,
        webgl2: false,
        canRender3D: false,
        reason: 'WebGL is not supported on this device',
      };
      const message = getDeviceSupportMessage(support);
      expect(message).toBe('WebGL is not supported on this device');
    });

    it('should return default message when no reason provided', () => {
      const support = {
        webgl: false,
        webgl2: false,
        canRender3D: false,
      };
      const message = getDeviceSupportMessage(support);
      expect(message).toBe('Your device does not support 3D rendering');
    });
  });
});
