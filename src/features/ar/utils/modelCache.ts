import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Advanced model caching system with LRU eviction and memory management
 */

export interface CacheEntry {
  /**
   * Cached model
   */
  model: THREE.Object3D;
  /**
   * URL of the model
   */
  url: string;
  /**
   * Size in bytes (estimated)
   */
  size: number;
  /**
   * Last access timestamp
   */
  lastAccess: number;
  /**
   * Access count
   */
  accessCount: number;
  /**
   * Priority (higher = more important)
   */
  priority: number;
}

export interface CacheOptions {
  /**
   * Maximum cache size in bytes
   * @default 100 * 1024 * 1024 (100MB)
   */
  maxSize?: number;
  /**
   * Maximum number of cached models
   * @default 50
   */
  maxEntries?: number;
  /**
   * Enable persistent cache (IndexedDB)
   * @default true
   */
  enablePersistent?: boolean;
  /**
   * Cache name for IndexedDB
   * @default 'model-cache'
   */
  cacheName?: string;
  /**
   * Enable memory monitoring
   * @default true
   */
  enableMemoryMonitoring?: boolean;
  /**
   * Memory threshold for auto-cleanup (0-1)
   * @default 0.8
   */
  memoryThreshold?: number;
}

export interface CacheStats {
  /**
   * Number of cached models
   */
  entries: number;
  /**
   * Total cache size in bytes
   */
  size: number;
  /**
   * Cache hit rate (0-1)
   */
  hitRate: number;
  /**
   * Total hits
   */
  hits: number;
  /**
   * Total misses
   */
  misses: number;
  /**
   * Memory usage percentage (0-1)
   */
  memoryUsage: number;
}

/**
 * Model cache manager with LRU eviction
 */
export class ModelCache {
  private cache: Map<string, CacheEntry> = new Map();
  private options: Required<CacheOptions>;
  private currentSize: number = 0;
  private hits: number = 0;
  private misses: number = 0;
  private loader: GLTFLoader;
  private persistentCache?: IDBDatabase;

  constructor(options: CacheOptions = {}) {
    this.options = {
      maxSize: options.maxSize || 100 * 1024 * 1024,
      maxEntries: options.maxEntries || 50,
      enablePersistent: options.enablePersistent ?? true,
      cacheName: options.cacheName || 'model-cache',
      enableMemoryMonitoring: options.enableMemoryMonitoring ?? true,
      memoryThreshold: options.memoryThreshold || 0.8,
    };

    this.loader = new GLTFLoader();

    if (this.options.enablePersistent) {
      this.initPersistentCache();
    }

    if (this.options.enableMemoryMonitoring) {
      this.startMemoryMonitoring();
    }
  }

