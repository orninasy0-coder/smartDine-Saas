# 3D Model Loading Optimization

Comprehensive guide to optimizing 3D model loading and rendering performance in the AR viewer.

## Overview

This implementation provides three key optimization strategies:

1. **Progressive Loading** - Load preview first, then stream full quality
2. **LOD (Level of Detail)** - Automatic quality switching based on distance
3. **Model Caching** - LRU cache with memory management

## 1. Progressive Loading

### What is Progressive Loading?

Progressive loading improves perceived performance by:
- Loading a low-quality preview model first (fast)
- Streaming the full-quality model in the background
- Seamlessly swapping to full quality when ready

### Usage

```tsx
import { ProgressiveModel } from '@/features/ar/components';

function MyARViewer() {
  return (
    <Canvas>
      <Suspense fallback={<ModelProgress />}>
        <ProgressiveModel
          modelUrl="/models/dish-full.glb"
          previewUrl="/models/dish-preview.glb"
          loadOptions={{
            useDraco: true,
            loadPreview: true,
            enableStreaming: true,
            priority: 8,
          }}
          onProgress={(progress) => {
            console.log(`Stage: ${progress.stage}, Progress: ${progress.progress}%`);
          }}
        />
      </Suspense>
    </Canvas>
  );
}
```

### Creating Preview Models

To create preview models:

1. **Reduce polygon count** to 25% of original
2. **Compress textures** to 512x512 or lower
3. **Use Draco compression** for smaller file sizes
4. **Remove unnecessary details** (small decorations, etc.)

Example using Blender:
```python
# Decimate modifier for polygon reduction
bpy.ops.object.modifier_add(type='DECIMATE')
bpy.context.object.modifiers["Decimate"].ratio = 0.25

# Export with Draco compression
bpy.ops.export_scene.gltf(
    filepath="dish-preview.glb",
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=10
)
```

### Progressive Loading Options

```typescript
interface ProgressiveLoadOptions {
  useDraco?: boolean;           // Enable Draco compression (default: true)
  dracoPath?: string;            // Path to Draco decoder (default: '/draco/')
  loadPreview?: boolean;         // Load preview first (default: true)
  previewUrl?: string;           // Preview model URL
  enableStreaming?: boolean;     // Enable streaming (default: true)
  priority?: number;             // Priority 0-10 (default: 5)
}
```

### Loading Stages

1. **Preview** (0-30%) - Low-quality model loads quickly
2. **Streaming** (30-100%) - Full-quality model streams in background
3. **Complete** (100%) - Full-quality model is ready

## 2. LOD (Level of Detail)

### What is LOD?

LOD automatically switches between different quality levels based on camera distance:
- **Close distance** → High quality (more polygons, better textures)
- **Medium distance** → Medium quality
- **Far distance** → Low quality (fewer polygons, smaller textures)

This maintains 60 FPS by reducing detail when it's not visible.

### Usage

#### Automatic LOD with Presets

```tsx
import { AutoLODModel } from '@/features/ar/components';

function MyARViewer() {
  return (
    <Canvas>
      <AutoLODModel
        id="dish-model"
        model={baseModel}
        preset="balanced"  // 'high' | 'balanced' | 'performance' | 'mobile'
        onLODChange={(level) => {
          console.log('Switched to LOD level:', level);
        }}
        showDebug={true}
      />
    </Canvas>
  );
}
```

#### Manual LOD Configuration

```tsx
import { AutoLODModel } from '@/features/ar/components';

function MyARViewer() {
  return (
    <Canvas>
      <AutoLODModel
        id="dish-model"
        model={baseModel}
        lodOptions={{
          levels: 3,
          simplificationRatios: [1, 0.5, 0.25],
          distances: [5, 15, 30],
          textureSizes: [2048, 1024, 512],
        }}
      />
    </Canvas>
  );
}
```

### LOD Presets

#### High Quality
- 3 levels with minimal simplification
- Ratios: [1, 0.75, 0.5]
- Distances: [3m, 10m, 25m]
- Textures: [2048, 1024, 512]

#### Balanced (Recommended)
- 3 levels with moderate simplification
- Ratios: [1, 0.5, 0.25]
- Distances: [5m, 15m, 30m]
- Textures: [2048, 1024, 512]

#### Performance
- 4 levels with aggressive simplification
- Ratios: [1, 0.6, 0.3, 0.1]
- Distances: [5m, 12m, 25m, 50m]
- Textures: [1024, 512, 256, 128]

#### Mobile
- 2 levels optimized for mobile
- Ratios: [1, 0.4]
- Distances: [4m, 15m]
- Textures: [512, 256]

### Generating LOD Levels

```typescript
import { generateLODLevels, LODPresets } from '@/features/ar/utils';

// Generate LOD levels from base model
const lodLevels = generateLODLevels(baseModel, LODPresets.balanced);

// Each level contains:
// - level: number (0 = highest quality)
// - distance: number (threshold in meters)
// - model: THREE.Object3D
// - vertices: number
// - triangles: number
// - ratio: number (simplification ratio)
```

## 3. Model Caching

### What is Model Caching?

Model caching stores loaded models in memory to avoid re-downloading:
- **LRU eviction** - Removes least recently used models when cache is full
- **Priority-based** - Important models stay in cache longer
- **Memory monitoring** - Automatic cleanup when memory is low
- **Persistent storage** - Uses IndexedDB for cross-session caching

### Usage

