import { useRef, useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Model3D } from './Model3D';

export interface LODLevel {
  /**
   * URL of the model for this LOD level
   */
  modelUrl: string;
  /**
   * Distance at which this LOD level becomes active
   */
  distance: number;
  /**
   * Optional scale for this LOD level
   */
  scale?: number;
}

interface ModelLODProps {
  /**
   * Array of LOD levels, ordered from highest to lowest detail
   * First level (index 0) is the highest detail, shown when closest
   */
  levels: LODLevel[];
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
   * Callback when LOD level changes
   */
  onLODChange?: (level: number) => void;
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
 * ModelLOD - Component that automatically switches between different model quality levels
 * based on camera distance for optimal performance
 */
export function ModelLOD({
  levels,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  castShadow = true,
  receiveShadow = true,
  onLODChange,
  onLoad,
  onError,
}: ModelLODProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [currentLevel, setCurrentLevel] = useState(0);

  // Validate levels
  useEffect(() => {
    if (levels.length === 0) {
      console.error('ModelLOD: At least one LOD level is required');
      return;
    }

    // Ensure levels are sorted by distance (ascending)
    const sorted = [...levels].sort((a, b) => a.distance - b.distance);
    if (JSON.stringify(sorted) !== JSON.stringify(levels)) {
      console.warn(
        'ModelLOD: LOD levels should be sorted by distance (ascending)'
      );
    }
  }, [levels]);

  // Update LOD based on camera distance
  useEffect(() => {
    if (!groupRef.current) return;

    const updateLOD = () => {
      if (!groupRef.current) return;

      // Calculate distance from camera to model
      const modelPosition = new THREE.Vector3();
      groupRef.current.getWorldPosition(modelPosition);
      const distance = camera.position.distanceTo(modelPosition);

      // Find appropriate LOD level
      let newLevel = levels.length - 1; // Default to lowest detail

      for (let i = 0; i < levels.length; i++) {
        if (distance <= levels[i].distance) {
          newLevel = i;
          break;
        }
      }

      // Update if level changed
      if (newLevel !== currentLevel) {
        setCurrentLevel(newLevel);
        if (onLODChange) {
          onLODChange(newLevel);
        }
      }
    };

    // Update on every frame
    const interval = setInterval(updateLOD, 100); // Check every 100ms

    return () => clearInterval(interval);
  }, [camera, levels, currentLevel, onLODChange]);

  const currentLOD = levels[currentLevel];

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <Model3D
        modelUrl={currentLOD.modelUrl}
        scale={currentLOD.scale || 1}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
        onLoad={onLoad}
        onError={onError}
      />
    </group>
  );
}

/**
 * Hook to create LOD levels from a base model URL
 */
export function useLODLevels(
  baseUrl: string,
  options?: {
    /**
     * Number of LOD levels to generate
     * @default 3
     */
    levels?: number;
    /**
     * Distance multiplier for each level
     * @default 2
     */
    distanceMultiplier?: number;
    /**
     * Base distance for first LOD level
     * @default 5
     */
    baseDistance?: number;
  }
): LODLevel[] {
  const { levels = 3, distanceMultiplier = 2, baseDistance = 5 } = options || {};

  return Array.from({ length: levels }, (_, i) => ({
    modelUrl: baseUrl.replace(/\.(glb|gltf)$/, `_lod${i}.$1`),
    distance: baseDistance * Math.pow(distanceMultiplier, i),
    scale: 1,
  }));
}

/**
 * Preset LOD configurations
 */
export const LODPresets = {
  /**
   * High quality - 3 levels with close transitions
   */
  high: {
    levels: 3,
    distanceMultiplier: 1.5,
    baseDistance: 3,
  },

  /**
   * Medium quality - 3 levels with balanced transitions
   */
  medium: {
    levels: 3,
    distanceMultiplier: 2,
    baseDistance: 5,
  },

  /**
   * Low quality - 2 levels with aggressive transitions
   */
  low: {
    levels: 2,
    distanceMultiplier: 3,
    baseDistance: 8,
  },

  /**
   * Mobile - 2 levels optimized for mobile devices
   */
  mobile: {
    levels: 2,
    distanceMultiplier: 2.5,
    baseDistance: 4,
  },
};
