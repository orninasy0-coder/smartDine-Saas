# AR Device Support Detection

This document describes the AR device support detection system and graceful degradation strategy implemented in the SmartDine platform.

## Overview

The AR device support system automatically detects whether a user's device can render 3D content and provides appropriate fallbacks for unsupported devices. This ensures all users get a great experience regardless of their device capabilities.

## Features

### 1. WebGL Support Detection

The system detects:
- **WebGL 1.0** support (minimum requirement for 3D rendering)
- **WebGL 2.0** support (enhanced features)
- **WebGL capabilities** (texture size, vertex attributes, etc.)
- **GPU information** (renderer and vendor)

### 2. Device Capability Check

Comprehensive device capability detection includes:
- Maximum texture size
- Maximum vertex attributes
- Maximum fragment uniforms
- GPU renderer information
- GPU vendor information

### 3. Graceful Degradation

When 3D rendering is not supported:
- Automatically falls back to high-quality image galleries
- Provides clear messaging about device capabilities
- Maintains a consistent user experience
- No broken features or error states

## Usage

### Using the Hook

The `useARSupport` hook provides device capability information:

```tsx
import { useARSupport } from '@/features/ar';

function MyComponent() {
  const { isSupported, isChecking, deviceSupport, message } = useARSupport();

  if (isChecking) {
    return <div>Checking device capabilities...</div>;
  }

  if (!isSupported) {
    return <div>{message}</div>;
  }

  return <ARViewer />;
}
```

### Using the Indicator Component

Display device support status to users:

```tsx
import { ARSupportIndicator } from '@/features/ar';

function MyComponent() {
  return (
    <div>
      <h2>3D Viewing Capabilities</h2>
      <ARSupportIndicator showDetails />
    </div>
  );
}
```

### Using the Adaptive Viewer

Automatically render the appropriate viewer based on device capabilities:

```tsx
import { AdaptiveViewer } from '@/features/ar';

function DishViewer({ dish }) {
  return (
    <AdaptiveViewer
      dishName={dish.name}
      description={dish.description}
      modelUrl={dish.modelUrl}
      images={dish.images}
      showSupportMessage
      arViewerComponent={
        <ARCanvas>
          <ARScene>
            <Model3D url={dish.modelUrl} />
            <ARControls />
          </ARScene>
        </ARCanvas>
      }
    />
  );
}
```

## API Reference

### `detectDeviceSupport()`

Detects device 3D rendering capabilities.

**Returns:**
```typescript
{
  webgl: boolean;           // WebGL 1.0 support
  webgl2: boolean;          // WebGL 2.0 support
  canRender3D: boolean;     // Overall 3D rendering capability
  capabilities?: {          // Detailed capabilities (if supported)
    maxTextureSize: number;
    maxVertexAttributes: number;
    maxFragmentUniforms: number;
    renderer: string;
    vendor: string;
  };
  reason?: string;          // Reason if not supported
}
```

### `useARSupport()`

React hook for device capability detection.

**Returns:**
```typescript
{
  isSupported: boolean;           // Whether 3D is supported
  isChecking: boolean;            // Whether check is in progress
  deviceSupport: DeviceSupport;   // Detailed support info
  message: string;                // User-friendly message
  recheck: () => void;            // Function to recheck capabilities
}
```

### `<ARSupportIndicator />`

Component to display device support status.

**Props:**
- `showDetails?: boolean` - Show detailed capability information
- `className?: string` - Custom CSS class

### `<AdaptiveViewer />`

Component that automatically adapts to device capabilities.

**Props:**
- `dishName: string` - Name of the dish
- `description?: string` - Dish description
- `modelUrl?: string` - 3D model URL
- `images: string[]` - Fallback images
- `arViewerComponent?: ReactNode` - AR viewer to render if supported
- `forceFallback?: boolean` - Force fallback mode (for testing)
- `showSupportMessage?: boolean` - Show device support message
- `className?: string` - Custom CSS class
- `onClose?: () => void` - Callback when viewer is closed

## Device Support Matrix

| Device Type | WebGL Support | Experience |
|-------------|---------------|------------|
| Modern Desktop | ✅ WebGL 2.0 | Full 3D AR viewer |
| Modern Mobile | ✅ WebGL 1.0/2.0 | Full 3D AR viewer |
| Older Desktop | ✅ WebGL 1.0 | Full 3D AR viewer |
| Older Mobile | ⚠️ Limited | Fallback image gallery |
| Very Old Devices | ❌ None | Fallback image gallery |

## Best Practices

### 1. Always Provide Fallbacks

Never assume all users have WebGL support. Always provide high-quality fallback content:

```tsx
<AdaptiveViewer
  modelUrl={dish.modelUrl}
  images={dish.images}  // Always provide images
  arViewerComponent={<ARViewer />}
/>
```

### 2. Communicate Clearly

Let users know why they're seeing a particular experience:

```tsx
<AdaptiveViewer
  showSupportMessage  // Show device capability message
  // ...
/>
```

### 3. Make Fallbacks Great

The fallback experience should still be high-quality:
- Use high-resolution images
- Provide multiple angles
- Include zoom functionality
- Add descriptive captions

### 4. Test on Real Devices

Emulators may not accurately represent WebGL capabilities. Test on:
- Various mobile devices (iOS and Android)
- Different browsers (Chrome, Safari, Firefox)
- Older devices with limited GPU capabilities

### 5. Monitor Capabilities

Track which devices your users have to inform future decisions:

```tsx
const { deviceSupport } = useARSupport();

// Log to analytics
useEffect(() => {
  if (deviceSupport) {
    analytics.track('device_capabilities', {
      webgl: deviceSupport.webgl,
      webgl2: deviceSupport.webgl2,
      maxTextureSize: deviceSupport.capabilities?.maxTextureSize,
    });
  }
}, [deviceSupport]);
```

## Troubleshooting

### WebGL Not Detected on Supported Device

1. Check if WebGL is disabled in browser settings
2. Verify GPU drivers are up to date
3. Check if hardware acceleration is enabled
4. Try a different browser

### Fallback Not Showing

1. Verify images array is not empty
2. Check image URLs are accessible
3. Ensure `forceFallback` is not accidentally set to `false`

### Performance Issues on Supported Devices

1. Check device capabilities (texture size, etc.)
2. Consider using LOD (Level of Detail) models
3. Optimize 3D models and textures
4. Implement progressive loading

## Examples

See the following example files for complete implementations:
- `ARSupportIndicator.example.tsx` - Device support indicator examples
- `GracefulDegradation.example.tsx` - Complete graceful degradation demo
- `AdaptiveViewer.example.tsx` - Adaptive viewer usage examples

## Related Documentation

- [AR Setup Guide](./README.md)
- [Performance Optimization](./PERFORMANCE_OPTIMIZATION.md)
- [Fallback Gallery](./components/FALLBACK_GALLERY_README.md)
