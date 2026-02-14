/**
 * Graceful Degradation Example
 * 
 * Demonstrates how the AR system gracefully degrades based on device capabilities:
 * - Full 3D AR viewer for supported devices
 * - Fallback image gallery for unsupported devices
 * - Clear messaging about device support
 */

import { useState } from 'react';
import { AdaptiveViewer } from './AdaptiveViewer';
import { ARSupportIndicator } from './ARSupportIndicator';
import { ARCanvas } from './ARCanvas';
import { ARScene } from './ARScene';
import { Model3D } from './Model3D';
import { ARControls } from './ARControls';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function GracefulDegradationExample() {
  const [showViewer, setShowViewer] = useState(false);

  // Sample dish data
  const dish = {
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with herbs and lemon',
    modelUrl: '/models/salmon.glb',
    images: [
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
      'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=800',
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
    ],
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold mb-2">Graceful Degradation Demo</h2>
        <p className="text-muted-foreground">
          This example shows how the AR system adapts to different device capabilities
        </p>
      </div>

      {/* Device Support Status */}
      <section>
        <h3 className="text-xl font-semibold mb-3">Your Device Status</h3>
        <ARSupportIndicator showDetails />
      </section>

      {/* Adaptive Viewer Demo */}
      <section>
        <h3 className="text-xl font-semibold mb-3">Adaptive Viewer</h3>
        <Card className="p-6">
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">{dish.name}</h4>
            <p className="text-sm text-muted-foreground mb-4">{dish.description}</p>
            <Button onClick={() => setShowViewer(!showViewer)}>
              {showViewer ? 'Hide Viewer' : 'View Dish'}
            </Button>
          </div>

          {showViewer && (
            <div className="border border-border rounded-lg overflow-hidden">
              <AdaptiveViewer
                dishName={dish.name}
                description={dish.description}
                modelUrl={dish.modelUrl}
                images={dish.images}
                showSupportMessage
                arViewerComponent={
                  <ARCanvas className="h-[500px]">
                    <ARScene>
                      <Model3D url={dish.modelUrl} />
                      <ARControls />
                    </ARScene>
                  </ARCanvas>
                }
                onClose={() => setShowViewer(false)}
              />
            </div>
          )}
        </Card>
      </section>

      {/* Explanation */}
      <section>
        <h3 className="text-xl font-semibold mb-3">How It Works</h3>
        <Card className="p-6">
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">1. Device Detection</h4>
              <p className="text-muted-foreground">
                The system automatically detects your device's WebGL capabilities when the page loads.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2. Adaptive Rendering</h4>
              <p className="text-muted-foreground">
                Based on the detection results:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-4">
                <li>Devices with WebGL support see interactive 3D models</li>
                <li>Devices without WebGL support see high-quality image galleries</li>
                <li>Users are informed about their device's capabilities</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">3. Graceful Degradation</h4>
              <p className="text-muted-foreground">
                The experience degrades gracefully - users on unsupported devices still get a great
                experience with beautiful images, just without the 3D interactivity.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">4. User Communication</h4>
              <p className="text-muted-foreground">
                Clear messages explain why certain features are or aren't available, preventing
                user confusion and frustration.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Testing Different Scenarios */}
      <section>
        <h3 className="text-xl font-semibold mb-3">Testing Scenarios</h3>
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Force Fallback Mode</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Test the fallback gallery even on supported devices:
              </p>
              <AdaptiveViewer
                dishName={dish.name}
                description={dish.description}
                modelUrl={dish.modelUrl}
                images={dish.images}
                forceFallback
                showSupportMessage
                className="border border-border rounded-lg overflow-hidden"
              />
            </div>
          </div>
        </Card>
      </section>

      {/* Best Practices */}
      <section>
        <h3 className="text-xl font-semibold mb-3">Best Practices</h3>
        <Card className="p-6">
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <div>
                <strong>Always provide fallback content:</strong> Never assume all users have
                WebGL support
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <div>
                <strong>Communicate clearly:</strong> Let users know why they're seeing a
                particular experience
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <div>
                <strong>Make fallbacks great:</strong> The fallback experience should still be
                high-quality and useful
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <div>
                <strong>Test on real devices:</strong> Emulators may not accurately represent
                WebGL capabilities
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">✓</span>
              <div>
                <strong>Monitor capabilities:</strong> Track which devices your users have to
                inform future decisions
              </div>
            </li>
          </ul>
        </Card>
      </section>
    </div>
  );
}

export default GracefulDegradationExample;
