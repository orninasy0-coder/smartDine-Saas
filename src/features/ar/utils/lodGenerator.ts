import * as THREE from 'three';
import { optimizeModel, type OptimizationOptions } from './modelOptimization';

/**
 * LOD (Level of Detail) generation utilities
 * Automatically generates multiple quality levels from a single model
 */

export interface LODGenerationOptions {
  /**
   * Number of LOD levels to generate
   * @default 3
   */
  levels?: number;
  /**
   * Simplification ratios for each level (0-1)
   * @default [1, 0.5, 0.25]
   */
  simplificationRatios?: number[];
  /**
   * Distance thresholds for each level
   * @default [5, 15, 30]
   */
  distances?: number[];
  /**
   * Texture size for each level
   * @default [2048, 1024, 512]
   */
  textureSizes?: number[];
  /**
   * Enable geometry merging
   * @default true
   */
  mergeGeometries?: boolean;
  /**
   * Compute normals after simplification
   * @default true
   */
  computeNormals?: boolean;
}

export interface GeneratedLOD {
  /**
   * LOD level (0 = highest quality)
   */
  level: number;
  /**
   * Distance threshold
   */
  distance: number;
  /**
   * Generated model
   */
  model: THREE.Object3D;
  /**
   * Vertex count
   */
  vertices: number;
  /**
   * Triangle count
   */
  triangles: number;
  /**
   * Simplification ratio applied
   */
  ratio: number;
}

/**
 * Generate multiple LOD levels from a base model
 */
export function generateLODLevels(
  baseModel: THREE.Object3D,
  options: LODGenerationOptions = {}
): GeneratedLOD[] {
  const {
    levels = 3,
    simplificationRatios = [1, 0.5, 0.25],
    distances = [5, 15, 30],
    textureSizes = [2048, 1024, 512],
    mergeGeometries = true,
    computeNormals = true,
  } = options;

  const lodLevels: GeneratedLOD[] = [];

  for (let i = 0; i < levels; i++) {
    const ratio = simplificationRatios[i] || Math.pow(0.5, i);
    const distance = distances[i] || 5 * Math.pow(2, i);
    const textureSize = textureSizes[i] || 2048 / Math.pow(2, i);

    // Clone the base model
    const lodModel = baseModel.clone(true);

    // Apply optimizations
    const optimizationOptions: OptimizationOptions = {
      mergeGeometries: mergeGeometries && i > 0,
      simplifyGeometry: i > 0,
      simplificationRatio: ratio,
      computeNormals,
      disposeOriginal: false,
    };

    const optimizedModel = optimizeModel(lodModel, optimizationOptions);

    // Optimize textures for this LOD level
    optimizeModelTextures(optimizedModel, textureSize);

    // Calculate statistics
    const stats = calculateModelStats(optimizedModel);

    lodLevels.push({
      level: i,
      distance,
      model: optimizedModel,
      vertices: stats.vertices,
      triangles: stats.triangles,
      ratio,
    });
  }

  return lodLevels;
}

/**
 * Optimize textures for a specific LOD level
 */
function optimizeModelTextures(model: THREE.Object3D, maxSize: number): void {
  const textures = new Set<THREE.Texture>();

  model.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      materials.forEach((material) => {
        // Collect all texture properties
        const textureProps = [
          'map',
          'normalMap',
          'roughnessMap',
          'metalnessMap',
          'aoMap',
          'emissiveMap',
        ];

        textureProps.forEach((prop) => {
          if (prop in material) {
            const texture = (material as any)[prop];
            if (texture instanceof THREE.Texture) {
              textures.add(texture);
            }
          }
        });
      });
    }
  });

  // Resize textures
  textures.forEach((texture) => {
    if (texture.image) {
      const { width, height } = texture.image;
      if (width > maxSize || height > maxSize) {
        resizeTexture(texture, maxSize);
      }
    }
  });
}

/**
 * Resize texture to fit within max size
 */
function resizeTexture(texture: THREE.Texture, maxSize: number): void {
  if (!texture.image) return;

  const image = texture.image;
  const { width, height } = image;

  if (width <= maxSize && height <= maxSize) return;

  const scale = Math.min(maxSize / width, maxSize / height);
  const newWidth = Math.floor(width * scale);
  const newHeight = Math.floor(height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = newWidth;
  canvas.height = newHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.drawImage(image, 0, 0, newWidth, newHeight);
  texture.image = canvas;
  texture.needsUpdate = true;
}

/**
 * Calculate model statistics
 */
function calculateModelStats(model: THREE.Object3D): {
  vertices: number;
  triangles: number;
} {
  let vertices = 0;
  let triangles = 0;

  model.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      const positions = child.geometry.attributes.position;
      if (positions) {
        vertices += positions.count;
      }

      if (child.geometry.index) {
        triangles += child.geometry.index.count / 3;
      } else if (positions) {
        triangles += positions.count / 3;
      }
    }
  });

  return { vertices, triangles };
}

