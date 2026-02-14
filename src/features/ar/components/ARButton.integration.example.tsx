/**
 * ARButton Integration Example
 *
 * This example demonstrates how to integrate ARButton with DishCard
 * and create a complete AR viewing experience.
 */

import { useState } from 'react';
import { ARButton } from './ARButton';
import { ARCanvas } from './ARCanvas';
import { ARScene } from './ARScene';
import { ARLoading } from './ARLoading';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingCart, X } from 'lucide-react';
import { Suspense } from 'react';

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  modelUrl?: string;
  isAvailable: boolean;
}

const sampleDishes: Dish[] = [
  {
    id: '1',
    name: 'Mediterranean Salad',
    description: 'Fresh vegetables with feta cheese and olive oil',
    price: 12.99,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    modelUrl: 'https://example.com/models/salad.glb',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Grilled Salmon',
    description: 'Atlantic salmon with herbs and lemon',
    price: 24.99,
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    modelUrl: 'https://example.com/models/salmon.glb',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Classic Burger',
    description: 'Beef patty with cheese, lettuce, and tomato',
    price: 15.99,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    // No modelUrl - AR button won't show
    isAvailable: true,
  },
];

export const ARButtonIntegrationExample = () => {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [isARViewOpen, setIsARViewOpen] = useState(false);

  const handleARClick = (dish: Dish) => {
    setSelectedDish(dish);
    setIsARViewOpen(true);
  };

  const handleCloseAR = () => {
    setIsARViewOpen(false);
    setSelectedDish(null);
  };

  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold">ARButton Integration Example</h2>
        <p className="text-muted-foreground">
          Demonstrates ARButton integrated with dish cards and AR viewer dialog
        </p>
      </div>

      {/* Dish Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleDishes.map((dish) => (
          <Card key={dish.id} className="overflow-hidden">
            <div className="relative aspect-video overflow-hidden bg-muted">
              <img
                src={dish.imageUrl}
                alt={dish.name}
                className="h-full w-full object-cover"
              />
            </div>

            <CardContent className="p-4">
              <h3 className="text-lg font-semibold">{dish.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{dish.description}</p>
            </CardContent>

            <CardFooter className="flex items-center justify-between p-4 pt-0">
              <span className="text-xl font-bold">${dish.price.toFixed(2)}</span>
              <div className="flex gap-2">
                {/* AR Button - only shows if modelUrl exists */}
                <ARButton
                  modelUrl={dish.modelUrl}
                  onARClick={() => handleARClick(dish)}
                  size="sm"
                  variant="outline"
                  showText={false}
                />
                <Button size="sm" disabled={!dish.isAvailable}>
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* AR Viewer Dialog */}
      <Dialog open={isARViewOpen} onOpenChange={setIsARViewOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedDish?.name} - 3D View</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseAR}
                aria-label="Close AR viewer"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 h-full">
            {selectedDish?.modelUrl ? (
              <ARCanvas className="h-full w-full">
                <ARScene>
                  <Suspense fallback={<ARLoading />}>
                    {/* 3D model would be loaded here */}
                    <mesh>
                      <boxGeometry args={[1, 1, 1]} />
                      <meshStandardMaterial color="orange" />
                    </mesh>
                  </Suspense>
                </ARScene>
              </ARCanvas>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">No 3D model available</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Use mouse to rotate, scroll to zoom
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCloseAR}>
                Close
              </Button>
              <Button>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart - ${selectedDish?.price.toFixed(2)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Usage Notes */}
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Integration Notes</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • The AR button only appears on dishes that have a <code>modelUrl</code>
            </li>
            <li>
              • Clicking the AR button opens a dialog with the 3D viewer
            </li>
            <li>
              • The button uses <code>size="sm"</code> and <code>showText=false</code> for
              compact display
            </li>
            <li>
              • Event propagation is stopped to prevent card click handlers from firing
            </li>
            <li>
              • The AR viewer uses Suspense for progressive loading of 3D models
            </li>
            <li>
              • Users can interact with the 3D model using mouse/touch controls
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ARButtonIntegrationExample;
