import { ARCanvas, ARScene, ModelLoader } from './index';
import { useState } from 'react';

/**
 * Example 1: Basic Model Loading
 * Simple usage with default settings
 */
export function BasicModelExample() {
  return (
    <div className="w-full h-[500px]">
      <ARCanvas>
        <ARScene>
          <ModelLoader
            modelUrl="https://example.com/models/dish.glb"
            scale={1}
          />
        </ARScene>
      </ARCanvas>
    </div>
  );
}

/**
 * Example 2: Model with Custom Position and Scale
 * Demonstrates positioning and scaling the model
 */
export function CustomPositionExample() {
  return (
    <div className="w-full h-[500px]">
      <ARCanvas>
        <ARScene>
          <ModelLoader
            modelUrl="https://example.com/models/dish.glb"
            scale={1.5}
            position={[0, -1, 0]}
            rotation={[0, Math.PI / 4, 0]}
          />
        </ARScene>
      </ARCanvas>
    </div>
  );
}

/**
 * Example 3: Model with Progress Tracking
 * Shows detailed progress information during loading
 */
export function ProgressTrackingExample() {
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
            onLoad={() => {
              console.log('Model loaded successfully!');
              setIsLoading(false);
            }}
          />
        </ARScene>
      </ARCanvas>
      {!isLoading && (
        <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded">
          Model Ready!
        </div>
      )}
    </div>
  );
}

/**
 * Example 4: Model with Error Handling
 * Demonstrates error handling and retry functionality
 */
export function ErrorHandlingExample() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-full h-[500px]">
      <ARCanvas>
        <ARScene>
          <ModelLoader
            modelUrl="https://example.com/models/invalid-model.glb"
            errorMessage="Failed to load the 3D model. Please check your connection."
            enableRetry={true}
            onError={(err) => {
              console.error('Model loading error:', err);
              setError(err.message);
            }}
          />
        </ARScene>
      </ARCanvas>
      {error && (
        <div className="absolute bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded max-w-md">
          Error: {error}
        </div>
      )}
    </div>
  );
}

/**
 * Example 5: Multiple Models
 * Loading multiple models in the same scene
 */
export function MultipleModelsExample() {
  return (
    <div className="w-full h-[500px]">
      <ARCanvas>
        <ARScene>
          {/* First model */}
          <ModelLoader
            modelUrl="https://example.com/models/dish1.glb"
            position={[-2, 0, 0]}
            scale={0.8}
          />

          {/* Second model */}
          <ModelLoader
            modelUrl="https://example.com/models/dish2.glb"
            position={[2, 0, 0]}
            scale={0.8}
          />

          {/* Third model */}
          <ModelLoader
            modelUrl="https://example.com/models/dish3.glb"
            position={[0, 0, -2]}
            scale={0.8}
          />
        </ARScene>
      </ARCanvas>
    </div>
  );
}

/**
 * Example 6: Dynamic Model Loading
 * Switch between different models dynamically
 */
export function DynamicModelExample() {
  const [currentModel, setCurrentModel] = useState(
    'https://example.com/models/dish1.glb'
  );

  const models = [
    { url: 'https://example.com/models/dish1.glb', name: 'Burger' },
    { url: 'https://example.com/models/dish2.glb', name: 'Pizza' },
    { url: 'https://example.com/models/dish3.glb', name: 'Pasta' },
  ];

  return (
    <div className="relative w-full h-[500px]">
      <ARCanvas>
        <ARScene>
          <ModelLoader
            key={currentModel} // Force remount on model change
            modelUrl={currentModel}
            scale={1}
          />
        </ARScene>
      </ARCanvas>

      {/* Model selector */}
      <div className="absolute top-4 left-4 flex gap-2">
        {models.map((model) => (
          <button
            key={model.url}
            onClick={() => setCurrentModel(model.url)}
            className={`px-4 py-2 rounded ${
              currentModel === model.url
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {model.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Example 7: Model with Auto-Rotation
 * Automatically rotate the model for better viewing
 */
export function AutoRotateExample() {
  return (
    <div className="w-full h-[500px]">
      <ARCanvas>
        <ARScene autoRotate={true} autoRotateSpeed={2}>
          <ModelLoader
            modelUrl="https://example.com/models/dish.glb"
            scale={1}
          />
        </ARScene>
      </ARCanvas>
    </div>
  );
}

/**
 * Example 8: Model with Custom Lighting
 * Adjust lighting for better model presentation
 */
export function CustomLightingExample() {
  return (
    <div className="w-full h-[500px]">
      <ARCanvas backgroundColor="#1a1a2e">
        <ARScene
          ambientIntensity={0.3}
          mainLightIntensity={1.5}
          fillLightIntensity={0.5}
          enableShadows={true}
          shadowMapSize={2048}
        >
          <ModelLoader
            modelUrl="https://example.com/models/dish.glb"
            scale={1}
            castShadow={true}
            receiveShadow={true}
          />
        </ARScene>
      </ARCanvas>
    </div>
  );
}

/**
 * Example 9: Complete AR Viewer with Controls
 * Full-featured AR viewer with all options
 */
export function CompleteARViewerExample() {
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
            position={[0, 0, 0]}
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
