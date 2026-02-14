/**
 * Dish Viewer Integration Example
 * 
 * Shows how to integrate the AdaptiveViewer into a dish details page
 * with automatic fallback for unsupported devices.
 */

import { useState, Suspense } from 'react';
import { AdaptiveViewer } from './AdaptiveViewer';
import { ARCanvas } from './ARCanvas';
import { ARScene } from './ARScene';
import { ModelLoader } from './ModelLoader';
import { ARLoading } from './ARLoading';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Eye, Box } from 'lucide-react';
import type { Dish } from '@/utils/types';

interface DishViewerIntegrationProps {
  dish: Dish;
}

/**
 * Complete dish viewer integration with modal
 */
export function DishViewerIntegration({ dish }: DishViewerIntegrationProps) {
  const [showViewer, setShowViewer] = useState(false);

  // Prepare AR viewer component if model is available
  const arViewer = dish.modelUrl ? (
    <ARCanvas backgroundColor="#f8f8f8" enableFog={true}>
      <ARScene
        ambientIntensity={0.6}
        mainLightIntensity={1.2}
        autoRotate={false}
      >
        <Suspense fallback={<ARLoading />}>
          <ModelLoader
            modelUrl={dish.modelUrl}
            scale={2}
            position={[0, -1, 0]}
            loadingText={`Loading ${dish.name}...`}
            showProgress={true}
            enableRetry={true}
          />
        </Suspense>
      </ARScene>
    </ARCanvas>
  ) : undefined;

  // Prepare images array (use imageUrl as fallback if no additional images)
  const images = dish.imageUrl ? [dish.imageUrl] : [];

  // Don't show button if no model or images
  if (!dish.modelUrl && images.length === 0) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setShowViewer(true)}
        variant="outline"
        size="lg"
        className="w-full"
      >
        {dish.modelUrl ? (
          <>
            <Box className="w-5 h-5 mr-2" />
            View in 3D/AR
          </>
        ) : (
          <>
            <Eye className="w-5 h-5 mr-2" />
            View Images
          </>
        )}
      </Button>

      <Dialog open={showViewer} onOpenChange={setShowViewer}>
        <DialogContent className="max-w-4xl h-[80vh] p-0">
          <AdaptiveViewer
            dishName={dish.name}
            description={dish.description}
            modelUrl={dish.modelUrl}
            images={images}
            arViewerComponent={arViewer}
            onClose={() => setShowViewer(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Inline dish viewer (no modal)
 */
export function InlineDishViewer({ dish }: DishViewerIntegrationProps) {
  const arViewer = dish.modelUrl ? (
    <ARCanvas backgroundColor="#f8f8f8">
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

  const images = dish.imageUrl ? [dish.imageUrl] : [];

  if (!dish.modelUrl && images.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-muted rounded-lg">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border">
      <AdaptiveViewer
        dishName={dish.name}
        description={dish.description}
        modelUrl={dish.modelUrl}
        images={images}
        arViewerComponent={arViewer}
      />
    </div>
  );
}

/**
 * Compact dish viewer card
 */
export function CompactDishViewer({ dish }: DishViewerIntegrationProps) {
  const [showViewer, setShowViewer] = useState(false);

  const arViewer = dish.modelUrl ? (
    <ARCanvas>
      <ARScene>
        <Suspense fallback={<ARLoading />}>
          <ModelLoader modelUrl={dish.modelUrl} scale={2} />
        </Suspense>
      </ARScene>
    </ARCanvas>
  ) : undefined;

  const images = dish.imageUrl ? [dish.imageUrl] : [];

  return (
    <div className="relative group">
      {/* Thumbnail */}
      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
        {dish.imageUrl ? (
          <img
            src={dish.imageUrl}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Box className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Overlay button */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Button
          onClick={() => setShowViewer(true)}
          variant="secondary"
          size="sm"
        >
          {dish.modelUrl ? (
            <>
              <Box className="w-4 h-4 mr-2" />
              View 3D
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              View
            </>
          )}
        </Button>
      </div>

      {/* Full viewer modal */}
      <Dialog open={showViewer} onOpenChange={setShowViewer}>
        <DialogContent className="max-w-4xl h-[80vh] p-0">
          <AdaptiveViewer
            dishName={dish.name}
            description={dish.description}
            modelUrl={dish.modelUrl}
            images={images}
            arViewerComponent={arViewer}
            onClose={() => setShowViewer(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * Example dish details page
 */
export function DishDetailsPageExample() {
  const sampleDish: Dish = {
    id: '1',
    restaurantId: 'rest-1',
    name: 'Gourmet Burger',
    description: 'Premium beef burger with artisan bun and fresh toppings',
    price: 15.99,
    category: 'Main Course',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    modelUrl: 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/hamburger.glb',
    ingredients: ['Beef', 'Lettuce', 'Tomato', 'Cheese', 'Bun'],
    allergens: ['Gluten', 'Dairy'],
    isAvailable: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Image/3D Viewer */}
        <div>
          <InlineDishViewer dish={sampleDish} />
        </div>

        {/* Right: Details */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{sampleDish.name}</h1>
            <p className="text-2xl font-semibold text-primary mt-2">
              ${sampleDish.price}
            </p>
          </div>

          <p className="text-muted-foreground">{sampleDish.description}</p>

          <div>
            <h3 className="font-semibold mb-2">Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {sampleDish.ingredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="px-3 py-1 bg-muted rounded-full text-sm"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Allergens</h3>
            <div className="flex flex-wrap gap-2">
              {sampleDish.allergens.map((allergen) => (
                <span
                  key={allergen}
                  className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm"
                >
                  {allergen}
                </span>
              ))}
            </div>
          </div>

          <DishViewerIntegration dish={sampleDish} />
        </div>
      </div>
    </div>
  );
}