  /**
   * Initialize IndexedDB for persistent caching
   */
  private async initPersistentCache(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.options.cacheName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.persistentCache = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('models')) {
          db.createObjectStore('models', { keyPath: 'url' });
        }
      };
    });
  }

  /**
   * Get model from cache or load it
   */
  async get(url: string, priority: number = 5): Promise<THREE.Object3D> {
    // Check memory cache first
    const cached = this.cache.get(url);
    if (cached) {
      this.hits++;
      cached.lastAccess = Date.now();
      cached.accessCount++;
      return cached.model.clone(true);
    }

    this.misses++;

    // Check persistent cache
    if (this.options.enablePersistent && this.persistentCache) {
      const persistedModel = await this.getFromPersistent(url);
      if (persistedModel) {
        this.set(url, persistedModel, priority);
        return persistedModel.clone(true);
      }
    }

    // Load model
    const model = await this.loadModel(url);
    this.set(url, model, priority);

    // Save to persistent cache
    if (this.options.enablePersistent && this.persistentCache) {
      this.saveToPersistent(url, model);
    }

    return model.clone(true);
  }

  /**
   * Load model using GLTFLoader
   */
  private async loadModel(url: string): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => resolve(gltf.scene),
        undefined,
        reject
      );
    });
  }

  /**
   * Set model in cache
   */
  set(url: string, model: THREE.Object3D, priority: number = 5): void {
    const size = this.estimateModelSize(model);

    // Check if we need to evict entries
    while (
      (this.currentSize + size > this.options.maxSize ||
        this.cache.size >= this.options.maxEntries) &&
      this.cache.size > 0
    ) {
      this.evictLRU();
    }

    const entry: CacheEntry = {
      model: model.clone(true),
      url,
      size,
      lastAccess: Date.now(),
      accessCount: 1,
      priority,
    };

    this.cache.set(url, entry);
    this.currentSize += size;
  }

  /**
   * Check if model is cached
   */
  has(url: string): boolean {
    return this.cache.has(url);
  }

  /**
   * Remove model from cache
   */
  delete(url: string): boolean {
    const entry = this.cache.get(url);
    if (entry) {
      this.disposeModel(entry.model);
      this.currentSize -= entry.size;
      return this.cache.delete(url);
    }
    return false;
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.forEach((entry) => {
      this.disposeModel(entry.model);
    });
    this.cache.clear();
    this.currentSize = 0;
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Preload models
   */
  async preload(urls: string[], priority: number = 3): Promise<void> {
    const promises = urls.map((url) => this.get(url, priority));
    await Promise.all(promises);
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const totalRequests = this.hits + this.misses;
    const hitRate = totalRequests > 0 ? this.hits / totalRequests : 0;
    const memoryUsage = this.currentSize / this.options.maxSize;

    return {
      entries: this.cache.size,
      size: this.currentSize,
      hitRate,
      hits: this.hits,
      misses: this.misses,
      memoryUsage,
    };
  }

  /**
   * Evict least recently used entry
   */
  private evictLRU(): void {
    let lruEntry: [string, CacheEntry] | null = null;
    let lruScore = Infinity;

    // Calculate LRU score (lower = more likely to evict)
    this.cache.forEach((entry, url) => {
      const timeSinceAccess = Date.now() - entry.lastAccess;
      const score =
        (entry.accessCount * entry.priority) / (timeSinceAccess + 1);

      if (score < lruScore) {
        lruScore = score;
        lruEntry = [url, entry];
      }
    });

    if (lruEntry) {
      const [url, entry] = lruEntry;
      this.disposeModel(entry.model);
      this.cache.delete(url);
      this.currentSize -= entry.size;
    }
  }

  /**
   * Estimate model size in bytes
   */
  private estimateModelSize(model: THREE.Object3D): number {
    let size = 0;

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Geometry size
        if (child.geometry) {
          const positions = child.geometry.attributes.position;
          if (positions) {
            size += positions.array.byteLength;
          }

          if (child.geometry.index) {
            size += child.geometry.index.array.byteLength;
          }

          // Other attributes
          Object.keys(child.geometry.attributes).forEach((key) => {
            if (key !== 'position') {
              const attr = child.geometry.attributes[key];
              size += attr.array.byteLength;
            }
          });
        }

        // Texture size
        if (child.material) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];

          materials.forEach((mat) => {
            if ('map' in mat && mat.map?.image) {
              const img = mat.map.image;
              size += img.width * img.height * 4; // RGBA
            }
          });
        }
      }
    });

    return size;
  }

  /**
   * Dispose model resources
   */
  private disposeModel(model: THREE.Object3D): void {
    model.traverse((child) => {
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
   * Get model from persistent cache
   */
  private async getFromPersistent(url: string): Promise<THREE.Object3D | null> {
    if (!this.persistentCache) return null;

    return new Promise((resolve) => {
      const transaction = this.persistentCache!.transaction(['models'], 'readonly');
      const store = transaction.objectStore('models');
      const request = store.get(url);

      request.onsuccess = () => {
        if (request.result) {
          // Deserialize model from stored data
          // This is a simplified version - in production, use proper serialization
          resolve(null);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => resolve(null);
    });
  }

  /**
   * Save model to persistent cache
   */
  private async saveToPersistent(url: string, model: THREE.Object3D): Promise<void> {
    if (!this.persistentCache) return;

    // Serialize model to store in IndexedDB
    // This is a simplified version - in production, use proper serialization
    const transaction = this.persistentCache.transaction(['models'], 'readwrite');
    const store = transaction.objectStore('models');
    
    store.put({
      url,
      timestamp: Date.now(),
      // Add serialized model data here
    });
  }

  /**
   * Start memory monitoring
   */
  private startMemoryMonitoring(): void {
    setInterval(() => {
      const stats = this.getStats();
      
      if (stats.memoryUsage > this.options.memoryThreshold) {
        // Auto-cleanup when memory threshold exceeded
        const targetSize = this.options.maxSize * 0.7; // Clean to 70%
        
        while (this.currentSize > targetSize && this.cache.size > 0) {
          this.evictLRU();
        }
      }
    }, 5000); // Check every 5 seconds
  }

  /**
   * Dispose cache and cleanup
   */
  dispose(): void {
    this.clear();
    
    if (this.persistentCache) {
      this.persistentCache.close();
    }
  }
}

/**
 * Singleton cache instance
 */
let cacheInstance: ModelCache | null = null;

export function getModelCache(options?: CacheOptions): ModelCache {
  if (!cacheInstance) {
    cacheInstance = new ModelCache(options);
  }
  return cacheInstance;
}

/**
 * Helper function to get cached model
 */
export async function getCachedModel(
  url: string,
  priority?: number
): Promise<THREE.Object3D> {
  const cache = getModelCache();
  return cache.get(url, priority);
}

/**
 * Helper function to preload models
 */
export async function preloadModels(
  urls: string[],
  priority?: number
): Promise<void> {
  const cache = getModelCache();
  return cache.preload(urls, priority);
}

/**
 * Helper function to clear cache
 */
export function clearModelCache(): void {
  const cache = getModelCache();
  cache.clear();
}

/**
 * Helper function to get cache stats
 */
export function getModelCacheStats(): CacheStats {
  const cache = getModelCache();
  return cache.getStats();
}