/**
 * Create THREE.LOD object from generated levels
 */
export function createLODObject(lodLevels: GeneratedLOD[]): THREE.LOD {
  const lod = new THREE.LOD();

  lodLevels.forEach((level) => {
    lod.addLevel(level.model, level.distance);
  });

  return lod;
}

/**
 * Automatic LOD manager with dynamic quality adjustment
 */
export class AutoLODManager {
  private lodObjects: Map<string, THREE.LOD> = new Map();
  private camera: THREE.Camera;
  private updateInterval: number = 100; // ms
  private lastUpdate: number = 0;

  constructor(camera: THREE.Camera) {
    this.camera = camera;
  }

  /**
   * Register a model for automatic LOD management
   */
  register(id: string, baseModel: THREE.Object3D, options?: LODGenerationOptions): THREE.LOD {
    // Generate LOD levels
    const lodLevels = generateLODLevels(baseModel, options);

    // Create LOD object
    const lodObject = createLODObject(lodLevels);

    // Store reference
    this.lodObjects.set(id, lodObject);

    return lodObject;
  }

  /**
   * Unregister a model
   */
  unregister(id: string): void {
    const lodObject = this.lodObjects.get(id);
    if (lodObject) {
      // Dispose of all LOD levels
      lodObject.levels.forEach((level) => {
        disposeObject(level.object);
      });
      this.lodObjects.delete(id);
    }
  }

  /**
   * Update all LOD objects (call in animation loop)
   */
  update(): void {
    const now = performance.now();
    if (now - this.lastUpdate < this.updateInterval) {
      return;
    }

    this.lastUpdate = now;

    this.lodObjects.forEach((lodObject) => {
      lodObject.update(this.camera);
    });
  }

  /**
   * Get current LOD level for an object
   */
  getCurrentLevel(id: string): number {
    const lodObject = this.lodObjects.get(id);
    if (!lodObject) return -1;

    // Find active level
    for (let i = 0; i < lodObject.levels.length; i++) {
      if (lodObject.levels[i].object.visible) {
        return i;
      }
    }

    return -1;
  }

  /**
   * Force specific LOD level
   */
  setLevel(id: string, level: number): void {
    const lodObject = this.lodObjects.get(id);
    if (!lodObject) return;

    // Hide all levels
    lodObject.levels.forEach((l) => {
      l.object.visible = false;
    });

    // Show requested level
    if (level >= 0 && level < lodObject.levels.length) {
      lodObject.levels[level].object.visible = true;
    }
  }

  /**
   * Get statistics for all managed LOD objects
   */
  getStats(): {
    totalObjects: number;
    activeLevel: Map<string, number>;
    totalVertices: number;
    totalTriangles: number;
  } {
    const stats = {
      totalObjects: this.lodObjects.size,
      activeLevel: new Map<string, number>(),
      totalVertices: 0,
      totalTriangles: 0,
    };

    this.lodObjects.forEach((lodObject, id) => {
      const level = this.getCurrentLevel(id);
      stats.activeLevel.set(id, level);

      if (level >= 0) {
        const modelStats = calculateModelStats(lodObject.levels[level].object);
        stats.totalVertices += modelStats.vertices;
        stats.totalTriangles += modelStats.triangles;
      }
    });

    return stats;
  }

  /**
   * Dispose all resources
   */
  dispose(): void {
    this.lodObjects.forEach((lodObject, id) => {
      this.unregister(id);
    });
    this.lodObjects.clear();
  }
}

/**
 * Dispose of an object and its resources
 */
function disposeObject(object: THREE.Object3D): void {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => mat.dispose());
        } else {
          child.material.dispose();
        }
      }
    }
  });
}

/**
 * Preset LOD configurations
 */
export const LODPresets = {
  /**
   * High quality - 3 levels with minimal simplification
   */
  high: {
    levels: 3,
    simplificationRatios: [1, 0.75, 0.5],
    distances: [3, 10, 25],
    textureSizes: [2048, 1024, 512],
  } as LODGenerationOptions,

  /**
   * Balanced - 3 levels with moderate simplification
   */
  balanced: {
    levels: 3,
    simplificationRatios: [1, 0.5, 0.25],
    distances: [5, 15, 30],
    textureSizes: [2048, 1024, 512],
  } as LODGenerationOptions,

  /**
   * Performance - 4 levels with aggressive simplification
   */
  performance: {
    levels: 4,
    simplificationRatios: [1, 0.6, 0.3, 0.1],
    distances: [5, 12, 25, 50],
    textureSizes: [1024, 512, 256, 128],
  } as LODGenerationOptions,

  /**
   * Mobile - 2 levels optimized for mobile
   */
  mobile: {
    levels: 2,
    simplificationRatios: [1, 0.4],
    distances: [4, 15],
    textureSizes: [512, 256],
  } as LODGenerationOptions,
};
