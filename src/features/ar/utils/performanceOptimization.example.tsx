import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { ModelLoader } from '../components/ModelLoader';
import { ARScene } from '../components/ARScene';
import {
  PerformanceMonitor,
  AdaptiveQualityManager,
  detectDeviceCapabilities,
  getRecommendedSettings,
  formatMetrics,
  optimizeSceneTextures,
  TexturePresets,
  type PerformanceMetrics,
} from './index';

/**
 * Example: Performance monitoring component
 */
function PerformanceDisplay() {
  const { gl, scene } = useThree();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [monitor] = useState(() => new PerformanceMonitor(gl));

  useEffect(() => {
    const interval = setInterval(() => {
      monitor.update();
      setMetrics(monitor.getMetrics());
    }, 100);

    return () => clearInterval(interval);
  }, [monitor]);

  if (!metrics) return null;

  return (
    <div className="absolute top-4 right-4 bg-black/80 text-white p-4 rounded font-mono text-sm">
      <h3 className="font-bold mb-2">Performance</h3>
      <div className="space-y-1">
        <div>FPS: {metrics.fps}</div>
        <div>Frame: {metrics.frameTime.toFixed(2)}ms</div>
        <div>Draw Calls: {metrics.drawCalls}</div>
        <div>Triangles: {metrics.triangles.toLocaleString()}</div>
        <div>Geometries: {metrics.memory.geometries}</div>
        <div>Textures: {metrics.memory.textures}</div>
      </div>
      <div
        className={`mt-2 px-2 py-1 rounded text-center ${
          metrics.fps >= 55
            ? 'bg-green-600'
            : metrics.fps >= 40
              ? 'bg-yellow-600'
              : 'bg-red-600'
        }`}
      >
        {metrics.fps >= 55
          ? 'Excellent'
          : metrics.fps >= 40
            ? 'Good'
            : metrics.fps >= 25
              ? 'Fair'
              : 'Poor'}
      </div>
    </div>
  );
}

/**
 * Example: Basic performance monitoring
 */
export function BasicPerformanceExample() {
  return (
    <div className="relative h-screen w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ARScene>
          <ModelLoader modelUrl="/models/dish.glb" />
        </ARScene>
        <PerformanceDisplay />
      </Canvas>
    </div>
  );
}

/**
 * Example: Adaptive quality management
 */
