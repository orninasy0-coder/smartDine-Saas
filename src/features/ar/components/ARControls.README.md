# AR Controls Component

Enhanced camera controls for the AR viewer with programmatic control and UI buttons.

## Components

### ARControls

The core camera controls component that wraps `@react-three/drei`'s OrbitControls with additional programmatic control methods.

**Features:**
- ✅ OrbitControls for rotation (mouse drag)
- ✅ Zoom controls (mouse wheel + programmatic)
- ✅ Pan controls (right-click drag)
- ✅ Smooth damping for natural movement
- ✅ Configurable limits (min/max distance, polar angles)
- ✅ Auto-rotate mode
- ✅ Programmatic control via ref

**Usage:**

```tsx
import { ARControls } from '@/features/ar/components';
import type { ARControlsRef } from '@/features/ar/components';
import { useRef } from 'react';

function MyARViewer() {
  const controlsRef = useRef<ARControlsRef>(null);

  return (
    <Canvas>
      <ARControls 
        ref={controlsRef}
        minDistance={2}
        maxDistance={10}
        enableDamping={true}
        autoRotate={false}
      />
      {/* Your 3D content */}
    </Canvas>
  );
}
```

**Programmatic Control:**

```tsx
// Zoom in by 1 unit
controlsRef.current?.zoomIn(1);

// Zoom out by 1 unit
controlsRef.current?.zoomOut(1);

// Reset camera to initial position
controlsRef.current?.reset();

// Get current zoom level (distance from target)
const distance = controlsRef.current?.getZoomLevel();

// Set specific zoom level
controlsRef.current?.setZoomLevel(5);
```

### ARControlsUI

UI buttons for zoom and reset controls that work with ARControls.

**Features:**
- ✅ Zoom in/out buttons
- ✅ Reset view button
- ✅ Configurable positioning (4 corners)
- ✅ Show/hide individual controls
- ✅ Custom zoom step size
- ✅ Responsive design with Tailwind CSS

**Usage:**

```tsx
import { ARCanvas, ARScene, ARControls, ARControlsUI } from '@/features/ar/components';
import type { ARControlsRef } from '@/features/ar/components';
import { useRef } from 'react';

function DishViewer() {
  const controlsRef = useRef<ARControlsRef>(null);

  return (
    <div className="relative w-full h-[500px]">
      <ARCanvas>
        <ARScene>
          <ARControls ref={controlsRef} />
          {/* Your 3D model */}
        </ARScene>
      </ARCanvas>
      
      <ARControlsUI 
        controlsRef={controlsRef}
        position="bottom-right"
        showZoomControls={true}
        showResetButton={true}
        zoomStep={1}
      />
    </div>
  );
}
```

## Props

### ARControls Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enablePan` | `boolean` | `true` | Enable panning (moving camera position) |
| `enableZoom` | `boolean` | `true` | Enable zooming |
| `enableRotate` | `boolean` | `true` | Enable rotation |
| `minDistance` | `number` | `2` | Minimum zoom distance |
| `maxDistance` | `number` | `10` | Maximum zoom distance |
| `maxPolarAngle` | `number` | `Math.PI / 2` | Maximum polar angle (prevents going below ground) |
| `minPolarAngle` | `number` | `0` | Minimum polar angle |
| `enableDamping` | `boolean` | `true` | Enable smooth camera movement |
| `dampingFactor` | `number` | `0.05` | Damping factor (lower = smoother but slower) |
| `rotateSpeed` | `number` | `0.5` | Rotation speed |
| `zoomSpeed` | `number` | `0.8` | Zoom speed |
| `panSpeed` | `number` | `1` | Pan speed |
| `autoRotate` | `boolean` | `false` | Auto-rotate the camera |
| `autoRotateSpeed` | `number` | `2` | Auto-rotate speed (negative for reverse) |
| `onChange` | `() => void` | - | Callback when controls change |
| `onStart` | `() => void` | - | Callback when controls start changing |
| `onEnd` | `() => void` | - | Callback when controls stop changing |

### ARControlsUI Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `controlsRef` | `RefObject<ARControlsRef>` | **required** | Reference to ARControls |
| `showZoomControls` | `boolean` | `true` | Show zoom in/out buttons |
| `showResetButton` | `boolean` | `true` | Show reset view button |
| `position` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` | Position of controls |
| `zoomStep` | `number` | `1` | Zoom step amount |
| `className` | `string` | `''` | Custom className for container |

## ARControlsRef Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `reset` | `() => void` | Reset camera to initial position |
| `zoomIn` | `(amount?: number) => void` | Zoom in by specified amount (default: 1) |
| `zoomOut` | `(amount?: number) => void` | Zoom out by specified amount (default: 1) |
| `getZoomLevel` | `() => number` | Get current zoom level (distance from target) |
| `setZoomLevel` | `(distance: number) => void` | Set zoom level to specific distance |

## Examples

### Basic Usage

```tsx
import { ARCanvas, ARScene, ARControls, ARControlsUI } from '@/features/ar/components';
import type { ARControlsRef } from '@/features/ar/components';
import { useRef } from 'react';
import { Box } from '@react-three/drei';

