import { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  AutoLODManager,
  type LODGenerationOptions,
  LODPresets,
} from '../utils/lodGenerator';

interface AutoLODModelProps {
  /**
   * Unique identifier for this model
   */
  id: string;
  /**
   * Base model to generate LOD levels from
   */
  model: THREE.Object3D;
  /**
   * LOD generation options
   */
  lodOptions?: LODGenerationOptions;
  /**
   * Use preset configuration
   */
  preset?: 'high' | 'balanced' | 'performance' | 'mobile';
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
   * Scale of the model
   * @default 1
   */
  scale?: number;
  /**
   * Callback when LOD level changes
   */
  onLODChange?: (level: number) => void;
  /**
   * Show debug info
   * @default false
   */
  showDebug?: boolean;
}

/**
 * AutoLODModel - Automatically manages LOD levels for a model
 * Generates multiple quality levels and switches based on camera distance
 */
export function AutoLODModel({
  id,
  model,
  lodOptions,
  preset = 'balanced',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onLODChange,
  showDebug = false,
}: AutoLODModelProps) {
  const { camera } = useThree();
  const [lodManager] = useState(() => new AutoLODManager(camera));
  const [lodObject, setLodObject] = useState<THREE.LOD | null>(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const groupRef = useRef<THREE.Group>(null);

  // Initialize LOD
  useEffect(() => {
    const options = lodOptions || LODPresets[preset];
    const lod = lodManager.register(id, model, options);
    setLodObject(lod);

    return () => {
      lodManager.unregister(id);
    };
  }, [id, model, lodOptions, preset, lodManager]);

  // Update LOD in animation loop
  useEffect(() => {
    if (!lodObject) return;

    let animationId: number;

    const animate = () => {
      lodManager.update();

      // Check if level changed
      const newLevel = lodManager.getCurrentLevel(id);
      if (newLevel !== currentLevel && newLevel >= 0) {
        setCurrentLevel(newLevel);
        if (onLODChange) {
          onLODChange(newLevel);
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [lodObject, lodManager, id, currentLevel, onLODChange]);

  if (!lodObject) {
    return null;
  }

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={lodObject} />
      {showDebug && (
        <DebugInfo level={currentLevel} lodObject={lodObject} />
      )}
    </group>
  );
}

/**
 * Debug info component
 */
function DebugInfo({
  level,
  lodObject,
}: {
  level: number;
  lodObject: THREE.LOD;
}) {
  const stats = lodObject.levels[level];
  
  if (!stats) return null;

  return (
    <mesh position={[0, 2, 0]}>
      <planeGeometry args={[1, 0.5]} />
      <meshBasicMaterial color="#000000" opacity={0.7} transparent />
    </mesh>
  );
}

/**
 * Hook to use LOD manager
 */
export function useAutoLOD(camera: THREE.Camera) {
  const [manager] = useState(() => new AutoLODManager(camera));

  useEffect(() => {
    return () => {
      manager.dispose();
    };
  }, [manager]);

  return manager;
}
