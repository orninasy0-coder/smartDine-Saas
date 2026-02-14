/**
 * AdaptiveViewer Examples
 * Demonstrates automatic device detection and fallback behavior
 */

import { Suspense } from 'react';
import { AdaptiveViewer } from './AdaptiveViewer';
import { ARCanvas } from './ARCanvas';
import { ARScene } from './ARScene';
import { ModelLoader } from './ModelLoader';
import { ARLoading } from './ARLoading';

// Sample data
const sampleImages = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
];

const sampleModelUrl = 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/hamburger.glb';

/**
 * Basic adaptive viewer - automatically detects device support
 */
export function BasicAdaptiveViewerExample() {
  const arViewer = (
    <ARCanvas>
      <ARScene>
        <Suspense fallback={<ARLoading />}>
          <ModelLoader
            modelUrl={sampleModelUrl}
            scale={2}
            position={[0, -1, 0]}
          />
        </Suspense>
      </ARScene>
    </ARCanvas>
  );

  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden">
      <AdaptiveViewer
        dishName="Gourmet Burger"
        description="Premium beef burger with artisan bun and fresh toppings"
        modelUrl={sampleModelUrl}
        images={sampleImages}
        arViewerComponent={arViewer}
      />
    </div>
  );
}

/**
 * Force fallback mode (for testing)
 */
export function ForcedFallbackExample() {
  const arViewer = (
    <ARCanvas>
      <ARScene>
        <Suspense fallback={<ARLoading />}>
          <ModelLoader
            modelUrl={sampleModelUrl}
            scale={2}
            position={[0, -1, 0]}
          />
        </Suspense>
      </ARScene>
    </ARCanvas>
  );

  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden">
      <AdaptiveViewer
        dishName="Delicious Pizza"
        description="A mouth-watering pizza with fresh ingredients"
        modelUrl={sampleModelUrl}
        images={sampleImages}
        arViewerComponent={arViewer}
        forceFallback={true}
      />
    </div>
  );
}

/**
 * Without model URL - always shows fallback
 */
export function NoModelUrlExample() {
  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden">
      <AdaptiveViewer
        dishName="Caesar Salad"
        description="Fresh romaine lettuce with Caesar dressing"
        images={sampleImages}
      />
    </div>
  );
}

/**
 * Without support message
 */
export function NoSupportMessageExample() {
  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden">
      <AdaptiveViewer
        dishName="Pasta Carbonara"
        description="Classic Italian pasta with creamy sauce"
        images={sampleImages}
        showSupportMessage={false}
        forceFallback={true}
      />
    </div>
  );
}

/**
 * With close handler
 */
export function WithCloseHandlerExample() {
  const handleClose = () => {
    console.log('Viewer closed');
    alert('Viewer closed!');
  };

  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden">
      <AdaptiveViewer
        dishName="Grilled Salmon"
        description="Fresh Atlantic salmon with herbs"
        images={sampleImages}
        onClose={handleClose}
        forceFallback={true}
      />
    </div>
  );
}

/**
 * Error state - no images or model
 */
export function ErrorStateExample() {
  return (
    <div className="w-full h-[600px] border rounded-lg overflow-hidden">
      <AdaptiveViewer
        dishName="Mystery Dish"
        description="This dish has no images"
        images={[]}
        forceFallback={true}
      />
    </div>
  );
}

/**
 * Full-screen adaptive viewer
 */
export function FullScreenAdaptiveExample() {
  const arViewer = (
    <ARCanvas>
      <ARScene>
        <Suspense fallback={<ARLoading />}>
          <ModelLoader
            modelUrl={sampleModelUrl}
            scale={2}
            position={[0, -1, 0]}
          />
        </Suspense>
      </ARScene>
    </ARCanvas>
  );

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <AdaptiveViewer
        dishName="Steak Dinner"
        description="Premium ribeye steak cooked to perfection"
        modelUrl={sampleModelUrl}
        images={sampleImages}
        arViewerComponent={arViewer}
        onClose={() => console.log('Close full screen')}
      />
    </div>
  );
}

/**
 * Showcase all examples
 */
export function AdaptiveViewerShowcase() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Adaptive Viewer Examples</h2>
        <p className="text-muted-foreground mb-8">
          Automatically detects device capabilities and shows 3D viewer or image gallery
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold mb-4">
            Basic Adaptive Viewer (Auto-detect)
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Will show 3D viewer on supported devices, fallback gallery on unsupported devices
          </p>
          <BasicAdaptiveViewerExample />
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4">
            Forced Fallback Mode
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Always shows image gallery (useful for testing)
          </p>
          <ForcedFallbackExample />
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4">
            No Model URL
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            When no 3D model is available, automatically shows image gallery
          </p>
          <NoModelUrlExample />
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4">
            Error State
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Shows error message when no images or model are available
          </p>
          <ErrorStateExample />
        </section>
      </div>
    </div>
  );
}