function BasicExample() {
  const controlsRef = useRef<ARControlsRef>(null);

  return (
    <div className="relative w-full h-[500px]">
      <ARCanvas>
        <ARScene>
          <ARControls ref={controlsRef} />
          <Box args={[1, 1, 1]}>
            <meshStandardMaterial color="orange" />
          </Box>
        </ARScene>
      </ARCanvas>
      
      <ARControlsUI controlsRef={controlsRef} />
    </div>
  );
}
```

### Custom Positioning

```tsx
<ARControlsUI 
  controlsRef={controlsRef} 
  position="top-left"
/>
```

### Only Zoom Controls

```tsx
<ARControlsUI 
  controlsRef={controlsRef} 
  showResetButton={false}
/>
```

### Only Reset Button

```tsx
<ARControlsUI 
  controlsRef={controlsRef} 
  showZoomControls={false}
/>
```

### Custom Zoom Step

```tsx
<ARControlsUI 
  controlsRef={controlsRef} 
  zoomStep={2}  // Faster zoom
/>
```

### Programmatic Control

```tsx
function AdvancedExample() {
  const controlsRef = useRef<ARControlsRef>(null);

  const handleZoomToClose = () => {
    controlsRef.current?.setZoomLevel(3);
  };

  const handleZoomToFar = () => {
    controlsRef.current?.setZoomLevel(8);
  };

  return (
    <div className="relative w-full h-[500px]">
      <ARCanvas>
        <ARScene>
          <ARControls ref={controlsRef} />
          {/* Your 3D content */}
        </ARScene>
      </ARCanvas>
      
      <ARControlsUI controlsRef={controlsRef} />
      
      <div className="absolute top-4 left-4 space-x-2">
        <button onClick={handleZoomToClose}>Close View</button>
        <button onClick={handleZoomToFar}>Far View</button>
      </div>
    </div>
  );
}
```

## Integration with ARScene

The ARControls component is automatically integrated into ARScene:

```tsx
<ARScene autoRotate={true} autoRotateSpeed={2}>
  {/* ARControls is included automatically */}
  {/* Your 3D content */}
</ARScene>
```

To use custom controls or add UI controls:

```tsx
const controlsRef = useRef<ARControlsRef>(null);

<ARCanvas>
  <ambientLight />
  <directionalLight />
  
  {/* Use custom ARControls instead of ARScene's default */}
  <ARControls 
    ref={controlsRef}
    minDistance={3}
    maxDistance={15}
  />
  
  {/* Your 3D content */}
</ARCanvas>

<ARControlsUI controlsRef={controlsRef} />
```

## Testing

Tests are provided for both components:

- `ARControls.test.tsx` - Tests for core controls component
- `ARControlsUI.test.tsx` - Tests for UI controls component

Run tests:

```bash
npm test -- src/features/ar/components/ARControls.test.tsx
npm test -- src/features/ar/components/ARControlsUI.test.tsx
```

## Implementation Details

### Zoom Implementation

The zoom functionality uses OrbitControls' `dollyIn` and `dollyOut` methods:

- `zoomIn`: Decreases distance (moves camera closer)
- `zoomOut`: Increases distance (moves camera farther)
- Respects `minDistance` and `maxDistance` limits
- Smooth transitions with damping

### Reset Implementation

The reset functionality uses OrbitControls' built-in `reset()` method which:

- Returns camera to initial position
- Resets target to origin
- Resets zoom level to default
- Smooth transition with damping

### UI Controls

The UI controls use shadcn/ui Button component with:

- Lucide icons (ZoomIn, ZoomOut, RotateCcw)
- Semi-transparent white background
- Shadow for depth
- Hover effects
- Responsive sizing

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (with touch support)

## Performance

- Lightweight wrapper around OrbitControls
- No performance overhead
- Smooth 60fps interactions
- Efficient ref-based control

## Accessibility

- Keyboard navigation support (via OrbitControls)
- Touch support for mobile devices
- Clear button labels with titles
- High contrast UI controls

## Related Components

- [ARCanvas](./ARCanvas.tsx) - Canvas wrapper with scene setup
- [ARScene](./ARScene.tsx) - Scene with lighting and default controls
- [ARButton](./ARButton.tsx) - Button to toggle AR view
- [ARLoading](./ARLoading.tsx) - Loading indicator

## Next Steps

See the example files for more usage patterns:
- `ARControls.example.tsx` - Basic controls examples
- `ARControlsUI.example.tsx` - UI controls examples
- `ARCanvas.example.tsx` - Complete AR viewer examples
