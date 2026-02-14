# AR Performance Optimization Guide

This document describes the performance optimization features implemented for the AR viewer module.

## Overview

The AR module includes comprehensive performance optimization utilities to ensure smooth 3D rendering across different devices and network conditions. The optimizations are organized into three main categories:

1. **Model Optimization** - Reducing geometry complexity and draw calls
2. **Texture Optimization** - Compressing and resizing textures
3. **LOD (Level of Detail)** - Dynamically switching model quality based on distance

## Features

### 1. Model Optimization

Located in `src/features/ar/utils/modelOptimization.ts`

#### Key Functions

- `optimizeModel()` - Optimize a 3D model by merging geometries and reducing complexity
- `getModelStats()` - Get statistics about a model (vertices, triangles, draw calls)
- `disposeScene()` - Properly dispose of all resources in a scene

#### Usage Example

```typescript
import { optimizeModel, getModelStats } from '@/features/ar/utils';

// Optimize a loaded model
const optimizedScene = optimizeModel(scene, {
  mergeGeometries: true,
  simplifyGeometry: false,
  computeNormals: true,
});

// Get model statistics
const stats = getModelStats(scene);
console.log(`Vertices: ${stats.vertices}`);
console.log(`Triangles: ${stats.triangles}`);
console.log(`Draw Calls: ${stats.drawCalls}`);
```

#### Optimization Options

```typescript
interface OptimizationOptions {
  mergeGeometries?: boolean;      // Merge meshes to reduce draw calls
  simplifyGeometry?: boolean;     // Reduce vertex count
  simplificationRatio?: number;   // Target reduction (0-1)
  disposeOriginal?: boolean;      // Clean up original resources
  computeNormals?: boolean;       // Recompute normals for smooth shading
}
```

### 2. Texture Optimization

Located in `src/features/ar/utils/textureOptimization.ts`

#### Key Functions

- `optimizeSceneTextures()` - Optimize all textures in a scene
- `optimizeTexture()` - Optimize a single texture
- `compressTexture()` - Compress texture to reduce memory
- `getTextureMemoryUsage()` - Calculate texture memory usage
- `TexturePresets` - Predefined optimization presets

#### Usage Example

```typescript
import { optimizeSceneTextures, TexturePresets } from '@/features/ar/utils';

// Optimize all textures with medium preset
optimizeSceneTextures(scene, TexturePresets.medium);

// Custom optimization
optimizeSceneTextures(scene, {
  maxSize: 1024,
  generateMipmaps: true,
  anisotropy: 4,
  compress: true,
});
```

#### Texture Presets

- **High** - 2048px, 16x anisotropy, no compression (hero models)
- **Medium** - 1024px, 4x anisotropy, compressed (balanced)
- **Low** - 512px, 1x anisotropy, compressed (maximum performance)
- **Mobile** - 512px, 2x anisotropy, compressed (mobile devices)

### 3. Level of Detail (LOD)

Located in `src/features/ar/components/ModelLOD.tsx`

#### Component: ModelLOD

Automatically switches between different model quality levels based on camera distance.

```typescript
import { ModelLOD } from '@/features/ar/components';

function MyScene() {
  const lodLevels = [
    { modelUrl: '/models/dish_high.glb', distance: 5 },
    { modelUrl: '/models/dish_medium.glb', distance: 10 },
    { modelUrl: '/models/dish_low.glb', distance: 20 },
  ];

  return (
    <ModelLOD
      levels={lodLevels}
      onLODChange={(level) => console.log(`LOD level: ${level}`)}
    />
  );
}
```

#### Hook: useLODLevels

Generate LOD levels from a base model URL:

```typescript
import { useLODLevels, LODPresets } from '@/features/ar/components';

const lodLevels = useLODLevels('/models/dish.glb', LODPresets.medium);
// Generates:
// - /models/dish_lod0.glb (distance: 5)
// - /models/dish_lod1.glb (distance: 10)
// - /models/dish_lod2.glb (distance: 20)
```

#### LOD Presets

- **High** - 3 levels, close transitions (1.5x multiplier)
- **Medium** - 3 levels, balanced transitions (2x multiplier)
- **Low** - 2 levels, aggressive transitions (3x multiplier)
- **Mobile** - 2 levels, optimized for mobile (2.5x multiplier)

### 4. Performance Monitoring

Located in `src/features/ar/utils/performanceMonitor.ts`

#### PerformanceMonitor Class

Track real-time performance metrics:

```typescript
import { PerformanceMonitor } from '@/features/ar/utils';

const monitor = new PerformanceMonitor(renderer);

// In render loop
function animate() {
  monitor.update();
  
  const metrics = monitor.getMetrics();
  console.log(`FPS: ${metrics.fps}`);
  console.log(`Frame Time: ${metrics.frameTime}ms`);
  console.log(`Draw Calls: ${metrics.drawCalls}`);
  
  requestAnimationFrame(animate);
}
```

#### AdaptiveQualityManager Class

