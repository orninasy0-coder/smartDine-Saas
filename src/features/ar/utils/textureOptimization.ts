import * as THREE from 'three';

/**
 * Texture optimization utilities for improving texture performance and memory usage
 */

export interface TextureOptimizationOptions {
  /**
   * Maximum texture size (width/height)
   * @default 2048
   */
  maxSize?: number;
  /**
   * Enable mipmaps for better quality at distance
   * @default true
   */
  generateMipmaps?: boolean;
  /**
   * Texture minification filter
   * @default THREE.LinearMipmapLinearFilter
   */
  minFilter?: THREE.TextureFilter;
  /**
   * Texture magnification filter
   * @default THREE.LinearFilter
   */
  magFilter?: THREE.MagnificationTextureFilter;
  /**
   * Anisotropic filtering level (1-16)
   * @default 4
   */
  anisotropy?: number;
  /**
   * Compress textures to reduce memory
   * @default true
   */
  compress?: boolean;
}

/**
 * Optimize textures in a scene
 */
export function optimizeSceneTextures(
  scene: THREE.Object3D,
  options: TextureOptimizationOptions = {}
): void {
  const {
    maxSize = 2048,
    generateMipmaps = true,
    minFilter = THREE.LinearMipmapLinearFilter,
    magFilter = THREE.LinearFilter,
    anisotropy = 4,
    compress = true,
  } = options;

  const textures = new Set<THREE.Texture>();

  // Collect all textures from materials
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      materials.forEach((material) => {
        collectTexturesFromMaterial(material, textures);
      });
    }
  });

  // Optimize each texture
  textures.forEach((texture) => {
    optimizeTexture(texture, {
      maxSize,
      generateMipmaps,
      minFilter,
      magFilter,
      anisotropy,
      encoding,
      compress,
    });
  });
}

/**
 * Collect all textures from a material
 */
function collectTexturesFromMaterial(
  material: THREE.Material,
  textures: Set<THREE.Texture>
): void {
  const textureProperties = [
    'map',
    'normalMap',
    'roughnessMap',
    'metalnessMap',
    'aoMap',
    'emissiveMap',
    'bumpMap',
    'displacementMap',
    'alphaMap',
    'lightMap',
    'envMap',
  ];

  textureProperties.forEach((prop) => {
    if (prop in material) {
      const texture = (material as any)[prop];
      if (texture instanceof THREE.Texture) {
        textures.add(texture);
      }
    }
  });
}

/**
 * Optimize a single texture
 */
export function optimizeTexture(
  texture: THREE.Texture,
  options: TextureOptimizationOptions = {}
): void {
  const {
    maxSize = 2048,
    generateMipmaps = true,
    minFilter = THREE.LinearMipmapLinearFilter,
    magFilter = THREE.LinearFilter,
    anisotropy = 4,
  } = options;

  // Set texture filters
  texture.minFilter = minFilter;
  texture.magFilter = magFilter;
  texture.generateMipmaps = generateMipmaps;

  // Set anisotropic filtering for better quality
  texture.anisotropy = anisotropy;

  // Resize if needed
  if (texture.image) {
    const image = texture.image as HTMLImageElement;
    const { width, height } = image;
    if (width > maxSize || height > maxSize) {
      resizeTexture(texture, maxSize);
    }
  }

  // Mark for update
  texture.needsUpdate = true;
}

/**
 * Resize a texture to fit within max dimensions
 */
function resizeTexture(texture: THREE.Texture, maxSize: number): void {
  if (!texture.image) return;

  const image = texture.image;
  const { width, height } = image;

  if (width <= maxSize && height <= maxSize) return;

  // Calculate new dimensions maintaining aspect ratio
  const scale = Math.min(maxSize / width, maxSize / height);
  const newWidth = Math.floor(width * scale);
  const newHeight = Math.floor(height * scale);

  // Create canvas for resizing
  const canvas = document.createElement('canvas');
  canvas.width = newWidth;
  canvas.height = newHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Draw resized image
  ctx.drawImage(image, 0, 0, newWidth, newHeight);

  // Update texture image
  texture.image = canvas;
  texture.needsUpdate = true;
}

/**
 * Compress texture by reducing quality
 */
export function compressTexture(
  texture: THREE.Texture,
  quality: number = 0.8
): void {
  if (!texture.image) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = texture.image.width;
  canvas.height = texture.image.height;

  // Draw original image
  ctx.drawImage(texture.image, 0, 0);

  // Convert to compressed format (JPEG)
  canvas.toBlob(
    (blob) => {
      if (blob) {
        const img = new Image();
        img.onload = () => {
          texture.image = img;
          texture.needsUpdate = true;
        };
        img.src = URL.createObjectURL(blob);
      }
    },
    'image/jpeg',
    quality
  );
}

/**
 * Calculate texture memory usage
 */
export function getTextureMemoryUsage(texture: THREE.Texture): number {
  if (!texture.image) return 0;

  const { width, height } = texture.image;
  let bytesPerPixel = 4; // RGBA

  // Account for mipmaps (adds ~33% more memory)
  const mipmapMultiplier = texture.generateMipmaps ? 1.33 : 1;

  return width * height * bytesPerPixel * mipmapMultiplier;
}

/**
 * Calculate total texture memory for a scene
 */
export function getSceneTextureMemory(scene: THREE.Object3D): number {
  const textures = new Set<THREE.Texture>();

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      materials.forEach((material) => {
        collectTexturesFromMaterial(material, textures);
      });
    }
  });

  let totalMemory = 0;
  textures.forEach((texture) => {
    totalMemory += getTextureMemoryUsage(texture);
  });

  return totalMemory;
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Texture compression presets
 */
export const TexturePresets = {
  /**
   * High quality preset - for hero models
   */
  high: {
    maxSize: 2048,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter,
    anisotropy: 16,
    compress: false,
  } as TextureOptimizationOptions,

  /**
   * Medium quality preset - balanced performance
   */
  medium: {
    maxSize: 1024,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter,
    anisotropy: 4,
    compress: true,
  } as TextureOptimizationOptions,

  /**
   * Low quality preset - maximum performance
   */
  low: {
    maxSize: 512,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapNearestFilter,
    magFilter: THREE.LinearFilter,
    anisotropy: 1,
    compress: true,
  } as TextureOptimizationOptions,

  /**
   * Mobile preset - optimized for mobile devices
   */
  mobile: {
    maxSize: 512,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter,
    anisotropy: 2,
    compress: true,
  } as TextureOptimizationOptions,
};

/**
 * Dispose of texture resources
 */
export function disposeTexture(texture: THREE.Texture): void {
  texture.dispose();

  // Revoke object URL if it exists
  if (texture.image && texture.image.src?.startsWith('blob:')) {
    URL.revokeObjectURL(texture.image.src);
  }
}

/**
 * Dispose of all textures in a scene
 */
export function disposeSceneTextures(scene: THREE.Object3D): void {
  const textures = new Set<THREE.Texture>();

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      materials.forEach((material) => {
        collectTexturesFromMaterial(material, textures);
      });
    }
  });

  textures.forEach((texture) => {
    disposeTexture(texture);
  });
}
