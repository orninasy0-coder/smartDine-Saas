import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import {
  loadModelProgressive,
  type ProgressiveLoadOptions,
  type LoadProgress,
} from '../utils/progressiveLoader';

interface ProgressiveModelProps {
  /**
   * URL of the full quality model
   */
  modelUrl: string;
  /**
   * URL of the preview/low-res model
   */
  previewUrl?: string;
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
   * Progressive loading options
   */
  loadOptions?: ProgressiveLoadOptions;
  /**
   * Callback for loading progress
   */
  onProgress?: (progress: LoadProgress) => void;
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
 * ProgressiveModel - Component that loads 3D models progressively
 * Shows preview first, then streams full quality model
 */
export function ProgressiveModel({
  modelUrl,
  previewUrl,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  loadOptions = {},
  onProgress,
  onLoad,
  onError,
}: ProgressiveModelProps) {
  const [currentModel, setCurrentModel] = useState<THREE.Object3D | null>(null);
  const [loadingStage, setLoadingStage] = useState<LoadProgress['stage']>('preview');
  const groupRef = useRef<THREE.Group>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    let isCancelled = false;

    const loadModel = async () => {
      try {
        const model = await loadModelProgressive(
          modelUrl,
          {
            ...loadOptions,
            previewUrl,
            loadPreview: !!previewUrl,
          },
          (progress) => {
            if (isCancelled || !mountedRef.current) return;

            setLoadingStage(progress.stage);

            // Update model if preview is available
            if (progress.model && progress.stage === 'preview') {
              setCurrentModel(progress.model);
            }

            if (onProgress) {
              onProgress(progress);
            }
          }
        );

        if (!isCancelled && mountedRef.current) {
          setCurrentModel(model);
          setLoadingStage('complete');
          
          if (onLoad) {
            onLoad(model);
          }
        }
      } catch (error) {
        if (!isCancelled && mountedRef.current && onError) {
          onError(error as Error);
        }
      }
    };

    loadModel();

    return () => {
      isCancelled = true;
      mountedRef.current = false;
    };
  }, [modelUrl, previewUrl, loadOptions, onProgress, onLoad, onError]);

  if (!currentModel) {
    return null;
  }

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={currentModel} />
      {loadingStage !== 'complete' && (
        <mesh position={[0, 2, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#3b82f6" opacity={0.5} transparent />
        </mesh>
      )}
    </group>
  );
}