Automatically adjust quality based on performance:

```typescript
import { AdaptiveQualityManager, PerformanceMonitor } from '@/features/ar/utils';

const monitor = new PerformanceMonitor(renderer);
const qualityManager = new AdaptiveQualityManager(monitor, 30); // Target 30 FPS

function animate() {
  monitor.update();
  
  const newQuality = qualityManager.update();
  if (newQuality) {
    console.log(`Quality adjusted to: ${newQuality}`);
    applyQualitySettings(newQuality);
  }
  
  requestAnimationFrame(animate);
}
```

#### Device Capability Detection

Detect device capabilities and get recommended settings:

```typescript
import { detectDeviceCapabilities, getRecommendedSettings } from '@/features/ar/utils';

const capabilities = detectDeviceCapabilities(renderer);
console.log(`GPU Tier: ${capabilities.gpuTier}`);
console.log(`Mobile: ${capabilities.isMobile}`);
console.log(`Max Texture Size: ${capabilities.maxTextureSize}`);

const settings = getRecommendedSettings(capabilities);
console.log(`Recommended Shadow Map Size: ${settings.shadowMapSize}`);
console.log(`Recommended LOD Levels: ${settings.lodLevels}`);
```

## Best Practices

### 1. Model Preparation

- **Export models in multiple LOD levels** during the 3D modeling phase
- Use tools like Blender's Decimate modifier to create lower-poly versions
- Name files consistently: `model_lod0.glb`, `model_lod1.glb`, etc.

### 2. Texture Preparation

- **Use power-of-two dimensions** (512, 1024, 2048) for better GPU compatibility
- **Compress textures** before uploading to reduce download time
- Consider using **WebP or AVIF** formats for better compression
- Use **texture atlases** to combine multiple textures into one

### 3. Runtime Optimization

- **Detect device capabilities** on initialization
- **Apply appropriate presets** based on device tier
- **Monitor performance** and adjust quality dynamically
- **Dispose of resources** when models are no longer needed

### 4. Mobile Optimization

```typescript
import {
  detectDeviceCapabilities,
  getRecommendedSettings,
  TexturePresets,
  LODPresets,
} from '@/features/ar/utils';

// Detect device
const capabilities = detectDeviceCapabilities(renderer);
const settings = getRecommendedSettings(capabilities);

// Apply mobile-specific optimizations
if (capabilities.isMobile) {
  // Use mobile texture preset
  optimizeSceneTextures(scene, TexturePresets.mobile);
  
  // Use mobile LOD preset
  const lodLevels = useLODLevels(modelUrl, LODPresets.mobile);
  
  // Disable expensive features
  renderer.shadowMap.enabled = false;
  renderer.setPixelRatio(1);
}
```

## Performance Metrics

### Target Performance

- **Desktop High-End**: 60 FPS, 2048px textures, 3 LOD levels
- **Desktop Medium**: 45-60 FPS, 1024px textures, 3 LOD levels
- **Mobile High-End**: 30-45 FPS, 512px textures, 2 LOD levels
- **Mobile Low-End**: 25-30 FPS, 512px textures, 2 LOD levels

### Memory Budget

- **Desktop**: Up to 500MB texture memory
- **Mobile**: Up to 100MB texture memory

### Draw Call Budget

- **Desktop**: Up to 100 draw calls per frame
- **Mobile**: Up to 50 draw calls per frame

## Troubleshooting

### Low FPS

1. Check draw calls: `metrics.drawCalls` should be < 100
2. Check triangle count: `metrics.triangles` should be < 100k
3. Enable adaptive quality management
4. Reduce texture sizes
5. Use more aggressive LOD transitions

### High Memory Usage

1. Check texture memory: `getSceneTextureMemory(scene)`
2. Reduce texture sizes with `TexturePresets.low`
3. Enable texture compression
4. Dispose of unused models: `disposeScene(scene)`

### Slow Loading

1. Reduce model file sizes
2. Use progressive loading with LOD
3. Preload models: `preloadModel(modelUrl)`
4. Compress textures before upload

## Examples

See the following files for complete examples:

- `ModelLOD.example.tsx` - LOD usage examples
- `performanceOptimization.example.tsx` - Performance monitoring examples

## Testing

Run tests with:

```bash
npm run test src/features/ar/components/ModelLOD.test.tsx
npm run test src/features/ar/utils/performanceMonitor.test.ts
```

## Future Enhancements

- [ ] Implement proper geometry simplification algorithm
- [ ] Add support for compressed texture formats (KTX2, Basis)
- [ ] Implement occlusion culling
- [ ] Add frustum culling optimization
- [ ] Support for instanced rendering
- [ ] GPU-based LOD selection
- [ ] Streaming LOD loading

## References

- [Three.js Performance Tips](https://threejs.org/docs/#manual/en/introduction/Performance-tips)
- [WebGL Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)
- [React Three Fiber Performance](https://docs.pmnd.rs/react-three-fiber/advanced/performance)