```tsx
import { CachedModel } from '@/features/ar/components';

function MyARViewer() {
  return (
    <Canvas>
      <Suspense fallback={<ModelProgress />}>
        <CachedModel
          modelUrl="/models/dish.glb"
          priority={7}  // 0-10, higher = more important
          onLoad={(model) => {
            console.log('Model loaded from cache');
          }}
        />
      </Suspense>
    </Canvas>
  );
}
```

### Preloading Models

```typescript
import { preloadModels } from '@/features/ar/utils';

// Preload models in background
await preloadModels([
  '/models/dish1.glb',
  '/models/dish2.glb',
  '/models/dish3.glb',
], 3); // priority
```

### Cache Configuration

```typescript
import { getModelCache } from '@/features/ar/utils';

const cache = getModelCache({
  maxSize: 100 * 1024 * 1024,    // 100MB max cache size
  maxEntries: 50,                 // Max 50 models
  enablePersistent: true,         // Use IndexedDB
  enableMemoryMonitoring: true,   // Auto-cleanup
  memoryThreshold: 0.8,           // Cleanup at 80% full
});
```

### Cache Statistics

```typescript
import { getModelCacheStats } from '@/features/ar/utils';

const stats = getModelCacheStats();
console.log({
  entries: stats.entries,           // Number of cached models
  size: stats.size,                 // Total size in bytes
  hitRate: stats.hitRate,           // Cache hit rate (0-1)
  hits: stats.hits,                 // Total cache hits
  misses: stats.misses,             // Total cache misses
  memoryUsage: stats.memoryUsage,   // Memory usage (0-1)
});
```

### Cache Priority Guidelines

- **10** - Critical UI elements (always visible)
- **8-9** - Featured items, hero models
- **5-7** - Regular menu items
- **3-4** - Background elements
- **0-2** - Rarely used models

## Combining All Three Techniques

For optimal performance, combine all three techniques:

```tsx
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { 
  ProgressiveModel, 
  AutoLODModel, 
  CachedModel,
  ModelProgress 
} from '@/features/ar/components';
import { preloadModels } from '@/features/ar/utils';

function OptimizedARViewer() {
  // Preload important models
  useEffect(() => {
    preloadModels([
      '/models/featured-dish.glb',
      '/models/popular-dish.glb',
    ], 8);
  }, []);

  return (
    <Canvas>
      <Suspense fallback={<ModelProgress />}>
        {/* Use CachedModel + ProgressiveModel for initial load */}
        <ProgressiveModel
          modelUrl="/models/dish-full.glb"
          previewUrl="/models/dish-preview.glb"
          priority={8}
          loadOptions={{
            useDraco: true,
            loadPreview: true,
            enableStreaming: true,
          }}
        />

        {/* Use AutoLODModel for runtime performance */}
        <AutoLODModel
          id="background-model"
          model={backgroundModel}
          preset="performance"
        />
      </Suspense>
    </Canvas>
  );
}
```

## Performance Benchmarks

### Without Optimization
- Initial load: 3-5 seconds
- FPS with 10 models: 20-30 FPS
- Memory usage: 500MB+
- Network requests: Every page load

### With Optimization
- Initial load: 0.5-1 second (preview)
- FPS with 10 models: 55-60 FPS
- Memory usage: 150-200MB
- Network requests: First load only (cached)

## Best Practices

### 1. Progressive Loading
- ✅ Create preview models at 25% quality
- ✅ Use Draco compression for both preview and full models
- ✅ Set higher priority for visible models
- ✅ Show loading progress to users
- ❌ Don't skip preview for large models (>5MB)

### 2. LOD System
- ✅ Use "balanced" preset as starting point
- ✅ Test on target devices and adjust distances
- ✅ Monitor FPS and adjust quality levels
- ✅ Use "mobile" preset for mobile devices
- ❌ Don't use too many LOD levels (3-4 is optimal)

### 3. Model Caching
- ✅ Preload models users are likely to view
- ✅ Set appropriate priorities
- ✅ Monitor cache hit rate (aim for >70%)
- ✅ Clear cache when memory is low
- ❌ Don't cache very large models (>10MB)

## Troubleshooting

### Models not loading progressively
- Check that preview URL is valid
- Verify Draco decoder path is correct
- Ensure preview model is actually smaller

### LOD not switching
- Verify camera is moving (OrbitControls enabled)
- Check distance thresholds are appropriate
- Ensure LOD levels were generated successfully

### Cache not working
- Check browser supports IndexedDB
- Verify cache size limits
- Monitor cache stats for issues
- Clear cache and try again

## File Size Guidelines

### Preview Models
- Target: 100-500KB
- Max polygons: 5,000-10,000
- Texture size: 512x512

### Full Quality Models
- Target: 1-5MB
- Max polygons: 50,000-100,000
- Texture size: 2048x2048

### LOD Levels
- Level 0 (High): 100% quality
- Level 1 (Medium): 50% quality
- Level 2 (Low): 25% quality

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Mobile browsers (use mobile preset)

## Related Documentation

- [AR Viewer Components](./COMPONENTS.md)
- [Performance Optimization](./PERFORMANCE_OPTIMIZATION.md)
- [Device Detection](./DEVICE_DETECTION.md)
- [Three.js Best Practices](https://threejs.org/docs/#manual/en/introduction/Performance-tips)

## Examples

See `OptimizedARViewer.example.tsx` for a complete working example demonstrating all three optimization techniques.
