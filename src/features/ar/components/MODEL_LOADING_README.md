# 3D Model Loading (GLB/glTF)

Complete implementation of 3D model loading with progress tracking, error handling, and suspense support.

## Components

### Model3D

Core component for loading and displaying 3D models using GLB/glTF format.

**Features:**
- Uses `@react-three/drei`'s `useGLTF` hook for efficient loading
- Automatic caching of loaded models
- Shadow configuration
- Material optimization
- Callbacks for load and error events

**Props:**
```typescript
interface Model3DProps {
  modelUrl: string;                    // URL of the GLB/glTF model
  scale?: number;                      // Default: 1
  position?: [number, number, number]; // Default: [0, 0, 0]
  rotation?: [number, number, number]; // Default: [0, 0, 0] (radians)
  castShadow?: boolean;                // Default: true
  receiveShadow?: boolean;             // Default: true
  onLoad?: () => void;
  onError?: (error: Error) => void;
}
```

**Usage:**
```tsx
import { Model3D } from '@/features/ar';

<Model3D
  modelUrl="https://example.com/models/dish.glb"
  scale={1.5}
  position={[0, -1, 0]}
  onLoad={() => console.log('Model loaded!')}
/>
```

**Utility Functions:**
```typescript
// Preload a model before it's needed
preloadModel('https://example.com/models/dish.glb');

// Clear cache for a specific model
clearModelCache('https://example.com/models/dish.glb');

// Clear all cached models
clearAllModelCache();
```

---

### ModelLoader

High-level wrapper that adds Suspense, error boundaries, and progress tracking to Model3D.

**Features:**
- Automatic suspense handling
- Built-in error boundary with retry functionality
- Progress indicator with percentage and progress bar
- Customizable loading and error states
- All Model3D features included

**Props:**
```typescript
interface ModelLoaderProps {
  // Model props
  modelUrl: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  castShadow?: boolean;
  receiveShadow?: boolean;
  
  // Loading customization
  loadingComponent?: React.ReactNode;
  loadingText?: string;              // Default: "Loading 3D model..."
  showProgress?: boolean;            // Default: true
  showProgressBar?: boolean;         // Default: true
  showItemCount?: boolean;           // Default: false
  
  // Error handling
  errorFallback?: React.ReactNode;
  errorMessage?: string;
  enableRetry?: boolean;             // Default: true
  
  // Callbacks
  onLoad?: () => void;
  onError?: (error: Error, errorInfo?: ErrorInfo) => void;
}
```

**Usage:**
```tsx
import { ARCanvas, ARScene, ModelLoader } from '@/features/ar';

<ARCanvas>
  <ARScene>
    <ModelLoader
      modelUrl="https://example.com/models/dish.glb"
      loadingText="Loading your dish..."
      showProgress={true}
      showProgressBar={true}
      enableRetry={true}
      onLoad={() => console.log('Ready!')}
      onError={(err) => console.error(err)}
    />
  </ARScene>
</ARCanvas>
```

---

### ModelProgress

Progress indicator component that tracks model loading progress.

**Features:**
- Real-time progress percentage
- Visual progress bar
- Item count tracking
- Current item display
- Error count display

**Props:**
```typescript
interface ModelProgressProps {
  loadingText?: string;        // Default: "Loading 3D model..."
  showPercentage?: boolean;    // Default: true
  showProgressBar?: boolean;   // Default: true
  showItemCount?: boolean;     // Default: false
  className?: string;
}
```

**Usage:**
```tsx
import { ModelProgress } from '@/features/ar';

// Used automatically by ModelLoader, or use manually:
<Suspense fallback={<ModelProgress showItemCount={true} />}>
  <Model3D modelUrl="..." />
</Suspense>
```

**SimpleModelProgress:**
Minimal version with just spinner and percentage:
```tsx
import { SimpleModelProgress } from '@/features/ar';

<Suspense fallback={<SimpleModelProgress />}>
  <Model3D modelUrl="..." />
</Suspense>
```

---

### ModelErrorBoundary

Error boundary specifically designed for 3D model loading errors.

**Features:**
- Catches model loading errors
- User-friendly error messages
- Retry functionality (up to 3 attempts)
- Custom error fallback support
- Error logging in development

