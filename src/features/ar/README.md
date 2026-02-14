# AR Viewer Module

This module provides AR (Augmented Reality) 3D visualization capabilities for dish models using Three.js and React Three Fiber.

## Components

### ARButton

A button component that triggers the AR viewer for dishes with 3D models.

**Props:**
- `modelUrl`: URL of the 3D model (GLB/glTF format) - Required for button to render
- `onARClick`: Callback function when button is clicked
- `size`: Button size variant (`default`, `sm`, `lg`, `icon`) - Default: `default`
- `variant`: Button style variant (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`) - Default: `outline`
- `className`: Additional CSS classes
- `showText`: Whether to show button text - Default: `true`
- `text`: Custom button text - Default: `"View in AR"`
- `disabled`: Whether the button is disabled - Default: `false`

**Features:**
- Only renders when a valid `modelUrl` is provided
- Stops event propagation to prevent triggering parent click handlers
- Supports all shadcn/ui button variants and sizes
- Icon-only mode for compact layouts
- Customizable text and styling
- Accessible with proper ARIA labels

**Usage:**
```tsx
import { ARButton } from '@/features/ar';

// Basic usage
<ARButton
  modelUrl="https://example.com/models/dish.glb"
  onARClick={() => console.log('Opening AR viewer')}
/>

// Icon only
<ARButton
  modelUrl="https://example.com/models/dish.glb"
  onARClick={handleARClick}
  size="icon"
  showText={false}
/>

// Custom styling
<ARButton
  modelUrl="https://example.com/models/dish.glb"
  onARClick={handleARClick}
  variant="secondary"
  size="sm"
  text="3D View"
/>
```

### ARCanvas

The main canvas wrapper that configures the Three.js renderer with enhanced scene setup.

**Props:**
- `children`: React nodes to render inside the canvas
- `className`: Optional CSS classes
- `backgroundColor`: Background color for the scene - Default: `"#f0f0f0"`
- `enableFog`: Enable fog effect for depth perception - Default: `true`
- `fogColor`: Fog color (should match or complement background) - Default: `"#f0f0f0"`
- `fogDensity`: Fog density (higher = thicker fog) - Default: `0.05`

**Features:**
- Configured camera with optimal FOV and position
- Anti-aliasing enabled for smooth rendering
- Alpha channel support for transparency
- Device pixel ratio optimization for high-DPI screens
- ACES Filmic tone mapping for realistic colors
- sRGB color space for accurate color reproduction
- Configurable background color
- Optional fog effect for depth perception
- Shadow map support with soft shadows

**Usage:**
```tsx
import { ARCanvas } from '@/features/ar';

// Basic usage
<ARCanvas>
  {/* Your 3D content */}
</ARCanvas>

// Custom background and fog
<ARCanvas
  backgroundColor="#1a1a2e"
  enableFog={true}
  fogColor="#1a1a2e"
  fogDensity={0.08}
>
  {/* Your 3D content */}
</ARCanvas>
```

### ARScene

Provides enhanced lighting and camera controls for the 3D scene.

**Props:**
- `children`: React nodes to render in the scene
- `ambientIntensity`: Ambient light intensity - Default: `0.5`
- `mainLightIntensity`: Main directional light intensity - Default: `1`
- `fillLightIntensity`: Fill light intensity - Default: `0.3`
- `pointLightIntensity`: Point light intensity - Default: `0.5`
- `enableShadows`: Enable shadows for realistic lighting - Default: `true`
- `shadowMapSize`: Shadow map size (higher = better quality) - Default: `1024`
- `autoRotate`: Enable auto-rotation of the model - Default: `false`
- `autoRotateSpeed`: Auto-rotation speed - Default: `2`

**Features:**
- Professional three-point lighting setup (key, fill, rim)
- Ambient light for overall illumination
- Directional lights for realistic shadows
- Point light for highlights
- Hemisphere light for natural sky/ground gradient
- Configurable light intensities
- High-quality shadow mapping
- OrbitControls for interactive camera manipulation (rotate, zoom, pan)
- Auto-rotation support

**Usage:**
```tsx
import { ARScene } from '@/features/ar';

// Basic usage
<ARScene>
  {/* Your 3D models */}
</ARScene>

// Custom lighting
<ARScene
  ambientIntensity={0.3}
  mainLightIntensity={1.5}
  fillLightIntensity={0.5}
  enableShadows={true}
  shadowMapSize={2048}
>
  {/* Your 3D models */}
</ARScene>

// With auto-rotation
<ARScene autoRotate={true} autoRotateSpeed={3}>
  {/* Your 3D models */}
</ARScene>
```

### ARControls

Enhanced camera controls component for fine-tuned interaction.

**Props:**
- `enablePan`: Enable panning - Default: `true`
- `enableZoom`: Enable zooming - Default: `true`
- `enableRotate`: Enable rotation - Default: `true`
- `minDistance`: Minimum zoom distance - Default: `2`
- `maxDistance`: Maximum zoom distance - Default: `10`
- `maxPolarAngle`: Maximum polar angle - Default: `Math.PI / 2`
- `minPolarAngle`: Minimum polar angle - Default: `0`
- `enableDamping`: Enable smooth camera movement - Default: `true`
- `dampingFactor`: Damping factor (lower = smoother) - Default: `0.05`
- `rotateSpeed`: Rotation speed - Default: `0.5`
- `zoomSpeed`: Zoom speed - Default: `0.8`
- `panSpeed`: Pan speed - Default: `1`
- `autoRotate`: Auto-rotate the camera - Default: `false`
- `autoRotateSpeed`: Auto-rotate speed - Default: `2`
- `onChange`: Callback when controls change
- `onStart`: Callback when controls start changing
- `onEnd`: Callback when controls stop changing

**Features:**
- Fully configurable camera controls
- Smooth damping for natural movement
- Customizable speed settings
- Auto-rotation support
- Event callbacks for interaction tracking

**Usage:**
```tsx
import { ARControls } from '@/features/ar';

// Custom controls (use instead of ARScene's built-in controls)
<ARCanvas>
  <ambientLight intensity={0.5} />
  <directionalLight position={[5, 5, 5]} />
  
  <ARControls
    minDistance={3}
    maxDistance={15}
    enablePan={false}
    rotateSpeed={0.3}
    autoRotate={true}
  />
  
  {/* Your 3D models */}
</ARCanvas>
```

### ARLoading

Loading indicator displayed while 3D models are being loaded.

### Model3D

Core component for loading and displaying 3D models (GLB/glTF format).

**Props:**
- `modelUrl`: URL of the 3D model (GLB/glTF format) - Required
- `scale`: Scale of the model - Default: `1`
- `position`: Position [x, y, z] - Default: `[0, 0, 0]`
- `rotation`: Rotation [x, y, z] in radians - Default: `[0, 0, 0]`
- `castShadow`: Enable shadows - Default: `true`
- `receiveShadow`: Receive shadows - Default: `true`
- `onLoad`: Callback when model loads
- `onError`: Callback on error

**Features:**
- Uses `useGLTF` hook from @react-three/drei
- Automatic model caching
- Shadow configuration
- Material optimization

**Usage:**
```tsx
import { Model3D } from '@/features/ar';

<Model3D
  modelUrl="https://example.com/models/dish.glb"
  scale={1.5}
  position={[0, -1, 0]}
  onLoad={() => console.log('Loaded!')}
/>
```

### ModelLoader

High-level wrapper for Model3D with suspense, error handling, and progress tracking.

**Props:**
- All Model3D props, plus:
- `loadingText`: Custom loading text - Default: `"Loading 3D model..."`
- `showProgress`: Show percentage - Default: `true`
- `showProgressBar`: Show progress bar - Default: `true`
- `showItemCount`: Show item count - Default: `false`
- `errorMessage`: Custom error message
- `enableRetry`: Enable retry on error - Default: `true`
- `loadingComponent`: Custom loading component
- `errorFallback`: Custom error fallback

**Features:**
- Automatic suspense handling
- Built-in error boundary with retry (up to 3 attempts)
- Real-time progress tracking
- Customizable loading and error states

**Usage:**
```tsx
import { ARCanvas, ARScene, ModelLoader } from '@/features/ar';

<ARCanvas>
  <ARScene>
    <ModelLoader
      modelUrl="https://example.com/models/dish.glb"
      loadingText="Loading your dish..."
      showProgress={true}
      enableRetry={true}
      onLoad={() => console.log('Ready!')}
    />
  </ARScene>
</ARCanvas>
```

### ModelProgress

Progress indicator component for model loading.

**Props:**
- `loadingText`: Loading text - Default: `"Loading 3D model..."`
- `showPercentage`: Show percentage - Default: `true`
- `showProgressBar`: Show progress bar - Default: `true`
- `showItemCount`: Show item count - Default: `false`

**Features:**
- Real-time progress percentage
- Visual progress bar
- Item count tracking
- Error count display

### ModelErrorBoundary

Error boundary for 3D model loading errors.

**Props:**
- `children`: React nodes
- `fallback`: Custom error fallback
- `errorMessage`: Custom error message
- `enableRetry`: Enable retry - Default: `true`
- `onError`: Error callback

**Features:**
- Catches model loading errors
- User-friendly error messages
- Retry functionality (up to 3 attempts)
- Error logging in development

**Utility Functions:**
```tsx
import { preloadModel, clearModelCache, clearAllModelCache } from '@/features/ar';

// Preload a model before it's needed
preloadModel('https://example.com/models/dish.glb');

// Clear cache for a specific model
clearModelCache('https://example.com/models/dish.glb');

// Clear all cached models
clearAllModelCache();
```

## Complete Usage Example

```tsx
import { ARCanvas, ARScene, ARLoading } from '@/features/ar';
import { Suspense } from 'react';

function MyARComponent() {
  return (
    <div className="w-full h-[500px]">
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
            {/* Your 3D model components here */}
          </Suspense>
        </ARScene>
      </ARCanvas>
    </div>
  );
}
```

## Camera Controls

- **Rotate**: Click and drag
- **Zoom**: Scroll wheel or pinch gesture
- **Pan**: Right-click and drag (or two-finger drag on touch devices)

## Lighting Setup

The scene uses a professional lighting setup:

1. **Ambient Light** (intensity: 0.5) - Provides base illumination
2. **Main Directional Light** (position: [5, 5, 5], intensity: 1) - Key light simulating sunlight with shadows
3. **Fill Light** (position: [-5, 3, -5], intensity: 0.3) - Reduces harsh shadows
4. **Back Light** (position: [0, 3, -5], intensity: 0.2) - Rim lighting effect
5. **Point Light** (position: [0, 5, 0], intensity: 0.5) - Adds highlights from above
6. **Hemisphere Light** (sky: #ffffff, ground: #444444, intensity: 0.3) - Natural sky/ground gradient

## Performance Considerations

- Models are loaded with Suspense for progressive loading
- Device pixel ratio is capped at 2 to balance quality and performance
- Camera distance is limited (min: 2, max: 10) to prevent extreme views
- Shadow map size is configurable (default: 1024x1024) for optimal quality/performance balance
- ACES Filmic tone mapping for realistic rendering without performance impact
- Fog effect adds depth perception with minimal overhead

## Next Steps

- ✅ Task 7.1: Setup Three.js and React Three Fiber
- ✅ Task 7.2: AR Button Component
- ✅ Task 7.3: Enhanced ThreeJS Canvas Component
  - ✅ 7.3.1: Scene setup (background, fog, tone mapping)
  - ✅ 7.3.2: Lighting configuration (three-point lighting + hemisphere)
  - ✅ 7.3.3: Camera controls (enhanced OrbitControls with damping)
- ✅ Task 7.4: AR Controls Component (standalone controls)
- ✅ Task 7.5: Implement 3D model loading (GLB/glTF)
  - ✅ 7.5.1: GLTFLoader setup
  - ✅ 7.5.2: Model loading with suspense
  - ✅ 7.5.3: Error handling for failed loads
  - ✅ 7.5.4: Progress indicator
- ✅ Task 7.6: Add performance optimizations
  - ✅ 7.6.1: Model optimization
  - ✅ 7.6.2: Texture compression
  - ✅ 7.6.3: LOD (Level of Detail) implementation
- ✅ Task 7.7: Create fallback gallery for unsupported devices
- Task 7.8: Add device capability detection

## Fallback Gallery for Unsupported Devices

For devices that don't support WebGL/3D rendering, the AR module provides a fallback image gallery.

### FallbackGallery Component

An interactive image gallery with zoom, navigation, and keyboard controls.

**Usage:**
```tsx
import { FallbackGallery } from '@/features/ar';

<FallbackGallery
  images={['image1.jpg', 'image2.jpg', 'image3.jpg']}
  dishName="Delicious Pizza"
  description="A mouth-watering pizza"
  onClose={() => console.log('Closed')}
/>
```

### AdaptiveViewer Component

Automatically detects device capabilities and shows either 3D viewer or fallback gallery.

**Usage:**
```tsx
import { AdaptiveViewer, ARCanvas, ARScene, ModelLoader } from '@/features/ar';

const arViewer = (
  <ARCanvas>
    <ARScene>
      <ModelLoader modelUrl="model.glb" />
    </ARScene>
  </ARCanvas>
);

<AdaptiveViewer
  dishName="Gourmet Burger"
  modelUrl="model.glb"
  images={['image1.jpg']}
  arViewerComponent={arViewer}
/>
```

### Device Detection Utilities

```tsx
import {
  isWebGLSupported,
  isWebGL2Supported,
  detectDeviceSupport,
  isMobileDevice,
  isIOSDevice,
  isAndroidDevice,
} from '@/features/ar';

// Check WebGL support
if (isWebGLSupported()) {
  console.log('WebGL is supported');
}

// Comprehensive device detection
const support = detectDeviceSupport();
console.log(support.canRender3D); // true or false
```

See `FALLBACK_GALLERY_README.md` for detailed documentation.
