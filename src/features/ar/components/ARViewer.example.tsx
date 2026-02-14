import { ARCanvas } from './ARCanvas';
import { ARScene } from './ARScene';
import { ARLoading } from './ARLoading';
import { Suspense } from 'react';

/**
 * Example component demonstrating basic AR setup
 * Shows a simple cube with configured lighting and camera controls
 */
function SimpleCube() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export function ARViewerExample() {
  return (
    <div className="w-full h-[500px] bg-background rounded-lg overflow-hidden">
      <ARCanvas>
        <ARScene>
          <Suspense fallback={<ARLoading />}>
            <SimpleCube />
          </Suspense>
        </ARScene>
      </ARCanvas>
    </div>
  );
}
