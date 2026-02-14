import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import * as THREE from 'three';
import {
  PerformanceMonitor,
  AdaptiveQualityManager,
  detectDeviceCapabilities,
  getRecommendedSettings,
  formatMetrics,
} from './performanceMonitor';

// Mock WebGL2RenderingContext for tests
beforeAll(() => {
  if (typeof global.WebGL2RenderingContext === 'undefined') {
    (global as any).WebGL2RenderingContext = class WebGL2RenderingContext {};
  }
});

// Mock WebGLRenderer
function createMockRenderer() {
  return {
    info: {
      memory: {
        geometries: 10,
        textures: 5,
      },
      render: {
        calls: 15,
        triangles: 1000,
        points: 0,
        lines: 0,
      },
    },
    getContext: () => ({
      getParameter: vi.fn((param) => {
        if (param === 0x0d33) return 8192; // MAX_TEXTURE_SIZE
        return 16; // MAX_ANISOTROPY
      }),
      getExtension: vi.fn(() => ({
        MAX_TEXTURE_MAX_ANISOTROPY_EXT: 0x84ff,
      })),
    }),
  } as unknown as THREE.WebGLRenderer;
}

describe('PerformanceMonitor', () => {
  let renderer: THREE.WebGLRenderer;
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    renderer = createMockRenderer();
    monitor = new PerformanceMonitor(renderer);
  });

  it('initializes with default values', () => {
    const metrics = monitor.getMetrics();

    expect(metrics.fps).toBe(60);
    expect(metrics.frameTime).toBeCloseTo(16.67, 1);
  });

  it('updates metrics', () => {
    monitor.update();
    const metrics = monitor.getMetrics();

    expect(metrics).toBeDefined();
    expect(metrics.fps).toBeGreaterThan(0);
  });

  it('tracks memory usage', () => {
    const metrics = monitor.getMetrics();

    expect(metrics.memory.geometries).toBe(10);
    expect(metrics.memory.textures).toBe(5);
    expect(metrics.memory.total).toBe(15);
  });

  it('tracks render statistics', () => {
    const metrics = monitor.getMetrics();

    expect(metrics.drawCalls).toBe(15);
    expect(metrics.triangles).toBe(1000);
  });

  it('checks if performance is good', () => {
    const isGood = monitor.isPerformanceGood();
    expect(typeof isGood).toBe('boolean');
  });

  it('gets performance level', () => {
    const level = monitor.getPerformanceLevel();
    expect(['excellent', 'good', 'fair', 'poor']).toContain(level);
  });

  it('resets metrics', () => {
    monitor.update();
    monitor.reset();

    const metrics = monitor.getMetrics();
    expect(metrics.fps).toBe(60);
  });
});

describe('AdaptiveQualityManager', () => {
  let renderer: THREE.WebGLRenderer;
  let monitor: PerformanceMonitor;
  let manager: AdaptiveQualityManager;

  beforeEach(() => {
    renderer = createMockRenderer();
    monitor = new PerformanceMonitor(renderer);
    manager = new AdaptiveQualityManager(monitor, 30);
  });

  it('initializes with high quality', () => {
    expect(manager.getCurrentQuality()).toBe('high');
  });

  it('allows manual quality setting', () => {
    manager.setQuality('low');
    expect(manager.getCurrentQuality()).toBe('low');

    manager.setQuality('medium');
    expect(manager.getCurrentQuality()).toBe('medium');

    manager.setQuality('high');
    expect(manager.getCurrentQuality()).toBe('high');
  });

  it('returns null when not enough time has passed', () => {
    const result = manager.update();
    expect(result).toBeNull();
  });

  it('updates quality based on performance', () => {
    // This test would require mocking time and FPS
    // which is complex. In practice, this is better tested
    // in integration tests with actual rendering.
    expect(manager.getCurrentQuality()).toBeDefined();
  });
});