**Props:**
```typescript
interface ModelErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableRetry?: boolean;       // Default: true
  errorMessage?: string;
}
```

**Usage:**
```tsx
import { ModelErrorBoundary } from '@/features/ar';

<ModelErrorBoundary
  errorMessage="Failed to load model"
  enableRetry={true}
  onError={(err) => console.error(err)}
>
  <Model3D modelUrl="..." />
</ModelErrorBoundary>
```

---

## Complete Examples

### Basic Usage

```tsx
import { ARCanvas, ARScene, ModelLoader } from '@/features/ar';

function DishViewer() {
  return (
    <div className="w-full h-[500px]">
      <ARCanvas>
        <ARScene>
          <ModelLoader modelUrl="https://example.com/models/dish.glb" />
        </ARScene>
      </ARCanvas>
    </div>
  );
}
```

### With Progress Tracking

```tsx
function DishViewerWithProgress() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full h-[500px]">
      <ARCanvas>
        <ARScene>
          <ModelLoader
            modelUrl="https://example.com/models/dish.glb"
            loadingText="Loading delicious dish..."
            showProgress={true}
            showProgressBar={true}
            showItemCount={true}
            onLoad={() => setIsLoading(false)}
          />
        </ARScene>
      </ARCanvas>
      {!isLoading && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded">
          Model Ready!
        </div>
      )}
    </div>
  );
}
```

### With Error Handling

```tsx
function DishViewerWithErrorHandling() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-full h-[500px]">
      <ARCanvas>
        <ARScene>
          <ModelLoader
            modelUrl="https://example.com/models/dish.glb"
            errorMessage="Failed to load the 3D model"
            enableRetry={true}
            onError={(err) => setError(err.message)}
          />
        </ARScene>
      </ARCanvas>
      {error && (
        <div className="absolute bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded">
          Error: {error}
        </div>
      )}
    </div>
  );
}
```

### Multiple Models

```tsx
function MultiDishViewer() {
  return (
    <div className="w-full h-[500px]">
      <ARCanvas>
        <ARScene>
          <ModelLoader
            modelUrl="https://example.com/models/dish1.glb"
            position={[-2, 0, 0]}
            scale={0.8}
          />
          <ModelLoader
            modelUrl="https://example.com/models/dish2.glb"
            position={[2, 0, 0]}
            scale={0.8}
          />
        </ARScene>
      </ARCanvas>
    </div>
  );
}
```

### Dynamic Model Switching

```tsx
function DynamicDishViewer() {
  const [currentModel, setCurrentModel] = useState('dish1.glb');

  return (
    <div className="relative w-full h-[500px]">
      <ARCanvas>
        <ARScene>
          <ModelLoader
            key={currentModel} // Force remount on change
            modelUrl={`https://example.com/models/${currentModel}`}
          />
        </ARScene>
      </ARCanvas>
      
      <div className="absolute top-4 left-4 flex gap-2">
        <button onClick={() => setCurrentModel('dish1.glb')}>Dish 1</button>
        <button onClick={() => setCurrentModel('dish2.glb')}>Dish 2</button>
      </div>
    </div>
  );
}
```

### Full-Featured Viewer

```tsx
function CompleteARViewer() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="relative w-full h-[600px]">
      <ARCanvas backgroundColor="#f8f8f8">
        <ARScene
          ambientIntensity={0.6}
          mainLightIntensity={1.2}
          autoRotate={false}
        >
          <ModelLoader
            modelUrl="https://example.com/models/dish.glb"
            scale={1}
            loadingText="Loading your dish..."
            showProgress={true}
            showProgressBar={true}
            showItemCount={true}
            enableRetry={true}
            onLoad={() => {
              console.log('Model loaded!');
              setIsLoading(false);
            }}
            onError={(err) => {
              console.error('Error:', err);
              setError(err.message);
            }}
          />
        </ARScene>
      </ARCanvas>

      {/* Status indicators */}
      {isLoading && (
        <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded">
          Loading...
        </div>
      )}
      {error && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded">
          Error: {error}
        </div>
      )}
      {!isLoading && !error && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded">
          Ready!
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm p-4 rounded-lg border">
        <h3 className="font-semibold mb-2">Controls:</h3>
        <ul className="text-sm space-y-1">
          <li>• Rotate: Click and drag</li>
          <li>• Zoom: Scroll wheel</li>
          <li>• Pan: Right-click and drag</li>
        </ul>
      </div>
    </div>
  );
}
```

---

## Model Format Support

### Supported Formats
- **GLB** (Binary glTF) - Recommended
- **glTF** (JSON glTF with external resources)

### Model Requirements
- Maximum file size: Recommended < 10MB for web
- Textures: Power of 2 dimensions (256x256, 512x512, 1024x1024, etc.)
- Polygons: Recommended < 100k triangles for smooth performance
- Materials: PBR materials work best

### Model Optimization Tips
1. Use GLB format (single file, compressed)
2. Compress textures (use JPG for color maps, PNG for alpha)
3. Reduce polygon count where possible
4. Remove unnecessary animations or morph targets
5. Use Draco compression for geometry
6. Optimize texture sizes (1024x1024 or smaller for web)

---

## Performance Considerations

### Caching
- Models are automatically cached by `useGLTF`
- Same model URL will only be loaded once
- Use `clearModelCache()` to free memory when needed

### Loading Strategy
- Preload models before they're needed: `preloadModel(url)`
- Load multiple models in parallel (they'll load concurrently)
- Use lower-poly models for preview, high-poly for detail view

### Memory Management
```tsx
// Preload models on component mount
useEffect(() => {
  preloadModel('https://example.com/models/dish1.glb');
  preloadModel('https://example.com/models/dish2.glb');
}, []);

