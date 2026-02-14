/**
 * ARControlsUI Component Examples
 * 
 * Demonstrates the UI controls for AR viewer with:
 * - Zoom in/out buttons
 * - Reset view button
 * - Different positioning options
 * - Custom styling
 */

import { ARCanvas, ARScene, ARLoading, ARControls, ARControlsUI } from './index';
import type { ARControlsRef } from './ARControls';
import { Suspense, useRef } from 'react';
import { Box } from '@react-three/drei';

/**
 * Example 1: Basic AR viewer with controls UI
 */
export function BasicARControlsUIExample() {
  const controlsRef = useRef<ARControlsRef>(null);

  return (
    <div className="relative w-full h-[500px] border rounded-lg overflow-hidden">
      <ARCanvas>
        <ARScene>
          <ARControls ref={controlsRef} />
          <Suspense fallback={<ARLoading />}>
            <Box args={[1, 1, 1]} castShadow receiveShadow>
              <meshStandardMaterial color="orange" />
            </Box>
          </Suspense>
        </ARScene>
      </ARCanvas>
      
      <ARControlsUI controlsRef={controlsRef} />
    </div>
  );
}

/**
 * Example 2: Controls in different positions
 */
export function PositionedControlsExample() {
  const controlsRef = useRef<ARControlsRef>(null);

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Top Left */}
      <div className="relative w-full h-[300px] border rounded-lg overflow-hidden">
        <ARCanvas>
          <ARScene>
            <ARControls ref={controlsRef} />
            <Suspense fallback={<ARLoading />}>
              <Box args={[1, 1, 1]}>
                <meshStandardMaterial color="red" />
              </Box>
            </Suspense>
          </ARScene>
        </ARCanvas>
        <ARControlsUI controlsRef={controlsRef} position="top-left" />
        <div className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
          Top Left
        </div>
      </div>

      {/* Top Right */}
      <div className="relative w-full h-[300px] border rounded-lg overflow-hidden">
        <ARCanvas>
          <ARScene>
            <ARControls ref={controlsRef} />
            <Suspense fallback={<ARLoading />}>
              <Box args={[1, 1, 1]}>
                <meshStandardMaterial color="green" />
              </Box>
            </Suspense>
          </ARScene>
        </ARCanvas>
        <ARControlsUI controlsRef={controlsRef} position="top-right" />
        <div className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
          Top Right
        </div>
      </div>

      {/* Bottom Left */}
      <div className="relative w-full h-[300px] border rounded-lg overflow-hidden">
        <ARCanvas>
          <ARScene>
            <ARControls ref={controlsRef} />
            <Suspense fallback={<ARLoading />}>
              <Box args={[1, 1, 1]}>
                <meshStandardMaterial color="blue" />
              </Box>
            </Suspense>
          </ARScene>
        </ARCanvas>
        <ARControlsUI controlsRef={controlsRef} position="bottom-left" />
        <div className="absolute top-2 right-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
          Bottom Left
        </div>
      </div>

      {/* Bottom Right */}
      <div className="relative w-full h-[300px] border rounded-lg overflow-hidden">
        <ARCanvas>
          <ARScene>
            <ARControls ref={controlsRef} />
            <Suspense fallback={<ARLoading />}>
              <Box args={[1, 1, 1]}>
                <meshStandardMaterial color="purple" />
              </Box>
            </Suspense>
          </ARScene>
        </ARCanvas>
        <ARControlsUI controlsRef={controlsRef} position="bottom-right" />
        <div className="absolute top-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
          Bottom Right
        </div>
      </div>
    </div>
  );
}

/**
 * Example 3: Only zoom controls (no reset button)
 */
export function ZoomOnlyExample() {
  const controlsRef = useRef<ARControlsRef>(null);

  return (
    <div className="relative w-full h-[500px] border rounded-lg overflow-hidden">
      <ARCanvas>
        <ARScene>
          <ARControls ref={controlsRef} />
          <Suspense fallback={<ARLoading />}>
            <Box args={[1, 1, 1]} castShadow receiveShadow>
              <meshStandardMaterial color="cyan" />
            </Box>
          </Suspense>
        </ARScene>
      </ARCanvas>
      
      <ARControlsUI 
        controlsRef={controlsRef} 
        showResetButton={false}
      />
    </div>
  );
}

/**
 * Example 4: Only reset button (no zoom controls)
 */
