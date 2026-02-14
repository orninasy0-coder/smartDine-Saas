import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

/**
 * Progressive loading utilities for 3D models
 * Implements streaming and chunked loading for better UX
 */

export interface ProgressiveLoadOptions {
  /**
   * Enable Draco compression support
   * @default true
   */
  useDraco?: boolean;
  /**
   * Path to Draco decoder
   * @default '/draco/'
   */
  dracoPath?: string;
  /**
   * Load low-res preview first
   * @default true
   */
  loadPreview?: boolean;
  /**
   * Preview model URL (lower quality)
   */
  previewUrl?: string;
  /**
   * Enable progressive streaming
   * @default true
   */
  enableStreaming?: boolean;
  /**
   * Chunk size for streaming (bytes)
   * @default 256 * 1024 (256KB)
   */
  chunkSize?: number;
  /**
   * Priority level (0-10, higher = more important)
   * @default 5
   */
  priority?: number;
}

export interface LoadProgress {
  /**
   * Loading stage
   */
  stage: 'preview' | 'streaming' | 'full' | 'complete';
  /**
   * Progress percentage (0-100)
   */
  progress: number;
  /**
   * Bytes loaded
   */
  loaded: number;
  /**
   * Total bytes
   */
  total: number;
  /**
   * Current model (preview or full)
   */
  model?: THREE.Object3D;
}

export type ProgressCallback = (progress: LoadProgress) => void;

/**
 * Progressive model loader with preview and streaming support
 */
export class ProgressiveModelLoader {
  private loader: GLTFLoader;
  private dracoLoader?: DRACOLoader;
  private loadingQueue: Map<string, Promise<THREE.Object3D>> = new Map();
  private priorityQueue: Array<{ url: string; priority: number }> = [];

  constructor() {
    this.loader = new GLTFLoader();
  }

  /**
   * Initialize Draco loader
   */
  private initDraco(dracoPath: string): void {
    if (!this.dracoLoader) {
      this.dracoLoader = new DRACOLoader();
      this.dracoLoader.setDecoderPath(dracoPath);
      this.loader.setDRACOLoader(this.dracoLoader);
    }
  }

  /**
   * Load model progressively with preview and streaming
   */
  async loadProgressive(
    url: string,
    options: ProgressiveLoadOptions = {},
    onProgress?: ProgressCallback
  ): Promise<THREE.Object3D> {
    const {
      useDraco = true,
      dracoPath = '/draco/',
      loadPreview = true,
      previewUrl,
      enableStreaming = true,
      priority = 5,
    } = options;

    // Initialize Draco if needed
    if (useDraco) {
      this.initDraco(dracoPath);
    }

    // Check if already loading
    if (this.loadingQueue.has(url)) {
      return this.loadingQueue.get(url)!;
    }

    // Add to priority queue
    this.priorityQueue.push({ url, priority });
    this.priorityQueue.sort((a, b) => b.priority - a.priority);

    const loadPromise = this.executeProgressiveLoad(
      url,
      previewUrl,
      loadPreview,
      enableStreaming,
      onProgress
    );

    this.loadingQueue.set(url, loadPromise);

    try {
      const model = await loadPromise;
      return model;
    } finally {
      this.loadingQueue.delete(url);
      this.priorityQueue = this.priorityQueue.filter((item) => item.url !== url);
    }
  }

  /**
   * Execute progressive loading with stages
   */
  private async executeProgressiveLoad(
    url: string,
    previewUrl: string | undefined,
    loadPreview: boolean,
    enableStreaming: boolean,
    onProgress?: ProgressCallback
  ): Promise<THREE.Object3D> {
    let previewModel: THREE.Object3D | undefined;

    // Stage 1: Load preview if available
    if (loadPreview && previewUrl) {
      try {
        previewModel = await this.loadPreviewModel(previewUrl, onProgress);
        
        if (onProgress) {
          onProgress({
            stage: 'preview',
            progress: 30,
            loaded: 0,
            total: 0,
            model: previewModel,
          });
        }
      } catch (error) {
        console.warn('Failed to load preview model:', error);
      }
    }

    // Stage 2: Load full model with streaming
    if (enableStreaming) {
      return this.loadWithStreaming(url, previewModel, onProgress);
    } else {
      return this.loadFullModel(url, onProgress);
    }
  }

  /**
   * Load preview model (low quality)
   */
  private async loadPreviewModel(
    url: string,
    onProgress?: ProgressCallback
  ): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          resolve(gltf.scene);
        },
        (progress) => {
          if (onProgress) {
            onProgress({
              stage: 'preview',
              progress: (progress.loaded / progress.total) * 30,
              loaded: progress.loaded,
              total: progress.total,
            });
          }
        },
        reject
      );
    });
  }

  /**
   * Load full model with streaming support
   */
  private async loadWithStreaming(
    url: string,
    previewModel: THREE.Object3D | undefined,
    onProgress?: ProgressCallback
  ): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          if (onProgress) {
            onProgress({
              stage: 'complete',
              progress: 100,
              loaded: 0,
              total: 0,
              model: gltf.scene,
            });
          }
          resolve(gltf.scene);
        },
        (progress) => {
          const progressPercent = previewModel
            ? 30 + (progress.loaded / progress.total) * 70
            : (progress.loaded / progress.total) * 100;

          if (onProgress) {
            onProgress({
              stage: 'streaming',
              progress: progressPercent,
              loaded: progress.loaded,
              total: progress.total,
              model: previewModel,
            });
          }
        },
        reject
      );
    });
  }

  /**
   * Load full model without streaming
   */
  private async loadFullModel(
    url: string,
    onProgress?: ProgressCallback
  ): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          if (onProgress) {
            onProgress({
              stage: 'complete',
              progress: 100,
              loaded: 0,
              total: 0,
              model: gltf.scene,
            });
          }
          resolve(gltf.scene);
        },
        (progress) => {
          if (onProgress) {
            onProgress({
              stage: 'full',
              progress: (progress.loaded / progress.total) * 100,
              loaded: progress.loaded,
              total: progress.total,
            });
          }
        },
        reject
      );
    });
  }

  /**
   * Preload model in background
   */
  async preload(url: string, options: ProgressiveLoadOptions = {}): Promise<void> {
    await this.loadProgressive(url, { ...options, priority: 0 });
  }

  /**
   * Cancel loading
   */
  cancel(url: string): void {
    this.loadingQueue.delete(url);
    this.priorityQueue = this.priorityQueue.filter((item) => item.url !== url);
  }

  /**
   * Get loading queue status
   */
  getQueueStatus(): Array<{ url: string; priority: number }> {
    return [...this.priorityQueue];
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    if (this.dracoLoader) {
      this.dracoLoader.dispose();
    }
    this.loadingQueue.clear();
    this.priorityQueue = [];
  }
}

/**
 * Singleton instance
 */
let progressiveLoaderInstance: ProgressiveModelLoader | null = null;

export function getProgressiveLoader(): ProgressiveModelLoader {
  if (!progressiveLoaderInstance) {
    progressiveLoaderInstance = new ProgressiveModelLoader();
  }
  return progressiveLoaderInstance;
}

/**
 * Helper function to load model progressively
 */
export async function loadModelProgressive(
  url: string,
  options?: ProgressiveLoadOptions,
  onProgress?: ProgressCallback
): Promise<THREE.Object3D> {
  const loader = getProgressiveLoader();
  return loader.loadProgressive(url, options, onProgress);
}
