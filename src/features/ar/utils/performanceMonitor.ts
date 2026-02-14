import * as THREE from 'three';

/**
 * Performance monitoring utilities for AR/3D scenes
 */

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memory: {
    geometries: number;
    textures: number;
    total: number;
  };
  drawCalls: number;
  triangles: number;
  points: number;
  lines: number;
}

export class PerformanceMonitor {
  private renderer: THREE.WebGLRenderer;
  private lastTime: number = performance.now();
  private frames: number = 0;
  private fps: number = 60;
  private frameTime: number = 16.67;
  private frameTimes: number[] = [];
  private maxFrameTimeSamples: number = 60;

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
  }

  /**
   * Update performance metrics (call once per frame)
   */
  update(): void {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    this.frames++;
    this.frameTimes.push(deltaTime);

    // Keep only recent frame times
    if (this.frameTimes.length > this.maxFrameTimeSamples) {
      this.frameTimes.shift();
    }

    // Calculate FPS every second
    if (deltaTime >= 1000) {
      this.fps = Math.round((this.frames * 1000) / deltaTime);
      this.frameTime =
        this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
      this.frames = 0;
      this.lastTime = currentTime;
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    const info = this.renderer.info;

    return {
      fps: this.fps,
      frameTime: this.frameTime,
      memory: {
        geometries: info.memory.geometries,
        textures: info.memory.textures,
        total: info.memory.geometries + info.memory.textures,
      },
      drawCalls: info.render.calls,
      triangles: info.render.triangles,
      points: info.render.points,
      lines: info.render.lines,
    };
  }

  /**
   * Check if performance is good
   */
  isPerformanceGood(): boolean {
    return this.fps >= 30 && this.frameTime <= 33.33;
  }

  /**
   * Get performance level
   */
  getPerformanceLevel(): 'excellent' | 'good' | 'fair' | 'poor' {
    if (this.fps >= 55) return 'excellent';
    if (this.fps >= 40) return 'good';
    if (this.fps >= 25) return 'fair';
    return 'poor';
  }

  /**
   * Reset metrics
   */
  reset(): void {
    this.frames = 0;
    this.fps = 60;
    this.frameTime = 16.67;
    this.frameTimes = [];
    this.lastTime = performance.now();
  }
}

/**
 * Detect device capabilities
 */
export interface DeviceCapabilities {
  isMobile: boolean;
  isLowEnd: boolean;
  maxTextureSize: number;
  maxAnisotropy: number;
  supportsWebGL2: boolean;
  gpuTier: 'high' | 'medium' | 'low';
}

export function detectDeviceCapabilities(
  renderer: THREE.WebGLRenderer
): DeviceCapabilities {
  const gl = renderer.getContext();
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  // Get max texture size
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

  // Get max anisotropy
  const ext = gl.getExtension('EXT_texture_filter_anisotropic');
  const maxAnisotropy = ext
    ? gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT)
    : 1;

  // Check WebGL2 support
  const supportsWebGL2 = gl instanceof WebGL2RenderingContext;

  // Estimate GPU tier based on capabilities
  let gpuTier: 'high' | 'medium' | 'low' = 'medium';

  if (maxTextureSize >= 8192 && maxAnisotropy >= 16 && supportsWebGL2) {
    gpuTier = 'high';
  } else if (maxTextureSize >= 4096 && maxAnisotropy >= 4) {
    gpuTier = 'medium';
  } else {
    gpuTier = 'low';
  }

  // Mobile devices are typically lower tier
  if (isMobile && gpuTier === 'high') {
    gpuTier = 'medium';
  }

  const isLowEnd = gpuTier === 'low' || (isMobile && gpuTier === 'medium');

  return {
    isMobile,
    isLowEnd,
    maxTextureSize,
    maxAnisotropy,
    supportsWebGL2,
    gpuTier,
  };
}

/**
 * Get recommended settings based on device capabilities
 */
export interface RecommendedSettings {
  shadowMapSize: number;
  maxTextureSize: number;
  anisotropy: number;
  antialias: boolean;
  pixelRatio: number;
  enableShadows: boolean;
  lodLevels: number;
}

export function getRecommendedSettings(
  capabilities: DeviceCapabilities
): RecommendedSettings {
  const { gpuTier, isMobile, maxAnisotropy, maxTextureSize } = capabilities;

  // High-end settings
  if (gpuTier === 'high' && !isMobile) {
    return {
      shadowMapSize: 2048,
      maxTextureSize: Math.min(2048, maxTextureSize),
      anisotropy: Math.min(16, maxAnisotropy),
      antialias: true,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      enableShadows: true,
      lodLevels: 3,
    };
  }

  // Medium settings
  if (gpuTier === 'medium' || (gpuTier === 'high' && isMobile)) {
    return {
      shadowMapSize: 1024,
      maxTextureSize: Math.min(1024, maxTextureSize),
      anisotropy: Math.min(4, maxAnisotropy),
      antialias: true,
      pixelRatio: Math.min(window.devicePixelRatio, 1.5),
      enableShadows: true,
      lodLevels: 2,
    };
  }

  // Low-end settings
  return {
    shadowMapSize: 512,
    maxTextureSize: Math.min(512, maxTextureSize),
    anisotropy: 1,
    antialias: false,
    pixelRatio: 1,
    enableShadows: false,
    lodLevels: 2,
  };
}

/**
 * Adaptive quality manager
 */
export class AdaptiveQualityManager {
  private monitor: PerformanceMonitor;
  private currentQuality: 'high' | 'medium' | 'low' = 'high';
  private checkInterval: number = 2000; // Check every 2 seconds
  private lastCheck: number = 0;
  private targetFPS: number = 30;

  constructor(monitor: PerformanceMonitor, targetFPS: number = 30) {
    this.monitor = monitor;
    this.targetFPS = targetFPS;
  }

  /**
   * Update and check if quality should be adjusted
   */
  update(): 'high' | 'medium' | 'low' | null {
    const now = performance.now();

    if (now - this.lastCheck < this.checkInterval) {
      return null;
    }

    this.lastCheck = now;
    const metrics = this.monitor.getMetrics();

    // Adjust quality based on FPS
    if (metrics.fps < this.targetFPS - 5 && this.currentQuality !== 'low') {
      // Decrease quality
      if (this.currentQuality === 'high') {
        this.currentQuality = 'medium';
      } else {
        this.currentQuality = 'low';
      }
      return this.currentQuality;
    } else if (
      metrics.fps > this.targetFPS + 10 &&
      this.currentQuality !== 'high'
    ) {
      // Increase quality
      if (this.currentQuality === 'low') {
        this.currentQuality = 'medium';
      } else {
        this.currentQuality = 'high';
      }
      return this.currentQuality;
    }

    return null;
  }

  /**
   * Get current quality level
   */
  getCurrentQuality(): 'high' | 'medium' | 'low' {
    return this.currentQuality;
  }

  /**
   * Set quality level manually
   */
  setQuality(quality: 'high' | 'medium' | 'low'): void {
    this.currentQuality = quality;
  }
}

/**
 * Format performance metrics for display
 */
export function formatMetrics(metrics: PerformanceMetrics): string {
  return `
FPS: ${metrics.fps}
Frame Time: ${metrics.frameTime.toFixed(2)}ms
Draw Calls: ${metrics.drawCalls}
Triangles: ${metrics.triangles.toLocaleString()}
Memory: ${metrics.memory.total} objects
  `.trim();
}