export function ResetOnlyExample() {
  const controlsRef = useRef<ARControlsRef>(null);

  return (
    <div className="relative w-full h-[500px] border rounded-lg overflow-hidden">
      <ARCanvas>
        <ARScene>
          <ARControls ref={controlsRef} />
          <Suspense fallback={<ARLoading />}>
            <Box args={[1, 1, 1]} castShadow receiveShadow>
              <meshStandardMaterial color="hotpink" />
            </Box>
          </Suspense>
        </ARScene>
      </ARCanvas>
      
      <ARControlsUI 
        controlsRef={controlsRef} 
        showZoomControls={false}
      />
    </div>
  );
}

/**
 * Example 5: Custom zoom step
 */
export function CustomZoomStepExample() {
  const controlsRef = useRef<ARControlsRef>(null);

  return (
    <div className="relative w-full h-[500px] border rounded-lg overflow-hidden">
      <ARCanvas>
        <ARScene>
          <ARControls ref={controlsRef} minDistance={1} maxDistance={20} />
          <Suspense fallback={<ARLoading />}>
            <Box args={[1, 1, 1]} castShadow receiveShadow>
              <meshStandardMaterial color="lime" />
            </Box>
          </Suspense>
        </ARScene>
      </ARCanvas>
      
      <ARControlsUI 
        controlsRef={controlsRef} 
        zoomStep={2}
      />
      
      <div className="absolute top-4 left-4 bg-white/90 p-3 rounded-lg shadow-lg">
        <p className="text-sm font-medium">Zoom Step: 2</p>
        <p className="text-xs text-gray-600">Faster zoom in/out</p>
      </div>
    </div>
  );
}

/**
 * Example 6: Dish viewer with controls
 */
export function DishViewerWithControlsExample() {
  const controlsRef = useRef<ARControlsRef>(null);

  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="p-4 bg-white border-b">
        <h3 className="text-lg font-semibold">Grilled Salmon - 3D View</h3>
        <p className="text-sm text-gray-600">Use controls to explore the dish</p>
      </div>
      
      <div className="relative h-[calc(100%-80px)]">
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
            <ARControls ref={controlsRef} />
            <Suspense fallback={<ARLoading />}>
              {/* Simulated dish */}
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
        
        <ARControlsUI controlsRef={controlsRef} />
      </div>
    </div>
  );
}

/**
 * Example 7: Custom styled controls
 */
export function CustomStyledControlsExample() {
  const controlsRef = useRef<ARControlsRef>(null);

  return (
    <div className="relative w-full h-[500px] border rounded-lg overflow-hidden bg-gradient-to-br from-purple-900 to-blue-900">
      <ARCanvas backgroundColor="#1a1a2e">
        <ARScene>
          <ARControls ref={controlsRef} />
          <Suspense fallback={<ARLoading />}>
            <Box args={[1, 1, 1]} castShadow receiveShadow>
              <meshStandardMaterial 
                color="#4a90e2" 
                metalness={0.8} 
                roughness={0.2}
              />
            </Box>
          </Suspense>
        </ARScene>
      </ARCanvas>
      
      <ARControlsUI 
        controlsRef={controlsRef} 
        className="opacity-80 hover:opacity-100 transition-opacity"
      />
    </div>
  );
}

/**
 * Demo component showing all examples
 */
export function ARControlsUIExamplesDemo() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">AR Controls UI Examples</h2>
        <p className="text-gray-600 mb-8">
          UI controls for AR viewer with zoom and reset functionality
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">1. Basic Controls UI</h3>
          <p className="text-sm text-gray-600 mb-4">Default controls with zoom and reset buttons</p>
          <BasicARControlsUIExample />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">2. Different Positions</h3>
          <p className="text-sm text-gray-600 mb-4">Controls can be positioned in any corner</p>
          <PositionedControlsExample />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">3. Zoom Only</h3>
          <p className="text-sm text-gray-600 mb-4">Only zoom controls without reset button</p>
          <ZoomOnlyExample />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">4. Reset Only</h3>
          <p className="text-sm text-gray-600 mb-4">Only reset button without zoom controls</p>
          <ResetOnlyExample />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">5. Custom Zoom Step</h3>
          <p className="text-sm text-gray-600 mb-4">Faster zoom with custom step size</p>
          <CustomZoomStepExample />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">6. Dish Viewer with Controls</h3>
          <p className="text-sm text-gray-600 mb-4">Complete dish viewer with UI controls</p>
          <DishViewerWithControlsExample />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">7. Custom Styled Controls</h3>
          <p className="text-sm text-gray-600 mb-4">Controls with custom styling and transitions</p>
          <CustomStyledControlsExample />
        </div>
      </div>
    </div>
  );
}
