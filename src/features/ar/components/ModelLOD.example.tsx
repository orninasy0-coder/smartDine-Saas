import { Canvas } from '@react-three/fiber';
import { ModelLOD, LODPresets, useLODLevels } from './ModelLOD';
import { ARScene } from './ARScene';
import { ARControlsUI } from './ARControlsUI';
import { useState } from 'react';

/**
 * Example: Basic LOD usage with predefined levels
 */
export function BasicLODExample() {
  const [currentLevel, setCurrentLevel] = useState(0);

  const lodLevels = [
    { modelUrl: '/models/dish_high.glb', distance: 5 },
    { modelUrl: '/models/dish_medium.glb', distance: 10 },
    { modelUrl: '/models/dish_low.glb', distance: 20 },
  ];

  return (
    <div className="relative h-screen w-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ARScene>
          <ModelLOD
            levels={lodLevels}
            onLODChange={(level) => {
              console.log(`LOD level changed to: ${level}`);
              setCurrentLevel(level);
            }}
          />
        </ARScene>
      </Canvas>

      <div className="absolute top-4 left-4 bg-black/50 text-white p-4 rounded">
        <p>Current LOD Level: {currentLevel}</p>
        <p className="text-sm text-gray-300">
          Move camera closer/farther to see LOD changes
        </p>
      </div>

      <ARControlsUI />
    </div>
  );
}

/**
 * Example: Using LOD presets
 */
export function LODPresetExample() {
  const baseUrl = '/models/dish.glb';
  const lodLevels = useLODLevels(baseUrl, LODPresets.medium);

  return (
    <div className="relative h-screen w-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ARScene>
          <ModelLOD levels={lodLevels} />
        </ARScene>
      </Canvas>

      <ARControlsUI />
    </div>
  );
}

/**
 * Example: Mobile-optimized LOD
 */
export function MobileLODExample() {
  const baseUrl = '/models/dish.glb';
  const lodLevels = useLODLevels(baseUrl, LODPresets.mobile);

  return (
    <div className="relative h-screen w-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ARScene
          ambientIntensity={0.6}
          mainLightIntensity={0.8}
          enableShadows={false} // Disable shadows on mobile
        >
          <ModelLOD levels={lodLevels} />
        </ARScene>
      </Canvas>

      <ARControlsUI />
    </div>
  );
}

/**
 * Example: Multiple models with LOD
 */
export function MultipleLODExample() {
  const dish1Levels = [
    { modelUrl: '/models/dish1_high.glb', distance: 5 },
    { modelUrl: '/models/dish1_low.glb', distance: 15 },
  ];

  const dish2Levels = [
    { modelUrl: '/models/dish2_high.glb', distance: 5 },
    { modelUrl: '/models/dish2_low.glb', distance: 15 },
  ];

  return (
    <div className="relative h-screen w-full">
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
        <ARScene>
          <ModelLOD levels={dish1Levels} position={[-3, 0, 0]} />
          <ModelLOD levels={dish2Levels} position={[3, 0, 0]} />
        </ARScene>
      </Canvas>

      <ARControlsUI />
    </div>
  );
}

/**
 * Example: Custom LOD configuration
 */
export function CustomLODExample() {
  const lodLevels = [
    {
      modelUrl: '/models/dish_ultra.glb',
      distance: 3,
      scale: 1,
    },
    {
      modelUrl: '/models/dish_high.glb',
      distance: 8,
      scale: 1,
    },
    {
      modelUrl: '/models/dish_medium.glb',
      distance: 15,
      scale: 0.95,
    },
    {
      modelUrl: '/models/dish_low.glb',
      distance: 30,
      scale: 0.9,
    },
  ];

  return (
    <div className="relative h-screen w-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ARScene>
          <ModelLOD
            levels={lodLevels}
            onLODChange={(level) => {
              console.log(`Switched to LOD level ${level}`);
            }}
          />
        </ARScene>
      </Canvas>

      <ARControlsUI />
    </div>
  );
}
