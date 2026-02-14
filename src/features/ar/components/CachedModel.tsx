import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { getCachedModel } from '../utils/modelCache';

interface CachedModelProps {
  /**
   * URL of the model
   */
  modelUrl: string;
  /**
   * Cache priority (0-10, higher = more important)
   * @default 5
   */
  priority?: number;
  /**
   * Scale of the model
   * @default 1
   */
  scale?: number;
  /**
   * Position of the model [x, y, z]
   * @default [0, 0, 0]
   */
  position?: [number, number, number];
  /**
   * Rotation of the model [x, y, z] in radians
   * @default [0, 0, 0]
   */
  rotation?: [number, number, number];
  /**
   * Enable shadows
   * @default true
   */
  castShadow?: boolean;
  /**
   * Receive shadows
   * @default true
   */
  receiveShadow?: boolean;
  /**
   * Callback when model is loaded
   */
  onLoad?: (model: THREE.Object3D) => void;
  /**
   * Callback when loading fails
   */
  onError?: (error: Error) => void;
}

/**
 * CachedModel - Component that loads models with caching
 * Uses LRU cache to improve performance and reduce network requests
 */
export function CachedModel({
  modelUrl,
  priority = 5,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  castShadow = true,
  receiveShadow = true,
  onLoad,
  onError,
}: CachedModelProps) {
  const [model, setModel] = useState<THREE.Object3D | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadModel = async () => {
      try {
        setLoading(true);
        setError(null);

        const loadedModel = await getCachedModel(modelUrl, priority);

        if (!isMounted) return;

        // Configure shadows
        loadedModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = castShadow;
            child.receiveShadow = receiveShadow;
          }
        });

        setModel(loadedModel);
        setLoading(false);

        if (onLoad) {
          onLoad(loadedModel);
        }
      } catch (err) {
        if (!isMounted) return;

        const error = err as Error;
        setError(error);
        setLoading(false);

        if (onError) {
          onError(error);
        }
      }
    };

    loadModel();

    return () => {
      isMounted = false;
    };
  }, [modelUrl, priority, castShadow, receiveShadow, onLoad, onError]);

  if (loading || error || !model) {
    return null;
  }

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={model} />
    </group>
  );
}