// Clear cache on unmount
useEffect(() => {
  return () => {
    clearModelCache('https://example.com/models/dish1.glb');
  };
}, []);
```

---

## Error Handling

### Common Errors

1. **404 Not Found**
   - Model URL is incorrect
   - Model file doesn't exist
   - CORS issues

2. **Invalid Format**
   - File is not a valid GLB/glTF
   - Corrupted model file

3. **Loading Timeout**
   - Model file too large
   - Slow network connection

### Error Recovery

The `ModelErrorBoundary` provides automatic retry functionality:
- Up to 3 retry attempts
- User-friendly error messages
- Manual retry button

```tsx
<ModelLoader
  modelUrl="https://example.com/models/dish.glb"
  errorMessage="Failed to load model. Please check your connection."
  enableRetry={true}
  onError={(err) => {
    // Log to error tracking service
    console.error('Model load error:', err);
  }}
/>
```

---

## Integration with Dish Components

### Example: Dish Card with AR Button

```tsx
import { ARButton, ARCanvas, ARScene, ModelLoader } from '@/features/ar';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

function DishCard({ dish }) {
  const [showAR, setShowAR] = useState(false);

  return (
    <>
      <div className="dish-card">
        <img src={dish.image} alt={dish.name} />
        <h3>{dish.name}</h3>
        <p>{dish.description}</p>
        
        {dish.model3dUrl && (
          <ARButton
            modelUrl={dish.model3dUrl}
            onARClick={() => setShowAR(true)}
          />
        )}
      </div>

      <Dialog open={showAR} onOpenChange={setShowAR}>
        <DialogContent className="max-w-4xl h-[600px]">
          <ARCanvas>
            <ARScene autoRotate={true}>
              <ModelLoader
                modelUrl={dish.model3dUrl}
                loadingText={`Loading ${dish.name}...`}
                showProgress={true}
              />
            </ARScene>
          </ARCanvas>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

---

## Testing

Tests are provided for all components:
- `Model3D.test.tsx` - Core model loading tests
- `ModelLoader.test.tsx` - Wrapper component tests

Run tests:
```bash
npm run test
```

---

## Next Steps

- ✅ Task 7.5.1: GLTFLoader setup
- ✅ Task 7.5.2: Model loading with suspense
- ✅ Task 7.5.3: Error handling for failed loads
- ✅ Task 7.5.4: Progress indicator
- Task 7.6: Performance optimizations (LOD, compression)
- Task 7.7: Fallback gallery for unsupported devices
- Task 7.8: Device capability detection

---

## Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Drei Helpers](https://github.com/pmndrs/drei)
- [glTF Format Specification](https://www.khronos.org/gltf/)
- [Model Optimization Guide](https://docs.pmnd.rs/react-three-fiber/tutorials/loading-models)
