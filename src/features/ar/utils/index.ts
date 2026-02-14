/**
 * AR Performance Optimization Utilities
 */

// Model optimization
export {
  optimizeModel,
  disposeScene,
  getModelStats,
  type OptimizationOptions,
  type ModelStats,
} from './modelOptimization';

// Texture optimization
export {
  optimizeSceneTextures,
  optimizeTexture,
  compressTexture,
  getTextureMemoryUsage,
  getSceneTextureMemory,
  formatBytes,
  disposeTexture,
  disposeSceneTextures,
  TexturePresets,
  type TextureOptimizationOptions,
} from './textureOptimization';

// Performance monitoring
export {
  PerformanceMonitor,
  AdaptiveQualityManager,
  detectDeviceCapabilities,
  getRecommendedSettings,
  formatMetrics,
  type PerformanceMetrics,
  type DeviceCapabilities,
  type RecommendedSettings,
} from './performanceMonitor';

// Device detection
export {
  isWebGLSupported,
  isWebGL2Supported,
  getWebGLCapabilities,
  detectDeviceSupport,
  isMobileDevice,
  isIOSDevice,
  isAndroidDevice,
  getDeviceSupportMessage,
  type DeviceSupport,
  type WebGLCapabilities,
} from './deviceDetection';

// Progressive loading
export {
  ProgressiveModelLoader,
  getProgressiveLoader,
  loadModelProgressive,
  type ProgressiveLoadOptions,
  type LoadProgress,
  type ProgressCallback,
} from './progressiveLoader';

// LOD generation
export {
  generateLODLevels,
  createLODObject,
  AutoLODManager,
  LODPresets as LODGenerationPresets,
  type LODGenerationOptions,
  type GeneratedLOD,
} from './lodGenerator';

// Model caching
export {
  ModelCache,
  getModelCache,
  getCachedModel,
  preloadModels,
  clearModelCache,
  getModelCacheStats,
  type CacheEntry,
  type CacheOptions,
  type CacheStats,
} from './modelCache';

