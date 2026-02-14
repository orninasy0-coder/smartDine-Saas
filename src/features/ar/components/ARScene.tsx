import { ARControls } from './ARControls';

interface ARSceneProps {
  children?: React.ReactNode;
  /**
   * Ambient light intensity (overall scene illumination)
   * @default 0.5
   */
  ambientIntensity?: number;
  /**
   * Main directional light intensity (simulates sunlight)
   * @default 1
   */
  mainLightIntensity?: number;
  /**
   * Fill light intensity (reduces harsh shadows)
   * @default 0.3
   */
  fillLightIntensity?: number;
  /**
   * Point light intensity (adds highlights from above)
   * @default 0.5
   */
  pointLightIntensity?: number;
  /**
   * Enable shadows for realistic lighting
   * @default true
   */
  enableShadows?: boolean;
  /**
   * Shadow map size (higher = better quality but slower)
   * @default 1024
   */
  shadowMapSize?: number;
  /**
   * Enable auto-rotation of the model
   * @default false
   */
  autoRotate?: boolean;
  /**
   * Auto-rotation speed
   * @default 2
   */
  autoRotateSpeed?: number;
}

/**
 * ARScene - Enhanced lighting and camera controls for 3D scene
 * Provides professional three-point lighting setup and interactive camera controls
 */
export function ARScene({
  children,
  ambientIntensity = 0.5,
  mainLightIntensity = 1,
  fillLightIntensity = 0.3,
  pointLightIntensity = 0.5,
  enableShadows = true,
  shadowMapSize = 1024,
  autoRotate = false,
  autoRotateSpeed = 2,
}: ARSceneProps) {
  return (
    <>
      {/* Ambient light for overall scene illumination */}
      <ambientLight intensity={ambientIntensity} />

      {/* Main directional light (key light - simulates sunlight) */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={mainLightIntensity}
        castShadow={enableShadows}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-bias={-0.0001}
      />

      {/* Fill light from opposite side to reduce harsh shadows */}
      <directionalLight
        position={[-5, 3, -5]}
        intensity={fillLightIntensity}
        castShadow={false}
      />

      {/* Back light for rim lighting effect */}
      <directionalLight
        position={[0, 3, -5]}
        intensity={0.2}
        castShadow={false}
      />

      {/* Point light from above for highlights (rim light) */}
      <pointLight
        position={[0, 5, 0]}
        intensity={pointLightIntensity}
        castShadow={enableShadows}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
      />

      {/* Hemisphere light for natural sky/ground color gradient */}
      <hemisphereLight
        args={['#ffffff', '#444444', 0.3]}
        position={[0, 50, 0]}
      />

      {/* Enhanced camera controls */}
      <ARControls
        autoRotate={autoRotate}
        autoRotateSpeed={autoRotateSpeed}
      />

      {children}
    </>
  );
}