function AdaptiveQualityScene() {
  const { gl, scene } = useThree();
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');
  const [monitor] = useState(() => new PerformanceMonitor(gl));
  const [qualityManager] = useState(
    () => new AdaptiveQualityManager(monitor, 30)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      monitor.update();
      const newQuality = qualityManager.update();
      if (newQuality) {
        setQuality(newQuality);
        console.log(`Quality adjusted to: ${newQuality}`);

        // Apply quality settings
        const preset =
          newQuality === 'high'
            ? TexturePresets.high
            : newQuality === 'medium'
              ? TexturePresets.medium
              : TexturePresets.low;

        optimizeSceneTextures(scene, preset);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [monitor, qualityManager, scene]);

  return (
    <>
      <ARScene
        shadowMapSize={quality === 'high' ? 2048 : quality === 'medium' ? 1024 : 512}
        enableShadows={quality !== 'low'}
      >
        <ModelLoader modelUrl="/models/dish.glb" />
      </ARScene>

      <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded">
        <h3 className="font-bold mb-2">Adaptive Quality</h3>
        <div className="flex items-center gap-2">
          <span>Current:</span>
          <span
            className={`px-2 py-1 rounded ${
              quality === 'high'
                ? 'bg-green-600'
                : quality === 'medium'
                  ? 'bg-yellow-600'
                  : 'bg-red-600'
            }`}
          >
            {quality.toUpperCase()}
          </span>
        </div>
        <p className="text-xs text-gray-300 mt-2">
          Quality adjusts automatically based on performance
        </p>
      </div>
    </>
  );
}

export function AdaptiveQualityExample() {
  return (
    <div className="relative h-screen w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <AdaptiveQualityScene />
      </Canvas>
    </div>
  );
}

/**
 * Example: Device capability detection
 */
function DeviceCapabilitiesDisplay() {
  const { gl } = useThree();
  const [capabilities, setCapabilities] = useState(() =>
    detectDeviceCapabilities(gl)
  );
  const [settings, setSettings] = useState(() =>
    getRecommendedSettings(capabilities)
  );

  return (
    <div className="absolute top-4 left-4 bg-black/80 text-white p-4 rounded max-w-sm">
      <h3 className="font-bold mb-2">Device Capabilities</h3>
      <div className="space-y-1 text-sm">
        <div>GPU Tier: {capabilities.gpuTier.toUpperCase()}</div>
        <div>Mobile: {capabilities.isMobile ? 'Yes' : 'No'}</div>
        <div>Low-End: {capabilities.isLowEnd ? 'Yes' : 'No'}</div>
        <div>Max Texture: {capabilities.maxTextureSize}px</div>
        <div>Max Anisotropy: {capabilities.maxAnisotropy}x</div>
        <div>WebGL2: {capabilities.supportsWebGL2 ? 'Yes' : 'No'}</div>
      </div>

      <h3 className="font-bold mt-4 mb-2">Recommended Settings</h3>
      <div className="space-y-1 text-sm">
        <div>Shadow Map: {settings.shadowMapSize}px</div>
        <div>Max Texture: {settings.maxTextureSize}px</div>
        <div>Anisotropy: {settings.anisotropy}x</div>
        <div>Antialias: {settings.antialias ? 'On' : 'Off'}</div>
        <div>Shadows: {settings.enableShadows ? 'On' : 'Off'}</div>
        <div>LOD Levels: {settings.lodLevels}</div>
      </div>
    </div>
  );
}

export function DeviceCapabilitiesExample() {
  return (
    <div className="relative h-screen w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ARScene>
          <ModelLoader modelUrl="/models/dish.glb" />
        </ARScene>
        <DeviceCapabilitiesDisplay />
      </Canvas>
    </div>
  );
}

/**
 * Example: Texture optimization
 */
function TextureOptimizationScene() {
  const { scene } = useThree();
  const [optimized, setOptimized] = useState(false);
  const [quality, setQuality] = useState<'high' | 'medium' | 'low'>('high');

  const handleOptimize = (newQuality: 'high' | 'medium' | 'low') => {
    setQuality(newQuality);
    const preset = TexturePresets[newQuality];
    optimizeSceneTextures(scene, preset);
    setOptimized(true);
    console.log(`Textures optimized with ${newQuality} preset`);
  };

  return (
    <>
      <ARScene>
        <ModelLoader modelUrl="/models/dish.glb" />
      </ARScene>

      <div className="absolute bottom-4 left-4 bg-black/80 text-white p-4 rounded">
        <h3 className="font-bold mb-2">Texture Optimization</h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleOptimize('high')}
            className={`px-3 py-1 rounded ${
              quality === 'high' ? 'bg-green-600' : 'bg-gray-600'
            }`}
          >
            High
          </button>
          <button
            onClick={() => handleOptimize('medium')}
            className={`px-3 py-1 rounded ${
              quality === 'medium' ? 'bg-yellow-600' : 'bg-gray-600'
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => handleOptimize('low')}
            className={`px-3 py-1 rounded ${
              quality === 'low' ? 'bg-red-600' : 'bg-gray-600'
            }`}
          >
            Low
          </button>
        </div>
        {optimized && (
          <p className="text-xs text-green-400 mt-2">
            ✓ Textures optimized with {quality} preset
          </p>
        )}
      </div>
    </>
  );
}

export function TextureOptimizationExample() {
  return (
    <div className="relative h-screen w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <TextureOptimizationScene />
      </Canvas>
    </div>
  );
}
