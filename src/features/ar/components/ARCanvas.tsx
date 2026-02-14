import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';

interface ARCanvasProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Background color for the scene
   * @default "#f0f0f0" (light gray)
   */
  backgroundColor?: string;
  /**
   * Enable fog effect for depth perception
   * @default true
   */
  enableFog?: boolean;
  /**
   * Fog color (should match or complement background)
   * @default "#f0f0f0"
   */
  fogColor?: string;
  /**
   * Fog density - higher values create thicker fog
   * @default 0.05
   */
  fogDensity?: number;
}

/**
 * ARCanvas - Enhanced Three.js canvas wrapper for AR visualization
 * Provides a fully configured Canvas component with scene setup, background, and fog
 */
export function ARCanvas({
  children,
  className = '',
  backgroundColor = '#f0f0f0',
  enableFog = true,
  fogColor = '#f0f0f0',
  fogDensity = 0.05,
}: ARCanvasProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        dpr={[1, 2]} // Device pixel ratio for better quality on high-DPI screens
        shadows // Enable shadow rendering
        onCreated={({ scene, gl }) => {
          // Configure scene background
          scene.background = new THREE.Color(backgroundColor);

          // Add fog for depth perception
          if (enableFog) {
            scene.fog = new THREE.FogExp2(fogColor, fogDensity);
          }

          // Enable shadow map
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