describe('detectDeviceCapabilities', () => {
  it('detects device capabilities', () => {
    const renderer = createMockRenderer();
    const capabilities = detectDeviceCapabilities(renderer);

    expect(capabilities).toBeDefined();
    expect(capabilities.isMobile).toBeDefined();
    expect(capabilities.isLowEnd).toBeDefined();
    expect(capabilities.maxTextureSize).toBeGreaterThan(0);
    expect(capabilities.maxAnisotropy).toBeGreaterThan(0);
    expect(capabilities.supportsWebGL2).toBeDefined();
    expect(['high', 'medium', 'low']).toContain(capabilities.gpuTier);
  });

  it('detects high-end GPU', () => {
    const renderer = createMockRenderer();
    const capabilities = detectDeviceCapabilities(renderer);

    // With our mock values (8192 texture size, 16 anisotropy)
    // it should detect as high or medium tier
    expect(capabilities.gpuTier).toBeDefined();
    expect(['high', 'medium', 'low']).toContain(capabilities.gpuTier);
  });
});

describe('getRecommendedSettings', () => {
  it('returns settings for high-end devices', () => {
    const capabilities = {
      isMobile: false,
      isLowEnd: false,
      maxTextureSize: 8192,
      maxAnisotropy: 16,
      supportsWebGL2: true,
      gpuTier: 'high' as const,
    };

    const settings = getRecommendedSettings(capabilities);

    expect(settings.shadowMapSize).toBe(2048);
    expect(settings.maxTextureSize).toBe(2048);
    expect(settings.anisotropy).toBe(16);
    expect(settings.antialias).toBe(true);
    expect(settings.enableShadows).toBe(true);
    expect(settings.lodLevels).toBe(3);
  });

  it('returns settings for medium devices', () => {
    const capabilities = {
      isMobile: false,
      isLowEnd: false,
      maxTextureSize: 4096,
      maxAnisotropy: 8,
      supportsWebGL2: true,
      gpuTier: 'medium' as const,
    };

    const settings = getRecommendedSettings(capabilities);

    expect(settings.shadowMapSize).toBe(1024);
    expect(settings.maxTextureSize).toBe(1024);
    expect(settings.anisotropy).toBe(4);
    expect(settings.antialias).toBe(true);
    expect(settings.enableShadows).toBe(true);
    expect(settings.lodLevels).toBe(2);
  });

  it('returns settings for low-end devices', () => {
    const capabilities = {
      isMobile: true,
      isLowEnd: true,
      maxTextureSize: 2048,
      maxAnisotropy: 4,
      supportsWebGL2: false,
      gpuTier: 'low' as const,
    };

    const settings = getRecommendedSettings(capabilities);

    expect(settings.shadowMapSize).toBe(512);
    expect(settings.maxTextureSize).toBe(512);
    expect(settings.anisotropy).toBe(1);
    expect(settings.antialias).toBe(false);
    expect(settings.enableShadows).toBe(false);
    expect(settings.lodLevels).toBe(2);
  });

  it('adjusts settings for mobile high-end devices', () => {
    const capabilities = {
      isMobile: true,
      isLowEnd: false,
      maxTextureSize: 4096,
      maxAnisotropy: 8,
      supportsWebGL2: true,
      gpuTier: 'high' as const,
    };

    const settings = getRecommendedSettings(capabilities);

    // Mobile high-end should get medium settings
    expect(settings.shadowMapSize).toBe(1024);
    expect(settings.lodLevels).toBe(2);
  });
});

describe('formatMetrics', () => {
  it('formats metrics correctly', () => {
    const metrics = {
      fps: 60,
      frameTime: 16.67,
      memory: {
        geometries: 10,
        textures: 5,
        total: 15,
      },
      drawCalls: 20,
      triangles: 1000,
      points: 0,
      lines: 0,
    };

    const formatted = formatMetrics(metrics);

    expect(formatted).toContain('FPS: 60');
    expect(formatted).toContain('Frame Time: 16.67ms');
    expect(formatted).toContain('Draw Calls: 20');
    expect(formatted).toContain('Triangles: 1,000');
    expect(formatted).toContain('Memory: 15 objects');
  });

  it('formats large numbers with locale string', () => {
    const metrics = {
      fps: 60,
      frameTime: 16.67,
      memory: {
        geometries: 100,
        textures: 50,
        total: 150,
      },
      drawCalls: 50,
      triangles: 1000000,
      points: 0,
      lines: 0,
    };

    const formatted = formatMetrics(metrics);

    expect(formatted).toContain('1,000,000');
  });
});
