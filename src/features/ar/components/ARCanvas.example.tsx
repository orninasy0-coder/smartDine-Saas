/**
 * ARCanvas Component Examples
 * 
 * Demonstrates the enhanced ThreeJS Canvas Component with:
 * - Scene setup with background and fog
 * - Professional lighting configuration
 * - Enhanced camera controls
 */

import { ARCanvas, ARScene, ARLoading, ARControls } from './index';
import { Suspense } from 'react';
import { Box } from '@react-three/drei';

/**
 * Example 1: Basic AR Canvas with default settings
 */
export function BasicARCanvasExample() {
  return (
    <div className="w-full h-[500px] border rounded-lg overflow-hidden">
      <ARCanvas>
        <ARScene>
          <Suspense fallback={<ARLoading />}>
            <Box args={[1, 1, 1]} castShadow receiveShadow>
              <meshStandardMaterial color="orange" />
            </Box>
          </Suspense>
        </ARScene>
      </ARCanvas>
    </div>
  );
}

/**
 * Example 2: Custom background and fog
 */
export function CustomBackgroundExample() {
  return (
    <div className="w-full h-[500px] border rounded-lg overflow-hidden">
      <ARCanvas
        backgroundColor="#1a1a2e"
        enableFog={true}
        fogColor="#1a1a2e"
        fogDensity={0.08}
      >
        <ARScene>
          <Suspense fallback={<ARLoading />}>
            <Box args={[1, 1, 1]} castShadow receiveShadow>
              <meshStandardMaterial color="#16213e" metalness={0.8} roughness={0.2} />
            </Box>
          </Suspense>
        </ARScene>
      </ARCanvas>
    </div>
  );
}

/**
 * Example 3: Custom lighting configuration
 */
export function CustomLightingExample() {
  return (
    <div className="w-full h-[500px] border rounded-lg overflow-hidden">
      <ARCanvas>
        <ARScene
          ambientIntensity={0.3}
          mainLightIntensity={1.5}
          fillLightIntensity={0.5}
          pointLightIntensity={0.8}
          enableShadows={true}
          shadowMapSize={2048}
        >
          <Suspense fallback={<ARLoading />}>
            <Box args={[1, 1, 1]} castShadow receiveShadow>
              <meshStandardMaterial color="hotpink" />
            </Box>
          </Suspense>
        </ARScene>
      </ARCanvas>
    </div>
  );
}

/**
 * Example 4: Auto-rotating model
 */
export function AutoRotateExample() {
  return (
    <div className="w-full h-[500px] border rounded-lg overflow-hidden">
      <ARCanvas>
        <ARScene autoRotate={true} autoRotateSpeed={3}>
          <Suspense fallback={<ARLoading />}>
            <Box args={[1, 1, 1]} castShadow receiveShadow>
              <meshStandardMaterial color="cyan" />
            </Box>
          </Suspense>
        </ARScene>
      </ARCanvas>
    </div>
  );
}

/**
 * Example 5: Custom camera controls
 */
export function CustomControlsExample() {
  return (
    <div className="w-full h-[500px] border rounded-lg overflow-hidden">
      <ARCanvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        
        <ARControls
          minDistance={3}
          maxDistance={15}
          enablePan={false}
          rotateSpeed={0.3}
          zoomSpeed={0.5}
          autoRotate={true}
          autoRotateSpeed={1}
        />
        
        <Suspense fallback={<ARLoading />}>
          <Box args={[1, 1, 1]}>
            <meshStandardMaterial color="lime" />
          </Box>
        </Suspense>
      </ARCanvas>
    </div>
  );
}

/**
 * Example 6: Multiple objects with ground plane
 */
export function MultipleObjectsExample() {
  return (
    <div className="w-full h-[500px] border rounded-lg overflow-hidden">
      <ARCanvas backgroundColor="#e0e0e0">
        <ARScene>
          <Suspense fallback={<ARLoading />}>
            {/* Ground plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
              <planeGeometry args={[10, 10]} />
              <meshStandardMaterial color="#cccccc" />
            </mesh>
            
            {/* Objects */}
            <Box args={[1, 1, 1]} position={[-1.5, 0, 0]} castShadow>
              <meshStandardMaterial color="red" />
            </Box>
            
            <Box args={[1, 1, 1]} position={[0, 0, 0]} castShadow>
              <meshStandardMaterial color="green" />
            </Box>
            
            <Box args={[1, 1, 1]} position={[1.5, 0, 0]} castShadow>
              <meshStandardMaterial color="blue" />
            </Box>
          </Suspense>
        </ARScene>
      </ARCanvas>
    </div>
  );
}

/**
 * Example 7: Dish model viewer simulation
 */
export function DishViewerExample() {
  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="p-4 bg-white border-b">
        <h3 className="text-lg font-semibold">Grilled Salmon - 3D View</h3>
        <p className="text-sm text-gray-600">Rotate, zoom, and pan to explore</p>
      </div>
      
      <div className="h-[calc(100%-80px)]">
        <ARCanvas
          backgroundColor="#f8f8f8"
          enableFog={true}
          fogColor="#f8f8f8"
          fogDensity={0.03}
        >
          <ARScene
            ambientIntensity={0.6}
            mainLightIntensity={1.2}
            autoRotate={false}
          >
            <Suspense fallback={<ARLoading />}>
              {/* Simulated dish (using a box as placeholder) */}
              <Box args={[2, 0.5, 1.5]} castShadow receiveShadow>
                <meshStandardMaterial 
                  color="#ff6b6b" 
                  metalness={0.3} 
                  roughness={0.7}
                />
              </Box>
              
              {/* Ground shadow catcher */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
                <planeGeometry args={[10, 10]} />
                <shadowMaterial opacity={0.3} />
              </mesh>
            </Suspense>
          </ARScene>
        </ARCanvas>
      </div>
    </div>
  );
}

/**
 * Demo component showing all examples
 */
export function ARCanvasExamplesDemo() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">AR Canvas Examples</h2>
        <p className="text-gray-600 mb-8">
          Enhanced ThreeJS Canvas Component with scene setup, lighting, and camera controls
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">1. Basic AR Canvas</h3>
          <p className="text-sm text-gray-600 mb-4">Default settings with standard lighting</p>
          <BasicARCanvasExample />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">2. Custom Background & Fog</h3>
          <p className="text-sm text-gray-600 mb-4">Dark theme with atmospheric fog</p>
          <CustomBackgroundExample />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">3. Custom Lighting</h3>
          <p className="text-sm text-gray-600 mb-4">Adjusted light intensities and high-quality shadows</p>
          <CustomLightingExample />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">4. Auto-Rotate</h3>
          <p className="text-sm text-gray-600 mb-4">Automatic rotation for product showcase</p>
          <AutoRotateExample />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">5. Custom Controls</h3>
          <p className="text-sm text-gray-600 mb-4">Fine-tuned camera control settings</p>
          <CustomControlsExample />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">6. Multiple Objects</h3>
          <p className="text-sm text-gray-600 mb-4">Scene with ground plane and multiple objects</p>
          <MultipleObjectsExample />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">7. Dish Viewer Simulation</h3>
          <p className="text-sm text-gray-600 mb-4">Complete dish viewer with UI</p>
          <DishViewerExample />
        </div>
      </div>
    </div>
  );
}
