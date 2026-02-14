# Fallback Gallery Component

A fallback image gallery for devices that don't support WebGL/3D rendering. Provides an interactive image viewing experience with zoom, navigation, and keyboard controls.

## Components

### FallbackGallery

An interactive image gallery with zoom and navigation controls.

**Features:**
- Multiple image support with thumbnail navigation
- Zoom controls (1x to 3x)
- Keyboard navigation (arrow keys, +/-, 0, ESC)
- Touch-friendly controls
- Responsive design
- Optional description panel
- Image counter
- Accessible with ARIA labels

**Props:**
```typescript
interface FallbackGalleryProps {
  images: string[];              // Array of image URLs
  dishName: string;              // Dish name for alt text
  description?: string;          // Optional description
  initialIndex?: number;         // Initial image index (default: 0)
  showNavigation?: boolean;      // Show nav arrows (default: true)
  showZoomControls?: boolean;    // Show zoom buttons (default: true)
  showCounter?: boolean;         // Show image counter (default: true)
  showInfo?: boolean;            // Show info button (default: true)
  className?: string;            // Custom className
  onClose?: () => void;          // Close callback
}
```

**Usage:**
```tsx
import { FallbackGallery } from '@/features/ar';

<FallbackGallery
  images={[
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ]}
  dishName="Delicious Pizza"
  description="A mouth-watering pizza with fresh ingredients"
  onClose={() => console.log('Gallery closed')}
/>
```

### AdaptiveViewer

Automatically detects device capabilities and renders either the 3D AR viewer or the fallback image gallery.

**Features:**
- Automatic WebGL support detection
- Seamless fallback to image gallery
- Device capability checking
- Support message display
- Loading state handling
- Error state handling

**Props:**
```typescript
interface AdaptiveViewerProps {
  dishName: string;              // Dish name
  description?: string;          // Dish description
  modelUrl?: string;             // 3D model URL
  images: string[];              // Fallback images
  arViewerComponent?: ReactNode; // AR viewer component
  forceFallback?: boolean;       // Force fallback mode (default: false)
  showSupportMessage?: boolean;  // Show support message (default: true)
  className?: string;            // Custom className
  onClose?: () => void;          // Close callback
}
```

**Usage:**
```tsx
import { AdaptiveViewer, ARCanvas, ARScene, ModelLoader } from '@/features/ar';
import { Suspense } from 'react';

const arViewer = (
  <ARCanvas>
    <ARScene>
      <Suspense fallback={<ARLoading />}>
        <ModelLoader
          modelUrl="https://example.com/model.glb"
          scale={2}
          position={[0, -1, 0]}
        />
      </Suspense>
    </ARScene>
  </ARCanvas>
);

<AdaptiveViewer
  dishName="Gourmet Burger"
  description="Premium beef burger"
  modelUrl="https://example.com/model.glb"
  images={['https://example.com/image1.jpg']}
  arViewerComponent={arViewer}
/>
```

## Device Detection Utilities

### isWebGLSupported()

Check if WebGL is supported by the browser.

```typescript
import { isWebGLSupported } from '@/features/ar';

if (isWebGLSupported()) {
  console.log('WebGL is supported');
}
```

### isWebGL2Supported()

Check if WebGL2 is supported by the browser.

```typescript
import { isWebGL2Supported } from '@/features/ar';

if (isWebGL2Supported()) {
  console.log('WebGL2 is supported');
}
```

### detectDeviceSupport()

Comprehensive device capability detection.

```typescript
import { detectDeviceSupport } from '@/features/ar';

const support = detectDeviceSupport();
console.log(support);
// {
//   webgl: true,
//   webgl2: true,
//   canRender3D: true,
//   reason?: string
// }
```

### isMobileDevice()

Check if the device is mobile.

```typescript
import { isMobileDevice } from '@/features/ar';

if (isMobileDevice()) {
  console.log('Mobile device detected');
}
```

### isIOSDevice()

Check if the device is iOS.

```typescript
import { isIOSDevice } from '@/features/ar';

if (isIOSDevice()) {
  console.log('iOS device detected');
}
```

### isAndroidDevice()

Check if the device is Android.

```typescript
import { isAndroidDevice } from '@/features/ar';

if (isAndroidDevice()) {
  console.log('Android device detected');
}
```

### getDeviceSupportMessage()

Get a user-friendly message about device support.

```typescript
import { detectDeviceSupport, getDeviceSupportMessage } from '@/features/ar';

const support = detectDeviceSupport();
const message = getDeviceSupportMessage(support);
console.log(message);
// "3D rendering is supported on your device"
// or "WebGL is not supported on this device"
```

## Keyboard Controls

The FallbackGallery supports keyboard navigation:

- **Arrow Left/Right**: Navigate between images
- **+/=**: Zoom in
- **-**: Zoom out
- **0**: Reset zoom to 1:1
- **ESC**: Close gallery (if onClose is provided)

## Accessibility

Both components are built with accessibility in mind:

- Proper ARIA labels for all interactive elements
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Semantic HTML structure

## Examples

See the example files for more usage patterns:
- `FallbackGallery.example.tsx` - Various gallery configurations
- `AdaptiveViewer.example.tsx` - Adaptive viewer scenarios

## Integration with Dish Details

Example integration with a dish details page:

```tsx
import { useState } from 'react';
import { AdaptiveViewer, ARCanvas, ARScene, ModelLoader } from '@/features/ar';
import { Dialog, DialogContent } from '@/components/ui/dialog';

function DishDetailsPage({ dish }) {
  const [showViewer, setShowViewer] = useState(false);

  const arViewer = dish.modelUrl ? (
    <ARCanvas>
      <ARScene>
        <Suspense fallback={<ARLoading />}>
          <ModelLoader
            modelUrl={dish.modelUrl}
            scale={2}
            position={[0, -1, 0]}
          />
        </Suspense>
      </ARScene>
    </ARCanvas>
  ) : undefined;

  return (
    <div>
      <h1>{dish.name}</h1>
      <button onClick={() => setShowViewer(true)}>
        View in 3D/AR
      </button>

      <Dialog open={showViewer} onOpenChange={setShowViewer}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <AdaptiveViewer
            dishName={dish.name}
            description={dish.description}
            modelUrl={dish.modelUrl}
            images={dish.images || [dish.imageUrl]}
            arViewerComponent={arViewer}
            onClose={() => setShowViewer(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

## Performance Considerations

- Images are loaded on-demand
- Zoom transformations use CSS transforms for smooth performance
- Thumbnail strip uses horizontal scrolling for many images
- Device detection runs once on mount
- No unnecessary re-renders

## Browser Support

- **3D Viewer**: Requires WebGL support (most modern browsers)
- **Fallback Gallery**: Works on all browsers with JavaScript enabled
- **Mobile**: Fully responsive and touch-friendly

## Testing

Run tests with:
```bash
npm test src/features/ar/components/FallbackGallery.test.tsx
npm test src/features/ar/utils/deviceDetection.test.ts
```
