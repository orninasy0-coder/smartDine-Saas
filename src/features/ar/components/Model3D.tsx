import { useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Model3DProps {
  /**
   * URL of the 3D model (GLB/glTF format)
   */
  modelUrl: string;
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
   * Enable shadows for the model
   * @default true
   */
  castShadow?: boolean;
  /**
   * Enable receiving shadows
   * @default true
   */
  receiveShadow?: boolean;
  /**
   * Callback when model is loaded
   */
  onLoad?: () => void;
  /**
   * Callback when model loading fails
   */
  onError?: (error: Error) => void;
}

/**
 * Model3D - Component for loading and displaying 3D models (GLB/glTF)
 * Uses @react-three/drei's useGLTF hook for efficient model loading
 */
export function Model3D({
  modelUrl,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  castShadow = true,
  receiveShadow = true,
  onLoad,
  onError,
}: Model3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load the GLTF model using drei's useGLTF hook
  // This hook handles caching and suspense automatically
  const { scene } = useGLTF(modelUrl);

  useEffect(() => {
    if (scene) {
      // Configure shadows for all meshes in the model
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = castShadow;
          child.receiveShadow = receiveShadow;

          // Ensure materials are properly configured
          if (child.material) {
            // Enable side rendering for better visibility
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => {
                mat.side = THREE.FrontSide;
              });
            } else {
              child.material.side = THREE.FrontSide;
            }
          }
        }
      });

      // Call onLoad callback if provided
      if (onLoad) {
        onLoad();
      }
    }
  }, [scene, castShadow, receiveShadow, onLoad]);

  // Handle errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (onError && event.message.includes(modelUrl)) {
        onError(new Error(`Failed to load model: ${modelUrl}`));
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [modelUrl, onError]);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

// Preload function to load models before they're needed
export function preloadModel(modelUrl: string) {
  useGLTF.preload(modelUrl);
}

// Clear cache for a specific model
export function clearModelCache(modelUrl: string) {
  useGLTF.clear(modelUrl);
}

// Clear all cached models
export function clearAllModelCache() {
  useGLTF.clear();
}
